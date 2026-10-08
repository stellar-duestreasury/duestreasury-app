import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {describeError,errorMessages} from './errors';
it('preserves all canonical error messages',()=>{const markdown=readFileSync(new URL('../../vendor/duestreasury-contracts/ERRORS.md',import.meta.url),'utf8');const rows=[...markdown.matchAll(/^\| (\d+) \|.*?\| "([^"]+)" \|/gm)];expect(rows).toHaveLength(17);for(const row of rows){expect(errorMessages[Number(row[1])]).toBe(row[2]);expect(describeError(new Error(`Error(Contract, #${row[1]})`))).toBe(row[2]);}});
it('does not invent unknown contract wording',()=>expect(describeError(new Error('Error(Contract, #99)'))).toContain('TODO(verify)'));
it('preserves host and wallet messages',()=>expect(describeError(new Error('Wallet rejected signing.'))).toBe('Wallet rejected signing.'));
