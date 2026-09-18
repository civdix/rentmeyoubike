'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../../src/context/AppContext';
import { VehicleDetailView } from '../../../src/views/VehicleDetailView';
import { Bike, ArrowLeft } from 'lucide-react';

export default function BikeDetailClient({ id }) {
  const { vehicles } = useApp();

  const vehicle = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return null;
    return vehicles.find((v) => String(v.id) === String(id) || String(v.rcNumber) === String(id));
  }, [vehicles, id]);

  if (!vehicle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
          <Bike className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold font-heading text-slate-900 mb-2">Vehicle Listing</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Exploring vehicles in Vrindavan. If this vehicle is currently rented or updating, check out all available scooters and bikes.
        </p>
        <Link
          href="/bikes"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Bikes in Vrindavan</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <VehicleDetailView
        vehicle={vehicle}
        onClose={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/bikes';
          }
        }}
      />
    </div>
  );
}
