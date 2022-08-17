// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();
const secondPair = new Keypair()
// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const publicKey2 = new PublicKey(secondPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);
console.log("Public Key2 of the generated keypair", publicKey2);

// Get the wallet balance from a given private key
const getWalletBalance = async (walletAddress) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        //const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(walletAddress)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (walletAddress) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletAddress),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


//was hoping to get this to stop the execution after no input provided... but it still runs after no input.
function getDestWallet()
{
    try {
        const dest = process.argv[2];
        if(!dest || process.argv.length < 3) {
            throw new Error('Required');
            
        }
        return dest
    } catch (Error) {
        console.log(Error)
    }

}

function validateWallet(publicKey) {
    let walletAddress;

    try {
        walletAddress = new PublicKey(publicKey);

        if (!PublicKey.isOnCurve(publicKey)) {
            throw new Error('Public Key is not valid!');
        }
        return true
    } catch (err)
    {
        console.log(err);
    }
    return false
}
// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {

    
    const userWallet = getDestWallet();
        //console.log(userWallet)
    if(!userWallet)return; 
    console.log(validateWallet(userWallet));
    await getWalletBalance(userWallet);
    await airDropSol(userWallet);
    await getWalletBalance(userWallet);
}

mainFunction();
