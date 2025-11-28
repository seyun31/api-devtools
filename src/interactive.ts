import inquirer from 'inquirer';
import { sendRequest, startDevTools, runSavedRequest } from './index.js';
import { loadRequests, deleteRequest } from './core/storage.js';
import type { RequestOptions } from './core/http-client.js';

// Interactive 메인 메뉴
export async function startInteractive(): Promise<void> {
  console.clear();
  console.log('\n░▒▓ API DevTools ▓▒░');
  console.log('API 테스트 & 디버깅용 CLI 개발 도구\n');

  await mainMenu();
}

// 메인 메뉴
async function mainMenu(): Promise<void> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '어떤 작업을 하시겠어요?',
      choices: [
        { name: '📨 API 테스트 실행', value: 'test' },
        { name: '🔍 API 요청 모니터링', value: 'proxy' },
        { name: '📚 저장된 요청 관리', value: 'saved' },
        { name: '❓ 도움말', value: 'help' },
        { name: '👋 종료', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'test':
      await apiTestFlow();
      break;
    case 'proxy':
      await proxyModeFlow();
      break;
    case 'saved':
      await savedRequestsFlow();
      break;
    case 'help':
      showHelp();
      await mainMenu();
      break;
    case 'exit':
      console.log('\n👋 안녕히 가세요!\n');
      process.exit(0);
  }
}

// API 요청 테스트 플로우
async function apiTestFlow(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: '요청 방식을 선택해주세요:',
      choices: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      type: 'input',
      name: 'url',
      message: 'URL을 입력해주세요:',
      default: 'https://jsonplaceholder.typicode.com/posts/1',
      validate: (input: string) => {
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          return 'URL은 http:// 또는 https://로 시작해야 해요';
        }
        return true;
      },
    },
  ]);

  const options: RequestOptions = {};

  // POST,PUT이면 body 입력
  if (answers.method === 'POST' || answers.method === 'PUT') {
    const { hasBody } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasBody',
        message: '요청 본문(body)을 추가하시겠어요?',
        default: true,
      },
    ]);

    if (hasBody) {
      const { body } = await inquirer.prompt([
        {
          type: 'input',
          name: 'body',
          message: 'JSON 형식으로 입력해주세요:',
          default: '{"title":"test","body":"hello"}',
        },
      ]);

      try {
        options.body = JSON.parse(body);
      } catch {
        console.log('\n⚠️  JSON 형식이 잘못됐어요. 문자열로 전송할게요.\n');
        options.body = body;
      }
    }
  }

  // 헤더 추가
  const { hasHeaders } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasHeaders',
      message: '헤더를 추가하시겠어요?',
      default: false,
    },
  ]);

  if (hasHeaders) {
    const { headerInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'headerInput',
        message: '헤더를 입력해주세요 (예: Authorization: Bearer token):',
      },
    ]);

    if (headerInput) {
      const [key, ...valueParts] = headerInput.split(':');
      if (key && valueParts.length > 0) {
        options.headers = {
          [key.trim()]: valueParts.join(':').trim(),
        };
      }
    }
  }

  // 요청 전송
  await sendRequest(answers.method, answers.url, options);

  // 다음 작업
  await afterRequestMenu();
}

// 요청 후 메뉴
async function afterRequestMenu(): Promise<void> {
  const { next } = await inquirer.prompt([
    {
      type: 'list',
      name: 'next',
      message: '다음 작업:',
      choices: [
        { name: '🔄 새 요청 보내기', value: 'new' },
        { name: '🏠 메인 메뉴로', value: 'main' },
        { name: '👋 종료', value: 'exit' },
      ],
    },
  ]);

  switch (next) {
    case 'new':
      await apiTestFlow();
      break;
    case 'main':
      await mainMenu();
      break;
    case 'exit':
      console.log('\n👋 안녕히 가세요!\n');
      process.exit(0);
  }
}

// 프록시 모드 플로우
async function proxyModeFlow(): Promise<void> {
  const { target } = await inquirer.prompt([
    {
      type: 'input',
      name: 'target',
      message: '프록시할 대상 서버 주소를 입력해주세요:',
      default: 'http://localhost:3000',
      validate: (input: string) => {
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          return 'URL은 http:// 또는 https://로 시작해야 해요';
        }
        return true;
      },
    },
  ]);

  const proxyPort = 8888;

  console.log(`\n🚀 프록시 서버를 시작합니다...`);
  console.log(`📡 http://localhost:${proxyPort} → ${target}\n`);
  console.log(`💡 앱의 API 주소를 http://localhost:${proxyPort}로 설정하세요\n`);

  await startDevTools({
    port: proxyPort,
    target: target,
  });
}

// 저장된 요청 관리 플로우
async function savedRequestsFlow(): Promise<void> {
  const requests = loadRequests();

  if (requests.length === 0) {
    console.log('\n📭 저장된 요청이 없어요\n');
    await mainMenu();
    return;
  }

  const { selectedRequest } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedRequest',
      message: '저장된 요청 목록:',
      choices: [
        ...requests.map(req => ({
          name: `${req.name} (${req.method} ${req.url})`,
          value: req.name,
        })),
        { name: '← 메인 메뉴로', value: '__back__' },
      ],
    },
  ]);

  if (selectedRequest === '__back__') {
    await mainMenu();
    return;
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '작업 선택:',
      choices: [
        { name: '▶️  실행', value: 'run' },
        { name: '🗑️  삭제', value: 'delete' },
        { name: '← 뒤로가기', value: 'back' },
      ],
    },
  ]);

  switch (action) {
    case 'run':
      await runSavedRequest(selectedRequest);
      await afterRequestMenu();
      break;
    case 'delete':
      deleteRequest(selectedRequest);
      console.log(`\n✓ "${selectedRequest}"를 삭제했어요\n`);
      await savedRequestsFlow();
      break;
    case 'back':
      await savedRequestsFlow();
      break;
  }
}

// 도움말
function showHelp(): void {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📖 API DevTools 사용 가이드');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✨ 주요 기능:\n');
  console.log('1. API 요청 보내기 (Postman 스타일)');
  console.log('   - Postman처럼 API 요청을 직접 보내고 결과를 확인해요');
  console.log('   - GET, POST, PUT, DELETE 지원');
  console.log('   - 헤더, Body 등 상세 설정 가능');
  console.log('   - 각 상태 코드(401, 403, 404 등)에 대한 설명 제공\n');

  console.log('2. 프록시 모드로 API 모니터링 (Chrome DevTools 스타일)');
  console.log('   - 실행 중인 앱의 API 요청을 실시간으로 모니터링해요');
  console.log('   - 프록시 포트: 8888 (고정)');
  console.log('   - 앱의 API 주소를 http://localhost:8888로 설정하세요');
  console.log('   - Chrome DevTools처럼 요청/응답 상세 정보를 확인할 수 있어요\n');

  console.log('3. 저장된 요청 관리');
  console.log('   - 자주 쓰는 API 요청을 저장하고 재사용해요\n');

  console.log('💡 명령어 모드도 사용 가능해요:');
  console.log('   npx api-devtools get <url>');
  console.log('   npx api-devtools post <url> --data \'{"key":"value"}\'');
  console.log('   npx api-devtools proxy -t http://localhost:3000\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
