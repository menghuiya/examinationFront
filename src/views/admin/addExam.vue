<template>
  <div class="add">
    <div class="add-form common-card">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="题目名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
          <el-radio-group v-model="form.type" @change="handleChange">
            <el-radio label="single">单选</el-radio>
            <el-radio label="multiple">多选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目语言" prop="category">
          <el-select v-model="form.category" placeholder="请选择题目语言">
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
        <el-form-item label="题目描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入题目描述,如果没有可以忽略"
            v-model="form.desc"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="题目选项" prop="options">
          <div class="addexam-select-header">
            <div>
              选择默认新增类型
              <el-radio-group v-model="addType">
                <el-radio
                  v-for="item in addTypeMap"
                  :key="item.type"
                  :label="item.type"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </div>
            <el-button size="mini" type="primary" @click="addOption"
              >新增选项</el-button
            >
          </div>
          <div
            class="addexam-select"
            v-for="(option, index) in form.options"
            :key="index"
          >
            <el-tag size="mini">{{ String.fromCharCode(index + 65) }}</el-tag>
            <div style="flex: 1" class="addexam-select-item">
              <div class="addexam-select-item-header">
                选项类型：
                <el-radio-group v-model="option.type">
                  <el-radio
                    v-for="item in addTypeMap"
                    :key="item.type"
                    :label="item.type"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
                <i class="el-icon-delete" @click="deleteOption(index)"></i>
              </div>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入选项，如不需要请删除！"
                v-model="option.content"
                v-if="option.type === 'str' || option.type === 'code'"
              >
              </el-input>
              <div v-if="option.type === 'img'">
                <el-input
                  v-model="option.content"
                  placeholder="请输入图片连接或者上传图片自动获取链接"
                ></el-input>
                <el-upload
                  class="upload-demo"
                  action="/api/upload"
                  :file-list="fileList"
                  list-type="picture"
                  :on-success="
                    (response, file, fileList) =>
                      handleSuccess(response, file, index)
                  "
                  :show-file-list="false"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件,且不超过500kb,请输入图片连接或者上传图片自动获取链接
                  </div>
                </el-upload>
                <img
                  v-if="option.content"
                  :src="option.content"
                  alt="选项图片"
                />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="题目答案"
          prop="answer"
          v-if="form.type === 'single'"
          key="answer"
        >
          <el-radio-group v-model="form.answer">
            <el-radio
              :label="String.fromCharCode(i + 65)"
              v-for="(v, i) in form.options"
              :key="i"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="题目答案"
          prop="answer"
          v-if="form.type === 'multiple'"
          key="answers"
        >
          <el-checkbox-group v-model="form.answer">
            <el-checkbox
              :label="String.fromCharCode(i + 65)"
              name="answer"
              v-for="(v, i) in form.options"
              :key="i"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="知识来源">
          <el-input v-model="form.knowledge"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit"
            >立即创建</el-button
          >
          <el-button size="small" type="primary" @click="onSubmit"
            >再次录入</el-button
          >
          <el-button size="small" @click="resetForm('ruleForm')"
            >重置</el-button
          >
          <el-button>返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addExam, getBaseCateList } from "@/api/exam";
export default {
  name: "addExam",
  components: {},
  data() {
    return {
      testId: 1,
      rules: {
        title: [{ required: true, message: "请输入题目名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择题目类型", trigger: "change" },
        ],
        category: [
          { required: true, message: "请选择题目语言", trigger: "change" },
        ],
        subject: [
          { required: true, message: "请选择所属科目", trigger: "change" },
        ],
        options: [
          {
            type: "array",
            required: true,
            message: "请至少新增一个选项",
            trigger: "change",
          },
        ],
        answer: [{ required: true, message: "请选择答案", trigger: "change" }],
      },
      form: {
        title: "",
        type: "single",
        category: "js",
        subject: "k2",
        desc: "",
        options: [],
        answer: "",
        knowledge: "w3.huawei.com",
        status: true,
      },
      cateList: [],
      addTypeMap: [
        { type: "str", name: "文字" },
        { type: "img", name: "图片" },
        { type: "code", name: "代码" },
      ],
      addType: "str",
      fileList: [],
    };
  },
  created() {
    this.initCate();
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.options.forEach((item, index) => {
            item.id = String.fromCharCode(index + 65);
          });
          addExam(this.form)
            .then(() => {
              this.$notify({
                title: "成功",
                message: "新增成功",
                type: "success",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    change(value, render) {
      this.html = render;
    },
    addOption() {
      this.form.options.push({
        type: this.addType,
        conten: "",
      });
    },
    deleteOption(index) {
      this.form.options.splice(index, 1);
    },
    handleSuccess(response, file, index) {
      console.log(response, file, index);
      this.fileList = [file];
      this.form.options[index].content = response.url;
    },
    handleChange(val) {
      if (val === "multiple") {
        this.form.answer = [];
      } else {
        this.form.answer = "";
      }
    },
    initCate() {
      getBaseCateList()
        .then((res) => {
          this.cateList = res?.data || [];
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
  },
};
</script>

<style lang="scss">
.add {
  overflow-y: auto;
  padding: 10px;
  &-form {
    padding: 20px; /*no*/
    margin: 0 40px;
  }
  .addexam-select {
    display: flex;
    align-items: baseline;
    &-header {
      display: flex;
      align-items: center;
      .el-button {
        margin-left: auto;
      }
    }
    .el-tag {
      margin-right: 5px;
    }
    .el-icon-delete {
      font-size: 18px;
      font-weight: 600;
      color: red;
      margin-left: auto;
      cursor: pointer;
    }
    &-item {
      &-header {
        display: flex;
        align-items: baseline;
      }
    }
  }
}
</style>
