'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../src/context/AppContext';
import { MarketplaceView } from '../../src/views/MarketplaceView';

export default function BikesClient() {
  const { setRole, setCustomerTab } = useApp();

  useEffect(() => {
    setRole('customer');
    if (setCustomerTab) setCustomerTab('browse');
  }, [setRole, setCustomerTab]);

  return (
    <div className="w-full">
      <MarketplaceView />
    </div>
  );
}
