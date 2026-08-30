import { Clock, Zap, Target, BookOpen } from "@lucide/svelte";
import type { PracticeMode } from "$lib/features/dashboard/types";

export function getPracticeModes(examId: "gate-cs" | "ugc-net-cs"): PracticeMode[] {
  const isGate = examId === "gate-cs";
  const baseUrl = `/${examId}/practice`;

  return [
    {
      title: "Quick Practice",
      description: "10 questions",
      content: isGate
        ? "Warm up with a fast conceptual revision."
        : "A fast revision session to keep your concepts sharp.",
      href: `${baseUrl}/quick`,
      buttonText: "Start Quick",
      icon: Zap,
      iconColor: "text-amber-500",
      isExamMode: false
    },
    {
      title: "Focused Practice",
      description: "25 questions",
      content: isGate
        ? "A balanced session for deep analytical problem solving."
        : "A balanced session for thorough topic coverage.",
      href: `${baseUrl}/focused`,
      buttonText: "Start Focused",
      icon: Target,
      iconColor: "text-blue-500",
      isExamMode: false
    },
    {
      title: "Full Practice",
      description: "50 questions",
      content: isGate
        ? "Comprehensive untimed practice across core GATE subjects."
        : "Comprehensive untimed practice across all subjects.",
      href: `${baseUrl}/full`,
      buttonText: "Start Full",
      icon: BookOpen,
      iconColor: "text-indigo-500",
      isExamMode: false
    },
    {
      title: "Mock Test",
      description: isGate ? "Timed · 65 questions" : "Timed · 50 questions",
      content: isGate
        ? "Simulate the real GATE exam environment (3 hours)."
        : "Simulate the real exam environment with a timer.",
      href: `/${examId}/mock-test`,
      buttonText: "Start Mock Test",
      icon: Clock,
      iconColor: "text-primary",
      isExamMode: true
    }
  ];
}
