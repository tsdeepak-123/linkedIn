// app/api/linkedin/search/route.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query } = await req.json();
    console.log("query", query);
    // Using LinkedIn's social platform search API
    const searchUrl = new URL(`https://api.linkedin.com/v2/search?q=companies&keywords=${encodeURIComponent(query)}`);

    console.log('Search URL:', searchUrl.toString());
    console.log('Access token:', session.accessToken?.substring(0, 20) + '...');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202404',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search failed:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try an alternative endpoint if the first one fails
      if (response.status === 404) {
        const altSearchUrl = new URL('https://api.linkedin.com/v2/companies');
        altSearchUrl.searchParams.append('q', 'search');
        altSearchUrl.searchParams.append('keywords', query);
        altSearchUrl.searchParams.append('count', '10');

        const altResponse = await fetch(altSearchUrl.toString(), {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202304',
            'Accept': 'application/json'
          }
        });

        if (!altResponse.ok) {
          const altErrorText = await altResponse.text();
          console.error('Alternative search failed:', altErrorText);
          return NextResponse.json({
            results: [],
            error: `Search failed with status: ${altResponse.status}`
          });
        }

        const altData = await altResponse.json();
        console.log('Alternative API Response:', JSON.stringify(altData, null, 2));
        
        const altResults = altData.elements?.map((company) => ({
          id: company.id || '',
          name: company.name || 'Unknown Organization',
          description: company.description || '',
          url: `https://www.linkedin.com/company/${company.id}`,
          industry: company.industries?.[0]?.name || '',
          location: company.locations?.[0]?.address?.city || '',
          size: company.employeeCount 
            ? `${company.employeeCount} employees` 
            : 'Size unknown'
        })) || [];

        return NextResponse.json({ results: altResults });
      }
      
      return NextResponse.json({
        results: [],
        error: `Search failed with status: ${response.status}. ${errorText}`
      });
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Map the response to include only the fields we need
    const results = data.elements?.map((element) => {
      const company = element.company || element;
      return {
        id: company.id || '',
        name: company.name || 'Unknown Organization',
        description: company.description || '',
        url: `https://www.linkedin.com/company/${company.id}`,
        industry: company.industries?.[0]?.name || '',
        location: company.locations?.[0]?.address?.city || '',
        size: company.employeeCount 
          ? `${company.employeeCount} employees` 
          : 'Size unknown'
      };
    }) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({
      results: [],
      error: "An error occurred while searching. Please try again.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}