<template>
  <div id="app">
    <!-- 一级路由容器
      对应 router/index.js下面的一级路由（/login, /404 ...）
      每一个一级路由对应相应的组件
    -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
