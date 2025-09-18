"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    id: 1,
    text: "Welcome! to the Coinbase ATM here you can trade and buy tokens on base.",
    image: null,
  },
  {
    id: 2,
    text: "Easily trade your tokens with just a few taps",
    image: "/panda-swap.svg",
  },
  {
    id: 3,
    text: "Trades are secure, simple and fast",
    image: "/panda-lock.svg",
  },
  {
    id: 4,
    text: "This demo makes real onchain transactions and collects your email for authentication. See our <a href='https://www.coinbase.com/legal/privacy'>Privacy Policy for details.</a>",
    image: null,
  },
  {
    id: 5,
    text: "You're all set! Connect your wallet and start trading on base",
    image: null,
  },
];

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = TUTORIAL_STEPS.find(
    (step) => step.id === currentStep,
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(50% 294.9% at 50% 50%, rgba(9, 20, 14, 0.7) 0%, rgba(5, 10, 7, 0.7) 100%)",
        backdropFilter: "blur(9px)",
      }}
    >
      {/* Content container - constrained to 390px width */}
      <div className="w-full max-w-[390px] mx-auto px-[15px] h-full relative flex flex-col">
        {currentStep < 5 && (
          <div className="absolute top-8 right-4 z-10">
            <button
              onClick={handleSkip}
              className="cursor-pointer flex items-center gap-2 hover:text-[#2bc876]/80 font-pixelify text-[16px] text-[#2bc876]"
            >
              <span>Skip Tutorial</span>
              <Image
                src="/skip-tutorial.svg"
                alt="Skip"
                width={16}
                height={16}
              />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-end py-16">
          <div className="relative h-[280px]">
            {/* Panda character - bottom left, much bigger */}
            <div className="absolute bottom-0 left-0">
              {currentStep === 4 ? (
                <Image
                  src="/panda-disclaimer.svg"
                  alt="Panda"
                  width={181}
                  height={216}
                />
              ) : (
                <Image src="/panda.svg" alt="Panda" width={181} height={216} />
              )}
            </div>

            {/* Speech bubble - positioned close to panda, slightly to the right */}
            <div className="absolute bottom-[210px] left-[120px]">
              {currentStep === 4 ? (
                <Image
                  src="/panda-cloud-disclaimer.svg"
                  alt="Speech bubble"
                  width={280}
                  height={500}
                />
              ) : (
                <Image
                  src="/panda-cloud.svg"
                  alt="Speech bubble"
                  width={280}
                  height={150}
                />
              )}
              {/* Content inside speech bubble */}
              <div className="absolute top-3 flex flex-col items-start justify-center px-4 py-2 space-y-2">
                {currentStep === 4 ? (
                  <p className="text-black font-pixelify text-[13px] text-left leading-3.5 max-w-[250px]">
                    By clicking "Request Verification Code," you agree that this
                    demo App is provided AS-IS and that your use is subject to
                    the CDP ToS, and you acknowledge that (1) your data is
                    governed by Coinbase's Privacy Policy; (2) onchain data is
                    public and immutable, and (3) your IP address may be used
                    for geofencing access control. We recommend only using
                    minimal funds to avoid potential loss.
                  </p>
                ) : (
                  <p className="text-black font-pixelify text-[15px] text-left leading-relaxed max-w-[250px]">
                    {currentStepData?.text}
                  </p>
                )}
                {/* Step-specific image inside the cloud */}
                {currentStepData?.image && (
                  <Image
                    src={currentStepData.image}
                    alt="Tutorial illustration"
                    width={160}
                    height={90}
                    className="mx-auto -my-2"
                  />
                )}
              </div>
            </div>

            {/* Next/Get Started button - bottom right */}
            <div className="absolute bottom-0 right-0">
              <button
                onClick={handleNext}
                className="cursor-pointer flex items-center gap-2 hover:text-[#2bc876]/80 font-pixelify text-[16px] text-[#2bc876]"
              >
                {currentStep === 5 ? "Get Started" : "Next"}
                <Image src="/next.svg" alt="Skip" width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
