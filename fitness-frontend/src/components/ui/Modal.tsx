import React from "react";
import type {ModalMode} from "../../types/ModalMode.ts";

interface ModalProps {
    key: string;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ onClose, title, children }: ModalProps) => {
    // if (state === 'CLOSED') return null; // We can get rid of the open tool since we use enum states to determine modal opening

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-lg font-semibold mb-4">{title}</h2>

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
