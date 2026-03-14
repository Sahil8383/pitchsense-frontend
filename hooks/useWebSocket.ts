'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getWsUrl } from '@/lib/api/config';
import type { AnalyticsUpdate } from '@/lib/types';

export type WebSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

/**
 * Subscribe to live analytics for a session. Connect to WS, send subscribe event with sessionId.
 * Returns latest analytics and connection status. Stub: full implementation when building roleplay view.
 */
export function useWebSocket(sessionId: string | null) {
  const [analytics, setAnalytics] = useState<AnalyticsUpdate | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
    setAnalytics(null);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const url = getWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;
    const t = setTimeout(() => setStatus('connecting'), 0);

    ws.onopen = () => {
      clearTimeout(t);
      setStatus('connected');
      ws.send(JSON.stringify({ event: 'subscribe', data: { sessionId } }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string);
        if (payload.event === 'analytics' && payload.data) {
          setAnalytics(payload.data as AnalyticsUpdate);
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => setStatus('disconnected');
    ws.onerror = () => setStatus('error');

    return () => {
      clearTimeout(t);
      ws.close();
      wsRef.current = null;
      setStatus('disconnected');
      setAnalytics(null);
    };
  }, [sessionId]);

  return { analytics, status, reconnect };
}
