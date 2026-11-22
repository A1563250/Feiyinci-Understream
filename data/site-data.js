/* ============================================================
   溺川夜雨 · 静态数据配置文件
   ------------------------------------------------------------
   后续更新作品 / 录音 / 链接，只需修改本文件与 assets 下的
   图片、音频文件，无需改动页面结构。
   ============================================================ */

const SITE_DATA = {

  /* ---------- 个人资料（已确认公开） ---------- */
  profile: {
    name: "妃音·辞",
    title: "拾遗之诗",
    city: "溺川",
    intro: "将自己藏匿在大梦深处，溺于时空的边际。",
    subtitle: "拾遗之诗｜溺川影像档案"
  },

  /* ---------- 联系方式（待提供，留空即显示缺省文案） ---------- */
  contact: {
    email: "",                 // 例：example@mail.com
    copyEnabled: true,         // 是否启用一键复制
    socials: [
      // { name: "Bilibili", url: "https://space.bilibili.com/xxxx" },
      // { name: "小红书", url: "https://..." },
      // { name: "GitHub",  url: "https://github.com/xxxx" }
    ]
  },

  /* ---------- 视觉资源路径（生成后替换） ---------- */
  assets: {
    heroBg: "assets/images/hero_bg.jpg",   // 首屏雨夜港都背景（DEMO，生成稿）
    portrait: ""                           // 首屏人物照片，例：assets/images/portrait.jpg
  },

  /* ---------- 五个灵感主题 ---------- */
  themes: [
    { id: "rain_port",  name: "雨港霓虹", no: "第一区",
      desc: "当暴雨压过城市的噪音，街道会短暂显露出另一副面容。招牌在积水里沉没又亮起，车窗像移动的玻璃碎片，行人从光与光之间经过，仿佛正赶赴一场没有地址的约。这一区域收藏城市夜色、潮湿街口、反光路面与高楼之间的冷色灯火。它们属于现实的末端，也属于溺川最容易被辨认的入口。",
      tags: ["城市", "雨夜", "霓虹", "街道", "反光", "冷色"] },
    { id: "lost_roles", name: "佚梦角色", no: "第二区",
      desc: "有些角色没有在故事开始前得到姓名，有些身影只在梦境换场时短暂出现。他们站在雨棚、楼梯、空站台或没有编号的房间里，像被某段叙事遗落，却仍保留着完整的情绪。这一区域收藏人物映像、角色设定与身份未明的轮廓。他们不必拥有结局，但应当被看见。",
      tags: ["角色", "人物", "梦境", "设定", "命运", "轮廓"] },
    { id: "water_poem", name: "水底诗章", no: "第三区",
      desc: "溺川的雨并不只向下落。某些夜晚，城市会像一块缓慢沉没的玻璃，灯火、纸张、裙摆、星点与未寄出的句子一起浮向深处。那里没有明确时间，只有光在水中缓慢分行。这一区域收藏幻想、抽象、梦境与诗性意象。它们可以不解释世界，只保留世界沉没前的形状。",
      tags: ["梦境", "水底", "幻想", "抽象", "诗性", "光"] },
    { id: "mist_light", name: "雾中灯影", no: "第四区",
      desc: "雾会让距离变得不可靠。远处的灯像仍在抵达途中，近处的轮廓却先一步失去边界。溺川在这样的时刻显得格外安静，只剩光从潮湿空气里缓慢渗出。这一区域收藏自然与城市交界中的远光、雾景、留白和低密度画面。它们不需要填满视线，只需要让视线停住。",
      tags: ["雾", "灯光", "留白", "远景", "自然", "空气感"] },
    { id: "old_slices", name: "旧日切片", no: "第五区",
      desc: "过去并不会完整归来。它通常只以一枚旧物、一扇窗、一段桌面反光、一件被雨水打湿的外套出现。那些细小切片无法概括任何一段岁月，却能在某一瞬间证明：某些时刻确实存在过。这一区域收藏日常回忆、旧物、生活片段与时间痕迹。它们是馆藏里最安静，也最容易被误碰的部分。",
      tags: ["旧日", "日常", "回忆", "旧物", "时间", "生活"] }
  ],

  /* ---------- 作品列表 ----------
     isDemo: true  = 临时映像 / DEMO 占位（上线前替换或删除）
     image 为空时显示占位状态；真实作品请填写
     image: "assets/images/work_01.jpg" 并补全元信息。
  ---------- */
  works: [
    { id: "work_demo_rain_port",  theme: "rain_port",  isDemo: true,
      title: "雨港霓虹 · 临时映像", year: "", medium: "", tools: "", note: "",
      image: "assets/images/demo_rain_port.jpg", tags: ["临时映像", "DEMO"] },
    { id: "work_lost_rain_port",  theme: "rain_port",  isDemo: false,
      title: "遗失的光", year: "", medium: "", tools: "", note: "",
      image: "", tags: ["待补"] },

    { id: "work_demo_lost_roles", theme: "lost_roles", isDemo: true,
      title: "佚梦之影 · 临时映像", year: "", medium: "", tools: "", note: "",
      image: "assets/images/demo_lost_roles.jpg", tags: ["临时映像", "DEMO"] },
    { id: "work_lost_lost_roles", theme: "lost_roles", isDemo: false,
      title: "遗失的光", year: "", medium: "", tools: "", note: "",
      image: "", tags: ["待补"] },

    { id: "work_demo_water_poem", theme: "water_poem", isDemo: true,
      title: "水底诗章 · 临时映像", year: "", medium: "", tools: "", note: "",
      image: "assets/images/demo_water_poem.jpg", tags: ["临时映像", "DEMO"] },
    { id: "work_lost_water_poem", theme: "water_poem", isDemo: false,
      title: "遗失的光", year: "", medium: "", tools: "", note: "",
      image: "", tags: ["待补"] },

    { id: "work_demo_mist_light", theme: "mist_light", isDemo: true,
      title: "雾中灯影 · 临时映像", year: "", medium: "", tools: "", note: "",
      image: "assets/images/demo_mist_light.jpg", tags: ["临时映像", "DEMO"] },
    { id: "work_lost_mist_light", theme: "mist_light", isDemo: false,
      title: "遗失的光", year: "", medium: "", tools: "", note: "",
      image: "", tags: ["待补"] },

    { id: "work_demo_old_slices", theme: "old_slices", isDemo: true,
      title: "旧日切片 · 临时映像", year: "", medium: "", tools: "", note: "",
      image: "assets/images/demo_old_slices.jpg", tags: ["临时映像", "DEMO"] },
    { id: "work_lost_old_slices", theme: "old_slices", isDemo: false,
      title: "遗失的光", year: "", medium: "", tools: "", note: "",
      image: "", tags: ["待补"] }
  ],

  /* ---------- 录音（真实音频，待录入） ----------
     file 为空时显示“频段尚未录入”占位状态。
     unlockedAt: 解锁所需心轨刻度分值（0 = 默认开放）。
  ---------- */
  recordings: [
    { id: "rec_01", title: "雨夜开场白", duration: "约 30 秒", unlockedAt: 0,
      file: "",
      script: "这里是溺川。今夜的雨比信号更早抵达，楼群沉在水下一样的蓝光里。映画馆藏已经开放，里面存放着我从不同夜晚拾起的影像。你可以先在雨里停留片刻，也可以直接去看那些光。" },
    { id: "rec_02", title: "馆藏导览", duration: "约 30 秒", unlockedAt: 0,
      file: "",
      script: "映画馆藏分为五个区域。雨港霓虹、佚梦角色、水底诗章、雾中灯影，以及旧日切片。它们分别收藏城市反光、无名身影、下沉的梦、远处的灯，和生活遗落的细小证据。不必按顺序经过。你停住的地方，就是入口。" },
    { id: "rec_03", title: "隐藏频段", duration: "约 30 秒", unlockedAt: 70,
      file: "",
      script: "隐藏频段接通了。你已经穿过大部分雨幕，也看见了一些不常被打开的影像。档案馆因此留下一枚新的刻度。谢谢你拾起这些光。若雨停之后仍想回来，溺川会为再次抵达的人留一盏很暗的灯。" }
  ],

  /* ---------- 未达回声（留言系统） ---------- */
  messages: [
    { id: "msg_01", sender: "妃音·辞", time: "雨势增大时", kind: "greet",
      content: "今夜的溺川比往常更靠近现实。我把一部分光放在映画馆藏里，另一部分仍留在档案深处。若你只是路过，可以先看作品；若你想知道这些光从何处来，再翻开档案也不迟。",
      actions: [
        { label: "查看作品", href: "gallery.html", event: "msg_reply" },
        { label: "阅读档案", href: "about.html", event: "msg_reply" }
      ] },
    { id: "msg_02", sender: "溺川记录", time: "你在馆藏停驻后", kind: "after_works",
      content: "你已在馆藏中停驻。被查看的映像没有改变位置，只是表面的雨水比刚才更薄。" },
    { id: "msg_03", sender: "溺川记录", time: "档案翻开后", kind: "after_about",
      content: "档案已向你开放现实侧记录。虚构的雨负责隐藏，真实的作品负责抵达。" },
    { id: "msg_04", sender: "雨夜频段", time: "频段接通前", kind: "radio_hint",
      content: "频段受到雷雨影响。若声音断续，请降低环境雨声，或稍后再次接通。" },
    { id: "msg_05", sender: "雨后坐标", time: "坐标亮起时", kind: "contact_hint",
      content: "公开联络坐标已记录在案。请只将它们用于礼貌、必要且真实的事务。" },
    { id: "msg_06", sender: "溺川记录", time: "Lv.2 · 弥褪之忆", kind: "hidden", unlockAt: 35,
      content: "一些几乎褪去的记忆开始恢复边缘。溺川在纸页的空白处，为你补写了一行没有落款的短诗。" }
  ],

  /* ---------- 心轨刻度（羁绊系统） ---------- */
  bond: {
    levels: [
      { lv: 1, name: "溺途访者",       min: 0,
        feedback: "你刚从雨幕外侧抵达。档案馆尚不清楚你的去向，只在门边记下一枚很浅的水印。",
        unlock: "雨夜问候" },
      { lv: 2, name: "弥褪之忆",       min: 35,
        feedback: "你已穿过若干映像。颜色在脚边缓慢回潮，一些几乎褪去的记忆开始恢复边缘。",
        unlock: "隐藏短讯" },
      { lv: 3, name: "坠雨渡梦之使",   min: 70,
        feedback: "当雷声掠过水面，你开始能辨认梦境下沉的方向。隐藏频段因此短暂接通。",
        unlock: "隐藏录音频段" },
      { lv: 4, name: "遗渡溺川之椿",   min: 105,
        feedback: "你在雨中拾起过足够多的光。档案馆将一枚椿色印记留在纸页边缘，作为再次抵达的凭证。",
        unlock: "纪念映像卡" },
      { lv: 5, name: "溺川挚友",       min: 135,
        feedback: "你已熟悉这里的雨势与路名。无需通行证，馆藏深处的最终回声将为你亮起。",
        unlock: "最终回声与关注引导" }
    ],
    rules: [
      { label: "初次抵达溺川",              pts: 10, key: "first_visit",   once: true },
      { label: "首次进入不同作品区域",      pts: 8,  key: "theme_first",   once: "perTheme" },
      { label: "查看作品详情",              pts: 4,  key: "work_view",     once: "perDayPerItem" },
      { label: "阅读溺川档案",              pts: 6,  key: "about_read",    once: "perDay" },
      { label: "回应未达回声",              pts: 5,  key: "msg_reply",     once: "perDay" },
      { label: "接通录音",                  pts: 8,  key: "rec_play",      once: "perDayPerItem" },
      { label: "查看公开联络坐标",          pts: 10, key: "contact_view",  once: "perDay" },
      { label: "雨后重逢（每日回访）",      pts: 6,  key: "daily_return",  once: "perDay" }
    ],
    dailyMax: 139,
    finalEcho: {
      title: "最终回声",
      system: "雨势在凌晨转弱。档案馆确认，此人已经穿过大部分馆藏，并在数个关键节点留下稳定刻度。",
      personal: "感谢你抵达这里。我无法保证所有被拾起的光都足够完整，但它们确实曾在某个雨夜照亮过我。若你愿意在雨停之后继续关注，公开坐标会留在档案末尾。愿我们下一次相见时，仍有新的映像可被命名。",
      actions: [
        { label: "查看公开坐标", href: "about.html#contact" },
        { label: "返回映画馆藏", href: "gallery.html" }
      ]
    }
  },

  /* ---------- 现实侧记录（B 占位，待本人确认后替换） ---------- */
  reality: {
    note: "以下信息以现实中的创作能力为准。档案语言只负责转译，不虚构未被验证的经历、工具或项目。",
    skills: ["视觉设计", "角色设定", "海报设计", "UI / 网页习作"],
    skillsNote: "当前档案仍保留初始记录，正式公开前需要由拾遗者本人确认、删减或替换。",
    tools: ["Photoshop", "Illustrator", "Procreate", "Figma", "HTML / CSS / JavaScript"],
    toolsNote: "正式上线前，应仅保留实际掌握且愿意公开的工具。",
    years: "",      // 创作年限/阶段，留空显示“时间坐标尚未公开”
    events: ""      // 项目/奖项，留空显示“暂无获准公开的事件记录”
  }
};
