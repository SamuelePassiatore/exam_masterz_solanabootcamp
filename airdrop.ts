import { 
    Keypair, 
    Connection, 
    LAMPORTS_PER_SOL 
} from "@solana/web3.js";

// Importiamo la chiave privata del nostro wallet che abbiamo salvato dopo aver eseguito il comando "yarn keygen"
import wallet from "./wallet.json";

// Creiamo una nuova istanza di Keypair passando la chiave privata del nostro wallet come argomento
// - process = confermato da un nodo
// - confirmed = raggiunto lead validator (siamo sicuri che arrivato ma non ci vuole troppo tempo)
// - finalized = è sicuro che è arrivato
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Creiamo una nuova connessione con il cluster di devnet di Solana
const connection = new Connection("https://api.devnet.solana.com", "finalized");

/*
    requestAirdrop:

    requestAirdrop(
        to: PublicKey, 
        lamports: number
    ): Promise<TransactionSignature>;

    - to: Indirizzo del wallet a cui inviare i fondi
    - lamports: Quantità di SOL richiesta (1 SOL = 1_000_000_000 LAMPORTS)

*/

//Ora ci inviamo 1 solana
//try catch per catturare possibili errori
(async () => {
    try {
        
        // Richiediamo un airdrop di 1 SOL al nostro wallet utilizzando il metodo requestAirdrop
        const airdropSignature = await connection.requestAirdrop(
            keypair.publicKey,      // Indirizzo del wallet a cui inviare i fondi
            1 * LAMPORTS_PER_SOL    // Quantità di SOL richiesta (1 SOL = 1_000_000_000 LAMPORTS)
        );

        // Attendiamo la conferma della transazione e poi logghiamo il link alla transazione sull'explorer di Solana
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);
    } catch (error) {
        console.error(error);
    }
})();


