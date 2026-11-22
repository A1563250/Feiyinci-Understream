/* ============================================================
   溺川夜雨 · 心轨刻度（本地羁绊系统）
   不登录、不上传、不同步；数据保存在浏览器 localStorage。
   核心作品永不锁定，羁绊只解锁非必要彩蛋。
   ============================================================ */

(function () {
  "use strict";

  const LS_KEY = "fn_bond";
  const LEVELS = (window.SITE_DATA && SITE_DATA.bond && SITE_DATA.bond.levels) ? SITE_DATA.bond.levels : [];
  const RULES  = (window.SITE_DATA && SITE_DATA.bond && SITE_DATA.bond.rules)  ? SITE_DATA.bond.rules  : [];
  const FALLBACK_LEVEL = { lv: 1, name: "溺途访者", min: 0,
    feedback: "你刚从雨幕外侧抵达。", unlock: "雨夜问候" };

  const today = () => new Date().toISOString().slice(0, 10);

  function blank() {
    return {
      level: 1, points: 0,
      firstVisit: "", lastVisit: "",
      themesSeen: [],
      worksSeen: {},        // { '2025-xx-xx': [workId...] }
      recordingsPlayed: {},
      dailyDone: {},        // { '2025-xx-xx': { about_read: true, ... } }
      onceDone: { first_visit: false },
      readMessages: []
    };
  }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY));
      if (raw && typeof raw === "object") return Object.assign(blank(), raw);
    } catch (e) {}
    return blank();
  }

  function save(state) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function levelOf(points) {
    let lv = 1;
    for (const L of LEVELS) if (points >= L.min) lv = L.lv;
    return lv;
  }

  const listeners = [];
  /* ---------- 事件入口 ----------
     award('first_visit')
     award('theme_first', 'rain_port')
     award('work_view', 'work_01')
     award('about_read') / award('msg_reply')
     award('rec_play', 'rec_01')
     award('contact_view')
     award('daily_return')
  ---------------------------------- */

  function award(event, itemId) {
    const st = load();
    const d = today();
    const rule = RULES.find(r => r.key === event);
    if (!rule) return null;

    let granted = false;

    if (rule.once === true) {
      if (!st.onceDone[event]) { st.onceDone[event] = true; granted = true; }
    } else if (rule.once === "perTheme") {
      if (!st.themesSeen.includes(itemId)) { st.themesSeen.push(itemId); granted = true; }
    } else if (rule.once === "perDayPerItem") {
      st.worksSeen[d] = st.worksSeen[d] || [];
      const bag = event === "rec_play" ? (st.recordingsPlayed[d] = st.recordingsPlayed[d] || []) : st.worksSeen[d];
      if (!bag.includes(itemId)) { bag.push(itemId); granted = true; }
    } else { // perDay
      st.dailyDone[d] = st.dailyDone[d] || {};
      if (!st.dailyDone[d][event]) { st.dailyDone[d][event] = true; granted = true; }
    }

    if (!granted) return null;

    st.points += rule.pts;
    const newLv = levelOf(st.points);
    const leveled = newLv > st.level;
    st.level = newLv;
    save(st);

    const result = { pts: rule.pts, label: rule.label, points: st.points, level: newLv, leveled };
    listeners.forEach(fn => { try { fn(result); } catch (e) {} });
    return result;
  }

  /* ---------- 首访 / 回访结算 ---------- */

  function settleVisit() {
    const st = load();
    const d = today();
    st.lastVisit = st.lastVisit || "";
    save(st);
    if (!st.firstVisit) {
      const s2 = load();
      s2.firstVisit = d;
      save(s2);
      award("first_visit");
      return "first";
    }
    if (st.lastVisit !== d) {
      const s2 = load();
      s2.lastVisit = d;
      save(s2);
      award("daily_return");
      return "return";
    }
    return "same";
  }

  function get() { return load(); }
  function getLevel() {
    if (!LEVELS.length) return FALLBACK_LEVEL;
    const st = load();
    return LEVELS.find(L => L.lv === st.level) || LEVELS[0] || FALLBACK_LEVEL;
  }
  function nextLevel() {
    if (!LEVELS.length) return null;
    const st = load();
    return LEVELS.find(L => L.lv === st.level + 1) || null;
  }
  function readMessage(id) {
    const st = load();
    if (!st.readMessages.includes(id)) {
      st.readMessages.push(id);
      save(st);
    }
  }
  function hasRead(id) { return load().readMessages.includes(id); }
  function onLevel(fn) { listeners.push(fn); }
  function clearAll() {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
  }

  window.BondSys = {
    award, settleVisit, get, getLevel, nextLevel,
    readMessage, hasRead, onLevel, clearAll,
    levels: LEVELS, rules: RULES
  };
})();
