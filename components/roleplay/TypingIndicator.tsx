'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex justify-start" data-role="typing">
      <div className="rounded-lg border border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Buyer is typing</span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
