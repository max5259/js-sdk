import  {SignRawData, ListMpcRequests, ListAddresses,Status,CreateWallets,GenAddressByPath, GetSupportedChains, SignMessage,GetVaults,ListWallets } from '../index.js';

import {v4}  from  'uuid';
import {BigNumber, ethers} from "ethers";

async function main() {
    const url =
        'https://api.sinohope.com';
    const privKey =
        '308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104203f840def58e6e171ef3e3c101740ea865a1b26cf289e947a6008e879fe56d1fea14403420004ce6acfab87282bfae019d03e5a81a3107a94f73096b3808c6b23c662d683f6d64495a3b85f34c501d3dbc6c3a20cb391ca4b66140ae2fccb3d4a551500c308db';
    const pubKey =
        '3059301306072a8648ce3d020106082a8648ce3d03010703420004ce6acfab87282bfae019d03e5a81a3107a94f73096b3808c6b23c662d683f6d64495a3b85f34c501d3dbc6c3a20cb391ca4b66140ae2fccb3d4a551500c308db';
    
    const vaultId = "460960045737541";
    const walletId = "490692555706117";
    // 生成一个新的GUID
    const requestId = v4();

    console.log("requestId:",requestId);
    
    let api  = new GetVaults(url,privKey,pubKey);

    let data = await api.request();
    console.log("vault:",JSON.stringify(data));

    //create address 
    // api = new GenAddressByPath(url,privKey,pubKey);
    // data = await api.request({
    //     vaultId:vaultId,
    //     index:2,
    //     algorithmType:0,
    //     coinType:60,
    //     walletId: walletId
    // })
    // :{"id":"7",
    // "address":"0x5150a54e26ecc8d338e64e1e7cdd8c1f313a6313",
    // "hdPath":"m/1/1/60/2","encoding":0,
    // "pubkey":"03c815b137c7ef4057c5eca5b9de9ad2517669b95bc95028bcdff508701a8aa455"
    // }
    console.log("GenAddressByPath:",JSON.stringify(data));

    const transaction = {
        'nonce': 9422, 
        'gasPrice': 60000000,
         'gasLimit': 23100, 
         'to': '0xf1181bd15E8780B69a121A8D8946cC1C23972Bd4', 
         'value': ethers.utils.parseEther('0.01'), 
         'chainId': 599, 
         'data': '0x'
        }
    let serializedTransaction = await ethers.utils.serializeTransaction(transaction)
    console.log("serializedTransaction",serializedTransaction);
    let msg_hash = ethers.utils.keccak256(serializedTransaction)
    console.log("msg_hash",msg_hash);
    api = new SignMessage(url, privKey, pubKey);
    data = await api.request({
        requestId: requestId,
        chainSymbol: "ETH",
        hdPath: "m/1/1/60/2",
        signAlgorithm: "personal_sign",
        message: msg_hash,
    });
    console.log("SignMessage:",data);


    // api = new SignRawData(url,privKey,pubKey)
    // data = await api.request({
    //     vaultId: vaultId,
    //     requestId: requestId,
    //     walletId: walletId,
    //     hdPath: "m/1/1/60/2",
    //     rawData: msg_hash,
    // });
    // console.log("SignRawData:",data);

    var result = false;
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

main();
