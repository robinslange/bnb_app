<template>
  <v-card max-width="1000">
    <v-card-title>
      Current Bookings
      <v-spacer />
      <v-btn @click="createBooking" color="primary">Create Booking</v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="bookings"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:item.checkinDate="{ item }">
        <span>{{ item.checkinDate | moment("L") }}</span>
      </template>
      <template v-slot:item.checkoutDate="{ item }">
        <span>{{ item.checkoutDate | moment("L") }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-row>
          <v-btn @click="editItem(item)" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteItem(item)" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn @click="viewItem(item)" icon>
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-table>

    <EditBooking
      :dialog="dialog"
      @close="close"
      @confirm="update"
      @updateRoom="updateRoom"
      :editing="editing"
      :creating="creating"
      :booking="editedItem"
    />
    <DeletionPreview
      :dialog="dialogDelete"
      @close="closeDelete"
      @confirm="deleteConfirm"
      :booking="editedItem"
    />
  </v-card>
</template>

<script>
// import EditBooking from "@/components/forms/EditBooking";
import DeletionPreview from "@/components/forms/DeletionPreview";
import moment from "moment";

export default {
  components: {
    EditBooking: () => import("@/components/forms/EditBooking"),
    DeletionPreview,
  },
  props: ["bookings"],
  name: "CurrentBookings",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    editing: false,
    destroy: false,
    creating: false,
    headers: [
      {
        text: "Booking ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Room ID", value: "room_id" },
      { text: "Customer ID", value: "customer_id" },
      { text: "Check In Date", value: "checkinDate" },
      { text: "Check Out Date", value: "checkoutDate" },
      { text: "", value: "actions" },
    ],
    editedIndex: -1,
    editedItem: {
      id: null,
      room_id: null,
      customer_id: null,
      checkinDate: null,
      checkoutDate: null,
    },
    defaultItem: {
      id: null,
      room_id: null,
      customer_id: null,
      checkinDate: null,
      checkoutDate: null,
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.editing = false;
      this.creating = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    updateRoom(room_id) {
      if (this.editedIndex > -1) {
        const id = room_id + 1;
        this.editedItem.room_id = id;
      }
    },
    update() {
      if (this.editedIndex > -1) {
        this.$store.dispatch("updateBooking", this.editedItem);
        Object.assign(this.bookings[this.editedIndex], this.editedItem);
      } else {
        // creating a booking
        this.$store.dispatch("createBooking", this.editedItem);
        this.bookings.push(this.editedItem);
      }
      this.close();
    },
    deleteConfirm() {
      this.$store.dispatch("deleteBooking", this.editedItem);
      this.closeDelete();
    },
    deleteItem(item) {
      this.editedIndex = this.bookings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    editItem(item) {
      this.editedIndex = this.bookings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editing = true;
      this.dialog = true;
    },
    createBooking() {
      this.creating = true;
      this.editing = false;
      const item = {
        room_id: 1,
        customer_id: 2,
        checkinDate: moment(new Date()).format("YYYY-MM-DD"),
        checkoutDate: moment(new Date())
          .add({ days: 7 })
          .format("YYYY-MM-DD"),
      };
      this.editedItem = Object.assign({}, item);

      this.dialog = true;
    },
    viewItem(item) {
      this.editedIndex = this.bookings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editing = false;
      this.dialog = true;
    },
    async getRooms() {
      await this.$store.dispatch("getRooms");
    },
    async getReviews() {
      await this.$store.dispatch("getReviews");
    },
  },
  computed: {},
  mounted() {
    this.getRooms();
    this.getReviews();
  },
  beforeDestroy() {
    this.$store.dispatch("reset");
  },
};
</script>

<style></style>
