#!/usr/bin/env node

import { Command } from 'commander';
import { startDevTools, sendRequest, runSavedRequest, listRequests } from './index.js';
import { startInteractive } from './interactive.js';

const program = new Command();

program
  .name('api-devtools')
  .description('API 테스트 & 디버깅용 CLI 개발 도구')
  .version('1.0.0')
  .action(async () => {
    // 인자 없이 실행하면 interactive 모드
    await startInteractive();
  });

// GET 요청
program
  .command('get <url>')
  .description('GET 요청을 보냅니다')
  .option('-H, --header <header...>', '헤더 추가 (예: "Authorization: Bearer token")')
  .action(async (url, options) => {
    const headers = parseHeaders(options.header);
    await sendRequest('GET', url, { headers });
  });

// POST 요청
program
  .command('post <url>')
  .description('POST 요청을 보냅니다')
  .option('-d, --data <data>', '요청 본문 (JSON)')
  .option('-H, --header <header...>', '헤더 추가')
  .action(async (url, options) => {
    const headers = parseHeaders(options.header);
    const body = options.data ? JSON.parse(options.data) : undefined;
    await sendRequest('POST', url, { headers, body });
  });

// PUT 요청
program
  .command('put <url>')
  .description('PUT 요청을 보냅니다')
  .option('-d, --data <data>', '요청 본문 (JSON)')
  .option('-H, --header <header...>', '헤더 추가')
  .action(async (url, options) => {
    const headers = parseHeaders(options.header);
    const body = options.data ? JSON.parse(options.data) : undefined;
    await sendRequest('PUT', url, { headers, body });
  });

// DELETE 요청
program
  .command('delete <url>')
  .description('DELETE 요청을 보냅니다')
  .option('-H, --header <header...>', '헤더 추가')
  .action(async (url, options) => {
    const headers = parseHeaders(options.header);
    await sendRequest('DELETE', url, { headers });
  });

// 저장된 요청 실행 또는 URL 실행
program
  .command('run <nameOrUrl>')
  .description('저장된 요청을 실행하거나 URL로 GET 요청을 보냅니다')
  .action(async nameOrUrl => {
    await runSavedRequest(nameOrUrl);
  });

// 저장된 요청 목록
program
  .command('list')
  .description('저장된 요청 목록을 표시합니다')
  .action(async () => {
    await listRequests();
  });

// 프록시 모드
program
  .command('proxy')
  .description('프록시 모드로 API DevTools를 시작합니다')
  .option('-p, --port <port>', '프록시 서버 포트', '8888')
  .option('-t, --target <url>', '프록시 타겟 URL', '')
  .action(async options => {
    await startDevTools({
      port: parseInt(options.port),
      target: options.target,
    });
  });

// 헤더 파싱 헬퍼
function parseHeaders(headerArray?: string[]): Record<string, string> | undefined {
  if (!headerArray) return undefined;

  const headers: Record<string, string> = {};
  for (const header of headerArray) {
    const [key, ...valueParts] = header.split(':');
    if (key && valueParts.length > 0) {
      headers[key.trim()] = valueParts.join(':').trim();
    }
  }
  return headers;
}

program.parse();
