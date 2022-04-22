import authService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? {
      status: { loggedIn: true },
      user,
    }
  : {
      status: { loggedIn: false },
      user: null,
    };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    Login({ commit, dispatch }, user) {
      return authService
        .Login(user)
        .then((user) => {
          commit("loginSuccess", user);
          dispatch("data", user.roles);
          return Promise.resolve(user);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    Logout({ commit }) {
      authService.Logout();
      commit("logout");
    },
    Register({ commit }, user) {
      authService
        .Register(user)
        .then((result) => {
          commit("registerSuccess");
          return Promise.resolve(result.data);
        })
        .catch((err) => {
          commit("registerFailure");
          return Promise.reject(err);
        });
    },
    data({ commit }, data) {
      commit("data", data);
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
    },
    data(state, data) {
      state.user = data;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    // role(state, role) {
    //   state.status.loggedIn = true;
    //   state.role = role;
    // },
  },
};
