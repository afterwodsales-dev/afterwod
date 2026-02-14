import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Cargando...' }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-text-secondary">
            <Loader2 className="animate-spin mb-4 text-accent-color" size={48} />
            <p className="text-sm uppercase font-bold tracking-wide">{message}</p>
        </div>
    );
}
