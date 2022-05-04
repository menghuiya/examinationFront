import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/index",
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("../views/index.vue"),
      },
      {
        path: "myTest",
        name: "myTest",
        component: () => import("../views/myTest.vue"),
      },
      {
        path: "ranking",
        name: "ranking",
        component: () => import("../views/About.vue"),
      },
      {
        path: "about",
        name: "About",
        component: () => import("../views/About.vue"),
      },
    ],
  },
  {
    path: "/examination",
    name: "examination",
    component: () => import("../views/examination/index.vue"),
  },
  {
    path: "/check",
    name: "check",
    component: () => import("../views/examination/check.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/index.vue"),
    redirect: "/admin/dashboard",
    meta: {
      title: "后台管理",
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/admin/dashboard.vue"),
        meta: {
          title: "首页",
          icon: "el-icon-s-home",
        },
      },
      {
        path: "category",
        name: "category",
        component: () => import("../views/admin/category.vue"),
        meta: {
          title: "分类列表",
          icon: "el-icon-s-order",
        },
      },
      {
        path: "exams",
        name: "exams",
        component: () => import("../views/admin/exams.vue"),
        meta: {
          title: "试题列表",
          icon: "el-icon-s-order",
        },
      },
      {
        path: "addExam",
        name: "addExam",
        component: () => import("../views/admin/addExam.vue"),
        meta: {
          title: "新增试题",
          icon: "el-icon-edit",
        },
      },
      {
        path: "papers",
        name: "papers",
        component: () => import("../views/admin/papers.vue"),
        meta: {
          title: "考试列表",
          icon: "el-icon-s-order",
        },
      },
      {
        path: "users",
        name: "users",
        component: () => import("../views/admin/users.vue"),
        meta: {
          title: "用户列表",
          icon: "el-icon-user-solid",
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
