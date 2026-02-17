# CLAUDE.md - Horariomat

## Project Overview

**Horariomat** is a Progressive Web App (PWA) for school schedule management built for E.S.F.M. "Simón Bolívar", a Bolivian teacher training college. It provides schedule display, reminders, attendance tracking, grades, and academic calendar management.

- **Language:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Architecture:** Single-file SPA — everything lives in `index.html` (~3,800 lines)
- **Backend:** None. Fully client-side with `localStorage` persistence
- **External dependency:** SheetJS (XLSX) via CDN for Excel export
- **Locale:** Spanish (es-BO). All UI text, variable names for days, and data are in Spanish

## Repository Structure

```
horariomat/
└── index.html    # The entire application (HTML + CSS + JS)
```

This is a monolithic single-file application. There is no build system, no package manager, no test framework, no linter, and no CI/CD pipeline.

## Development Workflow

### Running Locally

Open `index.html` directly in a browser, or serve it with any static file server. No build step is required.

### Deploying

Deploy the single `index.html` file to any static hosting. The app includes a dynamically generated Service Worker and Web Manifest for PWA support.

### Testing

No automated tests exist. All testing is manual in the browser.

### Linting / Formatting

No linting or formatting tools are configured.

## Application Architecture

### Views (Bottom Tab Navigation)

1. **Horario** — Daily class schedule with week navigation
2. **Calendario** — Monthly calendar with events and holidays
3. **Recordatorios** — Task/reminder management with categories
4. **Asistencia** — Student attendance tracking with Excel export
5. **Configuración** — Academic calendar, subjects, teachers, periods, grades

### State & Data Persistence

All state is stored in `localStorage` as JSON. Key stores:

| Key | Purpose |
|-----|---------|
| `scheduleData` | Class schedule by day of week |
| `customSchedule` | User-edited schedule overrides |
| `reminders` | User-created reminders/tasks |
| `customCategories` | Reminder categories |
| `attendanceRecords` | Attendance tracking data |
| `studentsList` | Student roster |
| `academicConfig` | Academic calendar (start/end dates, holidays, breaks) |
| `subjectsCatalog` | Available subjects |
| `teachersCatalog` | Available teachers |
| `periodsCatalog` | Class periods |
| `timeSlotsCatalog` | Time slots |
| `evaluationCriteria` | Grade evaluation criteria |
| `studentGrades` | Student grades |
| `theme` | Light/dark mode preference |

### Key Data Structures

```javascript
// Schedule entry
{ time: "8:00 - 9:00", subject: "...", teacher: "...", period: "1er periodo" }

// Reminder
{ title, subject, category, description, date: "YYYY-MM-DD", time: "HH:MM",
  completed: boolean, createdAt: timestamp, notificationSent: boolean }

// Attendance record
{ date, subject, student, status: 'present'|'absent'|'late'|'excused', notes }

// Academic config
{ startDate, endDate, midYearBreakStart, midYearBreakEnd,
  holidays: [{ date: "YYYY-MM-DD", name: "..." }] }
```

### Function Naming Conventions

Functions follow a verb-prefix pattern in camelCase:

- `render*()` — Render/update a UI section
- `save*()` / `load*()` — Persist/retrieve data from localStorage
- `open*()` / `close*()` — Show/hide modal dialogs
- `add*()` / `delete*()` — CRUD operations
- `toggle*()` — Toggle boolean state
- `mark*()` — Set status (e.g., attendance)
- `export*()` — Export data (Excel, JSON backup)
- `is*()` / `get*()` — Boolean checks and getters
- `change*()` — Navigate (day, week, month)
- `update*()` — Refresh UI elements

### UI Patterns

- **Event handlers:** Inline `onclick` attributes in HTML
- **Modals:** Hidden `<div>` elements toggled via CSS display
- **Navigation:** Tab-based with a fixed bottom nav bar
- **Dates:** ISO 8601 format (`YYYY-MM-DD`) throughout
- **Touch support:** Calendar days support touch events

### Theming (CSS Variables)

```css
--primary: #006847   /* Dark green - Bolivian flag */
--secondary: #FFD700 /* Gold */
--red: #CE1126       /* Red - Bolivian flag */
--bg, --card, --text, --border  /* Surface colors, toggled for dark mode */
```

### PWA Features

- Service Worker with network-first, cache-fallback strategy
- Dynamically generated Web Manifest with embedded SVG icons
- Install prompt ("Instalar App" button)
- Standalone display mode

### Browser APIs Used

`localStorage`, Notification API, File/Blob API (backup/export), Service Worker API

## Key Domain Details

- **Academic calendar:** Based on Bolivian Ministry of Education Resolution 0001/2026
- **Class day counting:** Excludes weekends, holidays, and vacation periods
- **Days of week:** Referenced as `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`, `domingo`
- **Holiday validation:** `isDateExcluded()` checks holidays and mid-year break ranges

## Guidelines for AI Assistants

1. **Single file:** All changes go in `index.html`. There are no other source files.
2. **No build step:** Changes are immediately reflected by reloading the browser.
3. **Spanish UI:** All user-facing text must be in Spanish. Use Bolivian Spanish conventions.
4. **localStorage contracts:** When modifying data structures, ensure backward compatibility — users have existing data stored locally.
5. **Keep it vanilla:** Do not introduce frameworks, bundlers, or package managers. The simplicity of a single file is intentional.
6. **Date handling:** Always use `YYYY-MM-DD` string format. Be careful with timezone offsets when constructing Date objects from date strings.
7. **Mobile-first:** The app targets mobile browsers. Test UI changes at small viewport widths.
8. **PWA integrity:** Do not break the Service Worker or manifest generation logic.
