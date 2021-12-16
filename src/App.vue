<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    // setInterval(this.WebSocket_StatusCheck, 3000)
    const socket = io("wss://api.huloot.io", {
      path: "/ws",
      query: {
        "access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTYzOTYyNzMxOSwiZXhwIjoxNjM5ODg2NTE5fQ.Gj8MOcqvSa4BhFI3HP9iORudUeP4L9Orh5y25Zw7988",
      },
    });
    this.WebSocketINI();
  },
  methods: {
    WebSocketINI() {
      let that = this;
      this.ws = new WebSocket({
        url: serverUrl,
        path: "/ws",
        header: this.user.getHeader(),
      });

      this.ws.on("connect", function () {
        game.method = "ws";

        console.log("ws connect");
        that.ws.off("connect");

        that.ws.onBroadcase("news", function (data) {
          that.newsComponent.pushMsg(data);
        });

        that.load(res, action);
      });

      this.ws.on("error", function (e) {
        var msg = e.detail;
        if (msg == "authentication error") {
          that.loading.end();
          that.toast("login_failed");
        }
      });

      this.ws.on("disconnect", function (e) {
        that.disconnectStatus = 1;
        setTimeout(function () {
          if (that.disconnectStatus == 1) {
            that.disconnectStatus = 2;
            that.toast("error_disconnect", false);
          }
        }, 2000);
      });

      this.ws.on("reconnect", function (e) {
        if (that.disconnectStatus == 2) {
          that.toast("reconnect");
          that.stableScene.onRefresh(true);
        }
        that.disconnectStatus = 0;
      });

      this.ws.load();
    },

    // // 1、WebSocket连接状态检测：
    //   WebSocket_StatusCheck() {
    //     if (!this.$WebSocket.WebSocketHandle || this.$WebSocket.WebSocketHandle.readyState !== 1) {
    //       console.log('Websocket连接中断，尝试重新连接:')
    //       this.WebSocketINI()
    //     }
    //   },

    //   // 2、WebSocket初始化：
    //   async WebSocketINI() {
    //     // 1、浏览器是否支持WebSocket检测
    //     if (!('WebSocket' in window)) {
    //       console.log('您的浏览器不支持WebSocket!')
    //       return
    //     }

    //     // 2、从后台提取WebScoket服务器连接地址：根据自己业务接口获取 或者直接跳过 下面直接写死
    //     // const tmpResource = await this.$Api.Resource.Get('OtherSets_WebSocket_Address').then(res => {
    //     //   return res
    //     // })
    //     // const tmpWebsocketSrverAddress = tmpResource.value//可以直接赋值如：ws://127.0.0.1:1234
    //     const tmpWebsocketSrverAddress = 'wss://api.huloot.io';//可以直接赋值如：ws://127.0.0.1:1234

    //     // 3、创建Websocket连接
    //     const tmpWebsocket = new WebSocket(tmpWebsocketSrverAddress)

    //     // 4、全局保存WebSocket操作句柄：main.js 全局引用
    //     this.$WebSocket.WebsocketINI(tmpWebsocket)

    //     // 5、WebSocket连接成功提示
    //     tmpWebsocket.onopen = function(e) {
    //       console.log('webcoket连接成功')
    //     }

    //   //6、连接失败提示
    //     tmpWebsocket.onclose = function(e) {
    //       console.log('webcoket连接关闭：', e)
    //     }
    //   }
  },
};
</script>

<style lang="scss"></style>

