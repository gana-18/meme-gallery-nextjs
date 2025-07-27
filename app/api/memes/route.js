export const dynamic = 'force-dynamic'; // disables static caching

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");
  const subreddit = searchParams.get("subreddit") || "memes";

  const url = `https://www.reddit.com/r/${subreddit}.json?limit=100${after ? `&after=${after}` : ''}`;

  try {
    console.log("Fetching Reddit URL:", url);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      console.error("Reddit fetch failed with status:", res.status);
      return new Response(JSON.stringify({ error: "Failed to fetch from Reddit" }), { status: 500 });
    }

    const json = await res.json();
    if (!json?.data?.children) {
      return new Response(JSON.stringify({ error: "Invalid Reddit response" }), { status: 502 });
    }

    return new Response(JSON.stringify({
      children: json.data.children,
      after: json.data.after
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500
    });
  }
}
