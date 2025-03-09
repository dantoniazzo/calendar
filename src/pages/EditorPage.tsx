import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function EditorPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  const parsedDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date();
  const formattedDate = format(parsedDate, 'MMMM d, yyyy');
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Calendar
          </button>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {formattedDate}
            </h1>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex-1">
          <iframe
            src="https://simple-editor-gamma.vercel.app"
            className="w-full h-full border-0"
            title="Editor"
          />
        </div>
      </div>
    </div>
  );
}