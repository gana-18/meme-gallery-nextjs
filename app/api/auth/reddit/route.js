import { NextResponse } from 'next/server';

export async function GET() {
  const state = Math.random().toString(36).substring(2); // could store in cookie if needed

  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}&duration=temporary&scope=read`;

  return NextResponse.redirect(authUrl);
}
