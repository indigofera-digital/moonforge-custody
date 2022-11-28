const { Config, createStarkSigner } = require('@imtbl/core-sdk');
const { AlchemyProvider } = require('@ethersproject/providers');
const { Wallet } = require('@ethersproject/wallet');

module.exports = configInit();

function configInit() {

    const network = getEnv('ETH_NETWORK');
    const imxConfig = network === 'mainnet' ? Config.PRODUCTION : Config.SANDBOX;

    return {
        imxConfig: imxConfig,
        network: network,
        alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
        alchemyChainRPC: getEnv('ALCHEMY_CHAIN_RPC'),
        dynamoDBTable: getEnv('DYNAMODB_TABLE'),
    }
}

function generateWalletConnection(userPrivateKey, userStarkKey, ethNetwork, alchemyKey) {
    // connect provider
  const provider = new AlchemyProvider(ethNetwork, alchemyKey);

  // L1 credentials
  const ethSigner = new Wallet(userPrivateKey).connect(provider);

  // L2 credentials
  const starkSigner = createStarkSigner(userStarkKey);

  return {
    ethSigner,
    starkSigner,
  };
}

function getEnv(name, defaultValue = undefined) {
    const value = process.env[name];

    if (value !== undefined) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`Environment variable '${name}' not set`);
}