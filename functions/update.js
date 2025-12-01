// functions/update.js

export async function onRequestPost(context) {
  try {
    // 1. 获取前端发来的数据
    const { request, env } = context;
    const { content, password, sha } = await request.json();

    // 2. 密码验证 (跟之前一样)
    if (password !== "ralvin") {
      return new Response(JSON.stringify({ message: "密码错误" }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. 定义目标
    const GITHUB_OWNER = "ralvinRen";
    const GITHUB_REPO = "Ralvin";
    const FILE_PATH = "database.json";

    // 4. 调用 GitHub API
    // 注意：这里使用的是 env.GH_TOKEN，一会要去 Cloudflare 设置这个变量
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${env.GH_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Cloudflare-Pages-Function" // GitHub 必须要这个头
      },
      body: JSON.stringify({
        message: "Update via Cloudflare Pages",
        content: content,
        sha: sha
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message }), { status: response.status });
    }

    return new Response(JSON.stringify({ message: "Success", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
