<template>
  <div id="sidebar">
    <header>
      管理群组
      <el-button type="primary" size="mini" @click="addGroup">添加</el-button>
    </header>
    <div class="ui middle aligned divided list">
      <div class="item" :class="currentIndex==index?'active':''" v-for="(item, index) in groups" @click="groupSelect(index)">
        {{item.name}}
        <el-button-group>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="uninstall(index)">删除</el-button>
          <el-button type="warning" size="mini" v-if="!item.disable" @click="disable(index)">禁用</el-button>
          <el-button type="success" size="mini" v-if="item.disable" @click="enable(index)">启用</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  computed: {
    groups () {
      return this.$store.state.Config.groups
    },
    currentIndex () {
      return this.$store.state.Config.currentIndex
    }
  },
  methods: {
    addGroup () {
      this.$emit('showDialog')
    },
    groupSelect (i) {
      this.$store.commit('CURRENT_INDEX', i)
    },
    uninstall (i) {
      const newgroups = this.groups.concat()
      newgroups.splice(i, 1)
      this.$store.commit('GROUPS', newgroups)
    },
    disable (i) {
      this.$store.commit('DISABLE', i)
    },
    enable (i) {
      this.$store.commit('ENABLE', i)
    }
  }
}
</script>

<style scoped>
header{
  position: relative;
  background-color: #909399;
  padding: 0.5rem;
  vertical-align: middle;
  font-size: 0.8em;
}
header>button{
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.ui.list>.item{
  display: list-item;
  padding: 0.5em 0.2em;
  line-height: 1em;
  overflow: hidden;
}
.ui.divided.list>.item {
  border-top: 1px solid rgba(34,36,38,.15)
}
.item.active{
  background-color: rgba(100,100,100,0.2);
}
.item .button-group{
  float: right;
}
</style>
