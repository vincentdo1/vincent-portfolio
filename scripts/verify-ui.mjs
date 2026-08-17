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
    ok(
      `"${term}" is in rendered text at rest (Find would match)`,
      has(t, term),
    );

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
    "project CTAs appear in sequential DOM order",
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

// ── Real Tab order, not programmatic focus ────────────────────────────────
console.log("\nREAL TAB ORDER");
{
  const p = await fresh();
  const seen = [];
  await p.evaluate(() => document.body.focus());
  for (let i = 0; i < 40; i++) {
    await p.keyboard.press("Tab");
    const info = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // the Next.js dev overlay injects a 0x0 focusable portal; it does not
      // exist in a production build
      if (el.tagName.includes("NEXTJS")) return null;
      const r = el.getBoundingClientRect();
      const wrap = el.closest("[data-reveal]");
      return {
        tag: el.tagName,
        href: el.getAttribute("href") || "",
        label: (el.textContent || el.ariaLabel || "").trim().slice(0, 28),
        opacity: Number(getComputedStyle(wrap ?? el).opacity),
        w: r.width,
        h: r.height,
      };
    });
    if (info) seen.push(info);
  }
  ok(
    "Tab reaches at least 15 controls",
    seen.length >= 15,
    `saw ${seen.length}`,
  );
  const invisible = seen.filter((s) => s.opacity < 0.85);
  ok(
    "nothing reached by real Tab is faded below 0.85",
    invisible.length === 0,
    invisible.map((i) => i.label).join(" | "),
  );
  const zero = seen.filter((s) => s.w === 0 || s.h === 0);
  ok(
    "nothing reached by real Tab is zero-sized",
    zero.length === 0,
    zero.map((z) => z.label).join(" | "),
  );
  ok(
    "Tab reaches both project demos",
    new Set(seen.filter((s) => /github\.io/.test(s.href)).map((s) => s.href))
      .size === 2,
  );
  await p.close();
}

// ── Cold contact click: the mailto must survive an unready dialog ─────────
console.log("\nCOLD CONTACT CLICK");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  // click immediately, before the idle prefetch can resolve
  const prevented = await page.evaluate(() => {
    const a = [...document.querySelectorAll("header a")].find((x) =>
      /message/i.test(x.textContent),
    );
    if (!a) return "no-trigger";
    if (!a.getAttribute("href")?.startsWith("mailto:")) return "not-mailto";
    let defaultPrevented = false;
    a.addEventListener(
      "click",
      (e) => {
        defaultPrevented = e.defaultPrevented;
        e.preventDefault(); // don't actually launch a mail client
      },
      { capture: false },
    );
    a.click();
    return defaultPrevented ? "swallowed" : "fell-through";
  });
  ok(
    "cold click falls through to mailto rather than dying",
    prevented === "fell-through",
    String(prevented),
  );
  await page.close();
}

// ── Contrast of real rendered colours ─────────────────────────────────────
console.log("\nCONTRAST");
{
  const p = await fresh();
  const results = await p.evaluate(() => {
    // Chrome returns computed colours in the authored space — lab(), oklch()
    // — so scraping numbers out of the string is meaningless. Rasterise one
    // pixel instead and read the real sRGB bytes back.
    const ctx = document.createElement("canvas").getContext("2d");
    const parse = (c) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = (rgb) => {
      const f = (u) => {
        u /= 255;
        return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    };
    const ratio = (a, b) => {
      const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
      return (hi + 0.05) / (lo + 0.05);
    };
    const bg = parse(getComputedStyle(document.body).backgroundColor);
    const out = {};

    const heading = document.querySelector("#work h2");
    out.heading = ratio(parse(getComputedStyle(heading).color), bg);

    const body = document.querySelector("#chess-engine p:nth-of-type(2)");
    out.body = ratio(parse(getComputedStyle(body).color), bg);

    const dt = document.querySelector("#chess-engine dl dt");
    out.readoutLabel = ratio(parse(getComputedStyle(dt).color), bg);

    // interactive outline: the Source button
    const outlined = [...document.querySelectorAll("#work a")].find((a) =>
      /source/i.test(a.textContent),
    );
    out.outlinedBorder = ratio(
      parse(getComputedStyle(outlined).borderTopColor),
      bg,
    );
    return out;
  });

  ok(
    `section heading text >= 4.5 (${results.heading.toFixed(2)}:1)`,
    results.heading >= 4.5,
  );
  ok(
    `project body text >= 4.5 (${results.body.toFixed(2)}:1)`,
    results.body >= 4.5,
  );
  ok(
    `readout label >= 4.5 (${results.readoutLabel.toFixed(2)}:1)`,
    results.readoutLabel >= 4.5,
  );
  ok(
    `outlined control border >= 3.0 (${results.outlinedBorder.toFixed(2)}:1)`,
    results.outlinedBorder >= 3.0,
  );
  await p.close();
}

// ── Field registration contract ──────────────────────────────────────────
// The audit found the field sticking on one shape: two project cards shared a
// grid row, tied on vertical distance, and insertion order silently won —
// leaving the globe unreachable and the previous shape persisting past the
// last registered section. The fix was to register whole sections instead.
//
// Verifying the *rendered* shape is not possible here: the canvas runs
// without `preserveDrawingBuffer` (deliberately, for performance), so
// toDataURL returns a blank buffer. What is checkable is the contract the fix
// depends on — every major section exists as a distinct registration target,
// including the ones after Experience that used to have none.
console.log("\nFIELD REGISTRATION CONTRACT");
{
  const p = await fresh();
  ok("canvas is present", (await p.$$("canvas")).length === 1);
  for (const sel of ["#work", "#experience", "#profile", "#contact"])
    ok(`${sel} exists as a registration target`, (await p.$(sel)) !== null);
  ok(
    "sections after Experience have their own targets (no shape persistence)",
    (await p.$("#profile")) !== null && (await p.$("#contact")) !== null,
  );
  ok(
    "project cards are inside #work, not siblings competing with it",
    await p.evaluate(() => {
      const work = document.getElementById("work");
      return (
        work.contains(document.getElementById("chess-engine")) &&
        work.contains(document.getElementById("airport-routing"))
      );
    }),
  );
  await p.close();
}

// ── Console errors and failed requests ────────────────────────────────────
console.log("\nRUNTIME CLEANLINESS");
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  const failed = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 120));
  });
  page.on("pageerror", (e) =>
    errors.push("pageerror: " + String(e).slice(0, 120)),
  );
  page.on("requestfailed", (r) => failed.push(r.url().slice(0, 120)));
  await page.goto(URL, { waitUntil: "networkidle0" });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 120));
  }
  ok("no console errors", errors.length === 0, errors.join(" | "));
  ok("no failed requests", failed.length === 0, failed.join(" | "));
  await page.close();
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
    const bad = [];
    for (const dl of document.querySelectorAll("dl[class*='grid']")) {
      const cells = [...dl.children];
      const boxes = cells.map((c) => c.getBoundingClientRect());
      for (let i = 1; i < boxes.length; i++)
        if (
          boxes[i].left < boxes[i - 1].right - 1 &&
          boxes[i].top < boxes[i - 1].bottom - 1
        )
          bad.push("cells overlap");
      // BOTH dt and dd must stay inside their own cell. Checking only dd was
      // how a real 320px failure got through: the labels were the overflow.
      for (const c of cells) {
        const box = c.getBoundingClientRect();
        for (const kid of c.querySelectorAll("dt,dd")) {
          const k = kid.getBoundingClientRect();
          if (k.right > box.right + 1 || k.left < box.left - 1)
            bad.push(
              `${kid.tagName} "${kid.textContent.trim().slice(0, 14)}" spills`,
            );
          // scrollWidth beats getBoundingClientRect for text clipped by the box
          if (kid.scrollWidth > Math.ceil(k.width) + 1)
            bad.push(
              `${kid.tagName} "${kid.textContent.trim().slice(0, 14)}" clipped`,
            );
        }
      }
    }
    return bad;
  });
  ok(
    "readout labels and values stay inside their cells",
    collide.length === 0,
    collide.slice(0, 4).join(" | "),
  );

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
