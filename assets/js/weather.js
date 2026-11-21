/* ============================================================
   溺川夜雨 · 天气系统
   持续大暴雨 / 低频远处闪电 / 水面波动 / 访客控制
   分区策略：full(首页等) / soft(作品区自动减弱) / 手机端降级
   ============================================================ */

(function () {
  "use strict";

  const W = {
    canvas: null, ctx: null,
    drops: [], splashes: [],
    dpr: 1, w: 0, h: 0,
    zone: "full",
    lightningEl: null,
    lightTimer: null,
    running: true,
    reduce: false,
    audio: { ctx: null, rainSrc: null, rainGain: null, master: null },
    settings: { rainSound: false, thunder: true, rainIntensity: "full", waterRipple: "full", lowPerf: false }
  };

  const LS_KEY = "fn_weather";
  const isMobile = () => window.matchMedia("(max-width: 860px)").matches;

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      if (s) Object.assign(W.settings, s);
    } catch (e) { /* 忽略损坏数据 */ }
  }
  function saveSettings() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(W.settings)); } catch (e) {}
  }

  /* ---------- 雨幕 ---------- */

  function buildDrops() {
    const base = W.zone === "soft" ? 150 : 240;
    const factor = W.settings.rainIntensity === "reduce" ? 0.45 : 1;
    const count = Math.round((isMobile() ? base * 0.5 : base) * factor);
    W.drops = [];
    for (let i = 0; i < count; i++) {
      W.drops.push(makeDrop(Math.random() * W.h));
    }
  }

  function makeDrop(y) {
    const layer = Math.random();
    const depth = layer < 0.55 ? 0.4 : layer < 0.85 ? 0.7 : 1;   // 远中近三层
    return {
      x: Math.random() * (W.w + 120) - 60,
      y: y !== undefined ? y : -Math.random() * W.h,
      len: (14 + Math.random() * 22) * depth,
      speed: (13 + Math.random() * 11) * depth,
      depth,
      alpha: 0.12 + depth * 0.3
    };
  }

  function tick() {
    if (!W.running) return;
    const ctx = W.ctx;
    ctx.clearRect(0, 0, W.w, W.h);
    const soft = W.zone === "soft";
    const globalAlpha = soft ? 0.55 : 1;
    const drift = 2.2;   // 风向倾斜

    for (const d of W.drops) {
      d.x += drift * d.depth;
      d.y += d.speed;
      if (d.y > W.h) {
        if (Math.random() < 0.18 && !W.settings.lowPerf) spawnSplash(d.x, W.h);
        Object.assign(d, makeDrop(-30));
      }
      if (d.x > W.w + 60) d.x = -40;

      ctx.globalAlpha = d.alpha * globalAlpha;
      ctx.strokeStyle = d.depth > 0.8 ? "rgba(190,210,255,0.9)" : "rgba(130,160,230,0.75)";
      ctx.lineWidth = d.depth > 0.8 ? 1.3 : 1;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - drift * d.depth * 2.4, d.y - d.len);
      ctx.stroke();
    }

    // 浅溅
    for (let i = W.splashes.length - 1; i >= 0; i--) {
      const s = W.splashes[i];
      s.life -= 0.05;
      if (s.life <= 0) { W.splashes.splice(i, 1); continue; }
      ctx.globalAlpha = s.life * 0.4 * globalAlpha;
      ctx.strokeStyle = "rgba(150,190,255,0.8)";
      ctx.beginPath();
      ctx.arc(s.x, s.y, (1 - s.life) * 9, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  function spawnSplash(x, y) {
    if (W.splashes.length > 40) return;
    W.splashes.push({ x, y: y - Math.random() * 40, life: 1 });
  }

  /* ---------- 闪电（低频远处） ---------- */

  function scheduleLightning() {
    if (W.lightTimer) clearTimeout(W.lightTimer);
    if (W.settings.lowPerf || isMobile() || !W.settings.thunder) return;
    const soft = W.zone === "soft";
    const min = soft ? 30000 : 15000;
    const span = soft ? 60000 : 40000;
    W.lightTimer = setTimeout(() => {
      flashLightning();
      scheduleLightning();
    }, min + Math.random() * span);
  }

  function flashLightning() {
    const el = W.lightningEl;
    if (!el) return;
    const seq = [0.35, 0.05, 0.5, 0.1, 0.25, 0];
    let i = 0;
    (function step() {
      if (i >= seq.length) { el.style.opacity = 0; return; }
      el.style.transition = "opacity " + (i % 2 ? 90 : 160) + "ms ease";
      el.style.opacity = seq[i];
      i++;
      setTimeout(step, i % 2 ? 110 : 180);
    })();
    if (W.settings.rainSound) playThunder();
  }

  /* ---------- 环境音（Web Audio 本地合成雨声 / 雷声，非录音） ---------- */

  function ensureAudio() {
    if (W.audio.ctx) return W.audio.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    W.audio.ctx = new AC();
    W.audio.master = W.audio.ctx.createGain();
    W.audio.master.gain.value = 0.5;
    W.audio.master.connect(W.audio.ctx.destination);
    return W.audio.ctx;
  }

  function startRainSound() {
    const ctx = ensureAudio();
    if (!ctx || W.audio.rainSrc) return;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1100;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 320;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(W.audio.master);
    src.start();
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.4);
    W.audio.rainSrc = src; W.audio.rainGain = gain;
  }

  function stopRainSound() {
    if (!W.audio.rainSrc) return;
    const ctx = W.audio.ctx;
    W.audio.rainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    const src = W.audio.rainSrc;
    setTimeout(() => { try { src.stop(); } catch (e) {} }, 900);
    W.audio.rainSrc = null;
  }

  function playThunder() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const len = ctx.sampleRate * 2.4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * Math.min(1, t * 24);
    }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 160;
    const g = ctx.createGain(); g.gain.value = 0.55;
    src.connect(lp); lp.connect(g); g.connect(W.audio.master);
    src.start();
  }

  /* ---------- 控制面板 ---------- */

  function buildControls() {
    const ctl = document.createElement("div");
    ctl.className = "weather-ctl";
    ctl.innerHTML =
      '<button class="wc-toggle" title="雨势控制" aria-label="雨势控制">☔</button>' +
      '<div class="wc-panel panel">' +
      '  <h4>雨势控制</h4>' +
      '  <div class="wc-row"><span>环境雨声</span><i class="switch" data-k="rainSound"></i></div>' +
      '  <div class="wc-row"><span>远处雷声</span><i class="switch" data-k="thunder"></i></div>' +
      '  <div class="wc-row"><span>雨幕强度</span>' +
      '    <button class="chip sm" data-k="rainIntensity">完整</button></div>' +
      '  <div class="wc-row"><span>水面波动</span>' +
      '    <button class="chip sm" data-k="waterRipple">完整</button></div>' +
      '  <div class="wc-row"><span>低性能模式</span><i class="switch" data-k="lowPerf"></i></div>' +
      '  <p class="wc-note">这些选项只影响天气与动效，不会影响录音播放，也不会改变作品开放状态。</p>' +
      "</div>";
    document.body.appendChild(ctl);

    const panel = ctl.querySelector(".wc-panel");
    const toggle = ctl.querySelector(".wc-toggle");
    toggle.addEventListener("click", () => panel.classList.toggle("on"));

    ctl.querySelectorAll(".switch").forEach(sw => {
      const k = sw.dataset.k;
      sw.classList.toggle("on", !!W.settings[k]);
      sw.addEventListener("click", () => {
        W.settings[k] = !W.settings[k];
        sw.classList.toggle("on", W.settings[k]);
        apply(); saveSettings();
      });
    });
    ctl.querySelectorAll(".chip[data-k]").forEach(btn => {
      const k = btn.dataset.k;
      btn.textContent = W.settings[k] === "full" ? "完整" : "减弱";
      btn.addEventListener("click", () => {
        W.settings[k] = W.settings[k] === "full" ? "reduce" : "full";
        btn.textContent = W.settings[k] === "full" ? "完整" : "减弱";
        apply(); saveSettings();
      });
    });
  }

  function apply() {
    const s = W.settings;
    document.body.classList.toggle("lowperf", !!s.lowPerf);
    document.body.classList.toggle("reducefx", s.waterRipple === "reduce");
    const ripple = document.querySelector(".ripple");
    if (ripple) {
      ripple.style.display = (s.lowPerf || s.waterRipple === "reduce" && isMobile()) ? "none" : "";
      ripple.style.animation = s.waterRipple === "reduce" ? "none" : "";
      if (s.waterRipple === "reduce") ripple.style.opacity = ".45";
      else ripple.style.opacity = "";
    }
    if (s.rainSound) startRainSound(); else stopRainSound();
    buildDrops();
    scheduleLightning();
    W.running = !s.lowPerf;
    if (s.lowPerf && W.ctx) W.ctx.clearRect(0, 0, W.w, W.h);
  }

  /* ---------- 初始化 ---------- */

  function init() {
    loadSettings();

    // 底层氛围与画布
    const atmo = document.createElement("div");
    atmo.className = "atmo";
    document.body.prepend(atmo);

    const ripple = document.createElement("div");
    ripple.className = "ripple";
    document.body.appendChild(ripple);

    const lightning = document.createElement("div");
    lightning.id = "lightning";
    document.body.appendChild(lightning);
    W.lightningEl = lightning;

    const canvas = document.createElement("canvas");
    canvas.id = "rainCanvas";
    document.body.appendChild(canvas);
    W.canvas = canvas; W.ctx = canvas.getContext("2d");

    function resize() {
      W.dpr = Math.min(window.devicePixelRatio || 1, 2);
      W.w = window.innerWidth; W.h = window.innerHeight;
      canvas.width = W.w * W.dpr; canvas.height = W.h * W.dpr;
      canvas.style.width = W.w + "px"; canvas.style.height = W.h + "px";
      W.ctx.setTransform(W.dpr, 0, 0, W.dpr, 0, 0);
      buildDrops();
    }
    window.addEventListener("resize", resize);
    resize();

    W.zone = document.body.dataset.zone || "full";
    buildControls();
    apply();
    requestAnimationFrame(tick);

    // 首屏背景图（site-data 配置后自动显示）
    if (window.SITE_DATA && SITE_DATA.assets && SITE_DATA.assets.heroBg) {
      const img = document.createElement("div");
      img.className = "hero-bg-img";
      img.style.backgroundImage = 'url("' + SITE_DATA.assets.heroBg + '")';
      document.body.appendChild(img);
      const pre = new Image();
      pre.onload = () => img.classList.add("on");
      pre.src = SITE_DATA.assets.heroBg;
    }
  }

  window.NichuanWeather = {
    init,
    apply,
    toggleRainSound(on) {
      W.settings.rainSound = !!on;
      apply();
      try { localStorage.setItem(LS_KEY, JSON.stringify(W.settings)); } catch (e) {}
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
