
import React, { useRef, useState, useEffect } from 'react';
import { LucideX, LucideZap, LucideImage, LucideRefreshCcw } from 'lucide-react';
import { ProductAnalysis, UserProfile } from '../types';
import { useAnalysis } from '../services/useApi';
import { useToast } from '../components/Toast';

interface ScanProps {
  onBack: () => void;
  onScanStart: () => void;
  onAnalysisComplete: (analysis: ProductAnalysis) => void;
  user: UserProfile;
}

export const Scan: React.FC<ScanProps> = ({ onBack, onScanStart, onAnalysisComplete, user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const { analyze, isLoading, error: apiError } = useAnalysis();
  const { showToast } = useToast();

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setCameraReady(true);
      } catch (e: any) {
        const errorMsg = 'Camera access denied. Please enable permissions.';
        setCameraError(errorMsg);
        showToast(errorMsg, 'error');
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [showToast]);
  
  // Show API errors as toasts
  useEffect(() => {
    if (apiError) {
      showToast(apiError.message, 'error');
    }
  }, [apiError, showToast]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    onScanStart();
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const result = await analyze(dataUrl, user);
      
      if (result) {
        showToast('Analysis complete!', 'success');
        onAnalysisComplete(result);
      }
    } catch (e) {
      console.error(e);
      // Error already shown via useEffect
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      onScanStart();
      
      try {
        const result = await analyze(dataUrl, user);
        if (result) {
          showToast('Analysis complete!', 'success');
          onAnalysisComplete(result);
        }
      } catch (err) {
        // Error already shown via useEffect
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col z-50">
      {/* Camera Error Overlay */}
      {cameraError && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="max-w-sm text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <LucideX size={32} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
              <p className="text-sm opacity-60">
                Please enable camera permissions in your browser settings to use the scan feature.
              </p>
            </div>
            <div className="space-y-3">
              <label className="block w-full py-4 bg-blue-600 rounded-2xl font-bold cursor-pointer">
                Upload Photo Instead
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-white/5 rounded-2xl font-bold"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Viewfinder */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="flex-1 object-cover"
      />
      
      {/* Loading overlay when analyzing */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm font-medium">Analyzing...</p>
          </div>
        </div>
      )}
      
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
            disabled={isLoading || !cameraReady}
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
    </div>
  );
};
