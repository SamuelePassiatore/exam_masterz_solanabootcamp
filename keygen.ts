import { Keypair } from "@solana/web3.js";

// Andiamo a generare una nuova Keypair
const keypair = Keypair.generate();

console.log("Public key:", keypair.publicKey.toBase58());
console.log("Private key:", keypair.secretKey.toString());

// Ora Console.logghiamo l'indirizzo del wallet e la chiave privata in modo da poterli salvare in un file
console.log(`Hai generato il tuo nuovo wallet: ${keypair.publicKey.toBase58()} \n\n Per salvare il tuo wallet, copia e incolla il seguente JSON in un file: [${keypair.secretKey}]`)