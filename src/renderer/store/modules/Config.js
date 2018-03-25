const state = {
  groups: [],
  currentIndex: -1
}

const mutations = {
  GROUPS (state, d) {
    state.groups = d
  },
  CURRENT_INDEX (state, i) {
    state.currentIndex = i
  },
  DISABLE (state, i) {
    state.groups[i].disable = true
  },
  ENABLE (state, i) {
    state.groups[i].disable = false
  }
}

export default {
  state,
  mutations
}
