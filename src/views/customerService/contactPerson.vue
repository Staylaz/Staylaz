<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <svg-icon icon-class="search" />

      <el-radio-group v-model="contactType" class="contactTypeRadio">
        <el-radio label="Unread" />
      </el-radio-group>

      <span>Batch</span>
    </div>

    <div class="contract-people-list">
      <div
        v-for="(item, index) in 40"
        :key="index"
        class="people-item"
        :class="{ 'is-active': index === activeContractIndex }"
      >
        <div class="head-img">
          <img
            src="https://hbimg.huabanimg.com/32f39125c45f42f2f9c378435c93525832663d6311d6ea-09TUBd"
            alt=""
          >
        </div>
        <div class="info-box">
          <p class="id">A001</p>
          <p class="message">
            Our documentation is a great resource for learning how to configure
            TinyMCE.
          </p>
        </div>

        <div class="status-box">
          <p class="time">01:10AM</p>
          <div class="unread">9</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Contract',
  data() {
    return {
      activeContractIndex: 0
    }
  }
}
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
        .time {
          font-size: 10px;
          color: #969799;
        }

        .unread {
          width: 16px;
          height: 16px;
          background-color: red;
          color: #fff;
          text-align: center;
          line-height: 16px;
          border-radius: 50%;
          font-size: 12px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          margin-left: 70%;
        }
      }
    }

    .is-active {
      background-color: #ebedf0;
    }
  }
}
</style>
