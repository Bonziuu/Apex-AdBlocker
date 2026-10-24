// ChromeBlock – atrapa adsbygoogle.js (strona działa, ale reklamy się nie ładują)
(function () {
  'use strict';
  const queue = window.adsbygoogle;
  const stub = { loaded: true, push() {} };
  window.adsbygoogle = stub;
  if (Array.isArray(queue)) for (let i = 0; i < queue.length; i++) stub.push(queue[i]);
  const markFilled = () => {
    for (const ins of document.querySelectorAll('ins.adsbygoogle')) {
      ins.setAttribute('data-adsbygoogle-status', 'done');
      ins.setAttribute('data-ad-status', 'unfilled');
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', markFilled, { once: true });
  else markFilled();
})();
