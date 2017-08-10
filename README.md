# wx_oauth

  Get wechat userinfo and set koa context variable named `_wechat_userinfo`

# Usage

```
  const koa = require('koa')
  const wxOauth = require('wx-oauth')
  const app = koa()

  app.use(wxOauth({}, function() {
    const userinfo = this._wechat_userinfo

    // there handle wechat userinfo

  }))

```

### Use koa-router

```
router.get('/signin', convert(wxOauth({ wechat config }, callback)))
```
