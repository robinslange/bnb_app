<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

// TODO: create page for viewing all bookings with buttons to Manage
// TODO: create page to preview booking and delete 
// TODO: create page to view all booking details including reviews
// TODO: create page to edit review
// TODO: link above pages correctly
// TODO: link make a booking form to DB for listing rooms
// TODO: create page to make booking, only show rooms if available (API implementation needed)
