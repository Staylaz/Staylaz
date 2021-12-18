<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { formatTime } from "@/utils";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      timeArray: [],
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  created() {
    this.initChartDate();
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChartDate() {
      let datestamp = new Date().getTime();
      let formatTime = parseInt(datestamp / 86400000) * 86400000;
      let dateArr = [];
      for (let i = 6; i >= 0; i--) {
        if (i == 0) {
          dateArr.push("Today");
        } else if (i == 1) {
          dateArr.push("Yesterday");
        } else {
          dateArr.push(this.parseTimestamp(formatTime - 86400000 * i));
        }
      }
      this.timeArray = dateArr;
    },
    parseTimestamp(timestamp) {
      let date = new Date(timestamp);
      console.log(date);
      let month = date.getMonth() + 1,
        day = date.getDate();
      console.log(month, day);
      return `${month}-${day}`;
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.timeArray,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: ["actual"],
        },
        series: [
          {
            name: "actual",
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
            data: actualData,
            animationDuration: 1400,
            animationEasing: "quadraticOut",
          },
        ],
      });
    },
  },
};
</script>
