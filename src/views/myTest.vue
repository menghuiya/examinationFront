<template>
  <div class="mytest">
    <div class="mytest-head">
      <div class="title">我的模拟</div>
      <el-button type="primary" size="mini" @click="dialogFormVisible = true"
        >新增试卷</el-button
      >
    </div>
    <div class="mytest-main" v-if="testData.length">
      <el-card class="box-card" v-for="item in testData" :key="item.id">
        <div slot="header" class="clearfix">
          <span>{{ item.title }}</span>
          <el-tag
            size="small"
            v-if="item.status === 1 && !item.ready"
            type="info"
          >
            还未开始
          </el-tag>
          <el-tag
            size="small"
            v-if="item.status === 2 || (item.status === 1 && item.ready)"
            type="warning"
          >
            进行中
          </el-tag>
          <el-tag size="small" v-if="item.status === 3" type="success">
            已结束
          </el-tag>
          <div style="float: right; padding: 3px 0">
            <span>{{ item.start_time | formatDate }}</span>
          </div>
        </div>
        <div class="box-card-line">
          <el-tag size="small">
            {{
              (cateListMap[item.category] && cateListMap[item.category].name) ||
              item.category
            }}
          </el-tag>
          <el-tag size="small">
            {{ item.subject }}
          </el-tag>
        </div>
        <el-descriptions class="margin-top" :column="2">
          <el-descriptions-item label="开始时间">
            {{ item.start_time | formatTime }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ item.end_time | formatTime }}</el-descriptions-item
          >

          <el-descriptions-item label="题数总数">
            {{ item.total }}
          </el-descriptions-item>
          <el-descriptions-item label="正确数量">
            <span v-if="item.status === 3">
              {{ item.right }}
            </span>
            <span v-else>未提交</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-button
          type="primary"
          v-if="item.status === 1 && !item.ready"
          :disabled="true"
          size="small"
          >还未开始</el-button
        >
        <el-button
          type="primary"
          v-if="item.status === 1 && item.ready"
          size="small"
          @click="handlExam(item)"
          >进入考试</el-button
        >
        <el-button
          type="warning"
          v-if="item.status === 2"
          size="small"
          @click="handlExam(item)"
          >继续考试</el-button
        >
        <el-button
          type="success"
          v-if="item.status === 3"
          size="small"
          @click="handleCheckExam(item)"
          >查看考试</el-button
        >
      </el-card>
    </div>
    <div class="mytest-main mytest-main-nodata" v-if="testData.length === 0">
      <el-empty>
        <el-button type="primary" @click="dialogFormVisible = true"
          >新增试卷</el-button
        >
      </el-empty>
    </div>
    <el-dialog title="新增试卷" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="试卷名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="试卷语言" prop="category">
          <el-select v-model="form.category" placeholder="请选择试卷语言">
            <el-option
              v-for="item in cateList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科目" prop="subject">
          <el-radio-group v-model="form.subject">
            <el-radio label="k2">科目二</el-radio>
            <el-radio label="k3">科目三</el-radio>
            <el-radio label="k4">科目四</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="form.start_time"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="form.end_time"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAddPaper">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPaperList, addPaper, updatePaper } from "@/api/paper";
import { getBaseCateList } from "@/api/exam";

export default {
  data() {
    return {
      userId: "626fa48d49222b199dca7ed6",
      testData: [],
      dialogFormVisible: false,
      form: {
        userId: "626fa48d49222b199dca7ed6",
      },
      cateList: [],
      cateListMap: {},
      rules: {
        title: [{ required: true, message: "请输入试卷名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选试卷类型", trigger: "change" },
        ],
        subject: [
          { required: true, message: "请选择所属科目", trigger: "change" },
        ],
      },
    };
  },
  filters: {
    formatTime(val) {
      if (!val) return "00:00:00";
      const date = new Date(Number(val));
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      h = h > 9 ? h : "0" + h;
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return `${h}:${m}:${s}`;
    },
    formatDate(val) {
      if (!val) return "0000-00-00";
      const date = new Date(Number(val));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m > 9 ? m : "0" + m;
      d = d > 9 ? d : "0" + d;
      return `${y}-${m}-${d}`;
    },
  },
  created() {
    this.initCate();
    this.initData();
  },
  methods: {
    randomColor() {
      let color = "#";
      for (var i = 0; i < 6; i++)
        color += parseInt(Math.random() * 16).toString(16);
      return color;
    },
    initCate() {
      getBaseCateList()
        .then((res) => {
          this.cateList = res?.data || [];
          this.cateList.forEach((item) => {
            this.cateListMap[item.value] = item;
          });
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
    initData() {
      getPaperList()
        .then((res) => {
          this.testData = res?.data || [];
          const now = Date.now();
          this.testData.forEach((item) => {
            if (now > item.start_time) {
              item.ready = true;
            } else {
              item.ready = false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postAddPaper() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addPaper(this.form)
            .then(() => {
              this.$message({
                message: "新增成功，请尽快准备考试",
                type: "success",
              });
              this.initData();
              this.dialogFormVisible = false;
            })
            .catch((err) => {
              this.$message({
                message: err.msg || "系统错误",
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handlExam(item) {
      if (item.status === 1) {
        updatePaper(item._id).catch((err) => {
          this.$message({
            message: err,
            type: "success",
          });
        });
      }
      this.$router.push({
        path: "/examination",
        query: {
          id: item._id,
          end_time: item.end_time,
          subject: item.subject,
          title: item.title,
        },
      });
    },
    handleCheckExam(item) {
      this.$router.push({
        path: "/check",
        query: {
          id: item._id,
          end_time: item.end_time,
          subject: item.subject,
          title: item.title,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mytest-head {
  display: flex;
  .title {
    margin-right: auto;
  }
  .el-button {
    margin-right: 20px;
  }
}
.mytest-main {
  display: flex;
  flex-flow: wrap;
  // justify-content: space-between;
  margin-top: 20px;
  &-nodata {
    align-items: center;
    justify-content: center;
  }
}
.box-card {
  width: calc((100% / 3) - 20px); /*no */
  margin: 10px; /*no */
  min-width: 320px; /*no */
  border-radius: 6px;
  &-line {
    display: flex;
    align-items: center;
    font-size: 12px; /*no */
    margin-bottom: 10px;
    .el-tag {
      margin-right: 5px;
    }
  }
}
</style>
