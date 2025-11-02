import React, { useState, useMemo } from 'react';
import { ExerciseHistory, AppConfig } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

const CalendarHeader: React.FC<{
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}> = ({ currentDate, onPrevMonth, onNextMonth }) => (
  <div className="flex items-center justify-between mb-4">
    <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-brand-border">
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
    <h2 className="text-xl font-bold">
      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
    </h2>
    <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-brand-border">
      <ChevronRightIcon className="w-6 h-6" />
    </button>
  </div>
);

const CalendarGrid: React.FC<{
  currentDate: Date;
  history: ExerciseHistory[];
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}> = ({ currentDate, history, onDateClick, selectedDate }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  const workoutDays = useMemo(() => new Set(
    history.map(h => new Date(h.date).toDateString())
  ), [history]);

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="font-semibold text-xs text-brand-text-secondary">{day}</div>
      ))}
      {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
      {days.map(day => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = date.toDateString() === new Date().toDateString();
        const hasWorkout = workoutDays.has(date.toDateString());
        const isSelected = selectedDate?.toDateString() === date.toDateString();

        return (
          <button
            key={day}
            onClick={() => onDateClick(date)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors
              ${isSelected ? 'bg-brand-primary text-brand-bg' : ''}
              ${!isSelected && isToday ? 'bg-brand-secondary/30' : ''}
              ${!isSelected ? 'hover:bg-brand-border' : ''}
            `}
          >
            <span className={`relative ${hasWorkout ? "font-bold after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-brand-secondary" : ''}`}>
              {day}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const WorkoutDetails: React.FC<{ workoutHistory: ExerciseHistory[], config: AppConfig }> = ({ workoutHistory, config }) => {
    if (workoutHistory.length === 0) {
        return <p className="text-brand-text-secondary text-center mt-6">No workout logged for this day.</p>;
    }
    
    const workoutId = Object.keys(config.workouts).find(id => config.workouts[id].exercises.some(ex => ex.id === workoutHistory[0].exerciseId));
    const workoutName = workoutId ? config.workouts[workoutId].name : "Workout";

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-2xl font-bold text-center">{workoutName}</h3>
            <div className="space-y-3 bg-brand-bg/50 p-4 rounded-lg">
                {workoutHistory.map(item => (
                    <div key={item.exerciseId}>
                        <p className="font-semibold text-brand-secondary">{item.name}</p>
                        <p className="text-sm text-brand-text-secondary">
                            {item.sets.map(s => `${s.weight}kg x ${s.reps} reps`).join(' | ')}
                        </p>
                        <p className="text-xs text-brand-text-secondary/70">Volume: {item.volume}kg</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface HomeScreenProps {
  history: ExerciseHistory[];
  config: AppConfig;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ history, config }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const selectedDayHistory = useMemo(() => {
    if (!selectedDate) return [];
    return history.filter(h => new Date(h.date).toDateString() === selectedDate.toDateString());
  }, [history, selectedDate]);

  return (
    <div className="flex flex-col items-center justify-start h-full p-4 md:p-6 text-brand-text-primary">
      <div className="w-full max-w-md bg-brand-surface rounded-2xl shadow-lg p-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
        />
        <CalendarGrid 
          currentDate={currentDate} 
          history={history} 
          onDateClick={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>
      {selectedDate && <WorkoutDetails workoutHistory={selectedDayHistory} config={config} />}
    </div>
  );
};