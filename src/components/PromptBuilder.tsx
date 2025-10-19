import { motion } from 'motion/react';
import { Sparkles, Heart, GraduationCap, Brain, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import React from 'react';
interface PromptBuilderProps {
  prompt: string;
  tone: string;
  audience: string;
  isGenerating: boolean;
  onPromptChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onAudienceChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
}

const tones = [
  { id: 'Friendly', label: 'Friendly', icon: Heart },
  { id: 'Formal', label: 'Formal', icon: GraduationCap },
  { id: 'Exam-style', label: 'Exam', icon: Brain },
  { id: 'Story', label: 'Story', icon: BookOpen },
];

const audiences = ['Beginner', 'Intermediate', 'Advanced'];

const addons = [
  '+ code examples',
  '+ visuals',
  '+ exercises',
  '+ Q&A section'
];

export function PromptBuilder({
  prompt,
  tone,
  audience,
  isGenerating,
  onPromptChange,
  onToneChange,
  onAudienceChange,
  onGenerate,
}: PromptBuilderProps) {
  const handleAddonClick = (addon: string) => {
    const newPrompt = prompt ? `${prompt} ${addon}` : addon;
    onPromptChange(newPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-6 bg-card border-border rounded-2xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Describe your lecture</h2>
          <p className="text-sm text-muted-foreground">
            Tell us what you want to teach and we'll generate the perfect script
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-foreground">Lecture Topic</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Teach the basics of React to beginners, friendly tone, with visuals."
            className="min-h-[120px] bg-input-background border-border focus:border-primary transition-all resize-none rounded-xl"
            disabled={isGenerating}
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <Label className="text-foreground">Tone</Label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map((t) => {
              const Icon = t.icon;
              const isSelected = tone === t.id;
              
              return (
                <motion.button
                  key={t.id}
                  onClick={() => !isGenerating && onToneChange(t.id)}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted/50 border-border text-muted-foreground hover:border-secondary hover:bg-secondary/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Audience Selection */}
        <div className="space-y-3">
          <Label className="text-foreground">Target Audience</Label>
          <div className="flex gap-2">
            {audiences.map((aud) => {
              const isSelected = audience === aud;
              
              return (
                <motion.button
                  key={aud}
                  onClick={() => !isGenerating && onAudienceChange(aud)}
                  disabled={isGenerating}
                  className={`flex-1 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted/50 border-border text-muted-foreground hover:border-secondary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {aud}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Add-ons */}
        <div className="space-y-3">
          <Label className="text-foreground">Add-ons</Label>
          <div className="flex flex-wrap gap-2">
            {addons.map((addon) => (
              <Badge
                key={addon}
                variant="secondary"
                className="cursor-pointer bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30 px-3 py-1.5 rounded-full transition-all"
                onClick={() => !isGenerating && handleAddonClick(addon)}
              >
                {addon}
              </Badge>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-base glow-hover"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Script
              </>
            )}
          </Button>
        </motion.div>

        {/* Tagline */}
        {!prompt && (
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground italic">
              From idea to learning — in one prompt.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
