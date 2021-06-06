<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-footer>
      <v-btn text to="/privacy">Privacy Policy</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
