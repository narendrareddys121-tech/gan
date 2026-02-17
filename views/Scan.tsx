
import React, { useRef, useState, useEffect } from 'react';
import { LucideX, LucideZap, LucideImage, LucideRefreshCcw, LucideLayers, LucideCheckCircle2 } from 'lucide-react';
import { analyzeProduct } from '../services/geminiService';
import { ProductAnalysis, UserProfile } from '../types';

interface ScanProps {
  onBack: () => void;
  onScanStart: () => void;
  onAnalysisComplete: (analysis: ProductAnalysis) => void;
  user: UserProfile;
}

export const Scan: React.FC<ScanProps> = ({ onBack, onScanStart, onAnalysisComplete, user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [batchMode, setBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState<string[]>([]);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (e) {
        setError('Camera access denied. Please enable permissions.');
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  // Simulate AI confidence detection
  useEffect(() => {
    if (!isAnalyzing) {
      const interval = setInterval(() => {
        const randomConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%
        setAiConfidence(randomConfidence);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

    if (batchMode) {
      // Add to batch queue
      setBatchQueue(prev => [...prev, dataUrl]);
      // Show success feedback
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 bg-white/30 z-[100] pointer-events-none animate-fade-in';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 200);
    } else {
      // Single scan mode
      setIsAnalyzing(true);
      onScanStart();
      
      try {
        const result = await analyzeProduct(dataUrl, user);
        onAnalysisComplete(result);
      } catch (e) {
        console.error(e);
        setError('Analysis failed. Try again.');
        setIsAnalyzing(false);
      }
    }
  };

  const processBatch = async () => {
    if (batchQueue.length === 0) return;
    
    setIsAnalyzing(true);
    onScanStart();
    
    try {
      // For demo, just analyze the first one
      const result = await analyzeProduct(batchQueue[0], user);
      onAnalysisComplete(result);
      setBatchQueue([]);
      setBatchMode(false);
    } catch (e) {
      console.error(e);
      setError('Batch analysis failed. Try again.');
      setIsAnalyzing(false);
    }
  };

  const cancelBatch = () => {
    setBatchQueue([]);
    setBatchMode(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setIsAnalyzing(true);
      onScanStart();
      try {
        const result = await analyzeProduct(dataUrl, user);
        onAnalysisComplete(result);
      } catch (err) {
        setError('Analysis failed.');
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col z-50">
      {/* Viewfinder */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="flex-1 object-cover"
      />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        {/* Top Bar */}
        <div className="p-6 flex justify-between items-start pointer-events-auto">
          <button 
            onClick={onBack} 
            className="p-3 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all"
          >
            <LucideX className="text-white" size={20} />
          </button>
          
          <div className="flex flex-col items-end gap-3">
            {/* AI Vision Status */}
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">AI Active</span>
            </div>
            
            {/* AI Confidence Indicator */}
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full transition-all ${
                      i < Math.floor(aiConfidence / 20) ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-white">{aiConfidence}%</span>
            </div>

            {/* Batch Mode Indicator */}
            {batchMode && (
              <div className="bg-blue-600/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                <LucideLayers size={14} className="text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Batch: {batchQueue.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scanning Frame */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full aspect-square max-w-sm border-2 border-white/30 rounded-3xl relative overflow-hidden">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
            
            {/* Dashed Border */}
            <div className="absolute inset-0 border-[2px] border-dashed border-white/20 animate-pulse rounded-3xl"></div>
            
            {/* Scan Line Animation */}
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scan-line shadow-lg shadow-blue-500/50"
              style={{ top: '0%' }}
            ></div>

            {/* Detection Hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
                <p className="text-xs text-white font-semibold">
                  {aiConfidence >= 85 ? 'Perfect alignment!' : 'Center the label'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-8 pointer-events-auto">
          {/* Batch Mode Controls */}
          {batchMode && batchQueue.length > 0 && (
            <div className="mb-6 flex gap-3 justify-center">
              <button 
                onClick={cancelBatch}
                className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-sm hover:bg-white/20 transition-all"
              >
                Cancel Batch
              </button>
              <button 
                onClick={processBatch}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                <LucideCheckCircle2 size={18} />
                Process {batchQueue.length} Item{batchQueue.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-around">
            {/* Upload Image */}
            <label className="p-4 rounded-full bg-white/10 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all active:scale-90">
              <LucideImage className="text-white" size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
            
            {/* Capture Button */}
            <button 
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className="relative w-20 h-20 rounded-full bg-white border-8 border-white/20 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <LucideZap size={28} className="text-white fill-current" />
              </div>
            </button>

            {/* Batch Mode Toggle */}
            <button 
              onClick={() => setBatchMode(!batchMode)}
              className={`p-4 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                batchMode ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <LucideLayers className="text-white" size={24} />
            </button>
          </div>

          {/* Batch Mode Helper Text */}
          {batchMode && (
            <p className="text-center text-xs text-white/60 mt-4">
              Batch mode active: Capture multiple products, then process all at once
            </p>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Error Toast */}
      {error && (
        <div className="absolute top-24 left-6 right-6 p-4 bg-red-500/90 backdrop-blur-md text-white rounded-2xl text-sm font-medium z-50 flex justify-between items-center animate-slide-in-down">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-3 font-bold hover:opacity-70 transition-opacity">✕</button>
        </div>
      )}
    </div>
  );
};
