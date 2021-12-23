<template>
  <div class="batch-chat-container">
    <div class="top-bar">
      <span class="is-active">Send</span>
      <span>Other</span>
    </div>

    <div class="chat-record-box">
      <div class="send-success" v-show="1">
        <img src="../../assets/svg/bacthsed.svg" alt="" />
        <p>Success</p>
      </div>

      <!-- <div class="chat-record-list">
        <div class="record-item" v-for="(item,index) in 20" :key="index"></div>
      </div> -->
    </div>

    <div class="chat-input-box">
      <div class="file-link-bar">
        <el-popover
          v-model="emoticonsPopoverVisible"
          class="emoticons-popover"
          placement="top"
          width="350"
          trigger="click"
        >
          <div class="emoticons-content">
            <el-tabs
              class="emoticons-tabs"
              type="border-card"
              tab-position="bottom"
            >
              <el-tab-pane>
                <img
                  slot="label"
                  src="../../assets/svg/emoticons.svg"
                  alt=""
                  class="nav-icon"
                />
                <VEmojiPicker v-show="1" @select="selectEmoji" />
              </el-tab-pane>
              <el-tab-pane>
                <img
                  slot="label"
                  class="nav-icon"
                  src="../../assets/svg/sticker.svg"
                  alt=""
                />
              </el-tab-pane>
            </el-tabs>
          </div>
          <img slot="reference" src="../../assets/svg/emoticons.svg" alt="" />
        </el-popover>
        <img src="../../assets/svg/document.svg" alt="" />
        <img src="../../assets/svg/picture.svg" alt="" />
      </div>
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="5"
        placeholder="Please enter content"
        resize="none"
        :autofocus="true"
      />
      <div class="chat-buttons">
        <el-button type="primary" @click="sendMessage">Send</el-button>
      </div>
    </div>

    <el-dialog
      title="Tips"
      :visible.sync="sendStatusDialogVisible"
      width="30%"
      center
    >
      <span>Send failed user: <i>11</i> <i>122</i></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendStatusDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendStatusDialogVisible = false"
          >Resend</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";
export default {
  components: {
    VEmojiPicker,
  },
  data() {
    return {
      emoticonsPopoverVisible: false,
      ws: this.$store.state.socket.ws,
      chatUsersData: {},
      textarea: "",
      sendStatusDialogVisible: false,
    };
  },
  created() {
    this.getChatData();
  },
  methods: {
    selectEmoji(emoji) {
      this.textarea = this.textarea + emoji["data"];
      this.emoticonsPopoverVisible = false;
    },

    getChatData() {
      const that = this;
      this.ws
        .emit(
          "telegram",
          {
            action: "chat",
          },
          function (code, msg, data) {
            console.log("UPDATE USERS", data);
            data.users.map((user) => {
              that.chatUsersData[user.userid] = user;
            });
          }
        );
    },

    sendMessage() {
      this.$parent.batchSendMessage(this.textarea, () => {
        this.textarea = "";
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.batch-chat-container {
  height: 100%;
  box-sizing: border-box;
  margin: 0 2px;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  .top-bar {
    width: 100%;
    height: 41px;
    background-color: #f2f3f5;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1px;
    span {
      display: inline-block;
      line-height: 41px;
      width: 112px;
      text-align: center;
    }

    .is-active {
      background-color: #fff;
    }
  }

  .chat-input-box {
    width: 100%;
    height: 24.8%;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    .file-link-bar {
      width: 100%;
      height: 17%;
      box-sizing: border-box;
      padding: 0 12px;
      display: flex;
      align-items: center;

      img {
        width: 30px;
        margin-right: 5px;
      }
      img:nth-child(3) {
        width: 22px;
        margin-left: 4px;
      }
    }
    .el-textarea {
      width: 100%;
      height: 45%;
      //  background-color: rgb(146, 52, 52);
      .el-textarea__inner {
        border: 0px solid #000;
        //   padding: 5px 15px 30px !important;
      }
      textarea {
        border: 0px solid #000;
      }
    }

    .chat-buttons {
      width: 100%;
      //   height: 30%;
      box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      flex-direction: row-reverse;
    }

    .el-textarea ::v-deep .el-textarea__inner {
      border: 0px solid #000;
      box-sizing: border-box;
      height: 100%;
    }

    //   padding: 0 16px;
    //          position: absolute;
    //         left: 50%;
    //         top: 50%;
    //         transform: translate(-50%,-50%);
  }

  .chat-record-box {
    width: 100%;
    flex: 1;
    margin: 1px 0;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 16px 0;
    position: relative;
    .send-success {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        width: 80%;
      }
      p {
        font-size: 30px;
        color: rgb(76, 163, 117);
      }
    }
    // .chat-record-list {
    //   width: 100%;
    //   height: 100%;
    //   overflow-y: auto;

    //   .record-item {
    //     width: 100%;
    //     padding: 12px;
    //     border-radius: 12px;
    //     background-color: #f5f5f5;
    //     margin-bottom: 10px;
    //   }
    // }
  }
}

.emoticons-content {
  width: 100%;
  height: 480px;
  .nav-icon {
    width: 30px;
    margin-top: 4px;
  }
}
.emoticons-tabs::v-deep .el-tabs__content {
  padding: 0;
}

.emoticons-popover {
  padding: 0;
}
</style>