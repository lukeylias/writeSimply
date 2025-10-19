import React from "react";

interface HistoryPanelProps {
  files: string[];
  onLoadFile: (fileName: string) => void;
  onDeleteFile: (fileName: string) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  files,
  onLoadFile,
  onDeleteFile,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-6 w-96 max-h-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Saved Sessions</h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:opacity-70 transition-opacity text-lg"
          >
            ×
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No saved sessions found</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file}
                  className="flex justify-between items-center p-3 border border-[var(--border-color)] rounded hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <span className="truncate flex-1">{file}</span>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => onLoadFile(file)}
                      className="cursor-pointer hover:opacity-70 transition-opacity text-sm px-2 py-1 border border-[var(--text-color)] rounded"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDeleteFile(file)}
                      className="cursor-pointer hover:opacity-70 transition-opacity text-sm px-2 py-1 border border-red-500 text-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          {files.length} session(s) found
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;