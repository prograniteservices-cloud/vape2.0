'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [errorMessage, setError] = useState<string>('');

    const startScanner = async () => {
        setStatus('scanning');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setStatus('error');
            setError('Could not access camera. Please check permissions.');
        }
    };

    useEffect(() => {
        startScanner();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Placeholder for scanning logic
    const handleManualScan = () => {
        onScan('123456789012'); // Mock barcode
        setStatus('success');
        setTimeout(onClose, 1500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                        <Camera size={18} className="text-primary" />
                        <h2 className="text-lg font-bold text-white">Barcode Scanner</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/60">
                        <X size={20} />
                    </button>
                </div>

                <div className="relative aspect-square bg-black overflow-hidden">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-primary/50 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                            
                            {/* Scanning line animation */}
                            <motion.div 
                                animate={{ top: ['10%', '90%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={64} className="text-primary animate-bounce" />
                                <span className="text-white font-bold text-xl">Barcode Detected!</span>
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                            >
                                <X size={64} className="text-red-500 mb-2" />
                                <span className="text-white font-bold">{errorMessage}</span>
                                <button 
                                    onClick={onClose}
                                    className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm"
                                >
                                    Go Back
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 bg-zinc-900/80 text-center">
                    <p className="text-white/60 text-sm mb-4">
                        Position the barcode within the frame to scan automatically.
                    </p>
                    <button 
                        onClick={handleManualScan}
                        className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/80 transition-colors"
                    >
                        Mock Scan Success
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
