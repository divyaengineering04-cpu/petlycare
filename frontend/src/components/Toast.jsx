import React from 'react';
import { usePetly } from '../context/PetlyContext';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = usePetly();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'danger': return <XCircle className="text-rose-500" size={20} />;
      default: return <Info className="text-indigo-500" size={20} />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
