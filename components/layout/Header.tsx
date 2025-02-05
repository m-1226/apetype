'use client';

import { Button, Flex, Text, Tooltip, Transition } from 'components/core';
import { useGlobal } from 'context/globalContext';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiInformationFill,
  RiKeyboardBoxFill,
  RiSettingsFill,
  RiVipCrownFill,
} from 'react-icons/ri';
import LogoIcon from './LogoIcon';

const BUTTONS = [
  { label: 'Home', href: '/', icon: <RiKeyboardBoxFill /> },
  { label: 'Leaderboards', href: '/leaderboards', icon: <RiVipCrownFill /> },
  { label: 'About', href: '/about', icon: <RiInformationFill /> },
  { label: 'Settings', href: '/settings', icon: <RiSettingsFill /> },
];

export default function Header() {
  const { isUserTyping } = useGlobal();
  const router = useRouter();

  return (
    <div className='relative z-10 grid w-full select-none grid-cols-[auto_1fr_auto] gap-3'>
      <Flex
        className='cursor-pointer flex-nowrap font-[family-name:var(--font-lexend-deca)] transition-transform active:translate-y-[2px]'
        onClick={() => router.push('/')}
      >
        <LogoIcon />
        <Transition
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.75 } },
          }}
        >
          <Text className='relative mb-[7px] text-[32px] leading-none' dimmed={isUserTyping}>
            <AnimatePresence>
              {!isUserTyping && (
                <Transition
                  className='absolute left-3 top-[-3px]'
                  variants={{
                    initial: { opacity: 0, x: -30 },
                    animate: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.75,
                        duration: 0.75,
                        type: 'spring',
                        stiffness: 30,
                        damping: 10,
                      },
                    },
                    exit: { opacity: 0 },
                  }}
                >
                  <Text className='text-[10px] leading-none' dimmed>
                    ape see
                  </Text>
                </Transition>
              )}
            </AnimatePresence>
            apetype
          </Text>
        </Transition>
      </Flex>
      <AnimatePresence>
        {!isUserTyping && (
          <Transition
            className='flex items-center gap-1.5'
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { delay: 0.25, duration: 0.5 } },
              exit: { opacity: 0 },
            }}
          >
            {BUTTONS.map(({ label, href, icon }) => (
              <Tooltip key={label} label={label}>
                <Button className='text-xl' component={Link} href={href}>
                  {icon}
                </Button>
              </Tooltip>
            ))}
          </Transition>
        )}
      </AnimatePresence>
    </div>
  );
}
