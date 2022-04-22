<template>
  <div class="pt-5">
    <div class="container">
      <Login />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    Login,
    HelloWorld,
  },
  computed: {
    reaktor() {
      return this.$store.getters.reaktor;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
};
</script>
