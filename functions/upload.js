export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // 生成唯一文件名（时间戳+文件名），防止重名覆盖
    const uniqueName = Date.now() + '-' + file.name.replace(/\s/g, '_');
    
    // 把文件扔进 R2 (这就是刚才你绑定的那个 BUCKET)
    await env.BUCKET.put(uniqueName, file);

    // 你的 R2 公开链接前缀
    const R2_DOMAIN = "https://pub-d262637c2ab34548b251229fb3013931.r2.dev"; 

    return new Response(JSON.stringify({ 
      url: `${R2_DOMAIN}/${uniqueName}` 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
