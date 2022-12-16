import { useStore } from "vuex";
import useCommonComputed from "./computed/common";
export default () => {
  const store = useStore();

  // computed
  const { getOverlay, getTxns } = useCommonComputed(store);
  // methods
  const setOverlay = (val) => {
    store.commit('setLoading', val)
    if (val.duration) {
      setTimeout(() => {
        store.commit('setLoading', { state: false, message: "", duration: false })
      }, parseInt(val.duration) || 500)
    }
  }

  const addTxn = (txn) => {
    store.commit("addTxn", txn);
  }

  return {
    getTxns,
    addTxn,
    getOverlay,
    setOverlay,
  }
}
