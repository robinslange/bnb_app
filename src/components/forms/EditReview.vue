<template>
  <v-dialog persistent max-width="450" v-model="dialog">
    <v-card>
      <v-card-title v-if="!editing">Creating Review</v-card-title>
      <v-card-title v-else>Editing Review</v-card-title>
      <v-rating
        align="center"
        empty-icon="mdi-star-outline"
        full-icon="mdi-star"
        v-model="review.rating"
        length="5"
        hover
      ></v-rating>
      <v-textarea style="margin: 10px;" v-model="review.review"></v-textarea>
      <v-card-actions>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-spacer />
        <v-btn @click="$emit('confirm', review)" color="primary">
          <span v-if="!editing">Create</span>
          <span v-else>Update</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["review", "dialog", "editing"],
  name: "EditReview",
  data: () => ({}),
  methods: {},
  computed: {},
};
</script>

<style></style>
