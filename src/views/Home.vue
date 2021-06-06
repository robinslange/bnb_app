<template>
  <v-card>
    <v-tabs v-model="tabs">
      <v-tab>
        Login
      </v-tab>
      <v-tab>
        Register
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <Login />
      </v-tab-item>
      <v-tab-item>
        <Register />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Login from "../components/Login";
import Register from "../components/Register";

export default {
  name: "Home",
  data: () => ({
    tabs: null,
  }),
  components: {
    Login,
    Register,
  },
};
</script>
