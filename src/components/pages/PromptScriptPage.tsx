import { motion } from 'motion/react';
import { useState } from 'react';
import { Sparkles, Heart, GraduationCap, Brain, BookOpen, FileText, Grid3x3, Loader2, Bold, Code, List, Heading2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

interface PromptScriptPageProps {
  prompt: string;
  tone: string;
  audience: string;
  selectedAddons: string[];
  lectureText: string;
  isGenerating: boolean;
  promptChanged: boolean;
  hasUnsavedChanges: boolean;
  isApproved: boolean;
  onPromptChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onAudienceChange: (value: string) => void;
  onAddonsChange: (value: string[]) => void;
  onGenerate: () => void;
  onLectureTextChange: (value: string) => void;
  onUpdateFromPrompt: () => void;
  onDismissPromptChange: () => void;
  onSave: () => void;
  onApprove: () => void;
}

const tones = [
  { id: 'Friendly', label: 'Friendly', icon: Heart },
  { id: 'Formal', label: 'Formal', icon: GraduationCap },
  { id: 'Exam-style', label: 'Exam', icon: Brain },
  { id: 'Story', label: 'Story', icon: BookOpen },
];

const audiences = ['Beginner', 'Intermediate', 'Advanced'];

const addons = [
  'code examples',
  'visuals',
  'exercises',
  'Q&A section'
];

export function PromptScriptPage({
  prompt,
  tone,
  audience,
  selectedAddons,
  lectureText,
  isGenerating,
  promptChanged,
  hasUnsavedChanges,
  isApproved,
  onPromptChange,
  onToneChange,
  onAudienceChange,
  onAddonsChange,
  onGenerate,
  onLectureTextChange,
  onUpdateFromPrompt,
  onDismissPromptChange,
  onSave,
  onApprove
}: PromptScriptPageProps) {
  const [viewMode, setViewMode] = useState<'full' | 'slides'>('full');

  const handleAddonToggle = (addon: string) => {
    if (isGenerating) return;
    
    const newAddons = selectedAddons.includes(addon)
      ? selectedAddons.filter(a => a !== addon)
      : [...selectedAddons, addon];
    
    onAddonsChange(newAddons);
  };

  const insertFormatting = (format: string) => {
    const formats: Record<string, string> = {
      bold: '**text**',
      code: '```\ncode\n```',
      list: '- List item\n',
      heading: '## Heading\n'
    };
    onLectureTextChange(lectureText + '\n' + (formats[format] || ''));
  };

  const slides = lectureText.split(/(?=^##\s)/m).filter(s => s.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto px-8 py-8"
    >
      {/* Left Panel: Prompt Builder */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 space-y-6 bg-card border-border rounded-2xl">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Describe your lecture</h2>
            <p className="text-muted-foreground">
              Tell us what you want to teach
            </p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-foreground">Lecture Topic</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Teach React basics to beginners, with exercises."
              className="min-h-[140px] bg-input-background border-border focus:border-primary transition-all resize-none rounded-xl"
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
                    className={`flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
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
              {addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon);
                
                return (
                  <motion.div
                    key={addon}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="secondary"
                      className={`cursor-pointer px-3 py-1.5 rounded-full transition-all ${
                        isSelected
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30'
                      }`}
                      onClick={() => handleAddonToggle(addon)}
                    >
                      {isSelected && '✓ '}+ {addon}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              onClick={onGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-lg glow-hover"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Lecture...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Lecture
                </>
              )}
            </Button>
          </motion.div>

          {/* Tagline */}
          {!prompt && (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground italic">
                From idea to lecture — in one seamless flow.
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Right Panel: Lecture Script */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col"
      >
        <Card className="p-8 flex flex-col min-h-[700px] bg-card border-border rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">Lecture Workspace</h2>
              {hasUnsavedChanges && (
                <Badge className="bg-primary/20 text-primary border border-primary/30">
                  Unsaved
                </Badge>
              )}
              {isApproved && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ Approved
                </Badge>
              )}
            </div>
            {hasUnsavedChanges && !isGenerating && lectureText && (
              <Button 
                onClick={onSave} 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              >
                Save
              </Button>
            )}
          </div>

          {/* Prompt Changed Alert */}
          {promptChanged && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert className="border-primary bg-primary/10 rounded-xl">
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-foreground">
                    Prompt changed — update lecture text?
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={onUpdateFromPrompt}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={onDismissPromptChange}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4"
                    >
                      Dismiss
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={viewMode === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('full')}
              className={`rounded-xl ${viewMode === 'full' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Full Script
            </Button>
            <Button
              variant={viewMode === 'slides' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('slides')}
              className={`rounded-xl ${viewMode === 'slides' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Slide View
            </Button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 min-h-0">
            {isGenerating ? (
              <div className="space-y-4 animate-slide-in">
                <Skeleton className="h-8 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-5/6 bg-muted" />
                <Skeleton className="h-6 w-1/2 mt-6 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                    <p className="text-lg text-foreground">✍️ AI is writing your lecture...</p>
                    <p className="text-sm text-muted-foreground">This will take ~30–60 seconds</p>
                  </div>
                </div>
              </div>
            ) : lectureText ? (
              viewMode === 'full' ? (
                <Textarea
                  value={lectureText}
                  onChange={(e) => onLectureTextChange(e.target.value)}
                  className="min-h-full font-mono text-sm resize-none bg-[#1A1A1A] border-border focus:border-primary rounded-xl text-foreground"
                  placeholder="Lecture text will appear here..."
                />
              ) : (
                <div className="space-y-4 max-h-full overflow-y-auto pr-2">
                  {slides.map((slide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 bg-muted/50 border-border rounded-xl">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 border-primary/50 text-primary">
                            Slide {index + 1}
                          </Badge>
                          <div className="flex-1">
                            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                              {slide.trim()}
                            </pre>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-center">
                <div className="max-w-md space-y-4">
                  <FileText className="w-20 h-20 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-bold text-foreground">Ready to create</h3>
                  <p className="text-muted-foreground">
                    Describe your lecture and click "Generate Lecture" to start
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Approve Button */}
          {lectureText && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-border"
            >
              {!isApproved ? (
                <Button
                  onClick={onApprove}
                  disabled={hasUnsavedChanges}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasUnsavedChanges ? 'Save changes before approving' : 'Approve Script →'}
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-green-400">
                    ✓ Script approved — ready for avatar selection
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}