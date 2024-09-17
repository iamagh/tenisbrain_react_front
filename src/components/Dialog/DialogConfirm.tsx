import React, { useState, useEffect } from 'react';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import ButtonSecondary from 'shared/Button/ButtonSecondary';

type DialogProps = {
    isOpen: boolean;
    title: string;
    description: string;
    color: string;
    onClose: () => void;
    onSubmit: () => any;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, title, description, color = "red", onClose, onSubmit }) => {

    const handleClose = () => {
        // console.log('Submitted:', inputValue);
        // Add your submit logic here
        // onSubmit({
        //     // isEdit: oldData.id,
        //     id: oldData.id,
        //     type: oldData.type,
        //     content: inputValue,
        //     description: description,
        // });
        onSubmit();
        onClose(); 
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-xl font-semibold mb-4">{title || 'Do you close Account?'}</h2>
                <h3 className={`bg-${color}-200 text-xl text-${color}-400 p-4 mb-4`}>{description || 'If you close account, then you will get lost all informations.'}</h3>
                <div className="flex justify-end gap-4">
                    <ButtonPrimary
                        type="submit"
                        onClick={handleClose}
                    >
                        Confirm
                    </ButtonPrimary>
                    <ButtonSecondary
                        onClick={onClose}
                        type="submit"
                    >
                        Cancel
                    </ButtonSecondary>
                </div>
                <button className="absolute top-0 right-0 mt-4 mr-4" onClick={onClose}>
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    ): null;
};

export default Dialog;
