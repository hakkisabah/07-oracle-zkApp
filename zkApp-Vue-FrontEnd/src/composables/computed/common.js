import { computed } from "vue";
export default (store) => {
  const getOverlay = computed(() => store.getters.getLoading);
  const getTxns = computed(() => store.getters.getTxns)

  return {
    getOverlay,
    getTxns,
  }
}
