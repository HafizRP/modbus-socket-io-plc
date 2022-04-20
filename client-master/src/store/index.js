import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";
import { getTemp, getPress } from "../plugins/webSocket";

let socket = io("http://localhost:3000");

Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: [getTemp(), getPress()],
  state: {
    data: {
      temp: null,
      press: null,
      status: false,
    },
  },
  mutations: {
    setTemp(state, temp) {
      state.data.temp = temp;
    },

    setPress(state, press) {
      state.data.press = press;
    },

    setStatus(state, status) {
      state.data.status = status;
    },
  },
  actions: {
    data({ dispatch }) {
      socket.on("data", (data) => {
        try {
          dispatch("getTemp", data[0]);
          dispatch("getPress", data[1]);
          dispatch("getStatus", true);
        } catch (error) {}
      });
    },

    status({ dispatch }) {
      socket.on("status", (data) => {
        try {
          if ("reconnecting..." == data) {
            dispatch("getStatus", false);
          } else {
            dispatch("getStatus", true);
          }
        } catch (error) {}
      });
    },

    getTemp({ commit }, temp) {
      commit("setTemp", temp);
    },

    getPress({ commit }, press) {
      commit("setPress", press);
    },

    getStatus({ commit }, status) {
      commit("setStatus", status);
    },
  },
  getters: {
    reaktor: function (state) {
      return state.data;
    },
  },
});
