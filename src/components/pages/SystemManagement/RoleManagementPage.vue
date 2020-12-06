<template>
  <div>
    <div style="width:100%;" :style="{width: scrolWidth}">
      <div class="clearfix" style="margin:10px;">
        <el-form :inline="true" style="height: 40px">
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
        :reserve-selection="false"
        :data="tableData.lineItems.items"
        @selection-change="handleCurrentChange"
        style="width: 100%"
        @sort-change="changeTableSort"
        :default-sort = "{prop: 'roleId', order: 'descending'}">
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
    </div>

    <el-pagination
      @current-change="pageChange" v-if="tableData.isShow"
      :current-page="tableData.pageIndex"
      :page-size=tableData.fenye.pageSize
      layout="total, prev, pager, next, jumper"
      :total=tableData.lineItems.totalCount>
    </el-pagination>

    <el-dialog title="角色信息" :visible.sync="tableData.dialogTableVisible" v-if="tableData.dialogTableVisible" @close="closeDialog" :style="{width: scrolWidth}">
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
          <el-input v-model="form.name" autocomplete="off"
                    oninput="if(value.length>80)value=value.slice(0,80)" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit(form.code, form.name)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {post} from '../../js/http.js'

export default {
  props: {
    tableData: Object
  },
  data () {
    return {
      scrolWidth: '0px',
      i: 0,
      formLabelWidth: '80px',
      type: '',
      form: {
        roleId: '',
        code: '',
        name: ''
      }
    }
  },
  created () {
    global.count = 0
    global.selection = []
  },
  mounted () {
    this.scrolWidth = window.innerWidth + 'px'
  },
  methods: {
    closeDialog () {
      this.form.code = ''
      this.form.name = ''
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
    handleCurrentChange (rows) {
      global.selection = rows
    },
    pageChange (val) {
      this.$emit('pageChange', val)
    },
    createInfor () {
      var role = {
        roleId: 0,
        code: '',
        name: ''
      }
      post('/queryCode', role, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.form.code = response.obj.code
        } else {
          this.$message({message: '查询失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
      this.tableData.dialogTableVisible = true
      this.type = 'createInfor'
    },
    editline () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行修改', duration: 2000, type: 'warning'})
        return
      }
      this.form.roleId = rows[0].roleId
      this.form.code = rows[0].code
      this.form.name = rows[0].name
      this.tableData.dialogTableVisible = true
      this.type = 'editline'
    },
    deleteline () {
      var rows = global.selection
      if (rows.length === undefined || rows.length !== 1) {
        this.$message({message: '请选择一条数据进行删除', duration: 2000, type: 'warning'})
        return
      }
      if (confirm('确定要删除吗') === true) {
        var form = {
          roleId: '',
          code: '',
          name: ''
        }
        form.roleId = rows[0].roleId
        form.code = rows[0].code
        form.name = rows[0].name
        this.$emit('deleteline', form)
      }
    },
    submit (code, name) {
      var form = {
        roleId: '',
        code: '',
        name: ''
      }
      form.code = code
      console.log(code)
      form.name = name

      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'editline':
              this.$emit('editline', form)
              break
            case 'createInfor':
              this.$emit('createInfor', form)
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

<style lang="scss">
  .tableBox {
    th {
      padding: 0 !important;
      height: 10px;
      line-height: 10px;
    }

    td {
      padding: 0 !important;
      height: 10px;
      line-height: 10px;
    }
  }
</style>
