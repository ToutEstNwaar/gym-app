import React, { useState, useMemo } from 'react';
import { View } from './types';
import { useWorkoutState } from './hooks/useWorkoutState';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutSessionScreen } from './components/WorkoutSessionScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { HomeIcon, ChartBarIcon, DumbbellIcon, CogIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const workoutState = useWorkoutState();

  const renderView = () => {
    switch (currentView) {
      case View.Home:
        return (
          <HomeScreen
            history={workoutState.history}
            config={workoutState.config}
          />
        );
      case View.Workout:
        return (
          <WorkoutSessionScreen
            workout={workoutState.getTodaysWorkout()}
            targetRir={workoutState.getTargetRir()}
            currentSession={workoutState.currentSession}
            onStartWorkout={workoutState.startWorkout}
            updateSessionExercise={workoutState.updateSessionExercise}
            onFinishWorkout={workoutState.completeWorkout}
            onNavigateHome={() => setCurrentView(View.Home)}
            getLastPerformance={workoutState.getLastPerformance}
            checkDoubleProgression={workoutState.checkDoubleProgression}
            getExerciseWithSubstitutions={workoutState.getExerciseWithSubstitutions}
            setExerciseSubstitution={workoutState.setExerciseSubstitution}
          />
        );
      case View.Progress:
        return <ProgressScreen history={workoutState.combinedHistory} config={workoutState.config} />;
      case View.Settings:
        return <SettingsScreen 
                  config={workoutState.config} 
                  setConfig={workoutState.setConfig}
                />;
      default:
        return null;
    }
  };

  const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    view: View;
  }> = ({ label, icon, view }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${
          isActive ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text-primary'
        }`}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans">
      <main className="pb-20">
        {renderView()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border flex justify-around shadow-lg">
        <NavItem label="Home" icon={<HomeIcon className="w-6 h-6" />} view={View.Home} />
        <NavItem label="Workout" icon={<DumbbellIcon className="w-6 h-6" />} view={View.Workout} />
        <NavItem label="Progress" icon={<ChartBarIcon className="w-6 h-6" />} view={View.Progress} />
        <NavItem label="Settings" icon={<CogIcon className="w-6 h-6" />} view={View.Settings} />
      </nav>
    </div>
  );
};

export default App;