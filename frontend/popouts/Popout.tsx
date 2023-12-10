
import { motion } from "framer-motion"
import { useEffect, useRef } from "react";
import { PopoutState, usePopout } from '@/contexts/popout';

const INITIAL_STYLE = { opacity: 0 };
const ANIMATED_STYLE = { opacity: 1 };
const ANIMATION_DURATION = .15;

const SPACE_FROM_EDGE = 15;
export default function Popout({ children, element, options }: {
    children: any;
    element: PopoutState['ref'];
    options: PopoutState['options'];
}) {
    const { close } = usePopout();
    const ref = useRef<HTMLDivElement>(null);
    
    // Closing popout on click outside
    useEffect(() => {
        const handleClickOutside = (e: Event) => {
            // @ts-ignore: this works
            if(ref.current && !ref.current.contains(e.target)) {
                close();
            }
        }

        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, []);

    // Determining popout position
    useEffect(() => {
        if(!ref.current) return;

        const updatePosition = () => {
            if(!ref.current || !element?.current) return;

            const { top: elTop, left: elLeft, width: elWidth, height: elHeight } = element?.current?.getBoundingClientRect();
            const { top: popTop, left: popLeft, width: popWidth, height: popHeight } = ref.current.getBoundingClientRect();

            let top = 0;
            let left = 0;
            switch(options?.position) {
                case 'left':
                    top = elTop;
                    left = elLeft - popWidth - options.distance;
                    break;
                case 'right':
                    top = elTop;
                    left = elLeft + elWidth + options.distance
                    break;
                case 'top':
                    top = elTop - popHeight - options.distance;
                    left = elLeft + elWidth / 2 - popWidth / 2;
                    break;
                case 'bottom':
                    top = elTop + elHeight + options.distance;
                    left = elLeft + elWidth / 2 - popWidth / 2;
                    break;
            }

            if(top < SPACE_FROM_EDGE) {
                top = SPACE_FROM_EDGE;
                left = elLeft - popWidth - options.distance;
            }
            if(top > window.innerHeight - popHeight - SPACE_FROM_EDGE) {
                top = window.innerHeight - popHeight - SPACE_FROM_EDGE;
                console.log(left);
            }
            if(left > window.innerWidth - popWidth) {
                left = window.innerWidth - popWidth - SPACE_FROM_EDGE;
            }
            if(left < 0) {
                left = elLeft + elWidth + options.distance;
            }

            ref.current.style.top = `${top}px`;
            ref.current.style.left = `${left}px`;
        }
        updatePosition();

        new ResizeObserver(updatePosition).observe(ref.current);

        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [options]);

    return(
        <motion.div
            exit={INITIAL_STYLE}
            initial={INITIAL_STYLE}
            animate={ANIMATED_STYLE}
            transition={{ duration: ANIMATION_DURATION }}
            className="z-30 absolute bg-light rounded-lg shadow-centered min-w-[250px] overflow-auto"
            style={{ maxHeight: `calc(100% - ${SPACE_FROM_EDGE * 2}px)` }}
            ref={ref}
        >
            {children}
        </motion.div>
    )
}