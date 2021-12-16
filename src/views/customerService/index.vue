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

        <el-dropdown trigger="click" size="mini">
          <el-button type="common" size="mini">
            Filter by tag
            <i class="el-icon-caret-bottom el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of tags" :key="item" :command="item">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      <contract-people-container />
      <chat-container />
      <!-- <batch-chat-container></batch-chat-container> -->
      <resource-library-container />
    </div>
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

// API
import { getChat, getChatRecord, sendMessage } from "@/api/customerService";

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
      chatRecord: [],
      ws: this.$store.state.socket.ws,
    };
  },
  watch: {},
  created() {},
  methods: {
    handleContactType(type) {
      this.contactType = type;
    },

    getChatRecord(id) {
      this.activeUserID = id;
      let that = this;
      this.ws
        .emit(
          "telegram",
          {
            action: "message",
            userid: id,
          },
          function (code, msg, data) {
            console.log(code, msg, data);
            that.chatRecord = data.messages;
            that.chatRecord.sort((a, b) => {
              return a.mid - b.mid <= 0 ? -1 : 1;
            });
          }
        )
        .catch((err) => {
          console.log(err);
        });
    },

    sendMessage(message, cb) {
      let that = this;
      this.ws
        .emit(
          "telegram",
          {
            action: "send",
            userid: this.activeUserID,
            message: message,
          },
          function (code, msg, data) {
            cb();
            that.getChatRecord(that.activeUserID);
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
