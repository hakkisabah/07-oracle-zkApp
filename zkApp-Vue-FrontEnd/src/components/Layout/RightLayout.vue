<script setup>
import {defineProps} from "vue";
const props = defineProps({
  userActions: {
    type: Object,
    required: true,
    deep: true
  },
});

const { getUser } = props.userActions;
</script>

<template>
  <v-col
    cols="12"
    sm="2"
  >
    <v-sheet
      class="text-center justify-center"
      rounded="lg"
      min-height="268"
    >
      <v-card-title>address :</v-card-title>
      {{ getUser.accountAddress !== null ? `${getUser.accountAddress.slice(0, 6)}...${getUser.accountAddress.slice(-4)}` : "not connected" }}
    </v-sheet>
  </v-col>
</template>
