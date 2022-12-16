<template>
    <v-banner lines="three" icon="$warning" color="warning" class="my-4">
        <v-banner-text>
            App need Auro wallet please click get wallet for app process
        </v-banner-text>

        <template v-slot:actions>
            <v-btn href="https://www.aurowallet.com/" target="_blank">Get Wallet</v-btn>
        </template>
    </v-banner>
</template>