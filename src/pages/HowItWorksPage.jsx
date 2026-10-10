import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FilePlus2, 
  Search, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Complaint Submission',
      status: 'SUBMITTED',
      icon: FilePlus2,
      color: '#3b82f6',
      bg: '#dbeafe',
      desc: 'The citizen registers or logs in, selects an issue category (such as garbage, road potholes, or drainage), provides locality and address, and uploads a photograph of the issue. The system generates a tamper-evident human-readable Complaint ID (e.g., MUNIC-2026-0001).',
    },
    {
      num: '02',
      title: 'Verification & Review',
      status: 'UNDER_REVIEW',
      icon: Search,
      color: '#8b5cf6',
      bg: '#ede9fe',
      desc: 'The municipal control room staff inspects the report for accuracy, verifies that it is not an accidental duplicate, and flags invalid claims with mandatory written justification if rejected.',
    },
    {
      num: '03',
      title: 'Departmental Assignment',
      status: 'ASSIGNED',
      icon: UserCheck,
      color: '#0284c7',
      bg: '#e0f2fe',
      desc: 'The complaint is assigned to the appropriate specialized authority (e.g. Solid Waste Management, Roads & Infrastructure, or Electrical Department) along with priority levels: Low, Medium, High, or Urgent.',
    },
    {
      num: '04',
      title: 'Field Execution',
      status: 'IN_PROGRESS',
      icon: PlayCircle,
      color: '#f59e0b',
      bg: '#fef3c7',
      desc: 'The designated field officers and repair crew deploy equipment and material to the reported address to clear waste, patch asphalt, or replace electrical components.',
    },
    {
      num: '05',
      title: 'Resolution with Proof',
      status: 'RESOLVED',
      icon: CheckCircle2,
      color: '#10b981',
      bg: '#d1fae5',
      desc: 'A complaint cannot be closed arbitrarily. The supervisor must submit official resolution notes explaining the remedial action taken and optionally upload a photograph of the repaired site.',
    },
    {
      num: '06',
      title: 'Citizen Rating & Reopen Option',
      status: 'REOPENED / FEEDBACK',
      icon: MessageSquare,
      color: '#ea580c',
      bg: '#ffedd5',
      desc: 'Transparency is guaranteed by giving power back to the citizen. The citizen can rate the service from 1 to 5 stars or reopen the complaint with a single click if the issue remains unaddressed.',
    },
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Workflow Architecture
        </span>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem' }}>
          Complaint Status Lifecycle
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
          Learn how your complaint travels through verification, assignment, field resolution, and citizen feedback.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--border-color)', letterSpacing: '-0.05em' }}>
                  {s.num}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', fontWeight: 700, marginBottom: '0.25rem' }}>
                {s.title}
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.75rem' }}>
                State: {s.status}
              </span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ background: 'var(--primary-navy)', color: '#ffffff', textAlign: 'center', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Ready to make your neighborhood cleaner and safer?
        </h2>
        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
          Join thousands of active residents who are collaborating with city administration.
        </p>
        <Link to="/citizen/submit" className="btn btn-primary btn-lg">
          Lodge Grievance Now <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
