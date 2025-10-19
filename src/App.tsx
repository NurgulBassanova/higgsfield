import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { StepProgressBar, Step } from './components/StepProgressBar';
import { PromptScriptPage } from './components/pages/PromptScriptPage';
import { AvatarVoicePage } from './components/pages/AvatarVoicePage';
import { VideoExportPage } from './components/pages/VideoExportPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { apiService, LectureTopicRequest } from './services/api';
import React from 'react';
export interface LectureVersion {
  id: number;
  text: string;
  timestamp: Date;
  label: string;
}

export interface Job {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  title: string;
  timestamp: Date;
  progress?: number;
}

type Page = 'prompt-script' | 'avatar-voice' | 'video-export';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('prompt-script');
  const [currentStep, setCurrentStep] = useState<Step>('prompt');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [audience, setAudience] = useState('Beginner');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [lectureText, setLectureText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptChanged, setPromptChanged] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('yerzat');
  const [selectedVoice, setSelectedVoice] = useState('yerzat');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [styleDepth, setStyleDepth] = useState(50);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Check backend connection and load saved lecture text on app startup
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await apiService.healthCheck();
        setBackendConnected(true);
      } catch (error) {
        setBackendConnected(false);
        toast.error('⚠️ Backend server not available. Some features may not work.');
      }
    };
    
    checkBackendConnection();

    // Загружаем сохраненный текст лекции при запуске
    const savedText = localStorage.getItem('savedLectureText');
    if (savedText) {
      setLectureText(savedText);
      setHasUnsavedChanges(false);
    }
  }, []);

  // Update current step based on progress and page
  useEffect(() => {
    if (currentPage === 'prompt-script') {
      if (!prompt) {
        setCurrentStep('prompt');
      } else if (!lectureText) {
        setCurrentStep('script');
      } else {
        setCurrentStep('slides');
      }
    } else if (currentPage === 'avatar-voice') {
      setCurrentStep('avatar');
    } else if (currentPage === 'video-export') {
      setCurrentStep('video');
    }
  }, [currentPage, prompt, lectureText]);

  const handleGenerateText = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setPromptChanged(false);
    
    try {
      // Create lecture request
      const lectureRequest: LectureTopicRequest = {
        topic: prompt,
        duration_minutes: 10, // Default duration
        difficulty_level: audience.toLowerCase(),
        target_audience: tone.toLowerCase()
      };

      // Generate lecture using the API
      const response = await apiService.generateLecture(lectureRequest);
      
      if (response.status === 1 && response.slides.length > 0) {
        // Convert slides to markdown format
        let generatedText = `# ${response.topic}\n\n`;
        
        response.slides.forEach((slide, index) => {
          generatedText += `## ${slide.title}\n\n`;
          generatedText += `${slide.content}\n\n`;
          
          if (slide.script) {
            generatedText += `**Script**: ${slide.script}\n\n`;
          }
          
          if (slide.image_prompt) {
            generatedText += `**Image**: ${slide.image_prompt}\n\n`;
          }
        });
        
        setLectureText(generatedText);
        
        localStorage.setItem('savedLectureText', generatedText);
       
        
        setIsGenerating(false);
        setHasUnsavedChanges(false);
        setIsApproved(false);
        
        toast.success('✅ Lecture generated and saved successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setIsGenerating(false);
      toast.error('❌ Failed to generate lecture. Please try again.');
    }
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (lectureText) {
      setPromptChanged(true);
    }
  };

  const handleAddonsChange = (addons: string[]) => {
    setSelectedAddons(addons);
    if (lectureText) {
      setPromptChanged(true);
    }
  };

  const handleUpdateFromPrompt = async () => {
    await handleGenerateText();
  };

  const handleLectureTextChange = (value: string) => {
    setLectureText(value);
    setHasUnsavedChanges(true);
    setIsApproved(false);
  };

  const handleSave = () => {
    if (lectureText.trim()) {
      localStorage.setItem('savedLectureText', lectureText);
      setHasUnsavedChanges(false);
      toast.success('Lecture text saved locally');
    } else {
      toast.error('No lecture text to save');
    }
  };

  const handleClearSavedText = () => {
    localStorage.removeItem('savedLectureText');
    setLectureText('');
    setHasUnsavedChanges(false);
    setIsApproved(false);
    toast.success('Saved lecture text cleared');
  };

  const handleApprove = () => {
    if (hasUnsavedChanges) {
      toast.error('Please save your changes first');
      return;
    }
    
    if (lectureText.trim()) {
      localStorage.setItem('savedLectureText', lectureText);
      toast.success('Lecture text saved and approved');
    }
    
    setIsApproved(true);
    
    // Navigate to avatar page after approval
    setTimeout(() => {
      setCurrentPage('avatar-voice');
    }, 1000);
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    
    try {
      toast.success('✨ Starting video generation...');
      
      const imagePrompts = lectureText
        .split('\n')
        .filter(line => line.includes('**Image**:'))
        .map(line => line.replace('**Image**:', '').trim())
        .filter(prompt => prompt.length > 0);
      
      if (imagePrompts.length > 0) {
        // Generate images using the first prompt as an example
        const imageResponse = await apiService.generateImage({
          text: imagePrompts[0]
        });
        
        if (imageResponse.status === 1) {
          toast.success('🎨 Images generated successfully!');
        }
      }
      
      // Simulate additional video processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsGeneratingVideo(false);
      toast.success('✨ Video generated successfully!');
      
      // Navigate to export page
      setTimeout(() => {
        setCurrentPage('video-export');
      }, 1000);
    } catch (error) {
      setIsGeneratingVideo(false);
      toast.error('❌ Failed to generate video. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <Header />
      
      {/* Backend Connection Status */}
      {!backendConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-4 mt-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                <strong>Warning:</strong> Backend server is not available. 
                Please make sure the backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
      <StepProgressBar currentStep={currentStep} />

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {currentPage === 'prompt-script' && (
          <PromptScriptPage
            key="prompt-script"
            prompt={prompt}
            tone={tone}
            audience={audience}
            selectedAddons={selectedAddons}
            lectureText={lectureText}
            isGenerating={isGenerating}
            promptChanged={promptChanged}
            hasUnsavedChanges={hasUnsavedChanges}
            isApproved={isApproved}
            onPromptChange={handlePromptChange}
            onToneChange={setTone}
            onAudienceChange={setAudience}
            onAddonsChange={handleAddonsChange}
            onGenerate={handleGenerateText}
            onLectureTextChange={handleLectureTextChange}
            onUpdateFromPrompt={handleUpdateFromPrompt}
            onDismissPromptChange={() => setPromptChanged(false)}
            onSave={handleSave}
            onApprove={handleApprove}
            onClearSavedText={handleClearSavedText}
          />
        )}

        {currentPage === 'avatar-voice' && (
          <AvatarVoicePage
            key="avatar-voice"
            selectedAvatar={selectedAvatar}
            selectedVoice={selectedVoice}
            voiceSpeed={voiceSpeed}
            styleDepth={styleDepth}
            onAvatarChange={setSelectedAvatar}
            onVoiceChange={setSelectedVoice}
            onVoiceSpeedChange={setVoiceSpeed}
            onStyleDepthChange={setStyleDepth}
            onGenerateVideo={handleGenerateVideo}
            isGenerating={isGeneratingVideo}
          />
        )}

        {currentPage === 'video-export' && (
          <VideoExportPage
            key="video-export"
            lectureTitle={prompt}
          />
        )}
      </AnimatePresence>

      {/* Navigation hint (for development - can be removed in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Dev Navigation:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('prompt-script')}
              className={`px-3 py-1 rounded-lg text-xs ${
                currentPage === 'prompt-script' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Prompt
            </button>
            <button
              onClick={() => setCurrentPage('avatar-voice')}
              className={`px-3 py-1 rounded-lg text-xs ${
                currentPage === 'avatar-voice' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Avatar
            </button>
            <button
              onClick={() => setCurrentPage('video-export')}
              className={`px-3 py-1 rounded-lg text-xs ${
                currentPage === 'video-export' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
}