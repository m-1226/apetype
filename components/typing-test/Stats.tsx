'use client';

import { FloatingPortal } from '@floating-ui/react';
import { useDidUpdate } from '@mantine/hooks';
import { Transition } from 'components/core';
import { useGlobal } from 'context/globalContext';
import { useSettings } from 'context/settingsContext';
import { useTypingTest } from 'context/typingTestContext';
import { motion } from 'framer-motion';
import { useStats } from 'hooks/useStats';
import { twJoin } from 'tailwind-merge';
import { accuracy as acc } from 'utils/typingTest';

export default function Stats() {
  const { setGlobalValues } = useGlobal();
  const {
    mode,
    time,
    words,
    timerProgressStyle,
    statsColor,
    statsOpacity,
    fontSize,
    liveWpm,
    liveAccuracy,
    timerProgress,
  } = useSettings();
  const { wordIndex, currentStats, timer, isTestRunning, setValues } = useTypingTest();
  const { wpm, characters, errors } = currentStats;
  const stats = useStats();
  const accuracy = acc(characters, errors);

  useDidUpdate(() => {
    if (isTestRunning) stats.start();
  }, [isTestRunning]);
  useDidUpdate(() => {
    const timeFinished = mode === 'time' && time > 0 && timer <= 0;
    const wordsFinished = mode === 'words' && words > 0 && wordIndex >= words;
    if (timeFinished || wordsFinished) {
      if (mode !== 'time') stats.update();
      setValues((draft) => void (draft.isTestRunning = false));
      setGlobalValues((draft) => void (draft.isTestFinished = true));
    }
  }, [timer, wordIndex]);

  return (
    <div className='select-none' style={{ height: `${fontSize}rem` }}>
      {isTestRunning && (
        <Transition>
          <motion.div
            className='flex leading-none transition-colors'
            style={{
              gap: `${fontSize * 1.25}rem`,
              color: `var(--${statsColor}-color)`,
              opacity: statsOpacity,
              fontSize: `${fontSize}rem`,
            }}
          >
            {timerProgress && ['text', 'both'].includes(timerProgressStyle) && (
              <div>
                {mode === 'time' ? (
                  Math.abs(timer)
                ) : (
                  <>
                    {wordIndex}
                    {!!words && `/${words}`}
                  </>
                )}
              </div>
            )}
            {liveWpm && <div>{Math.floor(wpm)}</div>}
            {liveAccuracy && <div>{Math.floor(accuracy)}%</div>}
          </motion.div>
        </Transition>
      )}
      <FloatingPortal>
        {isTestRunning && (
          <motion.div
            className={twJoin([
              'fixed inset-x-0 top-0 h-2 transition-colors',
              (!timerProgress || !['bar', 'both'].includes(timerProgressStyle) || time === 0) &&
                '!bg-transparent',
            ])}
            style={{ background: `var(--${statsColor}-color)`, opacity: statsOpacity }}
            initial={{ width: mode === 'time' && time !== 0 ? '100%' : 0 }}
            animate={{
              width:
                mode === 'words'
                  ? `${(wordIndex / words) * 100}%`
                  : `${((timer - 1) / time) * 100}%`,
              transition: {
                width: {
                  duration: mode === 'time' ? 1 : 0.25,
                  ease: mode === 'time' ? 'linear' : 'easeInOut',
                },
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          />
        )}
      </FloatingPortal>
    </div>
  );
}
