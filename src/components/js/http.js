import axios from 'axios'

axios.defaults.timeout = 30000

export function post (url, data, pageIndex, pageNumber) {
  var system = require('../config/system.json')
  console.log(system.clientPath)
  console.log(system.serverPath)
  var path = system.serverPath + url
  console.log(path)
  var sendData = {
    pageIndex: pageIndex,
    pageNumber: pageNumber,
    obj: data
  }
  return new Promise((resolve, reject) => {
    axios.post(path, sendData, {
      'Content-Type': 'application/json;charset=UTF-8'
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}
