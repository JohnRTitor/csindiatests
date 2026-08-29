import { ugcNetPyqManifest } from "$lib/data/pyq/ugc-net-cs";
import type { PyqPaperManifest, PyqQuestion } from "$lib/features/pyq/types";
import subjectIndexData from "$lib/data/pyq/ugc-net-cs/subjects-index.json";

export const pyqService = {
  getAvailablePyqPapers(): PyqPaperManifest[] {
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
  
  async getPyqPaperByYearAndShift(year: number, shift: string): Promise<{ paper: any, questions: PyqQuestion[], manifest: PyqPaperManifest }> {
    const manifest = ugcNetPyqManifest.find(m => m.year === year && m.shift === shift);
    if (!manifest) {
      throw new Error(`PYQ paper not found for year ${year} and shift ${shift}`);
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

  async getQuestionsBySubject(examId: string, subjectId: string): Promise<PyqQuestion[]> {
    if (examId !== "ugc-net-cs") return [];
    const questions: PyqQuestion[] = [];
    
    // Load all papers (in a real scenario, could load lazily or have pre-built subject bundles)
    for (const manifest of ugcNetPyqManifest) {
      const data = await this.getPyqPaper(manifest.file);
      questions.push(...data.questions.filter(q => q.subjectId === subjectId));
    }
    
    return questions;
  }
};
