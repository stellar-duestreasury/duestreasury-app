// @vitest-environment happy-dom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {Keypair,StrKey,nativeToScVal} from '@stellar/stellar-sdk';
const mocks=vi.hoisted(()=>{
 class OutcomeError extends Error {hash:string;constructor(message:string,hash:string){super(message);this.hash=hash;}}
 return {OutcomeError,read:vi.fn(),prepare:vi.fn(),submit:vi.fn(),connect:vi.fn(),check:vi.fn(),sign:vi.fn(),disconnect:vi.fn(),remembered:vi.fn()};
});
vi.mock('../lib/contract',()=>({makeClient:()=>({read:mocks.read,prepare:mocks.prepare,submit:mocks.submit}),TransactionOutcomeError:mocks.OutcomeError}));
vi.mock('../lib/wallet',()=>({connectWallet:mocks.connect,checkWalletNetwork:mocks.check,signWithWallet:mocks.sign,disconnectWallet:mocks.disconnect,rememberedAddress:mocks.remembered}));
const user=Keypair.random().publicKey();
beforeEach(()=>{vi.resetModules();vi.clearAllMocks();vi.stubEnv('VITE_STELLAR_NETWORK','testnet');vi.stubEnv('VITE_SOROBAN_RPC_URL','https://soroban-testnet.stellar.org');vi.stubEnv('VITE_CONTRACT_ID',StrKey.encodeContract(Buffer.alloc(32,3)));vi.stubEnv('VITE_EXPLORER_BASE_URL','https://stellar.expert/explorer/testnet');mocks.connect.mockResolvedValue(user);mocks.check.mockResolvedValue({onTestnet:true});mocks.prepare.mockResolvedValue('prepared');mocks.sign.mockResolvedValue('signed');mocks.remembered.mockResolvedValue(user);});
afterEach(()=>{cleanup();vi.unstubAllEnvs();});
async function mount(){const {App}=await import('./App');render(<App/>);}
it('disables member inputs during a delayed read and clears the result when the address changes',async()=>{
 let resolveRead!:(value:ReturnType<typeof nativeToScVal>)=>void;
 mocks.read.mockImplementation(()=>new Promise(resolve=>{resolveRead=resolve;}));
 await mount();
 fireEvent.change(screen.getByLabelText(/Public read source/),{target:{value:user}});
 fireEvent.change(screen.getByLabelText('Group ID'),{target:{value:'1'}});
 const member=screen.getByLabelText('Member public address') as HTMLInputElement;
 fireEvent.change(member,{target:{value:user}});
 fireEvent.click(screen.getByRole('button',{name:'Check current period dues'}));
 await waitFor(()=>expect(member.disabled).toBe(true));
 resolveRead(nativeToScVal({period:0n,paid:true}));
 await waitFor(()=>expect(member.disabled).toBe(false));
 expect(screen.getByText(/"paid": true/)).toBeTruthy();
 fireEvent.change(member,{target:{value:Keypair.random().publicKey()}});
 expect(screen.queryByText(/"paid": true/)).toBeNull();
});
it('shows an explorer link for an unknown submission without calling it confirmed',async()=>{
 const hash='a'.repeat(64);mocks.submit.mockRejectedValue(new mocks.OutcomeError('Submission outcome is unknown.',hash));
 await mount();fireEvent.click(screen.getByRole('button',{name:'Connect testnet wallet'}));
 await waitFor(()=>expect(screen.getByRole('button',{name:'Disconnect wallet'})).toBeTruthy());
 fireEvent.change(screen.getByLabelText('Group ID'),{target:{value:'1'}});
 fireEvent.click(screen.getByRole('button',{name:'Pay current period dues'}));
 const link=await screen.findByRole('link',{name:'Check transaction on Stellar Explorer'});
 expect(link.getAttribute('href')).toBe(`https://stellar.expert/explorer/testnet/tx/${hash}`);
 expect(screen.queryByRole('heading',{name:'Transaction confirmed'})).toBeNull();
 expect(mocks.submit).toHaveBeenCalledTimes(1);
});
it('refuses submission when the provider account changes while signing',async()=>{
 mocks.remembered.mockResolvedValueOnce(user).mockResolvedValueOnce(Keypair.random().publicKey());
 await mount();fireEvent.click(screen.getByRole('button',{name:'Connect testnet wallet'}));
 await waitFor(()=>expect(screen.getByRole('button',{name:'Disconnect wallet'})).toBeTruthy());
 fireEvent.change(screen.getByLabelText('Group ID'),{target:{value:'1'}});
 fireEvent.click(screen.getByRole('button',{name:'Pay current period dues'}));
 expect(await screen.findByRole('alert')).toHaveProperty('textContent','The wallet account changed while signing. No transaction was submitted.');
 expect(mocks.submit).not.toHaveBeenCalled();
});
