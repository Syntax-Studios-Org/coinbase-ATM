"use client";

import { useThemeStyles } from "@/hooks/useThemeStyles";

export function BottomSection() {
  const { getVar, theme } = useThemeStyles();

  return (
    <>
      {/* Bottom section */}
      <div className="flex items-center justify-center mt-[20px] mb-2">
        <div 
          className="font-medium text-[9px] text-center tracking-[2.75px] leading-[15px] mix-blend-color-dodge opacity-32"
          style={{ color: getVar('textPrimary') }}
        >
          COLLECT YOUR CRYPTO
        </div>
      </div>

      {/* Bottom card */}
      <div 
        className="w-full flex flex-col items-center justify-center gap-2.5 p-2 rounded-lg border-[0.7px]"
        style={{ borderColor: getVar('borderPrimary') }}
      >
        <div 
          className="w-full h-[26px] rounded-[3px] p-px relative" 
          style={{ background: theme.cardBorder }}
        >
          <div 
            className="w-full h-full rounded-[3px] relative" 
            style={{
              background: 'linear-gradient(104.62deg, #1A1A1A 0.45%, #090909 100%)',
              boxShadow: '0px 0px 18px 0px #000000E5 inset'
            }}
          >
            <div 
              className="absolute w-px h-[11px] -top-3 left-1/2 transform -translate-x-1/2 mix-blend-color-dodge"
              style={{ backgroundColor: getVar('borderPrimary') }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}