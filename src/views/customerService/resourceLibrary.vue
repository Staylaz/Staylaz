<template>
  <div class="contract-people-container">
    <div class="top-bar">
      <svg-icon icon-class="search" />
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
}
</style>
