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
      port: {
        valve1: false,
        cwr: false,
        steam: false,
        steamLed: false,
        cw: false,
        cwLed: false,
        ccw: false,
        ccwLed: false,
        drainTop: false,
        drainBottom: false,
        drainLed: false,
      },
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

    setValve(state, valve) {
      state.data.port.valve1 = valve;
    },
    setCWR(state, CWR) {
      state.data.port.cwr = CWR;
    },
    setSteam(state, steam) {
      state.data.port.steam = steam;
    },
    setSteamLed(state, steamLed) {
      state.data.port.steamLed = steamLed;
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

    valve1({ dispatch }) {
      socket.on("valve1", (data) => {
        try {
          dispatch("getValve", data);
        } catch (error) {
          console.log(error);
        }
      });
    },

    CWR({ dispatch }) {
      socket.on("valve2", (data) => {
        try {
          dispatch("getCWR", data);
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

    getValve({ commit }, valve) {
      commit("setValve", valve);
    },
    getCWR({ commit }, CWR) {
      commit("setCWR", CWR);
    },
    getSteam({ commit }, steam) {
      commit("setSteam", steam);
    },
    getSteamLed({ commit }, steamLed) {
      commit("setSteamLed"), steamLed;
    },
  },
  getters: {
    reaktor: function (state) {
      return state.data;
    },
  },
});
