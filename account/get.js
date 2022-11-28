'use strict';

const { Account } = require('../utils/dynamodb');
const Responses = require('../utils/api-responses');

module.exports.get = async (event, context, callback) => {
  try {
    const { Item: account } = await Account.get({ login: event.pathParameters.id });
    if (!account) {
      return Responses._404({ message: `Account ${event.pathParameters.id} not found` });
    }
    return Responses._200(account);
  } catch (error) {
    console.log('error', error);
    return Responses._400({ message: error.message || `Couldn\'t get the account ${event.pathParameters.id}` });
  }
};
