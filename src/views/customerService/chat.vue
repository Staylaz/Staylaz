<template>
  <div class="chat-container" v-if="$parent['activeUser']">
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
            <el-breadcrumb-item>
              {{ $parent["activeUser"]["userId"] }}</el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-for="address in $parent['activeUser']['user']['address'].split(
                ','
              )"
              :key="address"
              v-show="address.length > 20"
            >
              <el-tag type="success" size="mini">
                {{ address | addressFilter }}

                <el-popconfirm
                  title="Delete this address?"
                  confirm-button-text="Confirm"
                  cancel-button-text="Cancel"
                  @onConfirm="deleteUserAddress(address)"
                >
                  <i class="el-icon-close" slot="reference"></i>
                </el-popconfirm>
              </el-tag>
            </el-breadcrumb-item>
          </el-breadcrumb>

          <div class="input-box">
            <el-input
              v-model="inputAddressValue"
              placeholder="Please enter user address"
              size="mini"
            />
            <el-button size="mini" type="primary" @click="addUserAddress"
              >Confirm</el-button
            >
          </div>
        </div>

        <div class="tag-box">
          <el-tag
            v-for="tag in userTag"
            :key="tag"
            :disable-transitions="false"
            size="mini"
          >
            <!-- @close="handleClose(tag)" -->
            {{ tag }}
            <el-popconfirm
              title="Delete this tag?"
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              @onConfirm="deleteUserTag(tag)"
            >
              <i class="el-icon-close" slot="reference"></i>
            </el-popconfirm>
          </el-tag>
          <!-- <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="mini"
            @keyup.enter.native="handleInputConfirm"

          /> -->

          <el-tag
            size="mini"
            type="info"
            plain
            style="cursor: pointer"
            @click="tagDialogVisiable = true"
          >
            + Select tag
          </el-tag>
        </div>
      </div>
    </div>

    <div class="chat-box">
      <!-- 聊天内容 -->
      <div ref="chatMain" class="chat-content">
        <div class="chat-record-list">
          <div
            v-for="(item, index) in $parent.chatRecord"
            :key="index"
            class="chat-record-item"
            :style="item.senderId == 1?'flex: 1;text-align: right;':''"
            :class="{ 'mine-message-item': item.senderId !== item.userId }"
            v-show="item['timestamp']"
          >
            <div class="head-box" :style="item.senderId == 1?'float:right;margin-bottom:30px;':''">
              <div v-if="item.senderId === item.userId">
                <img
                  v-if="$parent.activeUser['photo']"
                  :src="$parent.activeUser['photo']"
                  alt=""
                />
                <div
                  class="name-abb"
                  :style="$parent.activeUser.bgcolor"
                  v-else
                >
                  <span v-if="$parent.activeUser.user['firstname']">{{
                    $parent.activeUser.user.firstname[0]
                  }}</span>
                  <span v-if="$parent.activeUser.user['lastname']">
                    {{ $parent.activeUser.user.lastname[0] }}</span
                  >
                </div>
              </div>

              <img v-else src="https://hbimg.huabanimg.com/301ec7f94fda5ef131788dacaa40a2904abe363d29e56-rlooy4_fw1200" alt="" />
            </div>

            <!-- <div class="head-box" style="float:right;" v-if="item.senderId == 1">
              <div v-if="item.senderid === item.userid">
                <img
                  v-if="$parent.activeUser['photo']"
                  :src="$parent.activeUser['photo']"
                  alt=""
                />
                <div
                  class="name-abb"
                  :style="$parent.activeUser.bgcolor"
                  v-else
                >
                  <span v-if="$parent.activeUser.user['firstname']">{{
                    $parent.activeUser.user.firstname[0]
                  }}</span>
                  <span v-if="$parent.activeUser.user['lastname']">
                    {{ $parent.activeUser.user.lastname[0] }}</span
                  >
                </div>
              </div>

              <img v-else :src="item['img']" alt="" />
            </div> -->

            <div class="message-content">
              <p class="name" v-if="item.senderId === item.userId">
                <span class="name"
                  >{{ $parent.activeUser.user.firstname }}
                  {{ $parent.activeUser.user.lastname }}</span
                >
                <span class="id">{{ item.senderId }}</span>
              </p>
              <p v-else></p>
              <p class="message">
                <!-- <img src="" alt=""> -->
                <span>{{ item.message }}</span>

                <!-- {{item.media.indexOf('photo')}} -->

                <el-image
                  v-show="item.media && item.media.indexOf('document') == -1"
                  style="width: 100px; height: 100px"
                  :src="item['img']"
                  :preview-src-list="[
                    'https://hbimg.huabanimg.com/a939f3ff0d6945d6f6736d08ddde7518bc5b2bc51a6dc-34dwbk',
                  ]"
                >
                </el-image>
                <tgs-player
                  v-show="item.media && item.media.indexOf('photo') == -1"
                  autoplay
                  loop
                  mode="normal"
                  :src="item['img']"
                >
                </tgs-player>

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
          v-model="sendMessageValue"
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

    <!-- DIALOG -->
    <el-dialog
      title="Select Tag"
      :visible.sync="tagDialogVisiable"
      width="530px"
      center
      class="tag-dialog"
    >
      <div class="tag-list">
        <el-tag
          v-for="tag in allUserTags"
          :key="tag"
          class="tag"
          :disable-transitions="false"
          type="info"
          plain
        >
          <el-checkbox
            :label="tag['desc']"
            :checked="tag['checked']"
            :disabled="tag['disabled']"
            @change="tag['checked'] = !tag['checked']"
          ></el-checkbox>
        </el-tag>
      </div>

      <div class="add-more-tag">
        <el-button
          type="primary"
          center
          size="small"
          round
          plain
          @click="showAddTagInput = true"
        >
          <i class="el-icon-edit"></i> Add more</el-button
        >

        <!-- <el-input
          placeholder="请输入内容"
          v-model="input3"
          class="input-with-select"
          v-else
        >
          <el-button slot="append" type="primary" >Add</el-button>
        </el-input> -->
      </div>

      <el-dialog
        width="30%"
        title="Add Tag"
        :visible.sync="showAddTagInput"
        append-to-body
        center
      >
        <el-input
          placeholder="Please enter a tag name"
          v-model="inputNewTagValue"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              showAddTagInput = false;
              inputNewTagValue = '';
            "
            >Cancel</el-button
          >
          <el-button type="primary" @click="addNewTag">Confirm</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tagDialogVisiable = false">Cancel</el-button>
        <el-button type="primary" @click="batchAddTags">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- DIALOG -->
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";
import timestampTo12Hour from "@/utils/utils";
import { getUserTags } from "@/api/user";
// import "@lottiefiles/lottie-player";

export default {
  name: "Contract",
  components: {
    VEmojiPicker,
  },

  data() {
    return {
      inputVisible: false,
      inputValue: "",
      sendMessageValue: "",
      inputAddressValue: "",
      chatModel: "private", // batchSending，
      srcList: [
        "https://hbimg.huabanimg.com/a939f3ff0d6945d6f6736d08ddde7518bc5b2bc51a6dc-34dwbk",
      ],
      emoticonsPopoverVisible: false,
      userHeadBg: null,
      tagDialogVisiable: false,
      showAddTagInput: false,
      // activeUserID:$parent.activeUserID,

      allUserTags: [],
      inputNewTagValue: "",
    };
  },

  created() {
    this.ceshi();
    if (this.$parent.activeUser) {
      this.scrollToBottom();
      this.userHeadBg = this.randomRgb();
      this.getUserTags();
    }
  },
  computed: {
    userTag() {
      let _tags = this.$parent.activeUser.user.tags.split(",");
      _tags.map((tag, index) => {
        if (!tag) {
          _tags.splice(index, 1);
        }
      });
      return _tags;
    },
  },
  watch: {
    activeUser(newVal, oldVal) {
      if (newVal) this.getUserTags();
    },
    chatRecords(newVal, oldVal) {
      if (newVal[newVal.length - 1].senderId == 0) {
        this.scrollToBottom();
      } else {
        if (this.checkMessageToBottom()) {
          this.scrollToBottom();
        } else {
          let newRecordLength = newVal.length - oldVal.length;
          console.log(newRecordLength);
          this.unreadMsgsLength += newRecordLength;
        }
      }
    },
  },

  methods: {
    ceshi() {
      console.log(this.$parent.chatRecord.message);
    },
    getUserTags() {
      getUserTags().then((response) => {
        this.allUserTags = response.data.tags;
        let _usertags = this.filterUserTags();
        this.allUserTags.map((tag) => {
          tag["disabled"] = _usertags.indexOf(tag["desc"]) > -1;
          tag["checked"] = tag["disabled"];
        });
      });
    },

    toggleBatchChat() {
      this.$store.dispatch("app/toggleSideBar"); // TODO
    },

    deleteUserTag(tag) {
      this.$parent.delUserTag(tag, () => {});
    },

    deleteUserAddress(address) {
      this.$parent.delUserAddress(address, () => {});
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      this.$parent.addUserTag(inputValue, () => {
        this.inputVisible = false;
        this.inputValue = "";
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      this.$parent.addUserTag(inputValue, () => {
        this.inputVisible = false;
        this.inputValue = "";
      });
      // if (inputValue) {
      //   this.userTags.push(inputValue);
      // }
      // this.inputVisible = false;
      // this.inputValue = "";
    },

    onInput(event) {
      // 事件。数据包含文本区域的值
    },

    selectEmoji(emoji) {
      this.sendMessageValue = this.sendMessageValue + emoji["data"];
      this.emoticonsPopoverVisible = false;
      console.log(this.sendMessageValue);
    },

    sendMessage() {
      const that = this;
      this.$parent.sendMessage(this.sendMessageValue, () => {
        that.sendMessageValue = "";
      });
    },

    timestampTo12Hour(timestamp) {
      return timestampTo12Hour(timestamp);
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
      });
      window.onresize = () => {
        this.$nextTick(() => {
          this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
        });
      };
    },

    randomRgb(item) {
      let R = Math.floor(Math.random() * 130 + 110);
      let G = Math.floor(Math.random() * 130 + 110);
      let B = Math.floor(Math.random() * 130 + 110);
      return {
        background: "rgb(" + R + "," + G + "," + B + ")",
      };
    },

    filterUserTags() {
      let _tags = this.$parent.activeUser.user.tags.split(",");
      _tags.map((tag, index) => {
        if (!tag) {
          _tags.splice(index, 1);
        }
      });
      return _tags;
    },

    addNewTag() {
      let _tag = {
        desc: this.inputNewTagValue,
        disabled: false,
        checked: false,
      };
      this.allUserTags.push(_tag);
      this.showAddTagInput = false;
      this.inputNewTagValue = "";
    },

    batchAddTags() {
      let _tags = [];
      this.allUserTags.forEach((tag) => {
        if (!tag["disabled"] && tag["checked"]) {
          _tags.push(tag["desc"]);
        }
      });
      this.$parent.addUserTag(_tags, () => {
        this.tagDialogVisiable = false;
      });
    },

    addUserAddress() {
      this.$parent.addUserAddress(this.inputAddressValue, () => {
        this.inputAddressValue = "";
      });
    },
  },
  filters:{
    addressFilter(address){
       let _address = address.slice(0, 4);
      _address += "****";
      _address += address.slice(address.length - 4, address.length);
      return _address;
    }
  }
};
</script>

<style lang="scss" scoped>
tgs-player {
  width: 100px;
  height: 100px;
}
#canvas {
  box-shadow: 1px 1px 10px 1px black;
}
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
      // background-color: rgb(165, 45, 45);
      .chat-record-list {
        width: 100%;
        padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        // align-items: flex-end;
        .chat-record-item {
          // flex: 1;
          // text-align: right;
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
            // float: right;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
            .name-abb {
              width: 40px;
              height: 40px;
              // background-color: rgb(172, 116, 116);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              font-weight: 800;
              color: #fff;
            }
          }

          .message-content {
            display: inline-block;
            // text-align: right;
            background-color: #f2f3f5;
            border-radius: 10px;
            padding: 2px 10px;
            // margin-left: 10%;
            margin-top: -40px;
            margin-left: 50px;
            .name {
              // width: 100%;
              // background-color: rgb(204, 84, 84);
              font-size: 12px;
              font-weight: 500;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              margin: 2px 0 4px;
              color: #525151;
              .id {
                display: inline-block;
                padding: 0 3px;
                font-size: 12px;
                border: 1px solid #ccc;
                background-color: #cfcfcf;
                color: #999999;
                border-radius: 4px;
              }
            }
            .message {
              margin: 0;
              font-size: 14px;
              line-height: 20px;
              padding-bottom: 20px;
              min-width: 80px;
              max-width: 500px;
              position: relative;
              span {
                display: block;
              }
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
            flex-direction: row-reverse;
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

.addtag-list {
  width: 100%;
}

.tag-dialog {
  .tag-list {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    .tag {
      margin-bottom: 10px;
      width: 23%;
      margin-right: 2%;
    }
  }
}
</style>
