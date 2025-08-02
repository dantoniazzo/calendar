import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
} from "date-fns";
import { CalendarView } from "../types";

interface CalendarProps {
  currentDate: Date;
  view: CalendarView;
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onViewChange: (view: CalendarView) => void;
  themeToggle: React.ReactNode;
}

export function Calendar({
  currentDate,
  view,
  onDateSelect,
  onNavigate,
  onViewChange,
  themeToggle,
}: CalendarProps) {
  const renderWeekView = () => {
    const start = startOfWeek(currentDate);
    return (
      <div className="h-full grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = addDays(start, index);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className={`flex flex-col items-center justify-center p-1 sm:p-2 border dark:border-gray-700 rounded-lg cursor-pointer transition-colors
                ${
                  isCurrentDay
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }
                dark:bg-gray-800 dark:text-gray-200
              `}
            >
              <div className="text-center">
                <div className="text-sm sm:text-base font-semibold">
                  {format(date, "EEE")}
                </div>
                <div className="text-lg sm:text-2xl mt-1">
                  {format(date, "d")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startWeek = startOfWeek(start);
    const days = [];
    let day = startWeek;

    while (day <= end || days.length % 7 !== 0) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = [
      { key: "sun", label: "S" },
      { key: "mon", label: "M" },
      { key: "tue", label: "T" },
      { key: "wed", label: "W" },
      { key: "thu", label: "T" },
      { key: "fri", label: "F" },
      { key: "sat", label: "S" },
    ];

    return (
      <div className="grid grid-rows-[auto_1fr] h-full">
        <div className="grid grid-cols-7">
          {weekDays.map(({ key, label }) => (
            <div
              key={key}
              className="text-center font-semibold py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);

            return (
              <div
                key={index}
                onClick={() => onDateSelect(date)}
                className={`flex flex-col items-center justify-center p-1 sm:p-2 border dark:border-gray-700 rounded-lg cursor-pointer transition-colors
                  ${
                    !isCurrentMonth
                      ? "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500"
                      : "dark:bg-gray-800 dark:text-gray-200"
                  }
                  ${
                    isCurrentDay
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-lg sm:text-2xl">{format(date, "d")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("prev")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange("week")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
              view === "week"
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange("month")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
              view === "month"
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            }`}
          >
            Month
          </button>
          {themeToggle}
        </div>
      </div>
      <div className="flex-1 min-h-0 pb-4">
        {view === "week" ? renderWeekView() : renderMonthView()}
      </div>
    </div>
  );
}
