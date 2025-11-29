import { render } from 'ink';
import React from 'react';
import { App } from './components/App.js';
import { RequestResult } from './components/RequestResult.js';
import { ProxyServer } from './core/proxy.js';
import { sendHttpRequest, type RequestOptions } from './core/http-client.js';
import {
  saveRequest as saveRequestToStorage,
  loadRequests,
  getRequest,
} from './core/storage.js';
import type { CapturedRequest } from './types/index.js';
import { formatDuration, getStatusDescription } from './utils/messages.js';

export interface DevToolsOptions {
  port: number;
  target?: string;
}

// 프록시 모드로 시작
export async function startDevTools(options: DevToolsOptions): Promise<void> {
  const requests: CapturedRequest[] = [];

  // 프록시 서버 시작
  const proxy = new ProxyServer(options.port, options.target);

  proxy.on('request', (capturedRequest: CapturedRequest) => {
    requests.push(capturedRequest);
  });

  await proxy.start();

  // TUI 렌더링
  const { waitUntilExit } = render(
    React.createElement(App, {
      port: options.port,
      target: options.target,
      requests,
      onSave: (request: CapturedRequest) => {
        const name = `${request.request.method}-${Date.now()}`;
        saveRequestToStorage(name, request);
        console.log(`\n✓ 요청을 "${name}"으로 저장했습니다\n`);
      },
      onExit: () => {
        proxy.stop();
        process.exit(0);
      },
    })
  );

  await waitUntilExit();
}

// HTTP 요청을 보내고 결과 표시
export async function sendRequest(
  method: string,
  url: string,
  options: RequestOptions = {}
): Promise<void> {
  console.log(`\n🚀 ${method} ${url} 요청 중...\n`);

  const request = await sendHttpRequest(method, url, options);

  // TTY가 아니면 간단한 출력만
  if (!process.stdin.isTTY) {
    printSimpleResult(request);
    return;
  }

  // TUI로 결과 표시
  const { waitUntilExit } = render(
    React.createElement(RequestResult, {
      request,
      onSave: (name: string) => {
        saveRequestToStorage(name, request);
        console.log(`\n✓ ${name}(으)로 저장했어요!\n`);
      },
      onExit: () => {
        process.exit(0);
      },
    })
  );

  await waitUntilExit();
}

// 간단한 텍스트 결과 출력 (TTY가 아닐 때)
function printSimpleResult(request: CapturedRequest): void {
  const { request: req, response: res, error } = request;

  console.log(`\n${req.method} ${req.url}`);
  console.log('─'.repeat(60));

  if (res) {
    console.log(`✓ ${res.status} ${res.statusText}`);
    const statusDesc = getStatusDescription(res.status);
    if (statusDesc) {
      console.log(`💡 ${statusDesc}`);
    }
    console.log(`⏱  ${formatDuration(res.duration)}`);
    console.log(`📦 ${res.size} bytes`);
    console.log('\n응답:');
    console.log(res.body);
  }

  if (error) {
    console.log(`❌ ${error}`);
  }

  console.log('\n');
}

// 저장된 요청 또는 URL 실행
export async function runSavedRequest(nameOrUrl: string): Promise<void> {
  // URL인지 확인 (http:// 또는 https://로 시작)
  if (nameOrUrl.startsWith('http://') || nameOrUrl.startsWith('https://')) {
    // URL이면 GET 요청으로 실행
    await sendRequest('GET', nameOrUrl);
    return;
  }

  // 저장된 요청 찾기
  const savedRequest = getRequest(nameOrUrl);

  if (!savedRequest) {
    console.error(`\n❌ "${nameOrUrl}" 요청을 찾을 수 없어요\n`);
    console.log('💡 저장된 요청 목록을 보려면: npx api-devtools list\n');
    process.exit(1);
  }

  console.log(`\n▶️  "${nameOrUrl}" 실행 중...\n`);

  await sendRequest(savedRequest.method, savedRequest.url, {
    headers: savedRequest.headers,
    body: savedRequest.body,
  });
}

// 저장된 요청 목록 표시
export async function listRequests(): Promise<void> {
  const requests = loadRequests();

  if (requests.length === 0) {
    console.log('\n📭 저장된 요청이 없어요\n');
    return;
  }

  console.log('\n📚 저장된 요청 목록:\n');
  console.log('─'.repeat(60));

  for (const req of requests) {
    const date = new Date(req.createdAt);
    console.log(`\n📌 ${req.name}`);
    console.log(`   ${req.method} ${req.url}`);
    console.log(`   생성: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('\n💡 사용법: npx api-devtools run <이름>\n');
}
