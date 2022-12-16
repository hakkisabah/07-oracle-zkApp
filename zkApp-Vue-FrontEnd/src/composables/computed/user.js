import { computed } from "vue";
export default (store) => {
  const getUser = computed(() => store.getters.getUser);
  return {
    getUser,
  }
}
