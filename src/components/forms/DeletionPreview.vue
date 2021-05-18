<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card>
      <v-card-title>Are you sure you want to delete this booking?</v-card-title>
      <v-container>
        <v-row>
          <v-col>Room Name:</v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col>
            {{ roomName }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>Check In Date:</v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col>
            {{ booking.checkinDate | moment("L") }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>Check Out Date:</v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col>
            {{ booking.checkoutDate | moment("L") }}
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn @click="$emit('close')" text>Cancel</v-btn>
        <v-spacer />
        <v-btn @click="$emit('confirm')" color="primary">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["booking", "dialog"],
  name: "DeletionPreview",
  data: () => ({}),
  methods: {},
  computed: {
    roomName() {
      const room = this.rooms.find((r) => r.id == this.booking.room_id);
      return room.name;
    },
    rooms() {
      return this.$store.state.rooms;
    },
  },
  mounted() {},
};
</script>

<style></style>
