'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_MOCK_TICKETS, type DemoTicket, type DemoStatus } from './mockTickets';

interface DemoContextValue {
  tickets: DemoTicket[];
  addTicket: (ticket: DemoTicket) => void;
  updateTicket: (id: string, updates: { status?: DemoStatus; managerNotes?: string }) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<DemoTicket[]>(INITIAL_MOCK_TICKETS);

  const addTicket = useCallback((ticket: DemoTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  const updateTicket = useCallback(
    (id: string, updates: { status?: DemoStatus; managerNotes?: string }) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates, isNew: false } : t))
      );
    },
    []
  );

  return (
    <DemoContext.Provider value={{ tickets, addTicket, updateTicket }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
