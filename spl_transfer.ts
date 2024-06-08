// Trasferisco il token
import { 
        Keypair, 
        Connection,
        PublicKey
    } from "@solana/web3.js";
    
    //creo token account nostro per mintare il token
    import {
        getOrCreateAssociatedTokenAccount,
        transfer,
    } from "@solana/spl-token";
    
    import wallet from "./wallet.json";
    
    // Creiamo una nuova istanza di Keypair passando la chiave privata del nostro wallet come argomento
    const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    
    // Creiamo una nuova connessione con il cluster di devnet di Solana
    const connection = new Connection("https://api.devnet.solana.com", "finalized");
    
    //Inserisco address del token che ho creato, ovvero la public key
    // 8WQB3nvpWcWgjM7kzPWJYTecb57gJq8G6FyWPvu5SZj7
    const mint = new PublicKey("8MpA3gEvKjfHgWXyxoHdk37gNVEQX95PnTGQhHewyFbY");
    
    //Mi porto dietro anche il token account che avevo trovato nel file"spl_mint.ts"
    //cosi evito di derivarlo
    const fromAta = new PublicKey("3xJWLmN8kKZxnvmES5XkBkRKXKtn52EUZ6JogTXEX7jY");
    
    //genero una keypair per verificare il trasferimento
    const to = Keypair.generate();
    console.log("To: ", to.publicKey.toBase58());
    
    (async () => {
            //token acocunt ci da token (normale transazione), questo crea problema a volte quando cambio la disposizione del await, infatti non passa tempo tra due transazioni e token account non riconosciuto alla funzione mintTo
            const tokenAccount = await getOrCreateAssociatedTokenAccount (
                connection,
                keypair, // chi paga, posso delgare un altra persona per creare token account
                mint,
                to.publicKey //creare token account
            );
                      
            const toAta = tokenAccount.address; //associated token account = ata | qui chiedo address
            console.log("Associated token account: ", toAta.toBase58());
            const amount = 10e5; // voglio mintare 10 token, e6 sono i 6 dicimali --> trasferisco 1 token e non 10
            await transfer(
                connection,
                keypair, // chi paga
                fromAta,
                toAta,
                keypair, // signer
                amount
            );
            console.log("Transfer", amount, "from", fromAta.toBase58(), "to ", toAta.toBase58());
    })()