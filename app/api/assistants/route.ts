import { openai } from "@/app/openai";
import { tavilySearch } from "@/app/utils/tavily";
export const runtime = "nodejs";



interface TavilySearchParams {
  query: string;
  api_key?: string;
  search_depth?: string;
  topic?: string;
  max_results?: number;
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
  include_domains?: string[];
  exclude_domains?: string[];
  use_cache?: boolean;
}

const searchTavilyHandler = async(params: TavilySearchParams) => {
  const response = await tavilySearch(params);
  return {
    output: {
      answer: response.answer,
      query: response.query,
      response_time: response.response_time,
      images: response.images,
      results: response.results,
    },
  };
};
// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a helpful assistant.",
    name: "Quickstart Assistant",
    model: "gpt-4o",
    tools: [
      { type: "code_interpreter" },
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Determine weather in my location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["c", "f"],
              },
            },
            required: ["location"],
          },
        },
      },
      { type: "file_search" },
      {
        type: "function",
        function: {
          name: "search_tavily",
          description: "Search using Tavily API",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
              apiKey: {
                type: "string",
                description: "API key",
              },
              searchDepth: {
                type: "string",
                description: "Search depth",
              },
              topic: {
                type: "string",
                description: "Search topic",
              },
              maxResults: {
                type: "number",
                description: "Maximum results",
              },
              includeImages: {
                type: "boolean",
                description: "Include images",
              },
              includeAnswer: {
                type: "boolean",
                description: "Include answer",
              },
              includeRawContent: {
                type: "boolean",
                description: "Include raw content",
              },
              includeDomains: {
                type: "array",
                items: { type: "string" },
                description: "Include domains",
              },
              excludeDomains: {
                type: "array",
                items: { type: "string" },
                description: "Exclude domains",
              },
              useCache: {
                type: "boolean",
                description: "Use cache",
              }
            },
            required: ["query"]
          },
          handler: searchTavilyHandler,
        },
      },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
