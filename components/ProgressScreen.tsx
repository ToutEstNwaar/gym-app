import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExerciseHistory, AppConfig } from '../types';

interface ProgressScreenProps {
  history: ExerciseHistory[];
  config: AppConfig;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ history, config }) => {
  
  const uniqueExercises = useMemo(() => {
    const allExercises = Object.values(config.workouts).flatMap(w => w.exercises.map(e => ({...e, workout: w.name}))).concat(
        Object.values(config.workouts).flatMap(w => w.exercises.flatMap(e => e.substitutions.map(s => ({...e, ...s, workout: w.name}))))
    );
    return Array.from(new Map(allExercises.map(e => [e.id, e])).values());
  }, [config.workouts]);
  
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(uniqueExercises[0]?.id || '');

  const chartData = useMemo(() => {
    return history
      .filter(h => h.exerciseId === selectedExerciseId)
      .map(h => ({
        date: new Date(h.date).toLocaleDateString('en-CA'), // Using 'en-CA' for YYYY-MM-DD format for sorting
        volume: h.volume,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(h => ({
          ...h,
          date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [history, selectedExerciseId]);
  
  const selectedExercise = uniqueExercises.find(e => e.id === selectedExerciseId);

  return (
    <div className="p-4 md:p-6 text-brand-text-primary space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-brand-text-secondary">Visualize your training volume progression.</p>
      </header>

      <div className="space-y-2">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-brand-text-secondary">
          Select an exercise
        </label>
        <select
          id="exercise-select"
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className="w-full bg-brand-surface border border-brand-border rounded-lg p-3 focus:ring-brand-primary focus:border-brand-primary"
        >
          {uniqueExercises.sort((a,b) => a.name.localeCompare(b.name)).map(exercise => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-brand-surface rounded-xl p-4 shadow-lg h-96">
        {chartData.length > 0 ? (
          <>
          <h2 className="text-xl font-semibold mb-4 text-center">{selectedExercise?.name}</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="date" stroke="#b3b3b3" />
              <YAxis stroke="#b3b3b3" />
              <Tooltip
                contentStyle={{ backgroundColor: '#121212', border: '1px solid #2d2d2d' }}
                labelStyle={{ color: '#e1e1e1' }}
              />
              <Legend />
              <Line type="monotone" dataKey="volume" stroke="#bb86fc" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Volume (kg)" />
            </LineChart>
          </ResponsiveContainer>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-brand-text-secondary">No data for this exercise yet. Complete a workout to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};