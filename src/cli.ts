#!/usr/bin/env node

import { Command } from 'commander';
import { startInteractive } from './interactive.js';

const program = new Command();

program
  .name('api-devtools')
  .description('API 요청을 캡처하고, 테스트부터 코드 변환까지 한 흐름으로 이어주는 올인원 CLI 도구')
  .version('1.0.0')
  .action(async () => {
    // 인터랙티브 모드만 지원
    await startInteractive();
  });

program.parse();
