/* ============================================================
   Public holiday engine
   Rules, not a hard-coded date list — so any year computes
   correctly, including Easter-linked and nth-weekday holidays.
   Substitute / observed days are applied per jurisdiction.
   ============================================================ */
(function (global) {
  "use strict";

  /* Anonymous Gregorian algorithm (Meeus/Jones/Butcher) */
  function easterSunday(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100;
    const d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(y, month - 1, day));
  }
  const addDays = (d, n) => { const o = new Date(d); o.setUTCDate(o.getUTCDate() + n); return o; };
  const iso = (d) => d.toISOString().slice(0, 10);

  /* nth weekday of a month. n = 1..5, or -1 for the last one. */
  function nthWeekday(y, month, weekday, n) {
    if (n > 0) {
      const first = new Date(Date.UTC(y, month - 1, 1));
      const shift = (weekday - first.getUTCDay() + 7) % 7;
      return new Date(Date.UTC(y, month - 1, 1 + shift + (n - 1) * 7));
    }
    const last = new Date(Date.UTC(y, month, 0));
    const back = (last.getUTCDay() - weekday + 7) % 7;
    return new Date(Date.UTC(y, month, 0 - back));
  }
  /* Monday on or before a given date (e.g. Canadian Victoria Day) */
  function mondayBefore(y, month, day) {
    const d = new Date(Date.UTC(y, month - 1, day));
    const back = (d.getUTCDay() + 6) % 7;
    return addDays(d, -back || (d.getUTCDay() === 1 ? 0 : -back));
  }

  const F = (m, d, name, sub) => ({ type: "fixed", m, d, name, sub });
  const E = (o, name) => ({ type: "easter", o, name });
  const N = (m, wd, n, name) => ({ type: "nth", m, wd, n, name });

  /* Substitution behaviour:
     "next"    – roll forward to the next free weekday (UK, IE, AU, CA)
     "nearest" – Sat→Fri, Sun→Mon (US federal)
     "mondayise" – Sat/Sun → next free Monday-onward weekday (NZ)
     undefined – no substitution (DE, FR, and fixed-date AU/NZ exceptions) */

  const RULES = {
    none: { label: "No holiday calendar", note: "Weekends only. No public holidays are excluded.", rules: [] },

    us: {
      label: "United States (federal)",
      note: "US federal holidays. State and local holidays are not included; private employers are not required to observe all of these.",
      rules: [
        F(1, 1, "New Year's Day", "nearest"),
        N(1, 1, 3, "Martin Luther King Jr. Day"),
        N(2, 1, 3, "Washington's Birthday"),
        N(5, 1, -1, "Memorial Day"),
        F(6, 19, "Juneteenth", "nearest"),
        F(7, 4, "Independence Day", "nearest"),
        N(9, 1, 1, "Labor Day"),
        N(10, 1, 2, "Columbus Day"),
        F(11, 11, "Veterans Day", "nearest"),
        N(11, 4, 4, "Thanksgiving Day"),
        F(12, 25, "Christmas Day", "nearest"),
      ],
    },

    "uk-ew": {
      label: "United Kingdom — England & Wales",
      note: "Bank holidays for England and Wales. Scotland and Northern Ireland differ; select them separately.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        E(-2, "Good Friday"),
        E(1, "Easter Monday"),
        N(5, 1, 1, "Early May bank holiday"),
        N(5, 1, -1, "Spring bank holiday"),
        N(8, 1, -1, "Summer bank holiday"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "Boxing Day", "next"),
      ],
    },

    "uk-sct": {
      label: "United Kingdom — Scotland",
      note: "Scottish bank holidays. Scotland has no Easter Monday holiday and takes its summer holiday in early August.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        F(1, 2, "2 January", "next"),
        E(-2, "Good Friday"),
        N(5, 1, 1, "Early May bank holiday"),
        N(5, 1, -1, "Spring bank holiday"),
        N(8, 1, 1, "Summer bank holiday"),
        F(11, 30, "St Andrew's Day", "next"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "Boxing Day", "next"),
      ],
    },

    "uk-ni": {
      label: "United Kingdom — Northern Ireland",
      note: "Northern Ireland bank holidays, including St Patrick's Day and the Battle of the Boyne.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        F(3, 17, "St Patrick's Day", "next"),
        E(-2, "Good Friday"),
        E(1, "Easter Monday"),
        N(5, 1, 1, "Early May bank holiday"),
        N(5, 1, -1, "Spring bank holiday"),
        F(7, 12, "Battle of the Boyne", "next"),
        N(8, 1, -1, "Summer bank holiday"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "Boxing Day", "next"),
      ],
    },

    ie: {
      label: "Ireland",
      note: "Irish public holidays. St Brigid's Day is the first Monday in February, except when 1 February is a Friday.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        { type: "brigid", name: "St Brigid's Day" },
        F(3, 17, "St Patrick's Day", "next"),
        E(1, "Easter Monday"),
        N(5, 1, 1, "May Day"),
        N(6, 1, 1, "June bank holiday"),
        N(8, 1, 1, "August bank holiday"),
        N(10, 1, -1, "October bank holiday"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "St Stephen's Day", "next"),
      ],
    },

    ca: {
      label: "Canada (federal)",
      note: "Federally regulated holidays. Provincial holidays — Family Day, St-Jean-Baptiste, Civic Holiday and others — are not included.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        E(-2, "Good Friday"),
        { type: "victoria", name: "Victoria Day" },
        F(7, 1, "Canada Day", "next"),
        N(9, 1, 1, "Labour Day"),
        F(9, 30, "National Day for Truth and Reconciliation", "next"),
        N(10, 1, 2, "Thanksgiving"),
        F(11, 11, "Remembrance Day", "next"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "Boxing Day", "next"),
      ],
    },

    au: {
      label: "Australia (national)",
      note: "Nationally observed holidays only. King's Birthday, Labour Day and state shows vary by state and are not included.",
      rules: [
        F(1, 1, "New Year's Day", "next"),
        F(1, 26, "Australia Day", "next"),
        E(-2, "Good Friday"),
        E(1, "Easter Monday"),
        F(4, 25, "Anzac Day"),
        F(12, 25, "Christmas Day", "next"),
        F(12, 26, "Boxing Day", "next"),
      ],
    },

    nz: {
      label: "New Zealand (national)",
      note: "National public holidays. Regional anniversary days are not included. Matariki uses the officially published dates and is only listed for years that have been announced.",
      rules: [
        F(1, 1, "New Year's Day", "mondayise"),
        F(1, 2, "Day after New Year's Day", "mondayise"),
        F(2, 6, "Waitangi Day", "mondayise"),
        E(-2, "Good Friday"),
        E(1, "Easter Monday"),
        F(4, 25, "Anzac Day", "mondayise"),
        N(6, 1, 1, "King's Birthday"),
        { type: "table", name: "Matariki", dates: {
          2022: "06-24", 2023: "07-14", 2024: "06-28", 2025: "06-20", 2026: "07-10",
          2027: "06-25", 2028: "07-14", 2029: "07-06", 2030: "06-21", 2031: "07-11",
          2032: "07-02", 2033: "06-24", 2034: "07-07", 2035: "06-29" } },
        N(10, 1, 4, "Labour Day"),
        F(12, 25, "Christmas Day", "mondayise"),
        F(12, 26, "Boxing Day", "mondayise"),
      ],
    },

    in: {
      label: "India (national gazetted)",
      note: "Only the three holidays observed nationwide. Most Indian public holidays are state-specific or follow religious calendars that shift each year — add those for your own state before relying on a count.",
      rules: [
        F(1, 26, "Republic Day"),
        F(8, 15, "Independence Day"),
        F(10, 2, "Gandhi Jayanti"),
      ],
    },

    de: {
      label: "Germany (nationwide)",
      note: "Holidays observed in every federal state. State holidays — Epiphany, Corpus Christi, Assumption, Reformation Day, All Saints' Day — are not included. Germany does not substitute holidays that fall at a weekend.",
      rules: [
        F(1, 1, "Neujahrstag"),
        E(-2, "Karfreitag"),
        E(1, "Ostermontag"),
        F(5, 1, "Tag der Arbeit"),
        E(39, "Christi Himmelfahrt"),
        E(50, "Pfingstmontag"),
        F(10, 3, "Tag der Deutschen Einheit"),
        F(12, 25, "Erster Weihnachtstag"),
        F(12, 26, "Zweiter Weihnachtstag"),
      ],
    },

    fr: {
      label: "France",
      note: "National holidays. Alsace-Moselle observes two additional days. France does not substitute holidays that fall at a weekend.",
      rules: [
        F(1, 1, "Jour de l'An"),
        E(1, "Lundi de Pâques"),
        F(5, 1, "Fête du Travail"),
        F(5, 8, "Victoire 1945"),
        E(39, "Ascension"),
        E(50, "Lundi de Pentecôte"),
        F(7, 14, "Fête nationale"),
        F(8, 15, "Assomption"),
        F(11, 1, "Toussaint"),
        F(11, 11, "Armistice 1918"),
        F(12, 25, "Noël"),
      ],
    },
  };

  function substitute(date, mode, taken) {
    if (!mode) return date;
    const dow = date.getUTCDay();
    if (dow !== 0 && dow !== 6) return date;
    if (mode === "nearest") return addDays(date, dow === 6 ? -1 : 1);
    let out = addDays(date, dow === 6 ? 2 : 1);          // next / mondayise
    while (out.getUTCDay() === 0 || out.getUTCDay() === 6 || taken.has(iso(out))) {
      out = addDays(out, 1);
    }
    return out;
  }

  const cache = new Map();

  function forYear(code, year) {
    const key = code + ":" + year;
    if (cache.has(key)) return cache.get(key);
    const spec = RULES[code];
    const out = [];
    if (!spec || !spec.rules.length) { cache.set(key, out); return out; }
    const easter = easterSunday(year);
    const taken = new Set();

    for (const r of spec.rules) {
      let base;
      if (r.type === "fixed") base = new Date(Date.UTC(year, r.m - 1, r.d));
      else if (r.type === "easter") base = addDays(easter, r.o);
      else if (r.type === "nth") base = nthWeekday(year, r.m, r.wd, r.n);
      else if (r.type === "victoria") base = mondayBefore(year, 5, 24);
      else if (r.type === "brigid") {
        const feb1 = new Date(Date.UTC(year, 1, 1));
        base = feb1.getUTCDay() === 5 ? feb1 : nthWeekday(year, 2, 1, 1);
      } else if (r.type === "table") {
        if (!r.dates[year]) continue;
        const [m, d] = r.dates[year].split("-").map(Number);
        base = new Date(Date.UTC(year, m - 1, d));
      } else continue;

      const obs = substitute(base, r.sub, taken);
      const moved = iso(obs) !== iso(base);
      taken.add(iso(obs));
      out.push({ date: iso(obs), name: r.name + (moved ? " (substitute day)" : ""), nominal: iso(base), moved });
    }
    out.sort((a, b) => a.date.localeCompare(b.date));
    cache.set(key, out);
    return out;
  }

  /* All observed holiday dates between two dates, inclusive. */
  function between(code, start, end) {
    if (!code || code === "none") return [];
    let a = start, b = end;
    if (b < a) { a = end; b = start; }
    const out = [];
    for (let y = a.getUTCFullYear(); y <= b.getUTCFullYear(); y++) {
      for (const h of forYear(code, y)) {
        if (h.date >= iso(a) && h.date <= iso(b)) out.push(h);
      }
    }
    return out;
  }

  function isHoliday(code, date) {
    if (!code || code === "none") return null;
    const s = iso(date);
    return forYear(code, date.getUTCFullYear()).find((h) => h.date === s) || null;
  }

  global.Holidays = {
    RULES, forYear, between, isHoliday, easterSunday,
    label: (c) => (RULES[c] || RULES.none).label,
    note: (c) => (RULES[c] || RULES.none).note,
    codes: () => Object.keys(RULES),
  };
})(typeof window !== "undefined" ? window : globalThis);
