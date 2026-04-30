'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type VoiceState = 'idle' | 'talking' | 'listening' | 'thinking' | 'error';

interface VoiceEngineOptions {
  onSpeechEnd?: (text: string) => void;
}

export function useVoiceEngine({ onSpeechEnd }: VoiceEngineOptions = {}) {
  const [state, setState] = useState<VoiceState>('idle');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);        
  const transcriptRef = useRef('');
  const [transcript, setTranscript] = useState(''); 

  const onSpeechEndRef = useRef(onSpeechEnd);      
  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition(); 
      recognitionRef.current = recognition;        
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState('listening');
      };

      recognition.onresult = (event: any) => {     
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript) 
          .join('');

        transcriptRef.current = currentTranscript; 
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {      
        if (event.error === 'no-speech') {
          setState('idle');
        } else {
          console.error('Speech recognition error:', event.error);
          setState('error');
        }
      };

      recognition.onend = () => {
        setState((prev) => {
          if (prev === 'listening') {
            const finalTranscript = transcriptRef.current;
            if (finalTranscript && onSpeechEndRef.current) {
              onSpeechEndRef.current(finalTranscript);
              return 'thinking';
            }
            return 'idle';
          }
          return prev;
        });
      };

      recognition.onservicebreak = () => {
        console.warn('Speech recognition service break');
        setState('idle');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {       
    if (recognitionRef.current) {
      transcriptRef.current = '';
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start skipped:', err);
      }
    }
  }, []);

  const stopListening = useCallback(() => {        
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    state,
    setState,
    startListening,
    stopListening,
    isSupported,
    transcript
  };
}
