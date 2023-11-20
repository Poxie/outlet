"use client";
import React, { ReactElement, RefObject, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Popout from '@/popouts/Popout';

type PopoutPosition = 'top' | 'bottom' | 'left' | 'right';
export interface PopoutArgs {
    popout: ReactElement | null;
    ref: RefObject<HTMLElement> | null;
    options?: {
        position?: PopoutPosition;
        distance?: number;
    }
}
export interface PopoutState extends PopoutArgs {
    options: {
        position: PopoutPosition;
        distance: number;
    }
}

const PopoutContext = React.createContext({} as {
    setPopout: (popout: PopoutArgs) => void;
    close: () => void;
});

export const usePopout = () => React.useContext(PopoutContext);

const DEFAULT_POSITION = 'top';
const DEFAULT_DISTANCE = 10;
export const PopoutProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [popout, setPopout] = useState<PopoutState>({
        popout: null,
        ref: null,
        options: {
            position: DEFAULT_POSITION,
            distance: DEFAULT_DISTANCE
        }
    });

    const _setPopout = (args: PopoutArgs) => setPopout({
        ...args,
        options: {
            position: DEFAULT_POSITION,
            distance: DEFAULT_DISTANCE,
            ...args.options,
        }
    })
    const close = () => setPopout({ popout: null, ref: null, options: { position: DEFAULT_POSITION, distance: DEFAULT_DISTANCE} });

    const value = {
        setPopout: _setPopout, 
        close
    }
    return(
        <PopoutContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {popout.popout && popout.ref && (
                    <Popout 
                        element={popout.ref} 
                        options={popout.options}
                    >
                        {popout.popout}
                    </Popout>
                )}
            </AnimatePresence>
        </PopoutContext.Provider>
    )
}