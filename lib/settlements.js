export function calculateSettlements(expenses = [], members = []) {
  const balances = Object.fromEntries(members.map((m) => [m, 0]));
  for (const expense of expenses) {
    const payer = expense.paidBy;
    if (!(payer in balances)) balances[payer] = 0;
    balances[payer] += Number(expense.totalAmount || 0);
    for (const split of expense.splits || []) {
      if (!(split.member in balances)) balances[split.member] = 0;
      balances[split.member] -= Number(split.amountOwed || 0);
    }
  }
  const debtors = [], creditors = [];
  for (const [member, balance] of Object.entries(balances)) {
    const rounded = round2(balance);
    if (rounded < -0.009) debtors.push({ member, balance: Math.abs(rounded) });
    else if (rounded > 0.009) creditors.push({ member, balance: rounded });
  }
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);
  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i], creditor = creditors[j];
    const amount = round2(Math.min(debtor.balance, creditor.balance));
    if (amount > 0.009) settlements.push({ from: debtor.member, to: creditor.member, amount });
    debtor.balance = round2(debtor.balance - amount);
    creditor.balance = round2(creditor.balance - amount);
    if (debtor.balance <= 0.009) i++;
    if (creditor.balance <= 0.009) j++;
  }
  return { balances: Object.fromEntries(Object.entries(balances).map(([m,b])=>[m,round2(b)])), settlements };
}
function round2(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }