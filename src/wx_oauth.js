import request from 'co-request';
import _debug from 'debug';
import assert from 'assert';
import * as wxhelper from './wxhelper';

const debug = _debug('wx_oauth:lib:wx_oauth:');

export default function (options, callback) {
  // verify options
  ['appid', 'appsecret', 'redirect_domain'].map(key => {
    assert(options[key], `${key} is required, please check your config.`);
  });

  assert(callback, `callback function is required.`);

  return function* () {
    return yield do_auth.call(this, options, callback);
  }
}

function* do_auth(options, callback) {
  debug('this.query: ', this.query);
  debug('this.headers: ', this.headers);
  debug('this.session: ', this.session);
  debug('---------------------------------------------------------------------');
  if ((!this.params.uuid || options.platform !== 'mp') && !this.query.redirect_uri) {
    return this.body = {
      status: 400,
      message: 'You must take query string named {redirect_uri}, example: http://domain.com/path?query=abc'
    }
  }

  if (!this.query.code) {
    debug(`redirect_uri`, this.query.redirect_uri);
    let uri = yield code_uri.call(this, options);
    debug('uri: ', uri);

    return this.redirect(uri);
  }

  let access_token_obj = yield wxhelper.access_token(options, this.query.code);
  debug('access_token_obj: ', access_token_obj);

  let userinfo = yield wxhelper.userinfo(access_token_obj.access_token, options.appid);
  debug('userinfo: ', userinfo);

  this._wechat_userinfo = userinfo;
  return yield callback.call(this);
}


/**
* redirect to get code on wechat open platform
* @param {string} appid
* @param {string} redirect_uri
* @param {string} state
* @return uri
*/
function* code_uri(options) {
  let {appid, appsecret, redirect_domain, state, platform} = options;
  let refer = this.query.redirect_uri;

  let full_redirect_uri = redirect_domain + this.path + '?redirect_uri=' + encodeURIComponent(refer);

  if (platform !== 'mp') {
    return `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${encodeURIComponent(full_redirect_uri)}&response_type=code&scope=snsapi_login&state=${encodeURIComponent(state) || ''}#wechat_redirect`;
  }

  if (this.params.uuid) {
    state = this.params.uuid;
    full_redirect_uri = redirect_domain + this.path + '?redirect_uri=' + encodeURIComponent(options.refer);
  }

  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(full_redirect_uri)}&response_type=code&scope=${this.query.scope || 'snsapi_userinfo'}&state=${state}#wechat_redirect`;
}
