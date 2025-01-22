// app/api/linkedin/posts/route.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId } = await req.json();
    
    // Using the DMA Posts API endpoint
    const postsUrl = `https://api.linkedin.com/rest/dmaPosts?q=author&author=${organizationId}`;

    const response = await fetch(postsUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202408',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Posts fetch failed:', await response.text());
      throw new Error(`Posts fetch failed: ${response.status}`);
    }

    const data = await response.json();
    
    const posts = data.elements?.map((post) => ({
      id: post.id,
      text: post.text?.text || '',
      created: post.created?.time || '',
      author: {
        name: post.author?.name || 'Unknown Author'
      }
    })) || [];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json(
      { posts: [], error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}