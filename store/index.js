export const state = () => ({
  // state for recommender
  forYouData: null,

  // state for works
  worksData: null,
  workData: null,
  workReaders: null,
  workLikeBy: null,
  workRateBy: null,

  // state for users
  usersData: null,
  userData: null,
  newReadList: null
})

export const mutations = {
  // mutation for recommender
  setForYou (state, data) {
    state.forYouData = data
  },

  // mutation for Works
  setWorks (state, data) {
    state.worksData = data
  },
  setWork (state, data) {
    state.workData = data
  },
  updateReaders (state, data) {
    const newData = data.readers.filter(
      (item) => item._id !== state.userData.id
    )
    newData.unshift(state.userData.id)
    state.workReaders = newData
  },
  updateLikeBy (state, data) {
    const newData = data.like_by.filter(
      (item) => item._id !== state.userData.id
    )
    newData.unshift(state.userData.id)
    state.workLikeBy = newData
  },
  updateRateBy (state, rating) {
    const newData = state.workData.rate_by.filter(
      (item) => item.user_id !== state.userData.id
    )
    newData.unshift({ user_id: state.userData.id, rating })
    state.workData.rate_by = newData
  },
  removeLikeBy (state, data) {
    const newData = data.like_by.filter(
      (item) => item._id !== state.userData.id
    )
    state.workLikeBy = newData
  },

  // mutation for Users
  setUsers (state, data) {
    state.usersData = data
  },
  setUser (state, data) {
    state.userData = data
  },
  updateReadList (state, data) {
    const newData = state.userData.read_list.filter((item) => item._id !== data)
    newData.unshift(data)
    state.newReadList = newData
  },
  updateLikeList (state, data) {
    const newData = state.userData.like_list.filter((item) => item._id !== data)
    newData.unshift(data)
    state.userData.like_list = newData
  },
  updateRateList (state, rating) {
    const newData = state.userData.rate_list.filter(
      (item) => item.work_id !== state.workData.id
    )
    newData.unshift({ work_id: state.workData.id, rating })
    state.userData.rate_list = newData
  },
  removeLikeList (state, data) {
    const newData = state.userData.like_list.filter((item) => item._id !== data)
    state.userData.like_list = newData
  }
}

export const actions = {
  // action for recommender
  getForYou ({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/user_recommenders/' + state.userData.id)
        .then((response) => {
          commit('setForYou', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  updateRecommender ({ state, commit }, rating) {
    return new Promise((resolve, reject) => {
      // commit('updateRecommender', rating)
      this.$axios
        .put('/user_recommenders', {
          work_id: state.workData.id,
          user_id: state.userData.id,
          rating
        })
        .then((response) => {
          // commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },

  // action for works
  // getWorks ({ commit }, { page = 1, limit = 12 } = {}) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios.get('/works', {
  //       params: {
  //         sortBy: 'newest',
  //         page,
  //         limit
  //       }
  //     })
  //     .then(response => {
  //       commit('setWorks', response.data.works) // sesuaikan sesuai respons dari backend
  //       resolve(response.data)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data from API:', error)
  //       reject(error)
  //     })
  //   })
  // },

  getWorks ({ commit }, { page = 1, limit = 12, category = '' } = {}) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/works', {
          params: {
            sortBy: 'newest',
            page,
            limit,
            category // tambahkan ini
          }
        })
        .then((response) => {
          commit('setWorks', response.data.works) // opsional
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  //
  // // //
  getWorkById ({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/works/' + id)
        .then((response) => {
          commit('setWork', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  updateReaders ({ state, commit }, work) {
    return new Promise((resolve, reject) => {
      commit('updateReaders', work)
      this.$axios
        .put(`/works/${work.id}`, { readers: state.workReaders })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  updateLikeBy ({ state, commit }, work) {
    return new Promise((resolve, reject) => {
      commit('updateLikeBy', work)
      this.$axios
        .put(`/works/${work.id}`, { like_by: state.workLikeBy })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  updateRateBy ({ state, commit }, rating) {
    return new Promise((resolve, reject) => {
      commit('updateRateBy', rating)
      this.$axios
        .put(`/works/${state.workData.id}`, { rate_by: state.workData.rate_by })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  removeLikeBy ({ state, commit }, work) {
    return new Promise((resolve, reject) => {
      commit('removeLikeBy', work)
      this.$axios
        .put(`/works/${work.id}`, { like_by: state.workLikeBy })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  postWork ({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/works', data)
        .then((response) => {
          console.log(response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  updateWork ({ commit }, work) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/works/${work.id}`, work)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error updating work:', error)
          reject(error)
        })
    })
  },
  deleteWork ({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/works/' + id)
        .then((response) => {
          console.log(response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },

  // action for users
  getUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/users')
        .then((response) => {
          commit('setUsers', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  getUserById ({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/users/' + id)
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  getUser ({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/users/' + id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data from API:', error)
          reject(error)
        })
    })
  },
  updateReadList ({ state, commit }, workId) {
    return new Promise((resolve, reject) => {
      commit('updateReadList', workId)
      this.$axios
        .put(`/users/${state.userData.id}`, { read_list: state.newReadList })
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  updateLikeList ({ state, commit }, workId) {
    return new Promise((resolve, reject) => {
      commit('updateLikeList', workId)
      this.$axios
        .put(`/users/${state.userData.id}`, {
          like_list: state.userData.like_list
        })
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  updateRateList ({ state, commit }, rating) {
    return new Promise((resolve, reject) => {
      commit('updateRateList', rating)
      this.$axios
        .put(`/users/${state.userData.id}`, {
          rate_list: state.userData.rate_list
        })
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  removeLikeList ({ state, commit }, workId) {
    return new Promise((resolve, reject) => {
      commit('removeLikeList', workId)
      this.$axios
        .put(`/users/${state.userData.id}`, {
          like_list: state.userData.like_list
        })
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  regis ({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users', {
          username: data.username,
          pen_name: data.username,
          password: data.password
        })
        .then((response) => {
          console.log(response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  login ({ commit }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/users/login', {
          username: data.username,
          password: data.password
        })
        .then((response) => {
          commit('setUser', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  }
}

export const getters = {
  works (state) {
    return state.worksData
  },
  foryou (state) {
    return state.forYouData
  },
  work (state) {
    return state.workData
  },
  users (state) {
    return state.usersData
  },
  me (state) {
    return state.userData
  }
}
