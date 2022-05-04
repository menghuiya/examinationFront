<template>
  <div class="category">
    <div class="category-table common-card">
      <div class="category-table-head">
        <h4 class="category-table-head-left">试题数据</h4>
        <div class="category-table-head-right">
          <el-button
            type="primary"
            size="mini"
            @click="
              editData = false;
              dialogFormVisible = true;
            "
            >新增分类</el-button
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
          prop="name"
          label="分类名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="value" label="分类值"> </el-table-column>
        <el-table-column prop="color" label="分类颜色"> </el-table-column>
        <el-table-column prop="status" label="分类状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOpen"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="录入日期"> </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row._id)"
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
    <el-dialog title="新增或编辑分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类值">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="分类颜色">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.isOpen"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="!editData" @click="addCate"
          >确 定</el-button
        >
        <el-button type="primary" v-if="editData" @click="handleUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, postCate, updateCate, deleteCate } from "@/api/admin";
export default {
  data() {
    return {
      tableData: [{}, {}],
      pageQuery: {
        page: 1,
        limit: 10,
      },
      form: {
        color: "#5e7ce0",
        isOpen: true,
      },
      predefineColors: [
        "#5e7ce0",
        "#859bff",
        "#C7000B",
        "#adb0b8",
        "#f66f6a",
        "#9faad7",
        "#50d4ab",
      ],
      pageTotal: 0,
      dialogFormVisible: false,
      editData: false,
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getCateList(this.pageQuery).then((res) => {
        this.tableData = res?.data || [];
        this.pageTotal = res?.dataCount || 0;
      });
    },
    addCate() {
      postCate(this.form)
        .then(() => {
          this.$message.success("新增成功");
          this.handleClose();
          this.initTable();
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
    handleClose() {
      this.dialogFormVisible = false;
      this.form = {
        color: "#5e7ce0",
        isOpen: true,
      };
    },
    handleUpdate() {
      const updateData = {
        color: this.form.color,
        isOpen: this.form.isOpen,
        name: this.form.name,
        value: this.form.value,
      };
      updateCate(this.form._id, updateData)
        .then(() => {
          this.$message.success("更新成功");
          this.editData = false;
          this.initTable();
          this.handleClose();
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
    handleEdit(item) {
      this.form = item;
      this.editData = true;
      this.dialogFormVisible = true;
    },
    handleDelete(id) {
      deleteCate(id)
        .then(() => {
          this.$message.success("删除成功");
          this.initTable();
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
  },
};
</script>

<style lang="scss">
.category {
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
