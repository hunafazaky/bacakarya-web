// NOTE on response shape: every endpoint returns { data, message, meta? }
// (see openapi.yaml). Every action below unwraps response.data.data (or
// .meta for pagination) - do NOT resolve/commit response.data directly,
// that's the whole envelope, not the resource.

export const state = () => ({
  // auth
  token: null,

  // recommender
  forYouData: null,

  // works
  worksData: null,
  workData: null,

  // users
  usersData: null,
  userData: null,
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },

  setForYou(state, data) {
    state.forYouData = data
  },

  setWorks(state, data) {
    state.worksData = data
  },
  setWork(state, data) {
    state.workData = data
  },

  setUsers(state, data) {
    state.usersData = data
  },
  setUser(state, data) {
    state.userData = data
  },

  // --- Disabled: no backing endpoint yet ---
  // The API only allows PUT /works/{id} to change title/cover/attachment/
  // text/category, and PUT /users/{id} to change pen_name/photo - neither
  // supports readers/like_by/read_list/like_list. Re-enable these once
  // there's a real endpoint for tracking reads/likes.
  //
  // updateReaders (state, data) {
  //   const newData = data.readers.filter(id => id !== state.userData.id)
  //   newData.unshift(state.userData.id)
  //   state.workReaders = newData
  // },
  // updateLikeBy (state, data) {
  //   const newData = data.like_by.filter(id => id !== state.userData.id)
  //   newData.unshift(state.userData.id)
  //   state.workLikeBy = newData
  // },
  // removeLikeBy (state, data) {
  //   state.workLikeBy = data.like_by.filter(id => id !== state.userData.id)
  // },
  // updateReadList (state, data) {
  //   const newData = state.userData.read_list.filter(id => id !== data)
  //   newData.unshift(data)
  //   state.newReadList = newData
  // },
  // updateLikeList (state, data) {
  //   const newData = state.userData.like_list.filter(id => id !== data)
  //   newData.unshift(data)
  //   state.userData.like_list = newData
  // },
  // removeLikeList (state, data) {
  //   state.userData.like_list = state.userData.like_list.filter(id => id !== data)
  // },
}

export const actions = {
  // --- Recommendations (was /user_recommenders) ---
  getForYou({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/recommendations/${state.userData.id}`)
        .then((response) => {
          const works = response.data.data
          commit('setForYou', works)
          resolve(works)
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error)
          reject(error)
        })
    })
  },
  updateRecommender({ state }, rating) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/recommendations', {
          work_id: state.workData.id,
          user_id: state.userData.id,
          rating,
        })
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          console.error('Error submitting rating:', error)
          reject(error)
        })
    })
  },

  // --- Works ---
  getWorks({ commit }, { page = 1, limit = 12, category = '' } = {}) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/works', {
          params: { page, limit, category },
        })
        .then((response) => {
          const works = response.data.data
          const total = response.data.meta?.total || 0
          commit('setWorks', works)
          // Normalized shape for callers (see mixins/workListScroll.js).
          resolve({ works, total })
        })
        .catch((error) => {
          console.error('Error fetching works:', error)
          reject(error)
        })
    })
  },
  getWorkById({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/works/' + id)
        .then((response) => {
          const work = response.data.data
          commit('setWork', work)
          resolve(work)
        })
        .catch((error) => {
          console.error('Error fetching work:', error)
          reject(error)
        })
    })
  },
  postWork({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/works', data)
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          console.error('Error creating work:', error)
          reject(error)
        })
    })
  },
  updateWork({ commit }, work) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/works/${work.id}`, work)
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          console.error('Error updating work:', error)
          reject(error)
        })
    })
  },
  deleteWork({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/works/' + id)
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          console.error('Error deleting work:', error)
          reject(error)
        })
    })
  },

  // --- Users ---
  getUsers({ commit }, params = {}) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/users', { params })
        .then((response) => {
          const users = response.data.data
          commit('setUsers', users)
          resolve(users)
        })
        .catch((error) => {
          console.error('Error fetching users:', error)
          reject(error)
        })
    })
  },
  getUserById({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/users/' + id)
        .then((response) => {
          const user = response.data.data
          commit('setUser', user)
          resolve(user)
        })
        .catch((error) => {
          console.error('Error fetching user:', error)
          reject(error)
        })
    })
  },
  regis({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users', {
          username: data.username,
          pen_name: data.username, // TODO: no pen_name field in the register form yet
          password: data.password,
        })
        .then((response) => resolve(response.data.data))
        .catch((error) => {
          console.error('Error registering:', error)
          reject(error)
        })
    })
  },
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users/login', {
          username: data.username,
          password: data.password,
        })
        .then((response) => {
          const { user, token } = response.data.data
          commit('setUser', user)
          commit('setToken', token)
          // Memory-only for now - attach it to the shared axios instance so
          // every subsequent request carries it. Lost on refresh until a
          // refresh-token/cookie flow exists on the backend.
          this.$axios.setToken(token, 'Bearer')
          resolve(user)
        })
        .catch((error) => {
          console.error('Error logging in:', error)
          reject(error)
        })
    })
  },
  logout({ commit }) {
    commit('setUser', null)
    commit('setToken', null)
    this.$axios.setToken(false)
  },

  // --- Disabled: no backing endpoint yet (see mutations above) ---
  // updateReaders ({ state, commit }, work) { ... PUT /works/{id} { readers } },
  // updateLikeBy ({ state, commit }, work) { ... PUT /works/{id} { like_by } },
  // removeLikeBy ({ state, commit }, work) { ... PUT /works/{id} { like_by } },
  // updateReadList ({ state, commit }, workId) { ... PUT /users/{id} { read_list } },
  // updateLikeList ({ state, commit }, workId) { ... PUT /users/{id} { like_list } },
  // removeLikeList ({ state, commit }, workId) { ... PUT /users/{id} { like_list } },
}

export const getters = {
  works(state) {
    return state.worksData
  },
  foryou(state) {
    return state.forYouData
  },
  work(state) {
    return state.workData
  },
  users(state) {
    return state.usersData
  },
  me(state) {
    return state.userData
  },
  token(state) {
    return state.token
  },
}
