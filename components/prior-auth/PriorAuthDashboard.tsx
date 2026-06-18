'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Shield, BedDouble, Plus, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Reveal, RevealStagger } from '@/components/motion/Reveal';

export interface PriorAuthCase {
  id: string;
  case_type: 'prior_auth' | 'step_therapy' | 'continued_stay';
  status: 'draft' | 'ready' | 'submitted' | 'approved' | 'denied' | 'appealing';
  patient_identifier: string | null;
  facility_name: string | null;
  payer_name: string | null;
  medication_name: string | null;
  diagnosis_description: string | null;
  created_at: string;
  updated_at: string;
}

const CASE_TYPE_CONFIG = {
  prior_auth: {
    label: 'Prior Authorization',
    icon: FileText,
    color: 'text-[#6B8F71]',
    bg: 'bg-[#6B8F71]/10',
    description: 'Generate a complete prior auth request for a new or denied medication',
    cta: 'New Prior Auth',
  },
  step_therapy: {
    label: 'Step Therapy Exception',
    icon: Shield,
    color: 'text-[#E8C37A]',
    bg: 'bg-[#E8C37A]/10',
    description: '"Have you tried other meds?" — Fight step therapy requirements with state law',
    cta: 'New Step Therapy',
  },
  continued_stay: {
    label: 'Continued Stay Defense',
    icon: BedDouble,
    color: 'text-[#4A7FA5]',
    bg: 'bg-[#4A7FA5]/10',
    description: 'Justify continued inpatient, SNF, or residential care with medical necessity',
    cta: 'New Continued Stay',
  },
} as const;

const STATUS_CONFIG = {
  draft:      { label: 'Draft',            icon: Clock,          color: 'text-slate-500 bg-slate-100' },
  ready:      { label: 'Ready to Submit',  icon: CheckCircle,    color: 'text-[#6B8F71] bg-[#6B8F71]/10' },
  submitted:  { label: 'Submitted',        icon: AlertCircle,    color: 'text-[#4A7FA5] bg-[#4A7FA5]/10' },
  approved:   { label: 'Approved',         icon: CheckCircle,    color: 'text-green-600 bg-green-50' },
  denied:     { label: 'Denied',           icon: XCircle,        color: 'text-red-500 bg-red-50' },
  appealing:  { label: 'On Appeal',        icon: AlertCircle,    color: 'text-amber-600 bg-amber-50' },
} as const;

type FilterOption = 'all' | 'prior_auth' | 'step_therapy' | 'continued_stay';

export function PriorAuthDashboard({
  initialCases,
  userName,
}: {
  initialCases: PriorAuthCase[];
  userName: string;
}) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredCases =
    activeFilter === 'all'
      ? initialCases
      : initialCases.filter((c) => c.case_type === activeFilter);

  const stats = {
    total:    initialCases.length,
    ready:    initialCases.filter((c) => c.status === 'ready').length,
    approved: initialCases.filter((c) => c.status === 'approved').length,
    pending:  initialCases.filter((c) => ['submitted', 'appealing'].includes(c.status)).length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <Reveal>
        <div className="mb-8">
          <h1 className="font-display mb-1 text-2xl font-semibold text-[#1C2B2D]">
            Prior Auth Engine
          </h1>
          <p className="text-sm text-slate-500">
            AI-generated prior authorization, step therapy exceptions, and continued stay letters
            {userName ? ` — for ${userName}` : ''}.
          </p>
        </div>
      </Reveal>

      {/* Stats */}
      <RevealStagger>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              { label: 'Total Cases',      value: stats.total,    color: 'text-[#1C2B2D]' },
              { label: 'Ready to Submit',  value: stats.ready,    color: 'text-[#6B8F71]' },
              { label: 'In Review',        value: stats.pending,  color: 'text-[#4A7FA5]' },
              { label: 'Approved',         value: stats.approved, color: 'text-green-600' },
            ] as const
          ).map((stat) => (
            <Card key={stat.label} className="border border-slate-200 p-4 text-center">
              <div className={`mb-1 text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </Card>
          ))}
        </div>
      </RevealStagger>

      {/* New Case Cards */}
      <Reveal>
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {(Object.entries(CASE_TYPE_CONFIG) as [keyof typeof CASE_TYPE_CONFIG, typeof CASE_TYPE_CONFIG[keyof typeof CASE_TYPE_CONFIG]][]).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => router.push(`/prior-auth/new?type=${type}`)}
                className="group rounded-xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-[#6B8F71] hover:bg-[#F8F6F2] focus:outline-none focus:ring-2 focus:ring-[#6B8F71] focus:ring-offset-2"
              >
                <div className={`mb-3 inline-flex rounded-lg p-2 ${config.bg}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <h3 className="mb-1 flex items-center gap-1 text-sm font-semibold text-[#1C2B2D]">
                  {config.label}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-[#6B8F71]" />
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">{config.description}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B8F71]">
                    <Plus className="h-3 w-3" />
                    {config.cta}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Case List */}
      <Reveal>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#1C2B2D]">Recent Cases</h2>
          <div className="flex gap-2">
            {(['all', 'prior_auth', 'step_therapy', 'continued_stay'] as FilterOption[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeFilter === filter
                      ? 'bg-[#1C2B2D] text-white'
                      : 'border border-slate-200 bg-white text-slate-500 hover:border-[#6B8F71]'
                  }`}
                >
                  {filter === 'all'
                    ? 'All'
                    : CASE_TYPE_CONFIG[filter as keyof typeof CASE_TYPE_CONFIG]?.label.split(
                        ' '
                      )[0]}
                </button>
              )
            )}
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">No cases yet. Create your first above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCases.map((c) => {
              const typeConfig = CASE_TYPE_CONFIG[c.case_type];
              const statusConfig = STATUS_CONFIG[c.status];
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => router.push(`/prior-auth/${c.id}`)}
                  className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:border-[#6B8F71] hover:shadow-sm"
                >
                  <div className={`shrink-0 rounded-lg p-2 ${typeConfig.bg}`}>
                    <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[#1C2B2D]">
                        {c.medication_name || c.diagnosis_description || 'Untitled Case'}
                      </span>
                    </div>
                    <div className="truncate text-xs text-slate-400">
                      {c.patient_identifier ? `Patient: ${c.patient_identifier} · ` : ''}
                      {c.payer_name || 'Payer not set'} · {typeConfig.label}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                </button>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}
