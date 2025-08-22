import React from 'react';

interface CTAButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  className?: string;
}

export function CTAButton({ onClick, text, disabled = false, className = "" }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer w-full h-[73px] rounded-2xl border-2 border-black relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(105.55deg, rgba(95, 98, 101, 0.6) 0%, rgba(50, 51, 53, 0.6) 100%), linear-gradient(0deg, rgba(70, 72, 77, 0.4), rgba(70, 72, 77, 0.4)), url(/cta-button-bg-img.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0px 1px 4px 0px #0000004D, -1px -1px 1px 0px #1A1A1A99 inset, 1px 1px 1px 0px #A9A9A938 inset'
      }}
    >
      <div className="flex items-center justify-center gap-[19px] px-10 py-[18px] w-full h-full rounded-2xl">
        <p
          className="flex-1 font-semibold text-sm text-center tracking-[0] leading-6"
          style={{
            background: 'linear-gradient(100.38deg, #2BC876 -2.24%, #2CD37C 92.83%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {text}
        </p>
      </div>
    </button>
  );
}
