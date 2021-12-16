<template>
  <div class="chat-container">
    <div class="top-bar">
      <span class="is-active">Chat</span>
      <span>File</span>
    </div>

    <div class="status-box">
      <div v-show="0" class="add-contract">
        <span>Add to contracts</span>
        <el-button size="small" type="primary">Contract</el-button>
      </div>

      <div class="contract-info">
        <div class="information-box">
          <el-breadcrumb separator-class="el-icon-minus">
            <el-breadcrumb-item>A00001</el-breadcrumb-item>
            <el-breadcrumb-item>Address</el-breadcrumb-item>
          </el-breadcrumb>

          <div class="input-box">
            <el-input
              v-model="input"
              placeholder="Please enter user address"
              size="mini"
            />
            <el-button size="mini" type="primary">Confirm</el-button>
          </div>
        </div>

        <div class="tag-box">
          <el-tag
            v-for="tag in userTags"
            :key="tag"
            closable
            :disable-transitions="false"
            size="mini"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="mini"
            @click="showInput"
            >+ New Tag
          </el-button>
        </div>
      </div>
    </div>

    <div class="chat-box">
      <div class="chat-content">
        <div class="chat-record-list">
          <div
            v-for="(item, index) in $parent.chatRecord"
            :key="index"
            class="chat-record-item"
            :class="{ 'mine-message-item': item.senderid !== item.userid }"
          >
            <div class="head-box">
              <img
                v-if="item.senderid !== item.userid"
                src="https://hbimg.huabanimg.com/3f2935be7c51fd34d37d6aa4c83f0f0ad81a1eb4d0e0-Wg4Qpa_fw1200"
                alt=""
              />
              <img
                v-else
                src="https://hbimg.huabanimg.com/ede884350cc5d6825f786a6bd8addc5383e11e749dd0-bqteB7_fw1200"
                alt=""
              />
            </div>

            <div class="message-content">
              <p class="name">{{ item.senderid }}</p>
              <p class="message">
                <!-- <img src="" alt=""> -->
                <span>{{ item.message }}</span>
                <!-- <el-image
                  style="width: 100px; height: 100px"
                  src="https://hbimg.huabanimg.com/a939f3ff0d6945d6f6736d08ddde7518bc5b2bc51a6dc-34dwbk"
                  :preview-src-list="[
                    'https://hbimg.huabanimg.com/a939f3ff0d6945d6f6736d08ddde7518bc5b2bc51a6dc-34dwbk',
                  ]"
                >
                </el-image> -->
                <span class="time">{{
                  timestampTo12Hour(item.timestamp)
                }}</span>
              </p>
            </div>
          </div>
        </div>
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
    </div>
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";
import timestampTo12Hour from "@/utils/utils";

export default {
  name: "Contract",
  components: {
    VEmojiPicker,
  },

  data() {
    return {
      userTags: [],
      inputVisible: false,
      inputValue: "",
      textarea: "",
      chatModel: "private", // batchSending，
      srcList: [
        "https://hbimg.huabanimg.com/a939f3ff0d6945d6f6736d08ddde7518bc5b2bc51a6dc-34dwbk",
      ],
      emoticonsPopoverVisible: false,
      // activeUserID:$parent.activeUserID,
    };
  },

  methods: {
    toggleBatchChat() {
      this.$store.dispatch("app/toggleSideBar"); // TODO
    },

    handleClose(tag) {
      this.userTags.splice(this.userTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        this.userTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    onInput(event) {
      // 事件。数据包含文本区域的值
    },

    clearTextarea() {
      this.$refs.emoji.clear();
    },

    selectEmoji(emoji) {
      this.textarea = this.textarea + emoji["data"];
      this.emoticonsPopoverVisible = false;
      console.log(this.textarea);
    },

    sendMessage() {
      this.$parent.sendMessage(this.textarea, () => {
        this.textarea = null;
      });
    },

    timestampTo12Hour(timestamp) {
     return timestampTo12Hour(timestamp);
    },
  },
};
</script>

<style lang='scss' scoped>
.chat-container {
  height: 100%;
  box-sizing: border-box;
  margin: 0 2px;
  flex: 1;
  display: flex;
  flex-direction: column;

  .top-bar {
    width: 100%;
    height: 41px;
    background-color: #f2f3f5;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;

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

  .status-box {
    padding: 16px 16px 4px;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    color: rgb(151, 151, 151);
    font-size: 14px;
    .add-contract {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contract-info {
      width: 100%;
      .information-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgb(151, 151, 151);

        .input-box {
          width: 50%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          .el-input {
            width: 80%;
          }
        }
      }
      .tag-box {
        width: 100%;
        padding-top: 16px;
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
    }
  }

  .chat-box {
    width: 100%;
    height: 84%;
    margin-top: 1px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // position: relative;

    .chat-content {
      width: 100%;
      height: 75%;
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 16px;
      overflow-y: auto;
      .chat-record-list {
        width: 100%;
        padding-bottom: 30px;
        .chat-record-item {
          // width: 100%;
          // background-color: rgb(221, 238, 66);
          //background-color: rgb(228, 89, 89);
          padding: 0 10px;
          box-sizing: border-box;
          // background-color: rgb(199, 71, 71);
          margin-top: 16px;
          box-sizing: border-box;
          // padding: 0 25% 0 0;
          position: relative;

          // max-width: 80%;
          // display: flex;
          .head-box {
            width: 40px;
            height: 40px;
            // background-color: rgb(160, 53, 53);
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
          }

          .message-content {
            display: inline-block;
            background-color: #f2f3f5;
            border-radius: 10px;
            padding: 4px 10px;
            // margin-left: 10%;
            margin-top: -30px;
            margin-left: 50px;
            .name {
              // width: 100%;
              margin: 8px 0 4px;
              font-size: 14px;
              font-weight: 500;
            }
            .message {
              margin: 0;
              font-size: 14px;
              line-height: 20px;
              padding-bottom: 20px;
              min-width: 80px;
              max-width: 500px;
              position: relative;
              .time {
                color: rgb(105, 105, 105);
                white-space: nowrap;
                font-style: italic;
                position: absolute;
                right: 0;
                bottom: 1%;
                font-size: 8px;
              }
            }
          }
        }
        .mine-message-item {
          text-align: right;
          .head-box {
            left: 100%;
            transform: translate(-100%, 0);
          }

          .message-content {
            text-align: left;
            // margin-top: -30px;
            margin-right: 50px;
          }
          .name {
            text-align: right;
          }
        }
      }
    }

    .chat-input-box {
      width: 100%;
      height: 24.8%;
      background-color: #fff;
      box-sizing: border-box;
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
  }
}

.information-box ::v-deep .el-breadcrumb__separator {
  transform: rotate(90deg);
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
