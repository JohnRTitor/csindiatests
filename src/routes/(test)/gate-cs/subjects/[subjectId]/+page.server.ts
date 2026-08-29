import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { gateConfig } from "$lib/features/exams/config/gate-cs";
import { pyqService } from "$lib/features/pyq/services/pyq-service";

export const load: PageServerLoad = async ({ params }) => {
  const subjectId = params.subjectId;
  const subject = gateConfig.subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    error(404, "Subject not found");
  }
  
  const questions = await pyqService.getQuestionsBySubject("gate-cs", subjectId);
  
  return {
    subject,
    questions: questions,
    manifest: {
      year: 0,
      paper: "Various",
      shift: "Mixed",
      questionCount: questions.length,
      file: "",
      title: `GATE CS — ${subject.name}`
    },
    examConfig: gateConfig
  };
};
