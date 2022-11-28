'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { Table, Entity } = require('dynamodb-toolbox');
const config = require('./config');

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const DocumentClient = new AWS.DynamoDB.DocumentClient(options);

const MoonforgeTable = new Table({
  name: config.dynamoDBTable,

  partitionKey: 'pk',
  // sortKey: 'sk',

  DocumentClient
});

const Account = new Entity({
  name: 'Account',

  attributes: {
    pk: { partitionKey: true, prefix: 'account#', hidden: true },
    // sk: { sortKey: true, prefix: 'address#', hidden: true },
    login: ['pk', 0, { save: true, default: '' }],
    // publicAddress: ['sk', 0, { save: true }],
    publicAddress: { type: 'string' },
    privateKey: { type: 'string' },
    mnemonic: { type: 'string' },
    // starkPublicAddress: { type: 'string' },
    starkPrivateKey: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'list' },
  },
  table: MoonforgeTable
});

module.exports = { Account: Account };
