import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/config/server.env";

// Force Node.js runtime for persistent in-memory caching
export const runtime = 'nodejs';

interface PricesRequest {
  tokenIds: string[];
}

interface CoinGeckoPriceData {
  prices: [number, number][];
}

interface CachedPriceData {
  price: number | null;
  timestamp: number;
}

// In-memory cache for prices (15 minutes TTL)
const priceCache = new Map<string, CachedPriceData>();
const CACHE_TTL = 15 * 60 * 1000;

function isCacheValid(cachedData: CachedPriceData): boolean {
  return Date.now() - cachedData.timestamp < CACHE_TTL;
}

function getCachedPrice(tokenId: string): number | null | undefined {
  const cached = priceCache.get(tokenId);
  if (cached && isCacheValid(cached)) {
    return cached.price;
  }
  return undefined; // Cache miss or expired
}

function setCachedPrice(tokenId: string, price: number | null): void {
  priceCache.set(tokenId, {
    price,
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: PricesRequest = await request.json();
    const { tokenIds } = body;

    // Validate required fields
    if (!tokenIds || !Array.isArray(tokenIds) || tokenIds.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid tokenIds array" },
        { status: 400 }
      );
    }

    const { COINGECKO_BASE_URL, COINGECKO_API_KEY, COINGECKO_AUTH_HEADER } = serverEnv;

    // Calculate date range (from yesterday to today)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const fromTimestamp = Math.floor(yesterday.getTime() / 1000);
    const toTimestamp = Math.floor(now.getTime() / 1000);

    // Rate limiting: 3 requests per second
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const RATE_LIMIT_DELAY = 334; // ~3 requests per second (1000ms / 3 = 333.33ms)

    // Check cache first and separate tokens that need fetching
    const priceResults: { tokenId: string; price: number | null }[] = [];
    const tokensToFetch: string[] = [];

    // First pass: check cache for all tokens
    for (const tokenId of tokenIds) {
      const cachedPrice = getCachedPrice(tokenId);
      if (cachedPrice !== undefined) {
        // Cache hit
        priceResults.push({ tokenId, price: cachedPrice });
        console.log(`Cache hit for ${tokenId}: $${cachedPrice}`);
      } else {
        // Cache miss - need to fetch
        tokensToFetch.push(tokenId);
      }
    }

    // Second pass: fetch only uncached tokens with rate limiting
    let requestCount = 0;
    for (const tokenId of tokensToFetch) {
      try {
        // Add delay between requests (except for the first one)
        if (requestCount > 0) {
          await delay(RATE_LIMIT_DELAY);
        }
        requestCount++;

        console.log(`Fetching price for ${tokenId} from CoinGecko...`);
        const url = `${COINGECKO_BASE_URL}/api/v3/coins/${tokenId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;

        const response = await fetch(url, {
          headers: {
            'accept': 'application/json',
            [COINGECKO_AUTH_HEADER]: COINGECKO_API_KEY,
          }
        });

        if (!response.ok) {
          console.warn(`Failed to fetch price for ${tokenId}: ${response.status}`);
          const cachedPrice = null;
          setCachedPrice(tokenId, cachedPrice);
          priceResults.push({ tokenId, price: cachedPrice });
          continue;
        }

        const data: CoinGeckoPriceData = await response.json();

        // Get the latest price (last element in the prices array)
        const latestPrice = data.prices && data.prices.length > 0
          ? data.prices[data.prices.length - 1][1]
          : null;

        // Cache the result
        setCachedPrice(tokenId, latestPrice);
        priceResults.push({ tokenId, price: latestPrice });
        console.log(`Fetched and cached price for ${tokenId}: $${latestPrice}`);
      } catch (error) {
        console.warn(`Error fetching price for ${tokenId}:`, error);
        const cachedPrice = null;
        setCachedPrice(tokenId, cachedPrice);
        priceResults.push({ tokenId, price: cachedPrice });
      }
    }

    console.log(`Price API: ${priceResults.length - tokensToFetch.length} cache hits, ${tokensToFetch.length} API calls made`);

    // Convert to object format for easier lookup
    const prices: Record<string, number | null> = {};
    priceResults.forEach(({ tokenId, price }) => {
      prices[tokenId] = price;
    });

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
