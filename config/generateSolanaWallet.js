require("dotenv").config(); 
const {Keypair} = require('@solana/web3.js');


const generateWallet = async () => {
    try {
        const wallet = Keypair.generate();
        
        return {
            publicKey: wallet.publicKey.toString(),
            privateKey: wallet.secretKey.toString(),
        };
    } catch (error) {
        console.error('Error generating wallet:', error.message);
        throw error;
    }
};

module.exports = generateWallet;
