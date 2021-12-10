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
          <el-breadcrumb separator-class="el-icon-s-finance">
            <el-breadcrumb-item>A00001</el-breadcrumb-item>
            <el-breadcrumb-item>Address</el-breadcrumb-item>
            <el-breadcrumb-item>Address</el-breadcrumb-item>
            <el-breadcrumb-item>Address</el-breadcrumb-item>
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
            v-for="(item, index) in 100"
            :key="index"
            class="chat-record-item"
            :class="{ 'mine-message-item': index % 2 === 0 }"
          >
            <div class="head-box">
              <img
                v-if="index % 2 === 0"
                src="https://hbimg.huabanimg.com/3f2935be7c51fd34d37d6aa4c83f0f0ad81a1eb4d0e0-Wg4Qpa_fw1200"
                alt=""
              >
              <img
                v-else
                src="https://hbimg.huabanimg.com/ede884350cc5d6825f786a6bd8addc5383e11e749dd0-bqteB7_fw1200"
                alt=""
              >
            </div>

            <div class="message-content">
              <p class="name">A001</p>
              <p class="message">
                Dynamically add more routes to the router. The argument must be
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-box">
        <el-input
          v-model="textarea"
          type="textarea"
          :rows="5"
          placeholder="Please enter content"
          resize="none"
        />

        <div class="chat-buttons">
          <el-button type="primary">Send</el-button>
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
      userTags: [],
      inputVisible: false,
      inputValue: '',
      textarea: null
    }
  },

  methods: {
    handleClose(tag) {
      this.userTags.splice(this.userTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.userTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
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
    margin-top: 2px;
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

        .chat-record-item {
          width: 80%;
          //   background-color: rgb(228, 89, 89);
          margin-top: 16px;
          display: flex;
          .head-box {
            width: 44px;
            height: 44px;

            border-radius: 50%;
            overflow: hidden;
            position: relative;
            margin-right: 8px;

            img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
          }

          .message-content {
            flex: 1;

            .name {
              width: 100%;
              margin: 8px 0 4px;
              font-size: 14px;
              font-weight: 500;
            }
            .message {
              margin: 0;
              font-size: 14px;
              line-height: 20px;
            }
          }
        }
        .mine-message-item {
          margin-left: 20%;
          flex-direction: row-reverse;
          .head-box {
            margin-right: 0px;
            margin-left: 8px;
          }

          .name {
            text-align: right;
          }
        }
      }
    }

    .chat-input-box {
      width: 100%;
      height: 24.5%;
      background-color: #fff;
      box-sizing: border-box;

      .el-textarea {
        width: 100%;
        height: 70%;

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
</style>
