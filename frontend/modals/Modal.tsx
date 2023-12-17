import { useScreenSize } from '@/hooks/useScreenSize';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export default function Modal({ children }: {
    children: React.ReactNode;
}) {
    const screenSize = useScreenSize();
    const isSmall = ['xs'].includes(screenSize);
    return(
        <motion.div
            exit={{ scale: isSmall ? 1 : .7, opacity: isSmall ? 1 : 0, translateY: isSmall ? '100dvh' : 0 }}
            initial={{ scale: isSmall ? 1 : .7, opacity: isSmall ? 1 : 0, translateY: isSmall ? '100dvh' : 0 }}
            animate={{ scale: 1, opacity: 1, translateY: 0 }}
            transition={{ duration: .2, ease: 'easeInOut' }}
            className="fixed z-30 top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none"
        >
            <div className={twMerge(
                "h-full sm:h-[unset] sm:w-[600px] sm:max-w-main max-h-full overflow-auto pointer-events-auto bg-light sm:rounded-lg",
                isSmall && 'w-full flex flex-col justify-between'
            )}>
                {children}
            </div>
        </motion.div>
    )
}