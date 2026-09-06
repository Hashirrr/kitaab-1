# Kitaab (كِتَاب)

> *"Read your book; today your own soul is sufficient as an auditor against you."*  
> — Surah Al-Isra (17:14)

---

## 🕊️ Concept & Vision

**Kitaab** (Arabic for *"Book"*, referring to *Kitāb al-A'māl* — the Book of Deeds) is a mindful spiritual productivity and introspection platform designed for the ancient discipline of **Muhāsabah** (mindful self-reckoning and intentional accountability).

Traditional habit trackers treat spiritual life like a chore list: noisy gamification, dopamine-fueled streaks, jarring bright colors, and binary yes/no checklists. 

**Kitaab reimagines this entirely.** It is built on the philosophy that a deed is not merely "done" or "not done" — it carries quality, intention, and variation:
- A prayer (*Salah*) isn't just checked off; was it offered *In Mosque*, *On Time*, *Late*, or *Missed*?
- Remembrance (*Dhikr* / *Tasbeeh*) isn't a checkbox; it is a living count of repetitions throughout the day.
- Growth requires clarity: recognizing virtuous acts (*Hasanaat*) and identifying areas needing repentance and realignment (*Sayyi'aat*).

Kitaab is your digital spiritual journal — a tranquil sanctuary to pause, reflect, and record the record of your day before closing your eyes at night.

---

## 🌑 The Aesthetic & "The Vibe"

The aesthetic of Kitaab is **Zen-Monochrome, Contemplative, and Calming**:

- **Monochrome Sanctuary**: Crafted strictly in curated grayscale and soft opacity layers (`rgba(0, 0, 0, α)` / `rgba(255, 255, 255, α)`). By shedding loud reds, greens, and notification badges, the interface strips away anxiety, sensory overload, and performative guilt.
- **Duality of Light & Dark**: Features an inverted high-contrast dark and light mode that respects your environment, whether reflecting during late-night *Qiyam* or logging records in morning light.
- **Fluid & Tactile**: Organic micro-interactions, subtle glassmorphic blurs, custom smooth-curved variable-pie charts, and smooth drag-and-drop reordering.
- **Quiet Dignity**: Clean, deliberate typography combining Google Sans Flex and Fredoka to balance elegance with soft, approachable warmth.

---

## 🧭 Core Architectural Pillars

### 1. Hierarchical Deed Architecture
Deeds mirror the depth of real-life spiritual practices:
- **Parent Deeds**: Broad categories or pillars (e.g., *Salah*, *Qur'an*, *Tasbeeh*, *Sadaqah*).
- **Sub-Deeds**: Granular components under a parent (e.g., *Salah* splits into *Fajr*, *Zuhr*, *Asr*, *Maghrib*, and *Isha*).
- **Custom Reordering**: Drag-and-drop prioritization powered by `@dnd-kit`.

### 2. Dual Tracking Dimensions
Kitaab recognizes two distinct types of deeds:
- **Scale Deeds (Qualitative)**: Multi-state evaluations that capture the nuances of execution (e.g., *In Mosque*, *On Time*, *Late*, *Missed*, or *Yes / No*).
- **Count Deeds (Quantitative)**: Precision counters with numeric stepper controls for deeds measured in quantity (e.g., *Tasbeeh* counts: *33*, *100*, *384 times today*).

### 3. Dynamic Variable-Pie Analytics
A proprietary visualization system built on Highcharts:
- Slices scale in both **angle** (frequency) and **radial weight** (importance/value).
- **Dynamic Opacity Shading**: Visually encodes performance tiers without relying on conflicting color schemes.
- **Interactive Segment Exclusion**: Tapping any scale label (in desktop, tablet/pad, or mobile views) dynamically excludes or includes that segment with smooth transitional re-balancing for deep-dive analysis.

### 4. Chronological Daily Records
- Continuous calendar matrix ensuring chronological consistency.
- Step-by-step logging workflow with instant feedback.
- Historical inspection to review trends across weeks and months.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [TanStack React Query](https://tanstack.com/query/latest)
- **Data Visualization**: [Highcharts](https://www.highcharts.com/) (Variable-Pie & Accessibility modules)
- **Interactions & Drag-and-Drop**: [@dnd-kit](https://dndkit.com/)
- **Forms & Validation**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **Dates & Calendars**: [Day.js](https://day.js.org/)
- **Styling**: Vanilla CSS Modules, CSS Custom Properties, and responsive viewport adaptations

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Hashirrr/kitaab-1.git
cd kitaab-1
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view Kitaab in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```
