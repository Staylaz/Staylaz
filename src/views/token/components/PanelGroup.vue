<template>
  <div class="panel-group" v-if="tokendata">
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('holders')">
        <div class="card-panel-description">
          <div class="card-panel-text">Holders</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.holders"
            :duration="2600"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span> {{ tokendata.yestoday.holders }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('totalsupply')">
        <div class="card-panel-description">
          <div class="card-panel-text">Total Supply</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.totalsupply / 1000"
            :duration="3000"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span>{{ tokendata.yestoday.totalsupply / 1000 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('lpamount')">
        <div class="card-panel-description">
          <div class="card-panel-text">LP Amount</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.lpamount / 1000"
            :duration="3000"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span>{{ tokendata.yestoday.totalsupply / 1000 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('price')">
        <div class="card-panel-description">
          <div class="card-panel-text">Price</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.price"
            :duration="3200"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span>{{ tokendata.yestoday.price }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('useramount')">
        <div class="card-panel-description">
          <div class="card-panel-text">User Amount</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.useramount / 1000"
            :duration="3600"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday
            <span>{{ tokendata.yestoday.useramount / 1000 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('gameamount')">
        <div class="card-panel-description">
          <div class="card-panel-text">Game Amount</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.gameamount / 1000"
            :duration="3600"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span>{{ tokendata.yestoday.gameamount / 1000 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('devamount')">
        <div class="card-panel-description">
          <div class="card-panel-text">Dev Amount</div>
          <count-to
            :start-val="0"
            :end-val="tokendata.today.devamount / 1000"
            :duration="3600"
            class="card-panel-num"
          />
          <div class="yesterday-count">
            Yesterday <span>{{ tokendata.yestoday.devamount / 1000 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  props: {
    tokendata: Object,
  },
  watch: {
    tokendata(newVal) {},
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .card-panel-col {
    width: 13%;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      padding: 8px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      margin-left: 13px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      flex: 1;
      font-weight: bold;
      margin: 10px;
      margin-left: 10px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        color: #34bfa3;
        font-size: 20px;
        margin-bottom: 10px;
      }
      .yesterday-count {
        span {
          color: skyblue;
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
