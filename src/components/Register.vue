<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6">
        <v-card flat>
          <v-card-title>Register</v-card-title>
          <v-col cols="10">
            <v-row>
              <v-text-field v-model="email" label="Email"></v-text-field>
              <v-text-field
                v-model="firstName"
                label="First Name"
              ></v-text-field>
              <v-text-field v-model="lastName" label="Last Name"></v-text-field>
              <v-text-field v-model="phone" label="Phone Number"></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="password"
                label="password"
                type="password"
              ></v-text-field>
            </v-row>
          </v-col>
          <v-btn @click="register" color="primary">Register</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data: () => ({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  }),
  computed: {
    registerDialog() {
      return this.$store.state.registerDialog;
    },
  },
  methods: {
    register() {
      this.$store
        .dispatch("register", {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          password: this.password,
        })
        .then((res) => {
          if (res) {
            this.$router.push("/bookings");
            this.$store.commit("login");
          }
        });
    },
  },
};
</script>
