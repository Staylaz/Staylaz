import {
  login,
  logout,
  getInfo
} from '@/api/admin'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        try {
          // creatWebsocket(state.token)
          this.dispatch('socket/webSocketInit',{token:state.token})
        } catch (err) {
          console.log(err)
        }

        const {
          roles,
          name,
          avatar,
          introduction
        } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {
          root: true
        })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {
      roles
    } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// function creatWebsocket(token) {
//   console.log('CREAT WEBSOCKET', token)
//   const that = this
//   var ws = new WebSocket({
//     url: 'wss://api.huloot.io',
//     // url: "ws://127.0.0.1:6088",
//     path: '/ws',
//     header: {
//       'access-token': token
//     }
//   })
//   console.log(ws)
//   ws.on('connect', function () {
//     console.log('ws connect success')
//     ws.off('connect')
//   })

//   ws.on('error', function (e) {
//     var msg = e.detail
//     if (msg == 'authentication error') {
//       // that.loading.end();
//       // that.toast("login_failed");
//     }
//   })

//   ws.on('disconnect', function (e) {
//     that.disconnectStatus = 1
//     setTimeout(function () {
//       if (that.disconnectStatus == 1) {
//         that.disconnectStatus = 2
//         // that.toast("error_disconnect", false);
//       }
//     }, 2000)
//   })

//   ws.on('reconnect', function (e) {
//     if (that.disconnectStatus == 2) {
//       // that.toast("reconnect");
//       // that.stableScene.onRefresh(true);
//     }
//     that.disconnectStatus = 0
//   })

//   ws.load()
// }
