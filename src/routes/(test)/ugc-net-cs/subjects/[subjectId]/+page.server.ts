import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { pyqService } from "$lib/features/pyq/services/pyq-service";
import { getSubjectById } from "$lib/features/subjects/registry";

export const load: PageServerLoad = async ({ params }) => {
  const subjectId = params.subjectId;
  const subject = getSubjectById(subjectId);
  
  if (!subject) {
    error(404, "Subject not found");
  }
  
  const questions = await pyqService.getQuestionsBySubject("ugc-net-cs", subjectId);
  
  return {
    subject,
    questions,
    manifest: {
      year: 0,
      paper: "Various",
      shift: "Mixed",
      questionCount: questions.length,
      file: "",
      title: `UGC NET CS — ${subject.name}`
    },
    examConfig: {
      id: "ugc-net-cs",
      name: "UGC NET Computer Science",
      shortName: "UGC NET CS",
      description: "University Grants Commission National Eligibility Test (Computer Science)",
      defaultDuration: Math.ceil(questions.length * 1.5), // 1.5 mins per question approx
      defaultQuestionCount: questions.length,
      subjects: []
    }
  };
};
