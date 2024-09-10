const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_URL));
const { Client } = require("pg");
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
client.connect();

// const depositContractABI = [...];  // Add the ABI from Etherscan
const depositContractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
const depositContract = new web3.eth.Contract(depositContractABI, depositContractAddress);


async function getBlockData(blockNumber) {
  try {
    const block = await web3.eth.getBlock(blockNumber);
    return block;
  } catch (error) {
    console.error("Error fetching block:", error);
  }
}


async function saveDeposit(deposit) {
  const query = `
    INSERT INTO eth_deposits (blockNumber, blockTimestamp, fee, hash, pubkey)
    VALUES ($1, to_timestamp($2), $3, $4, $5)
  `;
  const values = [
    deposit.blockNumber,
    deposit.blockTimestamp,
    deposit.fee,
    deposit.hash,
    deposit.pubkey,
  ];

  try {
    await client.query(query, values);
    console.log("Deposit saved successfully.");
  } catch (err) {
    console.error("Error saving deposit:", err);
  }
}
