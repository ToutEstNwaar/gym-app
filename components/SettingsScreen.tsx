import React, { useState, useEffect, useMemo } from 'react';
import { AppConfig, Exercise, PeriodizationSettings, Workout } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './IconComponents';
import { DEFAULT_CONFIG } from '../constants';

interface SettingsScreenProps {
    config: AppConfig;
    setConfig: (config: AppConfig) => void;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-brand-surface rounded-lg shadow-md">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">{title}</h2>
                {isOpen ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
            </button>
            {isOpen && <div className="p-4 border-t border-brand-border">{children}</div>}
        </div>
    )
}

const PeriodizationEditor: React.FC<{periodization: PeriodizationSettings, onChange: (newPeriodization: PeriodizationSettings) => void}> = ({ periodization, onChange}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">5-Week Mesocycle RIR Targets</h3>
            {periodization.weeks.map((week, index) => (
                <div key={week.week} className="flex items-center gap-2">
                    <label className="w-16 font-medium">Week {week.week}:</label>
                    <input
                        type="text"
                        value={week.rir}
                        onChange={(e) => {
                            const newWeeks = [...periodization.weeks];
                            newWeeks[index] = { ...newWeeks[index], rir: e.target.value };
                            onChange({ ...periodization, weeks: newWeeks });
                        }}
                        className="w-full bg-brand-bg border border-brand-border rounded-md p-2"
                    />
                </div>
            ))}
             <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">Deload Set Reduction (%):</label>
                <input
                    type="number"
                    value={periodization.deloadSetReduction * 100}
                    onChange={(e) => {
                        onChange({ ...periodization, deloadSetReduction: Number(e.target.value) / 100 });
                    }}
                    className="w-full bg-brand-bg border border-brand-border rounded-md p-2"
                />
            </div>
        </div>
    )
}

const ExerciseEditor: React.FC<{
    exercise: Exercise, 
    onChange: (newExercise: Exercise) => void,
    onDelete: () => void,
    onMove: (direction: 'up' | 'down') => void,
}> = ({ exercise, onChange, onDelete, onMove }) => {
    return (
        <div className="p-3 bg-brand-bg/50 rounded-md space-y-2">
             <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={exercise.name}
                    placeholder="Exercise Name"
                    onChange={e => onChange({...exercise, name: e.target.value})}
                    className="w-full bg-brand-bg border border-brand-border rounded-md p-2 font-semibold"
                />
                <button onClick={() => onMove('up')} className="p-1 hover:bg-brand-border rounded-full">&#9650;</button>
                <button onClick={() => onMove('down')} className="p-1 hover:bg-brand-border rounded-full">&#9660;</button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-400 p-1 text-xl leading-none">&times;</button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <label className="text-xs font-medium text-brand-text-secondary">Sets</label>
                    <input type="number" value={exercise.sets} onChange={e => onChange({...exercise, sets: Number(e.target.value)})} placeholder="Sets" className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-center mt-1" />
                </div>
                <div>
                    <label className="text-xs font-medium text-brand-text-secondary">Reps</label>
                    <input type="text" value={exercise.reps} onChange={e => onChange({...exercise, reps: e.target.value})} placeholder="Reps" className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-center mt-1" />
                </div>
                <div>
                    <label className="text-xs font-medium text-brand-text-secondary">Rest (s)</label>
                    <input type="number" value={exercise.rest} onChange={e => onChange({...exercise, rest: Number(e.target.value)})} placeholder="Rest (s)" className="w-full bg-brand-bg border border-brand-border rounded-md p-2 text-center mt-1" />
                </div>
            </div>
        </div>
    );
}

const WorkoutEditor: React.FC<{workout: Workout, onChange: (newWorkout: Workout) => void}> = ({ workout, onChange }) => {
    
    const handleExerciseChange = (exIndex: number, newExercise: Exercise) => {
        const newExercises = [...workout.exercises];
        newExercises[exIndex] = newExercise;
        onChange({ ...workout, exercises: newExercises });
    };

    const handleExerciseDelete = (exIndex: number) => {
        const newExercises = workout.exercises.filter((_, i) => i !== exIndex);
        onChange({ ...workout, exercises: newExercises });
    };

    const handleExerciseMove = (exIndex: number, direction: 'up' | 'down') => {
        if (direction === 'up' && exIndex === 0) return;
        if (direction === 'down' && exIndex === workout.exercises.length - 1) return;

        const newExercises = [...workout.exercises];
        const targetIndex = direction === 'up' ? exIndex - 1 : exIndex + 1;
        [newExercises[exIndex], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[exIndex]]; // Swap
        onChange({ ...workout, exercises: newExercises });
    };

    const handleAddExercise = () => {
        const newExercise: Exercise = {
            id: `custom_${Date.now()}`,
            name: "New Exercise",
            sets: 3,
            reps: "8-12",
            rest: 120,
            youtubeUrl: '',
            substitutions: []
        };
        onChange({ ...workout, exercises: [...workout.exercises, newExercise] });
    }

    return (
        <div className="space-y-3">
            {workout.exercises.map((ex, i) => (
                <ExerciseEditor 
                    key={ex.id + i} // Use index in key to ensure re-renders on move
                    exercise={ex} 
                    onChange={(newEx) => handleExerciseChange(i, newEx)}
                    onDelete={() => handleExerciseDelete(i)}
                    onMove={(dir) => handleExerciseMove(i, dir)}
                />
            ))}
            <button onClick={handleAddExercise} className="w-full bg-brand-primary/20 text-brand-primary font-semibold py-2 rounded-md hover:bg-brand-primary/30">
                + Add Exercise
            </button>
        </div>
    );
};


export const SettingsScreen: React.FC<SettingsScreenProps> = ({ config, setConfig }) => {
    const [localConfig, setLocalConfig] = useState<AppConfig>(() => JSON.parse(JSON.stringify(config)));

    useEffect(() => {
        setLocalConfig(JSON.parse(JSON.stringify(config)));
    }, [config]);

    const hasChanges = useMemo(() => JSON.stringify(localConfig) !== JSON.stringify(config), [localConfig, config]);

    const handleSaveChanges = () => {
        setConfig(localConfig);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all settings to their original defaults? This cannot be undone.")) {
            const freshDefaults = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            setLocalConfig(freshDefaults);
            setConfig(freshDefaults);
        }
    };
    
    const handleWorkoutChange = (workoutId: string, newWorkout: Workout) => {
        setLocalConfig(prevConfig => ({
            ...prevConfig,
            workouts: {
                ...prevConfig.workouts,
                [workoutId]: newWorkout,
            }
        }));
    };

    const handlePeriodizationChange = (newPeriodization: PeriodizationSettings) => {
        setLocalConfig(prevConfig => ({ ...prevConfig, periodization: newPeriodization }));
    };
    
    return (
        <div className="p-4 md:p-6 text-brand-text-primary space-y-6 pb-28">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-brand-text-secondary">Customize your training protocol.</p>
                </div>
                <button 
                    onClick={handleReset}
                    className="bg-red-500/20 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/30 text-sm">
                    Restore Defaults
                </button>
            </header>

            <Section title="Periodization">
                <PeriodizationEditor periodization={localConfig.periodization} onChange={handlePeriodizationChange} />
            </Section>

            {Object.values(localConfig.workouts).filter(w => w.id !== 'rest').map(workout => (
                <Section key={workout.id} title={workout.name}>
                    <WorkoutEditor workout={workout} onChange={(newWorkout) => handleWorkoutChange(workout.id, newWorkout)} />
                </Section>
            ))}

            {hasChanges && (
                <div className="fixed bottom-20 left-0 right-0 px-4 py-2 bg-brand-bg/80 backdrop-blur-sm z-50">
                    <button 
                        onClick={handleSaveChanges}
                        className="w-full bg-brand-secondary text-brand-bg font-bold py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-brand-secondary/90 transition-colors">
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};