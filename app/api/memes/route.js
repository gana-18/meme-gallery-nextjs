export const dynamic = 'force-dynamic'; // disables static caching

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subreddit = searchParams.get("subreddit") || "memes";

  try {
    // 1. Get Reddit access token
    const authString = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to get access token", details: tokenData }),
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch subreddit data using token
    const redditRes = await fetch(
      `https://oauth.reddit.com/r/${subreddit}.json?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": process.env.REDDIT_USER_AGENT || "MyRedditApp/1.0",
        },
      }
    );

    if (!redditRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch subreddit", status: redditRes.status }),
        { status: 500 }
      );
    }

    const data = await redditRes.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

