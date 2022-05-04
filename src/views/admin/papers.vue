<template>
  <div class="papers">
    <div class="papers-table common-card">
      <div class="papers-table-head">
        <h4 class="papers-table-head-left">试题数据</h4>
        <div class="papers-table-head-right">
          <el-button
            type="primary"
            size="mini"
            @click="dialogFormVisible = true"
            >新增试题</el-button
          >
        </div>
      </div>
      <el-table
        max-height="750"
        border
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column
          prop="title"
          label="考试名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="type" label="考试类型"> </el-table-column>
        <el-table-column prop="category" label="考试语言"> </el-table-column>
        <el-table-column prop="subject" label="考试等级"> </el-table-column>
        <el-table-column prop="status" label="考试状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 1" type="info">
              还未开始
            </el-tag>
            <el-tag size="small" v-if="scope.row.status === 2" type="warning">
              进行中
            </el-tag>
            <el-tag size="small" v-if="scope.row.status === 3" type="success">
              已结束
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间"> </el-table-column>
        <el-table-column prop="end_time" label="结束时间"> </el-table-column>
        <el-table-column prop="total" label="考试题数"> </el-table-column>
        <el-table-column prop="right" label="正确数量"> </el-table-column>
        <el-table-column prop="create_time" label="录入日期"> </el-table-column>
        <el-table-column label="操作" width="100px">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="initTable"
        @current-change="initTable"
        :current-page.sync="pageQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getPaperList } from "@/api/paper";
export default {
  data() {
    return {
      tableData: [{}, {}],
      pageQuery: {
        page: 1,
        limit: 10,
      },
      pageTotal: 0,
      dialogFormVisible: false,
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getPaperList(this.pageQuery).then((res) => {
        this.tableData = res?.data || [];
        this.pageTotal = res?.dataCount || 0;
      });
    },
  },
};
</script>

<style lang="scss">
.papers {
  margin: 15px;
  &-table {
    border-radius: 6px;
    overflow: hidden;
    padding: 10px;
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  &-filter {
    margin-bottom: 10px;
    padding: 10px;
  }
}
</style>
