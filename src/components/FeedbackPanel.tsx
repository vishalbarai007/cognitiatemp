import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, AlertTriangle } from "lucide-react";

interface FeedbackMessage {
  message: string;
  severity: "warning" | "positive";
  timestamp: number;
}

interface PerformanceMetric {
  label: string;
  value: string | number;
  previousValue?: string | number;
}

interface FeedbackPanelProps {
  feedbackMessages?: FeedbackMessage[];
  performanceMetrics?: {
    avgTimePerRep?: number;
    formScore?: number;
  };
}

const FeedbackPanel = ({
  feedbackMessages = [
    {
      message: "Keep body straight! Hips too high",
      severity: "warning",
      timestamp: Date.now() - 2000,
    },
    {
      message: "Good form! Keep it up",
      severity: "positive",
      timestamp: Date.now() - 1000,
    },
    {
      message: "Uneven arms! Adjust your hand positions",
      severity: "warning",
      timestamp: Date.now(),
    },
  ],
  performanceMetrics = {
    avgTimePerRep: 2.5,
    formScore: 85,
  },
}: FeedbackPanelProps) => {
  // Filter out messages older than 5 seconds
  const currentTime = Date.now();
  const activeMessages = feedbackMessages
    .filter((msg) => currentTime - msg.timestamp < 5000)
    .slice(-3); // Only show last 3 messages

  // Format metrics for display
  const metrics: PerformanceMetric[] = [
    {
      label: "Avg Time/Rep",
      value: `${performanceMetrics.avgTimePerRep?.toFixed(1)}s`,
    },
    {
      label: "Form Score",
      value: `${performanceMetrics.formScore}%`,
    },
  ];

  // Calculate form score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-full h-full bg-[rgb(32,33,39)] text-white p-4 rounded-lg">
      <Card className="bg-[rgb(32,33,39)] border-[rgb(24,239,199)] border text-white mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-[rgb(24,239,199)]">
            Real-time Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {activeMessages.length > 0 ? (
              activeMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md flex items-start gap-2 ${msg.severity === "warning" ? "bg-red-900/20 border-l-4 border-red-500" : "bg-green-900/20 border-l-4 border-green-500"}`}
                >
                  {msg.severity === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span
                    className={
                      msg.severity === "warning"
                        ? "text-red-300"
                        : "text-green-300"
                    }
                  >
                    {msg.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic text-center py-4">
                Waiting for feedback...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[rgb(32,33,39)] border-[rgb(24,239,199)] border text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-[rgb(24,239,199)]">
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span
                  className={`text-2xl font-bold ${metric.label.includes("Form") ? getScoreColor(performanceMetrics.formScore || 0) : "text-white"}`}
                >
                  {metric.value}
                </span>
                {metric.label === "Form Score" && (
                  <div className="mt-1">
                    <Progress
                      value={performanceMetrics.formScore}
                      className="h-2 bg-gray-700"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Form Quality</span>
            </div>
            <div className="flex gap-2">
              {performanceMetrics.formScore &&
              performanceMetrics.formScore >= 80 ? (
                <Badge className="bg-green-500">Excellent</Badge>
              ) : performanceMetrics.formScore &&
                performanceMetrics.formScore >= 60 ? (
                <Badge className="bg-yellow-500">Good</Badge>
              ) : (
                <Badge className="bg-red-500">Needs Improvement</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPanel;
