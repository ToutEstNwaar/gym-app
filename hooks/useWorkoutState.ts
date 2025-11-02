import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AppConfig, ExerciseHistory, Workout, Exercise } from '../types';
import { WORKOUT_SCHEDULE, DEFAULT_CONFIG, DEFAULT_WORKOUTS } from '../constants';

const APP_STATE_KEY = 'aestheticsArchitectState';
const APP_CONFIG_KEY = 'aestheticsArchitectConfig';

const getInitialState = (): AppState => {
  const savedState = localStorage.getItem(APP_STATE_KEY);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return { ...parsedState, currentSession: null };
  }
  return {
    startDate: new Date().toISOString().split('T')[0],
    currentDay: 1,
    history: [],
    exerciseSubstitutions: {},
    currentSession: null,
  };
};

const getInitialConfig = (): AppConfig => {
  const savedConfig = localStorage.getItem(APP_CONFIG_KEY);
  return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
}

export const useWorkoutState = () => {
  const [appState, setAppState] = useState<AppState>(getInitialState);
  const [config, setConfig] = useState<AppConfig>(getInitialConfig);

  useEffect(() => {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  const { startDate, history, exerciseSubstitutions, currentSession } = appState;

  const daysSinceStart = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  const effectiveDay = (daysSinceStart % 7) + 1;

  const currentWeek = Math.floor(daysSinceStart / 7) % 5 + 1;
  
  const combinedHistory = useMemo(() => {
      return [...history, ...(currentSession || [])];
  }, [history, currentSession]);

  const getTargetRir = useCallback(() => {
    return config.periodization.weeks.find(w => w.week === currentWeek)?.rir || 'N/A';
  }, [currentWeek, config.periodization]);

  const getTodaysWorkout = useCallback((): Workout => {
    const scheduleEntry = WORKOUT_SCHEDULE.find(w => w.day === effectiveDay);
    const workout = config.workouts[scheduleEntry?.workoutId || 'rest'];
    
    if (currentWeek === 5) { // Deload week logic
      const deloadExercises = workout.exercises.map(ex => ({
        ...ex,
        sets: Math.ceil(ex.sets * (1 - config.periodization.deloadSetReduction))
      }));
      return { ...workout, exercises: deloadExercises };
    }
    return workout;
  }, [effectiveDay, currentWeek, config.workouts, config.periodization]);
  
  const startWorkout = () => {
      setAppState(prev => ({ ...prev, currentSession: [] }));
  };

  const updateSessionExercise = (exerciseHistory: ExerciseHistory) => {
      setAppState(prev => {
          if (!prev.currentSession) return prev;
          const newSession = [...prev.currentSession];
          const index = newSession.findIndex(e => e.exerciseId === exerciseHistory.exerciseId);
          if (index > -1) {
              newSession[index] = exerciseHistory;
          } else {
              newSession.push(exerciseHistory);
          }
          return { ...prev, currentSession: newSession };
      });
  };

  const completeWorkout = () => {
    setAppState(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          history: [...prev.history, ...prev.currentSession],
          currentSession: null,
        }
    });
  };

  const getLastPerformance = (exerciseId: string): ExerciseHistory | undefined => {
    return [...history].reverse().find(h => h.exerciseId === exerciseId);
  };
  
  const checkDoubleProgression = (exerciseId: string, repRange: string): boolean => {
    const lastPerf = getLastPerformance(exerciseId);
    if (!lastPerf) return false;

    const [, maxRepsStr] = repRange.split('-');
    const maxReps = maxRepsStr ? parseInt(maxRepsStr, 10) : 0;
    
    if (isNaN(maxReps) || maxReps === 0) return false;

    const allSetsAtMaxReps = lastPerf.sets.every(set => set.reps >= maxReps);
    return allSetsAtMaxReps;
  };
  
  const getExerciseWithSubstitutions = (exercise: Exercise): Exercise => {
     const subId = exerciseSubstitutions[exercise.id];
     if (!subId) return exercise;

     const findSubInWorkouts = (id: string): Exercise | undefined => {
        for(const workout of Object.values(DEFAULT_WORKOUTS)) {
            const found = workout.exercises.find(e => e.id === id);
            if(found) return found;
             for(const ex of workout.exercises){
                 const subFound = ex.substitutions.find(s => s.id === id)
                 if(subFound) return { ...ex, id: subFound.id, name: subFound.name, substitutions: []};
             }
        }
        return undefined;
     }
     
     const subDetails = findSubInWorkouts(subId);
     return subDetails ? { ...subDetails, substitutions: exercise.substitutions } : exercise;
  };

  const setExerciseSubstitution = (originalId: string, subId: string) => {
      setAppState(prev => ({
          ...prev,
          exerciseSubstitutions: {
              ...prev.exerciseSubstitutions,
              [originalId]: subId
          }
      }))
  };

  const resetConfig = () => {
    if (window.confirm("Are you sure you want to reset all settings to their original defaults? This cannot be undone.")) {
      // Deep copy to prevent mutating the default object reference
      setConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    }
  };

  return {
    currentDay: effectiveDay,
    currentWeek,
    getTargetRir,
    getTodaysWorkout,
    completeWorkout,
    history,
    combinedHistory,
    getLastPerformance,
    checkDoubleProgression,
    getExerciseWithSubstitutions,
    setExerciseSubstitution,
    currentSession,
    startWorkout,
    updateSessionExercise,
    config,
    setConfig,
  };
};