import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Bookings from "../views/Bookings.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/bookings",
    name: "Bookings",
    component: Bookings,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // check if route requires auth
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    // check auth state of user
    let loggedIn = store.state.loggedIn;
    if (loggedIn) {
      // signed in
      // proceed to route
      next();
    } else {
      // not signed in
      // push to login page
      next("/");
    }
  } else {
    next();
  }
});

export default router;
