<template>
  <div id="home">
    <el-container>
      <el-aside width="200px">
        <sidebar v-on:showDialog="dialogFormVisible = true"></sidebar>
      </el-aside>
      <el-container>
        <el-header>
          <el-table
            :data="results"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="room"
              label="广播群"
              width="200">
              <template slot-scope="scope">
                <div class="item room">
                  <room-avatar :url="scope.row.room.rawObj.HeadImgUrl"></room-avatar>
                  <div class="content">
                    <div class="header" v-html="scope.row.room.rawObj.NickName"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="members"
              label="发言人">
              <template slot-scope="scope">
                <div class="ui relaxed horizontal list">
                  <div v-for="item in scope.row.members" :key="item.id" class="item">
                    <room-avatar :contact="item" :show="true"></room-avatar>
                    <div class="content">
                      <a class="header" v-html="item.rawObj.NickName"></a>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-header>
        <el-main>
          <el-table v-if="currentGroup"
            ref="roomsTable"
            :data="rooms"
            tooltip-effect="dark"
            style="width: 260px"
            height="100%"
            highlight-current-row
            @selection-change="roomSelectionChange"
            @row-click="roomSelect">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              label="微信群"
              width="200">
              <template slot-scope="scope">
                <div class="item room">
                  <room-avatar :url="scope.row.rawObj.HeadImgUrl"></room-avatar>
                  <div class="content">
                    <div class="header" v-html="scope.row.rawObj.NickName"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="members"
            ref="membersTable"
            :data="members"
            tooltip-effect="dark"
            style="width: 260px"
            height="100%"
            @selection-change="concatSelectionChange">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              label="群成员"
              width="220">
              <template slot-scope="scope">
                <div class="item" :key="scope.row.id">
                  <room-avatar :contact="scope.row" :show="true"></room-avatar>
                  <div class="content">
                    <div class="header" v-html="scope.row.rawObj.NickName"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="新管理组名称" :visible.sync="dialogFormVisible">
      <el-input v-model="groupName" auto-complete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import RoomAvatar from '@/components/RoomAvatar.vue'

export default {
  name: 'home',

  data () {
    return {
      dialogFormVisible: false,
      groupName: '',
      rooms: [],
      members: null,
      roomSelection: [],
      contactSelection: [],
      memberSelection: {},
      currentRoom: {},
      initSelection: false
    }
  },

  computed: {
    user () {
      return this.$store.state.Wechaty.user
    },
    groups () {
      return this.$store.state.Config.groups
    },
    currentGroup () {
      return this.groups[this.$store.state.Config.currentIndex]
    },
    results () {
      return this.roomSelection.map(room => {
        const row = {
          room,
          members: this.memberSelection[room.id] || []
        }
        return row
      })
    }
  },

  watch: {
    currentRoom (val, old) {
      this.initSelection = false

      this.members = val.memberList()
      this.members.map(member => {
        let nickName = member.rawObj.NickName
          .replace(/<img class="(\w*?emoji) (\w*?emoji[^"]+?)" text="(.*?)_web" src=[^>]+>/g, '<span class="$1 $2"></span>')
        member.rawObj.NickName = nickName
        member.room = this.currentRoom
      })
      this.$nextTick(_ => {
        this.initSelection = true
        this.contactSelection = this.memberSelection[val.id] || []
        this.contactSelection.forEach(item => {
          this.$refs.membersTable.toggleRowSelection(item, true)
        })
      })
    },
    results (val) {
      this.updateConfig(this.results)
    },
    contactSelection (val) {
      const result = this.results.find(item => item.room === this.currentRoom)
      if (result) {
        result.members = val
      }

      this.updateConfig(this.results)
    }
  },

  mounted () {
    const CBW = require('electron').remote.getCurrentWindow()
    CBW.setContentSize(1000, 600)
    CBW.setResizable(true)
    CBW.setMinimizable(true)
    CBW.setMaximizable(true)
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }

    this.$store.commit('GROUPS', [])

    const findAllRooms = require('electron').remote.getGlobal('findAllRooms')
    findAllRooms(null, (rooms) => {
      rooms.map(room => {
        let nickName = room.rawObj.NickName
          .replace(/<img class="(\w*?emoji) (\w*?emoji[^"]+?)" text="(.*?)_web" src=[^>]+>/g, '<span class="$1 $2"></span>')
        room.rawObj.NickName = nickName
      })
      this.rooms = rooms
    })
  },

  methods: {
    roomSelect (row) {
      this.currentRoom = row
      this.$refs.roomsTable.setCurrentRow(row)
    },
    roomSelectionChange (val) {
      this.roomSelection = val
    },
    concatSelectionChange (val) {
      if (this.initSelection) {
        this.memberSelection[this.currentRoom.id] = val
      }
      this.contactSelection = val
      if (val && val.length) {
        this.$refs.roomsTable.toggleRowSelection(this.currentRoom, true)
      }
    },
    addGroup () {
      const newgroups = this.groups.concat()
      newgroups.push({name: this.groupName, disable: true})
      this.$store.commit('GROUPS', newgroups)
      this.$store.commit('CURRENT_INDEX', this.groups.length - 1)
      this.dialogFormVisible = false
    },
    updateConfig (data) {
      this.currentGroup.rooms = data.map(item => {
        const row = {
          room: item.room
        }
        row.members = (item.members || []).map(item => {
          return item
        })
        return row
      })
    }
  },

  components: {
    Sidebar,
    RoomAvatar
  }
}
</script>

<style scoped>
aside{
  border-right: 1px solid rgba(0,0,0,0.2);
  box-shadow: -1px 1px 10px rgba(0,0,0,0.2) inset;
}
header{
  padding: 0;
  height: auto !important;
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
main{
  padding: 0;
  height: 100%;
}
.item>.ui.avatar.image{
  width: 2em;
  height: 2em;
  border-radius: 500rem;
}
.item.room>.ui.avatar.image{
  border-radius: 2px;
}
.item>.image+.content,
.item>img.image {
  display: inline-block;
  vertical-align: middle;
}
.el-table{
  float: left;
}
.ui.horizontal.list>.item {
  display: inline-block;
  margin: 0.5em;
}
.ui.horizontal.relaxed.list>.item:not(:last-child) {
  padding-right: 1rem;
}
</style>
<style>
.el-dialog__header{
  padding: 10px;
}
.el-dialog__body{
  padding: 0 10px;
}
.el-dialog__headerbtn{
  display: none;
}
</style>
