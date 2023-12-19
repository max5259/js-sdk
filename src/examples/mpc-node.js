import  {SignRawData, ListMpcRequests, ListAddresses,Status,CreateWallets,GenAddressByPath, GetSupportedChains, SignMessage,GetVaults,ListWallets } from '../index.js';

import {v4}  from  'uuid';
import {BigNumber, ethers} from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://goerli.gateway.metisdevops.link");

const from_address = "0x684af4a5739254f1e0ad1318d50144706b918abb";

const hdPath = "m/1/1/60/3"

let  nonce = 1;

nonce = await provider.getTransactionCount(from_address);

console.log("nonce",nonce);
console.log(ethers.utils.parseEther('0.01').toHexString());

const unsignedTx = {
    'nonce': nonce, 
    'gasPrice': BigNumber.from("60000000").toHexString() ,
     'gasLimit': 23100, 
     'to': '0xf1181bd15E8780B69a121A8D8946cC1C23972Bd4', 
     'value': ethers.utils.parseEther('0.01').toHexString(), 
     'chainId': 599, 
     'data': '0x'
    }
const url =
'https://api.sinohope.com';
const privKey =
'308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104203f840def58e6e171ef3e3c101740ea865a1b26cf289e947a6008e879fe56d1fea14403420004ce6acfab87282bfae019d03e5a81a3107a94f73096b3808c6b23c662d683f6d64495a3b85f34c501d3dbc6c3a20cb391ca4b66140ae2fccb3d4a551500c308db';
const pubKey =
'3059301306072a8648ce3d020106082a8648ce3d03010703420004ce6acfab87282bfae019d03e5a81a3107a94f73096b3808c6b23c662d683f6d64495a3b85f34c501d3dbc6c3a20cb391ca4b66140ae2fccb3d4a551500c308db';

const vaultId = "460960045737541";
const walletId = "490692555706117";

async function main() {

   
    // 生成一个新的GUID
    const requestId = v4();

    console.log("requestId:",requestId);
    
    let api  = new GetVaults(url,privKey,pubKey);

    let data = await api.request();
    console.log("vault:",JSON.stringify(data));



    // const transaction = {
    //     'nonce': 9422, 
    //     'maxFeePerGas': 60000000,
    //      'gasLimit': 23100, 
    //      'to': '0xf1181bd15E8780B69a121A8D8946cC1C23972Bd4', 
    //      'value': ethers.utils.parseEther('0.01'), 
    //      'chainId': 599, 
    //      'data': '0x',
    //      'type': 2
    // }
    let serializedTransaction = await ethers.utils.serializeTransaction(unsignedTx)
    console.log("serializedTransaction",serializedTransaction);
    let msg_hash = ethers.utils.keccak256(serializedTransaction)
    
    console.log("msg_hash",msg_hash);

    api = new SignRawData(url,privKey,pubKey)
    data = await api.request({
        vaultId: vaultId,
        requestId: requestId,
        walletId: walletId,
        hdPath: hdPath,
        rawData: msg_hash,
    });
    console.log("SignRawData:",data);

    // api = new SignMessage(url, privKey, pubKey);
    // data = await api.request({
    //     requestId: requestId,
    //     chainSymbol: "ETH",
    //     hdPath: "m/1/1/60/2",
    //     signAlgorithm: "personal_sign",
    //     message: msg_hash,
    // });
    // console.log("SignMessage:",data);


  

    var result = true;
    const sinoId = data.data.sinoId;
    console.log("sinoId",sinoId);
    while(!result){
        api = new ListMpcRequests(url,privKey,pubKey);
        data = await api.request({
            "businessExecType": 3,
            // "businessExecStatus": 1,
            "sinoId": sinoId,
            "pageIndex": 1,
            "pageSize": 10
          });
        console.log("data.data.list;",JSON.stringify(data));
        if(data.data.list && data.data.list.length>0){
           const req =  data.data.list[0];
           result = req.businessExecStatus == 1;
        }
    }


    //CreateWallets {"code":200,"msg":"ok","data":[{"walletId":"490692555706117","walletName":"wallet-1","advancedEnabled":1}],"success":true}
    // api = new CreateWallets(url,privKey,pubKey);
    // data = await api.request({
    //     requestId:"111",
    //     vaultId:vaultId,
    //     count:1,
    //     walletInfos:[{
    //         walletName:"wallet-1",
    //         advancedEnabled:1
    //     }]
    // });
    // console.log("CreateWallets",JSON.stringify(data));

    
    //create address 
    // api = new GenAddressByPath(url,privKey,pubKey);
    // data = await api.request({
    //     vaultId:vaultId,
    //     index:1,
    //     algorithmType:0,
    //     coinType:60,
    //     walletId: walletId
    // })
    // console.log("GenAddressByPath:",JSON.stringify(data));

    // api = new ListAddresses(url,privKey,pubKey);
    // data = await api.request({
    //     vaultId: vaultId,
    //     walletId:walletId,
    //     chainSymbol:"ETH"
    // })
    // console.log("ListAddresses:",JSON.stringify(data))

    // api = new ListWallets(url,privKey,pubKey);

    // data = await api.request({vaultId:"460960045737541"});
    
    // console.log("ListWallets:",data);


    //  api = new ListMpcRequests(url, privKey, pubKey);
    //  data = await api.request({
    //     businessExecType: 1,
    //     businessExecStatus: 1,
    //     sinoId: null,
    //     pageIndex: 1,
    //     pageSize: 50,
    // });
    // console.log(":ListMpcRequests",data );

    // api = new Status(url, privKey, pubKey);
    // data = await api.request();
    // console.log("Status:",data);

    // api = new GetSupportedChains(url, privKey, pubKey);
    // data = await api.request();
    // console.log("GetSupportedChains:",data);

   
    
}

async function genAddress(){
    //create address 
    let api = new GenAddressByPath(url,privKey,pubKey);
    let data = await api.request({
        vaultId:vaultId,
        index:3,
        algorithmType:0,
        coinType:60,
        walletId: walletId
    })
    // {"id":"7",
    // "address":"0x5150a54e26ecc8d338e64e1e7cdd8c1f313a6313",
    // "hdPath":"m/1/1/60/2","encoding":0,
    // "pubkey":"03c815b137c7ef4057c5eca5b9de9ad2517669b95bc95028bcdff508701a8aa455"
    // }

    // {
    //     "id": "8",
    //     "address": "0x684af4a5739254f1e0ad1318d50144706b918abb",
    //     "hdPath": "m/1/1/60/3",
    //     "encoding": 0,
    //     "pubkey": "0310af8b6c10e09631eb28c42905f2042b15fce6c3f399a42ef5e97fb505469a5f"
    // }
    console.log("GenAddressByPath:",JSON.stringify(data));

}

async function test_mpc_tx(){

    const provider = new ethers.providers.JsonRpcProvider("https://goerli.gateway.metisdevops.link");

    // const signer = provider.getSigner();

    // signer.signTransaction({
    //     'nonce': 9422, 
    //     'gasPrice': 60000000,
    //      'gasLimit': 23100, 
    //      'to': '0xf1181bd15E8780B69a121A8D8946cC1C23972Bd4', 
    //      'value': ethers.utils.parseEther('0.01'), 
    //      'chainId': 599, 
    //      'data': '0x'
    // });
    // const privateKey = "0x46db1fbb6f87a490923b5782f609634c5ff5420abda4838858eaf1edcc82ff01";
    // let ethersWallet = new ethers.Wallet(privateKey);
    // ethersWallet = ethersWallet.connect(provider)
    // const signTx = await ethersWallet.signTransaction(unsignedTx);
    // console.log("signTx",signTx)
    // ethersWallet.sendTransaction(unsignedTx);
    const signature = "2b8c7add548871271bcefbe9b8524d6ee150490f1d8ad29014b7fc06660443021ce8061d95f1a0d12c218b9cd2d911c915e6d800698b972ab4528840b93a74d401";
   
    let signedTx = await ethers.utils.serializeTransaction(unsignedTx, "0x" + signature);
    let tx = await provider.sendTransaction(signedTx);

    console.log("tx",tx)


}

const args = process.argv.slice(2);
let op = ''
if(args.length>0 ){
    op = args[0]
}

if( op == 'tx'){
    test_mpc_tx();
    
}else if(op == "genaddr"){
   genAddress();
}else{
    main();
}
