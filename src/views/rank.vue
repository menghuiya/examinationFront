<template>
  <div class="rank common-card">
    <h2>刷题排行榜</h2>
    <div class="rank-head">
      <el-radio-group v-model="rankType" fill="#f66f6a" @change="initRank">
        <el-radio-button label="all">刷题次数榜</el-radio-button>
        <el-radio-button label="pass">刷题通过榜</el-radio-button>
        <el-radio-button label="nopass">刷题失败榜</el-radio-button>
      </el-radio-group>
    </div>
    <div class="rank-main common-card" v-if="rankList.length">
      <div
        class="rank-main-item"
        v-for="(item, index) in rankList"
        :key="index"
      >
        <el-avatar :size="60" :src="item.detail.avatar" @error="false">
        </el-avatar>
        <div class="rank-main-item-name">{{ item.detail.username }}</div>
        <div class="rank-main-item-count">
          {{ item.count }}
        </div>
      </div>
    </div>
    <el-result
      v-else
      icon="info"
      title="暂无排行数据"
      subTitle="请你参与刷题增加排行数据"
    >
      <template slot="extra">
        <el-button type="primary" size="medium">好的</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
import { getRank } from "@/api/paper";
export default {
  data() {
    return {
      rankType: "all",
      rankList: [],
    };
  },
  created() {
    this.initRank();
  },
  methods: {
    initRank() {
      getRank(this.rankType)
        .then((res) => {
          this.rankList = res?.data || [];
        })
        .catch(() => {
          this.rankList = [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.rank {
  height: 100%;
  border-radius: 6px;
  padding: 10px;
  font-size: 16px;
  h2 {
    text-align: center;
    font-size: 24px;
    padding: 10px 0;
    color: #f66f6a;
  }
  &-head {
    text-align: center;
  }
  &-main {
    background: #f66f6a;
    margin: 10px auto;
    width: 500px;
    max-height: 500px;
    padding: 10px;
    overflow-y: auto;
    &-item {
      margin: 10px 0;
      border-bottom: 1px solid #fa9841;
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      &-name {
        flex: 1;
        margin-left: 10px;
        color: #fff;
      }
      &-count {
        color: #ffffff;
      }
      &:nth-child(1) &-count {
        font-size: 24px;
        font-weight: 600;
      }
      &:nth-child(2) &-count {
        font-size: 20px;
        font-weight: 600;
      }
      &:nth-child(3) &-count {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
</style>
