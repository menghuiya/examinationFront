<template>
  <div class="examination">
    <div class="examination-header">
      <div class="examination-header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>返回
      </div>
      <div class="examination-header-title">
        查看 <span style="color: red">{{ query.title }}</span> 考试结果
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
            <el-tag type="success" size="mini" v-if="item.result"
              >回答正确</el-tag
            >
            <el-tag type="danger" size="mini" v-else>回答错误</el-tag>
            <el-tag
              type="warning"
              size="mini"
              v-if="!item.answer.length"
              style="margin-left: 5px"
              >未做</el-tag
            >
          </div>
          <div class="examination-examitem-data">
            <div class="examination-radios" v-if="index < radios">
              <div
                class="examination-radios-item"
                v-for="option in item.detail.options"
                :key="option.id"
                :class="{
                  'examination-radios-success':
                    item.result && item.answer === option.id,
                  'examination-radios-success': item.realAnwser === option.id,
                  'examination-radios-error':
                    !item.result && item.answer === option.id,
                }"
              >
                <div class="examination-radios-item-left"></div>
                <div class="examination-radios-item-right">
                  <span
                    class="examination-radios-item-right-tag"
                    style="margin-right: 5px"
                    >{{ option.id }}</span
                  >
                  <img
                    :src="option.content"
                    alt="题目哦"
                    v-if="option.type === 'img'"
                  />
                  <div
                    class="examination-radios-item-content"
                    v-if="option.type === 'str'"
                  >
                    {{ option.content }}
                  </div>
                  <div
                    class="examination-radios-item-content"
                    v-if="option.type === 'code'"
                    v-highlight
                  >
                    <pre>
                      <code v-html="option.content"></code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="examination-checks" v-if="index >= radios">
              <div
                class="examination-checks-item"
                v-for="option in item.detail.options"
                :key="option.id"
                :class="{
                  'examination-checks-success':
                    item.result && item.answer.includes(option.id),
                  'examination-checks-success': item.realAnwser.includes(
                    option.id
                  ),
                  'examination-checks-error':
                    !item.result && item.answer.includes(option.id),
                }"
              >
                <div class="examination-checks-item-left"></div>
                <div class="examination-checks-item-right">
                  <span
                    class="examination-checks-item-right-tag"
                    style="margin-right: 5px"
                    >{{ option.id }}</span
                  >
                  <img
                    :src="option.content"
                    alt="题目哦"
                    v-if="option.type === 'img'"
                  />
                  <div
                    class="examination-radios-item-content"
                    v-if="option.type === 'str'"
                  >
                    {{ option.content }}
                  </div>
                  <div
                    class="examination-radios-item-content"
                    v-if="option.type === 'code'"
                    v-highlight
                  >
                    <pre>
                      <code v-html="option.content"></code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="examination-descbox">
              <el-descriptions :column="1">
                <el-descriptions-item label="您的答案">
                  <el-tag
                    size="mini"
                    v-for="ans in item.answer"
                    :key="ans"
                    style="margin-right: 5px"
                    >{{ ans }}</el-tag
                  >
                </el-descriptions-item>
                <el-descriptions-item label="正确答案">
                  <el-tag
                    type="success"
                    size="mini"
                    v-for="ans in item.realAnwser"
                    :key="ans"
                    style="margin-right: 5px"
                  >
                    {{ ans }}
                  </el-tag>
                </el-descriptions-item>

                <el-descriptions-item label="知识来源" :span="2">
                  {{ item.detail.knowledge }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>
      </div>
      <div class="examination-content-right">
        <div class="examination-user">
          <div class="examination-user-img"></div>
          <div class="examination-user-info">
            <div class="examination-user-info-name">王乔伟</div>
            <div class="examination-user-info-score">
              满分：<span>101</span>
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
                'examination-answer-success': examList[i - 1].result,
                'examination-answer-error': !examList[i - 1].result,
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
                'examination-answer-success': examList[i + radios - 1].result,
                'examination-answer-error': !examList[i + radios - 1].result,
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
            type="success"
            size="small"
            @click="dialogTableVisible = true"
            >查看结果</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog title="考试结果" :visible.sync="dialogTableVisible">
      <el-result
        :icon="paperResult.isPass ? 'success' : 'error'"
        :title="paperResult.isPass ? '考试通过' : '考试失败'"
      >
        <template slot="subTitle">
          <div>
            您本次考试题数{{ this.paperResult.total }}，答对{{
              this.paperResult.right
            }}，答错{{ this.paperResult.total - this.paperResult.right }}。
          </div>
        </template>
        <template slot="extra">
          <el-button
            type="primary"
            size="medium"
            @click="dialogTableVisible = false"
            >确定</el-button
          >
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckPaperById } from "@/api/paper";
export default {
  data() {
    return {
      query: this.$route.query,
      id: this.$route.query.id,
      radio: "",
      examList: [],
      radios: 0,
      checkes: 0,
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
    }
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
    initPaper() {
      getCheckPaperById(this.id)
        .then((res) => {
          this.paperResult = res?.data || {};
          this.examList = res?.data?.results || [];
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
    &-success {
      background-color: #50d4ab;
    }
    &-error {
      background-color: #f66f6a;
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
      &-item {
        display: block;
        word-break: break-all;
        white-space: normal;
        font-size: 16px;
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
  img {
    max-width: 100%;
    max-height: 100px;
  }
  &-radios {
    font-size: 16px;
    &-item {
      display: flex;
      margin: 5px 0;
      &-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M512.114 68.153c59.96 0 117.987 11.719 172.6 34.816 52.794 22.3 100.239 54.272 140.971 95.118 40.733 40.733 72.704 88.178 95.119 140.97C943.9 393.672 955.62 451.813 955.62 511.66s-11.72 117.987-34.816 172.6c-22.3 52.793-54.272 100.239-95.119 140.971-40.732 40.733-88.177 72.704-140.97 95.118-54.614 23.097-112.754 34.816-172.601 34.816s-117.988-11.719-172.601-34.816c-52.793-22.3-100.238-54.272-140.97-95.118-40.733-40.732-72.705-88.178-95.119-140.97-23.097-54.614-34.816-112.754-34.816-172.601S80.213 393.67 103.31 339.058c22.3-52.793 54.272-100.238 95.118-140.97 40.733-40.733 88.178-72.705 140.971-95.12 54.727-23.096 112.754-34.815 172.715-34.815m0-65.991C230.74 2.162 2.617 230.286 2.617 511.659s228.124 509.497 509.497 509.497S1021.61 793.03 1021.61 511.659 793.486 2.162 512.114 2.162z' fill='%23bfbfbf'/%3E%3C/svg%3E");
        background-size: 100% 100%;
        height: 18px; /*no*/
        width: 15px; /*no*/
        margin-right: 5px;
      }
      &-right {
        flex: 1;
        display: flex;
        align-items: baseline;
        &-tag {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
      &-content {
        flex: 1;
        pre {
          width: fit-content;
          position: relative;
          top: -15px;
        }
      }
    }

    &-error {
      color: #f66f6a;
      .examination-radios-item-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M512 0A512 512 0 0 0 0 512a512 512 0 0 0 512 512 512 512 0 0 0 512-512A512 512 0 0 0 512 0z' fill='%23FD6B6D'/%3E%3Cpath d='M513.755 565.54L359.278 720.019a39.058 39.058 0 0 1-55.296-.073 39.278 39.278 0 0 1 .073-55.442L458.386 510.17 303.323 355.035a36.571 36.571 0 0 1 51.712-51.785L720.75 668.965a36.571 36.571 0 1 1-51.785 51.785l-155.21-155.21zm157.55-262.582a35.255 35.255 0 1 1 49.737 49.737L614.985 461.678a35.255 35.255 0 1 1-49.883-49.81l106.203-108.983z' fill='%23FFF'/%3E%3C/svg%3E");
        background-size: 100% 100%;
      }
    }
    &-success {
      color: #50d4ab;
      .examination-radios-item-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M186.112 186.112h651.776v651.776H186.112V186.112z' fill='%23202425'/%3E%3Cpath d='M985.316 512c0 261.416-211.9 473.316-473.316 473.316S38.684 773.416 38.684 512 250.584 38.684 512 38.684 985.316 250.584 985.316 512z' fill='%231A6'/%3E%3Cpath d='M512 75.093C270.718 75.093 75.093 270.718 75.093 512S270.718 948.907 512 948.907 948.907 753.282 948.907 512 753.282 75.093 512 75.093zM2.276 512C2.276 230.486 230.486 2.276 512 2.276S1021.724 230.486 1021.724 512 793.514 1021.724 512 1021.724 2.276 793.514 2.276 512z' fill='%231A6'/%3E%3Cpath d='M805.456 327.771a54.613 54.613 0 0 1 0 77.187l-327.68 327.68a54.613 54.613 0 0 1-77.187 0L218.544 550.593a54.613 54.613 0 0 1 77.187-77.186l143.451 143.378L728.27 327.698a54.613 54.613 0 0 1 77.187 0z' fill='%23FFF'/%3E%3C/svg%3E");
        background-size: 100% 100%;
      }
    }
  }
  &-checks {
    font-size: 16px;
    &-item {
      display: flex;
      margin: 5px 0;
      &-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M883.712 68.494c18.66 0 36.409 7.396 49.72 20.822 13.427 13.425 20.822 31.06 20.822 49.72v745.586c0 18.66-7.395 36.41-20.821 49.721-13.426 13.426-31.061 20.821-49.721 20.821h-745.7c-18.66 0-36.408-7.395-49.72-20.82-13.426-13.427-20.822-31.062-20.822-49.722V139.036c0-18.66 7.396-36.408 20.822-49.72 13.425-13.426 31.06-20.822 49.72-20.822h745.7m0-65.99h-745.7C62.92 2.503 1.48 63.943 1.48 139.035v745.586c0 75.094 61.44 136.534 136.533 136.534h745.586c75.094 0 136.534-61.44 136.534-136.534V139.036c.113-75.093-61.327-136.533-136.42-136.533z' fill='%23cdcdcd'/%3E%3C/svg%3E");
        background-size: 100% 100%;
        height: 18px; /*no*/
        width: 15px; /*no*/
        margin-right: 5px;
      }
      &-right {
        flex: 1;
        display: flex;
        align-items: baseline;
        &-tag {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
      &-content {
        flex: 1;
      }
    }

    &-error {
      color: #f66f6a;
      .examination-checks-item-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M967.111 11.378a45.511 45.511 0 0 1 45.511 45.51v910.223a45.511 45.511 0 0 1-45.51 45.511H56.888a45.511 45.511 0 0 1-45.511-45.51V56.888a45.511 45.511 0 0 1 45.51-45.511h910.223zM618.405 331.184L512 445.235l-106.405-114.05a22.756 22.756 0 0 0-28.9-3.642l-3.23 2.504-33.315 31.038a22.756 22.756 0 0 0-1.092 32.177L449.74 512 339.058 630.784a22.756 22.756 0 0 0 1.092 32.13l33.314 31.04a22.756 22.756 0 0 0 32.131-1.138L512 578.719l106.405 114.097a22.756 22.756 0 0 0 28.9 3.64l3.23-2.503 33.315-31.038a22.756 22.756 0 0 0 1.092-32.177L574.214 512l110.728-118.784a22.756 22.756 0 0 0-1.092-32.13l-33.314-31.04a22.756 22.756 0 0 0-32.131 1.138z' fill='%23FD6B6D'/%3E%3C/svg%3E");
        background-size: 100% 100%;
      }
    }
    &-success {
      color: #50d4ab;
      .examination-checks-item-left {
        background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M139.173 14.897h745.654q124.276 0 124.276 124.276v745.654q0 124.276-124.276 124.276H139.173q-124.276 0-124.276-124.276V139.173q0-124.276 124.276-124.276z' fill='%2350d4ab'/%3E%3Cpath d='M425.728 709.53L262.81 534.58a25.907 25.907 0 0 1 0-35.022l32.921-34.97a22.374 22.374 0 0 1 32.87 0L442.215 587.11l253.133-272.64a22.374 22.374 0 0 1 32.922 0l32.921 34.97a25.805 25.805 0 0 1 0 34.918L458.598 709.53a22.374 22.374 0 0 1-32.87 0' fill='%23FFF'/%3E%3C/svg%3E");
        background-size: 100% 100%;
      }
    }
  }
  &-descbox {
    margin-top: 10px;
  }
}
</style>
