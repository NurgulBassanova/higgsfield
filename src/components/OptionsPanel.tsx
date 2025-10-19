import { motion } from 'motion/react';
import { Play, Video, Download, Upload, FileDown, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import type { Job } from '../App';
import React from 'react';  
interface OptionsPanelProps {
  selectedAvatar: string;
  selectedVoice: string;
  voiceSpeed: number;
  styleDepth: number;
  isApproved: boolean;
  lectureText: string;
  jobs: Job[];
  onAvatarChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onVoiceSpeedChange: (value: number) => void;
  onStyleDepthChange: (value: number) => void;
  onGenerateVideo: () => void;
}

const avatars = [
  { id: 'avatar1', name: 'Sarah', emoji: '👩‍🏫', description: 'Professional' },
  { id: 'avatar2', name: 'David', emoji: '👨‍💼', description: 'Business' },
  { id: 'avatar3', name: 'Alex', emoji: '🧑‍💻', description: 'Tech' },
  { id: 'avatar4', name: 'Maya', emoji: '👩‍🔬', description: 'Science' }
];

const statusColors = {
  queued: 'bg-gray-500',
  processing: 'bg-yellow-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500'
};

const statusLabels = {
  queued: 'Queued',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed'
};

export function OptionsPanel({
  selectedAvatar,
  selectedVoice,
  voiceSpeed,
  styleDepth,
  isApproved,
  lectureText,
  jobs,
  onAvatarChange,
  onVoiceChange,
  onVoiceSpeedChange,
  onStyleDepthChange,
  onGenerateVideo
}: OptionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Video Settings */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-bold text-foreground mb-6">Avatar & Voice</h3>
        
        <div className="space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-foreground">Select Avatar</Label>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                
                return (
                  <motion.button
                    key={avatar.id}
                    onClick={() => onAvatarChange(avatar.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 glow-border'
                        : 'border-border hover:border-secondary bg-muted/30'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="text-xs font-medium text-foreground">{avatar.name}</div>
                    <div className="text-xs text-muted-foreground">{avatar.description}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice" className="text-foreground">Voice</Label>
            <Select value={selectedVoice} onValueChange={onVoiceChange}>
              <SelectTrigger id="voice" className="bg-input-background border-border rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maria">Maria — Female, Neutral</SelectItem>
                <SelectItem value="david">David — Male, Warm</SelectItem>
                <SelectItem value="anna">Anna — Female, Friendly</SelectItem>
                <SelectItem value="alexey">Alexey — Male, Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voice Speed */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-foreground">Voice Speed</Label>
              <span className="text-sm text-primary font-medium">{voiceSpeed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[voiceSpeed]}
              onValueChange={(values) => onVoiceSpeedChange(values[0])}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Presentation Depth */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-foreground">Presentation Depth</Label>
              <span className="text-sm text-primary font-medium">
                {styleDepth < 35 ? 'Concise' : styleDepth > 65 ? 'In-depth' : 'Medium'}
              </span>
            </div>
            <Slider
              value={[styleDepth]}
              onValueChange={(values) => onStyleDepthChange(values[0])}
              min={0}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Concise</span>
              <span>In-depth</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Preview */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-bold text-foreground mb-4">Video Preview</h3>
        <div className="aspect-video bg-gradient-to-br from-muted via-black to-muted rounded-xl flex items-center justify-center mb-4 relative overflow-hidden border border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <Play className="w-16 h-16 text-muted-foreground relative z-10" />
        </div>
      </Card>

      {/* Generate Video Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onGenerateVideo}
          disabled={!isApproved || !lectureText}
          className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl font-bold text-lg glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="w-5 h-5 mr-2" />
          Generate Video
        </Button>
      </motion.div>

      {/* Job Queue */}
      {jobs.length > 0 && (
        <Card className="p-6 bg-card border-border rounded-2xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Generation Queue</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl border border-border"
              >
                <div className={`w-2 h-2 mt-2 shrink-0 ${statusColors[job.status]} rounded-full ${
                  job.status === 'processing' ? 'animate-pulse' : ''
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate font-medium">{job.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary border border-secondary/30">
                      {statusLabels[job.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {job.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {job.status === 'processing' && job.progress !== undefined && (
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Options */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-bold text-foreground mb-4">Export & Publish</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-xl hover:bg-muted" 
            disabled={!isApproved}
          >
            <Download className="w-4 h-4 mr-2" />
            Export MP4
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-xl hover:bg-muted" 
            disabled={!isApproved}
          >
            <Upload className="w-4 h-4 mr-2" />
            Publish to Library
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-xl hover:bg-muted" 
            disabled={!isApproved}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download Subtitles (.srt)
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
