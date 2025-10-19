import { motion } from 'motion/react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState } from 'react';
import { apiService } from '../../services/api';
import { toast } from 'sonner';
import React from 'react';

interface VideoExportPageProps {
  lectureTitle: string;
  videoTaskId: string | null;
}

export function VideoExportPage({ lectureTitle, videoTaskId }: VideoExportPageProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadVideo = async () => {
    if (!videoTaskId) {
      toast.error('❌ No video task ID available for download');
      return;
    }

    setIsDownloading(true);
    
    try {
      toast.info('📥 Starting video download...');
      
      const videoBlob = await apiService.downloadVideo(videoTaskId);
      
      // Create download link
      const url = window.URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${lectureTitle || 'lecture'}_video.mp4`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success('✅ Video downloaded successfully!');
    } catch (error) {
      console.error('Video download failed:', error);
      toast.error('❌ Failed to download video. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
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
            {videoTaskId ? (
              <div className="text-center">
                <p className="text-green-400 text-lg mb-2">✅ Video Ready for Download</p>
                <p className="text-muted-foreground text-sm">Task ID: {videoTaskId}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">No video available for download</p>
            )}
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
              className="w-full h-14 bg-muted border-2 border-border hover:border-primary text-foreground rounded-xl font-bold text-base transition-all disabled:opacity-50"
              onClick={handleDownloadVideo}
              disabled={!videoTaskId || isDownloading}
            >
              <Download className="w-5 h-5 mr-3" />
              {isDownloading ? 'Downloading...' : 'Export MP4'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          {videoTaskId ? (
            <p className="text-sm text-green-400">
              ✨ Video generation complete — ready to export
            </p>
          ) : (
            <p className="text-sm text-yellow-400">
              ⚠️ Please generate a video first to enable download
            </p>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}