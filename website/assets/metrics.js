// Fetch and update real-time GitHub Star & npm Download metrics
(function initMetrics() {
  function formatMetric(num) {
    if (!num || isNaN(num)) return null;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(num);
  }

  // 1. Fetch GitHub Stars
  fetch('https://api.github.com/repos/sorleed/sorleed')
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      const stars = data.stargazers_count;
      if (typeof stars === 'number') {
        const starEls = document.querySelectorAll('[data-github-stars]');
        starEls.forEach(el => {
          el.textContent = formatMetric(stars);
        });
      }
    })
    .catch(() => {});

  // 2. Fetch npm Downloads (combining @sorleed/react and @sorleed/cli)
  Promise.all([
    fetch('https://api.npmjs.org/downloads/point/last-month/@sorleed/react').then(r => r.ok ? r.json() : { downloads: 0 }).catch(() => ({ downloads: 0 })),
    fetch('https://api.npmjs.org/downloads/point/last-month/@sorleed/cli').then(r => r.ok ? r.json() : { downloads: 0 }).catch(() => ({ downloads: 0 }))
  ]).then(([reactData, cliData]) => {
    const totalDownloads = (reactData.downloads || 0) + (cliData.downloads || 0);
    if (totalDownloads > 0) {
      const npmEls = document.querySelectorAll('[data-npm-downloads]');
      npmEls.forEach(el => {
        el.textContent = formatMetric(totalDownloads);
      });
    }
  }).catch(() => {});
})();
