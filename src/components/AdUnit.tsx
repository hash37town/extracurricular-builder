'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  adClient: string;
  adSlot: string;
  adFormat: string;
  fullWidthResponsive: boolean;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ adClient, adSlot, adFormat, fullWidthResponsive }) => {
  return (
    <div className="w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdUnit;
