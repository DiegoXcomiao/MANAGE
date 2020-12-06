<template>
  <div class="layout" :style="{width: scrolWidth, overflow: 'auto'}">
    <Layout>
      <Layout>
        <Content :style="{background: '#ffffff', padding: '0 10px 10px'}">
          <div class="clearfix" style="margin:10px;">
            <el-form :inline="true" style="height: 40px;">
              <el-button type="primary" @click="editline()">修改</el-button>
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
        <el-dialog title="角色权限信息" :visible.sync="tableData.dialogTableVisible" v-if="tableData.dialogTableVisible" @close="closeDialog" :style="{width: scrolWidth}">
          <el-form :model="form" class="inputWidth" ref="form">
            <el-form-item label="角色编号" :label-width="formLabelWidth" prop="code"
                          :rules="[
      { required: true, message: '角色编号不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.code" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name"
                          :rules="[
      { required: true, message: '角色名称不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.name" :readonly="true"></el-input>
            </el-form-item>
            <Tree :data="data1" show-checkbox multiple ref="tree"></Tree>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit(form.code, form.name)">确 定</el-button>
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
      },
      scrolWidth: '0px',
      i: 0,
      formLabelWidth: '80px',
      type: '',
      form: {
        code: '',
        name: ''
      },
      data1: []
    }
  },
  mounted () {
    if (global.flag !== 1) {
      this.getTableData('noMsg')
      global.flag = 0
    }
    this.scrolWidth = window.innerWidth + 'px'
  },
  created () {
    global.count = 0
    global.selection = []
    this.code = ''
    this.name = ''
  },
  methods: {
    getData (tree = [], menusId) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        for (var i = 0, l = tree.length; i < l; i++) {
          let obj = {}
          obj.title = tree[i]['text']
          obj.id = tree[i]['resourceId']
          obj.expand = true
          if (menusId.indexOf(obj.id) !== -1) {
            if (obj.id % 100 !== 0) {
              obj.checked = true
            }
          }
          obj.children = this.getData(tree[i]['children'], menusId)
          arr.push(obj)
        }
      }
      return arr
    },
    handleCurrentChange (rows) {
      global.selection = rows
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

      if (fieldName === 'roleId') {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName] - a[fieldName])
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName] - b[fieldName])
        }
      } else {
        if (sortingType === 'descending') {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
        } else {
          this.tableData.lineItems.items = this.tableData.lineItems.items.sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        }
      }
      console.log(this.tableData.lineItems.items)
    },
    closeDialog () {
      this.form.code = ''
      this.form.name = ''
      this.data1 = []
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
        'roleId': '角色ID', 'code': '角色编号', 'name': '角色名称'
      }
      this.tableData.table.width = [
        100, 100, 200
      ]
    },
    pageChange (num) {
      this.tableData.fenye.pageIndex = num
      this.getTableData('noMsg')
    },
    getTableData (msg) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      console.log(this.tableData.fenye.pageIndex)
      console.log(this.tableData.fenye.pageSize)
      console.log('get data from server!')
      var role = {
        roleId: 0,
        code: '',
        name: ''
      }
      post('/queryRole', role, this.tableData.fenye.pageIndex, this.tableData.fenye.pageSize).then((response) => {
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
    editline () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行修改', duration: 2000, type: 'warning'})
        return
      }
      this.form.userId = rows[0].userId
      this.form.code = rows[0].code
      this.form.name = rows[0].name

      if (rows[0].code === '000001') {
        this.$message({message: '请勿修改系统管理员权限', duration: 2000, type: 'warning'})
        return
      }

      var form = {
        roleCode: this.form.code
      }

      post('/queryRoleMenus', form, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          var menusJson = require('../../treeMenu/menuJson.json')
          var menu = menusJson.children ? menusJson.children : []
          if (response.obj.length > 0) {
            var menusId = response.obj[0].menusId
            console.log(menusId)
            this.data1 = this.getData(menu, menusId)
          } else {
            this.data1 = this.getData(menu, '')
          }

          this.tableData.dialogTableVisible = true
          this.type = 'editline'
        } else {
          this.$message({message: '修改失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
    },
    submit (code, name) {
      console.log(code)
      console.log(name)
      console.log(this.$refs.tree.getCheckedNodes())
      var nodes = this.$refs.tree.getCheckedNodes()
      if (nodes.length === 0) {
        this.$message({message: '菜单至少必须勾选一个', duration: 3000, type: 'warning'})
        return false
      }
      var menus = ''
      for (var i = 0; i < nodes.length; i++) {
        console.log(nodes[i].id)
        menus += nodes[i].id
        menus += '|'
      }
      var form = {
        roleCode: code,
        menusId: menus
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'editline':
              post('/updateRoleMenus', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
                  this.getTableData('noMsg')
                  this.$message({message: response.msg, duration: 3000, type: 'success'})
                  this.tableData.dialogTableVisible = false
                } else {
                  this.$message({message: '修改失败 ' + response.msg, duration: 3000, type: 'warning'})
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
