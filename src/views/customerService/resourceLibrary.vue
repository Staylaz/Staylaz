<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <svg-icon icon-class="search" />
    </div>
    <div class="contract-people-balance">
      <div class="bnb-price">BNB Price:${{ this.$parent.bnbPrice }}</div>
      <div class="user-balance-list">
        <div
          class="user-balance-item"
          v-for="item in userBalances"
          :key="item.address"
        >
          <p>{{ item.address }}</p>
          <ul>
            <li>BNB:{{ item.balance.BNB }}</li>

            <li>BUSD:{{ item.balance.BUSD }}</li>

            <li>USDT:{{ item.balance.USDT }}</li>
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
    filterAccount() {},
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
}
</style>
