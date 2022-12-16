import { useStore } from "vuex";
import useUserComputed from "./computed/user";

export default () => {
  const store = useStore();

  // computed
  const { getUser } = useUserComputed(store);

  // methods
  const setUser = (val) => {
    store.commit('setUser', val)
  }

  return {
    getUser,
    setUser,
  }
}
