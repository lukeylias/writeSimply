import React from "react";

interface HistoryPanelProps {
    files: string[];
    onLoadFile: (fileName: string) => void;
    onDeleteFile: (fileName: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
    files,
    onLoadFile,
    onDeleteFile,
    onClose,
    isOpen,
}) => {
    return (
        <>
            {/* Sliding panel only - no overlay */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-[var(--background)] border-l border-[var(--border-color)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--background)]">
                    <h2 className="text-lg font-semibold">Saved Sessions</h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {files.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No saved sessions found</p>
                    ) : (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div
                                    key={file}
                                    className="flex justify-between items-center p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-bg)] transition-all duration-200"
                                >
                                    <span
                                        className="truncate flex-1 text-sm cursor-pointer hover:text-[var(--accent-color)] transition-colors"
                                        onClick={() => onLoadFile(file)}
                                        title={file}
                                    >
                                        {file}
                                    </span>
                                    <div className="flex gap-2 ml-3">
                                        <button
                                            onClick={() => onLoadFile(file)}
                                            className="cursor-pointer hover:bg-[var(--accent-color)] hover:text-white transition-colors text-xs px-3 py-1 border border-[var(--border-color)] rounded"
                                        >
                                            Load
                                        </button>
                                        <button
                                            onClick={() => onDeleteFile(file)}
                                            className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors text-xs px-3 py-1 border border-red-400 text-red-400 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 text-sm text-gray-500 border-t border-[var(--border-color)] bg-[var(--background)] flex justify-between items-center">
                    {files.length} session(s) found
                    <button
                        onClick={onClose}
                        className="cursor-pointer hover:bg-[var(--hover-bg)] w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg"
                    >
                        ×
                    </button>
                </div>
            </div>
        </>
    );
};

export default HistoryPanel;