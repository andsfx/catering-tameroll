/**
 * Batch Catering Menu Web App
 *
 * Required sheets:
 * 1. Monthly sheets: Januari, Februari, Maret, April, ...
 *    Headers:
 *    date | dayName | mainCourse | sideDish | extra | imageUrl | isAvailable | label
 *
 * 2. Holidays
 *    Headers:
 *    date | name | type
 *
 * 3. BatchConfig
 *    Headers:
 *    key | value
 *
 * Suggested BatchConfig rows:
 * batchStatus | open
 * currentBatchLabel | Batch April 2026
 * deadlineJoin | 2026-04-05
 * remainingQuota | 12
 * nextBatchOpen | 2026-04-30
 * nextBatchLabel | Batch Mei dibuka 30 April pukul 10.00 WIB
 */

function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var startDate = resolveStartDate(params.start);
    var count = resolveCount(params.count, 20);
    var debugSheet = safeString(params.sheet);

    if (debugSheet) {
      return jsonOutput(buildSingleSheetResponse(debugSheet, startDate, count));
    }

    var holidayMap = getHolidayMap();
    var collected = collectWorkingDates(startDate, count, holidayMap);
    var workingDates = collected.dates;
    var excludedDates = collected.excludedDates;

    var sheetNames = getRequiredMonthSheets(workingDates);
    var indexedRows = getIndexedRowsFromSheets(sheetNames);
    var batchConfig = getBatchConfigMap();

    var data = workingDates.map(function(dateObj) {
      var dateKey = formatDateKey(dateObj);
      var row = indexedRows[dateKey];

      if (row) {
        return normalizeMenuRow(row, dateObj);
      }

      return buildFallbackRow(dateObj);
    });

    return jsonOutput({
      success: true,
      message: 'OK',
      meta: {
        start: formatDateKey(startDate),
        countRequested: count,
        countReturned: data.length,
        sheetsUsed: sheetNames,
        excludedDates: excludedDates,
        batchStatus: normalizeBatchStatusValue(batchConfig.batchStatus),
        currentBatchLabel: safeString(batchConfig.currentBatchLabel),
        deadlineJoin: asNullableDateString(batchConfig.deadlineJoin),
        remainingQuota: asNullableNumber(batchConfig.remainingQuota),
        nextBatchOpen: asNullableDateString(batchConfig.nextBatchOpen),
        nextBatchLabel: safeString(batchConfig.nextBatchLabel),
      },
      data: data,
    });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message,
      data: [],
    });
  }
}

function buildSingleSheetResponse(sheetName, startDate, count) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    return {
      success: false,
      message: 'Sheet "' + sheetName + '" tidak ditemukan.',
      data: [],
    };
  }

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return {
      success: true,
      message: 'Belum ada data menu.',
      meta: {
        sheet: sheetName,
        start: formatDateKey(startDate),
        countRequested: count,
        countReturned: 0,
      },
      data: [],
    };
  }

  var headers = values[0].map(function(header) {
    return safeString(header);
  });

  var rows = values.slice(1);
  var startKey = formatDateKey(startDate);

  var data = rows
    .filter(function(row) {
      return row.some(function(cell) {
        return safeString(cell) !== '';
      });
    })
    .map(function(row) {
      return rowToObject(headers, row);
    })
    .map(function(item) {
      return normalizeMenuRow(item);
    })
    .filter(function(item) {
      return item.date && item.date >= startKey;
    })
    .sort(function(a, b) {
      return a.date.localeCompare(b.date);
    })
    .slice(0, count);

  return {
    success: true,
    message: 'OK',
    meta: {
      sheet: sheetName,
      start: startKey,
      countRequested: count,
      countReturned: data.length,
    },
    data: data,
  };
}

function collectWorkingDates(startDate, count, holidayMap) {
  var dates = [];
  var excludedDates = [];
  var cursor = cloneDate(startDate);

  while (dates.length < count) {
    var dateKey = formatDateKey(cursor);

    if (isWeekend(cursor)) {
      excludedDates.push({
        date: dateKey,
        reason: 'weekend',
      });
      cursor = addDays(cursor, 1);
      continue;
    }

    if (holidayMap[dateKey]) {
      excludedDates.push({
        date: dateKey,
        reason: 'holiday',
        name: holidayMap[dateKey].name,
        type: holidayMap[dateKey].type,
      });
      cursor = addDays(cursor, 1);
      continue;
    }

    dates.push(cloneDate(cursor));
    cursor = addDays(cursor, 1);
  }

  return {
    dates: dates,
    excludedDates: excludedDates,
  };
}

function getHolidayMap() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Holidays');
  if (!sheet) return {};

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return {};

  var headers = values[0].map(function(header) {
    return safeString(header);
  });

  var rows = values.slice(1);
  var map = {};

  rows.forEach(function(row) {
    if (!row.some(function(cell) { return safeString(cell) !== ''; })) {
      return;
    }

    var item = rowToObject(headers, row);
    var dateKey = formatDateValue(item.date);

    if (!dateKey) return;

    map[dateKey] = {
      name: safeString(item.name),
      type: safeString(item.type),
    };
  });

  return map;
}

function getBatchConfigMap() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BatchConfig');
  if (!sheet) return {};

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return {};

  var headers = values[0].map(function(header) {
    return safeString(header).toLowerCase();
  });
  var rows = values.slice(1);
  var config = {};

  rows.forEach(function(row) {
    if (!row.some(function(cell) { return safeString(cell) !== ''; })) {
      return;
    }

    var item = rowToObject(headers, row);
    var key = safeString(item.key);
    if (!key) return;

    config[key] = item.value;
  });

  return config;
}

function getRequiredMonthSheets(dates) {
  var seen = {};
  var result = [];

  dates.forEach(function(dateObj) {
    var name = getMonthSheetName(dateObj);
    if (!seen[name]) {
      seen[name] = true;
      result.push(name);
    }
  });

  return result;
}

function getIndexedRowsFromSheets(sheetNames) {
  var indexedRows = {};

  sheetNames.forEach(function(sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) return;

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return;

    var headers = values[0].map(function(header) {
      return safeString(header);
    });

    var rows = values.slice(1);

    rows.forEach(function(row) {
      if (!row.some(function(cell) { return safeString(cell) !== ''; })) {
        return;
      }

      var item = rowToObject(headers, row);
      var dateKey = formatDateValue(item.date);

      if (!dateKey) return;

      indexedRows[dateKey] = item;
    });
  });

  return indexedRows;
}

function normalizeMenuRow(item, fallbackDateObj) {
  var dateValue = formatDateValue(item.date);
  var dateObj = fallbackDateObj || parseDateKey(dateValue);

  return {
    date: dateValue,
    dayName: safeString(item.dayName) || getIndonesianDayName(dateObj),
    mainCourse: safeString(item.mainCourse),
    sideDish: safeString(item.sideDish),
    extra: safeString(item.extra),
    imageUrl: safeString(item.imageUrl),
    isAvailable: toBoolean(item.isAvailable),
    label: safeString(item.label),
  };
}

function buildFallbackRow(dateObj) {
  return {
    date: formatDateKey(dateObj),
    dayName: getIndonesianDayName(dateObj),
    mainCourse: '',
    sideDish: '',
    extra: '',
    imageUrl: '',
    isAvailable: false,
    label: '',
  };
}

function getMonthSheetName(dateObj) {
  var monthNames = [
    'Januari', 'Februari', 'Maret', 'April',
    'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember',
  ];

  return monthNames[dateObj.getMonth()];
}

function getIndonesianDayName(dateObj) {
  var dayNames = [
    'Minggu', 'Senin', 'Selasa', 'Rabu',
    'Kamis', 'Jumat', 'Sabtu',
  ];

  return dayNames[dateObj.getDay()];
}

function isWeekend(dateObj) {
  var day = dateObj.getDay();
  return day === 0 || day === 6;
}

function resolveStartDate(startParam) {
  if (safeString(startParam)) {
    var parsed = parseDateKey(startParam);
    if (parsed) return parsed;
  }

  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function resolveCount(countParam, fallbackCount) {
  var count = parseInt(countParam, 10);
  if (isNaN(count) || count <= 0) return fallbackCount;
  return count;
}

function parseDateKey(value) {
  var str = safeString(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;

  var parts = str.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDateValue(value) {
  if (!value) return '';

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  var str = safeString(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  var parsed = new Date(str);
  if (!isNaN(parsed)) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return '';
}

function asNullableDateString(value) {
  return formatDateValue(value) || null;
}

function normalizeBatchStatusValue(value) {
  var status = safeString(value).toLowerCase();
  if (status === 'running' || status === 'closed') return status;
  return 'open';
}

function formatDateKey(dateObj) {
  return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function addDays(dateObj, amount) {
  var next = cloneDate(dateObj);
  next.setDate(next.getDate() + amount);
  return next;
}

function cloneDate(dateObj) {
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

function rowToObject(headers, row) {
  var obj = {};
  headers.forEach(function(header, index) {
    obj[header] = row[index];
  });
  return obj;
}

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;

  var normalized = safeString(value).toLowerCase();
  return (
    normalized === 'true' ||
    normalized === 'yes' ||
    normalized === 'ya' ||
    normalized === '1'
  );
}

function asNullableNumber(value) {
  if (typeof value === 'number' && isFinite(value)) return value;

  if (typeof value === 'string') {
    var parsed = Number(value);
    return isFinite(parsed) ? parsed : null;
  }

  return null;
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
