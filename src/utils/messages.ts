/**
 * 한국어 메시지 시스템
 */

export const messages = {
  app: {
    title: '🔍 API DevTools',
    listening: (port: number) => `⚡ ${port}번 포트에서 대기 중...`,
    proxy: (from: string, to: string) => `📡 프록시: ${from} → ${to}`,
  },

  network: {
    title: '━━ 네트워크 ━━',
    noRequests: '아직 캡처된 요청이 없어요',
    totalRequests: (count: number) => `총 ${count}개 요청`,
    filter: '필터',
    all: '전체',
    xhr: 'XHR',
    fetch: 'Fetch',
    error: '에러',
  },

  details: {
    title: '━━ 상세 정보 ━━',
    tabs: {
      general: '일반',
      requestHeaders: '요청 헤더',
      requestPayload: '요청 본문',
      response: '응답',
      preview: '미리보기',
      timing: '타이밍',
    },
    general: {
      url: 'URL',
      method: '메서드',
      status: '상태',
      responseTime: '응답 시간',
      size: '크기',
    },
    timing: {
      dnsLookup: 'DNS 조회',
      tcpConnect: 'TCP 연결',
      sslHandshake: 'SSL 핸드셰이크',
      requestSent: '요청 전송',
      waiting: '대기 (TTFB)',
      contentDownload: '컨텐츠 다운로드',
      total: '전체',
    },
  },

  actions: {
    copyAsCode: '코드로 복사',
    generateTest: '테스트 생성',
    generateMock: 'Mock 생성',
    replay: '다시 보내기',
    edit: '수정 후 보내기',
    save: '저장',
    analyze: '분석',
    quit: '종료',
  },

  copy: {
    title: '어떤 형식으로 복사할까요?',
    success: '✓ 클립보드에 복사했어요!',
    types: {
      curl: 'curl',
      fetchJs: 'fetch (JavaScript)',
      axiosJs: 'axios (JavaScript)',
      fetchTs: 'fetch (TypeScript)',
      axiosTs: 'axios (TypeScript)',
    },
  },

  test: {
    title: '테스트 생성',
    generating: '테스트 코드를 생성하고 있어요...',
    success: (path: string) => `✓ ${path}에 테스트를 생성했어요!`,
    framework: '프레임워크를 선택해주세요',
    runTest: '테스트를 실행해볼까요?',
  },

  mock: {
    title: 'Mock 서버 생성',
    generating: 'Mock 서버를 생성하고 있어요...',
    success: (port: number) => `✓ Mock 서버가 http://localhost:${port}에서 실행 중이에요`,
    saved: (path: string) => `✓ ${path}에 저장했어요!`,
    endpoints: '등록된 엔드포인트',
  },

  error: {
    detected: '⚠️  에러가 발견됐어요!',
    analysis: '💡 문제 분석',
    solutions: '💡 해결 방법',
    autoFix: '자동으로 수정할까요?',
    types: {
      auth: '인증 에러',
      cors: 'CORS 에러',
      server: '서버 에러',
      network: '네트워크 에러',
    },
  },

  performance: {
    title: '📊 성능 분석 결과',
    slowRequests: '⚠️  느린 API 발견',
    average: '평균 응답 시간',
    distribution: '요청 타이밍 분포',
    suggestions: '💡 개선 방법',
  },

  prompts: {
    confirm: '계속하시겠어요?',
    yesNo: '(Y/n)',
    selectOne: '하나를 선택해주세요',
    selectMultiple: '여러 개를 선택할 수 있어요 (Space로 선택)',
  },

  keyboard: {
    help: '키보드 단축키',
    shortcuts: {
      upDown: '↑/↓: 이동',
      enter: 'Enter: 선택',
      r: 'R: 다시 보내기',
      e: 'E: 수정',
      c: 'C: 복사',
      t: 'T: 테스트 생성',
      m: 'M: Mock 생성',
      p: 'P: 성능 분석',
      f: 'F: 필터',
      q: 'Q: 종료',
    },
  },
};

/**
 * 파일 크기를 읽기 쉽게 포맷
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * 밀리초를 읽기 쉽게 포맷
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * HTTP 상태 코드를 이모지와 함께 포맷
 */
export function formatStatus(status: number): string {
  if (status >= 200 && status < 300) return `✓ ${status}`;
  if (status >= 300 && status < 400) return `↪ ${status}`;
  if (status >= 400 && status < 500) return `⚠️ ${status}`;
  if (status >= 500) return `❌ ${status}`;
  return `${status}`;
}

/**
 * HTTP 상태 코드 설명
 */
export function getStatusDescription(status: number): string {
  const statusDescriptions: Record<number, string> = {
    // 4xx Client Errors
    400: 'Bad Request - 잘못된 요청이에요 (문법 오류, 유효하지 않은 데이터)',
    401: 'Unauthorized - 인증이 필요해요 (로그인 필요, 토큰 누락/만료)',
    402: 'Payment Required - 결제가 필요해요 (현재 거의 사용되지 않음)',
    403: 'Forbidden - 접근 권한이 없어요 (인증은 됐지만 권한 부족)',
    404: 'Not Found - 요청한 리소스를 찾을 수 없어요 (URL 오류, 삭제된 리소스)',

    // 5xx Server Errors
    500: 'Internal Server Error - 서버 내부 오류예요 (서버 코드 에러)',
    501: 'Not Implemented - 서버가 해당 기능을 지원하지 않아요 (미구현 기능)',
    502: 'Bad Gateway - 게이트웨이/프록시 서버가 잘못된 응답을 받았어요',
    503: 'Service Unavailable - 서버를 일시적으로 사용할 수 없어요 (과부하, 점검)',
    504: 'Gateway Timeout - 게이트웨이/프록시 서버가 시간 내에 응답을 받지 못했어요',
  };

  return statusDescriptions[status] || '';
}
