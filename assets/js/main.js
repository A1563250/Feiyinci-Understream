/* ============================================================
   溺川夜雨 · 主交互脚本
   导航注入 / 加载页 / 首访提示 / 角落状态 / 页面级渲染
   ============================================================ */

(function () {
  "use strict";

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const body = document.body;
  const PAGE = body.dataset.page || "";

  /* ---------- 提示条 ---------- */

  let toastTimer = null;
  function toast(msg, gold) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.toggle("gold", !!gold);
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("on"), 3200);
  }
  window.nichuanToast = toast;

  /* ---------- 通用导航 / 页脚 ---------- */

  const NAV = [
    { href: "index.html",    t: "启程",     s: "首页" },
    { href: "gallery.html",  t: "映画馆藏", s: "作品" },
    { href: "about.html",    t: "溺川档案", s: "关于" },
    { href: "messages.html", t: "未达回声", s: "留言" },
    { href: "radio.html",    t: "雨夜频段", s: "录音" },
    { href: "bond.html",     t: "心轨刻度", s: "羁绊" }
  ];

  function buildShell() {
    const nav = document.createElement("header");
    nav.className = "topnav";
    nav.innerHTML =
      '<a class="brand" href="index.html"><b>溺川夜雨</b><span>NICHUAN · RAIN ARCHIVE</span></a>' +
      '<button id="navToggle" aria-label="菜单">☰</button>' +
      '<nav class="navlinks">' +
      NAV.map(n => '<a href="' + n.href + '" data-nav="' + n.href + '">' +
        '<span class="t">' + n.t + '</span><span class="s">' + n.s + '</span></a>').join("") +
      "</nav>";
    document.querySelector(".stage").prepend(nav);

    const foot = document.createElement("footer");
    foot.className = "footer";
    foot.innerHTML =
      "<div>© 妃音·辞 · 溺川影像档案</div>" +
      '<div class="fline">溺川今夜有雨，馆藏暂未关闭。</div>' +
      '<div class="fline">不公开手机号、私人微信与现实住址。</div>';
    document.querySelector(".stage").appendChild(foot);

    $$(".navlinks a").forEach(a => {
      if (a.dataset.nav === location.pathname.split("/").pop() ||
          (PAGE === "home" && a.dataset.nav === "index.html")) a.classList.add("cur");
    });

    const tg = $("#navToggle");
    if (tg) tg.addEventListener("click", () => $(".navlinks").classList.toggle("open"));
  }

  /* ---------- 角落状态 + 等级反馈 ---------- */

  function buildCorner() {
    const el = document.createElement("div");
    el.className = "corner-status";
    el.innerHTML =
      '<div class="status-chip"><span class="dot"></span>' +
      "<span>雨势 <b>暴雨</b></span><span>雷频 <b>低</b></span></div>" +
      '<div class="status-chip"><span>身份</span>' +
      '<a class="lv" href="bond.html" title="心轨刻度">溺途访者</a></div>';
    document.body.appendChild(el);
    refreshCorner();
  }

  function refreshCorner() {
    if (!window.BondSys) return;
    const L = BondSys.getLevel();
    const link = $(".corner-status .lv");
    if (link) link.textContent = "Lv." + L.lv + " · " + L.name;
  }

  function bindLevelFx() {
    if (!window.BondSys) return;
    BondSys.onLevel(res => {
      refreshCorner();
      if (res.leveled) {
        const L = BondSys.getLevel();
        toast("心轨刻度提升 · Lv." + L.lv + " " + L.name + " —— " + L.unlock + " 已解锁", true);
      } else if (res.label) {
        toast("已记录：" + res.label + " · 心轨 +" + res.pts);
      }
    });
  }

  /* ---------- 加载页 ---------- */

  function buildLoader() {
    const el = document.createElement("div");
    el.id = "loader";
    el.innerHTML =
      "<h2>溺川正在落雨</h2>" +
      '<div class="lsub">信号穿过潮湿的楼群，影像档案正在重新显影。</div>' +
      '<div class="bar"><i></i></div>' +
      '<div class="tick">正在校准雨夜坐标……</div>';
    document.body.appendChild(el);

    const ticks = [
      "正在校准雨夜坐标……",
      "正在接收水面下的光……",
      "正在擦去玻璃上的雾……",
      "正在拼接遗失的映像……",
      "溺川的雨势逐渐清晰……"
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % ticks.length;
      const tk = $("#loader .tick");
      if (tk) tk.textContent = ticks[i];
    }, 900);
    setTimeout(() => {
      clearInterval(t);
      el.classList.add("off");
    }, 2100);
  }

  /* ---------- 首次进入提示 ---------- */

  function buildFirstMask() {
    const st = window.BondSys ? BondSys.get() : null;
    if (!st || st.firstVisit) return;
    const el = document.createElement("div");
    el.id = "firstMask";
    el.innerHTML =
      '<div class="card panel">' +
      "<p>今夜，溺川与你的记忆短暂重叠。</p>" +
      "<p>这里收藏着被雨水洗净的城市、梦境、角色与旧日切片。若你愿意继续前行，" +
      "脚步会被记录在本地的雨痕中；这些记录不会被上传，也不会用于追踪身份。</p>" +
      "<small>仅保存在你的浏览器本地 · 不登录 · 不同步</small>" +
      '<div class="row">' +
      '<a class="btn primary" href="gallery.html">进入溺川</a>' +
      '<a class="btn" href="about.html">先了解这座城市</a>' +
      "</div></div>";
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("on"), 2300);
  }

  /* ================= 首页 ================= */

  function initHome() {
    // 人物照片（未配置时保持剪影占位）
    if (window.SITE_DATA && SITE_DATA.assets.portrait) {
      const photo = $("#portraitPhoto");
      if (photo) {
        photo.style.backgroundImage = 'url("' + SITE_DATA.assets.portrait + '")';
        const pre = new Image();
        pre.onload = () => photo.classList.add("on");
        pre.src = SITE_DATA.assets.portrait;
        const tag = $("#portraitTag");
        if (tag) tag.textContent = "拾遗者影像 · 已收录";
      }
    }
    if (window.BondSys) {
      BondSys.award("daily_return");   // 首页进入也计回访（settleVisit 已处理首访）
    }
  }

  /* ================= 作品集 ================= */

  function initGallery() {
    const themeNote = $("#themeNote");
    const track = $("#track");
    const dots = $("#dots");
    let filter = "all";

    function themeOf(id) {
      return SITE_DATA.themes.find(t => t.id === id) || { name: "未知区域" };
    }

    function cardHTML(w) {
      const t = themeOf(w.theme);
      const hasImg = !!w.image;
      const isLost = !w.isDemo && !hasImg;
      return (
        '<article class="wcard" data-id="' + w.id + '" data-theme="' + w.theme + '">' +
        '<div class="thumb">' +
        (hasImg ? '<img src="' + w.image + '" alt="' + w.title + '" loading="lazy">' :
          '<div class="ph"><div class="glyph">' + (w.isDemo ? "映" : "遗") + "</div>" +
          "<small>" + (w.isDemo ? "临时映像 · 待生成" : "尚未送抵溺川") + "</small></div>") +
        '<span class="badge ' + (w.isDemo ? "demo" : "lost") + '">' +
        (w.isDemo ? "临时映像 / DEMO" : isLost ? "遗失的光" : "馆藏") + "</span>" +
        "</div>" +
        '<div class="meta"><h3>' + w.title + "</h3>" +
        '<div class="mrow"><span>' + t.name + "</span><span>" +
        (w.year || (w.isDemo ? "年份待定" : "待补")) + "</span></div></div>" +
        '<div class="hover-hint">查看映像</div>' +
        "</article>"
      );
    }

    function render() {
      const list = filter === "all" ? SITE_DATA.works
        : SITE_DATA.works.filter(w => w.theme === filter);
      track.innerHTML = list.map(cardHTML).join("") ||
        '<div class="prose">没有在当前雨层中找到对应的映像。请更换关键词，或回到全部馆藏。</div>';
      $$(".wcard", track).forEach(c => {
        c.addEventListener("click", () => {
          if (window.BondSys) BondSys.award("theme_first", c.dataset.theme);
          location.href = "work.html?work=" + c.dataset.id;
        });
      });
      buildDots();
    }

    function buildDots() {
      const cards = $$(".wcard", track);
      dots.innerHTML = cards.map((c, i) =>
        '<i data-i="' + i + '"' + (i === 0 ? ' class="cur"' : "") + "></i>").join("");
      $$("i", dots).forEach(d => d.addEventListener("click", () => {
        const c = cards[+d.dataset.i];
        if (c) track.scrollTo({ left: c.offsetLeft - track.offsetLeft - 20, behavior: "smooth" });
      }));
    }

    track.addEventListener("scroll", () => {
      const cards = $$(".wcard", track);
      const idx = Math.round(track.scrollLeft / (cards[0] ? cards[0].offsetWidth + 26 : 1));
      $$("i", dots).forEach((d, i) => d.classList.toggle("cur", i === Math.min(idx, cards.length - 1)));
    }, { passive: true });

    $("#prevBtn").addEventListener("click", () =>
      track.scrollBy({ left: -340, behavior: "smooth" }));
    $("#nextBtn").addEventListener("click", () =>
      track.scrollBy({ left: 340, behavior: "smooth" }));

    document.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") track.scrollBy({ left: 340, behavior: "smooth" });
      if (e.key === "ArrowLeft")  track.scrollBy({ left: -340, behavior: "smooth" });
    });

    $$(".filters .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        $$(".filters .chip").forEach(c => c.classList.remove("cur"));
        chip.classList.add("cur");
        filter = chip.dataset.f;
        const t = SITE_DATA.themes.find(x => x.id === filter);
        if (themeNote) {
          if (t) {
            themeNote.innerHTML =
              '<div class="tn-head"><span class="tn-no">' + t.no + "</span><h2>" +
              t.name + "</h2></div><p>" + t.desc + "</p>";
          } else {
            themeNote.innerHTML =
              '<div class="tn-head"><h2>全部映像</h2></div>' +
              "<p>被雨水保存的光，仍在玻璃之后闪烁。你可以横向穿过五个区域，也可以停在任意一张映像前。</p>";
          }
        }
        if (window.BondSys && filter !== "all") BondSys.award("theme_first", filter);
        render();
      });
    });

    render();
  }

  /* ================= 作品详情 ================= */

  function initWork() {
    const params = new URLSearchParams(location.search);
    const id = params.get("work");
    const w = SITE_DATA.works.find(x => x.id === id);

    if (!w) {
      $("#workBody").innerHTML =
        '<div class="lost-404"><div class="code">404</div><h1>走失于溺川支线</h1>' +
        "<p>你抵达的坐标不存在，或已被昨夜的雨水改写。</p>" +
        '<a class="btn" href="gallery.html">返回映画馆藏</a></div>';
      return;
    }

    const t = SITE_DATA.themes.find(x => x.id === w.theme) || {};
    document.title = w.title + " · 映像详情 · 溺川夜雨";

    $("#workTitle").textContent = w.title;
    $("#crumbTheme").textContent = t.no + "｜" + t.name;

    const hero = $("#workHero");
    hero.innerHTML = w.image
      ? '<img src="' + w.image + '" alt="' + w.title + '">'
      : '<div class="empty"><div class="glyph">光</div>' +
        "<p>" + (w.isDemo ? "临时映像 · 生成后将在此显影" : "这枚映像尚未送抵溺川") + "</p></div>";

    const rows = [
      ["所属区域", t.name || "—"],
      ["显影年份", w.year || (w.isDemo ? "待定" : "待补")],
      ["映像形式", w.medium || (w.isDemo ? "待定" : "待补")],
      ["媒介 / 工具", w.tools || "媒介未公开"],
      ["标注", w.isDemo ? "临时映像 / DEMO，非正式馆藏" : "—"]
    ];
    $("#metaRows").innerHTML = rows.map(r =>
      '<div class="row"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>").join("") +
      '<div class="row"><span class="k">标签</span><span class="v tags">' +
      (w.tags && w.tags.length ? w.tags.map(x => "<em>" + x + "</em>").join("") : "<em>未标注</em>") +
      "</span></div>";

    $("#noteText").textContent = w.note ||
      (w.isDemo ? "此卡仅用于雨夜档案的视觉演示，并非正式馆藏。真实映像抵达后，将覆盖当前残影。"
                : "这枚映像没有留下额外注释。它保留原始的沉默。");

    // 上一枚 / 下一枚
    const list = SITE_DATA.works;
    const idx = list.findIndex(x => x.id === w.id);
    const prev = list[idx - 1], next = list[idx + 1];
    $("#prevWork").innerHTML = prev ? "← 上一枚光 · " + prev.title : "已是雨幕起点";
    $("#nextWork").innerHTML = next ? "下一枚光 · " + next.title + " →" : "已是馆藏尽头";
    if (prev) $("#prevWork").addEventListener("click", () =>
      location.href = "work.html?work=" + prev.id);
    else $("#prevWork").setAttribute("disabled", "");
    if (next) $("#nextWork").addEventListener("click", () =>
      location.href = "work.html?work=" + next.id);
    else $("#nextWork").setAttribute("disabled", "");

    if (window.BondSys) {
      const r = BondSys.award("work_view", w.id);
      if (!r) setTimeout(() => toast("你在此映像前停留过片刻。心轨刻度已记录这段雨痕。"), 800);
    }
  }

  /* ================= 关于页 ================= */

  function initAbout() {
    const c = SITE_DATA.contact;

    $("#skillGrid").innerHTML = SITE_DATA.reality.skills.map(s =>
      '<div class="skill-item panel demo-flag">' + s + "</div>").join("");
    $("#toolsRow").innerHTML = SITE_DATA.reality.tools.map(t =>
      '<span class="tool-tag">' + t + "</span>").join("");
    $("#yearsCell").textContent = SITE_DATA.reality.years || "时间坐标尚未公开。";
    $("#eventsCell").textContent = SITE_DATA.reality.events || "暂无获准公开的事件记录。";

    const box = $("#contactBox");
    let html = "";
    if (c.email) {
      html += '<div class="contact-row"><div class="cl"><b>邮箱</b><span>' + c.email +
        '</span></div><button class="copy-btn" data-copy="' + c.email + '">复制坐标</button></div>';
    } else {
      html += '<div class="contact-row"><div class="cl"><b>公开邮箱</b><span>尚未录入</span></div></div>';
    }
    if (c.socials && c.socials.length) {
      c.socials.forEach(s => {
        html += '<div class="contact-row"><div class="cl"><b>' + s.name + '</b><span>' + s.url +
        '</span></div><a class="copy-btn" href="' + s.url + '" target="_blank" rel="noopener">前往</a></div>';
      });
    } else {
      html += '<div class="contact-row"><div class="cl"><b>社交坐标</b><span>尚未录入</span></div></div>';
    }
    html += '<p class="privacy-line">不公开手机号、私人微信与现实住址。</p>';
    box.innerHTML = html;

    $$(".copy-btn[data-copy]", box).forEach(btn => {
      btn.addEventListener("click", () => {
        navigator.clipboard && navigator.clipboard.writeText(btn.dataset.copy);
        toast("坐标已复制。");
      });
    });

    const zone = $("#contactZone");
    if (zone) {
      const onContact = () => {
        if (window.BondSys) BondSys.award("contact_view");
        toast("公开联络坐标已记录在案。");
        zone.removeEventListener("click", onContact);
      };
      zone.addEventListener("click", onContact);
    }

    if (window.BondSys) {
      const r = BondSys.award("about_read");
      if (!r) setTimeout(() => toast("档案已在本地留下阅读雨痕。"), 700);
    }
  }

  /* ================= 消息页 ================= */

  function initMessages() {
    const flow = $("#msgFlow");
    const bond = window.BondSys ? BondSys.get() : { points: 0 };
    const st = window.BondSys ? BondSys.get() : null;

    const conditions = {
      greet: () => true,
      after_works: () => st && Object.values(st.worksSeen).some(a => a.length),
      after_about: () => st && Object.keys(st.dailyDone || {}).length > 0 && stHas(st, "about_read"),
      radio_hint: () => PAGE === "radio" || sessionStorage.getItem("fn_radio_seen") === "1",
      contact_hint: () => st && stHas(st, "contact_view"),
      hidden: () => bond.points >= (SITE_DATA.messages.find(m => m.kind === "hidden") || {}).unlockAt
    };
    function stHas(s, key) {
      return Object.values(s.dailyDone || {}).some(day => day && day[key]);
    }

    flow.innerHTML = SITE_DATA.messages.map(m => {
      const ok = (conditions[m.kind] || conditions.greet)();
      const read = window.BondSys ? BondSys.hasRead(m.id) : false;
      const lockedHidden = m.kind === "hidden" && !ok;
      return (
        '<div class="msg ' + (m.kind === "hidden" ? "hidden-msg" : "") + " " +
        (ok ? "" : "locked") + '" data-msg="' + m.id + '">' +
        '<div class="avatar">' + (m.sender === "妃音·辞" ? "妃" : m.sender === "雨夜频段" ? "频" :
          m.sender === "雨后坐标" ? "坐" : "溺") + "</div>" +
        '<div class="bubble panel">' +
        '<div class="head"><span>' + m.sender + "</span><span>" + m.time + "</span></div>" +
        (ok
          ? '<div class="body">' + m.content + "</div>" +
            (m.actions
              ? '<div class="acts">' + m.actions.map(a =>
                  '<a class="btn sm" href="' + a.href + '" data-ev="' + a.event + '">' +
                  a.label + "</a>").join("") + "</div>"
              : "")
          : '<div class="locked-line">' +
            (lockedHidden ? "── 需要更高的心轨刻度才能接通 ──" : "── 未达 · 雨夜尚未传来这条回声 ──") +
            "</div>") +
        (!ok ? "" : read ? "" : '<div class="locked-line" style="margin-top:8px;opacity:.6">● 未读</div>') +
        "</div></div>"
      );
    }).join("");

    $$(".msg", flow).forEach(el => {
      if (el.classList.contains("locked")) return;
      const id = el.dataset.msg;
      const reveal = () => {
        if (window.BondSys) BondSys.readMessage(id);
        const badge = $(".locked-line", el);
        if (badge && badge.textContent.includes("未读")) badge.remove();
      };
      el.addEventListener("click", reveal, { once: true });
      if (window.BondSys && BondSys.hasRead(id)) {
        const badge = $(".locked-line", el);
        if (badge && badge.textContent.includes("未读")) badge.remove();
      }
    });

    $$("a[data-ev]", flow).forEach(a => {
      a.addEventListener("click", () => {
        if (window.BondSys) BondSys.award("msg_reply");
      });
    });
  }

  /* ================= 录音页 ================= */

  function initRadio() {
    sessionStorage.setItem("fn_radio_seen", "1");
    const list = $("#recList");
    const st = window.BondSys ? BondSys.get() : { points: 0 };

    list.innerHTML = SITE_DATA.recordings.map(r => {
      const locked = r.unlockedAt > 0 && st.points < r.unlockedAt;
      const noFile = !r.file;
      return (
        '<div class="rec-card panel ' + (locked ? "locked" : "") + '" data-rec="' + r.id + '">' +
        '<button class="rbtn" ' + (locked || noFile ? "disabled" : "") +
        ' title="' + (locked ? "心轨刻度不足" : noFile ? "频段尚未录入" : "接通频段") + '">▶</button>' +
        '<div class="rinfo"><h3>' + r.title + "</h3>" +
        '<div class="rsub">' + r.duration + " · " + (r.unlockedAt > 0 ? "Lv.3 坠雨渡梦之使解锁" : "开放频段") +
        "</div>" +
        '<button class="script-toggle">查看文字稿 ▾</button>' +
        '<div class="script-body">' + r.script + "</div></div>" +
        '<div class="rstate">' + (locked ? "刻度不足" : noFile ? "待录入" : "可接通") + "</div>" +
        "</div>"
      );
    }).join("");

    $$(".rec-card", list).forEach(card => {
      const id = card.dataset.rec;
      const r = SITE_DATA.recordings.find(x => x.id === id);
      const tg = $(".script-toggle", card);
      tg.addEventListener("click", () => {
        $(".script-body", card).classList.toggle("on");
        tg.textContent = $(".script-body", card).classList.contains("on")
          ? "收起文字稿 ▴" : "查看文字稿 ▾";
      });
      const btn = $(".rbtn", card);
      btn.addEventListener("click", () => {
        if (!r.file) return;
        let audio = $("audio[data-play='" + id + "']");
        if (!audio) {
          audio = document.createElement("audio");
          audio.dataset.play = id; audio.src = r.file; audio.preload = "metadata";
          document.body.appendChild(audio);
          audio.addEventListener("ended", () => { btn.textContent = "▶"; });
        }
        if (audio.paused) {
          $$(".rbtn", list).forEach(b => { if (b !== btn) b.textContent = "▶"; });
          $$("audio").forEach(a => { if (a !== audio) a.pause(); });
          audio.play().catch(() => toast("频段被浏览器暂时拦截。请再次点击播放按钮，或检查设备音量。"));
          btn.textContent = "❚❚";
          if (window.BondSys) BondSys.award("rec_play", id);
        } else {
          audio.pause(); btn.textContent = "▶";
        }
      });
    });
  }

  /* ================= 羁绊页 ================= */

  function initBond() {
    const st = BondSys.get();
    const L = BondSys.getLevel();
    const next = BondSys.nextLevel();

    $("#bondLvNo").textContent = "Lv." + L.lv;
    $("#bondName").textContent = L.name;
    $("#bondFb").textContent = L.feedback;
    const pct = next
      ? Math.min(100, Math.round((st.points - L.min) / (next.min - L.min) * 100))
      : 100;
    $("#bondFill").style.width = pct + "%";
    $("#bondNums").innerHTML =
      "<span>刻度 " + st.points + "</span><span>" +
      (next ? "下一级 " + next.min + " · " + next.name : "心轨已满 · 溺川挚友") + "</span>";

    $("#ruleList").innerHTML = BondSys.rules.map(r =>
      "<li><span>" + r.label + "</span><b>+" + r.pts + "</b></li>").join("") +
      '<li><span>单日理论上限</span><b>≈ ' + SITE_DATA.bond.dailyMax + "</b></li>";

    $("#lvlGrid").innerHTML = BondSys.levels.map(x =>
      '<div class="lvl-card panel ' + (st.level >= x.lv ? "done" : "") + " " +
      (x.lv === st.level ? "cur-lv" : "") + '">' +
      '<div class="no">LV.' + x.lv + " · " + x.min + ' 刻度</div><h4>' + x.name + "</h4>" +
      "<p>" + x.feedback + "</p>" +
      '<div class="un">解锁 · ' + x.unlock + "</div></div>").join("");

    // 纪念卡（Lv.4）
    const mem = $("#memorial");
    const memOk = st.level >= 4;
    mem.classList.toggle("locked", !memOk);
    $("#memState").textContent = memOk
      ? "椿色印记已留在纸页边缘，作为再次抵达的凭证。"
      : "需要达到 Lv.4 · 遗渡溺川之椿，印记才会显影。";

    // 最终回声（Lv.5）
    const echo = $("#finalEcho");
    if (st.level >= 5) {
      echo.classList.remove("locked");
      echo.innerHTML =
        "<h3>" + SITE_DATA.bond.finalEcho.title + "</h3>" +
        '<p class="sys">' + SITE_DATA.bond.finalEcho.system + "</p>" +
        '<p class="per">' + SITE_DATA.bond.finalEcho.personal + "</p>" +
        '<div class="row">' + SITE_DATA.bond.finalEcho.actions.map(a =>
          '<a class="btn sm ' + (a.label.indexOf("坐标") > -1 ? "gold" : "") + '" href="' +
          a.href + '">' + a.label + "</a>").join("") + "</div>";
    }

    $("#clearBtn").addEventListener("click", () => {
      if (confirm("清除后，等级、解锁消息与本地回访记录将回到初始状态。核心作品不会受到影响。确定清除吗？")) {
        BondSys.clearAll();
        toast("本地雨痕已清除。溺川回到最初的一夜。");
        setTimeout(() => location.reload(), 1200);
      }
    });

    refreshCorner();
  }

  /* ================= 启动 ================= */

  document.addEventListener("DOMContentLoaded", function () {
    buildLoader();

    // 数据文件缺失时的友好降级（避免白屏崩溃）
    if (!window.SITE_DATA) {
      console.error("[溺川夜雨] assets/data/site-data.js 未能加载，请检查文件是否已上传。");
      const lb = $("#loader");
      if (lb) {
        lb.classList.add("off");
        const st = document.createElement("div");
        st.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:300;background:#04080f;color:#8fa0bd;font-size:14px;line-height:2;text-align:center;padding:24px;";
        st.innerHTML = "溺川的雨幕太浓，数据文件没能抵达。<br>请检查 assets/data/site-data.js 是否已正确上传，然后刷新页面。";
        document.body.appendChild(st);
      }
      return;
    }

    buildShell();
    buildCorner();
    bindLevelFx();

    const visitKind = window.BondSys ? BondSys.settleVisit() : "same";

    if (PAGE === "home") {
      if (visitKind === "first") buildFirstMask();
      initHome();
    } else if (PAGE === "gallery") initGallery();
    else if (PAGE === "work") initWork();
    else if (PAGE === "about") initAbout();
    else if (PAGE === "messages") initMessages();
    else if (PAGE === "radio") initRadio();
    else if (PAGE === "bond") initBond();
    else if (PAGE === "404") { /* 静态页 */ }

    document.querySelector(".stage").classList.add("fade-page");
  });
})();
