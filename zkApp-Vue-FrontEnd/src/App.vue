<script setup>
import AppBar from "@/components/AppBar.vue";
import MainContent from "@/components/MainContent.vue";
import useCommon from "@/composables/common";

const {...commons} = useCommon();
</script>

<template>
  <Suspense>
    <template #default>
      <v-app id="inspire">
        <AppBar :commons="commons"></AppBar>
        <MainContent :commons="commons"></MainContent>
      </v-app>
    </template>
    <template #fallback>Loading..</template>
  </Suspense>
</template>
