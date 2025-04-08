import { useState, useEffect } from "react";

interface FeedbackMessage {
  message: string;
  severity: "warning" | "positive";
  timestamp: number;
}

interface ExerciseState {
  selectedExercise: string;
  repCount: number;
  targetReps: number;
  detectionConfidence: number;
  isExerciseActive: boolean;
  isPaused: boolean;
  progress: number;
  elapsedTime: number;
  startTime: number | null;
  pauseTime: number | null;
  totalPausedTime: number;
  formScore: number;
  avgTimePerRep: number;
  repTimes: number[];
  lastRepTime: number | null;
  feedbackMessages: FeedbackMessage[];
}

interface UseExerciseProps {
  initialExercise?: string;
  initialTargetReps?: number;
  initialDetectionConfidence?: number;
}

const useExercise = ({
  initialExercise = "Push-ups",
  initialTargetReps = 10,
  initialDetectionConfidence = 0.7,
}: UseExerciseProps = {}) => {
  const [state, setState] = useState<ExerciseState>({
    selectedExercise: initialExercise,
    repCount: 0,
    targetReps: initialTargetReps,
    detectionConfidence: initialDetectionConfidence,
    isExerciseActive: false,
    isPaused: false,
    progress: 0,
    elapsedTime: 0,
    startTime: null,
    pauseTime: null,
    totalPausedTime: 0,
    formScore: 0,
    avgTimePerRep: 0,
    repTimes: [],
    lastRepTime: null,
    feedbackMessages: [],
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isExerciseActive && !state.isPaused && state.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor(
          (now - state.startTime - state.totalPausedTime) / 1000,
        );
        setState((prev) => ({ ...prev, elapsedTime: elapsed }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    state.isExerciseActive,
    state.isPaused,
    state.startTime,
    state.totalPausedTime,
  ]);

  const setSelectedExercise = (exercise: string) => {
    setState((prev) => ({ ...prev, selectedExercise: exercise }));
  };

  const setTargetReps = (reps: number) => {
    setState((prev) => ({ ...prev, targetReps: reps }));
  };

  const setDetectionConfidence = (confidence: number) => {
    setState((prev) => ({ ...prev, detectionConfidence: confidence }));
  };

  const startExercise = () => {
    setState((prev) => ({
      ...prev,
      isExerciseActive: true,
      isPaused: false,
      startTime: Date.now(),
      repCount: 0,
      progress: 0,
      elapsedTime: 0,
      totalPausedTime: 0,
      repTimes: [],
      lastRepTime: Date.now(),
      feedbackMessages: [
        {
          message: `Starting ${prev.selectedExercise}. Get ready!`,
          severity: "positive",
          timestamp: Date.now(),
        },
      ],
    }));
  };

  const pauseExercise = () => {
    setState((prev) => ({
      ...prev,
      isPaused: true,
      pauseTime: Date.now(),
    }));
  };

  const resumeExercise = () => {
    setState((prev) => {
      const additionalPausedTime = prev.pauseTime
        ? Date.now() - prev.pauseTime
        : 0;
      return {
        ...prev,
        isPaused: false,
        pauseTime: null,
        totalPausedTime: prev.totalPausedTime + additionalPausedTime,
      };
    });
  };

  const stopExercise = () => {
    setState((prev) => {
      // Calculate final metrics
      let finalFormScore = prev.formScore;
      let finalAvgTimePerRep = prev.avgTimePerRep;

      if (prev.repTimes.length > 0) {
        const avgTime =
          prev.repTimes.reduce((a, b) => a + b, 0) / prev.repTimes.length;
        finalAvgTimePerRep = parseFloat(avgTime.toFixed(1));
      }

      // Set final form score (in a real app this would be calculated based on form analysis)
      finalFormScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100 for demo

      return {
        ...prev,
        isExerciseActive: false,
        isPaused: false,
        startTime: null,
        pauseTime: null,
        formScore: finalFormScore,
        avgTimePerRep: finalAvgTimePerRep,
        feedbackMessages: [
          ...prev.feedbackMessages,
          {
            message: `Congratulations! You've completed ${prev.repCount} ${prev.selectedExercise}!`,
            severity: "positive",
            timestamp: Date.now(),
          },
        ],
      };
    });
  };

  const completeRep = () => {
    if (!state.isExerciseActive || state.isPaused || !state.lastRepTime) return;

    setState((prev) => {
      const newRepCount = prev.repCount + 1;
      const newProgress = Math.min(100, (newRepCount / prev.targetReps) * 100);

      // Calculate time for this rep
      const now = Date.now();
      const repTime = (now - (prev.lastRepTime || 0)) / 1000;
      const newRepTimes = [...prev.repTimes, repTime];
      const avgTime =
        newRepTimes.reduce((a, b) => a + b, 0) / newRepTimes.length;

      // Generate feedback based on rep performance
      let newFeedback: FeedbackMessage[] = [...prev.feedbackMessages];

      if (repTime < 1.5) {
        newFeedback.push({
          message: "You're going too fast! Slow down for proper form.",
          severity: "warning",
          timestamp: Date.now(),
        });
      } else if (repTime > 4) {
        newFeedback.push({
          message: "Good control on the slow movement!",
          severity: "positive",
          timestamp: Date.now(),
        });
      } else {
        newFeedback.push({
          message: "Good pace! Keep it up.",
          severity: "positive",
          timestamp: Date.now(),
        });
      }

      return {
        ...prev,
        repCount: newRepCount,
        progress: newProgress,
        repTimes: newRepTimes,
        lastRepTime: now,
        avgTimePerRep: parseFloat(avgTime.toFixed(1)),
        feedbackMessages: newFeedback,
      };
    });

    // Check if exercise is complete
    if (state.repCount + 1 >= state.targetReps) {
      stopExercise();
    }
  };

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    ...state,
    setSelectedExercise,
    setTargetReps,
    setDetectionConfidence,
    startExercise,
    pauseExercise,
    resumeExercise,
    stopExercise,
    completeRep,
    formatTime,
  };
};

export default useExercise;
