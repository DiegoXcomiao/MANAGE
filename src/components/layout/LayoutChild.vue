<template>
  <div clss="LayoutChild">
    <Breadcrumb :style="{margin: '18px 0'}">
      <BreadcrumbItem>{{name1}}</BreadcrumbItem>
      <BreadcrumbItem>{{name2}}</BreadcrumbItem>
    </Breadcrumb>
    <iframe :src="clientPath + route"
            frameborder="0" scrolling="auto"
            :style="{padding: '0px', minHeight: height + 'px', minWidth: '100%', buttom: '-100'}">
    </iframe>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data: function () {
    return {
      clientPath: '',
      route: '',
      name1: '',
      name2: '',
      height: 0
    }
  },
  methods: {},
  created: function () {
    console.log(global.userCode)
    this.route = global.route
    this.name1 = global.name1
    this.name2 = global.name2
    var system = require('../config/system.json')
    console.log(system.clientPath)
    console.log(system.serverPath)
    this.clientPath = system.clientPath
    var windowsHeight = window.innerHeight
    this.height = windowsHeight - 64 - 18 - 18 - 25
  },
  mounted () {
    this.$eventBus.$on('my-window-change', (val) => {
      console.log(val)
      console.log(global.userCode)
      this.route = global.route
      this.name1 = global.name1
      this.name2 = global.name2
      var windowsHeight = window.innerHeight
      this.height = windowsHeight - 64 - 18 - 18 - 25
      this.reload()
      global.flag = 1
    })
  }
}
</script>

<style scoped>

</style>
