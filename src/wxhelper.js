/**
* 1. get token
* 2. get userinfo
* ...
*/
import request from 'co-request';
import _debug from 'debug';

const debug = _debug('wx_oauth:lib:wxhelper:');
const access_token_storage = null;

/**
* GET wechat oauth access_token
* @param {string} appid
* @param {string} secret
* @param {string} code
* @return {"access_token":"ACCESS_TOKEN", "expires_in":7200, "refresh_token":"REFRESH_TOKEN", "openid":"OPENID", "scope":"SCOPE"}
*/
export function* access_token(options, code) {
  let uri = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${options.appid}&secret=${options.appsecret}&code=${code}&grant_type=authorization_code`;
  debug('uri: ', uri);

  let resp = yield request(uri);
  let body = JSON.parse(resp.body);

  // check error
  yield error_handler.call(this, body);
  return body;
}

/**
* GET wechat user info
* @param {string} access_token required
* @param {string} openid required
* @param {string} lang optional
*/
export function* userinfo(access_token, openid, lang) {
  let uri = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=${lang || 'zh_CN'}`;
  debug('uri: ', uri);

  let resp = yield request(uri);
  let userinfo = JSON.parse(resp.body);

  // check error
  yield error_handler.call(this, userinfo);
  return userinfo;
}

/**
* Wechat error response handler
* @param {object} body required
* @return Error
*/
function* error_handler(body) {
  if (body.errcode || body.errmsg) {
    let err = new Error(body.errmsg);
    err.name = 'WechatAPIError';
    err.code = body.errcode;
    throw err;
  }
}
