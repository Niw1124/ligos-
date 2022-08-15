<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <search-item label="关键词">
        <el-input
          v-model="searchForm.title"
          placeholder="商品标题"
          clearable
        ></el-input>
      </search-item>
    </search>
    <!-- 表格 -->
    <el-table
      defaultExpandAll
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              size="50"
              shape="circle"
              :src="row.user.avatar"
              fit="fill"
              class="mr-2"
            ></el-avatar>
            <div class="flex-1">
              <!-- 用户名称 -->
              <h6 class="flex items-center">
                {{ row.user.nickname || row.user.username }}
                <!-- 评论时间 -->
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <button
                  type="text"
                  size="small"
                  class="ml-auto"
                  @click="openTextarea(row)"
                >
                  回复
                </button>
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <el-image
                  v-for="(item, index) in row.review.image"
                  :key="index"
                  :src="item"
                  fit="cover"
                  :lazy="true"
                  style="height: 100px; width: 100px"
                ></el-image>
              </div>
              <!-- 客服回复 -->

              <div v-if="row.textareaEdit">
                <el-input
                  v-model="textarea"
                  placeholder="请输入评价内容"
                  type="textarea"
                  :rows="2"
                ></el-input>
                <!-- 回复和取消 -->
                <div class="py-2">
                  <el-button type="primary" size="small" @click="review(row)"
                    >回复</el-button
                  >
                  <el-button
                    size="small"
                    class="ml-2"
                    @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>
              <template v-else>
                <div
                  class="mt-3 bg-gray-100 p-3 rounded"
                  v-for="(item, index) in row.extra"
                  :key="index"
                >
                  <h6 class="flex font-bold">
                    客服
                    <el-button
                      class="ml-auto"
                      type="info"
                      size="small"
                      @click="openTextarea(row, item.data)"
                      >修改</el-button
                    >
                  </h6>
                  <p>{{ item.data }}</p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="180" prop="id">
      </el-table-column>
      <el-table-column label="商品" width="400">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.goods_item ? row.goods_item.cover : ''"
              fit="fill"
              :lazy="true"
              style="heigth: 50px; width: 50px"
              class="rounded"
            ></el-image>
            <div class="ml-3">
              <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="400">
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="评价时间"
        align="center"
        width="180"
        prop="review_time"
      >
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatisChange($event, row)"
            :loading="row.statusLoading"
            :disabled="row.super == 1"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-card>
</template>

<script setup>
import {
  getGoodsCommentList,
  updatedGoodsCommentStatus,
  replyToUserComments,
} from "~/api/goods_comment.js";
import { ref } from "vue";
import Search from "~/components/search.vue";
import SearchItem from "~/components/SearchItem.vue";
import { useInitTable } from "~/tools/useCommon.js";
import { messageInfo } from "~/tools/messagePopup";
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatisChange,
} = useInitTable({
  searchForm: {
    title: "",
  },
  // delete: deleteManager,
  updateStatus: updatedGoodsCommentStatus,
  getList: getGoodsCommentList,
  onGetListSuccess: (res) => {
    roles.value = res.roles;
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      o.textareaEdit = false;
      return o;
    });
    total.value = res.totalCount;
  },
});
const roles = ref([]);
const textarea = ref("");

const openTextarea = (row, data = "") => {
  textarea.value = data;
  row.textareaEdit = true;
};

//回复的方法
const review = (row) => {
  if (textarea.value == "") {
    return messageInfo("回复内容不能为空", "error");
  }
  replyToUserComments(row.id, textarea.value).then((res) => {
    row.textareaEdit = false;
    messageInfo("回复成功");
    getData();
  });
};
</script>

<style lang="scss" scoped></style>
