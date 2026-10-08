import {BASE_FEE,Contract,TransactionBuilder,rpc,type xdr} from '@stellar/stellar-sdk';
import type {AppConfig} from './network';
const timeout=15_000;
export class TransactionOutcomeError extends Error {
 readonly hash:string;
 constructor(message:string,hash:string){super(message);this.name='TransactionOutcomeError';this.hash=hash;}
}
async function bounded<T>(promise:Promise<T>):Promise<T>{let timer:ReturnType<typeof setTimeout>;try{return await Promise.race([promise,new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>reject(new Error('The network request timed out. Check transaction history before retrying a write.')),timeout);})]);}finally{clearTimeout(timer!);}}
export function makeClient(config:AppConfig){
 const server=new rpc.Server(config.rpcUrl,{allowHttp:config.rpcUrl.startsWith('http:')});
 async function simulate(source:string,method:string,args:xdr.ScVal[]){
  const net=await bounded(server.getNetwork());if(net.passphrase!==config.passphrase)throw new Error('The RPC endpoint is not Stellar testnet.');
  const wallet=await bounded(server.getAccount(source));
  const tx=new TransactionBuilder(wallet,{fee:BASE_FEE,networkPassphrase:config.passphrase}).addOperation(new Contract(config.contractId).call(method,...args)).setTimeout(60).build();
  const result=await bounded(server.simulateTransaction(tx));
  if(rpc.Api.isSimulationRestore(result))throw new Error('A contract record is archived. Ask the maintainer to restore it; do not recreate the group.');
  if(rpc.Api.isSimulationError(result))throw new Error(result.error);
  if(!rpc.Api.isSimulationSuccess(result)||!result.result)throw new Error('The contract did not return a simulation result.');
  return {tx,result};
 }
 return {
  async read(source:string,method:string,args:xdr.ScVal[]){return (await simulate(source,method,args)).result.result!.retval;},
  async prepare(source:string,method:string,args:xdr.ScVal[]){const {tx,result}=await simulate(source,method,args);return rpc.assembleTransaction(tx,result).build().toXDR();},
  async submit(signed:string,canSend:()=>boolean=()=>true){
   const tx=TransactionBuilder.fromXDR(signed,config.passphrase);
   const expectedHash=Array.from(tx.hash(),byte=>byte.toString(16).padStart(2,'0')).join('');
   const network=await bounded(server.getNetwork());
   if(network.passphrase!==config.passphrase)throw new Error('The RPC endpoint changed away from Stellar testnet. No transaction was submitted.');
   if(!canSend())throw new Error('This action was cancelled before submission.');
   let sent:Awaited<ReturnType<typeof server.sendTransaction>>;
   try{sent=await bounded(server.sendTransaction(tx));}catch{throw new TransactionOutcomeError(`Submission outcome is unknown. Check transaction ${expectedHash} on the explorer before retrying; do not submit another payment blindly.`,expectedHash);}
   if(sent.status==='ERROR'||sent.status==='TRY_AGAIN_LATER')throw new TransactionOutcomeError(`The network did not accept this transaction. Check ${expectedHash} before retrying.`,expectedHash);
   let result:Awaited<ReturnType<typeof server.pollTransaction>>;
   try{result=await bounded(server.pollTransaction(expectedHash));}catch{throw new TransactionOutcomeError(`Confirmation outcome is unknown. Check transaction ${expectedHash} on the explorer before retrying.`,expectedHash);}
   if(result.status!==rpc.Api.GetTransactionStatus.SUCCESS)throw new TransactionOutcomeError(`Transaction ${expectedHash} is ${result.status}. Check it on the explorer before retrying.`,expectedHash);
   return {hash:expectedHash,value:result.returnValue};
  }
 };
}
