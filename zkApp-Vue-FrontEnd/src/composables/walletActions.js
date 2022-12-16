import { ref } from "vue";
export default ({getUser,setUser},cookies) => {
  const walletActions = ref({
    chainChanged: function (event) {
      const user = getUser.value;
      user.wallet.currentNetwork = event.data.message.data
      if (event.data.message.data !== "Berkeley") {
        user.accountAddress = null;
        // console.log("Network is not Berkeley ! >>", event.data.message.data);
      } else if (event.data.message.data === "Berkeley") {
        console.log("Network is Berkeley ! >>", event.data.message.data);
      }
      setUser(user);
    },
    accountsChanged: function (event) {
      if (event.data.message.data.length === 0) {
        const user = getUser.value;
        user.accountAddress = null;
        cookies.remove(process.env.cookieName);
        setUser(user);
      }
    }
  })
  return {walletActions}
}
