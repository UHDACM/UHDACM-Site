import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function handleQuestion(question: string) {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const response = await model.invoke(question);

  return typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);
}
