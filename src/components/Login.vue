<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6">
        <v-card flat>
          <v-card-title>Login</v-card-title>
          <v-col cols="10">
            <v-row>
              <v-text-field
                v-model="username"
                label="username"
                hint="admin"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="password"
                label="password"
                hint="12345"
                type="password"
              ></v-text-field>
            </v-row>
          </v-col>
          <v-btn @click="login" color="primary">Login</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    username: "admin",
    password: "12345",
  }),

  methods: {
    login() {
      if (
        this.username === this.defaultUserName &&
        this.password === this.defaultPassword
      ) {
        this.$store.commit("admin");
        this.$router.push("/bookings");
      } else {
        this.$store.dispatch("login").then((res) => {
          if (res) {
            this.$router.push("/bookings");
          }
        });
      }
    },
  },

  computed: {
    defaultUserName() {
      return this.$store.state.username;
    },
    defaultPassword() {
      return this.$store.state.password;
    },
  },
};
</script>
