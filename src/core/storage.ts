import fs from 'fs';
import path from 'path';
import os from 'os';
import type { CapturedRequest } from '../types/index.js';

const STORAGE_DIR = path.join(os.homedir(), '.api-devtools');
const REQUESTS_FILE = path.join(STORAGE_DIR, 'requests.json');

interface SavedRequest {
  name: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  createdAt: number;
}

// 저장소 초기화
export function initStorage(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify([], null, 2));
  }
}

// 모든 저장된 요청 불러오기
export function loadRequests(): SavedRequest[] {
  initStorage();

  try {
    const data = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 요청 저장
export function saveRequest(name: string, request: CapturedRequest): void {
  initStorage();

  const requests = loadRequests();

  // 같은 이름이 있으면 덮어쓰기
  const existingIndex = requests.findIndex(r => r.name === name);

  const savedRequest: SavedRequest = {
    name,
    method: request.request.method,
    url: request.request.url,
    headers: request.request.headers,
    body: request.request.body,
    createdAt: Date.now(),
  };

  if (existingIndex >= 0) {
    requests[existingIndex] = savedRequest;
  } else {
    requests.push(savedRequest);
  }

  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

// 저장된 요청 불러오기
export function getRequest(name: string): SavedRequest | undefined {
  const requests = loadRequests();
  return requests.find(r => r.name === name);
}

// 저장된 요청 삭제
export function deleteRequest(name: string): boolean {
  initStorage();

  const requests = loadRequests();
  const filtered = requests.filter(r => r.name !== name);

  if (filtered.length === requests.length) {
    return false; // 찾지 못함
  }

  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
