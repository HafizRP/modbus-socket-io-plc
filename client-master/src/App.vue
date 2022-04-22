<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <router-link to="/" class="nav-link" v-if="!loggedIn"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" v-if="loggedIn"
                >About</router-link
              >
            </li>
            <li class="nav-item">
              <a href="" class="nav-link" v-if="loggedIn" @click="Logout"
                >Logout</a
              >
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    Logout() {
      this.$store.dispatch("auth/Logout");
    },
  },
};
</script>

<style></style>
