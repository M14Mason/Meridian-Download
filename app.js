// Points each download button at the newest installer and highlights the one for this computer.
(function () {
  var REPO = 'M14Mason/Meridian-Download';
  var match = { 'mac-arm64': /mac-arm64\.dmg$/, 'mac-x64': /mac-x64\.dmg$/, windows: /windows-setup\.exe$/, linux: /\.AppImage$/ };
  var ua = navigator.userAgent;
  var mine = /Windows/.test(ua) ? 'windows' : /Mac OS X|Macintosh/.test(ua) ? 'mac-arm64' : /Linux/.test(ua) ? 'linux' : '';
  var buttons = document.querySelectorAll('[data-os]');
  buttons.forEach(function (b) { if (b.getAttribute('data-os') === mine) b.classList.add('mine'); });
  fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { headers: { accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      var ver = document.getElementById('ver');
      if (!rel) { ver.textContent = 'Latest version: see the releases page.'; return; }
      ver.textContent = 'Latest version: ' + rel.tag_name + ' (' + new Date(rel.published_at).toLocaleDateString() + ')';
      buttons.forEach(function (b) {
        var re = match[b.getAttribute('data-os')];
        var a = (rel.assets || []).filter(function (x) { return re.test(x.name); })[0];
        if (a) b.href = a.browser_download_url;
      });
    })
    .catch(function () { document.getElementById('ver').textContent = 'Latest version: see the releases page.'; });
  var clock = document.getElementById('clock');
  function tick() { clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  tick(); setInterval(tick, 1000);
})();
