import { error } from "@sveltejs/kit";
import { pyqService } from "$lib/features/pyq/services/pyq-service";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const year = parseInt(params.year);
  const shift = decodeURIComponent(params.shift);

  try {
    const data = await pyqService.getPyqPaperByYearAndShift(year, shift);
    return {
      manifest: data.manifest,
      questions: data.questions
    };
  } catch (e) {
    console.error("Failed to load PYQ data", e);
    throw error(404, "Failed to load PYQ questions data");
  }
};
