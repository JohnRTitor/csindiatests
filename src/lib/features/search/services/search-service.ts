import MiniSearch from 'minisearch';
import type { SearchResult } from '../types';

class SearchService {
  private miniSearch: MiniSearch | null = null;
  private loadPromise: Promise<void> | null = null;

  /**
   * Initializes the search engine by fetching the pre-built index.
   * This is safe to call multiple times; it will only fetch once.
   */
  async init(): Promise<void> {
    if (this.miniSearch) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch search index');
        }
        
        const json = await response.text();
        
        // Configuration must match the build script exactly
        this.miniSearch = MiniSearch.loadJSON(json, {
          fields: ['subject', 'topic', 'question', 'options', 'explanation'],
          storeFields: ['id', 'year', 'session', 'paper', 'shift', 'subjectId', 'topicId', 'questionNumber', 'subject', 'topic', 'question'],
          tokenize: (string) => string.match(/[\w+#]+/g) || []
        });
      } catch (error) {
        console.error('Error loading search index:', error);
        this.loadPromise = null; // Allow retrying if it failed
      }
    })();

    return this.loadPromise;
  }

  /**
   * Searches the PYQ database.
   */
  async search(query: string, limit = 50): Promise<SearchResult[]> {
    await this.init();
    
    if (!this.miniSearch || !query.trim()) {
      return [];
    }

    // Use exact match, prefix match for typing, and a tiny bit of fuzziness for typos.
    // Boost fields to ensure relevant matches bubble up.
    const results = this.miniSearch.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: {
        subject: 10,
        topic: 5,
        question: 2,
        options: 1,
        explanation: 1
      }
    });

    return results.slice(0, limit) as unknown as SearchResult[];
  }
}

export const searchService = new SearchService();
