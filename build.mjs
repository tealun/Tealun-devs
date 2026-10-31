// Builds dist/ from content/site.json and src/. No dependencies: `node build.mjs`.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';

const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
const p = site.person;

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lines = arr => arr.map(esc).join('<br>');
const need = (obj, keys, where) => keys.forEach(k => { if (!obj[k]) throw new Error(`content/site.json: ${where} 缺少 "${k}"`); });

need(p, ['name', 'alias', 'lead', 'intro', 'contacts'], 'person');
site.works.forEach((w, i) => need(w, ['size', 'name', 'what'], `works[${i}]`));

const STATUS = { live: '已上线', dev: '开发中', open: '开源' };
const status = w => w.status ? `<p class="work__state${w.status === 'live' ? ' work__state--live' : ''}">${STATUS[w.status] ?? esc(w.status)}</p>` : '';
const links = w => w.links?.length ? `<p class="work__links">${w.links.map(l => `<a href="${esc(l.url)}">${esc(l.label)}</a>`).join('')}</p>` : '';
const facts = w => w.facts?.length ? `<dl class="work__facts">${w.facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>` : '';

const work = w => `
  <article class="work${w.size === 'lead' ? ' work--lead' : ''}${w.size === 'tool' ? ' work--tool' : ''}">
    <div class="work__head">
      <h3 class="work__name">${esc(w.name)}</h3>
      ${w.subtitle ? `<p class="work__en">${esc(w.subtitle)}</p>` : ''}
      ${status(w)}
    </div>
    <div class="work__body">
      <p class="work__what">${esc(w.what)}</p>
      ${facts(w)}
      ${w.code ? `<pre class="work__code"><code>${w.code.map(esc).join('\n')}</code></pre>` : ''}
      ${w.note ? `<p class="work__note">${esc(w.note)}</p>` : ''}
      ${links(w)}
    </div>
  </article>`;

const minor = w => `
    <article class="minor__item">
      <h3 class="minor__name">${esc(w.name)}</h3>
      <p>${esc(w.what)}</p>
      ${links(w)}${status(w)}
    </article>`;

const major = site.works.filter(w => w.size !== 'minor');
const minors = site.works.filter(w => w.size === 'minor');
const fullName = `${p.name} ${p.alias}`;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullName)}｜项目集</title>
<meta name="description" content="${esc(p.lead.join('') + p.intro)}">
<meta property="og:title" content="${esc(fullName)}｜项目集">
<meta property="og:description" content="${esc(p.intro)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://dev.tealun.com/">
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@TealunDu">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
</head>
<body>

<header class="masthead">
  <a class="masthead__name" href="/">${esc(fullName)}</a>
  <nav class="masthead__nav" aria-label="页面导航">
    <a href="#works">作品</a>
    <a href="#method">方法</a>
    <a href="#about">关于</a>
  </nav>
</header>

<main>
<section class="cover" aria-labelledby="cover-title">
  <h1 class="cover__title" id="cover-title"><span class="cover__alias">${esc(p.alias)}</span><span class="cover__name">${esc(p.name)}</span></h1>
  <div class="cover__body">
    <p class="cover__lead">${lines(p.lead)}</p>
    <p class="cover__text">${esc(p.intro)}</p>
    ${p.quote ? `<blockquote class="cover__quote"><p>${lines(p.quote)}</p></blockquote>` : ''}
  </div>
</section>

<section class="works" id="works" aria-labelledby="works-title">
  <h2 class="section-title" id="works-title">作品</h2>
  ${major.map(work).join('')}
  ${minors.length ? `<div class="minor">${minors.map(minor).join('')}\n  </div>` : ''}
</section>

<section class="method" id="method" aria-labelledby="method-title">
  <h2 class="section-title" id="method-title">方法</h2>
  <p class="method__intro">${esc(site.method.intro)}</p>
  <ol class="steps">${site.method.steps.map(s => `
    <li class="step">
      <h3 class="step__name">${esc(s.name)}</h3>
      <p class="step__skill">${esc(s.skills)}</p>
      <p>${esc(s.text)}</p>
    </li>`).join('')}
  </ol>
</section>

<section class="about" id="about" aria-labelledby="about-title">
  <h2 class="section-title" id="about-title">关于</h2>
  <div class="about__body">
    ${p.about.map(t => `<p>${esc(t)}</p>`).join('\n    ')}
    <ul class="contact">${p.contacts.map(c => `<li><a href="${esc(c.url)}">${esc(c.label)}</a></li>`).join('')}</ul>
  </div>
</section>
</main>

<footer class="colophon">
  <p>© ${new Date().getFullYear()} ${esc(p.name)}。数据截至 ${esc(site.dataAsOf)}，来自各项目的代码仓库。</p>
</footer>
</body>
</html>
`;

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const f of readdirSync('src')) cpSync(`src/${f}`, `dist/${f}`);
writeFileSync('dist/index.html', html);
console.log(`built dist/index.html: ${major.length} works, ${minors.length} minor`);
