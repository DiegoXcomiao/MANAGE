import $ from 'jquery'

export function syncPost (url, value, pageIndex, pageNumber) {
  var system = require('../config/system.json')
  console.log(system.clientPath)
  console.log(system.serverPath)
  var path = system.serverPath + url
  console.log(path)
  var sendData = {
    pageIndex: pageIndex,
    pageNumber: pageNumber,
    obj: value
  }
  $.ajax({
    type: 'POST', // 'GET'
    url: path, // 请求地址
    async: false, // 同步
    timeout: 30000,
    dataType: 'json',
    data: JSON.stringify(sendData),
    beforeSend: function (request) {
      request.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    },
    success: function (data, textStatus, jqXHR) {
      console.log(data)
      global.data = data
    },
    error: function (xhr, textStatus, error) {
      console.log(textStatus)
      global.error = textStatus
    }
  })
}
