<template>
  <div class="login-container">
    <el-form ref="form1" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">管理系统</h2>
      <el-form-item label="用户编号" prop="userCode" style="margin-top: 40px" :rules="[
      { required: true, message: '用户编号不能为空', trigger: 'blur' }
    ]">
        <el-input placeholder="请输入用户编号" v-model="form.userCode"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password" :rules="[
      { required: true, message: '用户密码不能为空', trigger: 'blur' }
    ]">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item style="margin-top: 40px">
        <el-button type="primary" @click="submitForm('form1')">用户登录</el-button>
        <el-button type="primary" @click="forgetPassword">忘记密码</el-button>
      </el-form-item>
    </el-form>
    <el-dialog width="40%" top="10%" title="修改密码" :visible.sync="tableData.dialogTableVisible"
               v-if="tableData.dialogTableVisible" @close="closeDialog"
               :style="{width: scrolWidth}">
      <el-form :model="form" class="userDialog" ref="form">
        <el-form-item label="用户编号" :label-width="formLabelWidth" prop="code"
                      :rules="[
      { required: true, message: '用户编号不能为空', trigger: 'blur' }
    ]">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password" :rules="[{ required: true, message: '新密码不能为空', trigger: 'blur' }]" style="margin-left: -14px">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" autocomplete="off"
                    oninput="if(value.length>30)value=value.slice(0,30)" :clearable="true"/>
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
                   @click="submit(form.code, form.verifyCode, form.password)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {post} from '../js/http.js'
import {hexMd5} from '../js/md5.js'

export default {
  data () {
    return {
      formLabelWidth: '80px',
      formLabelWidth2: '100px',
      scrolWidth: '0px',
      btnChangeEnable: false,
      show: true,
      count: '',
      timer: null,
      form: {
        userCode: '',
        code: '',
        password: ''
      },
      rules: {
        usercode: [
          {required: true, message: '用户编号不能为空', trigger: 'blur'},
          {min: 6, max: 6, message: '用户编号6位', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '密码6-20位', trigger: 'blur'}
        ]
      },
      tableData: {
        dialogTableVisible: false
      }
    }
  },
  mounted () {
    global.route = ''
    global.name1 = ''
    global.name2 = ''
    global.active = ''
    global.flag = ''
    global.count = 0
    global.selection = []
    global.userCode = ''

    this.scrolWidth = window.innerWidth + 'px'
  },
  methods: {
    closeDialog () {
      this.form.code = ''
      this.btnChangeEnable = false
      this.form.password = ''
      this.show = true
      clearInterval(this.timer)
      this.timer = null
    },
    getCode () {
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
        telno: '',
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
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var message = {
            message: '',
            verifyCode: '',
            telno: '',
            userCode: this.form.userCode
          }
          post('/sendCode2', message, 0, 0).then((response) => {
            console.log(response)
            if (response.code === '0') {
              // this.$message({message: response.msg, duration: 3000, type: 'success'})
              var str = hexMd5(this.form.password) + response.obj.verifyCode
              var str2 = hexMd5(str)

              var user = {
                code: this.form.userCode,
                password: str2
              }
              post('/checkPasswd', user, 0, 0).then((response) => {
                if (response.code === '0') {
                  global.userCode = this.form.userCode
                  sessionStorage.setItem('userCode', this.form.userCode)
                  this.$router.replace('/Layout')
                } else {
                  this.$message({message: '验证失败 ' + response.msg, duration: 3000, type: 'warning'})
                }
              }, err => {
                console.log(err)
              })
            } else {
              this.$message({message: '验证失败 ' + response.msg, duration: 3000, type: 'warning'})
            }
          }, err => {
            console.log(err)
          })
        } else {
          console.log('验证失败')
          return false
        }
      })
    },
    forgetPassword () {
      this.closeDialog()
      this.form.code = this.form.userCode
      this.tableData.dialogTableVisible = true
      this.type = 'editline'
    },
    submit (code, verifyCode, password) {
      var form = {
        code: code,
        password: hexMd5(password),
        verifyCode: verifyCode
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'editline':
              console.log(form)
              if (this.btnChangeEnable === false) {
                this.$message({message: '短信验证码失效，请重新发送', duration: 3000, type: 'warning'})
              }
              post('/updatePassword', form, 0, 0).then((response) => {
                console.log(response)
                if (response.code === '0') {
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

<style acoped>
  .login-form {
    width: 350px;
    margin: 160px auto; /* 上下间距160px，左右自动居中*/
    background-color: rgb(255, 255, 255); /* 透明背景色 */
    padding: 30px;
    border-radius: 20px; /* 圆角 */
  }

  /* 背景 */
  .login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("../../assets/bj.jpg") no-repeat;
    background-size:100% 100%;
  }

  /* 标题 */
  .login-title {
    color: #303133;
    text-align: center;
  }
</style> -->
