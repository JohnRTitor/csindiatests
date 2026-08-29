import { ugcNetPyqManifest } from "$lib/data/pyq/ugc-net-cs";
import type { PyqPaperManifest, PyqQuestion } from "$lib/features/pyq/types";
import type { Question } from "$lib/features/exams/types";
import subjectIndexData from "$lib/data/pyq/ugc-net-cs/subjects-index.json";

function adaptPyqToQuestion(pyq: PyqQuestion, examId: string): Question {
  return {
    id: pyq.id,
    examId: examId,
    subjectId: pyq.subjectId || "other",
    topic: pyq.topicId || "other",
    difficulty: "Medium",
    content: pyq.content,
    options: pyq.options,
    correctOptionId: pyq.answer,
    explanation: pyq.explanation,
    tags: pyq.topicId ? [pyq.topicId] : []
  };
}

export const pyqService = {
  getAvailablePyqPapers(examId?: string): PyqPaperManifest[] {
    if (examId === "gate-cs") return []; // Not yet available
    return ugcNetPyqManifest;
  },

  async getPyqPaper(file: string): Promise<{ paper: any, questions: PyqQuestion[] }> {
    try {
      const modules = import.meta.glob('../../../data/pyq/ugc-net-cs/**/*.json');
      const loadFn = modules[`../../../data/pyq/ugc-net-cs/${file}`];
      
      if (!loadFn) {
        throw new Error(`PYQ paper module not found: ${file}`);
      }
      
      const module = (await loadFn()) as any;
      const data = module.default || module;
      return {
        paper: data.metadata,
        questions: data.questions
      };
    } catch (error) {
      console.error(`Failed to load PYQ paper: ${file}`, error);
      throw error;
    }
  },
  
  async getPyqPaperByYearAndShift(examId: string, year: number, shift: string): Promise<{ paper: any, questions: PyqQuestion[], manifest: PyqPaperManifest }> {
    const availablePapers = this.getAvailablePyqPapers(examId);
    const manifest = availablePapers.find(m => m.year === year && m.shift === shift);
    if (!manifest) {
      throw new Error(`PYQ paper not found for exam ${examId}, year ${year} and shift ${shift}`);
    }
    const data = await this.getPyqPaper(manifest.file);
    return { ...data, manifest };
  },

  getSubjectCounts(examId: string): { id: string; count: number }[] {
    if (examId === "ugc-net-cs") {
      return subjectIndexData["ugc-net-cs"];
    }
    return [];
  },

  async getQuestionsBySubject(examId: string, subjectId: string): Promise<Question[]> {
    if (examId !== "ugc-net-cs") return [];
    const questions: Question[] = [];
    
    // Load all papers (in a real scenario, could load lazily or have pre-built subject bundles)
    for (const manifest of ugcNetPyqManifest) {
      const data = await this.getPyqPaper(manifest.file);
      const filtered = data.questions.filter(q => q.subjectId === subjectId);
      questions.push(...filtered.map(q => adaptPyqToQuestion(q, examId)));
    }
    
    return questions;
  },

  async getRandomQuestions(examId: string, count: number, subjectId?: string): Promise<Question[]> {
    if (examId !== "ugc-net-cs") return [];
    
    let allQuestions: PyqQuestion[] = [];
    for (const manifest of ugcNetPyqManifest) {
      const data = await this.getPyqPaper(manifest.file);
      if (subjectId) {
        allQuestions.push(...data.questions.filter(q => q.subjectId === subjectId));
      } else {
        allQuestions.push(...data.questions);
      }
    }
    
    // Shuffle and pick count
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    return selected.map(q => adaptPyqToQuestion(q, examId));
  },
  
  async getQuestionsByIds(examId: string, questionIds: string[]): Promise<Question[]> {
    if (examId !== "ugc-net-cs") return [];
    const questions: Question[] = [];
    const idsSet = new Set(questionIds);
    
    for (const manifest of ugcNetPyqManifest) {
      if (idsSet.size === 0) break;
      const data = await this.getPyqPaper(manifest.file);
      for (const pyq of data.questions) {
        if (idsSet.has(pyq.id)) {
          questions.push(adaptPyqToQuestion(pyq, examId));
          idsSet.delete(pyq.id);
        }
      }
    }
    
    // Maintain original order
    return questionIds.map(id => questions.find(q => q.id === id)).filter((q): q is Question => q !== undefined);
  },

  async getMockTestQuestions(examId: string, count: number): Promise<Question[]> {
     return this.getRandomQuestions(examId, count);
  }
};
