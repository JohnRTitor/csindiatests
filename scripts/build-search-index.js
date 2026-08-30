import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MiniSearch from 'minisearch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the static directory exists
const staticDir = path.join(__dirname, '../static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Subject mappings (hardcoded for the script)
const subjectsMap = {
  "discrete-structures": "Discrete Structures and Optimization",
  "computer-system-architecture": "Computer System Architecture",
  "programming-and-computer-graphics": "Programming Languages and Computer Graphics",
  "database-management-systems": "Database Management Systems",
  "system-software-and-operating-systems": "System Software and Operating System",
  "software-engineering": "Software Engineering",
  "data-structures-and-algorithms": "Data Structures and Algorithms",
  "theory-of-computation": "Theory of Computation and Compilers",
  "data-communication-and-computer-networks": "Data Communication and Computer Networks",
  "artificial-intelligence": "Artificial Intelligence (AI)"
};

async function buildIndex() {
  const dataDir = path.join(__dirname, '../src/lib/data/pyq/ugc-net-cs');
  const index = [];

  // Read all year directories
  const years = fs.readdirSync(dataDir).filter(f => !f.includes('.'));
  
  for (const year of years) {
    const yearDir = path.join(dataDir, year);
    const sessionFiles = fs.readdirSync(yearDir).filter(f => f.endsWith('.json'));

    for (const file of sessionFiles) {
      const filePath = path.join(yearDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      const metadata = data.metadata;
      
      for (const q of data.questions) {
        // Extract text from content
        const questionText = q.content
          ?.filter(c => c.type === 'text')
          .map(c => c.value)
          .join('\n') || '';

        // Extract text from options
        const optionsText = q.options
          ?.map(opt => opt.content?.filter(c => c.type === 'text').map(c => c.value).join(' '))
          .join('\n') || '';

        // Extract text from explanation
        const explanationText = q.explanation
          ?.filter(c => c.type === 'text')
          .map(c => c.value)
          .join('\n') || '';

        index.push({
          id: q.id,
          year: metadata.year,
          session: metadata.session,
          paper: metadata.paperNumber,
          shift: metadata.shift || '',
          slug: file.replace('.json', ''),
          subjectId: q.subjectId || '',
          topicId: q.topicId || '',
          questionNumber: q.questionNumber,
          subject: subjectsMap[q.subjectId] || q.subjectId || '',
          topic: q.topicId || '', // could map topics too
          question: questionText,
          options: optionsText,
          explanation: explanationText
        });
      }
    }
  }

  // Write to static folder
  const outputPath = path.join(staticDir, 'search-index.json');
  
  // Use MiniSearch to pre-build the index
  const miniSearch = new MiniSearch({
    fields: ['subject', 'topic', 'question', 'options', 'explanation'],
    storeFields: ['id', 'year', 'session', 'paper', 'shift', 'slug', 'subjectId', 'topicId', 'questionNumber', 'subject', 'topic', 'question'],
    tokenize: (string) => string.match(/[\w+#]+/g) || []
  });
  
  miniSearch.addAll(index);
  
  fs.writeFileSync(outputPath, JSON.stringify(miniSearch));
  console.log(`Generated search index with ${index.length} questions at ${outputPath}`);
}

buildIndex().catch(console.error);
