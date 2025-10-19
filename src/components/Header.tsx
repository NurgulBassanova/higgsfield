import higgsfieldLogo from '../assets/6cfff50661e1e8c0e0c821c9f14d6bd52c9df5f1.png';
import React from 'react';
export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={higgsfieldLogo} 
            alt="Higgsfield" 
            className="h-8"
          />
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg text-muted-foreground">AI Lecture Generator</h1>
        </div>

        {/* Right Navigation - Removed */}
        <div className="flex items-center gap-3">
          {/* Empty div to maintain layout balance */}
        </div>
      </div>
    </header>
  );
}