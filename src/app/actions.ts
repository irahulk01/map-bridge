"use server";

export type ExpansionResult =
  | { success: true; expandedUrl: string; originalUrl: string }
  | { success: false; error: string };

export async function expandUrl(url: string): Promise<ExpansionResult> {
  if (!url) {
    return { success: false, error: "URL is required" };
  }

  try {
    // Basic validation
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow", // Follow redirects to get the final URL
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const expandedUrl = response.url;

    // Check if expandedUrl already has coordinates
    // Matches: !3d..., !4d..., @lat,lng, q=lat,lng, center=lat,lng
    const hasCoords = expandedUrl.match(/!3d|!4d|@[-\d.]+,[-\d.]+|[?&]q=[-\d.]+,[-\d.]+|[?&]center=[-\d.]+,[-\d.]+/);

    if (hasCoords) {
      return {
        success: true,
        originalUrl: url,
        expandedUrl,
      };
    }

    // If no coordinates found in URL, fetch the page content to look for meta tags
    // commonly found in Google Maps pages (like og:image static map)
    const pageResponse = await fetch(expandedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const text = await pageResponse.text();
    
    // Look for og:image which usually contains a static map URL with center coordinates
    // Example: https://maps.google.com/maps/api/staticmap?center=22.55115335%2C88.4146176...
    const ogImageMatch = text.match(/content="([^"]+)"\s+property="og:image"/) || 
                         text.match(/property="og:image"\s+content="([^"]+)"/);

    if (ogImageMatch) {
      const ogUrl = ogImageMatch[1];
      // Extract center coordinates from static map URL
      // Can be comma separated or URL encoded (%2C)
      const centerMatch = ogUrl.match(/[?&]center=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/);
      
      if (centerMatch) {
        const lat = centerMatch[1];
        const lng = centerMatch[2];
        return {
          success: true,
          originalUrl: url,
          expandedUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        };
      }
    }

    // Fallback: return the expanded URL even if we couldn't find coordinates
    return {
      success: true,
      originalUrl: url,
      expandedUrl,
    };
  } catch (error) {
    console.error("Error expanding URL:", error);
    return { success: false, error: "Failed to expand URL" };
  }
}
