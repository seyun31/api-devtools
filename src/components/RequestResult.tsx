import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import type { CapturedRequest } from '../types/index.js';
import {
  messages,
  formatDuration,
  formatSize,
  formatStatus,
  getStatusDescription,
} from '../utils/messages.js';
import { CodeGenerator } from './CodeGenerator.js';

interface RequestResultProps {
  request: CapturedRequest;
  onSave?: (name: string) => void;
  onExit: () => void;
}

export function RequestResult({ request, onSave, onExit }: RequestResultProps) {
  const { exit } = useApp();
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);

  const { request: req, response: res, error } = request;

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      onExit();
      exit();
    }

    if (input === 'f') {
      setShowFullResponse(!showFullResponse);
    }

    if (input === 's' && onSave) {
      onSave('saved-request');
    }

    if (input === 'c') {
      setShowCodeGenerator(true);
    }
  });

  // CodeGenerator 모드일 때
  if (showCodeGenerator) {
    return <CodeGenerator request={request} onExit={() => setShowCodeGenerator(false)} />;
  }

  // 기본 화면
  return (
    <Box flexDirection="column" padding={1}>
      {/* 헤더 */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {messages.app.title}
        </Text>
      </Box>

      {/* 요청 정보 */}
      <Box marginBottom={1} flexDirection="column">
        <Text>
          <Text bold color="yellow">
            {req.method}
          </Text>{' '}
          {req.url}
        </Text>
      </Box>

      {/* 응답 상태 */}
      {res && (
        <Box marginBottom={1} flexDirection="column">
          <Text>
            {messages.details.general.status}: {formatStatus(res.status)} {res.statusText}
          </Text>
          {getStatusDescription(res.status) && (
            <Text color="cyan">💡 {getStatusDescription(res.status)}</Text>
          )}
          <Text>
            {messages.details.general.responseTime}: {formatDuration(res.duration)}
          </Text>
          <Text>
            {messages.details.general.size}: {formatSize(res.size)}
          </Text>
        </Box>
      )}

      {/* 에러 */}
      {error && (
        <Box marginBottom={1}>
          <Text color="red">❌ {error}</Text>
        </Box>
      )}

      {/* 응답 본문 */}
      {res?.body && (
        <Box marginBottom={1} flexDirection="column">
          <Text bold color="yellow">
            {messages.details.tabs.response}:
          </Text>
          <Box
            borderStyle="single"
            borderColor="gray"
            padding={1}
            flexDirection="column"
          >
            {showFullResponse ? (
              <Text wrap="wrap">{res.body}</Text>
            ) : (
              <>
                <Text wrap="wrap">{res.body.substring(0, 500)}</Text>
                {res.body.length > 500 && (
                  <Text dimColor>
                    ... ({res.body.length - 500} more characters)
                  </Text>
                )}
              </>
            )}
          </Box>
        </Box>
      )}

      {/* 단축키 */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
        <Text dimColor>
          F: 전체 응답 보기/접기 | C: 코드 생성 | S: 저장 | Q: 종료
        </Text>
      </Box>
    </Box>
  );
}
