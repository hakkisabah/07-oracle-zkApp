<template>
  <v-app-bar
    class="px-3"
    flat
    density="compact"
  >
    <v-avatar
      color="grey-darken-1"
      size="32"
    ></v-avatar>

    <v-spacer></v-spacer>

    <v-avatar
      class="hidden-sm-and-down"
      color="grey-darken-1"
      size="32"
    ></v-avatar>
  </v-app-bar>
</template>

<script setup>
import {defineProps} from "vue";
const props = defineProps({
  commons: {
    type: Object,
    required: true
  }
});
const links = [
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
];
</script>

<style scoped>

</style>
