<template>
  <div>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="user.username"
        />
        <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small
        >
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="user.password"
        />
      </div>
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import User from "../models/user";
export default {
  name: "Login",
  data() {
    return {
      user: new User("", ""),
      message: "",
      loading: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    // if (this.loggedIn) {
    //   this.$router.push("/about");
    // } else {
    //   this.$router.push("/");
    // }
  },
  methods: {
    handleLogin() {
      if (this.user.username && this.user.password) {
        this.$store
          .dispatch("auth/Login", this.user)
          .then((result) => {
            if (localStorage.getItem("user")) {
              this.$router.push("/about");
            } else {
              this.$swal("Username atau password salah!");
            }
          })
          .catch((err) => {
            this.$swal("Username atau password salah!");
            this.loading = false;
            this.message =
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
              err.message ||
              err.toString();
          });
      }
    },
  },
};
</script>
