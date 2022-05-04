<template>
  <div class="exams">
    <div class="exams-filter common-card">筛选的位置 暂且先放着</div>
    <div class="exams-table common-card">
      <div class="exams-table-head">
        <h4 class="exams-table-head-left">试题数据</h4>
        <div class="exams-table-head-right">
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
          label="题目名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="type" label="题目类型">
          <template slot-scope="scope">
            {{ scope.row.type === "single" ? "单选" : "多选" }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="题目语言"> </el-table-column>
        <el-table-column prop="subject" label="题目等级"> </el-table-column>
        <el-table-column prop="knowledge" label="题目知识点"> </el-table-column>
        <el-table-column prop="desc" label="题目描述"> </el-table-column>
        <el-table-column prop="create_time" label="录入日期"> </el-table-column>
        <el-table-column prop="status" label="题目状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>
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
import { getExamList } from "@/api/exam";
export default {
  data() {
    return {
      tableData: [],
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
      getExamList(this.pageQuery).then((res) => {
        this.tableData = res?.data || [];
        this.pageTotal = res?.dataCount || 0;
      });
    },
  },
};
</script>

<style lang="scss">
.exams {
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
