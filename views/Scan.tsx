
import React, { useRef, useState, useEffect } from 'react';
import { LucideX, LucideZap, LucideImage, LucideRefreshCcw } from 'lucide-react';
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

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    onScanStart();
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const result = await analyzeProduct(dataUrl, user);
      onAnalysisComplete(result);
    } catch (e) {
      console.error(e);
      setError('Analysis failed. Try again.');
      setIsAnalyzing(false);
    }
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
        <div className="p-6 flex justify-between items-start pointer-events-auto">
          <button onClick={onBack} className="p-2 rounded-full bg-black/40 backdrop-blur-md">
            <LucideX className="text-white" />
          </button>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">AI Vision Active</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full aspect-square border-2 border-white/30 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 border-[2px] border-dashed border-white/20 animate-pulse"></div>
            {/* Scan Line Animation */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent scan-line"
              style={{ top: '0%' }}
            ></div>
          </div>
        </div>

        <div className="p-10 flex items-center justify-around pointer-events-auto">
          <label className="p-4 rounded-full bg-white/10 backdrop-blur-md cursor-pointer">
            <LucideImage className="text-white" size={24} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
          
          <button 
            onClick={captureAndAnalyze}
            disabled={isAnalyzing}
            className="w-20 h-20 rounded-full bg-white border-8 border-white/20 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
              <LucideZap size={28} className="text-white fill-current" />
            </div>
          </button>

          <button className="p-4 rounded-full bg-white/10 backdrop-blur-md">
            <LucideRefreshCcw className="text-white" size={24} />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {error && (
        <div className="absolute top-20 left-6 right-6 p-4 bg-red-500/90 text-white rounded-2xl text-sm font-medium z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}
    </div>
  );
};
