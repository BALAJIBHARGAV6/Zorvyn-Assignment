# FinSight — Premium Finance Dashboard

A production-grade, single-file React finance dashboard with dark luxury fintech aesthetics, role-based access control, transaction management, interactive charts, insights analytics, and full localStorage persistence.

## 🎯 Features

### Core Functionality
- ✅ **Dashboard Tab** — Real-time financial overview with summary cards, balance trend chart, and spending by category visualization
- ✅ **Transactions Tab** — Full transaction management with search, filtering, sorting, and pagination
- ✅ **Insights Tab** — Advanced analytics including biggest spender category, monthly comparison, top 3 expenses, spending streaks, and savings goals
- ✅ **Settings Tab** — Role management, dark mode toggle, data export (JSON/CSV), and demo data reset

### Advanced Features
- 🔐 **Role-Based Access** — Admin (full control) and Viewer (read-only) roles with instant UI updates
- 💾 **localStorage Persistence** — Transactions automatically saved and restored with error recovery
- 📊 **Interactive Charts** — Recharts-powered area, pie, and bar charts with real-time data
- 🎨 **Dark Luxury Design** — Premium fintech aesthetic with emerald/mint accents and smooth animations
- 📱 **Fully Responsive** — Mobile-first design with adaptive layouts and touch-friendly interactions
- ⚡ **Performance Optimized** — useMemo/useCallback throughout, memoized context value, no unnecessary re-renders
- 🔍 **Form Validation** — Real-time validation with visual feedback (red borders on errors)
- 📤 **Data Export** — Download transaction data as JSON or CSV

### UI/UX Polish
- Loading screen with smooth animations
- Toast notifications for all actions
- Smooth transitions and hover effects
- Empty state indicators with actionable guidance
- Keyboard-accessible interactive elements
- WCAG accessibility compliant modals

## 📋 Assignment Requirements — All Met ✅

### Fix 1: Unused Imports Removed ✅
- LineChart and Line removed from recharts import
- LogOut and Filter removed from lucide-react import
- All remaining imports actively used in code

### Fix 2: Empty State for Transactions ✅
- Shows when filtered results = 0
- Includes Search icon, heading text, and subtext
- "Clear Filters" button resets all filters
- Matches dark theme (card background, dark text)

### Fix 3: localStorage Persistence ✅
- useState lazy initializer with localStorage.getItem()
- Try/catch wraps read to handle corrupt data
- useEffect saves on every transactions change
- Reset button clears localStorage before resetting data
- Consistent key across all operations: `'finsight_transactions'`

### Fix 4: Form Validation Visual Feedback ✅
- Red border appears on description, amount, date fields when errors exist
- Red box-shadow (0 0 0 2px rgba(239,68,68,0.2)) applied on error state
- Reverts to normal border when error clears
- Applied to ALL validated fields

## 💻 Tech Stack

- **React 18+** — Hooks, Context API, performance optimization
- **Recharts** — Interactive data visualization
- **Tailwind CSS** — Responsive utility-first styling
- **Lucide React** — Beautiful icon library
- **localStorage API** — Client-side data persistence

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/BALAJIBHARGAV6/Zorvyn-Assignment.git
cd Zorvyn

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Demo Data

The dashboard includes 30+ mock transactions across January, February, and March 2024 with:
- Multiple income sources (Salary, Freelance, Investments, Dividends)
- Diverse expense categories (Food, Entertainment, Shopping, Transport, etc.)
- Realistic amounts ranging from $6 to $5,000
- Mixed transaction statuses (Completed, Pending)

**Reset to demo data anytime** via Settings → Reset to Demo Data

## 🎮 User Roles

### Admin Role
- ✅ View all dashboard data
- ✅ Add new transactions
- ✅ Edit existing transactions
- ✅ Delete transactions (with confirmation)
- ✅ Export data (JSON/CSV)
- ✅ Reset to demo data
- ✅ Toggle dark mode

### Viewer Role
- ✅ View all dashboard data
- ✅ Filter and search transactions
- ✅ View insights and analytics
- ❌ Cannot add/edit/delete transactions
- ❌ Cannot export data
- ❌ Cannot reset data

**Toggle roles** via the role switcher in the header (Admin/Viewer buttons)

## 🎨 Design System

### Color Palette
- **Primary**: #00d46a (Electric Emerald)
- **Secondary**: #6ee7b7 (Mint)
- **Accent Gold**: #ffd700
- **Income**: #10b981 (Green)
- **Expense**: #ef4444 (Red)
- **Pending**: #f59e0b (Amber)

### Typography
- **Headers**: DM Serif Display
- **Body**: DM Sans, Outfit

## 🔍 Form Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Description | Minimum 3 characters | "Min 3 characters" |
| Amount | Greater than 0 | "Must be > 0" |
| Date | Cannot be future date | "Cannot be in future" |

All validated fields show red border + red shadow on error.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px — Single column layout, simplified header
- **Tablet**: 640px - 1024px — 2-column grids
- **Desktop**: > 1024px — Full 4-column layouts

## 🔒 Data Security

- All data stored in browser's localStorage
- No server-side transmission
- Try/catch error handling for corrupt data recovery
- Optional demo data reset wipes slate clean

## ✨ Code Quality

- **Zero unused imports** — All imports actively used
- **No dead code** — Every constant and function serves a purpose
- **React best practices** — Proper hook usage, memoization, dependency arrays
- **Accessibility** — WCAG compliant, semantic HTML, ARIA labels
- **Performance** — Optimized re-renders, useMemo/useCallback usage
- **Consistency** — 2-space indentation, single quotes, clean formatting

## 📈 Performance Optimizations

- Context value wrapped in `useMemo()` to prevent unnecessary re-renders
- Expensive computations wrapped in `useMemo()` (filtered transactions, stats)
- Callbacks wrapped in `useCallback()` for prop changes
- Unique stable keys in all `.map()` operations (no array indices)
- Lazy initialization of useState with localStorage fallback

## 🚀 Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BALAJIBHARGAV6/Zorvyn-Assignment.git)

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts. Your app will be live in seconds.

### Environment Variables
No environment variables needed. This is a client-side only application.

### Vercel Configuration
Pre-configured via `vercel.json` for optimal settings.

## 📝 License

This is an assignment submission for Zorvyn. All rights reserved.

## 👨‍💻 Author

Created as a Frontend Developer Intern Assignment demonstrating React expertise, state management, responsive design, and modern development best practices.

---

**Status**: ✅ Production Ready | **Last Updated**: April 2, 2026 | **Commits**: All 4 fixes applied and verified
