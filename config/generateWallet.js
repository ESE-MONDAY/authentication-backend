const { Web3 } = require('web3');

const generateWallet = async (userId) => {
    try {
        const providerUrl = 'https://sepolia.infura.io/v3/dbd371c68313481b91683426c2335b0f';
        const web3 = new Web3(providerUrl);
        const wallet = web3.eth.accounts.create();
        
        return {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
    } catch (error) {
        console.error('Error generating wallet:', error.message);
        throw error;
    }
};

module.exports = generateWallet;

  
