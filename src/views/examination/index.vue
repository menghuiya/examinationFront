<template>
  <div class="examination">
    <div class="examination-header">
      <div class="examination-header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>返回
      </div>
      <div class="examination-header-title">
        正在进行 <span style="color: red">{{ query.title }}</span> 考试中
      </div>
      <div class="examination-header-right">
        <img src="@/assets/djs.png" alt="倒计时" />
        <span>剩余考试时间：</span>
        <span class="examination-header-right-count">{{
          time | parseTime
        }}</span>
      </div>
    </div>
    <div class="examination-content">
      <div class="examination-content-left">
        <div
          class="examination-examitem"
          v-for="(item, index) in examList"
          :key="index"
          :ref="'examitem-' + index"
          :class="'examitem-' + index"
        >
          <!-- <div class="examination-examitem-type">
            <span v-if="i < 29">单</span>
            <span v-else>多</span>
          </div> -->
          <div class="examination-examitem-head">
            <span>{{ index + 1 }}. </span>
            <span class="examination-examitem-head-title">{{
              item.detail.title
            }}</span>
            <span class="examination-examitem-head-score">(2分)</span>
          </div>
          <div class="examination-examitem-data">
            <el-radio-group v-model="item.answer" v-if="index < 28">
              <el-radio
                :label="option.id"
                v-for="option in item.detail.options"
                :key="option.id"
              >
                <span style="margin-right: 5px">{{ option.id }}</span>
                <img
                  :src="option.content"
                  alt="题目哦"
                  v-if="option.type === 'img'"
                />
                <div
                  class="examination-examitem-data-item"
                  v-if="option.type === 'str'"
                >
                  {{ option.content }}
                </div>
                <div
                  class="examination-examitem-data-item"
                  v-if="option.type === 'code'"
                  v-highlight
                >
                  <pre>
                    <code v-html="option.content"></code>
                  </pre>
                </div>
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-model="item.answer" v-if="index >= 28">
              <el-checkbox
                :label="option.id"
                v-for="option in item.detail.options"
                :key="option.id"
              >
                <span style="margin-right: 5px">{{ option.id }}</span>
                <img
                  :src="option.content"
                  alt="题目哦"
                  v-if="option.type === 'img'"
                />
                <div
                  class="examination-examitem-data-item"
                  v-if="option.type === 'str'"
                >
                  {{ option.content }}
                </div>
                <div
                  class="examination-examitem-data-item"
                  v-if="option.type === 'code'"
                  v-highlight
                >
                  <pre>
                    <code v-html="option.content"></code>
                  </pre>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="examination-content-right">
        <div class="examination-user">
          <div class="examination-user-img"></div>
          <div class="examination-user-info">
            <div class="examination-user-info-name">王乔伟</div>
            <div class="examination-user-info-score">
              满分：<span>100</span>
            </div>
          </div>
        </div>
        <div class="examination-process">
          <div class="examination-process-text">
            <span>答题进度</span>
            <span>{{ selectNum }}/{{ examList.length || 43 }}</span>
          </div>
          <el-progress
            :percentage="percentage"
            :stroke-width="3"
            :show-text="false"
          ></el-progress>
        </div>
        <div class="examination-answer">
          <div class="examination-answer-head">
            <div class="examination-answer-head-type">单选题</div>
            <div class="examination-answer-head-num">
              共 <span>{{ radios }}</span> 题
            </div>
          </div>
          <div class="examination-answer-box">
            <div
              class="examination-answer-card"
              :class="{
                'examination-answer-selected': examList[i - 1].answer.length,
              }"
              v-for="i in radios"
              :key="i"
              @click="jumpTo(i, 'radio')"
            >
              {{ i }}
            </div>
          </div>
        </div>
        <div class="examination-answer">
          <div class="examination-answer-head">
            <div class="examination-answer-head-type">多选题</div>
            <div class="examination-answer-head-num">
              共 <span>{{ checkes }}</span> 题
            </div>
          </div>
          <div class="examination-answer-box">
            <div
              class="examination-answer-card"
              :class="{
                'examination-answer-selected':
                  examList[i + radios - 1].answer.length,
              }"
              v-for="i in checkes"
              :key="i"
              @click="jumpTo(i, 'checkd')"
            >
              {{ i + radios }}
            </div>
          </div>
        </div>

        <div class="examination-submit">
          <el-button
            type="danger"
            size="small"
            @click="submitPaper"
            v-if="!submitStaus"
            >结束考试</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog
      title="考试结果"
      :visible.sync="dialogTableVisible"
      :before-close="handleClose"
    >
      <el-result
        :icon="isPass ? 'success' : 'error'"
        :title="isPass ? '考试通过' : '考试失败'"
      >
        <template slot="subTitle">
          <div>
            您本次考试题数{{ this.paperResult.total }}，答对{{
              this.paperResult.right
            }}，答错{{ this.paperResult.total - this.paperResult.right }}。
          </div>
        </template>
        <template slot="extra">
          <el-button type="primary" size="medium" @click="goBack"
            >返回首页</el-button
          >
          <el-button type="success" size="medium" @click="goCheck"
            >查看错题</el-button
          >
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { getPaperById, postPaperById } from "@/api/paper";
export default {
  data() {
    return {
      query: this.$route.query,
      id: this.$route.query.id,
      time: 3600000,
      a: 1,
      radio: "",
      examList: [],
      radios: 0,
      checkes: 0,
      timmer: null,
      dialogTableVisible: false,
      paperResult: {},
      submitStaus: false,
      isPass: false,
      subjectMap: {
        k2: 0.7,
        k3: 0.85,
        k4: 0.7,
      },
    };
  },
  created() {
    this.initPaper();
    if (!this.$route.query.end_time) {
      this.$router.go(-1);
    } else {
      this.time = this.$route.query.end_time - Date.now();
    }
  },
  mounted() {
    this.timmer = setInterval(() => {
      this.time -= 1000;
      if (this.time === 0) {
        clearInterval(this.timmer);
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timmer);
  },
  filters: {
    parseTime(val) {
      let h = Math.floor(val / 1000 / 60 / 60);
      let m = Math.floor((val / 1000 / 60) % 60);
      let s = Math.floor((val / 1000) % 60);
      h = h > 9 ? h : "0" + h;
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return `${h}:${m}:${s}`;
    },
  },
  computed: {
    selectNum() {
      const selectNum = this.examList.filter((v) => v.answer.length).length;
      return selectNum;
    },
    percentage() {
      const selectNum = this.examList.filter((v) => v.answer.length).length;
      return (selectNum / 43) * 100;
    },
  },
  methods: {
    goBack() {
      this.$router.replace("/myTest");
    },
    goCheck() {
      this.$router.push({
        path: "/check",
        query: this.query,
      });
    },
    initPaper() {
      getPaperById(this.id)
        .then((res) => {
          this.examList = res?.data || [];
          this.radios = this.examList.filter(
            (v) => v?.detail?.type === "single"
          ).length;
          this.checkes = this.examList.filter(
            (v) => v?.detail?.type === "multiple"
          ).length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    jumpTo(index, type) {
      let refName = ".examitem-" + (index - 1);
      if (type === "checkd") {
        refName = ".examitem-" + (index + this.radios - 1);
      }
      const element = document.querySelector(refName).offsetTop;
      const parent = document.querySelector(".examination-content-left");
      parent.scrollTop = element - parent.offsetTop;
    },
    initResultPage() {
      clearInterval(this.timmer);
      const scoreRate =
        this.paperResult.rightScore / this.paperResult.totalScore;
      this.isPass = scoreRate >= this.subjectMap[this.query.subject];
      this.dialogTableVisible = true;
    },
    submitPaper() {
      this.$confirm("此操作将提交试卷，提交后不可修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.submitStaus = true;
          // 处理一下答案
          const postData = [];
          this.examList.forEach((item) => [
            postData.push({
              _id: item._id,
              answer: item.answer,
            }),
          ]);
          postPaperById(this.id, postData)
            .then((res) => {
              this.paperResult = res?.data;
              this.initResultPage();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "请认真答题！",
          });
        });
    },
    handleClose() {
      this.$router.replace("/myTest");
    },
  },
};
</script>

<style lang="scss">
.examination {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    height: 64px;
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-title {
      position: absolute;
      width: fit-content;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      font-size: 18px;
    }
    &-left {
      color: #5e7ce0;
      margin-left: 10px; /*no*/
      font-size: 16px;
      cursor: pointer;
      i {
        font-weight: 800;
      }
    }
    &-right {
      font-weight: 600;
      margin-right: 20px;
      font-size: 18px;
      display: flex;
      align-items: center;
      img {
        width: 24px;
        vertical-align: middle;
      }
      &-count {
        font-size: 20px;
        color: #d64a52;
      }
    }
  }
  &-content {
    flex: 1;
    display: flex;
    padding: 15px; /*no*/
    overflow: hidden;
    &-left {
      flex: 1;
      margin-right: 15px; /*no*/
      overflow-y: auto;
      scroll-behavior: smooth;
      :last-child {
        margin-bottom: 0;
      }
    }
    &-right {
      width: 300px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      overflow-y: auto;
    }
  }
  &-user {
    display: flex;
    &-img {
      width: 80px;
      height: 80px;
      background-color: #dfe1e6;
      border-radius: 50%;
      margin-right: 10px; /*no*/
    }
    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      &-name {
        font-weight: 600;
        font-size: 18px;
      }
      &-score {
        font-size: 12px; /*no*/
      }
    }
  }
  &-process {
    background-color: #dfe1e6;
    border-radius: 6px; /*no*/
    height: 80px;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    &-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px; /*no*/
    }
  }
  &-answer {
    margin-top: 20px;
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
    &-box {
      display: flex;
      flex-flow: wrap;
      margin-top: 10px;
      :nth-child(5n + 1) {
        margin-left: 0;
      }
      :nth-child(5n) {
        margin-right: 0;
      }
    }
    &-card {
      height: 25px;
      width: calc((100% - 40px) / 5);
      background-color: #dfe1e6;
      text-align: center;
      line-height: 25px;
      color: #fff;
      margin: 5px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;
    }
    &-selected {
      background-color: #5e7ce0;
    }
  }
  &-submit {
    display: flex;
    margin-top: 20px;
    .el-button {
      flex: 1;
    }
  }
  &-examitem {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-bottom: 15px;
    font-size: 16px;
    position: relative;
    &-head {
      font-weight: 600;
      font-size: 16px;
      &-score {
        color: red;
        margin-left: 10px;
      }
    }
    &-data {
      margin: 10px 0 10px 15px;
      .el-radio-group {
        display: flex;
        flex-direction: column;
        .el-radio {
          margin: 5px 0;
          display: flex;
          .el-radio__label {
            display: flex;
          }
        }
      }
      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        .el-checkbox {
          margin: 5px 0;
          display: flex;
          .el-checkbox__label {
            display: flex;
          }
        }
      }
      img {
        max-width: 100%;
        max-height: 100px;
      }
      &-item {
        display: block;
        word-break: break-all;
        white-space: normal;
        font-size: 16px;
        pre {
          position: relative;
          top: -15px;
        }
        pre code.hljs {
          // padding: 0;
        }
      }
    }
    &-type {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 30px;
      font-weight: bolder;
      color: #dfe1e6;
    }
  }
}
</style>
