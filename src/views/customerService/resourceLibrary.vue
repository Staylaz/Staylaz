<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <svg-icon icon-class="search" />
    </div>
    <div class="contract-people-balance">
      <div class="bnb-price">
        <span>BNB Price:</span>
        <span>${{ this.$parent.bnbPrice }}</span>
      </div>
      <tgs-player></tgs-player>
      <div class="user-balance-list">
        <div
          class="user-balance-item"
          v-for="item in userBalances"
          :key="item.address"
        >
          <p class="user-address">{{ item.address | addressFilter }}</p>
          <ul>
            <li>
              BNB: <span>{{ item.balance.BNB | filterTokenAmount }}</span>
            </li>

            <li>
              BUSD: <span>{{ item.balance.BUSD | filterTokenAmount }}</span>
            </li>

            <li>
              USDT: <span>{{ item.balance.USDT | filterTokenAmount }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserBalances } from "@/api/user";
export default {
  name: "Contract",
  data() {
    return {
      activeContractIndex: 0,
      userBalances: null,
    };
  },
  computed: {
    activeUser() {
      return this.$parent.activeUser;
    },
    bnbPrice() {
      let price = this.$parent.bnbPrice;
      console.log(typeof price);
    },
  },
  watch: {
    activeUser(newVal, oldVal) {
      console.log("User change");
      console.log(newVal);
      if (oldVal && newVal.user.address == oldVal.user.address) {
        return;
      }
      if (newVal.user.balance) {
        this.userBalances = newVal.user.balance;
      } else if (newVal.user.address && !newVal.user.balance) {
        this.getUserBalances(newVal.user.address);
      }
    },
    userBalances(newVal) {
      if (newVal && !this.activeUser.user.balance) {
        this.$set(this.$parent.activeUser, "balance", newVal);
      }
    },
  },
  mounted() {},
  methods: {
    getUserBalances(address) {
      console.log("bscscan");
      let addresses = address.split(",");
      let promises = [];
      let balances = [];
      addresses.forEach((add) => {
        let pro = getUserBalances({ address: add });
        promises.push(pro);
      });
      Promise.all(promises).then((values) => {
        values.forEach((balance, index) => {
          balances.push({
            address: addresses[index],
            balance: balance.data.balances,
          });
          this.userBalances = balances;
          this.$set(this.$parent.activeUser.user, "balance", balances);
        });
      });
    },
  },
  filters: {
    addressFilter(address) {
      let _address = address.slice(0, 4);
      _address += "****";
      _address += address.slice(address.length - 4, address.length);
      return _address;
    },
    filterTokenAmount(value) {
      let num = value / 10 ** 18;
      return num.toFixed(3);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .contract-people-balance {
    min-height: 30%;
    background-color: #fff;
    .bnb-price {
      font-size: 18px;
      text-align: center;
      line-height: 40px;
      background: linear-gradient(
        180deg,
        rgb(209, 209, 209),
        rgba(218, 212, 212, 0.2),
        rgb(209, 209, 209)
      );
      span:first-child {
        font-size: 20px;
      }
      span:last-child {
        color: red;
      }
    }
    .user-balance-list {
      padding: 5px 10px;
      .user-balance-item {
        font-size: 14px;
        margin-bottom: 10px;
        .user-address {
          color: darkcyan;
          cursor: pointer;
          line-height: 30px;
          padding: 0 5px;
          border: 1px solid #000;
          margin: 0;
        }
        ul {
          padding: 0;
          margin: 0;
          border: 1px solid #000;
          border-top: none;
          li {
            list-style: none;
            line-height: 30px;
            margin: 0;
            padding: 0;
            padding-left: 5px;
            border-bottom: 1px solid #000;
            span {
              margin-left: 5px;
            }
          }
          li:last-child {
            border: none;
          }
        }
      }
    }
  }
}
</style>
