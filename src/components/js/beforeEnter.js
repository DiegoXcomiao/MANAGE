import {post} from './http'

export function beforeEnter (to, from, next) {
  var f = sessionStorage.getItem('userCode')
  if (f !== null && f !== undefined) {
    console.log(to)
    console.log(from)
    if (to.name === 'Layout' && from.name === 'Login') {
      next()
    } else {
      var menusJson = require('../treeMenu/menuJson.json')
      var menu = menusJson.children ? menusJson.children : []
      getData(menu, to.name)
      console.log(code)
      var login = {
        userCode: f,
        menuId: code
      }
      post('/queryLogin', login, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          if (response.obj.state !== '1') {
            next('/')
          } else {
            next()
          }
        }
      }, err => {
        console.log(err)
      })
    }
  } else {
    next('/')
  }
}

var code = ''

function getData (tree = [], menuName) {
  var route1 = '/' + menuName
  if (!!tree && tree.length !== 0) {
    for (var i = 0, l = tree.length; i < l; i++) {
      let obj = {}
      var route = tree[i]['route']
      console.log(route1 + ' ' + route)
      if (route1 === route) {
        code = tree[i]['resourceId']
        console.log(code)
      }
      obj.children = getData(tree[i]['children'], menuName)
    }
  }
}
