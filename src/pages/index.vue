<template>
  <div>
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
      <!-- 骨架屏 v-if判断是否返回后台的数据 -->
      <template v-if="panels.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <!-- type值对应的类型 -->
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 85%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 30%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <!-- 统计面板 -->
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="index"
      >
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <!-- type值对应的类型 -->
              <el-tag :type="item.unitColor" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <number-scrolling :value="item.value"></number-scrolling>
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span
            ><span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <index-navs></index-navs>
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <IndexChars v-permission="['getStatistics3,GET']" />
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <index-card
          title="店铺及商品提示"
          tip="店铺及商品提示"
          :btns="goods"
        ></index-card>
        <index-card
          title="交易提示"
          tip="需要立即处理的交易订单"
          :btns="order"
          class="mt-3"
        >
        </index-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getStatistics1, getStatistics2 } from "~/api/index";
import NumberScrolling from "~/components/numberScrolling.vue";
import IndexNavs from "~/components/layout/indexNavs.vue";
import IndexChars from "~/components/indexChars.vue";
import IndexCard from "~/components/indexCard.vue";
const panels = ref([]);
const goods = ref([]);
const order = ref([]);
getStatistics1().then((res) => {
  panels.value = res.panels;
  console.log(panels.value);
});
getStatistics2().then((res) => {
  goods.value = res.goods;
  order.value = res.order;
});
</script>

<style scoped></style>
