const state = {
  instance: null,
  user: null
}

const mutations = {
  INSTANCE (state, d) {
    state.instance = d
  },
  USER (state, d) {
    state.user = d
  }
}

const actions = {
  init ({ commit }, data) {
    commit('INSTANCE', data.wechaty)
    commit('USER', data.user)
  }
}

export default {
  state,
  mutations,
  actions
}
