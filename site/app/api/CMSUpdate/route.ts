import { isCMSCollectionSingular, isCMSSingleType } from "@/app/_utils/cms";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const { model } = body;

  if (!model) {
    return new Response(JSON.stringify({ error: 'Missing model in request body' }), { status: 400 });
  }

  if (!isCMSCollectionSingular(model) && ! isCMSSingleType(model)) {
    return new Response(JSON.stringify({ error: 'Invalid model in request body' }), { status: 400 });
  }

  // revalidates all paths that rely on the CMS collection
  revalidateTag(model);

  return new Response(JSON.stringify({ okay: true }));
}
