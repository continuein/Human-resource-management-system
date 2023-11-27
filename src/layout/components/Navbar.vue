<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="name"> {{ name ? name.charAt(0) : '张' }} </span>
          <span class="username">{{ name ? name : '张三' }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Project Address</el-dropdown-item>
          </a>
          <!-- prevent 阻止默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>Modify the Password</el-dropdown-item>
          </a>
          <!-- divided 分割线 -->
          <!-- native 事件修饰符 注册组件的根元素的原生组件 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 防止 dialog -->
    <!-- sync 可以接收子组件传过来的事件和值 -->
    <!-- :close-on-click-modal="false" 取消点击弹框外部内容关闭对话框的功能 -->
    <!-- :modal-append-to-body="false" 取消弹框打开时整个页面变为灰色的效果 -->
    <el-dialog width="500px" title="Modify the Password" :close-on-click-modal="false" :visible.sync="showDialog" :modal-append-to-body="false" @close="btnCancel">
      <el-form ref="passForm" label-width="150px" :model="passForm" :rules="rules">
        <el-form-item label="Old Password" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOk">Confirm Modification</el-button>
          <el-button size="mini" @click="btnCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 显示弹层
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{
          required: true,
          message: 'The old password can not be empty',
          trigger: 'blur'
        }],
        newPassword: [{
          required: true,
          message: 'The new password can not be empty',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: 'The password should be between 6 and 16 characters long',
          trigger: 'blur'
        }],
        confirmPassword: [{
          required: true,
          message: 'The duplicate password can not be empty',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === this.passForm.newPassword) {
              callback()
            } else {
              callback(new Error('The duplicate password is inconsistent with the new password'))
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    // 引入头像和名称
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword() {
      // 弹出层
      this.showDialog = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push('login')
    },
    btnOk() {
      this.$refs.passForm.validata(async isOk => {
        if (isOk) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('Password changed successfully')
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      this.showDialog = false // 关闭弹层
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top:2px;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .name {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color: #fff;
          border-radius: 50%;
          margin-right: 5px;
        }
        .username {
          margin-right: 10px;
          font-size: 16px;
        }
        .el-icon-setting {
          cursor: pointer;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
