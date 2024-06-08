// Creo il mit

import { 
        Keypair, 
        Connection
    } from "@solana/web3.js";
    
    import {createMint} from "@solana/spl-token";
    
    import wallet from "./wallet.json";
    
    // Creiamo una nuova istanza di Keypair passando la chiave privata del nostro wallet come argomento
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    
    // Creiamo una nuova connessione con il cluster di devnet di Solana
    const connection = new Connection("https://api.devnet.solana.com", "finalized");
    
    (async () => {
    
            const mint = await createMint(
                connection,
                keypair, // nostro wallet
                keypair.publicKey, //mint authoirty usiamo il nostro wallet
                null, // nessun freeze authority
                6, // decimali sono messi questi, possiamo scegliere noi, però ricorda quando minti cerca di farlo secondo i decimali inseriti qui
            );
            console.log("Mint Address:", mint.toBase58());            
    
    })()
    