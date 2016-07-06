'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.access_token = access_token;
exports.userinfo = userinfo;

var _coRequest = require('co-request');

var _coRequest2 = _interopRequireDefault(_coRequest);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [access_token, userinfo, error_handler].map(_regenerator2.default.mark); /**
                                                                                       * 1. get token
                                                                                       * 2. get userinfo
                                                                                       * ...
                                                                                       */


var debug = (0, _debug3.default)('app:lib:wxhelper:');
var access_token_storage = null;

/**
* GET wechat oauth access_token
* @param {string} appid
* @param {string} secret
* @param {string} code
* @return {"access_token":"ACCESS_TOKEN", "expires_in":7200, "refresh_token":"REFRESH_TOKEN", "openid":"OPENID", "scope":"SCOPE"}
*/
function access_token(options, code) {
  var uri, resp, body;
  return _regenerator2.default.wrap(function access_token$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          uri = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + options.appid + '&secret=' + options.appsecret + '&code=' + code + '&grant_type=authorization_code';

          debug('uri: ', uri);

          _context.next = 4;
          return (0, _coRequest2.default)(uri);

        case 4:
          resp = _context.sent;
          body = JSON.parse(resp.body);

          // check error

          _context.next = 8;
          return error_handler.call(this, body);

        case 8:
          return _context.abrupt('return', body);

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

/**
* GET wechat user info
* @param {string} access_token required
* @param {string} openid required
* @param {string} lang optional
*/
function userinfo(access_token, openid, lang) {
  var uri, resp, userinfo;
  return _regenerator2.default.wrap(function userinfo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          uri = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=' + (lang || 'zh_CN');

          debug('uri: ', uri);

          _context2.next = 4;
          return (0, _coRequest2.default)(uri);

        case 4:
          resp = _context2.sent;
          userinfo = JSON.parse(resp.body);

          // check error

          _context2.next = 8;
          return error_handler.call(this, userinfo);

        case 8:
          return _context2.abrupt('return', userinfo);

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

/**
* Wechat error response handler
* @param {object} body required
* @return Error
*/
function error_handler(body) {
  var err;
  return _regenerator2.default.wrap(function error_handler$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(body.errcode || body.errmsg)) {
            _context3.next = 5;
            break;
          }

          err = new Error(body.errmsg);

          err.name = 'WechatAPIError';
          err.code = body.errcode;
          throw err;

        case 5:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}