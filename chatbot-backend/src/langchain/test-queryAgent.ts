// console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);
// console.log('GOOGLE_API_KEYS:', process.env.GOOGLE_API_KEYS);

import { queryAgent } from './langchain';

async function test() {
  const answer = await queryAgent(
    // 'Give me a long written love novel about man name Gael with a lover, who is a rabbit named Junda.',
    // 'Hi'
    'What is the next event for the UHD ACM club?'
    // 'Who is the president of the UHD ACM club?'
  );
  console.log('ANSWER:', answer);
}

test().catch((e) => {
  console.error('ERROR:', e);
});
