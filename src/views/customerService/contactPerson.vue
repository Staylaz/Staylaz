<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <div v-show="!searchContractPeople">
        <span>
          <span v-show="!isBatchSelect" @click="isBatchSelect = true"
            >Batch</span
          >
          <span
            v-show="isBatchSelect"
            class="cancel-span"
            @click="isBatchSelect = false"
            >Cancel</span
          >
        </span>

        <el-checkbox
          v-show="!isBatchSelect"
          label="Unread"
          name="type"
        ></el-checkbox>

        <!-- <el-radio-group
          
          v-model="contactType"
          class="contactTypeRadio"
        >
          <el-radio label="Unread" />
        </el-radio-group> -->

        <svg-icon
          v-show="!isBatchSelect"
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

    <div class="contract-people-list">
      
      <div
        v-for="(item, index) in chatUsersData"
        :key="index"
        class="people-item"
        :class="{ 'is-active': item.userid === $parent.activeUserID }"
        @click="switchChat(item.userid)"
        v-show="searchContractPeopleFilter(item)"
      >

        <div class="head-img" >
          <img
            src="https://hbimg.huabanimg.com/32f39125c45f42f2f9c378435c93525832663d6311d6ea-09TUBd"
            alt=""
          />
        </div>
        <div class="info-box">
          <p class="id">{{ item.userid }}</p>
          <p class="message">...</p>
        </div>

        <div class="status-box">
          <p class="time">{{ timestampTo12Hour(item.timestamp) }}</p>
          <div v-show="item.number && !isBatchSelect" class="unread">
            <span> {{ item.number }}</span>
          </div>
          <div v-show="isBatchSelect" class="batch-select is-select">
            <img src="../../assets/svg/select.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// API
import { getChat } from "@/api/customerService";
import timestampTo12Hour from "@/utils/utils";
export default {
  name: "Contract",

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
      activeContractIndex: 0,
      searchContractPeople: false,
      searchContractPeopleValue: "",
      isBatchSelect: false,
      chatUsersData: [],
    };
  },

  created() {
    this.getChatData();
  },

  methods: {
    getChatData() {
      getChat()
        .then((response) => {
          this.chatUsersData = response.data.users;
          if (!this.$parent.activeUserID) {
            this.switchChat(response.data.users[0]["userid"]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    switchChat(id) {
      this.$parent.getChatRecord(id);
    },

    timestampTo12Hour(timestamp) {
      return timestampTo12Hour(timestamp);
    },

    searchContractPeopleFilter(item) {
      console.log(item,'==========',item.id)
      if (!this.searchContractPeople) {
        return true
      } else {
        // item.userid

        // if (this.searchContractPeopleValue )
        
      }
    },
  },
};
</script>

<style lang='scss' scoped>
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

  .contract-people-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;

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
      }

      .info-box {
        height: 36px;
        width: 50%;
        margin-left: 8px;
        .id {
          line-height: 18px;
          margin: 0;
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 800;
          color: #323233;
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
</style>
