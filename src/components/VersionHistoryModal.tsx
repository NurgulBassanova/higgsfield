import { motion } from 'motion/react';
import { RotateCcw, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import type { LectureVersion } from '../App';
import React from 'react';
interface VersionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  versions: LectureVersion[];
  currentVersion: number;
  onRestore: (version: LectureVersion) => void;
}

export function VersionHistoryModal({
  open,
  onClose,
  versions,
  currentVersion,
  onRestore
}: VersionHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Version History</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and restore previous versions of the lecture text
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">No saved versions</h3>
              <p className="text-sm text-muted-foreground">
                Versions will appear after generating or saving text
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 rounded-xl transition-all ${
                      version.id === currentVersion
                        ? 'border-primary bg-primary/10 glow-border'
                        : 'bg-muted/50 border-border hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-foreground">Version v{version.id}</h4>
                            <Badge 
                              variant={version.label === 'auto' ? 'secondary' : 'default'}
                              className={version.label === 'auto' 
                                ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                                : 'bg-primary/20 text-primary border border-primary/30'
                              }
                            >
                              {version.label === 'auto' ? 'Auto-saved' : 'Manual'}
                            </Badge>
                            {version.id === currentVersion && (
                              <Badge className="bg-primary text-primary-foreground">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {version.timestamp.toLocaleString('en-US', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      {version.id !== currentVersion && (
                        <Button
                          onClick={() => onRestore(version)}
                          size="sm"
                          variant="outline"
                          className="rounded-xl hover:bg-primary/10 hover:border-primary"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="bg-background rounded-xl p-3 border border-border">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4 font-mono">
                        {version.text}
                      </pre>
                    </div>

                    {/* Diff indicator (simplified) */}
                    {index < versions.length - 1 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {Math.abs(version.text.length - versions[index + 1].text.length)} characters changed
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose} variant="outline" className="rounded-xl">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
