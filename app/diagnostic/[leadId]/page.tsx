'use client'

import { useParams } from 'next/navigation'

const DIAGNOSTIC_DATA = {
  template: {
    title: 'Efficiency Diagnostic Report',
    detected_waste: [
      { area: 'Manual appointment scheduling', hours_per_week: 18.2, annual_cost: 47800 },
      { area: 'Insurance verification calls', hours_per_week: 6.8, annual_cost: 17800 },
      { area: 'Patient intake forms', hours_per_week: 4.1, annual_cost: 10800 },
    ],
    total_annual_waste: 76400,
    automation_coverage: 89,
    implementation_time: '4-6 weeks',
    recommendations: [
      'Deploy AI appointment assistant (24/7 self-service booking)',
      'Auto-verify insurance via API integration',
      'Digital intake forms with pre-population',
    ],
  },
}

export default function DiagnosticReport() {
  const params = useParams()
  const leadId = params.leadId as string

  const { template } = DIAGNOSTIC_DATA

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="border-b border-cyan-500 pb-4 mb-8">
          <p className="text-cyan-500 text-sm mb-2">SIGNAL DETECTED // DALLAS LAB</p>
          <h1 className="text-3xl font-bold">EFFICIENCY DIAGNOSTIC</h1>
          <p className="text-gray-400 mt-2">Report ID: {leadId}</p>
        </div>

        {/* Detected Waste */}
        <section className="mb-12">
          <h2 className="text-xl text-cyan-500 mb-4">DETECTED INEFFICIENCIES</h2>
          <div className="space-y-4">
            {template.detected_waste.map((item, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded border border-gray-800">
                <p className="font-bold text-white">{item.area}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">{item.hours_per_week} hrs/week</span>
                  <span className="text-red-500 font-bold">${item.annual_cost.toLocaleString()}/year</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Total Impact */}
        <section className="bg-gradient-to-r from-red-900/20 to-red-950/20 border border-red-800 p-6 rounded mb-12">
          <p className="text-sm text-gray-400 mb-1">TOTAL ANNUAL WASTE</p>
          <p className="text-5xl font-bold text-red-500">${template.total_annual_waste.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-4">
            Automation coverage: <span className="text-cyan-500 font-bold">{template.automation_coverage}%</span>
          </p>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <h2 className="text-xl text-cyan-500 mb-4">AUTOMATION BLUEPRINT</h2>
          <ol className="space-y-3">
            {template.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start">
                <span className="text-cyan-500 font-bold mr-3">{i + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
          <p className="text-gray-400 text-sm mt-4">
            Implementation time: {template.implementation_time}
          </p>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 mb-4">
            This diagnostic expires in <span className="text-cyan-500 font-bold">72 hours</span>.  
            Machine systems do not send reminders.
          </p>
          <a
            href="/contact"
            className="inline-block bg-cyan-500 text-black px-8 py-4 rounded font-bold hover:bg-cyan-400 transition-colors"
          >
            IMPLEMENT BLUEPRINT →
          </a>
          <p className="text-xs text-gray-600 mt-8">
            —Volvv-E  
            <br />
            Autonomous Efficiency Engine  
            <br />
            eevolvv, Inc.
          </p>
        </section>
      </div>
    </div>
  )
}
