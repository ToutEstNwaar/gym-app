import React, { useState, useEffect, useRef } from 'react';
import { Exercise, ExerciseHistory, SetLog, Workout } from '../types';
import { YouTubeIcon, ChevronDownIcon } from './IconComponents';

// --- Timer Component ---
const Timer: React.FC<{ initialTime: number; onFinish: () => void }> = ({ initialTime, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, onFinish]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-brand-primary text-brand-bg font-bold rounded-full shadow-lg z-50 flex items-center gap-4 py-3 px-6">
      <span className="text-2xl">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
      <button onClick={onFinish} className="text-sm bg-brand-bg/20 text-brand-text-primary rounded-full px-3 py-1 hover:bg-brand-bg/40 transition-colors">
        Skip
      </button>
    </div>
  );
};

// --- ExerciseCard Component ---
interface ExerciseCardProps {
  exercise: Exercise;
  sets: SetLog[];
  targetRir: string;
  lastPerformance?: ExerciseHistory;
  shouldSuggestWeightIncrease: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onSetsUpdate: (sets: SetLog[]) => void;
  onSetComplete: (restTime: number, isLastSet: boolean) => void;
  setExerciseSubstitution: (originalId: string, subId: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
    exercise, 
    sets,
    targetRir, 
    lastPerformance, 
    shouldSuggestWeightIncrease,
    isExpanded,
    onToggleExpanded,
    onSetsUpdate,
    onSetComplete,
    setExerciseSubstitution
}) => {

  const handleSetChange = (setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newSets = sets.map((s, i) => i === setIndex ? { ...s, [field]: Number(value) } : s);
    onSetsUpdate(newSets);
  };
  
  const handleSetComplete = (setIndex: number) => {
    const newSets = sets.map((s, i) => i === setIndex ? { ...s, completed: true } : s);
    onSetsUpdate(newSets);
    const areAllSetsComplete = newSets.every(s => s.completed);
    onSetComplete(exercise.rest, areAllSetsComplete);
  };
  
  return (
    <div id={`exercise-${exercise.id}`} className="bg-brand-surface rounded-xl shadow-lg overflow-hidden scroll-mt-4">
        <button onClick={onToggleExpanded} className="w-full flex justify-between items-center p-4 bg-brand-surface hover:bg-brand-border/20">
            <h2 className="text-xl font-bold text-left">{exercise.name}</h2>
            <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

      {isExpanded && (
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap justify-between items-center text-sm text-brand-text-secondary">
          <span className="font-semibold">{exercise.sets} sets x {exercise.reps} reps</span>
          <span>{targetRir}</span>
          <a href={exercise.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-500 hover:text-red-400">
            <YouTubeIcon className="w-5 h-5" /> Form
          </a>
        </div>
        
        {lastPerformance && (
          <div className="text-xs text-brand-text-secondary bg-brand-bg/50 p-2 rounded-md">
            Last time: {lastPerformance.sets.map(s => `${s.weight}kg x ${s.reps}`).join(', ')}
          </div>
        )}
        {shouldSuggestWeightIncrease && (
             <div className="text-sm font-semibold text-brand-secondary bg-brand-primary/10 p-2 rounded-md">
                Suggestion: Increase the weight!
            </div>
        )}
        
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-bg text-brand-text-secondary font-bold text-sm">{set.set}</span>
              <input
                type="number"
                placeholder="kg"
                className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-center"
                value={set.weight || ''}
                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                disabled={set.completed}
              />
              <span className="text-brand-text-secondary">x</span>
              <input
                type="number"
                placeholder="reps"
                className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-center"
                value={set.reps || ''}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                disabled={set.completed}
              />
              <button
                onClick={() => handleSetComplete(index)}
                disabled={set.completed}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${set.completed ? 'bg-green-500/50 text-white' : 'bg-brand-primary text-brand-bg hover:bg-brand-primary/80'}`}
              >
                {set.completed ? 'Done' : 'Log'}
              </button>
            </div>
          ))}
        </div>
        
        {exercise.substitutions.length > 0 && (
            <div className="pt-2">
                <select 
                    onChange={(e) => setExerciseSubstitution(exercise.id, e.target.value)}
                    className="w-full text-xs bg-brand-bg border border-brand-border rounded-md p-1"
                    defaultValue=""
                >
                    <option value="" disabled>Substitute exercise...</option>
                    {exercise.substitutions.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
            </div>
        )}
      </div>
      )}
    </div>
  );
};


// --- WorkoutSessionScreen Component ---
interface WorkoutSessionScreenProps {
  workout: Workout;
  targetRir: string;
  currentSession: ExerciseHistory[] | null;
  onFinishWorkout: () => void;
  onStartWorkout: () => void;
  updateSessionExercise: (exerciseHistory: ExerciseHistory) => void;
  getLastPerformance: (exerciseId: string) => ExerciseHistory | undefined;
  checkDoubleProgression: (exerciseId: string, repRange: string) => boolean;
  getExerciseWithSubstitutions: (exercise: Exercise) => Exercise;
  setExerciseSubstitution: (originalId: string, subId: string) => void;
  onNavigateHome: () => void;
}

export const WorkoutSessionScreen: React.FC<WorkoutSessionScreenProps> = ({ 
    workout, 
    targetRir, 
    currentSession,
    onFinishWorkout, 
    onStartWorkout,
    updateSessionExercise,
    getLastPerformance, 
    checkDoubleProgression,
    getExerciseWithSubstitutions,
    setExerciseSubstitution,
    onNavigateHome
}) => {
  const [activeTimer, setActiveTimer] = useState<{ time: number; exerciseId: string; isLastSet: boolean; } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerKeyRef = useRef(0);
  
  const firstExerciseId = workout.exercises.length > 0 ? getExerciseWithSubstitutions(workout.exercises[0]).id : '';
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set(firstExerciseId ? [firstExerciseId] : []));

  const toggleExerciseExpanded = (exerciseId: string) => {
    setExpandedExercises(prev => {
        const newSet = new Set(prev);
        if (newSet.has(exerciseId)) {
            newSet.delete(exerciseId);
        } else {
            newSet.add(exerciseId);
        }
        return newSet;
    });
  };

  const handleSetsUpdate = (exercise: Exercise, newSets: SetLog[]) => {
    const volume = newSets.reduce((acc, curr) => acc + (curr.weight * curr.reps), 0);
    updateSessionExercise({
      exerciseId: exercise.id,
      name: exercise.name,
      date: new Date().toISOString(),
      sets: newSets,
      volume,
      targetRir,
    });
  };

  const handleSetComplete = (originalExercise: Exercise, isLastSetForExercise: boolean) => {
    const isLastExerciseInWorkout = workout.exercises[workout.exercises.length - 1]?.id === originalExercise.id;
    
    // Don't start a timer after the last set of the very last exercise.
    if (isLastSetForExercise && isLastExerciseInWorkout) {
      return;
    }
    
    const currentExercise = getExerciseWithSubstitutions(originalExercise);
    timerKeyRef.current += 1;
    setActiveTimer({
      time: currentExercise.rest,
      exerciseId: currentExercise.id,
      isLastSet: isLastSetForExercise,
    });
  };

  const handleFinish = () => {
    onFinishWorkout();
    setIsCompleted(true);
  }
  
  const handleTimerFinish = () => {
    const lastTimerDetails = activeTimer;
    setActiveTimer(null);
    if (!lastTimerDetails) return;

    if (lastTimerDetails.isLastSet) {
      const currentId = lastTimerDetails.exerciseId;
      const currentIdx = workout.exercises.findIndex(e => getExerciseWithSubstitutions(e).id === currentId);
      const nextIdx = currentIdx + 1;
      
      if (nextIdx < workout.exercises.length) {
        const nextExercise = getExerciseWithSubstitutions(workout.exercises[nextIdx]);
        
        // Collapse current, expand next
        setExpandedExercises(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentId);
          newSet.add(nextExercise.id);
          return newSet;
        });

        // Scroll after state has had a chance to update
        setTimeout(() => {
          document.getElementById(`exercise-${nextExercise.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };


  // "Workout Completed" View
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-brand-text-primary text-center">
        <div className="w-full max-w-md bg-brand-surface rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary">Workout Complete!</h1>
          <p className="text-brand-text-secondary text-lg">Great job. Your session has been logged.</p>
          <button
              onClick={onNavigateHome}
              className="w-full bg-brand-primary text-brand-bg font-bold py-3 px-6 rounded-lg text-lg
                         transform transition-transform duration-200 hover:scale-105 focus:outline-none 
                         focus:ring-4 focus:ring-brand-primary/50 shadow-lg hover:shadow-brand-primary/20"
            >
              Back to Home
            </button>
        </div>
      </div>
    );
  }

  // "Not Started" View
  if (currentSession === null) {
    const isRestDay = workout.id === 'rest';
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-brand-text-primary text-center">
        <div className="w-full max-w-md bg-brand-surface rounded-2xl shadow-lg p-8 space-y-6">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Today: {workout.name}</h1>
            <p className="text-brand-text-secondary text-lg">{workout.description}</p>
          </header>
          {isRestDay ? (
             <div className="text-center py-8">
               <p className="text-xl">Enjoy your rest day!</p>
             </div>
          ) : (
            <button
              onClick={onStartWorkout}
              className="w-full bg-brand-primary text-brand-bg font-bold py-4 px-8 rounded-lg text-2xl
                         transform transition-transform duration-200 hover:scale-105 focus:outline-none 
                         focus:ring-4 focus:ring-brand-primary/50 shadow-lg hover:shadow-brand-primary/20"
            >
              Start Workout
            </button>
          )}
        </div>
      </div>
    );
  }

  // "In Progress" View
  return (
    <div className="p-4 md:p-6 text-brand-text-primary space-y-6 pb-32">
      <header className="text-center">
        <h1 className="text-3xl font-bold">{workout.name}</h1>
        <p className="text-brand-text-secondary">{workout.description}</p>
      </header>

      <div className="space-y-4">
        {workout.exercises.map((ex) => {
          const exercise = getExerciseWithSubstitutions(ex);
          const exerciseLogInSession = currentSession.find(e => e.exerciseId === exercise.id);
          const lastPerformance = getLastPerformance(exercise.id);

          const initialSets = Array.from({ length: exercise.sets }, (_, i) => ({
            set: i + 1,
            weight: lastPerformance?.sets[i]?.weight || 0,
            reps: 0,
            completed: false
          }));

          return (
             <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                sets={exerciseLogInSession?.sets || initialSets}
                targetRir={targetRir}
                lastPerformance={lastPerformance}
                shouldSuggestWeightIncrease={checkDoubleProgression(exercise.id, exercise.reps)}
                isExpanded={expandedExercises.has(exercise.id)}
                onToggleExpanded={() => toggleExerciseExpanded(exercise.id)}
                onSetsUpdate={(newSets) => handleSetsUpdate(exercise, newSets)}
                onSetComplete={(_restTime, isLastSet) => handleSetComplete(ex, isLastSet)}
                setExerciseSubstitution={setExerciseSubstitution}
            />
          );
        })}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 py-2 bg-brand-bg/80 backdrop-blur-sm">
        <button 
          onClick={handleFinish}
          className="w-full bg-brand-secondary text-brand-bg font-bold py-3 px-6 rounded-lg text-lg">
            End Workout
        </button>
      </div>

      {activeTimer && (
        <Timer 
          key={timerKeyRef.current}
          initialTime={activeTimer.time} 
          onFinish={handleTimerFinish} 
        />
      )}
    </div>
  );
};