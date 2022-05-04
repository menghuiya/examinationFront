<template>
  <div class="user">
    <div class="user-table common-card">
      <div class="user-table-head">
        <h4 class="user-table-head-left">用户数据</h4>
        <div class="user-table-head-right">
          <el-button
            type="primary"
            size="mini"
            @click="
              editData = false;
              dialogFormVisible = true;
            "
            >新增用户</el-button
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
          prop="username"
          label="用户名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="username" label="用户头像" width="80px">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="用户类型"> </el-table-column>
        <el-table-column prop="isban" label="是否封禁">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isban"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="录入日期"> </el-table-column>
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
    <el-dialog title="新增或编辑用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-input v-model="form.avatar"></el-input>
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :file-list="fileList"
            list-type="picture"
            :on-success="handleSuccess"
            :show-file-list="false"
            accept=".jpeg,.png,.jpg,.bmp,.gif"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件,且不超过500kb,请输入图片连接或者上传图片自动获取链接
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio-group v-model="form.role">
            <el-radio label="member">普通用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="form.isban"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="!editData" @click="addUser"
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
import { getUserList, postUser, updateUser, deleteUser } from "@/api/user";
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
        isban: false,
        avatar: "",
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
      fileList: [],
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getUserList(this.pageQuery).then((res) => {
        this.tableData = res?.data || [];
        this.pageTotal = res?.dataCount || 0;
      });
    },
    addUser() {
      postUser(this.form)
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
    handleSuccess(response, file) {
      this.fileList = [file];
      this.form.avatar = response.url;
    },
    handleUpdate() {
      const updateData = {
        username: this.form.username,
        isban: this.form.isban,
        password: this.form.password,
        role: this.form.role,
        avatar: this.form.avatar,
      };
      updateUser(this.form._id, updateData)
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
      deleteUser(id)
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
.user {
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
