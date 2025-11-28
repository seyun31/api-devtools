// HTTP 요청 정보
export interface HttpRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

// HTTP 응답 정보
export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: string;
  size: number;
  duration: number; // ms
}

// 캡처된 API 요청/응답 쌍
export interface CapturedRequest {
  id: string;
  request: HttpRequest;
  response?: HttpResponse;
  error?: string;
  timing: RequestTiming;
}

// 요청 타이밍 정보
export interface RequestTiming {
  dnsLookup?: number;
  tcpConnect?: number;
  sslHandshake?: number;
  requestSent: number;
  waiting: number; // TTFB
  contentDownload: number;
  total: number;
}

// 필터 옵션
export interface FilterOptions {
  method?: string[];
  status?: number[];
  searchText?: string;
}

// 코드 생성 타입
export type CodeType = 'curl' | 'fetch-js' | 'axios-js' | 'fetch-ts' | 'axios-ts';

// 테스트 프레임워크
export type TestFramework = 'jest' | 'vitest';

// 에러 분석 결과
export interface ErrorAnalysis {
  type: 'auth' | 'cors' | 'server' | 'network' | 'unknown';
  message: string;
  suggestions: string[];
  autoFixAvailable: boolean;
}

// 성능 분석 결과
export interface PerformanceAnalysis {
  slowRequests: Array<{
    request: CapturedRequest;
    reason: string;
    suggestion: string;
  }>;
  averageDuration: number;
  distribution: {
    fast: number; // < 100ms
    normal: number; // 100-500ms
    slow: number; // 500ms-1s
    verySlow: number; // > 1s
  };
}
