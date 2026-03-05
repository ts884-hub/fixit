'use client';

// ⚠️ DEMO ONLY — no backend calls. All state is client-side via DemoProvider.

import React, { useState } from 'react';
import { DemoProvider } from './DemoProvider';
import { TenantDemoForm } from './TenantDemoForm';
import { ManagerDemoDashboard } from './ManagerDemoDashboard';

type Tab = 'tenant' | 'manager';

export function DemoTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('tenant');

  return (
    <DemoProvider>
      <div className="bg-white border border-[#E2E5E7] rounded-2xl shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-[#E2E5E7] bg-[#F6F7F8]">
          <button
            onClick={() => setActiveTab('tenant')}
            className={[
              'flex-1 py-3.5 text-sm font-semibold transition-colors relative',
              activeTab === 'tenant'
                ? 'text-[#1F3A5F] bg-white'
                : 'text-gray-500 hover:text-[#1F3A5F]',
            ].join(' ')}
          >
            {activeTab === 'tenant' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1F3A5F]" />
            )}
            <span className="flex items-center justify-center gap-2">
              {/* Tenant icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Tenant — Submit a Request
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manager')}
            className={[
              'flex-1 py-3.5 text-sm font-semibold transition-colors relative',
              activeTab === 'manager'
                ? 'text-[#1F3A5F] bg-white'
                : 'text-gray-500 hover:text-[#1F3A5F]',
            ].join(' ')}
          >
            {activeTab === 'manager' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1F3A5F]" />
            )}
            <span className="flex items-center justify-center gap-2">
              {/* Manager icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manager — View Dashboard
            </span>
          </button>
        </div>

        {/* Tab body */}
        <div className="p-5 sm:p-6">
          {activeTab === 'tenant' ? (
            <TenantDemoForm onSubmitted={() => setActiveTab('manager')} />
          ) : (
            <ManagerDemoDashboard />
          )}
        </div>
      </div>
    </DemoProvider>
  );
}
