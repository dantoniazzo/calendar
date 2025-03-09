import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addMonths, addWeeks, format } from 'date-fns';
import { Calendar } from './components/Calendar';
import { ThemeToggle } from './components/ThemeToggle';
import { CalendarView } from './types';

export default function App() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<CalendarView>('month');

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/notes/${dateStr}`);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      setCurrentDate(direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? addMonths(currentDate, -1) : addMonths(currentDate, 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="h-[calc(100vh-32px)] sm:h-[calc(100vh-48px)]">
          <Calendar
            currentDate={currentDate}
            view={view}
            onDateSelect={handleDateSelect}
            onNavigate={handleNavigate}
            onViewChange={setView}
            themeToggle={<ThemeToggle />}
          />
        </div>
      </div>
    </div>
  );
}