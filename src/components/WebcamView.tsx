import React, { useState, useRef, useEffect } from "react";
import { Camera, Play, Pause, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WebcamViewProps {
  selectedExercise?: string;
  totalReps?: number;
  detectionConfidence?: number;
  showCoordinates?: boolean;
  onExerciseComplete?: () => void;
  onRepCountChange?: (count: number) => void;
}

const WebcamView = ({
  selectedExercise = "Push-ups",
  totalReps = 10,
  detectionConfidence = 0.7,
  showCoordinates = true,
  onExerciseComplete = () => {},
  onRepCountChange = () => {},
}: WebcamViewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize webcam
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraPermission(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraPermission(false);
        setError("Camera access denied. Please enable camera permissions.");
      }
    };

    initializeCamera();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = window.setInterval(() => {
        setElapsedTime(
          Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000),
        );
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, elapsedTime]);

  // Simulate rep counting (in a real app, this would use pose detection)
  useEffect(() => {
    if (isActive && repCount < totalReps) {
      const interval = setInterval(() => {
        if (repCount < totalReps) {
          const newCount = repCount + 1;
          setRepCount(newCount);
          onRepCountChange(newCount);
          setProgress((newCount / totalReps) * 100);

          if (newCount >= totalReps) {
            setIsActive(false);
            onExerciseComplete();
          }
        }
      }, 3000); // Simulate a rep every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, repCount, totalReps, onExerciseComplete, onRepCountChange]);

  const toggleExercise = () => {
    if (!isActive) {
      // Reset if starting a new session
      setRepCount(0);
      setProgress(0);
      setElapsedTime(0);
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Render pose detection overlay (placeholder)
  const renderPoseOverlay = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // This is a placeholder for actual pose detection
        // In a real implementation, this would use a library like TensorFlow.js or MediaPipe
        if (showCoordinates) {
          ctx.fillStyle = "rgba(24, 239, 199, 0.7)";
          ctx.strokeStyle = "rgb(24, 239, 199)";
          ctx.lineWidth = 2;

          // Draw some placeholder joints
          const joints = [
            { x: 320, y: 100 }, // head
            { x: 320, y: 150 }, // neck
            { x: 320, y: 220 }, // torso
            { x: 280, y: 180 }, // left shoulder
            { x: 360, y: 180 }, // right shoulder
            { x: 250, y: 220 }, // left elbow
            { x: 390, y: 220 }, // right elbow
            { x: 230, y: 260 }, // left wrist
            { x: 410, y: 260 }, // right wrist
            { x: 300, y: 300 }, // left hip
            { x: 340, y: 300 }, // right hip
            { x: 290, y: 380 }, // left knee
            { x: 350, y: 380 }, // right knee
            { x: 290, y: 450 }, // left ankle
            { x: 350, y: 450 }, // right ankle
          ];

          // Draw joints
          joints.forEach((joint, index) => {
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, 8, 0, 2 * Math.PI);
            ctx.fill();

            if (showCoordinates) {
              ctx.fillStyle = "white";
              ctx.font = "10px Arial";
              ctx.fillText(
                `id:${index} (${joint.x},${joint.y})`,
                joint.x + 10,
                joint.y,
              );
              ctx.fillStyle = "rgba(24, 239, 199, 0.7)";
            }
          });

          // Draw connections
          ctx.beginPath();
          ctx.moveTo(joints[0].x, joints[0].y); // head to neck
          ctx.lineTo(joints[1].x, joints[1].y);
          ctx.lineTo(joints[2].x, joints[2].y); // neck to torso

          ctx.moveTo(joints[1].x, joints[1].y); // neck to shoulders
          ctx.lineTo(joints[3].x, joints[3].y); // left shoulder
          ctx.lineTo(joints[5].x, joints[5].y); // left elbow
          ctx.lineTo(joints[7].x, joints[7].y); // left wrist

          ctx.moveTo(joints[1].x, joints[1].y);
          ctx.lineTo(joints[4].x, joints[4].y); // right shoulder
          ctx.lineTo(joints[6].x, joints[6].y); // right elbow
          ctx.lineTo(joints[8].x, joints[8].y); // right wrist

          ctx.moveTo(joints[2].x, joints[2].y); // torso to hips
          ctx.lineTo(joints[9].x, joints[9].y); // left hip
          ctx.lineTo(joints[11].x, joints[11].y); // left knee
          ctx.lineTo(joints[13].x, joints[13].y); // left ankle

          ctx.moveTo(joints[2].x, joints[2].y);
          ctx.lineTo(joints[10].x, joints[10].y); // right hip
          ctx.lineTo(joints[12].x, joints[12].y); // right knee
          ctx.lineTo(joints[14].x, joints[14].y); // right ankle

          ctx.stroke();
        }
      }
    }
  };

  // Call renderPoseOverlay in animation frame
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      renderPoseOverlay();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isActive && cameraPermission) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, cameraPermission, showCoordinates]);

  return (
    <div className="w-full bg-[rgb(32,33,39)] rounded-xl overflow-hidden">
      <div className="relative w-full">
        {/* Camera view */}
        <div className="relative aspect-video max-h-[600px] overflow-hidden bg-black">
          {cameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgb(32,33,39)] text-white p-4 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
              <p>
                {error ||
                  "Please enable camera access to use the AI Fitness Trainer."}
              </p>
            </div>
          )}

          {cameraPermission === null && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgb(32,33,39)] text-white">
              <div className="animate-pulse flex items-center">
                <Camera size={24} className="mr-2" />
                <span>Initializing camera...</span>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full"
          />

          {/* Exercise info overlay */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
            <p className="font-medium">{selectedExercise}</p>
          </div>

          {/* Rep counter overlay */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
            <p className="text-xl font-bold">
              {repCount} / {totalReps}
            </p>
          </div>

          {/* Timer overlay */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
            <p className="font-medium">{formatTime(elapsedTime)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3">
          <Progress value={progress} className="h-2 bg-gray-700" />
        </div>

        {/* Controls */}
        <div className="px-4 pb-4 flex justify-between items-center">
          <div className="text-white">
            <p className="text-sm opacity-80">
              Detection Confidence: {detectionConfidence}
            </p>
          </div>

          <Button
            onClick={toggleExercise}
            className="bg-[rgb(24,239,199)] hover:bg-[rgb(24,239,199)]/90 text-black font-medium px-6"
          >
            {isActive ? (
              <>
                <Pause size={18} className="mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                {repCount > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Exercise metrics */}
      <Card className="mt-4 bg-[rgb(32,33,39)] border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-[rgb(40,41,47)] p-3 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Avg Time/Rep</p>
              <p className="text-[rgb(24,239,199)] text-xl font-bold">
                {repCount > 0 ? (elapsedTime / repCount).toFixed(1) : "0.0"}s
              </p>
            </div>
            <div className="bg-[rgb(40,41,47)] p-3 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Form Score</p>
              <p className="text-[rgb(24,239,199)] text-xl font-bold">85%</p>
            </div>
            <div className="bg-[rgb(40,41,47)] p-3 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Calories</p>
              <p className="text-[rgb(24,239,199)] text-xl font-bold">
                {Math.round(repCount * 0.35)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebcamView;
