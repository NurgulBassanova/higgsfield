import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, History, CheckCircle, Bold, Code, List, Heading2, FileText, Grid3x3, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import React from 'react';
interface LectureEditorProps {
  text: string;
  isGenerating: boolean;
  hasUnsavedChanges: boolean;
  promptChanged: boolean;
  isApproved: boolean;
  currentVersion: number;
  onChange: (value: string) => void;
  onSave: () => void;
  onShowHistory: () => void;
  onUpdateFromPrompt: () => void;
  onDismissPromptChange: () => void;
  onApprove: () => void;
}

export function LectureEditor({
  text,
  isGenerating,
  hasUnsavedChanges,
  promptChanged,
  isApproved,
  currentVersion,
  onChange,
  onSave,
  onShowHistory,
  onUpdateFromPrompt,
  onDismissPromptChange,
  onApprove
}: LectureEditorProps) {
  const [viewMode, setViewMode] = useState<'full' | 'slides'>('full');

  const insertFormatting = (format: string) => {
    const formats: Record<string, string> = {
      bold: '**text**',
      code: '```\\ncode\\n```',
      list: '- List item\\n',
      heading: '## Heading\\n'
    };
    onChange(text + '\\n' + (formats[format] || ''));
  };

  const slides = text.split(/(?=^##\\s)/m).filter(s => s.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col"
    >
      <Card className="p-6 flex flex-col min-h-[700px] bg-card border-border rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">Lecture Workspace</h2>
            {!isGenerating && text && (
              <>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border border-secondary/30">
                  v{currentVersion}
                </Badge>
                {hasUnsavedChanges && (
                  <Badge className="bg-primary/20 text-primary border border-primary/30">
                    Unsaved
                  </Badge>
                )}
                {isApproved && (
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Button onClick={onSave} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
            <Button onClick={onShowHistory} variant="outline" size="sm" disabled={isGenerating}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {/* Prompt Changed Alert */}
        <AnimatePresence>
          {promptChanged && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Alert className="border-primary bg-primary/10 rounded-xl">
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-foreground">
                    Prompt changed — update the lecture text?
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={onUpdateFromPrompt}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={onDismissPromptChange}
                      variant="outline"
                      size="sm"
                    >
                      Dismiss
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === 'full' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('full')}
            className={viewMode === 'full' ? 'bg-primary text-primary-foreground' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Full Script
          </Button>
          <Button
            variant={viewMode === 'slides' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('slides')}
            className={viewMode === 'slides' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Slide View
          </Button>
        </div>

        {/* Toolbar */}
        {!isGenerating && text && viewMode === 'full' && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('heading')}
              title="Heading"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('code')}
              title="Code block"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('list')}
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              {text.length} characters
            </div>
          </div>
        )}

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
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="text-muted-foreground">✍️ AI is writing your lecture...</p>
                  <p className="text-sm text-muted-foreground">This will take ~30–60 seconds</p>
                </div>
              </div>
            </div>
          ) : text ? (
            viewMode === 'full' ? (
              <Textarea
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-full font-mono text-sm resize-none bg-input-background border-border focus:border-primary rounded-xl"
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
                <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Ready to create</h3>
                <p className="text-muted-foreground">
                  Describe your lecture in the prompt builder and click "Generate Script" to start
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Approve Section */}
        {text && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-border"
          >
            {!isApproved ? (
              <Button
                onClick={onApprove}
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve for video generation
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-green-400">
                  ✓ Script approved — ready for video generation
                </p>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
