<template>
  <div class="layout" ref="aaa">
    <Layout>
      <Header>
        <div ref="bbb">
          <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo">
              <Icon type="ios-keypad-outline" size="36"></Icon>
              管理系统
            </div>
            <div class="layout-nav">
              <MenuItem name="1">
                <img width="50px" style="margin-top: 7px; margin-right: 0px;" :src="this.picpath" alt="图片未找到"/>
              </MenuItem>
              <MenuItem name="2">
                {{this.userName}}
              </MenuItem>
              <MenuItem name="3">
                <a @click="onUserInfo" :style="{color: '#ffffff'}">用户信息</a>
              </MenuItem>
              <MenuItem name="4">
                <a @click="onLogout" :style="{color: '#ffffff'}">注销</a>
              </MenuItem>
            </div>
          </Menu>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger
               :style="{overflow: 'auto', height: this.lheight + 'px', minWidth: '100px', background: '#535c70'}">
          <el-row>
            <el-col :span="12">
              <el-menu
                class="el-menu-vertical-demo"
                background-color="#535c70"
                text-color="#fff"
                active-text-color="#ffd04b"
                unique-opened
                :default-active="active">
                <menuu :menuList="menu"></menuu>
              </el-menu>
            </el-col>
          </el-row>
        </Sider>
        <Layout :style="{padding: '0 10px 10px'}">
          <LayoutChild/>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import menuu from '../treeMenu/threeMenu'
import LayoutChild from './LayoutChild'
import {syncPost} from '../js/http2.js'
import {post} from '../js/http.js'

export default {
  data: function () {
    return {
      userCode: '',
      userName: '',
      userRole: '',
      userRoleName: '',
      picpath: '',
      route: '',
      name1: '',
      name2: '',
      active: '',
      height: 0,
      lheight: 0,
      menu: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  components: {
    menuu,
    LayoutChild
  },
  created: function () {
    console.log(global.userCode)

    this.userCode = global.userCode
    var user = {
      userId: 0,
      name: '',
      code: global.userCode,
      nodeCode: '',
      roleCode: '',
      nodeName: '',
      roleName: '',
      telno: '',
      password: '',
      verifyCode: '',
      picpath: '',
      enabled: ''
    }

    var system = require('../config/system.json')
    console.log(system.clientPath)
    console.log(system.serverPath)

    global.data = []
    global.error = ''
    syncPost('/queryUser', user, 0, 0)

    if (global.error === '') {
      if (global.data.code === '0') {
        this.userName = global.data.lobj[0][0].name
        this.userRole = global.data.lobj[0][0].roleCode
        this.userRoleName = global.data.lobj[0][0].roleName
        this.picpath = global.data.lobj[0][0].picpath

        if (this.picpath === null || this.picpath === '') {
          this.picpath = system.serverPath + '/image/default.jpg'
        } else {
          this.picpath = system.serverPath + this.picpath
        }
        console.log(this.picpath)
        var roleMenus = {
          roleCode: this.userRole
        }

        global.data = []
        global.error = ''
        syncPost('/queryRoleMenus2', roleMenus, 0, 0)

        if (global.error === '') {
          if (global.data.code === '0') {
            var roleMenus2 = ''
            for (var i = 0; i < global.data.lobj[0].length; i++) {
              roleMenus2 += global.data.lobj[0][i].menusId
            }
            console.log(roleMenus2)

            var menusJson = require('../treeMenu/menuJson.json')
            this.menu = this.getData(menusJson.children ? menusJson.children : [], roleMenus2)
            console.log(this.menu)
            var active = ''
            if (this.menu.length > 0) {
              if (this.menu[0].children !== undefined) {
                if (this.menu[0].children.length > 0) {
                  active = this.menu[0].children[0].resourceExtendAttr
                  global.route = this.menu[0].children[0].route
                  global.name2 = this.menu[0].children[0].text
                  global.name1 = this.menu[0].children[0].parentName
                }
              }
            }

            if (global.active === undefined || global.active === '') {
              this.active = active
            } else {
              this.active = global.active
            }
          } else {
            this.$message({message: '查询失败 ' + global.data.msg, duration: 3000, type: 'warning'})
          }
        } else {
          console.log(global.error)
        }
      } else {
        this.$message({message: '查询失败 ' + global.data.msg, duration: 3000, type: 'warning'})
      }
    } else {
      console.log(global.error)
    }
  },
  mounted: function () {
    window.onresize = () => {
      return (() => {
        this.lheight = this.$refs.aaa.offsetHeight - this.$refs.bbb.offsetHeight - 5
        console.log(this.lheight)
        this.height = this.lheight
        this.$eventBus.$emit('my-window-change', 'my-window-change msg')
      })()
    }
    this.lheight = this.$refs.aaa.offsetHeight - this.$refs.bbb.offsetHeight - 5
    console.log(this.lheight)
    this.height = this.lheight

    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  },
  methods: {
    onLogout () {
      if (confirm('确定要注销吗') === true) {
        var user = sessionStorage.getItem('userCode')
        global.data = []
        global.error = ''
        var login = {
          code: user
        }
        syncPost('/logout', login, 0, 0)
        if (global.error === '') {
          if (global.data.code === '0') {
            sessionStorage.removeItem('userCode')
            this.$router.replace('/')
          }
        }
      }
    },
    onUserInfo () {
      var str = this.userName
      str += '\r\n'
      str += this.userRoleName
      console.log(str)
      this.$message({message: str, duration: 3000, type: 'info'})
    },
    beforeunloadHandler () {
      this._beforeUnload_time = new Date().getTime()
    },
    unloadHandler (e) {
      var user = sessionStorage.getItem('userCode')
      global.data = []
      global.error = ''
      var login = {
        code: user
      }
      post('/logout', login, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          sessionStorage.removeItem('userCode')
        }
      }, err => {
        console.log(err)
      })
    },
    getData (menus = [], menusId) {
      let arr = []
      if (!!menus && menus.length !== 0) {
        for (var i = 0, l = menus.length; i < l; i++) {
          if (menusId.indexOf(menus[i]['resourceId']) === -1) {
            continue
          }
          let obj = {}
          obj.resourceOrder = menus[i]['resourceOrder']
          obj.resourceId = menus[i]['resourceId']
          obj.resourceExtendAttr = menus[i]['resourceExtendAttr']
          obj.route = menus[i]['route']
          obj.resourceCode = menus[i]['resourceCode']
          obj.parentResId = menus[i]['parentResId']
          obj.parentName = menus[i]['parentName']
          obj.show = menus[i]['show']
          obj.text = menus[i]['text']

          var children = menus[i]['children']
          if (!!children && children.length !== 0) {
            obj.children = this.getData(menus[i]['children'], menusId)
          }
          arr.push(obj)
        }
      }
      return arr
    }
  }
}
</script>

<style scoped xmlns:Layout="http://www.w3.org/1999/xhtml">
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: absolute;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .layout-logo {
    width: 200px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 0px;
    left: 0px;
    color: #f2f6fc;
    font-family: "Microsoft YaHei UI";
    font-size: large;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 0px;
  }
</style>
