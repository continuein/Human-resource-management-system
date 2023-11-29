<!-- eslint-disable vue/no-unused-components -->
<template>
  <div class="container">
    <div class="app-container">
      <div class="new-role">
        <el-button size="mini" type="primary" @click="showDialog = true">New role</el-button>
      </div>
      <el-table :data="rolesList">
        <el-table-column prop="name" align="center" width="200" label="Role">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="Enable">
          <template v-slot="{ row }">
            <!-- 开1关0 -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state === 1 ? 'Enabled' : row.state === 0 ? 'Not enabled' : 'None' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="Description">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="operation">
          <template v-slot="{ row }">
            <!-- 编辑状态 -->
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="editOk(row)">Confirm</el-button>
              <el-button size="mini" @click="row.isEdit = false">Cancel</el-button>
            </template>
            <!-- 非编辑状态 -->
            <template v-else>
              <el-button type="text" size="mini">AssignPermissions</el-button>
              <el-button type="text" size="mini" @click="editRow(row)">Edite</el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm title="Are you sure you want to delete this role's information?" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left: 10px;" size="mini" type="text">Delete</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px;" align="middle" justify="end">
        <el-pagination :page-size="pagination.pagesize" :current-page="pagination.page" :total="pagination.total" layout="prev, pager, next" @current-change="changePage" />
      </el-row>
    </div>
    <!-- 防止弹层 -->
    <el-dialog width="600px" title="New Role" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="operateRole" :model="roleForm" :rules="rules" label-width="150px">
        <el-form-item prop="name" label="Role Name">
          <el-input v-model="roleForm.name" style="width: 350px;" size="mini" />
        </el-form-item>
        <el-form-item prop="state" label="Enable">
          <!-- 如果不需要校验 就不需要写prop属性 -->
          <!-- 但是重置表单数据还是需要prop属性 -->
          <el-switch v-model="roleForm.state" active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="Role Description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 350px;" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOk">Confirm</el-button>
              <el-button size="mini" @click="btnCancel">Cancel</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRolesList, addRole, updateRole, deleteRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false, // 控制弹层显示隐藏
      rolesList: [],
      pagination: {
        page: 1, // 当前页码
        pagesize: 5, // 每页条数
        total: 0 // 总数
      },
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: 'Role name can not empty', trigger: 'blur' }],
        description: [{ required: true, message: 'Role name can not empty', trigger: 'blur' }],
        state: 0
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { rows, total } = await getRolesList(this.pagination)
      this.rolesList = rows // 赋值数据
      this.pagination.total = total
      // 针对每一行数据添加一个编辑标记
      this.rolesList.forEach(item => {
        // item.isEdit = false // 添加一个属性用于记录编辑状态 初始值为false
        // 数据响应式问题 数据变化 试图更新
        // 添加的动态属性不具备响应式特点
        // this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象 添加的属性 添加响应式
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    // 切换分页时请求新的数据
    changePage(newPage) {
      this.pagination.page = newPage // 赋值当前页码
      this.getRolesList()
    },
    btnOk() {
      this.$refs.operateRole.validate(async isOk => {
        if (isOk) {
          await addRole(this.roleForm)
          this.$message.success('Add role successfully')
          this.getRolesList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.operateRole.resetFields()
      this.showDialog = false
    },
    editRow(row) {
      row.isEdit = true // 改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.description = row.description
      row.editRow.state = row.state
    },
    async editOk(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('Update role successfully')
        // 更新现实的数据，推出编辑状态
        // row.name = row.editRow.name
        // Object.assign(目标, 来源)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        })
      } else {
        this.$message.warning('The role name or dexcription can not empty')
      }
    },
    async confirmDel(id) {
      await deleteRole(id)
      this.$message.success('Delete Role successfully')
      // 如果删除最后一个 在当前页已经删完了 page - 1
      if (this.rolesList.length === 1) this.pagination.page--
      this.getRolesList()
    }
  }
}
</script>
<style>
.new-role {
  margin: 20px;
}
</style>
