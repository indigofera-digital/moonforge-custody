'use strict';

const { Account } = require('../utils/dynamodb');
const Responses = require('../utils/api-responses');
const { ethers } = require('ethers');
const { ImmutableX, generateStarkPrivateKey, createStarkSigner } = require('@imtbl/core-sdk');
const config = require('../utils/config');

module.exports.signup = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);

    // check if account exists, if exists return publickey
    // if does not exists create wakket and register to imx
    const login = data.login;
    let { Item: account } = await Account.get({ login: login });
    
    if (!account) {
      console.log('Account does not exist, creating new account');
      // create account
      // generate wallet
      // generate stark and register to imx
      const wallet = ethers.Wallet.createRandom();

      const provider = new ethers.providers.AlchemyProvider(config.network, config.alchemyApiKey);
      const ethSigner = new ethers.Wallet(wallet.privateKey).connect(provider);

      const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
      const starkSigner = createStarkSigner(starkPrivateKey);

      const imxClient = new ImmutableX(config.imxConfig);

      const walletConnection = { ethSigner, starkSigner };
      const registerRequest = await imxClient.registerOffchain(walletConnection);
      console.log('registerRequest', registerRequest);

      account = {
        login: login,
        publicAddress: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
        starkPrivateKey: starkPrivateKey,
      };
    }
    await Account.put(account);

    return Responses._200(account);

  } catch (error) {
    console.error('error', error);
    return Responses._400({ message: error.message || 'failed to signup' });
  };
};
