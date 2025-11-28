import React from 'react';
import { Box, Text } from 'ink';
import type { CapturedRequest } from '../types/index.js';
import {
  messages,
  formatDuration,
  formatSize,
  getStatusDescription,
} from '../utils/messages.js';

interface DetailViewProps {
  request: CapturedRequest;
}

export function DetailView({ request }: DetailViewProps) {
  const { request: req, response: res, timing } = request;

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* 일반 정보 */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="yellow">
          {messages.details.tabs.general}
        </Text>
        <Text>
          {messages.details.general.url}: {req.url}
        </Text>
        <Text>
          {messages.details.general.method}: {req.method}
        </Text>
        {res && (
          <>
            <Text>
              {messages.details.general.status}: {res.status} {res.statusText}
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
          </>
        )}
      </Box>

      {/* 요청 헤더 */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="yellow">
          {messages.details.tabs.requestHeaders}
        </Text>
        {Object.entries(req.headers).map(([key, value]) => (
          <Text key={key}>
            <Text color="cyan">{key}</Text>: {value}
          </Text>
        ))}
      </Box>

      {/* 요청 본문 */}
      {req.body && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            {messages.details.tabs.requestPayload}
          </Text>
          <Text>{req.body}</Text>
        </Box>
      )}

      {/* 응답 본문 */}
      {res?.body && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            {messages.details.tabs.response}
          </Text>
          <Text wrap="wrap">{res.body.substring(0, 500)}</Text>
          {res.body.length > 500 && <Text dimColor>... (truncated)</Text>}
        </Box>
      )}

      {/* 타이밍 */}
      {res && (
        <Box flexDirection="column">
          <Text bold color="yellow">
            {messages.details.tabs.timing}
          </Text>
          <Text>
            {messages.details.timing.waiting}: {formatDuration(timing.waiting)}
          </Text>
          <Text>
            {messages.details.timing.contentDownload}: {formatDuration(timing.contentDownload)}
          </Text>
          <Text>
            {messages.details.timing.total}: {formatDuration(timing.total)}
          </Text>
        </Box>
      )}
    </Box>
  );
}
