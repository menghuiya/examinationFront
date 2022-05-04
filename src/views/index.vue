<template>
  <div class="index">
    <div class="title">首页</div>
    <div class="index-content">
      <el-card
        class="box-card"
        :body-style="{
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'space-between',
          'min-height': ' 160px',
          'align-items': 'baseline',
        }"
        style="flex: 1; margin-right: 10px"
      >
        <div class="box-card-name">您好，王乔伟</div>
        <div class="box-card-desc">
          您目前已经完成了
          <span class="box-card-num">5</span>
          场考试，请继续加油哦！
        </div>
        <el-button type="primary">再次考试</el-button>
      </el-card>
      <el-card class="box-card"> 考试情况 </el-card>
    </div>
    <div class="index-content">
      <el-card class="box-card" style="flex: 1; margin-right: 10px">
        折线图的位置
      </el-card>
      <el-card class="box-card"> 考试情况 </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 300px;
}
.box-card-num {
  color: red;
  font-weight: bold;
  font-size: 24px;
}
.index-content {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
