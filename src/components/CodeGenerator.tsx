import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { CapturedRequest, CodeType, TestFramework } from '../types/index.js';
import { generateCode } from '../utils/codeGenerator.js';
import { generateTest } from '../utils/testGenerator.js';

interface CodeGeneratorProps {
  request: CapturedRequest;
  onExit: () => void;
}

type Step = 'library' | 'language' | 'test-framework' | 'result';
type Library = 'curl' | 'fetch' | 'axios' | 'test';
type Language = 'js' | 'ts';

export function CodeGenerator({ request, onExit }: CodeGeneratorProps) {
  const [step, setStep] = useState<Step>('library');
  const [library, setLibrary] = useState<Library | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [testFramework, setTestFramework] = useState<TestFramework | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      onExit();
      return;
    }

    if (input === 'b' && step !== 'library') {
      // 뒤로 가기
      if (step === 'result') {
        if (library === 'test') {
          setStep('test-framework');
        } else if (library === 'curl') {
          setStep('library');
        } else {
          setStep('language');
        }
      } else if (step === 'language' || step === 'test-framework') {
        setStep('library');
      }
      return;
    }

    // 라이브러리 선택
    if (step === 'library') {
      if (input === '1') {
        setLibrary('curl');
        const code = generateCode(request, 'curl');
        setGeneratedCode(code);
        setStep('result');
      } else if (input === '2') {
        setLibrary('fetch');
        setStep('language');
      } else if (input === '3') {
        setLibrary('axios');
        setStep('language');
      } else if (input === '4') {
        setLibrary('test');
        setStep('test-framework');
      }
    }
    // 언어 선택
    else if (step === 'language') {
      if (input === '1') {
        setLanguage('js');
        const codeType: CodeType = library === 'fetch' ? 'fetch-js' : 'axios-js';
        const code = generateCode(request, codeType);
        setGeneratedCode(code);
        setStep('result');
      } else if (input === '2') {
        setLanguage('ts');
        const codeType: CodeType = library === 'fetch' ? 'fetch-ts' : 'axios-ts';
        const code = generateCode(request, codeType);
        setGeneratedCode(code);
        setStep('result');
      }
    }
    // 테스트 프레임워크 선택
    else if (step === 'test-framework') {
      if (input === '1') {
        setTestFramework('jest');
        const code = generateTest(request, 'jest');
        setGeneratedCode(code);
        setStep('result');
      } else if (input === '2') {
        setTestFramework('vitest');
        const code = generateTest(request, 'vitest');
        setGeneratedCode(code);
        setStep('result');
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* 헤더 */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          코드 생성기
        </Text>
      </Box>

      {/* 요청 정보 */}
      <Box marginBottom={1}>
        <Text dimColor>
          {request.request.method} {request.request.url}
        </Text>
      </Box>

      {/* 라이브러리 선택 */}
      {step === 'library' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            코드 타입을 선택하세요:
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Text>1. curl 명령어</Text>
            <Text>2. fetch API</Text>
            <Text>3. axios</Text>
            <Text>4. 테스트 코드 생성</Text>
          </Box>
        </Box>
      )}

      {/* 언어 선택 */}
      {step === 'language' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            언어를 선택하세요:
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Text>1. JavaScript</Text>
            <Text>2. TypeScript</Text>
          </Box>
        </Box>
      )}

      {/* 테스트 프레임워크 선택 */}
      {step === 'test-framework' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            테스트 프레임워크를 선택하세요:
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Text>1. Jest</Text>
            <Text>2. Vitest</Text>
          </Box>
        </Box>
      )}

      {/* 생성된 코드 */}
      {step === 'result' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="green">
            생성된 코드:
          </Text>
          <Box
            marginTop={1}
            borderStyle="single"
            borderColor="green"
            padding={1}
            flexDirection="column"
          >
            <Text>{generatedCode}</Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>클립보드에 복사하려면 터미널에서 직접 선택하세요</Text>
          </Box>
        </Box>
      )}

      {/* 단축키 */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
        <Text dimColor>
          {step === 'library' && '1-4: 선택 | Q: 종료'}
          {step === 'language' && '1-2: 선택 | B: 뒤로 | Q: 종료'}
          {step === 'test-framework' && '1-2: 선택 | B: 뒤로 | Q: 종료'}
          {step === 'result' && 'B: 뒤로 | Q: 종료'}
        </Text>
      </Box>
    </Box>
  );
}
