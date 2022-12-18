import {ref} from "vue";
import {useCookies} from "vue3-cookies";
import useWalletActions from "./walletActions";

export default async (mina,{getUser,setUser}) => {

  const { cookies } = useCookies();
  const userCookie = ref(null);
  userCookie.value = cookies.get(process.env.cookieName);

  // Actions
  const { walletActions } = useWalletActions({getUser,setUser},cookies);

  const checkNetwork = async () => {
    return await mina.value.requestNetwork()
  }

  // Init to state wallet connection info
  const initWallet = async () => {
    const user = getUser.value;
    const currentNetwork =  await checkNetwork();
    user.wallet = {
      isAuro: true,
      currentNetwork,
    };
    console.log("userCookie.value >>", userCookie.value);
    if (currentNetwork !== "Berkeley") {
      alert("Network is not Berkeley ! >>" + currentNetwork);
    }else {
      if (userCookie.value) {
        // request account is important to keep the wallet connection else it will return for connection warning
        try {
        await mina.value.requestAccounts();
        user.accountAddress = userCookie.value
        } catch (e) {
          console.log("verify your wallet connection >>",e);
        }
      }else {
        user.accountAddress = null;
      }
    }
    setUser(user);
  }

  // checkAuro triggered from CenterLayout.vue while mounted
  const checkAuro = async () => {
    try {
      if (mina.value.isAuro) {
        await initWallet();

        // its important to add event listeners after initWallet
        // Because we need to check wallet interactions after initWallet
        addEventListener("message", (event) => {
          if (event.data && event.data.source === "mina-contentscript") { // auro wallet source value
            if (typeof walletActions.value[event.data.message.action] === "function") {
              walletActions.value[event.data.message.action](event);
              console.log("Catched message from content script: ", event.data.message);
            }
            // console.log("Received message from content script: ", event.data.message);
          }
        });
      }
    } catch (error) {
      console.log("Friendly error >>", error);
      alert("you need auro wallet to use this app")
      return false;
    }
  }

  const connectWallet = async () =>{
    const user = getUser.value;
    if (user.wallet.isAuro) {
      if (user.wallet.currentNetwork !== "Berkeley"){
        alert("Please switch to Berkeley network in your wallet");
        return false;
      }
      try {
        // connect request
        const accounts = await mina.value.requestAccounts();
        if (accounts.length > 0) {
          cookies.set(process.env.cookieName, accounts[0]);
          user.accountAddress = accounts[0]
          setUser(user)
        } else {
          // we have try catch while calling this function but still we need to handle this case any expectation
          alert("Are you sure you have a account in your wallet ?");
        }
      } catch (err) {
        if (err.code === 4001){
          alert("You need to verified Auro wallet");
        }
      }
    } else {
      alert("You need auro wallet to use this app")
    }
  }

  const disconnectWallet = async () => {
    // currently we don't have disconnect request in auro wallet
    alert("Disconnect only works with Auro wallet currently");
  }

  return {
    checkAuro,
    connectWallet,
    disconnectWallet,
  }
}
