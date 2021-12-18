class WebSocket {
  constructor(option) {
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
    this.socket.on('connect', function () {
      console.log('ws connect Success', that.socket.id)
      that.onConnect()
    })

    this.socket.on('reconnect', function () {
      console.log('ws reconnect', that.socket.id)
      that.onReconnect()
    })

    this.socket.on('connect_error', function (err) {
      console.log('connect_error', err)
    })

    this.socket.on('error', function (err) {
      console.log('socket', err)
      that.onError(err)
    })

    this.socket.on('disconnect', function () {
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
    this.socket.emit(action, JSON.stringify(params), function (res) {
      console.log('ws emit', action, params, res)
      typeof cb === 'function' && cb(res.code, res.msg, res.data)
    })
  }

  onBroadcase(type, cb) {
    
  }

  onBroadcast(type, cb) {
    this.socket.on('broadcast', function (data) {
      data = JSON.parse(data)
      console.log("this.socket.on('broadcast'",data,data.action === type,data.data)
      if (data.action === type) {
        typeof cb === 'function' && cb(data.data)
      }
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
    delete this.events[event];
  }
  fire(event) {
    this.events[event] && this.events[event]()
  }
}

export default WebSocket;
// export default WebSocket;
