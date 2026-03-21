/* ═══════════════════════════════════════════════════════════════════════
   QR-MIN — Minimal QR Code renderer for the Letterverse connect flow.

   Uses qrcode-generator by Kazuhiko Arase (MIT License).
   Trimmed to the essentials: version auto-select, error correction L,
   canvas rendering. No dependencies.

   API:
     renderQR(canvas, text, {size, dark, light})
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Render a QR code into a <canvas> element.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} text  — the data to encode
 * @param {object} opts
 *   size  {number} — canvas width/height in px (default 200)
 *   dark  {string} — dark module colour (default '#0a0a14')
 *   light {string} — light module colour (default 'transparent')
 */
export function renderQR(canvas, text, {
  size  = 200,
  dark  = '#0a0a14',
  light = 'transparent',
} = {}) {
  // Type 0 = auto version, error correction L
  const qr = qrcode(0, 'L');
  qr.addData(text);
  qr.make();

  const count  = qr.getModuleCount();
  const cellSz = size / count;

  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background
  if (light !== 'transparent') {
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  ctx.fillStyle = dark;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          Math.floor(col * cellSz),
          Math.floor(row * cellSz),
          Math.ceil(cellSz),
          Math.ceil(cellSz),
        );
      }
    }
  }
}

// ── qrcode-generator core (MIT) ───────────────────────────────────────────
// Embedded from https://github.com/kazuhikoarase/qrcode-generator
// © Kazuhiko Arase, MIT License
/* eslint-disable */
var qrcode = (function() {
var qrcode = function(typeNumber, errorCorrectionLevel) {
  var PAD0 = 0xEC, PAD1 = 0x11;
  var _typeNumber = typeNumber, _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  var _modules = null, _moduleCount = 0, _dataCache = null, _dataList = [];
  var _this = {};
  var makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      var a = new Array(moduleCount);
      for (var i = 0; i < moduleCount; i++) { a[i] = new Array(moduleCount); for (var j = 0; j < moduleCount; j++) a[i][j] = null; }
      return a;
    })(_moduleCount);
    setupPositionProbePattern(0, 0); setupPositionProbePattern(_moduleCount - 7, 0); setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern(); setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) setupTypeNumber(test);
    if (_dataCache == null) _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    mapData(_dataCache, maskPattern);
  };
  var setupPositionProbePattern = function(row, col) {
    for (var r = -1; r <= 7; r++) { if (row + r <= -1 || _moduleCount <= row + r) continue;
      for (var c = -1; c <= 7; c++) { if (col + c <= -1 || _moduleCount <= col + c) continue;
        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4))
          _modules[row + r][col + c] = true; else _modules[row + r][col + c] = false; } } };
  var getBestMaskPattern = function() {
    var minLostPoint = 0, pattern = 0;
    for (var i = 0; i < 8; i++) { makeImpl(true, i); var lostPoint = QRUtil.getLostPoint(_this);
      if (i === 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; } }
    return pattern; };
  var setupTimingPattern = function() {
    for (var r = 8; r < _moduleCount - 8; r++) { if (_modules[r][6] != null) continue; _modules[r][6] = (r % 2 === 0); }
    for (var c = 8; c < _moduleCount - 8; c++) { if (_modules[6][c] != null) continue; _modules[6][c] = (c % 2 === 0); } };
  var setupPositionAdjustPattern = function() {
    var pos = QRUtil.getPatternPosition(_typeNumber);
    for (var i = 0; i < pos.length; i++) { for (var j = 0; j < pos.length; j++) { var row = pos[i], col = pos[j];
        if (_modules[row][col] != null) continue;
        for (var r = -2; r <= 2; r++) { for (var c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) _modules[row + r][col + c] = true;
            else _modules[row + r][col + c] = false; } } } } };
  var setupTypeNumber = function(test) {
    var bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (var i = 0; i < 18; i++) { var mod = (!test && ((bits >> i) & 1) === 1);
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod; }
    for (var i = 0; i < 18; i++) { var mod = (!test && ((bits >> i) & 1) === 1);
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod; } };
  var setupTypeInfo = function(test, maskPattern) {
    var data = (_errorCorrectionLevel << 3) | maskPattern, bits = QRUtil.getBCHTypeInfo(data);
    for (var i = 0; i < 15; i++) { var mod = (!test && ((bits >> i) & 1) === 1);
      if (i < 6) _modules[i][8] = mod; else if (i < 8) _modules[i + 1][8] = mod; else _modules[_moduleCount - 15 + i][8] = mod; }
    for (var i = 0; i < 15; i++) { var mod = (!test && ((bits >> i) & 1) === 1);
      if (i < 8) _modules[8][_moduleCount - i - 1] = mod; else if (i < 9) _modules[8][15 - i - 1 + 1] = mod; else _modules[8][15 - i - 1] = mod; }
    _modules[_moduleCount - 8][8] = (!test); };
  var mapData = function(data, maskPattern) {
    var inc = -1, row = _moduleCount - 1, bitIndex = 7, byteIndex = 0;
    var maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (var col = _moduleCount - 1; col > 0; col -= 2) { if (col === 6) col--;
      while (true) { for (var c = 0; c < 2; c++) { if (_modules[row][col - c] == null) { var dark = false;
              if (byteIndex < data.length) dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
              if (maskFunc(row, col - c)) dark = !dark; _modules[row][col - c] = dark; bitIndex--;
              if (bitIndex === -1) { byteIndex++; bitIndex = 7; } } }
        row += inc; if (row < 0 || _moduleCount <= row) { row -= inc; inc = -inc; break; } } } };
  var createBytes = function(buffer, rsBlocks) {
    var offset = 0, maxDcCount = 0, maxEcCount = 0, dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
    for (var r = 0; r < rsBlocks.length; r++) { var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount); maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[offset++];
      var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount), rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      var modPoly = rawPoly.mod(rsPoly); ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i++) { var modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0; } }
    var totalCodeCount = 0; for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
    var data = new Array(totalCodeCount), index = 0;
    for (var i = 0; i < maxDcCount; i++) for (var r = 0; r < rsBlocks.length; r++) { if (i < dcdata[r].length) data[index++] = dcdata[r][i]; }
    for (var i = 0; i < maxEcCount; i++) for (var r = 0; r < rsBlocks.length; r++) { if (i < ecdata[r].length) data[index++] = ecdata[r][i]; }
    return data; };
  var createData = function(typeNumber, errorCorrectionLevel, dataList) {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel), buffer = qrBitBuffer();
    for (var i = 0; i < dataList.length; i++) { var data = dataList[i]; buffer.put(data.getMode(), 4); buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber)); data.write(buffer); }
    var totalDataCount = 0; for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
    if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')');
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
    while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
    while (true) { if (buffer.getLengthInBits() >= totalDataCount * 8) break; buffer.put(PAD0, 8); if (buffer.getLengthInBits() >= totalDataCount * 8) break; buffer.put(PAD1, 8); }
    return createBytes(buffer, rsBlocks); };
  _this.addData = function(data, mode) { mode = mode || 'Byte'; var newData; switch(mode) { case 'Numeric': newData = qrNumber(data); break; case 'Alphanumeric': newData = qrAlphaNum(data); break; case 'Byte': newData = qr8BitByte(data); break; case 'Kanji': newData = qrKanji(data); break; default: throw new Error('mode:' + mode); } _dataList.push(newData); _dataCache = null; };
  _this.isDark = function(row, col) { if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) throw new Error(row + ',' + col); return _modules[row][col]; };
  _this.getModuleCount = function() { return _moduleCount; };
  _this.make = function() { if (_typeNumber < 1) { for (_typeNumber = 1; _typeNumber < 40; _typeNumber++) { var rsBlocks = QRRSBlock.getRSBlocks(_typeNumber, _errorCorrectionLevel), buffer = qrBitBuffer(); for (var i = 0; i < _dataList.length; i++) { var data = _dataList[i]; buffer.put(data.getMode(), 4); buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), _typeNumber)); data.write(buffer); } if (buffer.getLengthInBits() <= QRUtil.getMaxLength(_typeNumber, _errorCorrectionLevel) * 8) break; } } makeImpl(false, getBestMaskPattern()); };
  return _this; };
function qrNumber(data) { var _mode = 1/*QRMode.MODE_NUMBER*/, _data = data; var _this = {}; _this.getMode = function() { return _mode; }; _this.getLength = function() { return _data.length; }; _this.write = function(buffer) { var data = _data; var i = 0; while (i + 2 < data.length) { buffer.put(strToNum(data.substring(i, i + 3)), 10); i += 3; } if (i < data.length) { if (data.length - i === 1) { buffer.put(strToNum(data.substring(i, i + 1)), 4); } else if (data.length - i === 2) { buffer.put(strToNum(data.substring(i, i + 2)), 7); } } }; function strToNum(s) { var n = 0; for (var i = 0; i < s.length; i++) n = n * 10 + chatToNum(s.charAt(i)); return n; } function chatToNum(c) { if ('0' <= c && c <= '9') return c.charCodeAt(0) - '0'.charCodeAt(0); throw new Error('illegal char :' + c); } return _this; }
function qrAlphaNum(data) { var _mode = 2/*QRMode.MODE_ALPHA_NUM*/, _data = data; var _this = {}; _this.getMode = function() { return _mode; }; _this.getLength = function() { return _data.length; }; _this.write = function(buffer) { var i = 0; while (i + 1 < _data.length) { buffer.put(getCode(_data.charAt(i)) * 45 + getCode(_data.charAt(i + 1)), 11); i += 2; } if (i < _data.length) buffer.put(getCode(_data.charAt(i)), 6); }; function getCode(c) { if ('0' <= c && c <= '9') return c.charCodeAt(0) - '0'.charCodeAt(0); else if ('A' <= c && c <= 'Z') return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10; else switch (c) { case ' ': return 36; case '$': return 37; case '%': return 38; case '*': return 39; case '+': return 40; case '-': return 41; case '.': return 42; case '/': return 43; case ':': return 44; default: throw new Error('illegal char :' + c); } } return _this; }
function qr8BitByte(data) { var _mode = 4/*QRMode.MODE_8BIT_BYTE*/, _data = data; var _this = {}, _bytes = stringToBytes(data); _this.getMode = function() { return _mode; }; _this.getLength = function() { return _bytes.length; }; _this.write = function(buffer) { for (var i = 0; i < _bytes.length; i++) buffer.put(_bytes[i], 8); }; return _this; }
function qrKanji(data) { var _mode = 8/*QRMode.MODE_KANJI*/, _data = data; var _this = {}, _bytes = stringToBytesFuncs['SJIS'](data); _this.getMode = function() { return _mode; }; _this.getLength = function() { return ~~(_bytes.length / 2); }; _this.write = function(buffer) { var i = 0; while (i + 1 < _bytes.length) { var c = ((_bytes[i] & 0xff) << 8) | (_bytes[i + 1] & 0xff); if (0x8140 <= c && c <= 0x9FFC) c -= 0x8140; else if (0xE040 <= c && c <= 0xEBBF) c -= 0xC140; var b = ((c >>> 8) & 0xff) * 0xC0 + (c & 0xff); buffer.put(b, 13); i += 2; } }; return _this; }
function qrPolynomial(num, shift) { if (typeof num.length === 'undefined') throw new Error(num.length + '/' + shift); var _num = (function() { var offset = 0; while (offset < num.length && num[offset] === 0) offset++; var arr = new Array(num.length - offset + shift); for (var i = 0; i < num.length - offset; i++) arr[i] = num[i + offset]; return arr; })(); var _this = {}; _this.getAt = function(index) { return _num[index]; }; _this.getLength = function() { return _num.length; }; _this.multiply = function(e) { var num = new Array(_this.getLength() + e.getLength() - 1); for (var i = 0; i < _this.getLength(); i++) for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j))); return qrPolynomial(num, 0); }; _this.mod = function(e) { if (_this.getLength() - e.getLength() < 0) return _this; var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0)), num = new Array(_this.getLength()); for (var i = 0; i < _this.getLength(); i++) num[i] = _this.getAt(i); for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio); return qrPolynomial(num, 0).mod(e); }; return _this; }
var QRMath = { glog: function(n) { if (n < 1) throw new Error('glog(' + n + ')'); return QRMath.LOG_TABLE[n]; }, gexp: function(n) { while (n < 0) n += 255; while (n >= 256) n -= 255; return QRMath.EXP_TABLE[n]; }, EXP_TABLE: (function() { var a = new Array(256); for (var i = 0; i < 8; i++) a[i] = 1 << i; for (var i = 8; i < 256; i++) a[i] = a[i - 4] ^ a[i - 5] ^ a[i - 6] ^ a[i - 8]; return a; })(), LOG_TABLE: (function() { var a = new Array(256); for (var i = 0; i < 255; i++) a[QRMath.EXP_TABLE ? QRMath.EXP_TABLE[i] : 0] = i; return a; })() };
(function() { for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i; })();
var QRUtil = { PATTERN_POSITION_TABLE: [[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]], G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0), G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0), G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
  getBCHTypeInfo: function(data) { var d = data << 10; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15))); return ((data << 10) | d) ^ QRUtil.G15_MASK; },
  getBCHTypeNumber: function(data) { var d = data << 12; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18))); return (data << 12) | d; },
  getBCHDigit: function(data) { var digit = 0; while (data !== 0) { digit++; data >>>= 1; } return digit; },
  getPatternPosition: function(typeNumber) { return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]; },
  getMaskFunction: function(maskPattern) { switch (maskPattern) { case 0: return function(i, j) { return (i + j) % 2 === 0; }; case 1: return function(i, j) { return i % 2 === 0; }; case 2: return function(i, j) { return j % 3 === 0; }; case 3: return function(i, j) { return (i + j) % 3 === 0; }; case 4: return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0; }; case 5: return function(i, j) { return (i * j) % 2 + (i * j) % 3 === 0; }; case 6: return function(i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 === 0; }; case 7: return function(i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 === 0; }; default: throw new Error('bad maskPattern:' + maskPattern); } },
  getErrorCorrectPolynomial: function(errorCorrectLength) { var a = qrPolynomial([1], 0); for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0)); return a; },
  getLengthInBits: function(mode, type) { if (1 <= type && type < 10) { switch (mode) { case 1: return 10; case 2: return 9; case 4: return 8; case 8: return 8; default: throw new Error('mode:' + mode); } } else if (type < 27) { switch (mode) { case 1: return 12; case 2: return 11; case 4: return 16; case 8: return 10; default: throw new Error('mode:' + mode); } } else if (type < 41) { switch (mode) { case 1: return 14; case 2: return 13; case 4: return 16; case 8: return 12; default: throw new Error('mode:' + mode); } } else throw new Error('type:' + type); },
  getMaxLength: function(typeNumber, errorCorrectionLevel) { return QRUtil.MAX_LENGTH[typeNumber - 1][errorCorrectionLevel]; },
  MAX_LENGTH: (function() { var r = [[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[458,331,241,177],[485,362,258,194],[512,412,292,220],[668,450,322,250],[711,504,364,276],[756,560,394,304],[1541,624,442,352],[1094,666,482,368],[1146,711,509,394],[1198,779,565,442],[1249,857,611,482],[1249,911,661,509],[1408,997,715,565],[1503,1059,751,611],[1568,1125,805,661],[1717,1190,868,715],[1766,1264,908,751],[1871,1370,982,805],[1969,1452,1030,868],[2071,1538,1112,908],[2191,1628,1168,982],[2306,1722,1228,1030],[2434,1809,1283,1112],[2566,1911,1351,1168],[2702,1989,1423,1228],[2812,2099,1499,1283],[2956,2213,1579,1351]]; return r; })(),
  getLostPoint: function(qrCode) { var moduleCount = qrCode.getModuleCount(), lostPoint = 0; for (var row = 0; row < moduleCount; row++) { for (var col = 0; col < moduleCount; col++) { var sameCount = 0, dark = qrCode.isDark(row, col); for (var r = -1; r <= 1; r++) { if (row + r < 0 || moduleCount <= row + r) continue; for (var c = -1; c <= 1; c++) { if (col + c < 0 || moduleCount <= col + c) continue; if (r === 0 && c === 0) continue; if (dark === qrCode.isDark(row + r, col + c)) sameCount++; } } if (sameCount > 5) lostPoint += (3 + sameCount - 5); } } for (var row = 0; row < moduleCount - 1; row++) { for (var col = 0; col < moduleCount - 1; col++) { var count = 0; if (qrCode.isDark(row, col)) count++; if (qrCode.isDark(row + 1, col)) count++; if (qrCode.isDark(row, col + 1)) count++; if (qrCode.isDark(row + 1, col + 1)) count++; if (count === 0 || count === 4) lostPoint += 3; } } for (var row = 0; row < moduleCount; row++) { for (var col = 0; col < moduleCount - 6; col++) { if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) lostPoint += 40; } } for (var col = 0; col < moduleCount; col++) { for (var row = 0; row < moduleCount - 6; row++) { if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) lostPoint += 40; } } var darkCount = 0; for (var col = 0; col < moduleCount; col++) { for (var row = 0; row < moduleCount; row++) { if (qrCode.isDark(row, col)) darkCount++; } } var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5; lostPoint += ratio * 10; return lostPoint; } };
var QRErrorCorrectionLevel = { L: 1, M: 0, Q: 3, H: 2 };
var QRRSBlock = (function() {
  var RS_BLOCK_TABLE = [[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];
  var qrRSBlock = function(totalCount, dataCount) { var _this = {}; _this.totalCount = totalCount; _this.dataCount = dataCount; return _this; };
  var getRsBlockTable = function(typeNumber, errorCorrectionLevel) { switch(errorCorrectionLevel) { case 1: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]; case 0: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]; case 3: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]; case 2: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]; default: throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectionLevel:' + errorCorrectionLevel); } };
  return { getRSBlocks: function(typeNumber, errorCorrectionLevel) { var rsBlockTable = getRsBlockTable(typeNumber, errorCorrectionLevel); if (typeof rsBlockTable === 'undefined') throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectionLevel:' + errorCorrectionLevel); var length = rsBlockTable.length / 3, list = []; for (var i = 0; i < length; i++) { var count = rsBlockTable[i * 3 + 0], totalCount = rsBlockTable[i * 3 + 1], dataCount = rsBlockTable[i * 3 + 2]; for (var j = 0; j < count; j++) list.push(qrRSBlock(totalCount, dataCount)); } return list; } }; })();
function qrBitBuffer() { var _buffer = [], _length = 0, _this = {}; _this.buffer = _buffer; _this.getLengthInBits = function() { return _length; }; _this.put = function(num, length) { for (var i = 0; i < length; i++) _this.putBit(((num >>> (length - i - 1)) & 1) === 1); }; _this.putBit = function(bit) { var bufIndex = Math.floor(_length / 8); if (_buffer.length <= bufIndex) _buffer.push(0); if (bit) _buffer[bufIndex] |= (0x80 >>> (_length % 8)); _length++; }; return _this; }
function stringToBytes(s) { var bytes = []; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c < 128) bytes.push(c); else if (c < 2048) { bytes.push((c >> 6) | 192); bytes.push((c & 63) | 128); } else { bytes.push((c >> 12) | 224); bytes.push(((c >> 6) & 63) | 128); bytes.push((c & 63) | 128); } } return bytes; }
var stringToBytesFuncs = { 'default': stringToBytes };
stringToBytesFuncs['UTF-8'] = stringToBytes;
return qrcode;
})();
/* eslint-enable */
