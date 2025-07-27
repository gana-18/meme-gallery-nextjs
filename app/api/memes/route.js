// app/api/memes/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");
  const subreddit = searchParams.get("subreddit") || "memes";
  const url = `https://www.reddit.com/r/${subreddit}.json?limit=100${after ? `&after=${after}` : ""}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return new Response(JSON.stringify({
      children: data.data.children,
      after: data.data.after
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }
}
