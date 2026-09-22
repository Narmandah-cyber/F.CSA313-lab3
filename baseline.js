import http from 'k6/http';
import { sleep } from 'k6';
export const options = { vus: 20, duration: '1m' };
export default function () {
  const base = 'http://localhost:3000';
  http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  http.get(`${base}/report`, { tags: { name: 'report' } });
  http.post(`${base}/pay`, null, { tags: { name: 'pay' } });
  sleep(1);
}
