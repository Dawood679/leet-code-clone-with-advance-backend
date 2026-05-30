'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import api from '@/lib/api';

function getWsUrl() {
  if (typeof window === 'undefined') return 'http://localhost:4001';
  return `${window.location.protocol}//${window.location.hostname}:4001`;
}

export function useSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) return;

    const socket = io(`${getWsUrl()}/submissions`, {
      auth: { token },
      transports: ['websocket']
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const submitCode = useCallback(async (problemId, code, language) => {
    setIsSubmitting(true);
    setVerdict({ status: 'PROCESSING' });

    try {
      const { data } = await api.post('/submissions', { problemId, code, language });
      const { submissionId } = data;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          setVerdict({ status: 'RUNTIME_ERROR', error: 'Submission timed out' });
          setIsSubmitting(false);
          resolve(null);
        }, 60000);

        const handler = (result) => {
          if (result.submissionId === submissionId) {
            clearTimeout(timeout);
            socketRef.current?.off('submission:result', handler);
            setVerdict(result);
            setIsSubmitting(false);
            resolve(result);
          }
        };

        if (socketRef.current) {
          socketRef.current.on('submission:result', handler);
        } else {
          clearTimeout(timeout);
          setVerdict({ status: 'RUNTIME_ERROR', error: 'WebSocket not connected' });
          setIsSubmitting(false);
          resolve(null);
        }
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setVerdict({ status: 'RUNTIME_ERROR', error: msg });
      setIsSubmitting(false);
    }
  }, []);

  const resetVerdict = useCallback(() => setVerdict(null), []);

  return { submitCode, isSubmitting, verdict, resetVerdict };
}
