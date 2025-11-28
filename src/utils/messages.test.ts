import { describe, it, expect } from 'vitest';
import {
  formatSize,
  formatDuration,
  formatStatus,
  getStatusDescription,
} from './messages';

describe('formatSize', () => {
  it('formats bytes correctly', () => {
    expect(formatSize(100)).toBe('100B');
    expect(formatSize(512)).toBe('512B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatSize(1024)).toBe('1.0KB');
    expect(formatSize(2048)).toBe('2.0KB');
    expect(formatSize(1536)).toBe('1.5KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatSize(1024 * 1024)).toBe('1.0MB');
    expect(formatSize(2 * 1024 * 1024)).toBe('2.0MB');
    expect(formatSize(1.5 * 1024 * 1024)).toBe('1.5MB');
  });
});

describe('formatDuration', () => {
  it('formats milliseconds when less than 1 second', () => {
    expect(formatDuration(100)).toBe('100ms');
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('formats seconds when 1 second or more', () => {
    expect(formatDuration(1000)).toBe('1.00s');
    expect(formatDuration(1500)).toBe('1.50s');
    expect(formatDuration(2345)).toBe('2.35s');
  });
});

describe('formatStatus', () => {
  it('formats 2xx status codes with checkmark', () => {
    expect(formatStatus(200)).toBe('✓ 200');
    expect(formatStatus(201)).toBe('✓ 201');
    expect(formatStatus(204)).toBe('✓ 204');
  });

  it('formats 3xx status codes with redirect arrow', () => {
    expect(formatStatus(301)).toBe('↪ 301');
    expect(formatStatus(302)).toBe('↪ 302');
    expect(formatStatus(304)).toBe('↪ 304');
  });

  it('formats 4xx status codes with warning', () => {
    expect(formatStatus(400)).toBe('⚠️ 400');
    expect(formatStatus(401)).toBe('⚠️ 401');
    expect(formatStatus(404)).toBe('⚠️ 404');
  });

  it('formats 5xx status codes with error', () => {
    expect(formatStatus(500)).toBe('❌ 500');
    expect(formatStatus(502)).toBe('❌ 502');
    expect(formatStatus(503)).toBe('❌ 503');
  });

  it('formats other status codes without emoji', () => {
    expect(formatStatus(100)).toBe('100');
    expect(formatStatus(199)).toBe('199');
  });
});

describe('getStatusDescription', () => {
  it('returns description for 4xx client errors', () => {
    expect(getStatusDescription(400)).toContain('Bad Request');
    expect(getStatusDescription(401)).toContain('Unauthorized');
    expect(getStatusDescription(403)).toContain('Forbidden');
    expect(getStatusDescription(404)).toContain('Not Found');
  });

  it('returns description for 5xx server errors', () => {
    expect(getStatusDescription(500)).toContain('Internal Server Error');
    expect(getStatusDescription(502)).toContain('Bad Gateway');
    expect(getStatusDescription(503)).toContain('Service Unavailable');
    expect(getStatusDescription(504)).toContain('Gateway Timeout');
  });

  it('returns empty string for undefined status codes', () => {
    expect(getStatusDescription(200)).toBe('');
    expect(getStatusDescription(301)).toBe('');
    expect(getStatusDescription(999)).toBe('');
  });
});
