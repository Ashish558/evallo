import { useEffect } from 'react';

export const useDisableBodyScroll = (modalOpen) => {
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [modalOpen])
};
