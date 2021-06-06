<template>
  <v-card>
    <CurrentBookings :bookings="bookings" />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    CurrentBookings: () => import("@/components/forms/CurrentBookings"),
  },
  name: "BookingsView",
  data: () => ({}),
  methods: {},
  computed: {
    ...mapGetters["user"],
    bookings() {
      return this.$store.state.bookings;
    },
  },
  mounted() {
    if (this.$store.state.admin) {
      this.$store.dispatch("getBookings");
    } else {
      this.$store.dispatch("getUserBookings");
    }
  },
};
</script>

<style></style>
