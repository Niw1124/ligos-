<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            :checked="current == item.value"
            style="margin-right: 8px"
            v-for="(item, index) in options"
            @click="handleChose(item.value)"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <div id="echars" style="width: 100%; height: 300px" ref="el"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import * as echarts from "echarts";
import { getStatistics3 } from "~/api/index.js";
import { useResizeObserver } from "@vueuse/core";
const current = ref("week");
const options = [
  {
    text: "近一个月",
    value: "month",
  },
  {
    text: "近一周",
    value: "week",
  },
  {
    text: "近一小时",
    value: "hour",
  },
];

const handleChose = (type) => {
  current.value = type;
  getData();
};
var myChart = null;
onMounted(() => {
  var chartDom = document.getElementById("echars");
  if (chartDom) {
    myChart = echarts.init(chartDom);
    getData();
  }
});

function getData() {
  let option = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  myChart.showLoading();
  getStatistics3(current.value)
    .then((res) => {
      option.xAxis.data = res.x;
      option.series[0].data = res.y;
      myChart.setOption(option);
    })
    .finally(() => {
      myChart.hideLoading();
    });
}
onBeforeMount(() => {
  //判断mychart是否存在
  if (myChart) echarts.dispose();
});

const el = ref(null);
useResizeObserver(el, (entries) => {
  myChart.resize();
});
</script>

<style lang="scss" scoped></style>
