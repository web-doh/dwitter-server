import rateLimit from "express-rate-limit";

import { config } from "./../config";

export default rateLimit({
  // fixed window 알고리즘 활용 (배열과 setInterval 활용)
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequest,
  // keyGenerator : (req, res) => 'dwitter' // 글로벌하게 사용하고 싶을 떄 (기본 설정은 ip)
});
