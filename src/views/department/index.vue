<template>
  <div class="container">
    <div class="app-container">
      <!-- default-expand-all 默认展开所有子节点 -->
      <el-tree :default-expand-all="true" :expand-on-click-node="false" :data="depts" :props="defaultProps">
        <!-- 节点结构 -->
        <!-- v-slot="{node: data}" 只能作用在template标签 -->
        <template v-slot="{ data }">
          <el-row style="width: 100%;height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  Operation<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">Add sub-department</el-dropdown-item>
                  <el-dropdown-item command="edit">Edit this department</el-dropdown-item>
                  <el-dropdown-item command="delete">Delete this department</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层组件 -->
    <!-- .sync 表示会接受子组件的事件 update:showDialog, 值 =>show-dialog -->
    <!-- ref 可以获取dom的示例对象 也可以获取自定义组件的实例对象 -->
    <operate-dept ref="operateDept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, deleteDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import operateDept from './components/operate-dept.vue'
export default {
  name: 'Department',
  components: { operateDept },
  data() {
    return {
      currentNodeId: null, // 存储当前点击节点的id
      showDialog: false, // 控制弹层的显示和隐藏
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = transListToTreeData(result, 0)
    },
    operateDept(type, id) {
      if (type === 'add') {
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
      } else if (type === 'edit') {
        this.showDialog = true
        this.currentNodeId = id // 记录id 获取数据
        // 更新props数据 - 异步动作
        // 直接调用子组件方法 - 同步动作
        // 子组件如果直接调用方法 拿不到更新完之后的数据
        // this.$nextTick 等到数据更新完毕之后执行操作
        this.$nextTick(() => {
          // 在子组件获取数据
        // 父组件调用子组件的方法获取数据
          this.$refs.operateDept.getDepartmentDetail() // this.$refs.operationDept等同于子组件的this
        })
      } else {
        // 删除部门
        this.$confirm('Are you sure you want to delete the department').then(async() => {
          await deleteDepartment(id)
          // 提示消息
          this.$message.success('Department deleted successfully')
          // 重新拉取数据
          this.getDepartment()
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 80px;
  display: inline-block;
  margin: 10px;
}
</style>
