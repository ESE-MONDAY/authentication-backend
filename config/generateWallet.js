require("dotenv").config(); 
const {Web3} = require('web3');



const generateWallet = async () => {
    try {
        const providerUrl = process.env.INFURA_API_KEY;
        const web3 = new Web3(providerUrl);
        const wallet = web3.eth.accounts.create();
        
        return {
            address: wallet.  publicKey,
            privateKey: wallet.privateKey
        };
    } catch (error) {
        console.error('Error generating wallet:', error.message);
        throw error;
    }
};

module.exports = generateWallet;
