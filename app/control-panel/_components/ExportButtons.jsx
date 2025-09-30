"use client";
import { Download, FileText } from 'lucide-react';

const ExportButtons = ({ 
  onExportExcel, 
  onExportPdf, 
  disabled = false,
  resultsCount = 0 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button 
        onClick={onExportExcel} 
        disabled={disabled || resultsCount === 0} 
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Excel
      </button>
      
      <button 
        onClick={onExportPdf} 
        disabled={disabled || resultsCount === 0} 
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
