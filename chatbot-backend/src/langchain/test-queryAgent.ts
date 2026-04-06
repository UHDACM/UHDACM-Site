import { queryAgent } from './langchain';

// Verification battery. Watch for the "querying ..." log (printed by the search
// tool) to confirm search only fires for UHD ACM questions.
//   - shouldSearch=false  -> must NOT print "querying ..."
//   - shouldSearch=true   -> should search AND return clean prose (no JSON /
//     "collection:" prefixes / raw URLs in `response`)
const battery: { q: string; shouldSearch: boolean }[] = [
  { q: "What's 9+10?", shouldSearch: false },
  { q: 'Hi', shouldSearch: false },
  { q: 'What is the next event for the UHD ACM club?', shouldSearch: true },
  { q: 'How do I join ACM?', shouldSearch: true },
];

const RAW_LEAK = /("content"\s*:|page-\w+:|SOURCES \(reference)/i;

async function run() {
  for (const { q, shouldSearch } of battery) {
    console.log('\n==============================');
    console.log('QUERY:', q, `(expect search: ${shouldSearch})`);
    const start = Date.now();
    try {
      const answer = await queryAgent(q);
      const ms = Date.now() - start;
      const leak = RAW_LEAK.test(answer.response);
      console.log(`TIME: ${ms}ms`);
      console.log('RESPONSE:', answer.response);
      console.log('RELEVANT_ACTIONS:', JSON.stringify(answer.relevant_actions));
      console.log('QUICK_REPLIES:', JSON.stringify(answer.quick_replies.map((r) => r.label)));
      if (leak) console.log('⚠️  RAW OUTPUT LEAKED INTO response!');
    } catch (e) {
      console.error('ERROR:', (e as Error).message);
    }
  }
}

run().catch((e) => {
  console.error('FATAL:', e);
});
