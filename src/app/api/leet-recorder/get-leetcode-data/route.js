export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const link = searchParams.get("link");

  if (!link) {
    return new Response(JSON.stringify({ message: "Link is required" }), {
      status: 400,
    });
  }

  const extractSlug = (link) => {
    const regex = /leetcode\.(com|cn)\/problems\/([\w-]+)\/?/;
    const match = link.match(regex);
    return match ? match[2] : null;
  };

  const slug = extractSlug(link);

  if (!slug) {
    return new Response(JSON.stringify({ message: "Invalid LeetCode URL" }), {
      status: 400,
    });
  }

  const query = `{ 
      question(titleSlug: "${slug}") { 
        questionFrontendId 
        title
        titleSlug
        translatedTitle 
        difficulty
      } 
    }`;

  const url = "https://leetcode.cn/graphql";
  const requestBody = JSON.stringify({ query });

  const headers = {
    "Content-Type": "application/json",
    Referer: `https://leetcode.cn/problems/${slug}/`,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    Origin: "https://leetcode.cn",
    Host: "leetcode.cn",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: requestBody,
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Error fetching data from LeetCode" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      return new Response(
        JSON.stringify({
          message: "Error in GraphQL query",
          errors: data.errors,
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ question: data.data.question }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
