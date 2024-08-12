
import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import {GoogleGenerativeAI} from '@google/generative-ai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = 'You will help solve math problems' // Use your own system prompt here



// POST function to handle incoming requests
export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("sucess connecting to Gemini");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const data = await req.json()
console.log(data)

const prompt = `You are a system 'system' and your goal is to ${systemPrompt}`;

const result = await model.generateContentStream(prompt);
//console.log(result)
// Print text as it comes in.

// Print text as it comes in.
//for await (const chunk of result.stream) {
//    const chunkText = chunk.text();
 //   process.stdout.write(chunkText);
 // }


  //Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of result.stream) {
          const content = chunk.text() // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}