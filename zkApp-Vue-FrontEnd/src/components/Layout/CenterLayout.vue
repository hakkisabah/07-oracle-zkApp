<script setup>
import { ref, reactive, onMounted, defineProps } from "vue";
// getting from builded contracts
import { OracleExample } from "../../../../contracts/build/src";
import {
  Field,
  PrivateKey,
  PublicKey,
  Mina,
  isReady,
  fetchAccount,
  setGraphqlEndpoint,
  Signature,
} from 'snarkyjs';

import useWallet from "@/composables/wallet";

import NoWallet from "@/components/NoWallet.vue"

// zk-app
const zkApp = ref({});
const transaction = ref({})


// some other vars
const feePayerPrivateKey = "EKEQ7GChwobi2BtHjYF6KQdCm3P6JLq7YtQEEivYXSQWtnCE6Ngz";
// const feePayerPublicKey = "B62qnA64kv7JZMU53ei2adEDuWureULUmKEcn2kVhxkBdML4uV75iBH"

// redeployed contract address:
const zkAppAddress = 'B62qrtCfwkN4QeHHphwpevEnW1zBzsZTbgWwHVhuBzL5SNgxcJB1b27'

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// props from MainContent.vue
const props = defineProps({
  commons: {
    type: Object,
    required: true
  },
  userActions: {
    type: Object,
    required: true,
    deep: true
  },
});

// constant for interactions
const mina = ref({})

const { setOverlay } = props.commons;

const { getUser, setUser } = props.userActions;

const walletMethods = reactive({});

const ORACLE_URL = "https://3zfeebofnm6yarifpd6jb7hkd40dkxtt.lambda-url.eu-central-1.on.aws/score/"

onMounted(async () => {
  try {
    setOverlay({ state: true, message: "Please wait.. app loading.."});
    await sleep(1500)
    await isReady;
    mina.value = window.mina
    walletMethods.value = await useWallet(mina, { getUser, setUser })
    console.log("walletMethods.value", walletMethods.value)
    // create Berkeley connection
    const graphqlEndpoint = 'https://proxy.berkeley.minaexplorer.com/graphql';
    setGraphqlEndpoint(graphqlEndpoint);
    let Berkeley = Mina.Network(graphqlEndpoint);
    Mina.setActiveInstance(Berkeley);
    setOverlay({ state: true, message: "Please wait.. check Auro wallet.."});
    await walletMethods.value.checkAuro();
    setOverlay({ state: false, message: "" })
  } catch (e) {
    console.log("LOAD ERROR > ", e)
    setOverlay({ state: true, message: "Getting error while page loading ! check the error in console !" })
  }
})

const compile = async () => {
  try {
    fetchAccount({ publicKey: zkAppAddress })
    setOverlay({ state: true, message: "Please wait.. compiling.. getting be patient.." })
    const user = getUser.value;
    await sleep(1500)
    await OracleExample.compile();
    user.isCompiled = true;
    setUser(user);
    setOverlay({ state: false, message: "" })
  } catch (error) {
    console.log("COMPILE ERROR >> ", error)
    setOverlay({ state: true, message: "Getting ERROR while compiling.. check the console !" })
  }
}

const createTransaction = async (userId) => {

  try {
    setOverlay({ state: true, message: "Please wait.. getting data.." })
    let { account, error } = await fetchAccount({ publicKey: getUser.value.accountAddress });
    console.log('account balance : ', account.balance);
    console.log('error', JSON.stringify(error, null, 2));

    const response = await fetch(
      `${ORACLE_URL}${userId}`,
    );
    const data = await response.json();

    const id = Field(data.data.id);
    const creditScore = Field(data.data.creditScore);
    const signature = Signature.fromJSON(data.signature);

    setOverlay({ state: true, message: "Please wait.. sending transaction to contract.." })
    zkApp.value = new OracleExample(PublicKey.fromBase58(zkAppAddress));
    await sleep(1500)
    transaction.value = await Mina.transaction(
      { feePayerKey: PrivateKey.fromBase58(feePayerPrivateKey), fee: "100_000_000" },
      (zkApp, id, creditScore, signature) => {
        zkApp.value.verify(
          id,
          creditScore,
          signature,
        )
      })
    setOverlay({ state: true, message: "Please wait.. proving data...." })
    console.log("txn before prove", transaction.value)
    await sleep(500)
    await transaction.value.prove();
    console.log("txn after prove", transaction.value)
    await transaction.value.send();
    console.log("txn after send", transaction.value)

    console.log("verified >>", zkApp.value.events.verified)

    let partiesJsonUpdate = transaction.value.toJSON();

    console.log("partiesJsonUpdate >>", partiesJsonUpdate)

    setOverlay({ state: true, message: "Please wait.. waiting user wallet interactions.." })
    let partyResult = await mina.value.sendTransaction({
      transaction: partiesJsonUpdate,
      feePayer: {
        memo: "",
        fee: "100_000_000",
      },
    })

    if (partyResult.hash) {
      console.log("partyResultDisplay hash >", partyResult.hash)
      // Mocking & simulating for verify emitted signature result
      // Because currently remote blockchaing verify not supported this process
      const verifiedId = zkApp.value.events.verified(id)
      const isVerified = `${verifiedId == 1 ? 'Verified' : 'Not Verified'} ! : ${zkApp.value.events.verified(id)}`
      setOverlay({ state: true, message: `${isVerified}` })
      props.commons.addTxn(partyResult.hash)
      setTimeout(() => {
        setOverlay({ state: true, message: `Transaction hash : ${partyResult.hash}`, duration: 2200 })
      }, 2200)
    } else {
      console.log("partyResultDisplay > err > ", partyResult.message)
      setOverlay({ state: true, message: `Error: ${partyResult.message}`, duration: 2200 })
    }

    let { account_, error_ } = await fetchAccount({ publicKey: PublicKey.fromBase58(zkAppAddress) });
    console.log('account', account.balance);
    console.log('error', JSON.stringify(error, null, 2));
  } catch (error) {
    console.log("TRANSACTION ERROR >> ", error)
    setOverlay({ state: true, message: `Transaction Error : ${error.message ? error.message : error}` })
    setTimeout(() => {
        setOverlay({ state: true, message: `Check the transaction error in console : ${error}`})
      }, 5000)
    return
  }
}

</script>

<template>
  <v-col cols="12" sm="8">
    <v-sheet v-if="!getUser.wallet.isAuro" class="text-center" min-height="70vh" rounded="lg">
      <NoWallet></NoWallet>
    </v-sheet>
    <v-sheet v-else class="text-center" min-height="70vh" rounded="lg">
      <v-row>
        <v-col align-self="center">
          <v-banner lines="three" icon="$info" color="info" class="my-4">
            <v-banner-text v-if="!getUser.isCompiled">
              Compile mandatory not required to this app processes but if any need scenario click the compile button :)
            </v-banner-text>
            <v-banner-text v-else>
              Compiled successfully ! :)
            </v-banner-text>
            <template v-slot:actions>
              <v-btn :disabled="getUser.isCompiled" @click="compile()">{{getUser.isCompiled ? 'compiled !':'compile'}}</v-btn>
            </template>
          </v-banner>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center">
          Process
        </v-col>
        <v-divider></v-divider>
      </v-row>
      <v-row class="mt-10">
        <v-col align-self="center">
          <v-btn @click="getUser.accountAddress ? createTransaction(1): ''">{{ getUser.accountAddress ? 'send transaction for user 1' : 'Need wallet connection' }}
            <v-tooltip
              v-if="!getUser.accountAddress"
              color="warning"
              activator="parent"
              location="top"
            >Need Wallet Connection</v-tooltip>
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-btn @click="getUser.accountAddress ? createTransaction(2) : ''">{{ getUser.accountAddress ?  'send transaction for user 2' : 'Need wallet connection' }}
            <v-tooltip
              v-if="!getUser.accountAddress"
              activator="parent"
              location="top"
            >Need Wallet Connection</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-divider></v-divider>
        <v-col align-self="center">
          Wallet
        </v-col>
        <v-divider></v-divider>
      </v-row>
      <v-spacer></v-spacer>
      <v-row class="mt-10">
        <v-col v-if="getUser.accountAddress" align-self="center">
          <v-btn :href="`https://berkeley.minaexplorer.com/wallet/${getUser.accountAddress}`" target="_blank">My Wallet
            On Berkeley</v-btn>
        </v-col>
        <v-col align-self="center">
          <v-btn v-if="getUser.accountAddress === null" :disabled="!getUser.wallet.isAuro" color="green"
            @click="walletMethods.value.connectWallet()">Connect Wallet
          </v-btn>
          <v-btn v-else color="red" @click="walletMethods.value.disconnectWallet()">Disconnect Wallet
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center">
          <v-btn icon="mdi-github" href="https://github.com/hakkisabah/07-oracle-zkApp" target="_blank"></v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-col>
</template>


<style scoped>

</style>
