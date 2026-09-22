// Лаб 3 — Алхам 6: Threshold-оо зориуд эвдсэн хувилбар (FAIL)
// Бай: зөвхөн локал сервер (server.js, http://localhost:3000)
// Босго бүрийг Алхам 1-ийн baseline хэмжилтээс (results/baseline-tagged.txt) гаргасан:
//   cart p95 = 1.83 мс, report p95 = 393.35 мс, pay error = 5.05%, checks = 98.31%
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20, duration: '1m',
  thresholds: {
    'http_req_duration{name:cart}':   ['p(95)<5'],     // Performance SLO: p95 < 5 мс
    'http_req_failed{name:pay}':      ['rate<0.08'],   // Reliability SLO: error rate < 8%
    'checks':                         ['rate>0.90'],   // Availability SLO: амжилтын хувь > 90%
    'http_req_duration{name:report}': ['p(95)<100'],   // ЗОРИУД ХАТУУ: сервер 200 мс-ээс хурдан хэзээ ч хариулдаггүй тул FAIL болно
  },
};

export default function () {
  const base = 'http://localhost:3000';
  const c = http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  const r = http.get(`${base}/report`,        { tags: { name: 'report' } });
  const p = http.post(`${base}/pay`, null,    { tags: { name: 'pay' } });
  check(c, { 'cart 200': (x) => x.status === 200 });
  check(r, { 'report 200': (x) => x.status === 200 });
  check(p, { 'pay 200': (x) => x.status === 200 });
  sleep(1);
}
