import {Address, nativeToScVal, scValToNative, StrKey, xdr} from '@stellar/stellar-sdk';
export const MAX_U64=(1n<<64n)-1n;
export const MAX_I128=(1n<<127n)-1n;
export function positive(text:string,max=MAX_I128):bigint {
  if(!/^\d+$/.test(text.trim())) throw new Error('Enter a whole positive number in atomic units.');
  const value=BigInt(text.trim());if(value<1n||value>max)throw new Error('The value is outside the contract range.');return value;
}
export function account(text:string):string {const value=text.trim();if(!StrKey.isValidEd25519PublicKey(value))throw new Error('Enter a valid Stellar public account address (G…).');return value;}
export function tokenAddress(text:string):string {const value=text.trim();if(!StrKey.isValidContract(value))throw new Error('Enter a valid token contract address (C…).');return value;}
export function addresses(text:string,cap:number):string[] {const values=text.split(/[\s,]+/).filter(Boolean).map(account);if(!values.length||values.length>cap||new Set(values).size!==values.length)throw new Error(`Enter 1–${cap} unique public addresses.`);return values;}
export const address=(value:string):xdr.ScVal=>Address.fromString(value).toScVal();
export const u64=(value:bigint):xdr.ScVal=>nativeToScVal(value,{type:'u64'});
export const i128=(value:bigint):xdr.ScVal=>nativeToScVal(value,{type:'i128'});
export const list=(values:string[]):xdr.ScVal=>xdr.ScVal.scvVec(values.map(address));
export function hash(value:string):xdr.ScVal {if(!/^[a-fA-F0-9]{64}$/.test(value.trim()))throw new Error('Enter a 64-character SHA-256 hash; keep the description off-chain.');return nativeToScVal(Uint8Array.from(value.trim().match(/../g)!,part=>parseInt(part,16)),{type:'bytes'});}
export function decode(value:xdr.ScVal):Record<string,unknown>{const native:unknown=scValToNative(value);if(!native||typeof native!=='object'||Array.isArray(native))throw new Error('The contract returned an unexpected record.');return native as Record<string,unknown>;}
export function printable(value:unknown):string {return JSON.stringify(value,(_key,item:unknown)=>typeof item==='bigint'?item.toString():item,2);}
export function createGroupArgs(source:string,input:{token:string;members:string;signers:string;threshold:string;dues:string;period:string}):xdr.ScVal[]{const members=addresses(input.members,100),signers=addresses(input.signers,20),threshold=positive(input.threshold,BigInt(signers.length));return [address(account(source)),address(tokenAddress(input.token)),list(members),list(signers),nativeToScVal(Number(threshold),{type:'u32'}),i128(positive(input.dues)),u64(positive(input.period,366n*86400n))];}
