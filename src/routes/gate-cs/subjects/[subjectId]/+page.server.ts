import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { gateConfig, gateQuestions } from "$lib/features/exams/config/gate-cs";

export const load: PageServerLoad = async ({ params }) => {
  const subjectId = params.subjectId;
  const subject = gateConfig.subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    error(404, "Subject not found");
  }
  
  // For GATE, we currently have mock data in gateQuestions. 
  // In a real app, this would query the pyqService like UGC NET.
  const questions = gateQuestions.filter(q => q.subjectId === subjectId || (q.tags || []).includes(subjectId));
  
  // If we don't have filtered questions, just provide a fallback set for demo purposes
  const finalQuestions = questions.length > 0 ? questions : gateQuestions.slice(0, 15);
  
  return {
    subject,
    questions: finalQuestions,
    manifest: {
      year: 0,
      paper: "Various",
      shift: "Mixed",
      questionCount: finalQuestions.length,
      file: "",
      title: `GATE CS — ${subject.name}`
    },
    examConfig: gateConfig
  };
};
