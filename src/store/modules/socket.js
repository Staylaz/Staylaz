import WebSocket from "@/utils/websocket";

const state = {
  ws: null, //建立的连接
  lockReconnect: false, //是否真正建立连接
  timeout: 15000, //15秒一次心跳
  timeoutObj: null, //心跳心跳倒计时
  serverTimeoutObj: null, //心跳倒计时
  timeoutnum: null, //断开 重连倒计时
  msg: null //接收到的信息
}
const mutations = {
  webSocketInit(state, info) {
    
    let that = this;
    state.ws = new WebSocket(
     {
        url: process.env.VUE_APP_WEBSOCKET_URL,
        path: '/ws',
        header: {
          'access-token': info.token
        }
     });

    state.ws.onopen = function (res) {
      console.log("Connection success...");
      /**
       * 启动心跳检测
       */
      that.commit("start");
    }
    state.ws.onmessage = function (res) {
      if (res.data === "heartCheck") {
        // 收到服务器信息，心跳重置
        that.commit("reset");
        console.log("socket-heartCheck");
      } else {
        state.msg = res;
      }
    }
    state.ws.onclose = function (res) {
      console.log("Connection closed...");
      //重连
      that.commit('reconnect');
    }
    state.ws.onerror = function (res) {
      console.log("Connection error...");
      //重连
      that.commit('reconnect');
    }

    // state.ws.onBroadcast = function (res) {
    //   console.log("onBroadcast...");
    //   console.log(res) //TODO
    // }

    state.ws.load()
  },
  reconnect(state) {
    //重新连接
    let that = this;
    if (state.lockReconnect) {
      return;
    }
    state.lockReconnect = true;
    //没连接上会一直重连,30秒重试请求重连，设置延迟避免请求过多
    state.timeoutnum &&
      clearTimeout(state.timeoutnum);
    state.timeoutnum = setTimeout(() => {
      //新连接
      that.commit('webSocketInit')
      state.lockReconnect = false;
    }, 5000);
  },
  reset(state) {
    let that = this;
    clearTimeout(state.timeoutObj);
    clearTimeout(state.serverTimeoutObj);
    that.commit('start')
  },
  start(state) {
    var self = this;
    state.timeoutObj &&
      clearTimeout(state.timeoutObj);
    state.serverTimeoutObj &&
      clearTimeout(state.serverTimeoutObj);
    state.timeoutObj = setTimeout(() => {
      if (state.ws.readyState === 1) {
        //如果连接正常
        state.ws.send("heartCheck");
      } else {
        //否则重连
        self.commit('reconnect');
      }
      state.serverTimeoutObj = setTimeout(function () {
        //超时关闭
        state.ws.close();
      }, state.timeout);
    }, state.timeout);
  },
}
const actions = {
  webSocketInit({ commit }, info) {
    commit('webSocketInit', info)
  },
  webSocketSend({
    commit
  }, p) {
    commit('webSocketSend', p)
  }, 
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
