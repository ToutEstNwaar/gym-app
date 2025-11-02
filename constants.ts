
import { Workout, WorkoutNode, AppConfig } from './types';

export const WORKOUT_SCHEDULE: WorkoutNode[] = [
  { day: 1, workoutId: 'push_a' },
  { day: 2, workoutId: 'pull_a' },
  { day: 3, workoutId: 'legs_a' },
  { day: 4, workoutId: 'push_b' },
  { day: 5, workoutId: 'pull_b' },
  { day: 6, workoutId: 'legs_b' },
  { day: 7, workoutId: 'rest' },
];

export const DEFAULT_WORKOUTS: Record<string, Workout> = {
  push_a: {
    id: 'push_a',
    name: 'PUSH A',
    description: 'Chest & Front Delt Emphasis',
    exercises: [
      { id: 'incline_barbell_press', name: 'Incline Barbell Press', sets: 3, reps: '6-8', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=incline+barbell+press+form', substitutions: [{ id: 'incline_smith_machine_press', name: 'Incline Smith Machine Press' }, { id: 'incline_machine_press', name: 'Incline Machine Press' }] },
      { id: 'flat_dumbbell_press', name: 'Flat Dumbbell Press', sets: 3, reps: '8-12', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=flat+dumbbell+press+form', substitutions: [{ id: 'flat_barbell_press', name: 'Flat Barbell Press' }, { id: 'dips_weighted', name: 'Dips (Weighted)' }] },
      { id: 'seated_dumbbell_shoulder_press', name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '8-12', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press+form', substitutions: [{ id: 'machine_shoulder_press', name: 'Machine Shoulder Press' }, { id: 'arnold_press', name: 'Arnold Press' }] },
      { id: 'cable_crossover_high_low', name: 'Cable Crossover (High-to-Low)', sets: 3, reps: '12-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=cable+crossover+high+to+low+form', substitutions: [] },
      { id: 'dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=dumbbell+lateral+raise+form', substitutions: [{ id: 'cable_lateral_raise', name: 'Cable Lateral Raise' }] },
      { id: 'rope_tricep_pushdown', name: 'Rope Tricep Pushdown', sets: 3, reps: '10-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=rope+tricep+pushdown+form', substitutions: [] },
      { id: 'incline_dumbbell_overhead_ext', name: 'Incline Dumbbell Overhead Ext.', sets: 3, reps: '10-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+overhead+extension+form', substitutions: [] },
    ]
  },
  pull_a: {
    id: 'pull_a',
    name: 'PULL A',
    description: 'Back Width & Lats Emphasis',
    exercises: [
      { id: 'pullups_lat_pulldowns', name: 'Pull-Ups or Lat Pulldowns', sets: 3, reps: '6-10', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=pull+ups+lat+pulldowns+form', substitutions: [{ id: 'close_grip_pulldown', name: 'Close Grip Pulldown' }, { id: 'weighted_chin_up', name: 'Weighted Chin-Up' }] },
      { id: 'barbell_bent_over_row', name: 'Barbell Bent-Over Row', sets: 3, reps: '8-10', rest: 180, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+bent+over+row+form', substitutions: [{ id: 'chest_supported_row', name: 'Chest-Supported Row' }, { id: 'seated_cable_row', name: 'Seated Cable Row' }] },
      { id: 'single_arm_dumbbell_row', name: 'Single-Arm Dumbbell Row', sets: 3, reps: '8-12', rest: 120, youtubeUrl: 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form', substitutions: [] },
      { id: 'straight_arm_cable_pulldown', name: 'Straight-Arm Cable Pulldown', sets: 3, reps: '12-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=straight+arm+cable+pulldown+form', substitutions: [] },
      { id: 'incline_dumbbell_curl', name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+curl+form', substitutions: [] },
      { id: 'hammer_curls', name: 'Hammer Curls', sets: 3, reps: '10-12', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=hammer+curls+form', substitutions: [] },
    ]
  },
  legs_a: {
    id: 'legs_a',
    name: 'LEGS A',
    description: 'Quads & Glutes Emphasis',
    exercises: [
      { id: 'barbell_back_squat', name: 'Barbell Back Squat', sets: 3, reps: '6-10', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+back+squat+form', substitutions: [{ id: 'hack_squat', name: 'Hack Squat' }, { id: 'leg_press', name: 'Leg Press' }] },
      { id: 'barbell_hip_thrust', name: 'Barbell Hip Thrust', sets: 3, reps: '8-12', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+hip+thrust+form', substitutions: [] },
      { id: 'leg_press', name: 'Leg Press', sets: 3, reps: '10-15', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=leg+press+form', substitutions: [{ id: 'hack_squat', name: 'Hack Squat' }] },
      { id: 'seated_leg_curls', name: 'Seated Leg Curls', sets: 3, reps: '10-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=seated+leg+curls+form', substitutions: [{ id: 'lying_leg_curls', name: 'Lying Leg Curls' }] },
      { id: 'leg_extensions', name: 'Leg Extensions', sets: 3, reps: '12-20', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=leg+extensions+form', substitutions: [] },
      { id: 'standing_calf_raises', name: 'Standing Calf Raises', sets: 4, reps: '10-15', rest: 60, youtubeUrl: 'https://www.youtube.com/results?search_query=standing+calf+raises+form', substitutions: [{ id: 'seated_calf_raises', name: 'Seated Calf Raises' }] },
    ]
  },
  push_b: {
    id: 'push_b',
    name: 'PUSH B',
    description: 'Shoulders & Upper Chest Emphasis',
    exercises: [
      { id: 'overhead_press_barbell', name: 'Overhead Press (Barbell)', sets: 3, reps: '6-10', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=overhead+press+barbell+form', substitutions: [{ id: 'machine_shoulder_press', name: 'Machine Shoulder Press' }, { id: 'arnold_press', name: 'Arnold Press' }] },
      { id: 'incline_dumbbell_press_30_45', name: 'Incline Dumbbell Press (30-45°)', sets: 3, reps: '8-12', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+form', substitutions: [{ id: 'incline_barbell_press', name: 'Incline Barbell Press' }] },
      { id: 'lean_away_cable_lateral_raise', name: 'Lean-Away Cable Lateral Raise', sets: 4, reps: '12-20', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=lean+away+cable+lateral+raise+form', substitutions: [{ id: 'dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise' }] },
      { id: 'seated_machine_fly', name: 'Seated Machine Fly (Pec Deck)', sets: 3, reps: '12-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=seated+machine+fly+pec+deck+form', substitutions: [] },
      { id: 'ez_bar_skullcrusher', name: 'EZ Bar Skullcrusher', sets: 3, reps: '10-12', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=ez+bar+skullcrusher+form', substitutions: [] },
      { id: 'single_arm_reverse_grip_pushdown', name: 'Single-Arm Reverse Grip Pushdown', sets: 3, reps: '12-15', rest: 60, youtubeUrl: 'https://www.youtube.com/results?search_query=single+arm+reverse+grip+pushdown+form', substitutions: [] },
    ]
  },
  pull_b: {
    id: 'pull_b',
    name: 'PULL B',
    description: 'Back Thickness & Rear Delts Emphasis',
    exercises: [
      { id: 'barbell_romanian_deadlift', name: 'Barbell Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+romanian+deadlift+rdl+form', substitutions: [{ id: 'dumbbell_rdl', name: 'Dumbbell RDL' }, { id: 'good_mornings', name: 'Good Mornings' }] },
      { id: 'chest_supported_row', name: 'Chest-Supported Row (Machine/DB)', sets: 3, reps: '10-12', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=chest+supported+row+form', substitutions: [{ id: 'barbell_bent_over_row', name: 'Barbell Bent-Over Row' }] },
      { id: 'close_grip_lat_pulldown', name: 'Close-Grip Lat Pulldown', sets: 3, reps: '10-12', rest: 120, youtubeUrl: 'https://www.youtube.com/results?search_query=close+grip+lat+pulldown+form', substitutions: [{ id: 'pullups_lat_pulldowns', name: 'Pull-Ups or Lat Pulldowns' }] },
      { id: 'reverse_pec_deck', name: 'Reverse Pec Deck', sets: 4, reps: '15-20', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=reverse+pec+deck+form', substitutions: [{ id: 'face_pulls', name: 'Face Pulls' }] },
      { id: 'ez_bar_bicep_curl', name: 'EZ Bar Bicep Curl', sets: 3, reps: '10-12', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=ez+bar+bicep+curl+form', substitutions: [] },
      { id: 'barbell_shrugs', name: 'Barbell Shrugs', sets: 3, reps: '12-15', rest: 60, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+shrugs+form', substitutions: [] },
    ]
  },
  legs_b: {
    id: 'legs_b',
    name: 'LEGS B',
    description: 'Posterior Chain & Hamstring Emphasis',
    exercises: [
      { id: 'barbell_romanian_deadlift_2', name: 'Barbell Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rest: 210, youtubeUrl: 'https://www.youtube.com/results?search_query=barbell+romanian+deadlift+rdl+form', substitutions: [{ id: 'dumbbell_rdl', name: 'Dumbbell RDL' }, { id: 'good_mornings', name: 'Good Mornings' }] },
      { id: 'hack_squat_or_leg_press', name: 'Hack Squat or Leg Press', sets: 3, reps: '10-15', rest: 150, youtubeUrl: 'https://www.youtube.com/results?search_query=hack+squat+leg+press+form', substitutions: [{ id: 'barbell_back_squat', name: 'Barbell Back Squat' }] },
      { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', sets: 3, reps: '8-12', rest: 120, youtubeUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form', substitutions: [] },
      { id: 'lying_leg_curls', name: 'Lying Leg Curls', sets: 3, reps: '12-15', rest: 90, youtubeUrl: 'https://www.youtube.com/results?search_query=lying+leg+curls+form', substitutions: [{ id: 'seated_leg_curls', name: 'Seated Leg Curls' }] },
      { id: 'hip_adduction_machine', name: 'Hip Adduction Machine', sets: 2, reps: '15-20', rest: 60, youtubeUrl: 'https://www.youtube.com/results?search_query=hip+adduction+machine+form', substitutions: [] },
      { id: 'seated_calf_raises', name: 'Seated Calf Raises', sets: 4, reps: '15-20', rest: 60, youtubeUrl: 'https://www.youtube.com/results?search_query=seated+calf+raises+form', substitutions: [{ id: 'standing_calf_raises', name: 'Standing Calf Raises' }] },
    ]
  },
  rest: {
    id: 'rest',
    name: 'REST DAY',
    description: 'Recovery & Growth',
    exercises: []
  }
};

export const DEFAULT_PERIODIZATION = {
  weeks: [
    { week: 1, rir: 'RIR 3' },
    { week: 2, rir: 'RIR 2' },
    { week: 3, rir: 'RIR 1' },
    { week: 4, rir: 'RIR 0-1' },
    { week: 5, rir: 'RIR 3-4 (Deload)' },
  ],
  deloadSetReduction: 0.5,
};

export const DEFAULT_CONFIG: AppConfig = {
  workouts: DEFAULT_WORKOUTS,
  periodization: DEFAULT_PERIODIZATION,
};