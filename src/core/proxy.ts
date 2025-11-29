import http from 'http';
import httpProxy from 'http-proxy';
import { EventEmitter } from 'events';
import type { CapturedRequest } from '../types/index.js';

export class ProxyServer extends EventEmitter {
  private server?: http.Server;
  private proxy: httpProxy;
  private port: number;
  private target?: string;

  constructor(port: number, target?: string) {
    super();
    this.port = port;
    this.target = target;
    this.proxy = httpProxy.createProxyServer({});
  }

  async start(): Promise<void> {
    this.server = http.createServer((req, res) => {
      const startTime = Date.now();
      const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

      // 요청 정보 캡처
      const capturedRequest: CapturedRequest = {
        id: requestId,
        request: {
          id: requestId,
          method: req.method ?? 'GET',
          url: req.url ?? '/',
          headers: req.headers as Record<string, string>,
          timestamp: Date.now(),
        },
        timing: {
          requestSent: 0,
          waiting: 0,
          contentDownload: 0,
          total: 0,
        },
      };

      // 요청 본문 캡처
      let requestBody = '';
      req.on('data', (chunk: Buffer) => {
        requestBody += chunk.toString();
      });

      req.on('end', () => {
        if (requestBody) {
          capturedRequest.request.body = requestBody;
        }
      });

      // 응답 인터셉트
      const originalWrite = res.write.bind(res);
      const originalEnd = res.end.bind(res);
      let responseBody = '';

      res.write = new Proxy(originalWrite, {
        apply: (target, thisArg, args: Parameters<typeof res.write>) => {
          const chunk = args[0] as Buffer | string | undefined;
          if (chunk) {
            responseBody += chunk.toString();
          }
          return Reflect.apply(target, thisArg, args);
        },
      }) as typeof res.write;

      res.end = new Proxy(originalEnd, {
        apply: (target, thisArg, args: Parameters<typeof res.end>) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          const chunk = args[0] as Buffer | string | undefined;
          if (chunk) {
            responseBody += chunk.toString();
          }

          capturedRequest.response = {
            status: res.statusCode ?? 200,
            statusText: res.statusMessage ?? 'OK',
            headers: res.getHeaders() as Record<string, string>,
            body: responseBody,
            size: Buffer.byteLength(responseBody),
            duration,
          };

          capturedRequest.timing = {
            requestSent: 0,
            waiting: duration * 0.7, // 대략적인 TTFB
            contentDownload: duration * 0.3,
            total: duration,
          };

          // 이벤트 발생
          this.emit('request', capturedRequest);

          return Reflect.apply(target, thisArg, args);
        },
      }) as typeof res.end;

      // 프록시 또는 직접 응답
      if (this.target) {
        // 타겟 URL에서 호스트 추출
        const targetUrl = new URL(this.target);

        // 헤더 수정 (host를 타겟 서버로 변경)
        req.headers.host = targetUrl.host;

        this.proxy.web(
          req,
          res,
          {
            target: this.target,
            changeOrigin: true, // Origin 헤더 자동 변경
            autoRewrite: true,
          },
          err => {
            if (err) {
              capturedRequest.error = err.message;
              this.emit('request', capturedRequest);
              res.writeHead(502);
              res.end('Bad Gateway');
            }
          }
        );
      } else {
        // 타겟이 없으면 404 응답
        res.writeHead(404);
        res.end('No target specified');
      }
    });

    return new Promise((resolve, reject) => {
      this.server?.listen(this.port, () => {
        resolve();
      });
      this.server?.on('error', reject);
    });
  }

  stop(): void {
    this.server?.close();
    this.proxy.close();
  }
}
