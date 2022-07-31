<template>
  <div class="result404">
    <el-col :sm="12" :lg="6">
      <el-result
        icon="error"
        title="你找的页面走丢了"
        sub-title="请点击下方按钮返回首页"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')"
            >返回首页</el-button
          >
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.result404 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
