export function GroupSummary({group}:{group:Record<string,unknown>}){
 return <dl className="summary"><div><dt>Available balance</dt><dd>{String(group.balance??'Unknown')} atomic units</dd></div><div><dt>Dues received</dt><dd>{String(group.received??'Unknown')} atomic units</dd></div><div><dt>Executed spending</dt><dd>{String(group.spent??'Unknown')} atomic units</dd></div><div><dt>Required approvals</dt><dd>{String(group.threshold??'Unknown')}</dd></div></dl>;
}
