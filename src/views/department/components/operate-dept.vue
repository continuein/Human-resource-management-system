<template>
  <el-dialog :title="showTitle" :visible="showDialog" :close-on-click-modal="false" @close="close">
    <el-form ref="operateDept" :model="formData" :rules="rules" label-width="160px">
      <el-form-item prop="name" label="Department name">
        <el-input v-model="formData.name" placeholder="2-10 characters" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="Department code">
        <el-input v-model="formData.code" placeholder="2-10 characters" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="Head of department">
        <el-select v-model="formData.managerId" placeholder="Please select the person in charge" style="width: 80%;" size="mini">
          <!-- 下拉选项 循环负责人数据  label 显示字段   value 存储字段 -->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id">{{ item.username }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="Introduction">
        <el-input v-model="formData.introduce" placeholder="1-100 characters" type="textarea" rows="4" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" style="margin-right: 50px;" @click="btnOk">Confirm</el-button>
            <el-button size="mini" @click="close">Cancel</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList: [], // 存储负责人列表
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 负责人
        name: '', // 部门名称
        pid: '' // 父级部门
      },
      rules: {
        code: [{
          required: true, message: 'The department code can not be empty', trigger: 'blur'
        }, {
          min: 2, max: 10, message: 'The length of the department code should be 2-10', trigger: 'blur'
        }, {
          validator: async(rule, value, callback) => {
            let result = await getDepartment()
            // 判断当前是否是编辑模式
            if (this.formData.id) {
              // 编辑场景
              result = result.filter(item => item.id !== this.formData.id)
            }
            // 检查数组中是否存在value
            if (result.some(item => item.code === value)) {
              callback(new Error('The code already exists'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        introduce: [{
          required: true, message: 'The introduction can not be empty', trigger: 'blur'
        }, {
          min: 1, max: 100, message: 'The length of the introduction should be 1-100', trigger: 'blur'
        }],
        managerId: [{
          required: true, message: 'The manager of department can not be empty', trigger: 'blur'
        }],
        name: [{
          required: true, message: 'The department can not be empty', trigger: 'blur'
        }, {
          min: 2, max: 10, message: 'The length of the department name should be 2-10', trigger: 'blur'
        }, {
          validator: async(rule, value, callback) => {
            let result = await getDepartment()
            // 判断当前是否是编辑模式
            if (this.formData.id) {
              // 编辑场景
              result = result.filter(item => item.id !== this.formData.id)
            }
            if (result.some(item => item.code === value)) {
              callback(new Error('The department name already exists'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? 'Edit Dept' : 'AddDept'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 修改父组件的值 子传父
      // resetFields只能重置在模板中绑定的数据 id不在模板数据中，无法重置
      // id手动置空
      this.formData = {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      }
      this.$refs.operateDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    btnOk() {
      this.$refs.operateDept.validate(async isOk => {
        if (isOk) {
          let msg = 'Add'
          if (this.formData.id) {
            // 编辑场景
            msg = 'Update'
            await updateDepartment(this.formData)
          } else {
            // 新增场景
            // ...延展运算符 将formData拷贝到一个新对象里面，并将currentNodeId替换为pid的值
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          // 通知父组件更新 子传父
          this.$emit('updateDepartment')
          this.$message.success(`${msg} department successfully`)
          this.close()
        }
      })
    },
    // 获取组织的详情
    async getDepartmentDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>
