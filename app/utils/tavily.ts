import axios from 'axios';

const TAVILY_API_URL = 'https://api.tavily.com'; // Replace with the actual Tavily API URL

interface TavilySearchParams {
    query: string;
    api_key?: string;
    search_depth?: string;
    topic?: string;
    max_results?: number;
    include_answer?: boolean;
    include_images?: boolean;
    include_raw_content?: boolean;
    include_domains?: string[];
    exclude_domains?: string[];
    use_cache?: boolean;
}

interface TavilySearchResponse {
    answer: string;
    query: string;
    response_time: number;
    images: string[];
    results: {
      title: string;
      url: string;
      content: string;
      raw_content: string;
      score: number;
    }[];
}

const tavilySearch = async (params: TavilySearchParams): Promise<TavilySearchResponse> => {
  try {
    const {
      query,
      search_depth = 'advanced',
      topic = 'general',
      max_results = 5,
      include_images = false,
      include_answer = false,
      include_raw_content = false,
      include_domains = [],
      exclude_domains = [],
      use_cache = true
    } = params;

    const api_key = params.api_key || process.env.TAVILY_API_KEY;

    if (!api_key) {
      throw new Error("API key is missing");
    }

    const response = await axios.get<TavilySearchResponse>(`${TAVILY_API_URL}/search`, {
      params: {
        query,
        api_key,
        search_depth,
        topic,
        max_results,
        include_images,
        include_answer,
        include_raw_content,
        include_domains,
        exclude_domains,
        use_cache
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error making tavily api call:', error);
    throw error;
  }
};

{ export tavilySearch };
