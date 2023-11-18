"use client";

import React, { ReactNode, useCallback, useState } from 'react';
import Modal from '../../modals/Modal';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

type ModalContextType = {
    setModal: (modal: ReactNode) => void;
    pushModal: (modal: ReactNode) => void;
    goBack: () => void;
    close: () => void;
    canGoBack: boolean;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = React.useContext(ModalContext);
    if(!context) throw new Error('Modal context is not wrapped in provider.');

    return context;
}

const TRANSITION_DURATION = 300;
export const ModalProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [modals, setModals] = useState<ReactNode[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const _setModal: ModalContextType['setModal'] = useCallback(modal => {
        setModals([modal]);
        document.body.style.overflow = 'hidden';
    }, [setModals]);

    const _pushModal: ModalContextType['pushModal'] = useCallback(modal => {
        setModals(prev => [...prev, ...[modal]]);
        setActiveIndex(prev => prev + 1);
    }, [setModals]);

    const _goBack: ModalContextType['goBack'] = useCallback(() => {
        setActiveIndex(prev => {
            if(prev <= 0) return prev;
            return prev - 1;
        })
        setTimeout(() => {
            setModals(prev => {
                if(prev.length <= 1) return prev;
                const newModals = [...prev];
                newModals.pop();
                return newModals;
            })
        }, TRANSITION_DURATION);
    }, [setModals, setActiveIndex]);

    const close = useCallback(() => {
        setModals([]);
        setActiveIndex(0);
        document.body.style.overflow = '';
    }, []);

    const value = {
        setModal: _setModal,
        pushModal: _pushModal,
        goBack: _goBack,
        canGoBack: modals.length > 1,
        close,
    }
    return(
        <ModalContext.Provider value={value}>
            {children}

            <AnimatePresence mode="wait">
                {modals.length && (
                    <Modal key={activeIndex}>
                        {modals[activeIndex]}
                    </Modal>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {modals.length && (
                    <motion.div 
                        className={"fixed bg-black/50 w-full h-full top-0 left-0 z-20"}
                        transition={{ duration: .2 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                    />
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    )
}