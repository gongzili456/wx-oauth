'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = function (options, callback) {
  // verify options
  ['appid', 'appsecret', 'redirect_domain'].map(function (key) {
    (0, _assert2.default)(options[key], key + ' is required, please check your config.');
  });

  (0, _assert2.default)(callback, 'callback function is required.');

  return _regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return do_auth.call(this, options, callback);

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};

var _coRequest = require('co-request');

var _coRequest2 = _interopRequireDefault(_coRequest);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _wxhelper = require('./wxhelper');

var wxhelper = _interopRequireWildcard(_wxhelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [do_auth, code_uri].map(_regenerator2.default.mark);

var debug = (0, _debug3.default)('wx_oauth:lib:wx_oauth:');

function do_auth(options, callback) {
  var uri, access_token_obj, userinfo;
  return _regenerator2.default.wrap(function do_auth$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          debug('this.query: ', this.query);
          debug('this.headers: ', this.headers);
          debug('this.session: ', this.session);
          debug('---------------------------------------------------------------------');

          if (!((!this.params.uuid || options.platform !== 'mp') && !this.query.redirect_uri)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt('return', this.body = {
            status: 400,
            message: 'You must take query string named {redirect_uri}, example: http://domain.com/path?query=abc'
          });

        case 6:
          if (this.query.code) {
            _context2.next = 13;
            break;
          }

          debug('redirect_uri', this.query.redirect_uri);
          _context2.next = 10;
          return code_uri.call(this, options);

        case 10:
          uri = _context2.sent;

          debug('uri: ', uri);

          return _context2.abrupt('return', this.redirect(uri));

        case 13:
          _context2.next = 15;
          return wxhelper.access_token(options, this.query.code);

        case 15:
          access_token_obj = _context2.sent;

          debug('access_token_obj: ', access_token_obj);

          _context2.next = 19;
          return wxhelper.userinfo(access_token_obj.access_token, options.appid);

        case 19:
          userinfo = _context2.sent;

          debug('userinfo: ', userinfo);

          this._wechat_userinfo = userinfo;
          _context2.next = 24;
          return callback.call(this);

        case 24:
          return _context2.abrupt('return', _context2.sent);

        case 25:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[0], this);
}

/**
* redirect to get code on wechat open platform
* @param {string} appid
* @param {string} redirect_uri
* @param {string} state
* @return uri
*/
function code_uri(options) {
  var appid, appsecret, redirect_domain, state, platform, refer, full_redirect_uri;
  return _regenerator2.default.wrap(function code_uri$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          appid = options.appid, appsecret = options.appsecret, redirect_domain = options.redirect_domain, state = options.state, platform = options.platform;
          refer = this.query.redirect_uri;
          full_redirect_uri = redirect_domain + this.path + '?redirect_uri=' + encodeURIComponent(refer);

          if (!(platform !== 'mp')) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt('return', 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + encodeURIComponent(full_redirect_uri) + '&response_type=code&scope=snsapi_login&state=' + (encodeURIComponent(state) || '') + '#wechat_redirect');

        case 5:

          if (this.params.uuid) {
            state = this.params.uuid;
            full_redirect_uri = redirect_domain + this.path + '?redirect_uri=' + encodeURIComponent(options.refer);
          }

          return _context3.abrupt('return', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(full_redirect_uri) + '&response_type=code&scope=' + (this.query.scope || 'snsapi_userinfo') + '&state=' + state + '#wechat_redirect');

        case 7:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[1], this);
}
module.exports = exports['default'];