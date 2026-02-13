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
    });

    return {
      success: true,
      originalUrl: url,
      expandedUrl: response.url,
    };
  } catch (error) {
    console.error("Error expanding URL:", error);
    return { success: false, error: "Failed to expand URL" };
  }
}
