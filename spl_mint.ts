//Qui vado a mintare token + funzione per creare token account

import { 
        Keypair, 
        Connection,
        PublicKey
    } from "@solana/web3.js";
    
    //creo token account nostro per mintare il token
    import {
        mintTo,
        getOrCreateAssociatedTokenAccount
    } from "@solana/spl-token";
    
    import wallet from "./wallet.json";
    
    // Creiamo una nuova istanza di Keypair passando la chiave privata del nostro wallet come argomento
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    
    // Creiamo una nuova connessione con il cluster di devnet di Solana
    const connection = new Connection("https://api.devnet.solana.com", "finalized");
    
    //Inserisco address del token che ho creato, ovvero la public key
    // 8MpA3gEvKjfHgWXyxoHdk37gNVEQX95PnTGQhHewyFbY
    const mint = new PublicKey("8MpA3gEvKjfHgWXyxoHdk37gNVEQX95PnTGQhHewyFbY");
    
    (async () => {
            //token acocunt ci da token (normale transazione), questo crea problema a volte quando cambio la disposizione del await, infatti non passa tempo tra due transazioni e token account non riconosciuto alla funzione mintTo
            const tokenAccount = await getOrCreateAssociatedTokenAccount (
                connection,
                keypair,
                mint,
                keypair.publicKey
            )
            // token account da un account con dati importanti come amount (token presenti account), quale è mint e token
            console.log("Mint Address:", mint.toBase58());            
            const ata = tokenAccount.address; //associated token account = ata | qui chiedo address
            console.log("Associated token account: ", ata.toBase58());
            const amount = 10e6; // voglio mintare 10 token, e6 sono i 6 dicimali
            await mintTo(
                connection,
                keypair, // chi paga
                mint,
                ata,
                keypair.publicKey, // autorità è il nostro wallet
                amount
            );
            console.log("Minted", amount, "to", ata.toBase58());
    })()