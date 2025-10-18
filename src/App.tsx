import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { StepProgressBar, Step } from './components/StepProgressBar';
import { PromptScriptPage } from './components/pages/PromptScriptPage';
import { AvatarVoicePage } from './components/pages/AvatarVoicePage';
import { VideoExportPage } from './components/pages/VideoExportPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    let generatedText = `# ${prompt}

## Introduction

In this lecture, we will explore the core concepts and working principles. The material is designed for ${audience.toLowerCase()} level learners with a ${tone.toLowerCase()} approach.

## Main Content

The first important point is understanding the fundamental principles. Let's look at several key aspects:

- **Concept 1**: Detailed explanation of the first concept with practical examples
- **Concept 2**: Description of the second important element that builds on the foundation
- **Concept 3**: Third key point for comprehensive understanding of the topic
`;

    // Add code examples if selected
    if (selectedAddons.includes('code examples')) {
      generatedText += `
## Code Examples

\`\`\`javascript
// Practical code example demonstrating the concepts
function demonstrateExample() {
  const result = performCalculation();
  console.log("Example output:", result);
  return result;
}

// Additional example showing implementation
const practicalImplementation = () => {
  // Step-by-step implementation
  const step1 = initialize();
  const step2 = process(step1);
  return finalize(step2);
};
\`\`\`
`;
    }

    // Add visuals if selected
    if (selectedAddons.includes('visuals')) {
      generatedText += `
## Visual Examples

📊 **Diagram 1**: Conceptual overview showing the relationship between key components

🎨 **Illustration 2**: Visual representation of the workflow and process steps

📈 **Chart 3**: Comparison of different approaches and their effectiveness

💡 **Infographic**: Key statistics and important data points visualized

`;
    }

    // Add exercises if selected
    if (selectedAddons.includes('exercises')) {
      generatedText += `
## Practice Exercises

### Exercise 1: Basic Application
Try to apply the concepts learned by solving this problem:
- Task: Implement the basic functionality discussed
- Expected outcome: Working solution demonstrating understanding
- Hints: Review the examples in the Main Content section

### Exercise 2: Advanced Challenge
For those seeking deeper understanding:
- Task: Extend the solution with additional features
- Expected outcome: Enhanced implementation showing mastery
- Bonus: Optimize for performance and scalability

### Exercise 3: Real-World Scenario
Apply your knowledge to a practical situation:
- Context: A common industry problem that requires these concepts
- Task: Design and implement a complete solution
- Deliverable: Documented approach with working code

`;
    }

    // Add Q&A section if selected
    if (selectedAddons.includes('Q&A section')) {
      generatedText += `
## Q&A Section

**Q: What are the most common mistakes beginners make with this topic?**
A: The most frequent errors include misunderstanding the core principles and trying to skip foundational concepts. Always ensure you understand each step before moving forward.

**Q: How can I practice and improve my understanding?**
A: Regular practice with varied examples is key. Try to implement different variations and experiment with the concepts in your own projects.

**Q: What are the real-world applications of these concepts?**
A: These principles are widely used in modern development, from small applications to large-scale systems. Understanding them opens doors to various career opportunities.

**Q: Where can I find additional resources for learning?**
A: Official documentation, community forums, and hands-on tutorials are excellent resources. Focus on practical implementation alongside theoretical understanding.

**Q: How long does it typically take to master this material?**
A: The timeline varies by individual, but with consistent practice, most learners see significant progress within 2-4 weeks. Remember, mastery comes with continuous application.

`;
    }

    generatedText += `
## Summary

In summary, we have covered the main aspects of the topic. This knowledge will help you in further studying the material and applying it in real-world scenarios.

## Key Takeaways

- Review the key concepts covered
- Practice with the provided examples
- Explore additional resources for deeper understanding`;
    
    setLectureText(generatedText);
    setIsGenerating(false);
    setHasUnsavedChanges(false);
    setIsApproved(false);
    
    toast.success('✅ Lecture generated successfully');
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
    setHasUnsavedChanges(false);
    toast.success('Changes saved');
  };

  const handleApprove = () => {
    if (hasUnsavedChanges) {
      toast.error('Please save your changes first');
      return;
    }
    setIsApproved(true);
    toast.success('✓ Script approved');
    
    // Navigate to avatar page after approval
    setTimeout(() => {
      setCurrentPage('avatar-voice');
    }, 1000);
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    
    toast.success('✨ Starting video generation...');
    
    // Simulate video generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGeneratingVideo(false);
    toast.success('✨ Video generated successfully!');
    
    // Navigate to export page
    setTimeout(() => {
      setCurrentPage('video-export');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <Header />

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