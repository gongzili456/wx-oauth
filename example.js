const koa = require('koa')
const wxOauth = require('./lib/wx_oauth')
const app = koa()

console.log('wxOauth: ', wxOauth)

app.use(wxOauth({}, function() {
	console.log('----------------')
}))
