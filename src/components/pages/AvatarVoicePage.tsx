import React from 'react';
import { motion } from 'motion/react';
import { Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import yerzatImg from '../../assets/5292c462b881b123eddb6787689e8484de390c37.png';
import jamesImg from '../../assets/2a2e2c263f941d47cbb664ae988fc3044a3373ec.png';
import danelyaImg from '../../assets/331251e249e74d3c6758b4ee7ad282a51b7b1a80.png';

interface AvatarVoicePageProps {
  selectedAvatar: string;
  selectedVoice: string;
  voiceSpeed: number;
  styleDepth: number;
  onAvatarChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onVoiceSpeedChange: (value: number) => void;
  onStyleDepthChange: (value: number) => void;
  onGenerateVideo: () => void;
  isGenerating: boolean;
}

const avatars = [
  { 
    id: 'yerzat', 
    name: 'Yerzat', 
    image: yerzatImg, 
    description: 'Male Energetic',
    voiceId: 'yerzat',
    voiceLabel: 'Yerzat — Male, Energetic'
  },
  { 
    id: 'james', 
    name: 'James', 
    image: jamesImg, 
    description: 'Male Calm',
    voiceId: 'james',
    voiceLabel: 'James — Male, Calm'
  },
  { 
    id: 'danelya', 
    name: 'Danelya', 
    image: danelyaImg, 
    description: 'Female Friendly',
    voiceId: 'danelya',
    voiceLabel: 'Danelya — Female, Friendly'
  }
];

export function AvatarVoicePage({
  selectedAvatar,
  selectedVoice,
  voiceSpeed,
  styleDepth,
  onAvatarChange,
  onVoiceChange,
  onVoiceSpeedChange,
  onStyleDepthChange,
  onGenerateVideo,
  isGenerating
}: AvatarVoicePageProps) {
  const handleAvatarSelect = (avatarId: string) => {
    onAvatarChange(avatarId);
    const avatar = avatars.find(a => a.id === avatarId);
    if (avatar) {
      onVoiceChange(avatar.voiceId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[900px] mx-auto px-8 py-8"
    >
      <Card className="p-10 bg-card border-border rounded-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Avatar & Voice</h2>
          <p className="text-muted-foreground">Choose your presenter and voice settings</p>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-4 mb-10">
          <Label className="text-lg text-foreground">Select Avatar</Label>
          <div className="grid grid-cols-3 gap-4">
            {avatars.map((avatar) => {
              const isSelected = selectedAvatar === avatar.id;
              
              return (
                <motion.button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  disabled={isGenerating}
                  className={`relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-primary bg-primary/10 glow-border'
                      : 'border-border hover:border-secondary bg-muted/30'
                  }`}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-muted">
                    <img 
                      src={avatar.image} 
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-lg font-bold text-foreground">{avatar.name}</div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="space-y-8 mb-10">
          <div>
            <Label className="text-lg text-foreground mb-4 block">Voice Settings</Label>
            
            {/* Voice Selection */}
            <div className="space-y-3 mb-6">
              <Label htmlFor="voice" className="text-foreground">Voice</Label>
              <Select value={selectedVoice} onValueChange={onVoiceChange} disabled={isGenerating}>
                <SelectTrigger id="voice" className="bg-input-background border-border rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yerzat">Yerzat — Male, Energetic</SelectItem>
                  <SelectItem value="james">James — Male, Calm</SelectItem>
                  <SelectItem value="danelya">Danelya — Female, Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Voice Speed */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <Label className="text-foreground">Voice Speed</Label>
                <span className="text-sm text-primary font-bold">{voiceSpeed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[voiceSpeed]}
                onValueChange={(values) => onVoiceSpeedChange(values[0])}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Presentation Depth */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-foreground">Presentation Depth</Label>
                <span className="text-sm text-primary font-bold">
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
                disabled={isGenerating}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Concise</span>
                <span>In-depth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Video Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onGenerateVideo}
            disabled={isGenerating}
            className="w-full h-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl font-bold text-xl glow-hover disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Video className="w-6 h-6 mr-3 animate-pulse" />
                Generating Video...
              </>
            ) : (
              <>
                <Video className="w-6 h-6 mr-3" />
                Generate Video
              </>
            )}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}