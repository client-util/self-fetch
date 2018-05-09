require('whatwg-fetch')

const fetch_client = self.fetch.bind(self)

module.exports = function fetch(url, opt) {
  const obj = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      // 'Accept': 'application/json',
    },
    credentials: 'include'
  }

  if (!opt.body) {
    // GET
    obj.method = 'GET'
  } else if (Object.prototype.toString.call(opt.body) === '[object Object]') {
    // POST JSON
    obj.method = 'POST'
    obj.headers['content-type'] = 'application/json; charset=utf-8'
    obj.body = JSON.stringify(opt.body)
  } else if (Object.prototype.toString.call(opt.body) === '[object String]') {
    // POST String
    obj.method = 'POST'
    obj.body = opt.body
  }

  if (opt.headers) {
    for (let key of Object.keys(opt.headers)) {
      obj.headers[key] = opt.headers[key]
    }
  }
  return fetch_client(url, obj).then(res => {
    try {
      if (res.status === 200) return res.json()
      return { code: res.status || 900, errRes: res }
    } catch (e) {
      return { code: 500, errRes: 'server return not json' }
    }
  })
}

module.exports.Headers = self.Headers
module.exports.Request = self.Request
module.exports.Response = self.Response
