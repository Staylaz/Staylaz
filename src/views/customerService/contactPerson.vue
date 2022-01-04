<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <div v-show="!searchContractPeople">
        <span>
          <span
            v-show="!$parent.batchChatType"
            @click="$parent.batchChatType = true"
            >Batch</span
          >
          <span
            v-show="$parent.batchChatType"
            class="cancel-span"
            @click="$parent.batchChatType = false"
            >Cancel</span
          >
        </span>

        <el-checkbox
          v-show="!$parent.batchChatType"
          label="Unread"
          name="type"
          v-model="isUnreadType"
        />

        <!-- <el-radio-group

          v-model="contactType"
          class="contactTypeRadio"
        >
          <el-radio label="Unread" />
        </el-radio-group> -->

        <svg-icon
          v-show="!$parent.batchChatType"
          icon-class="search"
          @click="searchContractPeople = true"
        />
      </div>

      <div v-show="searchContractPeople">
        <el-input
          v-model="searchContractPeopleValue"
          size="small"
          placeholder="Search"
          prefix-icon="el-icon-search"
        >
          <!-- <i class="el-icon-close"  slot="suffix"></i> -->
          <el-button
            slot="append"
            icon="el-icon-close"
            @click="searchContractPeople = false"
          />
        </el-input>
      </div>
    </div>

    <div
      class="contract-people-box"
      ref="scrollContainer"
      @scroll="updateStartIndex"
    >
      <div class="contract-people-list" ref="scrollList">
        <div
          v-for="(item, index) in showUsers"
          v-show="contractPeopleFilter(item)"
          :key="index"
          class="people-item"
          :class="{ 'is-active': item.userid === $parent.activeUserID }"
          @click="switchChat(item)"
        >
          <div class="head-img">
            <img v-if="item['photo']" :src="item['photo']" alt="" />

            <div class="name-abb" :style="item['bgcolor']" v-else>
              <span v-if="item['user']['firstname']">{{
                item["user"]["firstname"][0]
              }}</span>
              <span v-if="item['user']['lastname']">
                {{ item["user"]["lastname"][0] }}</span
              >
            </div>
          </div>
          <div class="info-box">
            <div class="name-box">
              <div class="id">
                <el-tag type="info" size="mini">{{ item.userid }} </el-tag>
                {{ (item["user"]["firstname"]?'':item["user"]["firstname"]) + (item["user"]["lastname"]?' '+item["user"]["lastname"]:'') }}
              </div>
            </div>
            <p class="message">{{ filterTag }}</p>
          </div>

          <div class="status-box">
            <p class="time">{{ timestampTo12Hour(item.timestamp) }}</p>
            <div v-show="item.number && !$parent.batchChatType" class="unread">
              <span> {{ item.number }}</span>
            </div>
            <div
              v-show="$parent.batchChatType"
              class="batch-select"
              :class="{
                'is-select': $parent.batchUsersId.indexOf(item.userid) > -1,
              }"
              @click="$parent.switchActiveBacth(item.userid)"
            >
              <img
                src="../../assets/svg/select.svg"
                alt=""
                v-show="$parent.batchUsersId.indexOf(item.userid) > -1"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-bar" ref="scrollBar"></div>
    </div>
  </div>
</template>

<script>
import timestampTo12Hour from "@/utils/utils";
import { getUserHeadImg } from "@/api/user";
// import user from 'mock/user';

export default {
  name: "Contract",
  props: {
    filtertagvalue: String,
  },
  filters: {
    timestampFilter(time) {
      const _data = new Date(parseInt(time) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
      var now = new Date(parseInt(time) * 1000);
      let _hour = "";
      let apn = "AM";
      if (now.getHours() > 10) {
        _hour = now.getHours() - 12;
        apn = "PM";
      }
      return _data.substring(13) + apn;
    },
  },

  data() {
    return {
      isResized: false,
      start: 0,
      end: 10,
      showNum: 10,
      scrollItemHeight: 74,
      listClientheight: 0,
      activeContractIndex: 0,
      searchContractPeople: false,
      searchContractPeopleValue: "",
      chatUsersData: [],
      ws: this.$store.state.socket.ws,
      isUnreadType: false,
    };
  },

  created() {
    this.getChatData();
  },
  mounted() {},
  computed: {
    filterTag() {
      return this.filtertagvalue;
    },
    showUsers() {
      return this.chatUsersData.slice(this.start, this.end);
    },
    usersNumber() {
      return this.chatUsersData.length;
    },
  },
  watch: {
    usersNumber(newVal) {
      console.log(newVal);
    },
  },
  methods: {
    getChatData() {
      const that = this;
      that.$parent.batchUsersId = [];
      this.ws.emit(
        "telegram",
        {
          action: "chat",
        },
        function (code, msg, data) {
          let _userData = [];
          console.log(data);
          data.users.map((user) => {
            user["bgcolor"] = that.randomRgb(user);
            _userData.push(user);
          });
          that.chatUsersData = _userData;
          console.log(that.chatUsersData[0]);
          that.getVirtualListSize();
          if (!that.$parent.activeUserID) {
            that.switchChat(data.users[0]);
          }
          data.users.map((user) => {
            that.$parent.batchUsersId.push(user.userid);
            if (that.$parent.activeUserID === user.userid) {
              that.switchChat(user);
            }
          });
        }
      );
    },

    getUserHeadImg(user) {
      getUserHeadImg({ userid: user.userid })
        .then((response) => {
          user["photo"] = response["data"]["photo"];
          // let _imageBuffer = response["data"]["photo"];
          // let bytes = new Uint8Array(_imageBuffer["fileReference"]["data"]);
          // let data = "";
          // let len = bytes.byteLength;
          // for (let i = 0; i < len; i++) {
          //   data += String.fromCharCode(bytes[i]);
          // }
          // console.log("data:image/png;base64," + window.btoa(data));
          // image.src = "data:image/png;base64," + window.btoa(data);
          console.log(response["data"]["photo"], "+++++++");
          // 'data:image/png;base64,' + window.btoa(
          //   new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          // );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    switchChat(user) {
      this.$parent.getChatRecord(user);
    },

    timestampTo12Hour(timestamp) {
      return timestampTo12Hour(timestamp);
    },

    contractPeopleFilter(item) {
      let _result = false;
      if (!this.searchContractPeople) {
        _result = true;
        if (this.filterTag) {
          _result = item["user"]["tags"].indexOf(this.filterTag) > -1;
        }
        // if (this.isUnreadType) {
        //   return item.number;
        // }
      } else {
        _result = this.searchContractPeopleValue.indexOf(item.userid) > -1;
        if (this.filterTag && _result) {
          _result = item["user"]["tags"].indexOf(this.filterTag) > -1;
        }
      }

      return _result;
    },

    getVirtualListSize() {
      if (this.isResized) return;
      this.listClientHeight = this.$refs.scrollContainer.clientHeight;
      let pageNum = parseInt(this.listClientHeight / 74);
      this.showNum = pageNum;
      this.end = pageNum;
      this.$refs.scrollBar.style.height = this.chatUsersData.length * 74 + "px";
      this.isResized = true;
    },

    updateStartIndex() {
      let scrollTop = this.$refs.scrollContainer.scrollTop;
      this.start = Math.floor(scrollTop / this.scrollItemHeight);
      this.end = this.start + this.showNum;
      this.$refs.scrollList.style.top =
        this.start * this.scrollItemHeight + "px";
    },

    updateListSize(oldLen, newLen) {
      this.$refs.scrollList.style.top = newLen;
    },

    randomRgb(item) {
      let R = Math.floor(Math.random() * 130 + 110);
      let G = Math.floor(Math.random() * 130 + 110);
      let B = Math.floor(Math.random() * 130 + 110);
      return {
        background: "rgb(" + R + "," + G + "," + B + ")",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-people-container {
  width: 275px;
  height: 100%;
  background-color: #d8d8d8;
  display: flex;
  flex-direction: column;

  .top-bar {
    width: 100%;
    height: 41px;
    background-color: #f2f3f5;
    box-sizing: border-box;
    padding: 0 5%;
    color: #606266;
    .cancel-span {
      color: green;
    }
  }

  .top-bar > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  .contract-people-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    .contract-people-list {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      .people-item {
        width: 100%;
        height: 70px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 16px;

        .head-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #fff;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }

          .name-abb {
            width: 44px;
            height: 44px;
            // background-color: rgb(172, 116, 116);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 800;
            color: #fff;
          }
        }

        .info-box {
          height: 36px;
          width: 50%;
          margin-left: 8px;
          .name-box {
            line-height: 18px;
            margin: 0;
            margin-bottom: 4px;
            font-size: 14px;
            font-weight: 800;
            color: #323233;
            .id {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .message {
            line-height: 14px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0;
          }
        }

        .status-box {
          width: 65px;
          .time {
            font-size: 10px;
            color: #969799;
            text-align: right;
            white-space: nowrap;
          }
          .unread {
            width: 16px;
            height: 16px;
            background-color: rgb(224, 65, 65);
            color: #fff;
            text-align: center;
            line-height: 16px;
            border-radius: 50%;
            font-size: 12px;

            margin-left: 70%;
            span {
              font-weight: 800;
            }
          }

          .batch-select {
            width: 16px;
            height: 16px;
            margin-left: 70%;
            border-radius: 50%;
            background-color: #fff;
            .el-button {
              padding: 0;
            }
          }

          .batch-select.is-select {
            background-color: rgb(107, 230, 103);
            position: relative;
            img {
              width: 80%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }

      .is-active {
        background-color: #ebedf0;
      }
    }
  }
}
</style>
