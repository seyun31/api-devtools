import React from 'react';
import { Box, Text } from 'ink';
import type { CapturedRequest } from '../types/index.js';
import { formatDuration, formatSize, formatStatus } from '../utils/messages.js';

interface NetworkTableProps {
  requests: CapturedRequest[];
  selectedIndex: number;
}

export function NetworkTable({ requests, selectedIndex }: NetworkTableProps) {
  return (
    <Box flexDirection="column">
      {/* 헤더 */}
      <Box>
        <Box width={8}>
          <Text bold>메서드</Text>
        </Box>
        <Box width={40}>
          <Text bold>URL</Text>
        </Box>
        <Box width={12}>
          <Text bold>상태</Text>
        </Box>
        <Box width={10}>
          <Text bold>크기</Text>
        </Box>
        <Box width={10}>
          <Text bold>시간</Text>
        </Box>
      </Box>

      {/* 구분선 */}
      <Text dimColor>{'─'.repeat(80)}</Text>

      {/* 요청 목록 */}
      {requests.map((req, index) => (
        <Box key={req.id}>
          <Box width={8}>
            <Text color={index === selectedIndex ? 'cyan' : undefined}>
              {index === selectedIndex ? '> ' : '  '}
              {req.request.method}
            </Text>
          </Box>
          <Box width={40}>
            <Text
              color={index === selectedIndex ? 'cyan' : undefined}
              wrap="truncate-end"
            >
              {req.request.url}
            </Text>
          </Box>
          <Box width={12}>
            <Text
              color={
                req.response
                  ? req.response.status >= 200 && req.response.status < 300
                    ? 'green'
                    : req.response.status >= 400
                    ? 'red'
                    : 'yellow'
                  : 'gray'
              }
            >
              {req.response ? formatStatus(req.response.status) : '⏳ 대기 중'}
            </Text>
          </Box>
          <Box width={10}>
            <Text>{req.response ? formatSize(req.response.size) : '-'}</Text>
          </Box>
          <Box width={10}>
            <Text>{req.response ? formatDuration(req.response.duration) : '-'}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
