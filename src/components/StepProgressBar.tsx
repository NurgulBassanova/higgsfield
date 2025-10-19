import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import React from 'react';
export type Step = 'prompt' | 'script' | 'slides' | 'avatar' | 'video';

interface StepProgressBarProps {
  currentStep: Step;
}

const steps: { id: Step; label: string }[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'script', label: 'Script' },
  { id: 'slides', label: 'Slides' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'video', label: 'Video' },
];

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-card/50 border-b border-border py-6">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isFuture = index > currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground animate-pulse-glow'
                      : isCompleted
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-primary' : isFuture ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
