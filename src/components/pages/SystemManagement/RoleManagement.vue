<template>
  <div class="RoleManagement">
    <RoleManagementPage
      :tableData="tableData"
      @pageChange="pageChange" @createInfor="createInfor"
      @editline="editline" @deleteline="deleteline">
    </RoleManagementPage>
  </div>
</template>

<script>
import RoleManagementPage from './RoleManagementPage'
import {post} from '../../js/http.js'

export default {
  name: 'index',
  components: {
    RoleManagementPage
  },
  data: () => ({
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
  }),
  mounted () {
    if (global.flag !== 1) {
      this.getTableData('noMsg')
      global.flag = 0
    }
  },
  methods: {
    dealTableData (obj) {
      this.tableData.lineItems = obj
      this.tableData.table.header = {
        'roleId': '角色ID', 'code': '角色编号', 'name': '角色名称'
      }
      this.tableData.table.width = [
        100, 100, 200
      ]
    },
    sleep (ms) {
      return new Promise(resolve =>
        setTimeout(resolve, ms)
      )
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
    pageChange (num) {
      console.log(num)
      this.tableData.fenye.pageIndex = num
      this.getTableData('noMsg')
    },
    createInfor (details) {
      console.log('新建条目 ')
      console.log(details)

      post('/addRole', details, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.$message({message: '创建成功', duration: 3000, type: 'success'})
          this.tableData.dialogTableVisible = false
          this.getTableData('noMsg')
        } else {
          this.$message({message: '创建失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
    },
    deleteline (details) {
      console.log('删除条目 ')
      console.log(details)
      if (details.code === '000001' || details.code === '000002') {
        this.$message({message: '删除失败 ' + '基本权限无法删除', duration: 3000, type: 'warning'})
        return
      }
      post('/deleteRole', details, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.$message({message: '删除成功', duration: 3000, type: 'success'})
          this.tableData.dialogTableVisible = false
          this.getTableData('noMsg')
        } else {
          this.$message({message: '删除失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
    },
    editline (details) {
      console.log('修改条目 ')
      console.log(details)
      post('/updateRole', details, 0, 0).then((response) => {
        console.log(response)
        if (response.code === '0') {
          this.$message({message: '修改成功', duration: 3000, type: 'success'})
          this.tableData.dialogTableVisible = false
          this.getTableData('noMsg')
        } else {
          this.$message({message: '修改失败 ' + response.msg, duration: 3000, type: 'warning'})
        }
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
