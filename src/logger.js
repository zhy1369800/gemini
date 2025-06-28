class CloudflareLogger {
  constructor(env) {
    this.env = env;
  }

  async log(type, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      data,
    };

    // 生成唯一的日志 ID
    const logId = `log:${timestamp}:${crypto.randomUUID()}`;

    try {
      // 写入 KV 存储
      await this.env.LOGS_KV.put(logId, JSON.stringify(logEntry), {
        expirationTtl: 60 * 60 * 24 * 7, // 7天过期
      });

      // 同时输出到 Cloudflare 控制台
      console.log(JSON.stringify(logEntry));
    } catch (error) {
      console.error("日志记录失败:", error);
    }
  }

  // 获取最近的日志
  async getRecentLogs(limit = 100) {
    const logs = [];
    const list = await this.env.LOGS_KV.list({ prefix: "log:", limit });

    for (const key of list.keys) {
      const log = await this.env.LOGS_KV.get(key.name, "json");
      if (log) logs.push(log);
    }

    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

export { CloudflareLogger };
