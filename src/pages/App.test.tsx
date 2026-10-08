// @vitest-environment happy-dom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import axe from 'axe-core';
import {App} from './App';
vi.mock('../lib/wallet',()=>({connectWallet:vi.fn(),disconnectWallet:vi.fn(),checkWalletNetwork:vi.fn(),signWithWallet:vi.fn(),rememberedAddress:vi.fn()}));
afterEach(cleanup);
it('shows the custody gate and configuration failures without wallet prompts',()=>{render(<App/>);expect(screen.getByText('TESTNET — no real money')).toBeTruthy();expect(screen.getByRole('heading',{name:'Configuration required'})).toBeTruthy();expect(screen.getByRole('button',{name:'Connect testnet wallet'}).hasAttribute('disabled')).toBe(true);expect(screen.getByText(/Deployment and funded testing remain blocked/)).toBeTruthy();});
it('has no automated axe violations in the unconfigured view',async()=>{const {container}=render(<App/>);const result=await axe.run(container,{rules:{'color-contrast':{enabled:false}}});expect(result.violations).toEqual([]);});
