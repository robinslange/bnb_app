/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    registerDialog: false,
    admin: false,
    loggedIn: false,
    username: "admin",
    password: "12345",
    bookings: [],
    rooms: [],
    available: [],
    reviews: [],
    user: [],
  },
  getters: {
    user: (state) => {
      return state.username;
    },
  },
  mutations: {
    setBookings(state, data) {
      state.bookings = data;
    },
    setRoomReviews(state, data) {
      state.roomReviews = data;
    },
    addBooking(state, data) {
      state.bookings.push(data);
    },
    updateReview(state, data) {
      const i = state.reviews.findIndex((r) => r.booking_id == data.booking_id);
      state.reviews.splice(i, 1, data);
    },
    removeBooking(state, data) {
      const i = state.bookings.indexOf(data);
      state.bookings.splice(i, 1);
    },
    removeReview(state, data) {
      console.log("remove", data);
      const i = state.reviews.indexOf(data);
      state.reviews.splice(i, 1);
    },
    addReview(state, data) {
      state.reviews.push(data);
    },
    addRoom(state, data) {
      state.rooms.push(data);
    },
    setRooms(state, data) {
      state.rooms = data;
    },
    setAvailable(state, data) {
      state.availabe = data;
    },
    setUser(state, user) {
      state.user = user;
    },
    login(state) {
      state.loggedIn = true;
    },
    admin(state) {
      state.admin = true;
    },
  },
  actions: {
    deleteBooking({ commit }, item) {
      api.delete("/bookings/" + item.id).then((res) => {
        if (res.status === 200) {
          commit("removeBooking", item);
        }
      });
    },
    getUserBookings({ commit, state }) {
      api.get("/bookings/customer/" + state.user.id).then((res) => {
        if (res.status === 200) {
          res.data.map((booking) => {
            let payload = {
              id: booking.id,
              room_id: booking.room_id,
              customer_id: booking.customer_id,
              checkinDate: booking.checkinDate,
              checkoutDate: booking.checkoutDate,
            };
            commit("addBooking", payload);
          });
        }
      });
    },
    getBookings({ commit }) {
      api.get(`/bookings`).then((res) => {
        res.data.map((booking) => {
          console.log(booking);
          let payload = {
            id: booking.id,
            room_id: booking.room_id,
            customer_id: booking.customer_id,
            checkinDate: booking.checkinDate,
            checkoutDate: booking.checkoutDate,
          };
          commit("addBooking", payload);
        });
      });
    },
    updateBooking({ state }, item) {
      api
        .put(`/bookings/${item.id}`, {
          room_id: item.room_id,
          customer_id: item.customer_id,
          checkinDate: item.checkinDate,
          checkoutDate: item.checkoutDate,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("booking updated");
          } else {
            alert("Error while updating", res.status, res.statusText);
          }
        });
    },
    updateReview({ commit }, item) {
      api
        .put(`/reviews/${item.id}`, {
          room_id: item.room_id,
          customer_id: item.customer_id,
          booking_id: item.booking_id,
          review: item.review,
          rating: item.rating,
        })
        .then((res) => {
          if (res.status === 200) {
            commit("updateReview", item);
          }
        });
    },
    getReviews({ commit }) {
      api.get("/reviews").then((res) => {
        res.data.map((review) => {
          commit("addReview", {
            id: review.id,
            room_id: review.room_id,
            customer_id: review.customer_id,
            booking_id: review.booking_id,
            review: review.review,
            rating: review.rating,
          });
        });
      });
    },
    deleteReview({ commit }, review) {
      return api.delete("/reviews/" + review.id).then((res) => {
        if (res.status === 200) {
          commit("removeReview", review);
          return true;
        }
      });
    },
    getRooms({ commit }) {
      api.get("/rooms").then((res) => {
        res.data.map((room) => {
          let payload = {
            id: room.id,
            name: room.roomname,
            description: room.description,
            type: room.roomtype,
            beds: room.beds,
          };
          commit("addRoom", payload);
        });
      });
    },
    getRoom({ context }, id) {
      console.log("gettingRoom");
      return api.get("/rooms/" + id).then((res) => {
        return res.data;
      });
    },
    clearReviews({ state, commit }) {
      if (state.roomReviews) {
        commit("setRoomReviews", []);
      }
    },
    createReview({ commit }, review) {
      api
        .post("/reviews", {
          room_id: review.room_id,
          customer_id: review.customer_id,
          booking_id: review.booking_id,
          review: review.review,
          rating: review.rating,
        })
        .then((res) => {
          if (res.status === 200) {
            commit("addReview", res.data);
          }
        });
    },
    checkAvailable({ commit }, { inDate, outDate }) {
      console.log(inDate, outDate);
      api
        .post("/rooms/checkAvailable", {
          inDate: inDate,
          outDate: outDate,
        })
        .then((res) => {
          if (res.data.length > 0) {
            commit("setAvailable", res.data);
          }
        });
    },
    register({ commit }, user) {
      return new Promise((resolve) => {
        api
          .post("/user/register", {
            email: user.email,
            password: user.password,
            firstname: user.firstName,
            lastname: user.lastName,
          })
          .then((res) => {
            if (res.status === 201) {
              commit("setUser", res.data);
              commit("login");
              resolve(true);
            }
          });
      });
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        api
          .post("user/login", {
            email: user.email,
            password: user.password,
          })
          .then((res) => {
            if (res.status === 200) {
              commit("setUser", res.data);
              commit("login");
              resolve(true);
            } else {
              reject(false);
            }
          });
      });
    },
    reset({ state }) {
      state.loggedIn = false;
      state.reviews = [];
      state.bookings = [];
      state.rooms = [];
    },
  },
  modules: {},
});
