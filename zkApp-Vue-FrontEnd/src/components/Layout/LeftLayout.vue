<script setup>
import {defineProps} from "vue";
const props = defineProps({
  commons: {
    type: Object,
    required: true
  },
});
</script>

<template>
  <v-col
    cols="12"
    sm="2"
  >
    <v-sheet
      class="text-center"
      rounded="lg"
      min-height="268"
    >
    <v-card-title>txns :</v-card-title>
    <div v-if="commons.getTxns.value.length < 1">not yet</div>
    <div v-else v-for="t in commons.getTxns.value" :key="t.txn" >
      <a :href="`https://berkeley.minaexplorer.com/transaction/${t.txn}`" target="_blank">{{t.txn.slice(0,6)}}...</a>
    </div>
    </v-sheet>
  </v-col>
</template>
