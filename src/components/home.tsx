import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Camera,
  Award,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
} from "lucide-react";
import WebcamView from "./WebcamView";
import ExerciseSidebar from "./ExerciseSidebar";
import FeedbackPanel from "./FeedbackPanel";
import useExercise from "../hooks/useExercise";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Home = () => {
  // Use the custom exercise hook
  const exercise = useExercise();

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Handle starting exercise with confirmation
  const handleStartExercise = () => {
    setShowConfirmDialog(true);
  };

  // Confirm and start exercise
  const confirmStartExercise = () => {
    setShowConfirmDialog(false);
    exercise.startExercise();
  };

  // Handle pause/resume
  const handlePauseResumeExercise = () => {
    if (exercise.isPaused) {
      exercise.resumeExercise();
    } else {
      exercise.pauseExercise();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[rgb(32,33,39)] text-white overflow-hidden">
      {/* Exercise Sidebar */}
      <div className="w-full md:w-80 p-4 border-r border-gray-700 overflow-y-auto">
        <ExerciseSidebar
          onExerciseSelect={exercise.setSelectedExercise}
          onRepCountChange={exercise.setTargetReps}
          onConfidenceChange={exercise.setDetectionConfidence}
          onStart={handleStartExercise}
          selectedExercise={exercise.selectedExercise}
          repCount={exercise.targetReps}
          confidenceThreshold={exercise.detectionConfidence}
          isExerciseActive={exercise.isExerciseActive}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Webcam View */}
        <div className="flex-1 p-4">
          <WebcamView
            selectedExercise={exercise.selectedExercise}
            totalReps={exercise.targetReps}
            detectionConfidence={exercise.detectionConfidence}
            showCoordinates={true}
            onExerciseComplete={exercise.stopExercise}
            onRepCountChange={(count) => {
              // This is just for the demo - in a real app, the WebcamView would
              // detect reps automatically using pose detection
            }}
          />
        </div>

        {/* Exercise Progress */}
        <div className="p-4 bg-[rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold">Progress</div>
            <div className="text-lg font-bold text-[rgb(24,239,199)]">
              {exercise.repCount} / {exercise.targetReps} reps
            </div>
          </div>
          <Progress value={exercise.progress} className="h-3 bg-gray-700" />

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Activity className="mr-2 text-[rgb(24,239,199)]" />
              <span className="text-lg">
                {exercise.formatTime(exercise.elapsedTime)}
              </span>
            </div>
            <div className="flex gap-2">
              {exercise.isExerciseActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseResumeExercise}
                  className="border-[rgb(24,239,199)] text-[rgb(24,239,199)] hover:bg-[rgba(24,239,199,0.1)]"
                >
                  {exercise.isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" /> Pause
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={
                  exercise.isExerciseActive
                    ? exercise.completeRep
                    : handleStartExercise
                }
                className="border-[rgb(24,239,199)] text-[rgb(24,239,199)] hover:bg-[rgba(24,239,199,0.1)]"
                disabled={exercise.isPaused}
              >
                {exercise.isExerciseActive ? "Simulate Rep" : "Start Exercise"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Panel */}
      <div className="w-full md:w-96 p-4 border-l border-gray-700 overflow-y-auto">
        <FeedbackPanel
          feedbackMessages={exercise.feedbackMessages}
          performanceMetrics={{
            avgTimePerRep: exercise.avgTimePerRep,
            formScore: exercise.formScore,
          }}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[rgb(40,41,47)] text-white border-[rgb(60,61,67)]">
          <DialogHeader>
            <DialogTitle className="text-[rgb(24,239,199)]">
              Start Exercise
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you ready to begin {exercise.selectedExercise} for{" "}
              {exercise.targetReps} reps?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStartExercise}
              className="bg-[rgb(24,239,199)] text-[rgb(32,33,39)] hover:bg-[rgb(24,239,199)]/90"
            >
              Start Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
