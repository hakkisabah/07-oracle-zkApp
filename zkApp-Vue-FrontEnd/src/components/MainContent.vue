<script async setup>
import LeftLayout from "@/components/Layout/LeftLayout.vue";
import CenterLayout from "@/components/Layout/CenterLayout.vue";
import RightLayout from "@/components/Layout/RightLayout.vue";
import useUser from "@/composables/user";

import {defineProps} from "vue";
const props = defineProps({
  commons: {
    type: Object,
    required: true
  },
});

const {getOverlay} = props.commons;
const userActions = await useUser();
</script>

<template>
  <v-main class="bg-grey">
    <v-container>
      <v-row>
        <LeftLayout :commons="props.commons"></LeftLayout>

        <CenterLayout :userActions="userActions" :commons="props.commons"></CenterLayout>

        <RightLayout :userActions="userActions"></RightLayout>
      </v-row>
    </v-container>
  </v-main>
  <v-overlay persistent :model-value="getOverlay.state" class="align-center justify-center bg-black">
    {{getOverlay.message}}
  </v-overlay>
</template>
