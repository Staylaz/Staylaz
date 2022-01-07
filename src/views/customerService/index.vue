<template>
  <div class="app-container">
    <div class="sub-navbar">
      <div class="left-part">
        <!-- class="contactTypeRadio" -->
        <el-radio-group
          v-model="contactType"
          size="mini"
          class="contract-type-radio"
        >
          <el-radio-button label="all">All</el-radio-button>
          <el-radio-button label="stranger">Stranger</el-radio-button>
        </el-radio-group>

        <el-dropdown trigger="click" size="mini" v-if="0">
          <el-button type="common" size="mini">
            Filter by tag
            <i class="el-icon-caret-bottom el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item of alltags"
              :key="item.id"
              :command="item"
            >
              {{ item.desc }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-select
          v-model="filterTagValue"
          @clear="filterTagValue = ''"
          clearable
          class="select-filter"
          placeholder="Filter by tag"
          size="mini"
        >
          <el-option
            v-for="(item, index) of alltags"
            :key="item.id"
            :label="item.desc"
            :value="index"
          ></el-option>
        </el-select>
        <el-select
          v-model="filterUsdValue"
          @clear="filterUsdValue = ''"
          style="margin-left: 5px"
          clearable
          class="select-filter"
          placeholder="Filter by USD"
          size="mini"
        >
          <el-option
            v-for="item of filterUsdOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>

      <el-dropdown trigger="click">
        <el-button style="padding: 8px 10px" size="small" type="common">
          YOKA Hello
          <i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item
              v-for="item of contactTypeOptions"
              :key="item.value"
              :disabled="contactType === item.value"
              :command="item.value"
            >
              {{ item.label }}

            </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="customer-service-container">
      <contract-people-container
        ref="contractPeople"
        :filters="filterOptions"
      />
      <chat-container ref="chat" v-show="!batchChatType" />
      <batch-chat-container v-show="batchChatType"></batch-chat-container>
      <resource-library-container />
    </div>

    <!-- <el-dialog title="Batch" width="30%" center :modal='false' :visible.sync="batchChatType">
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { toggleClass } from '@/utils'
import "@/assets/custom-theme/index.css"; // the theme changed version element-ui css
// Vue Components
import ContractPeopleContainer from "./contactPerson.vue";
import ChatContainer from "./chat.vue";
import BatchChatContainer from "./batchChat.vue";
import ResourceLibraryContainer from "./resourceLibrary.vue";
import TodoVue from "../dashboard/admin/components/TodoList/Todo.vue";
import priceUtil from "../../utils/tokenprice";
import {
  getUserTags,
  addUserTag,
  deleteUserTag,
  addUserAddress,
  deleteUserAddress,
} from "@/api/user";

export default {
  name: "Theme",
  components: {
    ContractPeopleContainer,
    ChatContainer,
    BatchChatContainer,
    ResourceLibraryContainer,
  },
  data() {
    return {
      contactType: "stranger",
      tags: ["activity1", "activity2", "activity3", "activity4"],
      activeUserID: null,
      activeUser: null,
      chatRecord: [],
      ws: this.$store.state.socket.ws,
      batchChatType: false,
      batchUsersId: [],
      alltags: [],
      filterTagValue: "",
      filterUsdValue: "",
      filterUsdOptions: [
        { id: 0, max: 0, min: 0, label: "0" },
        { id: 1, max: 500, min: 1, label: "1 - 500", name: "Shrimp" },
        { id: 2, max: 1000, min: 501, label: "500 - 1000", name: "Crab" },
        { id: 3, max: 2000, min: 1001, label: "1000 - 2000", name: "Octopus" },
        { id: 4, max: 5000, min: 2001, label: "2000 - 5000", name: "Dolphin" },
        { id: 5, max: 10000, min: 5001, label: "5000 - 10000", name: "Shark" },
        {
          id: 6,
          max: 100000,
          min: 10001,
          label: "10000 - 100000",
          name: "Whale",
        },
        {
          id: 7,
          max: 999999,
          min: "100001",
          label: "100000 - 999999",
          name: "God",
        },
      ],
      bnbPrice: "",
    };
  },
  watch: {},
  created() {
    this.onSocketMessage();
    this.getUserTags();
    this.getBnbPrice();
  },
  computed: {
    filterOptions() {
      console.log(this.filterTagValue, this.alltags);
      let tagOption =
        this.filterTagValue === "" ? null : this.alltags[this.filterTagValue];
      let usdOption =
        this.filterUsdValue === ""
          ? null
          : this.filterUsdOptions[this.filterUsdValue];
      return { usd: usdOption, tag: tagOption };
    },
  },
  methods: {
    handleContactType(type) {
      this.contactType = type;
    },

    switchActiveBacth(userid) {
      let _index = this.batchUsersId.indexOf(userid);
      if (_index < 0) {
        this.batchUsersId.push(userid);
      } else {
        this.batchUsersId.splice(_index, 1);
      }
    },

    getChatRecord(user) {
      console.log("UUuuuUUUUUUUUUUUU", user);
      if (user) {
        this.activeUser = user;
        this.activeUserID = user.userid;
      }

      const that = this;
      this.ws.emit(
        "telegram",
        {
          action: "message",
          userid: this.activeUserID,
        },
        function (code, msg, data) {
          console.log("message", data);
          that.chatRecord = data.messages;
          that.chatRecord.sort((a, b) => {
            return a.mid - b.mid <= 0 ? -1 : 1;
          });
        }
      );
    },

    sendMessage(message, cb) {
      const that = this;
      console.log("SEND MESSAGE", this.activeUserID, message);
      this.ws.emit(
        "telegram",
        {
          action: "send",
          userid: this.activeUserID,
          message: message,
        },
        function (code, msg, data) {
          cb();
          that.getChatRecord(null);
        }
      );
    },

    batchSendMessage(message, cb) {
      let _num = 0;
      let _faildUserid = [];
      this.batchUsersId.map((id) => {
        this.ws.emit(
          "telegram",
          {
            action: "send",
            userid: id,
            message: message,
          },
          (code, msg, data) => {
            console.log(code, msg, data, "BATCH");
            _num++;
            // if (msg !== "OK")
            // if ()
            //TODO
            if (_num === this.batchUsersId.length) {
              cb();
              this.getChatRecord(null);
            }
          }
        );
      });
    },

    onSocketMessage() {
      this.ws.onBroadcast("message", (res) => {
        const id = res["message"]["userid"];
        if (id === this.activeUserID) {
          this.getChatRecord(null);
        }
        this.$refs.contractPeople.getChatData();
      });
    },

    addUserTag(tags, cb) {
      tags.forEach((tag) => {
        addUserTag({ userid: this.activeUserID, tag: tag.desc }).then(
          (response) => {
            cb();
            this.$refs.contractPeople.getChatData();
            this.getUserTags();
          }
        );
      });
    },

    delUserTag(tag, cb) {
      console.log(tag, "delUserTag");
      deleteUserTag({ userid: this.activeUserID, tag: tag }).then(
        (response) => {
          cb();
          this.$refs.contractPeople.getChatData();
          this.getUserTags();
        }
      );
    },
    async getBnbPrice() {
      this.bnbPrice = await priceUtil.getBnbPrice();
      console.log(this.bnbPrice);
    },
    getUserTags() {
      getUserTags().then((response) => {
        this.alltags = response.data.tags;
      });
    },

    delUserAddress(address) {
      deleteUserAddress({ userid: this.activeUserID, address: address }).then(
        (response) => {
          this.$refs.contractPeople.getChatData();
        }
      );
    },

    addUserAddress(address, cb) {
      addUserAddress({ userid: this.activeUserID, address: address }).then(
        (response) => {
          cb();
          this.$refs.contractPeople.getChatData();
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  overflow: hidden;
  height: 100vh;
  padding: 10px;
  padding-top: 4px;
}
.sub-navbar {
  display: flex;
  justify-content: space-between;
  .contactTypeRadio {
    margin-right: 20px;
  }

  .select-filter {
    width: 130px;
  }
}

.customer-service-container {
  width: 100%;
  height: 100%;
  background-color: #f2f3f5;
  display: flex;
  justify-content: space-between;
}

.contract-type-radio {
  margin-right: 16px;
}
</style>
