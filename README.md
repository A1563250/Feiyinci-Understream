# 溺川夜雨 · 妃音·辞个人网站

桌面端优先、基础手机自适应的多页面静态网站。原生 HTML / CSS / JavaScript，无构建依赖，可直接部署到 GitHub Pages、Netlify 或任意静态服务器。

## 一、目录结构

```
feiyinci_nichuan_site/
├── index.html          首页（乙游主界面式入口）
├── gallery.html        映画馆藏（作品集 · 横向卡面）
├── work.html           映像详情（?work=作品ID）
├── about.html          溺川档案（关于 + 联系方式）
├── messages.html       未达回声（留言系统）
├── radio.html          雨夜频段（真实录音）
├── bond.html           心轨刻度（羁绊系统）
├── 404.html            走失于溺川支线
└── assets/
    ├── css/style.css       全站样式（雨夜主题）
    ├── js/weather.js       暴雨 / 闪电 / 水波 / 声音控制
    ├── js/bond.js          心轨刻度记录与解锁
    ├── js/main.js          导航、页面渲染与交互
    ├── data/site-data.js   静态数据配置文件 ★ 后续更新主要改这里
    ├── images/             图片素材目录（背景 / 人物照 / 作品图）
    └── audio/              录音文件目录（feiyinci_01_opening.mp3 等）
```

## 二、部署方法

### GitHub Pages
1. 新建仓库，把本目录内**全部文件**上传到仓库根目录（不要套外层文件夹）。
2. 仓库 Settings → Pages → Source 选择 `main` 分支根目录，保存。
3. 稍等片刻即可得到 `https://<用户名>.github.io/<仓库名>/` 的公开链接。

### Netlify
1. 打开 app.netlify.com/drop。
2. 把整个文件夹直接拖入页面，几秒后获得临时域名。
3. 可在 Site settings → Change site name 修改子域名，或绑定自己的域名。

### 本地预览
直接双击 `index.html` 即可打开；所有功能（含 localStorage 羁绊记录）本地可用。

## 三、替换素材（上线前必做）

### 1. 首屏背景图
`assets/images/hero_bg.jpg` 已包含生成的雨夜港都背景（DEMO 生成稿），网页会自动加载。
想更换时，替换同名文件或修改 `site-data.js` 中的 `assets.heroBg` 路径即可。

### 2. 人物照片
把照片放入 `assets/images/`（建议命名 `portrait.jpg`），在 `site-data.js` 的 `assets.portrait` 填路径。填好后剪影占位自动替换为照片。

### 3. 真实作品
当前 5 个主题各有一张 DEMO 概念卡（`demo_rain_port.jpg`、`demo_lost_roles.jpg`、`demo_water_poem.jpg`、`demo_mist_light.jpg`、`demo_old_slices.jpg`）和一张「遗失的光」待补卡。替换真实作品时，把图片放入 `assets/images/`，在 `site-data.js` 的 `works` 数组中把 DEMO 条目（`isDemo: true`）删除或替换为：

```js
{ id: "work_01", theme: "rain_port", isDemo: false,
  title: "作品标题", year: "2024", medium: "插画", tools: "Photoshop",
  note: "20–50 字创作说明",
  image: "assets/images/work_01.jpg",
  tags: ["雨夜", "霓虹"] }
```

未提供图片的条目会显示「遗失的光」占位卡。

### 4. 真实录音
把三段录音（建议 MP3）放入 `assets/audio/`，在 `site-data.js` 的 `recordings` 中填写：

```js
{ id: "rec_01", title: "雨夜开场白", duration: "约 30 秒", unlockedAt: 0,
  file: "audio/feiyinci_01_opening.mp3", script: "与录音一致的文字稿" }
```

> 注意：`file` 路径不需要 `assets/` 前缀以外的说明，按上方示例从 `audio/` 开始写即可（页面实际按你填写的路径加载，与文件所在位置一致即可）。

### 5. 联系方式
在 `site-data.js` 的 `contact` 中填写邮箱与 2–3 个社交主页链接。

### 6. 现实侧技能档案
`site-data.js` 的 `reality` 中，`skills / tools / years / events` 均为待确认占位，请以真实信息替换后上线。

## 四、羁绊系统说明

- 数据保存在浏览器 `localStorage`（键：`fn_bond`、`fn_weather`），不登录、不上传。
- 等级：Lv.1 溺途访者 0 → Lv.2 弥褪之忆 35 → Lv.3 坠雨渡梦之使 70 → Lv.4 遗渡溺川之椿 105 → Lv.5 溺川挚友 135。
- 同一行为同一天只计一次；回访每日获得一次「雨夜重逢」加分。
- 核心作品永不锁定；仅解锁问候、隐藏消息、隐藏录音、纪念卡与最终回声。
- 访客可在「心轨刻度」页一键清除本地雨痕。

## 五、天气与性能控制

页面左下角 ☔ 按钮可控制：环境雨声（浏览器本地合成，非录音）、远处雷声、雨幕强度、水面波动、低性能模式。作品区（馆藏 / 详情页）雨幕自动减弱约一半，闪电频率减半；手机端自动关闭闪电与水波。所有偏好跨页面保存。

## 六、隐私边界

- 全站不收集、不上传任何访客数据。
- 不公开展示手机号、私人微信与现实住址。
- 照片与作品由站点所有者自行提供并确认可公开；上线前请确认素材版权与授权。
