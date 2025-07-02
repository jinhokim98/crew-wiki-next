'use client';

import {useRef, useEffect} from 'react';

type InfiniteScrollObserverProps = {
  threshold?: number | number[] | undefined;
  callback: () => void;
};

export const InfiniteScrollObserver = ({callback, threshold = 0.3}: InfiniteScrollObserverProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      {threshold},
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callback, threshold]);

  return <div ref={targetRef} style={{height: 1}} />;
};
