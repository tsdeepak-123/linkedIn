import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user info first
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202304',
        'Accept': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      const errorMessage = await profileResponse.text();
      console.error('Profile Response Error:', errorMessage);
      throw new Error(`LinkedIn Profile API error: ${profileResponse.status} - ${errorMessage}`);
    }

    const profile = await profileResponse.json();
    const userId = profile.sub.split(':').pop(); // Extract the ID from the URN

    // Get posts using the feed endpoint
    const postsResponse = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodeURIComponent(`urn:li:person:${userId}`)})`, 
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202304',
          'Accept': 'application/json',
        },
      }
    );

    if (!postsResponse.ok) {
      const errorMessage = await postsResponse.text();
      console.error('Posts Response Error:', errorMessage);
      throw new Error(`LinkedIn Posts API error: ${postsResponse.status} - ${errorMessage}`);
    }

    const data = await postsResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error.message);
    return NextResponse.json(
      { error: error.message }, 
      { status: error.message.includes('401') ? 401 : 500 }
    );
  }
}