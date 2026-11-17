import { useMemo, useState } from 'react';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

const normalizeMonthly = (amount, cycle) => {
  if (cycle === 'Yearly') return amount / 12;
  if (cycle === 'Quarterly') return amount / 3;
  return amount;
};

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Netflix', category: 'OTT', amount: 649, cycle: 'Monthly', renewal: '2026-11-24' },
    { id: 2, name: 'Notion', category: 'SaaS', amount: 799, cycle: 'Monthly', renewal: '2026-11-18' },
    { id: 3, name: 'Gym Plus', category: 'Fitness', amount: 1899, cycle: 'Monthly', renewal: '2026-11-22' },
  ]);
  const [form, setForm] = useState({ name: '', category: 'SaaS', amount: '', cycle: 'Monthly', renewal: '' });

  const summary = useMemo(() => {
    const totalMonthly = subscriptions.reduce((sum, item) => sum + normalizeMonthly(Number(item.amount), item.cycle), 0);
    return {
      monthly: totalMonthly,
      annual: totalMonthly * 12,
      dueSoon: subscriptions.filter((item) => {
        const diff = Math.ceil((new Date(item.renewal).getTime() - Date.now()) / 86400000);
        return diff >= 0 && diff <= 7;
      }).length,
    };
  }, [subscriptions]);

  const addSubscription = () => {
    if (!form.name || !form.amount) return;
    setSubscriptions((current) => [...current, { id: Date.now(), ...form, amount: Number(form.amount) }]);
    setForm({ name: '', category: 'SaaS', amount: '', cycle: 'Monthly', renewal: '' });
  };

  return (
    <div className="app-shell">
      <div className="panel hero-panel">
        <div>
          <p className="eyebrow">Recurring spend radar</p>
          <h1>Subscription Watch</h1>
        </div>
      </div>

      <div className="panel">
        <h2>Add subscription</h2>
        <div className="form-grid two-columns">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Service" />
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>OTT</option><option>SaaS</option><option>Fitness</option><option>Utility</option>
          </select>
          <select value={form.cycle} onChange={(e) => setForm({ ...form, cycle: e.target.value })}>
            <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
          </select>
          <input value={form.renewal} onChange={(e) => setForm({ ...form, renewal: e.target.value })} type="date" className="full-width" />
        </div>
        <button className="primary" onClick={addSubscription}>Save</button>
      </div>

      <div className="panel">
        <h2>Burn rate</h2>
        <div className="stat-grid">
          <div><span>Monthly</span><strong>{money(summary.monthly)}</strong></div>
          <div><span>Annual</span><strong>{money(summary.annual)}</strong></div>
          <div><span>Due in 7 days</span><strong>{summary.dueSoon}</strong></div>
        </div>
      </div>

      <div className="panel full-span">
        <h2>Active services</h2>
        {subscriptions.map((item) => (
          <div key={item.id} className="transaction-row">
            <span>{item.name}</span>
            <span>{item.category}</span>
            <strong>{money(item.amount)}</strong>
            <small>{item.cycle}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
