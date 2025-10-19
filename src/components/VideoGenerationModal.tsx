import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Job } from '../App';
import React from 'react';

interface VideoGenerationModalProps {
  open: boolean;
  onClose: () => void;
  job?: Job;
}

export function VideoGenerationModal({ open, onClose, job }: VideoGenerationModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Video Generation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {job.status === 'queued' && 'Your video is queued for generation'}
            {job.status === 'processing' && 'Video generation in progress'}
            {job.status === 'completed' && 'Video successfully generated!'}
            {job.status === 'failed' && 'An error occurred during generation'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {job.status === 'queued' && (
                <motion.div
                  key="queued"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-20 h-20 rounded-full bg-muted flex items-center justify-center"
                >
                  <Clock className="w-10 h-10 text-muted-foreground" />
                </motion.div>
              )}
              {job.status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center glow-border"
                >
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </motion.div>
              )}
              {job.status === 'completed' && (
                <motion.div
                  key="completed"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
              )}
              {job.status === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center"
                >
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Job Info */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">{job.title}</h3>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary border border-secondary/30">
              {job.status === 'queued' && 'Queued'}
              {job.status === 'processing' && 'Processing'}
              {job.status === 'completed' && 'Completed'}
              {job.status === 'failed' && 'Error'}
            </Badge>
          </div>

          {/* Progress Bar */}
          {job.status === 'processing' && job.progress !== undefined && (
            <div className="space-y-2">
              <Progress value={job.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span className="text-primary font-medium">{job.progress}%</span>
              </div>
            </div>
          )}

          {/* Processing Logs */}
          {job.status === 'processing' && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">✓</span> Analyzing lecture text
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">✓</span> Generating voice
              </p>
              <p className="text-sm text-foreground font-medium">
                <span className="text-primary">⋯</span> Creating video with avatar
              </p>
              <p className="text-sm text-muted-foreground/60">
                <span className="text-muted-foreground/40">○</span> Adding visual elements
              </p>
              <p className="text-sm text-muted-foreground/60">
                <span className="text-muted-foreground/40">○</span> Final rendering
              </p>
            </div>
          )}

          {/* Status Message */}
          {job.status === 'queued' && (
            <p className="text-sm text-center text-muted-foreground">
              Your video is queued. You'll receive a notification when it's ready.
            </p>
          )}
          {job.status === 'completed' && (
            <p className="text-sm text-center text-green-500">
              ✨ Video is ready! You can preview it or download.
            </p>
          )}
          {job.status === 'failed' && (
            <p className="text-sm text-center text-red-500">
              Unfortunately, an error occurred. Please try again or contact support.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {job.status === 'completed' && (
              <>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-hover">
                  Watch Video
                </Button>
                <Button variant="outline" onClick={onClose} className="rounded-xl">
                  Close
                </Button>
              </>
            )}
            {(job.status === 'queued' || job.status === 'processing') && (
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                Minimize (continue in background)
              </Button>
            )}
            {job.status === 'failed' && (
              <>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                  Try Again
                </Button>
                <Button variant="outline" onClick={onClose} className="rounded-xl">
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
