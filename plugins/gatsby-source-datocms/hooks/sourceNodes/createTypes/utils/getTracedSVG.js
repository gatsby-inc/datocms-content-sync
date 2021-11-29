"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var path = require('path');

var md5 = require('md5');

var resizeUrl = require('./resizeUrl');

var _require = require('gatsby-core-utils'),
    fetchRemoteFile = _require.fetchRemoteFile;

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, cache) {
    var src, width, height, _require2, traceSVG, absolutePath, url, name, extension, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            src = _ref.src, width = _ref.width, height = _ref.height;
            _require2 = require("gatsby-plugin-sharp"), traceSVG = _require2.traceSVG;
            url = resizeUrl({
              url: src,
              width: width,
              height: height
            }, 80);
            _context.prev = 3;
            _context.next = 6;
            return fetchRemoteFile({
              url: url,
              cache: cache
            });

          case 6:
            absolutePath = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            console.log("Error downloading ".concat(url, " to generate traced SVG!: ").concat(_context.t0.message));
            return _context.abrupt("return", null);

          case 13:
            name = path.basename(absolutePath);
            extension = path.extname(absolutePath).split('.').pop();
            _context.prev = 15;
            _context.next = 18;
            return traceSVG({
              file: {
                internal: {
                  contentDigest: md5(url)
                },
                name: name,
                extension: extension,
                absolutePath: absolutePath
              },
              args: {
                toFormat: ''
              },
              fileArgs: {}
            });

          case 18:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 22:
            _context.prev = 22;
            _context.t1 = _context["catch"](15);
            console.log("Error generating traced SVG for \"".concat(url, "\": ").concat(_context.t1.message, ". Local file: ").concat(absolutePath, ", content: \"").concat(content, "\""));
            return _context.abrupt("return", null);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9], [15, 22]]);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();