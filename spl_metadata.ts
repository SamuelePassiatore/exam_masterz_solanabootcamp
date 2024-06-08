// Creiamo metadata del fungible token

//copiamo tutto dal file uploadImage
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
//Usiamo createMetadataAccountV3 per creare metadata direttamente e prende come argomenti istruzioni, DataV2args ...
import { createMetadataAccountV3, CreateMetadataAccountV3InstructionArgs, CreateMetadataAccountV3InstructionAccounts, DataV2Args, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { publicKey as publicKeySerializer, string} from '@metaplex-foundation/umi/serializers';

import wallet from "./wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));

//Inizializziamo una publickey, lo riprendo dal file spl_transfer
// const mint = new PublicKey("BHtLyMrZDusDRbzCEsW62TzZYkR9D1L2zqR6mDdKPCNP");
const mint = publicKey("8MpA3gEvKjfHgWXyxoHdk37gNVEQX95PnTGQhHewyFbY");

//Metadata viene creato metaplex con PDA che ha come input deterministico stringa, 2 publickey(token metadata id e mint)
// inoltre bisogna anche serializzare la stringa e publickey usanti umi serialize
const seeds = [
    string({size: "variable"}).serialize("metadata"),
    publicKeySerializer().serialize(MPL_TOKEN_METADATA_PROGRAM_ID),
    publicKeySerializer().serialize(mint),
];

//Passo il token metadata (serializzo i seeds nel account), trova il pda basato sul mpl (program id) e seeds
const metadata = umi.eddsa.findPda(MPL_TOKEN_METADATA_PROGRAM_ID, seeds);

(async() => {

    //qui quando mandiamo dentro il mint, il token program sa come determinare pdl, per questo il metadata qui non è necessario
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
        metadata: metadata,
        mint: mint,
        mintAuthority: myKeypairSigner,
    }

    // il data è costituito dal nome, simbolo, uri (quello che ci ha generato il link su uploadImage)
    // sellerFeeBasisPoints, creators (nostro address e prendiamo 100% royalties anche se token non ne hanno)
    // collection = null --> non ha nessuna collezione
    let data: DataV2Args = {
        name: "Sam Token",
        symbol: "SMT",
        uri: "https://arweave.net/OCIGFXuHzYywO0CJvfx2pqFIplqeT6PMDOqWL0_VE-o",
        sellerFeeBasisPoints: 500,
        creators: [
            {
                address: keyair.publicKey,
                verified: true,
                share: 100,
            }
        ],
        collection: null,
        uses: null,
    }

    let args: CreateMetadataAccountV3InstructionArgs = {
        data: data, //nome, simbolo, uri, royalties (500 = 0.5), verificati devono firmare la transazione
        isMutable: true,
        collectionDetails: null,
    }

    //creo la funzione per create il metadata
    //primo parametro è il context (umi) e poi vuole input meta account e data args,
    let tx = createMetadataAccountV3(
        umi,
        {
            ...accounts,
            ...args,
        }
    )

    //inviamo la transazione creata, usiamo umi per inviare
    let result = await tx.sendAndConfirm(umi);
    //deserializzo la transazioni
    const signature = umi.transactions.deserialize(result.signature);
    console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    //BHtLyMrZDusDRbzCEsW62TzZYkR9D1L2zqR6mDdKPCNP
    //https://explorer.solana.com/tx/BHtLyMrZDusDRbzCEsW62TzZYkR9D1L2zqR6mDdKPCNP?cluster=devnet
})();