import { motion } from 'motion/react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import React from 'react';
interface VideoExportPageProps {
  lectureTitle: string;
}

export function VideoExportPage({ lectureTitle }: VideoExportPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1000px] mx-auto px-8 py-8"
    >
      <Card className="p-10 bg-card border-border rounded-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Video Generation</h2>
          <p className="text-muted-foreground">Your lecture video will appear here</p>
        </div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-[#0A0A0A] border-2 border-primary/20 rounded-2xl aspect-video flex items-center justify-center">
            <p className="text-muted-foreground text-lg">Video will be loaded from backend</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-md"
          >
            <Button
              className="w-full h-14 bg-muted border-2 border-border hover:border-primary text-foreground rounded-xl font-bold text-base transition-all"
            >
              <Download className="w-5 h-5 mr-3" />
              Export MP4
            </Button>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-green-400">
            ✨ Video generation complete — ready to export
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}