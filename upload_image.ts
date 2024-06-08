// Uni mi permette di interfacciarmi con metaplex (creando la prima istanza di umi)
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
//CreateSignerFromKeypair serve per inizializzare signer identity derivando una keypair da un file json
// signerIdentity usare su umi direttamente il nostro wallet come firmatario
import { createGenericFile, createSignerFromKeypair, signerIdentity, Context } from "@metaplex-foundation/umi"
//Metodo per leggere i file
import { readFile } from "fs/promises";
//Iris per caricare i nostri file
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

//Importo il nostro wallet
import wallet from "./wallet.json";

//Umi è la copia di come creare la connessione su Solana
// const connection = new Connection("https://api.devnet.solana.com", "finalized");
//inizializziamo istanza umi indicato socket e il tipo di connessione
const umi = createUmi("https://api.devnet.solana.com", "finalized")

//Una volta creato keypair signer diciamo umi di usare come signer predefinito
//diciamo irish uploader per caricare il file on chain
umi.use(irysUploader());

//Creo la nostra keypair, inzializzo la keypair usando umi
// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
//Creo signer interface per firmare le transazioni di umi, chiede due argomenti che sono il Context e la Keypair
//trasformo la keypair in un type signer per inziarlo per firmare le transazioni
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
//chi firma le transazioni è il signer identity è la keypair generata a partire dal wallet
umi.use(signerIdentity(myKeypairSigner));

//Creo la nostra funzione per caricare il file
// funzione asincrona perchè lo chiamo lo script sul terminal
(async () => {
    // Utilizzare la path assoluta
    const image = await readFile('./image.png');
    //Transformo in un file generico per caricarlo, chiede il file letto e il nome al file
    const nft_image = createGenericFile(image, "masterzLogo")
    //Usiamo umi uploader per caricarlo su istanza di metaplex
    // qui possiamo usare umi.uploader oppure irish, l'unica cosa che cambia che con umi è caricato temporanemente e iris per sempre
    const [myUri] = await umi.uploader.upload([nft_image]);
    
    console.log(myUri);
})();