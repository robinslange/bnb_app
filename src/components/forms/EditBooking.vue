<template>
  <div>
    <v-dialog persistent max-width="600" v-model="dialog">
      <v-card>
        <v-card-title v-if="editing && !creating">
          Editing Booking {{ booking.id }}
        </v-card-title>
        <v-card-title v-if="!editing && !creating">
          Viewing Booking {{ booking.id }}
        </v-card-title>
        <v-card-title v-if="creating">
          Creating Booking
        </v-card-title>
        <v-container>
          <v-form>
            <v-row>
              <v-col>
                <v-select
                  :disabled="!editing && !creating"
                  v-model="room"
                  :items="formattedRooms"
                  label="Room (Name, Type, Beds)"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-menu v-model="inDate">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :disabled="!editing && !creating"
                      :value="formatInDate"
                      v-on="on"
                      clearable
                      label="Check In Date"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @change="inDate = false"
                    v-model="booking.checkinDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-menu v-model="outDate">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :disabled="!editing && !creating"
                      :value="formatOutDate"
                      v-on="on"
                      clearable
                      label="Check Out Date"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @change="outDate = false"
                    v-model="booking.checkoutDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn
                v-if="creating"
                @click="checkAvailable"
                :disabled="!booking.checkinDate && !booking.checkoutDate"
                text
                :loading="checking"
              >
                Check Availability</v-btn
              >
            </v-card-actions>
            <span v-if="review">
              <v-card-subtitle>Review:</v-card-subtitle>
              <v-card flat max-height="300px">
                <v-card>
                  <v-btn @click="editReview" fab absolute top right small>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-card-title>
                    <v-rating
                      readonly
                      align="center"
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      length="5"
                      :value="review.rating"
                    ></v-rating>
                  </v-card-title>
                  <v-card-subtitle>{{ review.customer_id }}</v-card-subtitle>
                  <v-card-text>{{ review.review }}</v-card-text>
                  <v-btn
                    v-if="editing"
                    @click="deleteReview"
                    icon
                    absolute
                    bottom
                    right
                    small
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card>
              </v-card>
            </span>
            <v-card-subtitle v-else>
              Currently no reviews for this booking
              <v-btn v-if="!creating" @click="createReviewDialog" text>
                Create one now?
              </v-btn>
            </v-card-subtitle>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-btn @click="$emit('close')">Close</v-btn>
          <v-spacer />
          <v-btn
            v-if="!creating"
            :disabled="!editing"
            @click="$emit('confirm')"
            color="primary"
          >
            Update
          </v-btn>
          <v-btn v-else @click="$emit('confirm')" color="primary">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <EditReview
      @confirm="createReview"
      @close="reviewDialog = false"
      :editing="review"
      :dialog="reviewDialog"
      :review="review || defaultReview"
    />
  </div>
</template>

<script>
import moment from "moment";

export default {
  components: {
    EditReview: () => import("./EditReview"),
  },
  props: ["booking", "dialog", "editing", "creating"],
  name: "EditBooking",
  data: () => ({
    checking: false,
    checked: false,
    inDate: false,
    outDate: false,
    reviewDialog: false,
    editingReview: false,
    rules: {
      required: (value) => !!value || "Required.",
      phone: (value) => {
        const regex = new RegExp(
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
        );
        return regex.test(value) || "Invalid Phone Number";
      },
    },
  }),
  methods: {
    changeRoom(val) {
      console.log(val);
      const newRoom = this.rooms.findIndex((x) => x.name == val.split(",")[0]);
      console.log(newRoom);
      this.$emit("updateRoom", newRoom);
    },
    createReviewDialog() {
      this.reviewDialog = true;
    },
    closeReviewDialog() {
      this.editingReview = false;
      this.reviewDialog = false;
    },
    async createReview(data) {
      if (this.review) {
        this.$store.dispatch("updateReview", data);
        this.closeReviewDialog();
      } else {
        this.$store.dispatch("createReview", data);
        await this.getReview();
        this.closeReviewDialog();
      }
    },
    getReview() {
      this.$store.dispatch("getReviews", this.booking.id);
    },
    editReview() {
      if (this.review) {
        console.log("edit");
        this.editingReview = true;
        this.reviewDialog = true;
      }
    },
    deleteReview() {
      this.$store.dispatch("deleteReview", this.review);
    },
    async checkAvailable() {
      alert('Couldn\'t figure out how to convert the given query to a Lumen useable one, I am a simple Front-End Dev :(');
    },
  },
  computed: {
    defaultReview() {
      return {
        room_id: this.booking.room_id,
        customer_id: this.booking.customer_id,
        booking_id: this.booking.id,
        review: "",
        rating: 0,
      };
    },
    formatOutDate() {
      return this.booking.checkinDate
        ? moment(this.booking.checkoutDate).format("L")
        : "";
    },
    formatInDate() {
      return this.booking.checkoutDate
        ? moment(this.booking.checkinDate).format("L")
        : "";
    },
    available() {
      return this.$store.state.available;
    },
    rooms() {
      return this.$store.state.rooms;
    },
    formattedRooms() {
      let temp = [];
      if (this.available.length > 0) {
        this.available.map((room, i) => {
          temp[i] = `${room.name}, ${room.type}, ${room.beds}`;
        });
      } else {
        this.rooms.map((room, i) => {
          temp[i] = `${room.name}, ${room.type}, ${room.beds}`;
        });
      }
      return temp;
    },
    review() {
      return this.$store.state.reviews.find(
        (r) => r.booking_id == this.booking.id
      );
    },
    room: {
      set(val) {
        val || this.changeRoom(val);
      },
      get() {
        const r = this.$store.state.rooms.find(
          (x) => x.id == this.booking.room_id
        );
        console.log(r);
        return `${r.name}, ${r.type}, ${r.beds}`;
      },
    },
    // checkinDate() {
    //   return this.booking.checkinDate.parse();
    // },
    // checkoutDate() {
    //   return this.booking.checkoutDate.parse();
    // },
  },
  mounted() {
    this.getReview();
  },
  beforeDestroy() {
    this.$store.dispatch("clearReviews");
  },
};
</script>

<style></style>
