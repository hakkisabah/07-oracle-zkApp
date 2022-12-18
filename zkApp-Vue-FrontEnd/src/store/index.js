import { createStore } from "vuex";

export default createStore({
  state:{
    cookieName:process.env.cookieName,
    loading: {state:false,message:"",duration:false},
    user:{
      isCompiled:false,
      accountAddress:null,
      wallet:{
        isAuro:false,
        message:{},
        currentNetwork:null,
      }
    },
    txns:[]
  },
  getters: {
    getLoading: (state) => state.loading,
    getUser: (state) => state.user,
    getTxns: (state) => state.txns,
  },
  mutations:{
    setLoading: (state, payload) => (state.loading = payload),
    setUser: (state, payload) => (state.user = payload),
    addTxn: (state,payload) => (state.txns.push({txn:payload}))
  },
  actions:{},
  modules:{}
})
