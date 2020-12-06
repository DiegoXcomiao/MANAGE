<template>
  <div class="tree-menu">
    <!-- <ul class="tree-menu"> -->
    <li v-for="item in model" v-bind:key="item">
      <div @click='toggle'>
        <span v-if="!isFolder">{{item.text}}</span>

      </div>
      <!-- <div v-show="open">
          <router-link :to="item.route" v-if="item.route!='/main/networkSafe' && isFolder">{{item.text}}</router-link>
          <router-link tag="a" target="_blank" :to="{name:'networkSafes'}" v-if="item.route=='/main/networkSafe' && isFolder">{{item.text}}</router-link>
      </div>   -->
      <!-- <el-collapse-transition> -->
      <ul v-show="open" v-if="!isFolder">
        <menus :model="item.children"></menus>
      </ul>
      <!-- </el-collapse-transition> -->

    </li>
    <!-- </ul> -->
  </div>
</template>
<style scoped>
  .tree-menu {
    list-style: none;
  }

  .tree-menu li {
    line-height: 2;
  }

  .tree-menu li span {
    cursor: default;
  }
</style>
<script>
export default {
  name: 'menus',
  props: {
    model: Array
  },
  data () {
    return {
      openFolder: false,
      // isFolder: true,
      open: false
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.open = !this.open
      }
    }
  }
}
</script>
