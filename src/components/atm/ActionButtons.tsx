"use client";

import { CreditCard, DownloadCloud, Send, ArrowLeftRight } from "lucide-react";
import { useThemeStyles } from "@/hooks/useThemeStyles";

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface ActionButtonsProps {
  leftButton: ActionButton;
  rightButton: ActionButton;
}

export function ActionButtons({
  leftButton,
  rightButton,
}: ActionButtonsProps) {
  const { getVar } = useThemeStyles();

  const renderButton = (button: ActionButton) => {
    const isPrimary = button.variant === 'primary';

    return (
      <button
        onClick={button.onClick}
        className={`cursor-pointer flex flex-col items-start gap-3 p-3 flex-1 rounded-[10px] transition-all ${
          isPrimary ? 'overflow-hidden' : 'border border-solid'
        }`}
        style={isPrimary ? {
          backgroundColor: getVar('buttonPrimary'),
          boxShadow: `0px 0px 0px 4px ${getVar('buttonPrimaryHover')}, 0px 0px 0px 3px ${getVar('primaryDark')}`,
        } : {
          borderColor: getVar('buttonSecondary'),
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          if (isPrimary) {
            e.currentTarget.style.backgroundColor = getVar('buttonPrimaryHover');
          } else {
            e.currentTarget.style.borderColor = getVar('buttonSecondaryHover');
            e.currentTarget.style.backgroundColor = `${getVar('buttonSecondaryHover')}10`;
          }
        }}
        onMouseLeave={(e) => {
          if (isPrimary) {
            e.currentTarget.style.backgroundColor = getVar('buttonPrimary');
          } else {
            e.currentTarget.style.borderColor = getVar('buttonSecondary');
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div className="w-4 h-4">
          {button.icon}
        </div>
        <div
          className="font-pixelify font-semibold text-base tracking-[0] leading-[19.2px]"
          style={{ color: isPrimary ? '#09172d' : getVar('textAccent') }}
        >
          {button.label}
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-start justify-center gap-3 w-full">
      {renderButton(leftButton)}
      {renderButton(rightButton)}
    </div>
  );
}

// Export icon components for easy use
export { CreditCard, DownloadCloud, Send, ArrowLeftRight };
