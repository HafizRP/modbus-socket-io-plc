<template>
  <div class="my-2 mx-0" v-if="loggedIn">
    <h4
      class="alert alert-danger text-center mt-3"
      v-if="!reaktor.status & (role == 'ROLE_SUPER ADMIN')"
    >
      Connection lost!
    </h4>
    <div class="row my-5 mx-0 justify-content-md-center">
      <HelloWorld v-if="role == 'ROLE_SUPER ADMIN'" />
      <div class="col-lg col-md mt-5">
        <TableReaktor />
      </div>
    </div>
  </div>
</template>

<script>
import TableReaktor from "@/components/tableReaktor.vue";
import HelloWorld from "@/components/HelloWorld.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    HelloWorld,
    TableReaktor,
    Navbar,
  },
  data() {
    return {};
  },
  computed: {
    reaktor() {
      return this.$store.getters.reaktor;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    role() {
      return this.$store.state.auth.user.roles[0];
    },
  },
};
</script>

<style scoped>
.about {
  margin-top: 50px;
}
</style>
