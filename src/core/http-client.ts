import type { CapturedRequest, HttpRequest, HttpResponse } from '../types/index.js';

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: string | object;
}

// HTTP 요청을 보내고 CapturedRequest 형태로 반환
export async function sendHttpRequest(
  method: string,
  url: string,
  options: RequestOptions = {}
): Promise<CapturedRequest> {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  // 요청 준비
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const requestBody =
    options.body && typeof options.body === 'object'
      ? JSON.stringify(options.body)
      : options.body;

  const request: HttpRequest = {
    id: requestId,
    method: method.toUpperCase(),
    url,
    headers,
    body: requestBody,
    timestamp: Date.now(),
  };

  const capturedRequest: CapturedRequest = {
    id: requestId,
    request,
    timing: {
      requestSent: 0,
      waiting: 0,
      contentDownload: 0,
      total: 0,
    },
  };

  try {
    // 요청 전송
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: requestBody,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 응답 본문 읽기
    const responseText = await response.text();
    let responseBody = responseText;

    // JSON이면 포맷팅
    try {
      const json = JSON.parse(responseText);
      responseBody = JSON.stringify(json, null, 2);
    } catch {
      // JSON이 아니면 그대로 사용
    }

    // 응답 헤더 변환
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    capturedRequest.response = {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      size: Buffer.byteLength(responseText),
      duration,
    };

    capturedRequest.timing = {
      requestSent: 0,
      waiting: duration * 0.7,
      contentDownload: duration * 0.3,
      total: duration,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    capturedRequest.error = error instanceof Error ? error.message : String(error);
    capturedRequest.timing.total = duration;
  }

  return capturedRequest;
}
