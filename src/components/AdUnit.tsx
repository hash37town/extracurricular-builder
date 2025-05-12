'use client';

import { useEffect } from 'react';

const AD_UNIT_IDS = {
  DISPLAY_1: '5671069975',
  DISPLAY_2: '1520071975'
} as const;

export default function AdUnit() {
  useEffect(() => {
    try {
      // Initialize each ad unit once
      const adUnits = [AD_UNIT_IDS.DISPLAY_1, AD_UNIT_IDS.DISPLAY_2];
      adUnits.forEach(adSlot => {
        const ad = document.querySelector(`[data-ad-slot="${adSlot}"]`);
        if (ad && !ad.hasAttribute('data-ad-status')) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
    } catch (err) {
      console.error('Error pushing ads:', err);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 bg-transparent">
      <div className="w-full max-w-[1600px] mx-4 flex flex-col sm:flex-row justify-center gap-4">
        {/* First Ad Unit */}
        <div className="relative min-h-[100px] w-full sm:w-[336px] md:w-[728px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-4386024282144806"
            data-ad-slot={AD_UNIT_IDS.DISPLAY_1}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Second Ad Unit */}
        <div className="relative min-h-[100px] w-full sm:w-[336px] md:w-[728px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-4386024282144806"
            data-ad-slot={AD_UNIT_IDS.DISPLAY_2}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}
