"use client";

import { CheckCircle2, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  txHash?: string;
}

export function SuccessModal({ isOpen, onClose, title, message, txHash }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="text-gray-400 hover:text-white" size={20} />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-500/20 rounded-full">
            <CheckCircle2 className="text-green-400" size={48} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-300 text-center mb-6">
          {message}
        </p>

        {/* Transaction link (if provided) */}
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-3 rounded-xl transition-colors border border-blue-500/30 font-medium"
          >
            View on Explorer →
          </a>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
