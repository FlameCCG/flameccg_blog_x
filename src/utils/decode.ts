export const jsonStr = (payloadBase64: string): string => {
  if (!payloadBase64) return '';

  try {
    // URL-safe base64 修复
    payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    // 补齐 =
    const padLength = 4 - (payloadBase64.length % 4);
    if (padLength !== 4) {
      payloadBase64 += '='.repeat(padLength);
    }

    const decoded = atob(payloadBase64);
    return decodeURIComponent(
      Array.prototype.map
        .call(decoded, function (c) {
          return '%' + c.charCodeAt(0).toString(16).padStart(2, '0');
        })
        .join(''),
    );
  } catch (err) {
    console.error('Base64 解码失败:', payloadBase64);
    return '';
  }
};
