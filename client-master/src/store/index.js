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
      status: null,
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
    setCCW(state, CCW) {
      state.data.port.ccw = CCW;
    },
    setCCWLed(state, CCWLed) {
      state.data.port.ccwLed = CCWLed;
    },
    setCW(state, CW) {
      state.data.port.cw = CW;
    },
    setCWLed(state, CWLed) {
      state.data.port.cwLed = CWLed;
    },
    setDrainTop(state, drainTop) {
      state.data.port.drainTop = drainTop;
    },
    setDrainBottom(state, drainBottom) {
      state.data.port.drainBottom = drainBottom;
    },
    setDrainLed(state, drainLed) {
      state.data.port.drainLed = drainLed;
    },
  },
  actions: {
    data({ dispatch, getters }) {
      socket.on("registers", (data) => {
        dispatch("getTemp", data[0]);
        dispatch("getPress", data[1]);
        dispatch("getStatus", true);
      });

      socket.on("coils", (data) => {
        try {
          dispatch("getValve", Boolean(data[17 - 1]));
          dispatch("getCWR", Boolean(data[18 - 1]));
          dispatch("getSteam", Boolean(data[19 - 1]));
          dispatch("getSteamLed", Boolean(data[19 - 1]));

          dispatch("getCW", Boolean(data[20 - 1]));
          dispatch("getCWLed", Boolean(data[20 - 1]));

          dispatch("getCCW", Boolean(data[21 - 1]));
          dispatch("getCCWLed", Boolean(data[21 - 1]));

          dispatch("getDrainTop", Boolean(data[22 - 1]));
          dispatch("getDrainBottom", Boolean(data[23 - 1]));
          dispatch(
            "getDrainLed",
            getters.reaktor.port.drainTop || getters.reaktor.port.drainBottom
              ? true
              : false
          );
        } catch (error) {}
      });

      socket.on("status", (data) => {
        if ("reconnecting..." == data) {
          dispatch("getStatus", false);
        } else {
          dispatch("getStatus", true);
        }
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
      commit("setSteamLed", steamLed);
    },
    getCW({ commit }, CW) {
      commit("setCW", CW);
    },
    getCWLed({ commit }, CWLed) {
      commit("setCWLed", CWLed);
    },
    getCCW({ commit }, CCW) {
      commit("setCCW", CCW);
    },
    getCCWLed({ commit }, CCWLed) {
      commit("setCCWLed", CCWLed);
    },
    getDrainTop({ commit }, drainTop) {
      commit("setDrainTop", drainTop);
    },
    getDrainBottom({ commit }, drainBottom) {
      commit("setDrainBottom", drainBottom);
    },
    getDrainLed({ commit }, drainLed) {
      commit("setDrainLed", drainLed);
    },
  },
  getters: {
    reaktor: function (state) {
      return state.data;
    },
  },
});
