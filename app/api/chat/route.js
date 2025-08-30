// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// export async function POST(req) {
//   const { messages } = await req.json();
//   const result = await streamText({
//     model: openai('gpt-3.5-turbo'),
//     messages,
//   });
//   return result.toDataStreamResponse();
// }


import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful AI assistant. When presenting tabular data, always format it as markdown tables using proper markdown syntax with | separators and header rows. Make sure tables are well-formatted and readable.`,
    messages,
  });
  console.log("result===============", result);
  console.log("message==============", result.toDataStreamResponse())

  return result.toDataStreamResponse();
}