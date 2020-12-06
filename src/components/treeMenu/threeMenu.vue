<template>
  <div>
    <template v-for="list in menuList">
      <el-submenu v-if="list.children" :key="list.resourceId" :index="list.resourceExtendAttr" :style="{minWidth: '200px', background: '#535c70'}">
        <template slot="title">
          <i class="el-icon-menu"></i>
          {{ list.text}}
        </template>
        <Menu :menuList="list.children" v-if="list.children"></Menu>
      </el-submenu>
      <el-menu-item v-else :index="list.resourceExtendAttr" :key="list.resourceId" @click="goPath(list)" :style="{minWidth: '200px', background: '#535c70'}">
          <i class="el-icon-location"></i>
          {{list.text}}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['menuList'],
  data () {
    return {}
  },
  methods: {
    goPath: function (list) {
      // this.$router.push({path: route})
      global.route = list.route
      global.name1 = list.parentName
      global.name2 = list.text
      global.active = list.resourceExtendAttr
      this.$eventBus.$emit('my-window-change', 'my-window-change msg')
    }
  }
}
</script>

<style>
  /*.el-menu--collapse  span,*/
  /*.el-menu--collapse  i.el-submenu__icon-arrow*/
  /*{*/
  /*height: 0;*/
  /*width: 0;*/
  /*overflow: hidden;*/
  /*visibility: hidden;*/
  /*display: inline-block;*/
  /*}*/

</style>
