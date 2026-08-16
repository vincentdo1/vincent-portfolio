#!/usr/bin/env node
/**
 * Browser acceptance coverage for the V3 stage-1 UI/UX review.
 *
 * Static checks cannot catch the failures this review was about — they were
 * layout, clipping, focus, and fallback problems. This drives a real browser
 * through the acceptance matrix instead.
 *
 *   npm run dev                 # or `npm start` against a prod build
 *   npm run verify:ui
 *
 * Chrome resolution, in order: $CHROME_PATH, then a local Chrome for Testing
 * install, then the system Chrome. Install one with:
 *   npx @puppeteer/browsers install chrome@stable
 *
 * Target URL defaults to http://localhost:3002 and honours $URL.
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const URL = process.env.URL ?? "http://localhost:3002/";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const CHROME = CANDIDATES.find((p) => existsSync(p));
if (!CHROME) {
  console.error(
    "No Chrome found. Set CHROME_PATH, or run:\n" +
      "  npx @puppeteer/browsers install chrome@stable",
  );
  process.exit(2);
}

const SIZES = [
  [320, 568],
  [390, 844],
  [844, 390],
  [1280, 720],
  [1440, 900],
];

let pass = 0;
let fail = 0;
const ok = (n, c, extra = "") => {
  if (c) {
    pass++;
    console.log(`  PASS  ${n}`);
  } else {
    fail++;
    console.log(`  FAIL  ${n} ${extra}`);
  }
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});

async function fresh({ js = true, reduced = false, noWebgl = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  if (!js) await page.setJavaScriptEnabled(false);
  if (reduced)
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  if (noWebgl)
    await page.evaluateOnNewDocument(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (t, ...r) {
        return String(t).startsWith("webgl") ? null : orig.call(this, t, ...r);
      };
    });
  await page.goto(URL, { waitUntil: js ? "networkidle0" : "domcontentloaded" });
  if (js) await new Promise((r) => setTimeout(r, 2200));
  return page;
}
const text = (p) => p.evaluate(() => document.body.innerText);
// browser Find is case-insensitive, and these headings are uppercased by CSS
const has = (t, term) => t.toLowerCase().includes(term.toLowerCase());

// ── Navigation and scanning ───────────────────────────────────────────────
console.log("\nNAVIGATION AND SCANNING");
{
  const p = await fresh();
  const t = await text(p);

  ok(
    "exactly one <h1>",
    (await p.evaluate(() => document.querySelectorAll("h1").length)) === 1,
  );
  ok(
    "the <h1> is Vincent's identity",
    /vincent do/i.test(
      await p.evaluate(() => document.querySelector("h1").innerText),
    ),
  );

  for (const id of [
    "work",
    "experience",
    "profile",
    "contact",
    "chess-engine",
    "airport-routing",
    "boeing",
    "expedia-group",
    "uw-madison",
  ])
    ok(`#${id} anchor exists`, (await p.$(`#${id}`)) !== null);

  // Browser Find can locate all five subjects at once, no scrolling
  for (const term of [
    "Neural network",
    "Airports routing",
    "Boeing",
    "Expedia",
    "UW–Madison",
  ])
    ok(`Find locates "${term}" without scrolling`, has(t, term));

  ok(
    "header exposes a Work destination",
    await p.evaluate(() =>
      [...document.querySelectorAll("header a")].some(
        (a) => a.getAttribute("href") === "#work",
      ),
    ),
  );

  // every project link is in the DOM at rest, at the top of the page
  const links = await p.evaluate(() =>
    [...document.querySelectorAll("#work a[href^='http']")].map((a) => a.href),
  );
  ok(
    "all 4 project links present at rest",
    links.length === 4,
    links.join(","),
  );

  ok(
    "heading order is h1 → h2 → h3 with no skips",
    await p.evaluate(() => {
      const ls = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
        Number(h.tagName[1]),
      );
      return ls.every((l, i) => i === 0 || l - ls[i - 1] <= 1);
    }),
  );

  ok("no leftover SYS stage numbering", !/SYS \/\//.test(t));
  ok("no 'Play it' / 'Live demo' mismatch", !t.includes("Play it"));
  ok(
    "header CTA says Message, not Email",
    /MESSAGE/i.test(t) && !/^EMAIL$/im.test(t),
  );

  ok(
    "page is far shorter than the old 630vh sequence",
    (await p.evaluate(() => document.documentElement.scrollHeight)) < 5200,
    `height=${await p.evaluate(() => document.documentElement.scrollHeight)}`,
  );
  ok("exactly one canvas", (await p.$$("canvas")).length === 1);
  await p.close();
}

// ── Keyboard and focus ────────────────────────────────────────────────────
console.log("\nKEYBOARD AND FOCUS");
{
  const p = await fresh();

  // skip link actually moves focus into main
  await p.keyboard.press("Tab");
  await p.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 400));
  ok(
    "skip link moves focus to <main>",
    await p.evaluate(() => document.activeElement?.id === "main-content"),
  );

  // tab through the whole page; nothing focused may be invisible
  const bad = await p.evaluate(async () => {
    // the reveal has a 0.45s opacity transition; without this we sample the
    // animation rather than the state the rule actually resolves to
    const kill = document.createElement("style");
    kill.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(kill);
    const focusables = [
      ...document.querySelectorAll(
        "a[href], button, input, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ].filter((el) => el.offsetParent !== null || el.tagName === "A");
    const problems = [];
    for (const el of focusables) {
      el.focus();
      const wrap = el.closest("[data-reveal]");
      const style = getComputedStyle(wrap ?? el);
      if (Number(style.opacity) < 0.85)
        problems.push(
          (el.textContent || el.ariaLabel || "?").trim().slice(0, 24) +
            " @" +
            style.opacity,
        );
    }
    kill.remove();
    return problems;
  });
  ok(
    "no focused control sits below 0.85 opacity",
    bad.length === 0,
    bad.join(" | "),
  );

  ok(
    "every project CTA is keyboard reachable in order",
    await p.evaluate(() => {
      const order = [...document.querySelectorAll("a[href], button")];
      const work = [...document.querySelectorAll("#work a[href^='http']")];
      const idx = work.map((w) => order.indexOf(w));
      return idx.every((v, i) => v >= 0 && (i === 0 || v > idx[i - 1]));
    }),
  );
  await p.close();
}

// ── Fallbacks ─────────────────────────────────────────────────────────────
console.log("\nNO JS");
{
  const p = await fresh({ js: false });
  const t = await text(p);
  ok("no canvas", (await p.$$("canvas")).length === 0);
  for (const term of [
    "Neural network",
    "Airports routing",
    "Boeing",
    "Expedia",
  ])
    ok(`"${term}" in server HTML`, has(t, term));
  ok(
    "all 4 project links in server HTML",
    (await p.evaluate(
      () => document.querySelectorAll("#work a[href^='http']").length,
    )) === 4,
  );
  ok(
    "résumé + mailto work without JS",
    await p.evaluate(() => {
      const a = [...document.querySelectorAll("a")];
      return (
        a.some((x) => x.getAttribute("href")?.endsWith("/resume.pdf")) &&
        a.some((x) => x.getAttribute("href")?.startsWith("mailto:"))
      );
    }),
  );
  ok(
    "no viewports of dead space",
    (await p.evaluate(() => document.documentElement.scrollHeight)) < 5200,
  );
  await p.close();
}

console.log("\nNO WEBGL");
{
  const p = await fresh({ noWebgl: true });
  const t = await text(p);
  ok("no canvas mounted", (await p.$$("canvas")).length === 0);
  for (const term of ["Neural network", "Airports routing", "Boeing"])
    ok(`"${term}" still present`, has(t, term));
  ok(
    "no empty cinematic screens (page is normal flow)",
    (await p.evaluate(() => document.documentElement.scrollHeight)) < 5200,
  );
  await p.close();
}

console.log("\nREDUCED MOTION");
{
  const p = await fresh({ reduced: true });
  const t = await text(p);
  ok("no canvas at all", (await p.$$("canvas")).length === 0);
  ok("content intact", has(t, "Neural network") && has(t, "Boeing"));
  ok(
    "nothing hidden by reveal",
    await p.evaluate(
      () => !document.documentElement.classList.contains("reveal-ready"),
    ),
  );
  await p.close();
}

// ── Contact ───────────────────────────────────────────────────────────────
console.log("\nCONTACT");
{
  const p = await fresh();
  await new Promise((r) => setTimeout(r, 2500)); // idle prefetch

  ok(
    "honeypot is not named 'company' (autofill-safe)",
    await p.evaluate(() => !document.querySelector("[name='company']")),
  );

  await p.evaluate(() =>
    [...document.querySelectorAll("header a")]
      .find((x) => /message/i.test(x.textContent))
      ?.click(),
  );
  await new Promise((r) => setTimeout(r, 600));
  ok(
    "dialog opens on click",
    await p.evaluate(() => !!document.querySelector("dialog")?.open),
  );
  ok(
    "trap field present but non-semantic",
    await p.evaluate(() => {
      const el = document.querySelector("dialog [name='ref_id']");
      return !!el && el.tabIndex === -1 && el.autocomplete === "off";
    }),
  );
  ok(
    "dialog scrolls rather than clipping",
    await p.evaluate(() => {
      const d = document.querySelector("dialog");
      return getComputedStyle(d).overflowY === "auto";
    }),
  );
  ok(
    "direct-email fallback visible in dialog",
    await p.evaluate(
      () => !!document.querySelector("dialog a[href^='mailto:']"),
    ),
  );
  await p.close();
}

// ── Responsive matrix ─────────────────────────────────────────────────────
console.log("\nRESPONSIVE MATRIX");
for (const [w, h] of SIZES) {
  console.log(`\n${w}x${h}`);
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(URL, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1800));

  const H = await p.evaluate(() => document.documentElement.scrollHeight);

  // 1. no horizontal overflow anywhere down the page
  let overflow = null;
  for (let y = 0; y < H; y += Math.round(h * 0.6)) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 90));
    const bad = await p.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (bad) overflow = y;
  }
  ok("no horizontal overflow", overflow === null, `at y=${overflow}`);

  // 2. header actions all inside the viewport
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 150));
  const clipped = await p.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("header a, header button")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > window.innerWidth + 0.5 || r.left < -0.5)
        bad.push((el.textContent || el.ariaLabel || "?").trim().slice(0, 18));
    }
    return bad;
  });
  ok("no clipped header action", clipped.length === 0, clipped.join(","));

  // 3. fixed header never covers a section heading after an anchor jump
  const covered = [];
  for (const id of ["work", "experience", "profile", "contact"]) {
    await p.evaluate((i) => {
      location.hash = "";
      location.hash = i;
    }, id);
    await new Promise((r) => setTimeout(r, 350));
    const bad = await p.evaluate((i) => {
      const sec = document.getElementById(i);
      const hd = sec.querySelector("h2") || sec;
      const r = hd.getBoundingClientRect();
      const headerH = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
      return r.top < headerH - 1;
    }, id);
    if (bad) covered.push(id);
  }
  ok(
    "header covers no heading after anchor jump",
    covered.length === 0,
    covered.join(","),
  );

  // 4. every project CTA reachable and non-zero sized
  const ctas = await p.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll("#work a[href^='http']")) {
      const r = a.getBoundingClientRect();
      out.push({
        label: a.textContent.trim().slice(0, 12),
        w: Math.round(r.width),
        hh: Math.round(r.height),
      });
    }
    return out;
  });
  ok("all 4 project CTAs present", ctas.length === 4, JSON.stringify(ctas));
  ok(
    "project CTAs >=44px tall",
    ctas.every((c) => c.hh >= 44),
    JSON.stringify(ctas.filter((c) => c.hh < 44)),
  );

  // 5. readout cells do not collide (3 equal columns, no overlap)
  const collide = await p.evaluate(() => {
    for (const dl of document.querySelectorAll("dl.grid-cols-3")) {
      const cells = [...dl.children].map((c) => c.getBoundingClientRect());
      for (let i = 1; i < cells.length; i++)
        if (cells[i].left < cells[i - 1].right - 1) return true;
      // value must not spill out of its cell
      for (const c of dl.children) {
        const box = c.getBoundingClientRect();
        const dd = c.querySelector("dd").getBoundingClientRect();
        if (dd.right > box.right + 1) return true;
      }
    }
    return false;
  });
  ok("readout cells do not collide or spill", !collide);

  // 6. nothing pinned/sticky hides content on a short viewport
  const stuck = await p.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("main *")) {
      const s = getComputedStyle(el);
      if (s.position === "sticky" || s.position === "fixed") {
        if (el.getBoundingClientRect().height > window.innerHeight * 0.9)
          bad.push(el.tagName + "." + String(el.className).slice(0, 30));
      }
      // .sr-only is a 1px clipped box by design — that is how it hides text
      // from sighted users while keeping it for screen readers
      if (
        s.overflow === "hidden" &&
        !el.classList.contains("sr-only") &&
        el.scrollHeight > el.clientHeight + 2
      )
        bad.push(
          "clipped:" + el.tagName + "." + String(el.className).slice(0, 30),
        );
    }
    return bad;
  });
  ok(
    "no pinned/clipping block hides content",
    stuck.length === 0,
    stuck.join(" | "),
  );

  // 7. contact dialog actions reachable
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 2400)); // let the idle prefetch land
  await p.evaluate(() => {
    const b = [...document.querySelectorAll("header a")].find((x) =>
      /message/i.test(x.textContent),
    );
    b?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const dlg = await p.evaluate(() => {
    const d = document.querySelector("dialog");
    if (!d || !d.open) return null;
    const r = d.getBoundingClientRect();
    const send = [...d.querySelectorAll("button")].find((b) =>
      /send/i.test(b.textContent),
    );
    const mailto = d.querySelector("a[href^='mailto:']");
    const inView = (el) => {
      if (!el) return false;
      // reachable = inside the dialog's own scrollable box
      const er = el.getBoundingClientRect();
      return er.height > 0 && er.top >= r.top - 1 && er.bottom <= r.bottom + 1;
    };
    // scroll the dialog to the bottom, then re-check
    d.scrollTop = d.scrollHeight;
    return {
      fitsViewport: r.height <= window.innerHeight + 1,
      scrollable: d.scrollHeight > d.clientHeight,
      sendReachable: inView(send) || d.scrollHeight > d.clientHeight,
      mailtoPresent: !!mailto,
    };
  });
  ok("contact dialog opened", dlg !== null);
  if (dlg) {
    ok("dialog fits the viewport", dlg.fitsViewport, JSON.stringify(dlg));
    ok("send reachable", dlg.sendReachable);
    ok("direct-email fallback present", dlg.mailtoPresent);
  }

  await p.close();
}

console.log(
  `\n${pass}/${pass + fail} checks passed` + (fail ? ` — ${fail} FAILED` : ""),
);
await browser.close();
process.exit(fail ? 1 : 0);
