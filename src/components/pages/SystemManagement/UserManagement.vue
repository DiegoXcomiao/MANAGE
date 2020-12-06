<template>
  <div class="layout" :style="{width: scrolWidth, overflow: 'auto'}">
    <Layout>
      <Layout>
        <Content :style="{background: '#ffffff', padding: '0 10px 10px'}">
          <div class="clearfix" style="margin:10px;">
            <el-form :inline="true" :model="search" style="height: 40px">
              <el-form-item label="用户名称">
                <el-input placeholder="" v-model="search.name" style="width: 150px;"
                          @keyup.enter.native="Search()" :clearable="true"></el-input>
              </el-form-item>
              <el-form-item label="用户编号">
                <el-input placeholder="" v-model="search.code" style="width: 100px;"
                          @keyup.enter.native="Search()" :clearable="true"></el-input>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="search" style="height: 40px">
              <el-form-item label="所属机构">
                <tree-select
                  style="width: 250px; font-size: small;"
                  :options="data1"
                  placeholder="请选择所属机构"
                  v-model="search.nodeCode"
                />
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="search" style="height: 40px">
              <el-form-item label="角色">
                <el-select multiple collapse-tags v-model="search.roleCode" placeholder="请选择角色"
                           @change='changeSelect'
                           style="width: 200px; font-size: small;" @remove-tag='removeTag'>
                  <el-option label='全选' value='全选' @click.native='selectAll' style="font-size: small;"></el-option>
                  <el-option v-for="(value, key) in data2" :key="key" :label="value.name" :value="value.code"
                             style="font-size: small;"/>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="search" style="height: 40px">
              <el-form-item label="是否有效">
                <el-select v-model="search.enabled" placeholder="请选择是否有效"
                           style="width: 150px; font-size: small;" :clearable="true">
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="search" style="height: 40px;">
              <el-button type="primary" @click="searchUser()">查询</el-button>
              <el-button type="primary" @click="createInfor()">新建</el-button>
              <el-button type="primary" @click="editline()">修改</el-button>
              <el-button type="primary" @click="deleteline()">删除</el-button>
              <el-button type="primary" @click="resetPasswd()">密码重置</el-button>
            </el-form>
          </div>

          <el-table
            class="tableBox"
            border :span="0"
            :row-style="{padding:'0px', height:'10px'}"
            :header-cell-style="tableHeaderColor"
            :cell-style="{padding:'0px'}"
            ref="singleTable"
            stripe
            :height=300
            :data="tableData.lineItems.items"
            @selection-change="handleCurrentChange"
            style="width: 100%"
            @sort-change="changeTableSort"
            :default-sort="{prop: 'userId', order: 'descending'}">
            <el-table-column label="选择" :reserve-selection="false" prop="uuid" width="40px" type="selection">
            </el-table-column>
            <el-table-column v-if="key!='id'" :label="value"
                             v-for="(value, key) in tableData.table.header" :key="value" :width="width()"
                             :prop="key"
                             :sortable="'custom'">
              <template slot-scope="scope">
                <span>{{scope.row[key]}}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @current-change="pageChange" v-if="tableData.isShow"
            :current-page="tableData.pageIndex"
            :page-size=tableData.fenye.pageSize
            layout="total, prev, pager, next, jumper"
            :total=tableData.lineItems.totalCount>
          </el-pagination>

        </Content>
        <el-dialog width="80%" top="0" title="用户信息" :visible.sync="tableData.dialogTableVisible"
                   v-if="tableData.dialogTableVisible" @close="closeDialog"
                   :style="{width: scrolWidth}">
          <el-form :model="form" class="userDialog" ref="form">
            <el-form-item label="用户编号" :label-width="formLabelWidth" prop="code"
                          :rules="[
      { required: true, message: '用户编号不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.code" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name"
                          style="font-size: small;"
                          :rules="[{ required: true, message: '用户名称不能为空', trigger: 'blur' }]">
              <el-input v-model="form.name" autocomplete="off"
                        oninput="if(value.length>10)value=value.slice(0,10)" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="所属机构" :label-width="formLabelWidth" prop="nodeCode"
                          style="font-size: small;"
                          :rules="[{ required: true, message: '所属机构不能为空', trigger: 'blur' }]">
              <tree-select
                style="font-size: small;"
                :options="data1"
                placeholder="请选择所属机构"
                v-model="form.nodeCode"
              />
            </el-form-item>
            <el-form-item label="用户角色" :label-width="formLabelWidth" prop="roleCode"
                          :rules="[
      { required: true, message: '用户角色不能为空', trigger: 'blur' }
    ]">
              <el-select multiple collapse-tags v-model="form.roleCode" placeholder="请选择角色"
                         @change='changeSelect2'
                         style="font-size: small;" @remove-tag='removeTag2'>
                <el-option label='全选' value='全选' @click.native='selectAll2' style="font-size: small;"></el-option>
                <el-option v-for="(value, key) in data2" :key="key" :label="value.name" :value="value.code"
                           style="font-size: small;"/>
              </el-select>
            </el-form-item>
            <el-form-item label="用户头像:" size="mini">
              <el-upload
                ref="upload"
                :action="serverUrl"
                :data="picData"
                :limit="1"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
                :on-progress="onProgress"
                :on-success="imgSuccess"
                :on-error="imgError"
                list-type="picture-card"
                :on-remove="handleRemove"
                :class="{hide:hideUpload}"
                :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传不超过10MB的图片</div>
              </el-upload>
              <el-dialog :modal-append-to-body="false" :visible.sync="imgVisible" width="30%">
                <img width="100%" :src="dialogImageUrl" alt="图片未找到"/>
              </el-dialog>
            </el-form-item>
            <el-form-item label="是否有效" :label-width="formLabelWidth" prop="enabled"
                          :rules="[
      { required: true, message: '是否有效不能为空', trigger: 'blur' }
    ]">
              <el-select v-model="form.enabled" placeholder="请选择是否有效"
                         style="font-size: small;" :clearable="true">
                <el-option label="是" value="Y"></el-option>
                <el-option label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话号码" :label-width="formLabelWidth" prop="telno"
                          :rules="[
      { required: true, message: '电话号码不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.telno" autocomplete="off"
                        oninput="if(value.length>80)value=value.slice(0,80)" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="获取验证码" :label-width="formLabelWidth2" prop="verifyCode" style="margin-left: -6px">
              <el-button :disabled="btnChangeEnable" type="primary" @click="getCode">获取验证码</el-button>
              <span v-show="!show" class="count">{{count}}s</span>
            </el-form-item>
            <el-form-item label="验证码" :label-width="formLabelWidth" prop="verifyCode"
                          :rules="[{ required: true, message: '验证码不能为空', trigger: 'blur' }]" style="margin-left: -14px">
              <el-input v-model="form.verifyCode" autocomplete="off"
                        oninput="if(value.length>80)value=value.slice(0,80)" :clearable="true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary"
                       @click="submit(form.code, form.name, form.nodeCode, form.roleCode, dialogImageUrl, form.enabled, form.telno, form.verifyCode)">
              确 定
            </el-button>
          </div>
        </el-dialog>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {post} from '../../js/http.js'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {TreeSelect},
  data () {
    return {
      serverUrl: '',
      btnChangeEnable: false,
      hideUpload: false,
      imgVisible: false,
      dialogImageUrl: '',
      fileList: [],
      picData: {name: ''},
      scrolWidth: '0px',
      show: true,
      count: '',
      timer: null,
      formLabelWidth: '80px',
      formLabelWidth2: '100px',
      search: {
        name: '',
        code: '',
        nodeCode: null,
        enabled: '',
        roleCode: ''
      },
      form: {
        nodeId: '',
        code: '',
        name: '',
        roleCode: '',
        nodeCode: null,
        password: '',
        verifyCode: '',
        telno: '',
        picpath: '',
        enabled: ''
      },
      code: '',
      code2: '',
      name: '',
      data1: [],
      data2: [],
      tableData: {
        isShow: true,
        dialogTableVisible: false,
        lineItems: {
          items: [],
          totalCount: 0
        },
        table: {
          header: {},
          width: []
        },
        fenye: {
          pageIndex: 1,
          pageSize: 20
        }
      }
    }
  },
  mounted () {
    if (global.flag !== 1) {
      this.getTableData('noMsg')
      global.flag = 0
    }
    this.scrolWidth = window.innerWidth + 'px'
    this.route = '/queryNode'
  },
  created () {
    global.count = 0
    global.selection = []
    this.code = ''
    this.code2 = ''
    this.name = ''
    var system = require('../../config/system.json')
    console.log(system.clientPath)
    console.log(system.serverPath)
    this.serverUrl = system.serverPath + '/addPic'
    console.log(this.serverUrl)
  },
  methods: {
    handleCurrentChange (rows) {
      global.selection = rows
    },
    // 上传文件之前的钩子
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
    },
    beforeAvatarUpload (file) {
      let isLt10M = file.size / 1024 / 1024 < 10

      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isLt10M
    },
    onProgress (event, file, fileList) {
      this.hideUpload = true
    },
    imgSuccess (response, file, fileList) {
      console.log(fileList)
      console.log(file)
      this.hideUpload = true
      if (response.code === '0') {
        var system = require('../../config/system.json')
        console.log(system.clientPath)
        console.log(system.serverPath)
        var url = response.obj.picpath
        this.dialogImageUrl = system.serverPath + url
        console.log(this.dialogImageUrl)
        this.$message({message: '上传图片成功', duration: 3000, type: 'success'})
        this.getTableData('noMsg')
      } else if (response.code === -1) {
        this.dialogImageUrl = ''
        this.fileList = []
        this.hideUpload = false
        this.$message.error(response.msg)
      } else {
        this.dialogImageUrl = ''
        this.fileList = []
        this.hideUpload = false
        this.$message.error(response.msg)
      }
    },
    // 图片上传失败
    imgError (err, file, fileList) {
      this.$message.error('上传失败' + err)
      this.hideUpload = false
    },
    // 预览图片
    handlePictureCardPreview (e) {
      this.imgVisible = true
      this.hideUpload = true
    },
    // 删除图片
    handleRemove (file, fileList) {
      var code = {
        code: this.form.code
      }
      post('/deletePic', code, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.$message({message: response.msg, duration: 3000, type: 'success'})
          this.dialogImageUrl = ''
          this.hideUpload = false
          this.fileList = []
          this.getTableData('noMsg')
        } else {
          this.$message({message: '删除失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
    },
    getCode () {
      if (this.form.telno.length !== 11) {
        this.$message({message: '请输入正确手机号', duration: 2000, type: 'warning'})
        return
      }
      var re = /^1\d{10}$/
      if (!re.test(this.form.telno)) {
        this.$message({message: '请输入正确手机号', duration: 2000, type: 'warning'})
        return
      }
      this.btnChangeEnable = true
      const TIME_COUNT = 60 * 5
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
            this.btnChangeEnable = false
          }
        }, 1000)
      }

      var message = {
        message: '',
        verifyCode: '',
        telno: this.form.telno,
        userCode: this.form.code
      }
      post('/sendCode', message, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          // this.$message({message: response.msg, duration: 3000, type: 'success'})
        } else {
          this.$message({message: '发送失败 ' + response.msg, duration: 3000, type: 'warning'})
          this.show = true
          clearInterval(this.timer)
          this.timer = null
          this.btnChangeEnable = false
        }
      }, err => {
        console.log(err)
        this.btnChangeEnable = false
      })
    },
    selectAll () {
      if (this.search.roleCode.length < this.data2.length) {
        this.search.roleCode = []
        this.data2.map((item) => {
          this.search.roleCode.push(item.code)
        })
        this.search.roleCode.unshift('全选')
      } else {
        this.search.roleCode = []
      }
    },
    changeSelect (val) {
      if (!val.includes('全选') && val.length === this.data2.length) {
        this.search.roleCode.unshift('全选')
      } else if (val.includes('全选') && (val.length - 1) < this.data2.length) {
        this.search.roleCode = this.search.roleCode.filter((item) => {
          return item !== '全选'
        })
      }
    },
    removeTag (val) {
      if (val === '全选') {
        this.search.roleCode = []
      }
    },
    selectAll2 () {
      if (this.form.roleCode.length < this.data2.length) {
        this.form.roleCode = []
        this.data2.map((item) => {
          this.form.roleCode.push(item.code)
        })
        this.form.roleCode.unshift('全选')
      } else {
        this.form.roleCode = []
      }
    },
    changeSelect2 (val) {
      if (!val.includes('全选') && val.length === this.data2.length) {
        this.form.roleCode.unshift('全选')
      } else if (val.includes('全选') && (val.length - 1) < this.data2.length) {
        this.form.roleCode = this.form.roleCode.filter((item) => {
          return item !== '全选'
        })
      }
    },
    removeTag2 (val) {
      if (val === '全选') {
        this.form.roleCode = []
      }
    },
    searchUser () {
      console.log(this.search.name)
      console.log(this.search.code)
      console.log(this.search.nodeCode)
      console.log(this.search.roleCode)
      console.log(this.search.enabled)

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      console.log(this.tableData.fenye.pageIndex)
      console.log(this.tableData.fenye.pageSize)
      console.log('get data from server!')

      var user = {
        userId: 0,
        name: this.search.name,
        code: this.search.code,
        nodeCode: this.search.nodeCode,
        roleCode: this.search.roleCode,
        nodeName: '',
        roleName: '',
        telno: '',
        password: '',
        verifyCode: '',
        picpath: '',
        enabled: this.search.enabled
      }

      post('/queryUser', user, this.tableData.fenye.pageIndex, this.tableData.fenye.pageSize).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.$message({message: response.msg, duration: 3000, type: 'success'})
          var data = {
            items: response.lobj,
            totalCount: response.totalCount
          }
          this.dealTableData(data)
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
      loading.close()
    },
    resetPasswd () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行重置密码', duration: 2000, type: 'warning'})
        return
      }
      if (confirm('确定要重置吗') === true) {
        var form = {
          code: rows[0].code
        }
        post('/resetPasswd', form, 0, 0).then((response) => {
          console.log(response)
          if (response.code === '0') {
            this.getTableData('noMsg')
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          } else {
            this.$message({message: '重置失败 ' + response.msg, duration: 3000, type: 'warning'})
          }
        }, err => {
          console.log(err)
        })
      }
    },
    changeTableSort (column) {
      console.log(column)
      var fieldName = column.prop
      var sortingType = column.order

      if (fieldName === 'createTime') {
        this.tableData.lineItems.items.map(item => {
          item.createTime = this.$moment(item.createTime).valueOf()
        })
      }

      if (fieldName === 'name') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'roleCode') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'roleName') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'nodeName') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'telno') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'picpath') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else if (fieldName === 'enabled') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      } else {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName] - a[fieldName])
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName] - b[fieldName])
        }
      }
      console.log(this.tableData.lineItems.items)
    },
    closeDialog () {
      this.form.code = ''
      this.form.name = ''
      this.btnChangeEnable = false
      this.hideUpload = false
      this.imgVisible = false
      this.dialogImageUrl = ''
      this.fileList = []
      this.picData = {name: ''}
      this.form.nodeId = ''
      this.form.roleCode = ''
      this.form.nodeCode = null
      this.form.password = ''
      this.form.passwordOld = ''
      this.form.verifyCode = ''
      this.form.telno = ''
      this.form.picpath = ''
      this.form.enabled = ''
      this.show = true
      clearInterval(this.timer)
      this.timer = null
    },
    handleSelect (data) {
      console.log(data[0].id)
      this.code = data[0].id
      this.name = data[0].title
      let children = data[0].children
      let len = children.length
      if (len > 0) {
        let code = children[len - 1].id
        console.log(code)
        let icode = parseInt(code) + 1
        console.log(icode)
        let scode = '' + icode
        let tmp = ''
        for (let i = 0; i < code.length - scode.length; i++) {
          tmp += '0'
        }
        console.log(tmp)
        this.code2 = tmp + scode
      } else {
        this.code2 = this.code + '01'
      }
    },
    width () {
      if (global.count === this.tableData.table.width.length) {
        global.count = 0
      }
      var res = this.tableData.table.width[global.count++]
      return res + 'px'
    },
    tableHeaderColor ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0) {
        return 'background-color: #049EFF;color: #fff;font-weight: 500;'
      }
    },
    dealTableData (obj) {
      this.tableData.lineItems = obj
      this.tableData.table.header = {
        'userId': '用户ID',
        'code': '用户编号',
        'name': '用户名称',
        'roleCode': '用户权限编码',
        'roleName': '用户权限',
        'nodeCode': '用户机构编码',
        'nodeName': '用户机构',
        'telno': '电话',
        'picpath': '图片地址',
        'enabled': '是否有效'
      }
      this.tableData.table.width = [
        100, 100, 100, 200, 300, 150, 200, 100, 300, 100
      ]
    },
    pageChange (num) {
      this.tableData.fenye.pageIndex = num
      this.getTableData('noMsg')
    },
    getData (tree = []) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach(
          item => {
            let obj = {}
            obj.label = item.title
            obj.id = item.code
            if (item.code.length !== 8) {
              obj.children = this.getData(item.children)
            }
            arr.push(obj)
          }
        )
      }
      return arr
    },
    getTableData (msg) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      post('/queryNode', null, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          if (msg !== 'noMsg') {
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          }
          let data = response.lobj

          this.data1 = this.getData(data)
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })

      post('/queryRole', null, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          if (msg !== 'noMsg') {
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          }
          this.data2 = response.lobj
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })

      console.log(this.tableData.fenye.pageIndex)
      console.log(this.tableData.fenye.pageSize)
      console.log('get data from server!')

      var user = {
        userId: 0,
        name: '',
        code: '',
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

      post('/queryUser', user, this.tableData.fenye.pageIndex, this.tableData.fenye.pageSize).then((response) => {
        console.log(response)
        if (response.code === '0') {
          if (msg !== 'noMsg') {
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          }
          var data = {
            items: response.lobj,
            totalCount: response.totalCount
          }
          this.dealTableData(data)
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
      loading.close()
    },
    createInfor () {
      post('/queryUserCode', null, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.form.code = response.obj.code
          this.picData.name = this.form.code
          console.log(this.picData)
          console.log('aaaaaaaaa')
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
      this.closeDialog()
      this.tableData.dialogTableVisible = true
      this.type = 'createInfor'
    },
    editline () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行修改', duration: 2000, type: 'warning'})
        return
      }
      this.form.userId = rows[0].userId
      this.form.code = rows[0].code
      this.picData.name = this.form.code
      this.form.name = rows[0].name
      this.form.roleCode = []
      var roleArray = JSON.parse(rows[0].roleCode)
      roleArray.map((item) => {
        if (item === '全选') {
          this.form.roleCode.unshift('全选')
        } else {
          this.form.roleCode.push(item)
        }
      })
      this.form.nodeCode = rows[0].nodeCode
      if (rows[0].picpath !== null && rows[0].picpath !== '') {
        var system = require('../../config/system.json')
        console.log(system.clientPath)
        console.log(system.serverPath)
        this.dialogImageUrl = system.serverPath + '/' + rows[0].picpath
        this.hideUpload = true
        this.fileList = [{name: this.form.code + '.jpg', url: this.dialogImageUrl}]
        console.log(this.fileList)
      } else {
        this.dialogImageUrl = ''
        this.hideUpload = false

        this.fileList = []
      }
      this.form.telno = rows[0].telno
      this.form.enabled = rows[0].enabled

      this.tableData.dialogTableVisible = true
      this.type = 'editline'
    },
    deleteline () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行删除', duration: 2000, type: 'warning'})
        return
      }

      if (rows[0].code === '000001') {
        this.$message({message: '请勿删除内置管理员用户', duration: 3000, type: 'warning'})
        return
      }
      if (confirm('确定要删除吗') === true) {
        var form = {
          code: rows[0].code
        }
        post('/deleteUser', form, 0, 0).then((response) => {
          console.log(response)
          if (response.code === '0') {
            this.getTableData('noMsg')
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          } else {
            this.$message({message: '删除失败 ' + response.msg, duration: 3000, type: 'warning'})
          }
        }, err => {
          console.log(err)
        })
      }
    },
    submit (code, name, nodeCode, roleCode, dialogImageUrl, enabled, telno, verifyCode) {
      var form = {
        code: code,
        name: name,
        roleCode: roleCode,
        nodeCode: nodeCode,
        verifyCode: verifyCode,
        telno: telno,
        picpath: dialogImageUrl,
        enabled: enabled
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'editline':
              console.log(form)
              if (this.btnChangeEnable === false) {
                this.$message({message: '短信验证码失效，请重新发送', duration: 3000, type: 'warning'})
              }
              post('/updateUser', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
                  this.getTableData('noMsg')
                  this.$message({message: response.msg, duration: 3000, type: 'success'})
                  this.tableData.dialogTableVisible = false
                  this.show = true
                  clearInterval(this.timer)
                  this.timer = null
                  this.btnChangeEnable = false
                  this.form.verifyCode = ''
                } else {
                  this.$message({message: '修改失败 ' + response.msg, duration: 3000, type: 'warning'})
                }
              }, err => {
                console.log(err)
              })
              break
            case 'createInfor':
              console.log(form)
              if (this.btnChangeEnable === false) {
                this.$message({message: '短信验证码失效，请重新发送', duration: 3000, type: 'warning'})
              }
              post('/addUser', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
                  this.getTableData('noMsg')
                  this.$message({message: response.msg, duration: 3000, type: 'success'})
                  this.tableData.dialogTableVisible = false
                  this.show = true
                  clearInterval(this.timer)
                  this.timer = null
                  this.btnChangeEnable = false
                  this.form.verifyCode = ''
                } else {
                  this.$message({message: '新增失败 ' + response.msg, duration: 3000, type: 'warning'})
                }
              }, err => {
                console.log(err)
              })
              break
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
