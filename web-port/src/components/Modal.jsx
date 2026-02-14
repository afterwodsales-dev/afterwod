import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div className="relative bg-sidebar-color border-t md:border border-border-color rounded-t-[20px] md:rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up md:animate-fade-in">
                <div className="p-4 md:p-6 border-b border-border-color flex justify-between items-center bg-card-bg">
                    <h3 className="text-xl md:text-2xl font-header uppercase text-accent-color truncate pr-4">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-text-secondary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
