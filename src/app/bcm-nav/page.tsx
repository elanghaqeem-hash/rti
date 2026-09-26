import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BcmNavPageClient from './BcmNavPageClient';

export const metadata: Metadata = {
  title: 'BCM NAV | Sistem Konsultan Business Continuity Management',
  description: 'Portal Login & Sistem Konsultan BCM Navigator - ISO 22301:2019 & POJK 11/2022'
};

export default function BcmNavPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071527] flex items-center justify-center text-cyan-400">Memuat Sistem BCM Nav...</div>}>
      <BcmNavPageClient />
    </Suspense>
  );
}
