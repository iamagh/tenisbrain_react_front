import React, { useState, useEffect } from 'react';

type DialogProps = {
    isOpen: boolean;
    isEdit?: boolean;
    oldData: any;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, isEdit=false, oldData, onClose, onSubmit }) => {
    
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');

    useEffect(()=>{
        if(oldData) {
            setInputValue(oldData.content || '');
            setDescription(oldData.description || '');
        }
    }, [oldData])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // console.log('Submitted:', inputValue);
        // Add your submit logic here
        onSubmit({
            // isEdit: oldData.id,
            id: oldData.id,
            type: oldData.type,
            content: inputValue,
            description: description,
        });

        onClose(); 
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-xl font-semibold mb-4">{`${oldData.id ? 'Edit' : 'Add' } Exercise Content`}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="inputField" className="block text-gray-700 text-sm font-bold mb-2">
                            Content
                        </label>
                        <input
                            id="inputField"
                            type="text"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter something..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="inputField" className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="textarea"
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter something..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </form>

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
