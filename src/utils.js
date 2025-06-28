export function sanitizeHeaders(headers) {
  const sanitized = {};
  for (const [key, value] of headers.entries()) {
    // 排除敏感信息
    if (!["authorization", "cookie"].includes(key.toLowerCase())) {
      sanitized[key] = value;
    } else {
       sanitized[key] = value ? value.slice(0, 15) : '';
     }
  }
  return sanitized;
}

export function extractContent(chunk) {
  try {
    if (chunk.startsWith("data: ")) {
      const data = JSON.parse(chunk.slice(6));
      if (data.choices && data.choices[0]) {
        return data.choices[0].delta?.content || "";
      }
    }
    return "";
  } catch (error) {
    return "";
  }
}
