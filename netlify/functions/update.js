/// netlify/functions/update.js
// 这是一个运行在 Netlify 服务器上的“云函数”
// 它的作用是接收你网页发来的新数据，并用 GH_TOKEN 帮你把数据写入 GitHub

export const handler = async (event) => {
  // 1. 只允许 POST 请求（安全检查）
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. 解析网页发来的数据
    const { content, password, sha } = JSON.parse(event.body);

    // 3. 简单的密码验证 (如果你以后想改密码，改这里)
    if (password !== "ralvin") {
      return { statusCode: 403, body: JSON.stringify({ message: "密码错误" }) };
    }

    // 4. 定义要修改的目标文件
    const GITHUB_OWNER = "ralvinRen"; // 你的用户名
    const GITHUB_REPO = "Ralvin";     // 你的仓库名
    const FILE_PATH = "data.json";    // 数据文件名

    // 5. 调用 GitHub API 更新文件
    // 注意：这里使用的是 process.env.GH_TOKEN，就是你刚才在 Netlify 设置的那个变量
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${process.env.GH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update content via Web Admin (Netlify Function)",
        content: content,
        sha: sha
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ message: data.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success", data }),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
