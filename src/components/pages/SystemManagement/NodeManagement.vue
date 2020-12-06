<template>
  <div class="layout" :style="{width: scrolWidth}">
    <Layout>
      <Layout>
        <Sider hide-trigger
               :style="{overflow: 'auto', minWidth: '200px', background: '#ffffff', border:'1px solid #d7dde4', padding: '0 10px 10px'}">
          <Tree :data="data1" @on-select-change="handleSelect"></Tree>
        </Sider>
        <Content :style="{background: '#ffffff', padding: '0 10px 10px'}">
          <div class="clearfix" style="margin:10px;">
            <el-form :inline="true" style="height: 40px;">
              <el-button type="primary" @click="createInfor()">新建</el-button>
              <el-button type="primary" @click="editline()">修改</el-button>
              <el-button type="primary" @click="deleteline()">删除</el-button>
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
            style="width: 100%"
            @sort-change="changeTableSort"
            :default-sort = "{prop: 'nodeId', order: 'descending'}">
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

        <el-dialog title="机构信息" :visible.sync="tableData.dialogTableVisible" v-if="tableData.dialogTableVisible" @close="closeDialog" :style="{width: scrolWidth}">
          <el-form :model="form" class="inputWidth" ref="form">
            <el-form-item label="机构编号" :label-width="formLabelWidth" prop="code"
                          :rules="[
      { required: true, message: '机构编号不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.code" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="机构名称" :label-width="formLabelWidth" prop="name"
                          :rules="[
      { required: true, message: '机构名称不能为空', trigger: 'blur' }
    ]">
              <el-input v-model="form.name" autocomplete="off"
                        oninput="if(value.length>80)value=value.slice(0,80)" :clearable="true"></el-input>
            </el-form-item>
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

export default {
  data: () => ({
    scrolWidth: '0px',
    formLabelWidth: '80px',
    form: {
      nodeId: '',
      code: '',
      name: ''
    },
    code: '',
    code2: '',
    name: '',
    data1: [],
    tableData: {
      // 是否显示组件
      isShow: true,
      // 是否显示新建弹框
      dialogTableVisible: false,
      // 表格行项目列表和总条目数
      lineItems: {
        items: [],
        totalCount: 0
      },
      // 表格头部信息
      table: {
        header: {},
        width: []
      },
      // 分页器
      fenye: {
        pageIndex: 1,
        pageSize: 20
      }
    }
  }),
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
    this.code2 = ''
    this.name = ''
  },
  methods: {
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
        'nodeId': '机构ID', 'code': '机构编号', 'name': '机构名称'
      }
      this.tableData.table.width = [
        100, 100, 200
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
            obj.title = item.title
            obj.id = item.code
            obj.expand = false
            obj.selected = false
            obj.children = this.getData(item.children)
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

      console.log(this.tableData.fenye.pageIndex)
      console.log(this.tableData.fenye.pageSize)
      console.log('get data from server!')
      var role = {
        roleId: 0,
        roleName: '',
        roleType: '',
        roleDesc: ''
      }
      post('/queryNode', role, this.tableData.fenye.pageIndex, this.tableData.fenye.pageSize).then((response) => {
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
      if (this.code.length === 0) {
        this.$message({message: '新建机构失败请在左侧机构树选择上级机构', duration: 2000, type: 'warning'})
        return
      }
      if (this.code.length === 2) {
        this.$message({message: '不能选择根节点机构作为新建机构的上级机构', duration: 2000, type: 'warning'})
        return
      }
      if (this.code.length === 8) {
        this.$message({message: '不能选择叶子节点机构作为新建机构的上级机构', duration: 2000, type: 'warning'})
        return
      }
      this.form.code = this.code2
      this.tableData.dialogTableVisible = true
      this.type = 'createInfor'
    },
    editline () {
      if (this.code.length === 0) {
        this.$message({message: '修改机构失败请在左侧机构树选择要修改的机构', duration: 2000, type: 'warning'})
        return
      }
      if (this.code.length === 2 || this.code.length === 4) {
        this.$message({message: '不能修改2级及其以上机构', duration: 2000, type: 'warning'})
        return
      }
      this.form.code = this.code
      this.form.name = this.name
      this.tableData.dialogTableVisible = true
      this.type = 'editline'
    },
    deleteline () {
      if (this.code.length === 0) {
        this.$message({message: '删除机构失败请在左侧机构树选择要删除的机构', duration: 2000, type: 'warning'})
        return
      }
      if (this.code.length === 2 || this.code.length === 4) {
        this.$message({message: '不能删除2级及其以上机构', duration: 2000, type: 'warning'})
        return
      }
      if (confirm('确定要删除吗') === true) {
        var form = {
          code: ''
        }
        form.code = this.code
        post('/deleteNode', form, 0, 0).then((response) => {
          console.log(response)
          if (response.code === '0') {
            this.getTableData('noMsg')
            this.tableData.dialogTableVisible = false
            this.$message({message: response.msg, duration: 3000, type: 'success'})
          } else {
            this.$message({message: '删除失败 ' + response.msg, duration: 3000, type: 'warning'})
          }
        }, err => {
          console.log(err)
        })
      }
    },
    submit (code, name) {
      var form = {
        code: code,
        name: name
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'editline':
              console.log(form)
              post('/updateNode', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
                  this.getTableData('noMsg')
                  this.tableData.dialogTableVisible = false
                  this.$message({message: response.msg, duration: 3000, type: 'success'})
                } else {
                  this.$message({message: '修改失败 ' + response.msg, duration: 3000, type: 'warning'})
                }
              }, err => {
                console.log(err)
              })
              break
            case 'createInfor':
              console.log(form)
              post('/addNode', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
                  this.getTableData('noMsg')
                  this.tableData.dialogTableVisible = false
                  this.$message({message: response.msg, duration: 3000, type: 'success'})
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
