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
  onExit: () => void;
}

export function App({ port, target, requests, onExit }: AppProps) {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  // 키보드 입력 처리
  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      onExit();
      exit();
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
          {messages.keyboard.shortcuts.upDown} | {messages.keyboard.shortcuts.enter} |{' '}
          {messages.keyboard.shortcuts.q}
        </Text>
      </Box>
    </Box>
  );
}
