<template>
    <v-card>
        <CurrentBookings :bookings="bookings"/>
    </v-card>
</template>


<script>
import {mapGetters} from 'vuex';

export default {
  components: {
      CurrentBookings: () => import('@/components/forms/CurrentBookings')
  },
  name: "BookingsView",
  data: () => ({}),
  methods: {},
  computed: {
      ...mapGetters['user'],
      bookings() {
          return this.$store.state.bookings
      }
  },
  mounted() {
      this.$store.dispatch('getBookings');
  }
};
</script>

<style></style>