'use client';

import { useState, useEffect } from 'react';
import { calculateGhostWorkCost, ReceiptInput, ReceiptResult } from '../../lib/ghost-work-calculator';

const BUSINESS_TYPES = [
  'Dental', 'Legal', 'Real Estate', 'Fitness', 'Restaurant', 'Contractor',
  'Salon', 'Med Spa', 'Auto Shop', 'Childcare', 'Accounting', 'Other',
];

const REVENUE_OPTIONS = [
  { label: 'Under $250K', value: 125000 },
  { label: '$250K - $500K', value: 375000 },
  { label: '$500K - $1M', value: 750000 },
  { label: '$1M - $5M', value: 3000000 },
  { label: '$5M+', value: 10000000 },
];

const AREAS = [
  { label: 'Scheduling', key: 'scheduling' },
  { label: 'Follow-ups', key: 'follow_ups' },
  { label: 'Data Entry', key: 'data_entry' },
  { label: 'Customer Service', key: 'customer_service' },
  { label: 'Invoicing', key: 'invoicing' },
  { label: 'Marketing', key: 'marketing' },
  { label: 'Reporting', key: 'reporting' },
  { label: 'Inventory', key: 'inventory' },
];

function initFormState(): Omit<ReceiptInput, 'ghostWorkAreas'> & { ghostWorkAreas: string[] } {
  return {
    businessName: '',
    businessType: BUSINESS_TYPES[0],
    employees: 10,
    annualRevenue: REVENUE_OPTIONS[1].value,
    adminHoursPerWeek: 10,
    ghostWorkAreas: ['scheduling', 'follow_ups', 'customer_service'],
  };
}

function ReceiptDisplay({ result, formState, onBack }: {
  result: ReceiptResult;
  formState: Omit<ReceiptInput, 'ghostWorkAreas'> & { ghostWorkAreas: string[] };
  onBack: () => void;
}) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const shareToX = () => {
    const text = `My business loses $${result.annualGhostWorkCost.toLocaleString()}/yr to ghost work — check your own at eevolvv.com/ghost-work-receipt`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('Link copied!');
    });
  };

  const sendPdf = async () => {
    if (!email) { setErr('Enter your email'); return; }
    setSending(true); setErr(''); setSent(false);
    try {
      const res = await fetch('/api/receipt-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          businessName: formState.businessName || 'Your Business',
          businessType: formState.businessType || 'Business',
          cost: result.annualGhostWorkCost,
          hoursLostPerWeek: result.hoursLostPerYear / 48,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setSent(true); setEmail(''); }
      else { setErr(data.message || 'Failed'); }
    } catch {
      setErr('Something went wrong');
    } finally { setSending(false); }
  };

  const s = {
    container: { fontFamily: 'JetBrains Mono, monospace', background: '#f5f0e8', padding: 32, borderRadius: 8, maxWidth: 560, margin: '0 auto', color: '#141413' },
    header: { textAlign: 'center' as const, marginBottom: 24 },
    brand: { fontSize: 22, fontWeight: 700, letterSpacing: '-1px', color: '#141413' },
    subtitle: { fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' as const, opacity: 0.5, marginTop: 4 },
    receiptBox: { border: '1px dashed #141413', padding: 24, marginBottom: 24 },
    row: { display: 'flex', justifyContent: 'space-between' as const, marginBottom: 12, fontSize: 14 },
    label: { opacity: 0.55 },
    value: { fontWeight: 700 },
    totalLabel: { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: 8 },
    totalValue: { fontSize: '2.5em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' as const },
    divider: { borderTop: '1px dashed #141413', marginTop: 16, paddingTop: 16 },
    btn: { background: '#141413', color: '#faf7f0', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    btnSecondary: { background: 'transparent', color: '#141413', border: '1px solid #141413', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.brand}>eevolvv</div>
        <div style={s.subtitle}>ghost work receipt</div>
      </div>
      <div style={s.receiptBox}>
        <div style={s.row}><span style={s.label}>Business:</span><span style={s.value}>{formState.businessName || 'Your Business'}</span></div>
        <div style={s.row}><span style={s.label}>Type:</span><span style={s.value}>{formState.businessType}</span></div>
        <div style={{ ...s.row, marginBottom: 20 }}><span style={s.label}>Employees:</span><span style={s.value}>{formState.employees}</span></div>
        <div style={s.divider}>
          <div style={s.totalLabel}>Annual ghost work cost</div>
          <div style={s.totalValue}>${result.annualGhostWorkCost.toLocaleString()}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.55, marginBottom: 24 }}>
        {result.recoveryPercentage}% is recoverable with AI automation.
      </div>
      {result.breakdown.length > 0 && (
        <div style={{ ...s.receiptBox, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 12 }}>Breakdown</div>
          {result.breakdown.slice(0, 5).map((item, i) => (
            <div key={i} style={{ ...s.row, fontSize: 13, marginBottom: 6 }}>
              <span style={s.label}>{item.area}</span>
              <span style={s.value}>{Math.round(item.hoursPerWeek)} hrs/wk · ${Math.round(item.annualCost).toLocaleString()}/yr</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={shareToX} style={s.btn}>Share on X</button>
        <button onClick={copyLink} style={s.btnSecondary}>Copy Link</button>
        <button onClick={onBack} style={s.btnSecondary}>Recalculate</button>
      </div>
      <div style={{ borderTop: '1px dashed #141413', paddingTop: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>Get your receipt as a PDF</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 4, border: '1px solid #14141333', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}
          />
          <button onClick={sendPdf} disabled={sending} style={s.btn}>
            {sending ? '...' : 'Send'}
          </button>
        </div>
        {err && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 8 }}>{err}</div>}
        {sent && <div style={{ color: '#166534', fontSize: 12, marginTop: 8 }}>Receipt sent! Check your inbox.</div>}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, opacity: 0.4 }}>
        <a href="/diagnostic" style={{ color: '#141413', textDecoration: 'underline' }}>Start free AI diagnostic →</a>
      </div>
    </div>
  );
}

export default function GhostWorkReceiptPage() {
  const [formState, setFormState] = useState(initFormState);
  const [result, setResult] = useState<ReceiptResult | null>(null);

  // Load from URL params on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const biz = url.searchParams.get('biz');
    const type = url.searchParams.get('type');
    const cost = url.searchParams.get('cost');
    const employees = url.searchParams.get('employees');
    const revenue = url.searchParams.get('revenue');
    const adminHours = url.searchParams.get('adminHours');
    const areas = url.searchParams.get('areas')?.split(',') || [];

    if (biz && type && cost && employees && revenue && adminHours && areas.length > 0) {
      const input: ReceiptInput = {
        businessName: biz, businessType: type,
        employees: parseInt(employees, 10), annualRevenue: parseInt(revenue, 10),
        adminHoursPerWeek: parseInt(adminHours, 10), ghostWorkAreas: areas,
      };
      setFormState({ ...input });
      setResult(calculateGhostWorkCost(input));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: ReceiptInput = {
      businessName: formState.businessName,
      businessType: formState.businessType,
      employees: formState.employees,
      annualRevenue: formState.annualRevenue,
      adminHoursPerWeek: formState.adminHoursPerWeek,
      ghostWorkAreas: formState.ghostWorkAreas,
    };
    const res = calculateGhostWorkCost(input);
    setResult(res);
    // Update URL for shareability
    const url = new URL(window.location.href);
    url.searchParams.set('biz', input.businessName);
    url.searchParams.set('type', input.businessType);
    url.searchParams.set('cost', res.annualGhostWorkCost.toString());
    url.searchParams.set('employees', input.employees.toString());
    url.searchParams.set('revenue', input.annualRevenue.toString());
    url.searchParams.set('adminHours', input.adminHoursPerWeek.toString());
    url.searchParams.set('areas', input.ghostWorkAreas.join(','));
    window.history.pushState({}, '', url.toString());
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 4, border: '1px solid #14141333',
    fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', background: '#faf7f0', color: '#141413',
    boxSizing: 'border-box',
  };

  if (result) {
    return (
      <div style={{ padding: 20, background: '#faf7f0', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1.5px', color: '#141413' }}>eevolvv</div>
          <div style={{ fontSize: 12, opacity: 0.4, marginTop: 4 }}>GHOST WORK RECEIPT</div>
        </div>
        <ReceiptDisplay result={result} formState={formState} onBack={() => setResult(null)} />
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, opacity: 0.3, letterSpacing: '0.2em' }}>
          eevolvv.com · +1 (844) 433-8658 · eevolvv, Inc.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#faf7f0', minHeight: '100vh', color: '#141413', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1.5px' }}>eevolvv</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Ghost Work Receipt Generator</h1>
          <p style={{ fontSize: 14, opacity: 0.55, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            See exactly how much ghost work is costing your business. Enter a few details and get a shareable receipt.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Business Name</label>
            <input type="text" name="businessName" value={formState.businessName}
              onChange={e => setFormState(p => ({ ...p, businessName: e.target.value }))}
              placeholder="Your Business" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Business Type</label>
            <select name="businessType" value={formState.businessType}
              onChange={e => setFormState(p => ({ ...p, businessType: e.target.value }))}
              style={inputStyle}>
              {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Employees</label>
            <input type="number" min={1} max={500} value={formState.employees}
              onChange={e => setFormState(p => ({ ...p, employees: Math.max(1, parseInt(e.target.value) || 1) }))}
              style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Annual Revenue</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REVENUE_OPTIONS.map(o => (
                <label key={o.value} style={{
                  padding: '8px 14px', borderRadius: 4, border: `1px solid ${formState.annualRevenue === o.value ? '#141413' : '#14141333'}`,
                  background: formState.annualRevenue === o.value ? '#141413' : 'transparent',
                  color: formState.annualRevenue === o.value ? '#faf7f0' : '#141413',
                  cursor: 'pointer', fontSize: 12, fontWeight: formState.annualRevenue === o.value ? 600 : 400,
                }}>
                  <input type="radio" name="revenue" value={o.value} checked={formState.annualRevenue === o.value}
                    onChange={e => setFormState(p => ({ ...p, annualRevenue: parseInt(e.target.value) }))}
                    style={{ display: 'none' }} />
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Admin Hours/Week: <span style={{ fontWeight: 700, fontSize: 18 }}>{formState.adminHoursPerWeek}</span>
            </label>
            <input type="range" min={1} max={40} value={formState.adminHoursPerWeek}
              onChange={e => setFormState(p => ({ ...p, adminHoursPerWeek: parseInt(e.target.value) }))}
              style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Ghost Work Areas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AREAS.map(a => (
                <label key={a.key} style={{
                  padding: '8px 14px', borderRadius: 4, border: `1px solid ${formState.ghostWorkAreas.includes(a.key) ? '#141413' : '#14141333'}`,
                  background: formState.ghostWorkAreas.includes(a.key) ? '#141413' : 'transparent',
                  color: formState.ghostWorkAreas.includes(a.key) ? '#faf7f0' : '#141413',
                  cursor: 'pointer', fontSize: 12,
                }}>
                  <input type="checkbox" value={a.key} checked={formState.ghostWorkAreas.includes(a.key)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setFormState(p => ({
                        ...p,
                        ghostWorkAreas: checked
                          ? [...p.ghostWorkAreas, a.key]
                          : p.ghostWorkAreas.filter(k => k !== a.key),
                      }));
                    }}
                    style={{ display: 'none' }} />
                  {a.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={{
            background: '#141413', color: '#faf7f0', padding: '14px 32px', borderRadius: 4,
            border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, marginTop: 8,
          }}>
            Generate My Receipt →
          </button>
        </form>
      </div>
    </div>
  );
}