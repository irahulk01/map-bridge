
async function expandUrl(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });
    console.log("Original URL:", url);
    console.log("Expanded URL:", response.url);
  } catch (error) {
    console.error("Error:", error);
  }
}

expandUrl("https://maps.app.goo.gl/YLmUSY8R8X5rN6ee8?g_st=iw");
