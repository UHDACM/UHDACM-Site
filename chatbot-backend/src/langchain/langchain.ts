import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

async function handleQuestion(question: string) {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const response = await model.invoke(question);

  return typeof response.content === 'string'
    ? response.content && console.log(response.content)
    : JSON.stringify(response.content);
}

handleQuestion('What comes first 6 or 7?');
