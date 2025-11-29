import type { CapturedRequest, TestFramework } from '../types/index.js';

// Jest 테스트 코드 생성
export function generateJestTest(request: CapturedRequest): string {
  const { method, url, body } = request.request;
  const { response } = request;

  let code = `import axios from 'axios';\n\n`;
  code += `describe('API Test - ${method} ${url}', () => {\n`;
  code += `  it('should return successful response', async () => {\n`;
  code += `    const response = await axios({\n`;
  code += `      method: '${method}',\n`;
  code += `      url: '${url}'`;

  if (body) {
    try {
      JSON.parse(body);
      code += `,\n      data: ${body}`;
    } catch {
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n      data: '${escaped}'`;
    }
  }

  code += `\n    });\n\n`;

  if (response) {
    code += `    expect(response.status).toBe(${response.status});\n`;

    if (response.body) {
      try {
        const bodyData = JSON.parse(response.body);
        if (typeof bodyData === 'object' && bodyData !== null) {
          code += `    expect(response.data).toMatchObject({\n`;
          code += `      // TODO: Add expected response structure\n`;
          code += `    });\n`;
        }
      } catch {
        // JSON이 아닌 경우
        code += `    expect(response.data).toBeDefined();\n`;
      }
    }
  } else {
    code += `    expect(response.status).toBe(200);\n`;
    code += `    expect(response.data).toBeDefined();\n`;
  }

  code += `  });\n`;

  // 에러 케이스 테스트
  code += `\n  it('should handle errors properly', async () => {\n`;
  code += `    try {\n`;
  code += `      await axios({\n`;
  code += `        method: '${method}',\n`;
  code += `        url: '${url}/invalid'`;
  if (body) {
    code += `,\n        data: ${body || '{}'}`;
  }
  code += `\n      });\n`;
  code += `    } catch (error) {\n`;
  code += `      expect(error).toBeDefined();\n`;
  code += `    }\n`;
  code += `  });\n`;
  code += `});\n`;

  return code;
}

// Vitest 테스트 코드 생성
export function generateVitestTest(request: CapturedRequest): string {
  const { method, url, body } = request.request;
  const { response } = request;

  let code = `import { describe, it, expect } from 'vitest';\n`;
  code += `import axios from 'axios';\n\n`;
  code += `describe('API Test - ${method} ${url}', () => {\n`;
  code += `  it('should return successful response', async () => {\n`;
  code += `    const response = await axios({\n`;
  code += `      method: '${method}',\n`;
  code += `      url: '${url}'`;

  if (body) {
    try {
      JSON.parse(body);
      code += `,\n      data: ${body}`;
    } catch {
      const escaped = body.replace(/'/g, "\\'").replace(/\n/g, '\\n');
      code += `,\n      data: '${escaped}'`;
    }
  }

  code += `\n    });\n\n`;

  if (response) {
    code += `    expect(response.status).toBe(${response.status});\n`;

    if (response.body) {
      try {
        const bodyData = JSON.parse(response.body);
        if (typeof bodyData === 'object' && bodyData !== null) {
          code += `    expect(response.data).toMatchObject({\n`;
          code += `      // TODO: Add expected response structure\n`;
          code += `    });\n`;
        }
      } catch {
        // JSON이 아닌 경우
        code += `    expect(response.data).toBeDefined();\n`;
      }
    }
  } else {
    code += `    expect(response.status).toBe(200);\n`;
    code += `    expect(response.data).toBeDefined();\n`;
  }

  code += `  });\n`;

  // 에러 케이스 테스트
  code += `\n  it('should handle errors properly', async () => {\n`;
  code += `    try {\n`;
  code += `      await axios({\n`;
  code += `        method: '${method}',\n`;
  code += `        url: '${url}/invalid'`;
  if (body) {
    code += `,\n        data: ${body || '{}'}`;
  }
  code += `\n      });\n`;
  code += `    } catch (error) {\n`;
  code += `      expect(error).toBeDefined();\n`;
  code += `    }\n`;
  code += `  });\n`;
  code += `});\n`;

  return code;
}

// TestFramework에 따라 적절한 테스트 코드 생성
export function generateTest(request: CapturedRequest, framework: TestFramework): string {
  switch (framework) {
    case 'jest':
      return generateJestTest(request);
    case 'vitest':
      return generateVitestTest(request);
    default:
      throw new Error(`Unknown test framework: ${framework}`);
  }
}
