import type { CapturedRequest, CodeType } from '../types/index.js';

// HTTP 요청을 curl 명령어로 변환
export function generateCurl(request: CapturedRequest): string {
  const { method, url, headers, body } = request.request;

  let curl = `curl -X ${method} '${url}'`;

  // 헤더 추가
  Object.entries(headers).forEach(([key, value]) => {
    curl += ` \\\n  -H '${key}: ${value}'`;
  });

  // 바디 추가
  if (body) {
    // JSON인 경우 포맷팅
    try {
      const parsed: unknown = JSON.parse(body);
      const formatted = JSON.stringify(parsed, null, 2).replace(/'/g, "'\\''");
      curl += ` \\\n  -d '${formatted}'`;
    } catch {
      // JSON이 아닌 경우 그대로 추가
      const escaped = body.replace(/'/g, "'\\''");
      curl += ` \\\n  -d '${escaped}'`;
    }
  }

  return curl;
}

//HTTP 요청을 fetch JavaScript 코드로 변환
export function generateFetchJS(request: CapturedRequest): string {
  const { method, url, headers, body } = request.request;

  let code = `fetch('${url}', {\n  method: '${method}'`;

  // 헤더 추가
  if (Object.keys(headers).length > 0) {
    code += ',\n  headers: {\n';
    Object.entries(headers).forEach(([key, value], index, arr) => {
      code += `    '${key}': '${value}'`;
      if (index < arr.length - 1) code += ',';
      code += '\n';
    });
    code += '  }';
  }

  // 바디 추가
  if (body) {
    try {
      // JSON인지 확인
      JSON.parse(body);
      code += `,\n  body: JSON.stringify(${body})`;
    } catch {
      // JSON이 아닌 경우
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n  body: '${escaped}'`;
    }
  }

  code += '\n})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));';

  return code;
}

// HTTP 요청을 axios JavaScript 코드로 변환
export function generateAxiosJS(request: CapturedRequest): string {
  const { method, url, headers, body } = request.request;

  let code = `axios({\n  method: '${method}',\n  url: '${url}'`;

  // 헤더 추가
  if (Object.keys(headers).length > 0) {
    code += ',\n  headers: {\n';
    Object.entries(headers).forEach(([key, value], index, arr) => {
      code += `    '${key}': '${value}'`;
      if (index < arr.length - 1) code += ',';
      code += '\n';
    });
    code += '  }';
  }

  // 바디 추가
  if (body) {
    try {
      // JSON인지 확인
      JSON.parse(body);
      code += `,\n  data: ${body}`;
    } catch {
      // JSON이 아닌 경우
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n  data: '${escaped}'`;
    }
  }

  code += '\n})\n  .then(response => console.log(response.data))\n  .catch(error => console.error(error));';

  return code;
}

// HTTP 요청을 fetch TypeScript 코드로 변환
export function generateFetchTS(request: CapturedRequest): string {
  const { method, url, headers, body } = request.request;

  let code = `interface ResponseData {\n  // TODO: Define response type\n}\n\n`;
  code += `fetch('${url}', {\n  method: '${method}'`;

  // 헤더 추가
  if (Object.keys(headers).length > 0) {
    code += ',\n  headers: {\n';
    Object.entries(headers).forEach(([key, value], index, arr) => {
      code += `    '${key}': '${value}'`;
      if (index < arr.length - 1) code += ',';
      code += '\n';
    });
    code += '  }';
  }

  // 바디 추가
  if (body) {
    try {
      // JSON인지 확인
      JSON.parse(body);
      code += `,\n  body: JSON.stringify(${body})`;
    } catch {
      // JSON이 아닌 경우
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n  body: '${escaped}'`;
    }
  }

  code += '\n})\n  .then((response: Response) => response.json())\n  .then((data: ResponseData) => console.log(data))\n  .catch((error: Error) => console.error(error));';

  return code;
}

// HTTP 요청을 axios TypeScript 코드로 변환
export function generateAxiosTS(request: CapturedRequest): string {
  const { method, url, headers, body } = request.request;

  let code = `import type { AxiosResponse, AxiosError } from 'axios';\n\n`;
  code += `interface ResponseData {\n  // TODO: Define response type\n}\n\n`;
  code += `axios<ResponseData>({\n  method: '${method}',\n  url: '${url}'`;

  // 헤더 추가
  if (Object.keys(headers).length > 0) {
    code += ',\n  headers: {\n';
    Object.entries(headers).forEach(([key, value], index, arr) => {
      code += `    '${key}': '${value}'`;
      if (index < arr.length - 1) code += ',';
      code += '\n';
    });
    code += '  }';
  }

  // 바디 추가
  if (body) {
    try {
      // JSON인지 확인
      JSON.parse(body);
      code += `,\n  data: ${body}`;
    } catch {
      // JSON이 아닌 경우
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n  data: '${escaped}'`;
    }
  }

  code += '\n})\n  .then((response: AxiosResponse<ResponseData>) => console.log(response.data))\n  .catch((error: AxiosError) => console.error(error));';

  return code;
}

// CodeType에 따라 적절한 코드 생성 함수 호출
export function generateCode(request: CapturedRequest, codeType: CodeType): string {
  switch (codeType) {
    case 'curl':
      return generateCurl(request);
    case 'fetch-js':
      return generateFetchJS(request);
    case 'axios-js':
      return generateAxiosJS(request);
    case 'fetch-ts':
      return generateFetchTS(request);
    case 'axios-ts':
      return generateAxiosTS(request);
    default:
      throw new Error(`Unknown code type: ${codeType}`);
  }
}
