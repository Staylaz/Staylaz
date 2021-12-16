// //websocket.js
// import Vue from 'vue'

// // 1、用于保存WebSocket 实例对象
// export const WebSocketHandle = undefined

// // 2、外部根据具体登录地址实例化WebSocket 然后回传保存WebSocket
// export const WebsocketINI = function(websocketinstance) {
//   this.WebSocketHandle = websocketinstance
//   this.WebSocketHandle.onmessage = OnMessage
// }

// // 3、为实例化的WebSocket绑定消息接收事件：同时用于回调外部各个vue页面绑定的消息事件
// // 主要使用WebSocket.WebSocketOnMsgEvent_CallBack才能访问  this.WebSocketOnMsgEvent_CallBack 无法访问很诡异
// const OnMessage = function(msg) {
//   // 1、消息打印
//   // console.log('收到消息：', msg)

//   // 2、如果外部回调函数未绑定 结束操作
//   if (!WebSocket.WebSocketOnMsgEvent_CallBack) {
//     console.log(WebSocket.WebSocketOnMsgEvent_CallBack)
//     return
//   }

//   // 3、调用外部函数
//   WebSocket.WebSocketOnMsgEvent_CallBack(msg)
// }

// // 4、全局存放外部页面绑定onmessage消息回调函数:注意使用的是var
// export const WebSocketOnMsgEvent_CallBack = undefined

// // 5、外部通过此绑定方法 来传入的onmessage消息回调函数
// export const WebSocketBandMsgReceivedEvent = function(receiveevent) {
//   WebSocket.WebSocketOnMsgEvent_CallBack = receiveevent
// }

// // 6、封装一个直接发送消息的方法：
// export const Send = function(msg) {
//   if (!this.WebSocketHandle || this.WebSocketHandle.readyState !== 1) {
//     // 未创建连接 或者连接断开 无法发送消息
//     return
//   }
//   this.WebSocketHandle.send(msg)// 发送消息
// }

// // 7、导出配置
// const WebSocket = {
//   WebSocketHandle,
//   WebsocketINI,
//   WebSocketBandMsgReceivedEvent,
//   Send,
//   WebSocketOnMsgEvent_CallBack
// }

// // 8、全局绑定WebSocket
// Vue.prototype.$WebSocket = WebSocket

class WebSocket {
  constructor(option) {
    console.log(option)
    this.header = option.header
    this.url = option.url
    this.path = option.path

    this.events = {}
  }

  load() {
    this.socket = io(this.url, {
      path: this.path,
      transports: ['websocket'],
      query: this.header,
      upgrade: false

    })

    console.log({
      path: this.path,
      transports: ['websocket'],
      query: this.header
    })
    // this.onConnect()
    console.log('socket', this.socket.id, this.header)
    var that = this
    this.socket.on('connect', function() {
      console.log('ws connect', that.socket.id)
      that.onConnect()
    })

    this.socket.on('reconnect', function() {
      console.log('ws reconnect', that.socket.id)
      that.onReconnect()
    })

    this.socket.on('connect_error', function(err) {
      console.log('connect_error', err)
      // that.onError(err)
    })
    this.socket.on('error', function(err) {
      console.log('socket', err)
      that.onError(err)
    })

    this.socket.on('disconnect', function() {
      console.log('you have been disconnected')
      that.onDisconnect()
    })
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  emit(action, params, cb) {
    this.socket.emit(action, JSON.stringify(params), function(res) {
      console.log('ws emit', action, params, res)
      typeof cb === 'function' && cb(res.code, res.msg, res.data)
    })
  }

  onBroadcase(type, cb) {
    console.log('onBroadcase', type)
    this.socket.on(type, function(data) {
      console.log('onBroadcase', type, data)
      cb(data)
    })
  }

  onConnect() {
    console.log('ws connect')
    this.fire('connect')
  }

  onReconnect() {
    console.log('ws reconnect')
    this.fire('reconnect')
  }

  onError(err) {
    console.log('ws error', err)
    this.fire('error', err)
  }

  onDisconnect() {
    this.fire('disconnect')
  }
  on(event, cb) {
    this.events[event] = cb
  }
  off(event) {
    delete this.events[event]
  }
  fire(event) {
    this.events[event] && this.events[event]()
  }
}

module.exports = WebSocket
// export default WebSocket;
