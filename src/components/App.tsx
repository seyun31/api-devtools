import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { NetworkTable } from './NetworkTable.js';
import { DetailView } from './DetailView.js';
import type { CapturedRequest } from '../types/index.js';
import { messages } from '../utils/messages.js';

interface AppProps {
  port: number;
  target?: string;
  requests: CapturedRequest[];
  onSave?: (request: CapturedRequest) => void;
  onExit: () => void;
}

export function App({ port, target, requests, onSave, onExit }: AppProps) {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  // 키보드 입력 처리
  useInput((input, key) => {
    // Q 또는 Ctrl+C: 프로그램 종료
    if (input === 'q' || (key.ctrl && input === 'c')) {
      onExit();
      exit();
    }

    // 저장 (상세 보기에서만)
    if (input === 's' && showDetail && onSave && requests[selectedIndex]) {
      onSave(requests[selectedIndex]);
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setSelectedIndex(prev => Math.min(requests.length - 1, prev + 1));
    }

    if (key.return) {
      setShowDetail(!showDetail);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* 헤더 */}
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="cyan">
          {messages.app.title}
        </Text>
        <Text>{messages.app.listening(port)}</Text>
        {target && <Text>{messages.app.proxy(`localhost:${port}`, target)}</Text>}
      </Box>

      {/* 네트워크 테이블 */}
      <Box marginBottom={1} flexDirection="column">
        <Text bold>{messages.network.title}</Text>
        {requests.length === 0 ? (
          <Text color="gray">{messages.network.noRequests}</Text>
        ) : (
          <NetworkTable requests={requests} selectedIndex={selectedIndex} />
        )}
      </Box>

      {/* 상세 정보 */}
      {showDetail && requests[selectedIndex] && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>{messages.details.title}</Text>
          <DetailView request={requests[selectedIndex]} />
        </Box>
      )}

      {/* 단축키 도움말 */}
      <Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
        <Text dimColor>
          {showDetail ? (
            <>S: 저장 | Q: 종료</>
          ) : (
            <>
              {messages.keyboard.shortcuts.upDown} | {messages.keyboard.shortcuts.enter} |{' '}
              {messages.keyboard.shortcuts.q}
            </>
          )}
        </Text>
      </Box>
    </Box>
  );
}
