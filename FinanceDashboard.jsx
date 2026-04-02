/**
 * FinSight Finance Dashboard
 * 
 * A production-grade, visually exceptional single-file React finance dashboard.
 * Features: dark luxury fintech aesthetic, role-based access, transaction management,
 * interactive charts, insights analytics, and responsive design.
 * 
 * Tech: React 18+, Recharts, Tailwind CSS, Lucide React, Context API
 * Design: Dark luxury fintech with emerald/mint accents, gold highlights
 */

import React, { useState, useContext, createContext, useCallback, useMemo } from 'react';
import {
  AreaChart, Area, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Settings, Eye, Crown, Plus, Trash2, Edit2,
  Search, Download, RotateCcw, AlertCircle, CheckCircle2, Clock, Menu, X,
  DollarSign, Wallet, PieChart as PieChartIcon, Target
} from 'lucide-react';

// ============================================================================
// THEME & CONSTANTS
// ============================================================================

const THEME = {
  // Dark luxury palette
  bg: {
    primary: '#0f0f0f',
    secondary: '#1a1a1a',
    tertiary: '#252525',
    card: 'rgba(26, 26, 26, 0.7)',
  },
  accent: {
    primary: '#00d46a', // Electric emerald
    secondary: '#6ee7b7', // Mint
    gold: '#ffd700',
    goldAlt: '#f59e0b',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    tertiary: '#808080',
  },
  status: {
    income: '#10b981',
    expense: '#ef4444',
    pending: '#f59e0b',
  },
};

const ITEMS_PER_PAGE = 10;
const SAVINGS_GOAL = 1500;

const CATEGORIES = [
  'Food & Dining', 'Entertainment', 'Shopping', 'Transport',
  'Health', 'Utilities', 'Housing', 'Salary', 'Freelance', 'Investment'
];

const CATEGORY_COLORS = {
  'Food & Dining': '#ec4899',
  'Entertainment': '#a855f7',
  'Shopping': '#06b6d4',
  'Transport': '#14b8a6',
  'Health': '#f97316',
  'Utilities': '#6366f1',
  'Housing': '#8b5cf6',
  'Salary': '#10b981',
  'Freelance': '#0ea5e9',
  'Investment': '#eab308',
};

// ============================================================================
// MOCK DATA (30+ transactions across 3 months)
// ============================================================================

const generateMockTransactions = () => {
  const transactions = [];
  let id = 1;

  // January (high expenses)
  const janData = [
    { desc: 'Monthly Salary', amt: 5000, type: 'income', cat: 'Salary' },
    { desc: 'Freelance Project', amt: 1200, type: 'income', cat: 'Freelance' },
    { desc: 'Netflix Subscription', amt: 15.99, type: 'expense', cat: 'Entertainment' },
    { desc: 'Starbucks Coffee', amt: 6.50, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Amazon Purchase', amt: 89.99, type: 'expense', cat: 'Shopping' },
    { desc: 'Uber Ride', amt: 22.45, type: 'expense', cat: 'Transport' },
    { desc: 'Gym Membership', amt: 49.99, type: 'expense', cat: 'Health' },
    { desc: 'Whole Foods Groceries', amt: 156.32, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Electric Bill', amt: 95.00, type: 'expense', cat: 'Utilities' },
    { desc: 'Rent Payment', amt: 1200, type: 'expense', cat: 'Housing' },
    { desc: 'Stock Investment', amt: 500, type: 'income', cat: 'Investment' },
    { desc: 'Spotify Premium', amt: 12.99, type: 'expense', cat: 'Entertainment' },
    { desc: 'Restaurant Dinner', amt: 67.82, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Apple App Store', amt: 9.99, type: 'expense', cat: 'Shopping' },
    { desc: 'Insurance Premium', amt: 120, type: 'expense', cat: 'Health' },
  ];

  janData.forEach(item => {
    transactions.push({
      id: `txn_${id++}`,
      date: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
      description: item.desc,
      amount: item.amt,
      type: item.type,
      category: item.cat,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
    });
  });

  // February (lowest expenses)
  const febData = [
    { desc: 'Monthly Salary', amt: 5000, type: 'income', cat: 'Salary' },
    { desc: 'Netflix Subscription', amt: 15.99, type: 'expense', cat: 'Entertainment' },
    { desc: 'Starbucks Coffee', amt: 5.75, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Gym Membership', amt: 49.99, type: 'expense', cat: 'Health' },
    { desc: 'Groceries', amt: 95.40, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Electric Bill', amt: 78.50, type: 'expense', cat: 'Utilities' },
    { desc: 'Rent Payment', amt: 1200, type: 'expense', cat: 'Housing' },
    { desc: 'Taxi Ride', amt: 18.60, type: 'expense', cat: 'Transport' },
  ];

  febData.forEach(item => {
    transactions.push({
      id: `txn_${id++}`,
      date: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toISOString(),
      description: item.desc,
      amount: item.amt,
      type: item.type,
      category: item.cat,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
    });
  });

  // March (mid-level expenses)
  const marData = [
    { desc: 'Monthly Salary', amt: 5000, type: 'income', cat: 'Salary' },
    { desc: 'Freelance Gig', amt: 800, type: 'income', cat: 'Freelance' },
    { desc: 'Netflix Subscription', amt: 15.99, type: 'expense', cat: 'Entertainment' },
    { desc: 'Restaurant Lunch', amt: 28.90, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Amazon Book', amt: 24.99, type: 'expense', cat: 'Shopping' },
    { desc: 'Uber to Meeting', amt: 31.20, type: 'expense', cat: 'Transport' },
    { desc: 'Doctor Visit', amt: 150, type: 'expense', cat: 'Health' },
    { desc: 'Whole Foods', amt: 127.65, type: 'expense', cat: 'Food & Dining' },
    { desc: 'Electric Bill', amt: 102.25, type: 'expense', cat: 'Utilities' },
    { desc: 'Rent Payment', amt: 1200, type: 'expense', cat: 'Housing' },
    { desc: 'Concert Tickets', amt: 95.00, type: 'expense', cat: 'Entertainment' },
    { desc: 'Dividends Received', amt: 250, type: 'income', cat: 'Investment' },
    { desc: 'Pharmacy Rx', amt: 35.50, type: 'expense', cat: 'Health' },
  ];

  marData.forEach(item => {
    transactions.push({
      id: `txn_${id++}`,
      date: new Date(2024, 2, Math.floor(Math.random() * 31) + 1).toISOString(),
      description: item.desc,
      amount: item.amt,
      type: item.type,
      category: item.cat,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
    });
  });

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// ============================================================================
// CONTEXT
// ============================================================================

const AppContext = createContext();

function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_transactions');
      return saved ? JSON.parse(saved) : generateMockTransactions();
    } catch {
      return generateMockTransactions();
    }
  });
  const [role, setRole] = useState('Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    typeFilter: 'all',
    statusFilter: 'all',
    sortBy: 'date-desc',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('finsight_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((txn) => {
    const newTxn = {
      ...txn,
      id: `txn_${Date.now()}`,
    };
    setTransactions(prev => [newTxn, ...prev]);
    showToast('Transaction added ✓');
  }, [showToast]);

  const editTransaction = useCallback((id, updates) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    showToast('Transaction updated ✓');
  }, [showToast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction deleted ✓');
  }, [showToast]);

  const resetData = useCallback(() => {
    setTransactions(generateMockTransactions());
    localStorage.removeItem('finsight_transactions');
    showToast('Data reset to demo ✓');
  }, [showToast]);

  const value = useMemo(() => ({
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    resetData,
    role,
    setRole,
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    darkMode,
    setDarkMode,
    filters,
    setFilters,
    toastMessage,
    showToast,
    mobileMenuOpen,
    setMobileMenuOpen,
    isLoading,
  }), [transactions, addTransaction, editTransaction, deleteTransaction, resetData, role, activeTab, selectedMonth, darkMode, filters, toastMessage, showToast, mobileMenuOpen, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useFilteredTransactions() {
  const { transactions, filters, selectedMonth } = useAppContext();

  return useMemo(() => {
    let filtered = [...transactions];

    // Filter by month
    if (selectedMonth !== 'all') {
      const monthMap = { jan: 0, feb: 1, mar: 2 };
      const targetMonth = monthMap[selectedMonth];
      filtered = filtered.filter(t => new Date(t.date).getMonth() === targetMonth);
    }

    // Filter by search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(t => t.description.toLowerCase().includes(q));
    }

    // Filter by type
    if (filters.typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === filters.typeFilter);
    }

    // Filter by status
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === filters.statusFilter);
    }

    // Sort
    if (filters.sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sortBy === 'amount-high') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (filters.sortBy === 'amount-low') {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    return filtered;
  }, [transactions, filters, selectedMonth]);
}

function useMonthlyStats() {
  const { transactions } = useAppContext();

  return useMemo(() => {
    const stats = {
      jan: { income: 0, expense: 0 },
      feb: { income: 0, expense: 0 },
      mar: { income: 0, expense: 0 },
    };

    transactions.forEach(t => {
      const month = ['jan', 'feb', 'mar'][new Date(t.date).getMonth()];
      if (month) {
        if (t.type === 'income') {
          stats[month].income += t.amount;
        } else {
          stats[month].expense += t.amount;
        }
      }
    });

    return stats;
  }, [transactions]);
}

function useExport() {
  const { transactions } = useAppContext();

  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }, [transactions]);

  const exportCSV = useCallback(() => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [transactions]);

  return { exportJSON, exportCSV };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date);
}

function formatFullDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

// ============================================================================
// COMPONENTS
// ============================================================================

function AnimatedCounter({ end, duration = 800 }) {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let frame = 0;
    const frames = 60;
    const increment = end / frames;
    const interval = duration / frames;

    const timer = setInterval(() => {
      frame++;
      if (frame < frames) {
        setCount(Math.floor(increment * frame));
      } else {
        setCount(end);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>;
}

function SummaryCard({ label, value, type, icon: Icon, changePercent }) {
  const { darkMode } = useAppContext();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.85)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';

  const getColor = () => {
    if (type === 'income') return THEME.accent.primary;
    if (type === 'expense') return THEME.status.expense;
    if (type === 'savings') return THEME.accent.gold;
    return THEME.accent.secondary;
  };

  const color = getColor();

  return (
    <div
      className="relative p-6 rounded-lg overflow-hidden group"
      style={{
        background: bg.card,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderTop: `3px solid ${color}`,
        boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        background: `radial-gradient(circle at top right, ${color}15, transparent)`,
      }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium" style={{ color: textSecondary }}>
              {label}
            </p>
          </div>
          <Icon size={20} style={{ color }} className="opacity-60" />
        </div>

        <div className="mb-3">
          <div className="text-3xl font-bold" style={{ color: textPrimary, fontVariantNumeric: 'tabular-nums' }}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </div>
        </div>

        {changePercent !== undefined && (
          <div className="flex items-center gap-1 text-xs" style={{
            color: changePercent >= 0 ? THEME.accent.primary : THEME.status.expense,
          }}>
            {changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(changePercent).toFixed(1)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardTab() {
  const { transactions, selectedMonth, setSelectedMonth, darkMode } = useAppContext();
  const monthlyStats = useMonthlyStats();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.85)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const bgTertiary = darkMode ? THEME.bg.tertiary : 'rgba(0,0,0,0.05)';
  const chartBtnBg = darkMode ? THEME.bg.tertiary : '#f0f1f8';

  const getMonthlyData = useCallback(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar'];

    months.forEach((name, idx) => {
      const key = ['jan', 'feb', 'mar'][idx];
      const income = monthlyStats[key].income;
      const expense = monthlyStats[key].expense;
      data.push({
        month: name,
        net: income - expense,
        income,
        expense,
      });
    });

    return data;
  }, [monthlyStats]);

  const getSpendingByCategory = useCallback(() => {
    const selected = selectedMonth === 'all' ? null : ['jan', 'feb', 'mar'].indexOf(selectedMonth);
    const categories = {};

    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (selected === null || new Date(t.date).getMonth() === selected) {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions, selectedMonth]);

  const getMonthlyStats = useCallback(() => {
    const current = selectedMonth === 'all' ? 'all' : selectedMonth;
    let income = 0, expense = 0;

    if (current === 'all') {
      transactions.forEach(t => {
        if (t.type === 'income') {
          income += t.amount;
        } else {
          expense += t.amount;
        }
      });
    } else {
      const idx = ['jan', 'feb', 'mar'].indexOf(current);
      transactions.forEach(t => {
        if (new Date(t.date).getMonth() === idx) {
          if (t.type === 'income') {
            income += t.amount;
          } else {
            expense += t.amount;
          }
        }
      });
    }

    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const totalBalance = transactions.reduce((acc, t) => {
      return acc + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    return { income, expense, savings, savingsRate, totalBalance };
  }, [transactions, selectedMonth]);

  const stats = getMonthlyStats();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section with Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
            Dashboard
          </h2>
          <p style={{ color: textSecondary }} className="text-sm mt-1">
            Financial overview and insights
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'jan', 'feb', 'mar'].map(month => {
            const labels = { all: 'All Months', jan: 'January', feb: 'February', mar: 'March' };
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className="px-4 py-2 rounded-full font-medium text-sm transition-all duration-300"
                style={{
                  background: selectedMonth === month ? THEME.accent.primary : chartBtnBg,
                  color: selectedMonth === month ? THEME.bg.primary : textSecondary,
                }}
              >
                {labels[month]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Balance"
          value={stats.totalBalance}
          type="balance"
          icon={Wallet}
        />
        <SummaryCard
          label="Monthly Income"
          value={stats.income}
          type="income"
          icon={TrendingUp}
        />
        <SummaryCard
          label="Monthly Expenses"
          value={stats.expense}
          type="expense"
          icon={TrendingDown}
        />
        <SummaryCard
          label="Savings Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          type="savings"
          icon={Target}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend Chart */}
        <div
          className="p-6 rounded-lg border"
          style={{
            background: bg.card,
            backdropFilter: 'blur(10px)',
            borderColor: borderColor,
            boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
            Balance Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={getMonthlyData()}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME.accent.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={THEME.accent.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
              <XAxis dataKey="month" stroke={textSecondary} />
              <YAxis stroke={textSecondary} />
              <Tooltip
                contentStyle={{
                  background: darkMode ? THEME.bg.secondary : '#ffffff',
                  border: `1px solid ${THEME.accent.primary}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: textPrimary }}
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke={THEME.accent.primary}
                fillOpacity={1}
                fill="url(#colorNet)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category */}
        <div
          className="p-6 rounded-lg border"
          style={{
            background: bg.card,
            backdropFilter: 'blur(10px)',
            borderColor: borderColor,
            boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={getSpendingByCategory()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {getSpendingByCategory().map((entry, idx) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || THEME.accent.primary} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {getSpendingByCategory().slice(0, 6).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: CATEGORY_COLORS[cat.name] || THEME.accent.primary }}
                />
                <span style={{ color: textSecondary }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionForm({ onClose, initialData = null }) {
  const { addTransaction, editTransaction, darkMode } = useAppContext();
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
  });
  const [errors, setErrors] = useState({});

  const lightBg = {
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const inputBg = darkMode ? THEME.bg.tertiary : '#ffffff';
  const inputBorder = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const validate = useCallback(() => {
    const newErrors = {};
    if (formData.description.length < 3) newErrors.description = 'Min 3 characters';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Must be > 0';
    if (new Date(formData.date) > new Date()) newErrors.date = 'Cannot be in future';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData?.id) {
      editTransaction(initialData.id, {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
      });
    } else {
      addTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
      });
    }
    onClose();
  }, [formData, validate, initialData, addTransaction, editTransaction, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      MozBackdropFilter: 'blur(5px)',
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initialData ? 'Edit Transaction' : 'Add Transaction'}
        className="rounded-lg p-8 w-full max-w-md overflow-y-auto shadow-2xl border mx-4"
        style={{ 
          background: bg.secondary,
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.8)' : '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.2s ease-out',
          maxHeight: '90vh',
        }}
      >
        <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: textPrimary }}>
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                background: inputBg,
                borderColor: errors.description ? THEME.status.expense : inputBorder,
                color: textPrimary,
                focusRingColor: errors.description ? THEME.status.expense : THEME.accent.primary,
                boxShadow: errors.description ? '0 0 0 2px rgba(239,68,68,0.2)' : 'none',
              }}
            />
            {errors.description && <p className="text-xs mt-2 font-medium" style={{ color: THEME.status.expense }}>❌ {errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                background: inputBg,
                borderColor: errors.amount ? THEME.status.expense : inputBorder,
                color: textPrimary,
                boxShadow: errors.amount ? '0 0 0 2px rgba(239,68,68,0.2)' : 'none',
              }}
            />
            {errors.amount && <p className="text-xs mt-2 font-medium" style={{ color: THEME.status.expense }}>❌ {errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-100 cursor-pointer"
                style={{
                  background: inputBg,
                  borderColor: inputBorder,
                  color: textPrimary,
                  boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: 'none',
                }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-100 cursor-pointer"
                style={{
                  background: inputBg,
                  borderColor: inputBorder,
                  color: textPrimary,
                  boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: 'none',
                }}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-100 cursor-pointer"
              style={{
                background: inputBg,
                borderColor: inputBorder,
                color: textPrimary,
                boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: 'none',
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: textSecondary }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-100 cursor-pointer"
              style={{
                background: inputBg,
                borderColor: errors.date ? THEME.status.expense : inputBorder,
                color: textPrimary,
                boxShadow: errors.date ? '0 0 0 2px rgba(239,68,68,0.2)' : darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
              }}
            />
            {errors.date && <p className="text-xs mt-2 font-medium" style={{ color: THEME.status.expense }}>❌ {errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-6 border-t" style={{ borderColor: inputBorder }}>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 hover:shadow-lg"
              style={{ 
                background: THEME.accent.primary, 
                color: THEME.bg.primary,
                boxShadow: '0 4px 12px rgba(0, 212, 106, 0.3)',
              }}
            >
              {initialData ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-semibold border transition-all duration-200 hover:opacity-80"
              style={{ 
                borderColor: inputBorder, 
                color: textSecondary,
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransactionsTab() {
  const { role, filters, setFilters, darkMode, deleteTransaction, activeTab } = useAppContext();
  const filtered = useFilteredTransactions();
  const [currentPage, setCurrentPage] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.85)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const bgTertiary = darkMode ? THEME.bg.tertiary : '#f0f1f8';
  const inputBg = darkMode ? THEME.bg.tertiary : '#ffffff';

  // Reset to page 0 when tab is viewed or data filters change
  React.useEffect(() => {
    setCurrentPage(0);
  }, [activeTab, filtered]);

  // Smooth transition effect when filters change
  React.useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [filtered]);

  const paginatedData = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleDelete = useCallback((id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
  }, [deleteTransaction]);

  const editingTxn = filtered.find(t => t.id === editingId);

  return (
    <div className="space-y-6 animate-fade-in">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes tableRowFade {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
        
        .transaction-row {
          animation: tableRowFade 0.3s ease-out;
        }
        
        .header-section {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>

      <div className="header-section">
        <h2 className="text-2xl font-bold mb-4" style={{ color: textPrimary }}>
          Transactions
        </h2>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search size={18} className="absolute left-3 top-3" style={{ color: textSecondary }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, search: e.target.value }));
              setCurrentPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              background: inputBg,
              borderColor: borderColor,
              color: textPrimary,
            }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2 flex-wrap">
          {['all', 'income', 'expense', 'pending', 'completed'].map(f => {
            const labels = {
              all: 'All',
              income: 'Income',
              expense: 'Expense',
              pending: 'Pending',
              completed: 'Completed',
            };
            const key = ['all', 'income', 'expense'].includes(f) ? 'typeFilter' : 'statusFilter';
            const active = f === 'all' ? filters[key] === 'all' : filters[key] === f;

            return (
              <button
                key={f}
                onClick={() => {
                  setFilters(prev => ({ ...prev, [key]: f }));
                  setCurrentPage(0);
                }}
                className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: active ? THEME.accent.primary : bgTertiary,
                  color: active ? THEME.bg.primary : textSecondary,
                }}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>

        {role === 'Viewer' && (
          <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{
            background: bgTertiary,
            color: textSecondary,
          }}>
            <Eye size={12} /> Read-only mode
          </div>
        )}
      </div>

      {/* Sort & Add Transaction */}
      <div className="flex justify-between items-center gap-4 py-2">
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-4 py-2.5 rounded-lg text-sm border font-semibold transition-all duration-200 hover:border-opacity-100 cursor-pointer"
            style={{
              background: bgTertiary,
              borderColor: borderColor,
              color: textPrimary,
              boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.06)',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: 'none',
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>

        {role === 'Admin' && (
          <button
            onClick={() => { setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap"
            style={{ 
              background: THEME.accent.primary, 
              color: THEME.bg.primary,
              boxShadow: '0 4px 12px rgba(0, 212, 106, 0.3)',
            }}
          >
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      {/* Transaction Table */}
      <div
        className="rounded-lg overflow-hidden border transition-all duration-300"
        style={{
          borderColor: borderColor,
          background: bg.card,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
          opacity: isTransitioning ? 0.6 : 1,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" key={`table-${currentPage}-${filtered.length}`}>
            <thead>
              <tr style={{ background: bgTertiary }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: textSecondary }}>
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: textSecondary }}>
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: textSecondary }}>
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: textSecondary }}>
                  Type
                </th>
                <th className="px-4 py-3 text-right font-semibold" style={{ color: textSecondary }}>
                  Amount
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: textSecondary }}>
                  Status
                </th>
                {role === 'Admin' && (
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: textSecondary }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((t, idx) => (
                <tr
                  key={t.id}
                  className="transaction-row border-t hover:opacity-75 transition-all duration-200"
                  style={{ 
                    borderColor: borderColor,
                    animationDelay: `${idx * 40}ms`,
                  }}
                >
                  <td className="px-4 py-3" style={{ color: textSecondary }}>
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3" style={{ color: textPrimary }}>
                    {t.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{
                      background: CATEGORY_COLORS[t.category] + '20',
                      color: CATEGORY_COLORS[t.category],
                    }}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{
                      background: t.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: t.type === 'income' ? THEME.status.income : THEME.status.expense,
                    }}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold" style={{
                    color: t.type === 'income' ? THEME.status.income : THEME.status.expense,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.status === 'completed' ? (
                      <CheckCircle2 size={16} style={{ color: THEME.status.income, margin: '0 auto' }} />
                    ) : (
                      <Clock size={16} style={{ color: THEME.text.secondary, margin: '0 auto' }} />
                    )}
                  </td>
                  {role === 'Admin' && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => { setEditingId(t.id); setShowForm(true); }}
                          className="p-1 hover:bg-opacity-50 rounded transition-colors"
                        >
                          <Edit2 size={14} style={{ color: THEME.accent.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(t.id)}
                          className="p-1 hover:bg-opacity-50 rounded transition-colors"
                        >
                          <Trash2 size={14} style={{ color: THEME.status.expense }} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12" style={{
          background: bg.card,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
        }}>
          <Search size={40} style={{ color: textSecondary, marginBottom: '12px', opacity: 0.5 }} />
          <p className="text-lg font-semibold" style={{ color: textPrimary }}>
            No transactions found
          </p>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            Try adjusting your filters or search term
          </p>
          <button
            onClick={() => {
              setFilters({ search: '', typeFilter: 'all', statusFilter: 'all', sortBy: 'date-desc' });
              setCurrentPage(0);
            }}
            className="mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: THEME.accent.primary,
              color: THEME.bg.primary,
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between transition-all duration-300" style={{ opacity: isTransitioning ? 0.6 : 1 }}>
        <p style={{ color: textSecondary }} className="text-sm">
          Showing {paginatedData.length > 0 ? currentPage * ITEMS_PER_PAGE + 1 : 0} to {Math.min((currentPage + 1) * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-2 rounded border disabled:opacity-50 transition-all duration-200 hover:border-opacity-100"
            style={{ borderColor: borderColor, color: textPrimary }}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-2 rounded border disabled:opacity-50 transition-all duration-200 hover:border-opacity-100"
            style={{ borderColor: borderColor, color: textPrimary }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          MozBackdropFilter: 'blur(5px)',
        }}>
          <div className="rounded-lg p-6 max-w-sm mx-4" style={{ 
            background: bg.secondary,
            animation: 'fadeIn 0.2s ease-out',
            boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.8)' : '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          }}>
            <div className="flex gap-3 mb-4">
              <AlertCircle size={20} style={{ color: THEME.status.expense }} />
              <div>
                <h3 className="font-bold" style={{ color: textPrimary }}>Delete Transaction?</h3>
                <p style={{ color: textSecondary }} className="text-sm mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 rounded font-medium"
                style={{ background: THEME.status.expense, color: 'white' }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded font-medium border"
                style={{ borderColor: borderColor, color: textSecondary }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <TransactionForm
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          initialData={editingId ? filtered.find(t => t.id === editingId) : null}
        />
      )}
    </div>
  );
}

function InsightsTab() {
  const { transactions, selectedMonth, darkMode } = useAppContext();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.85)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const bgTertiary = darkMode ? THEME.bg.tertiary : '#f0f1f8';

  const getMonthlyData = useCallback(() => {
    const data = [];
    ['Jan', 'Feb', 'Mar'].forEach((name, idx) => {
      let income = 0, expense = 0;
      transactions.forEach(t => {
        if (new Date(t.date).getMonth() === idx) {
          if (t.type === 'income') income += t.amount;
          else expense += t.amount;
        }
      });
      data.push({ month: name, Income: income, Expenses: expense });
    });
    return data;
  }, [transactions]);

  const getBiggestSpender = useCallback(() => {
    const categories = {};
    let total = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const selected = selectedMonth === 'all' ? true : new Date(t.date).getMonth() === ['jan', 'feb', 'mar'].indexOf(selectedMonth);
        if (selected) {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
          total += t.amount;
        }
      }
    });

    const biggest = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    return biggest ? { name: biggest[0], amount: biggest[1], percent: (biggest[1] / total * 100).toFixed(1) } : null;
  }, [transactions, selectedMonth]);

  const getTop3Expenses = useCallback(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [transactions]);

  const getSpendingStreak = useCallback(() => {
    const selected = selectedMonth === 'all' ? null : ['jan', 'feb', 'mar'].indexOf(selectedMonth);
    const daysWithExpense = new Set();

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const month = new Date(t.date).getMonth();
        if (selected === null || month === selected) {
          daysWithExpense.add(new Date(t.date).toDateString());
        }
      }
    });

    let streak = 0;
    let currentStreak = 0;
    const sortedDays = Array.from(daysWithExpense).sort((a, b) => new Date(a) - new Date(b));

    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedDays[i - 1]);
        const currDate = new Date(sortedDays[i]);
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          currentStreak++;
        } else {
          streak = Math.max(streak, currentStreak);
          currentStreak = 1;
        }
      }
    }

    streak = Math.max(streak, currentStreak);
    return streak;
  }, [transactions, selectedMonth]);

  const getSavingsProgress = useCallback(() => {
    const selected = selectedMonth === 'all' ? null : ['jan', 'feb', 'mar'].indexOf(selectedMonth);
    let income = 0, expense = 0;

    transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      if (selected === null || month === selected) {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      }
    });

    const savings = income - expense;
    return { savings, goal: SAVINGS_GOAL, percent: Math.min((savings / SAVINGS_GOAL) * 100, 100) };
  }, [transactions, selectedMonth]);

  const biggestSpender = getBiggestSpender();
  const top3 = getTop3Expenses();
  const streak = getSpendingStreak();
  const savingsData = getSavingsProgress();

  const InsightCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: bg.card,
        borderColor: borderColor,
        borderLeft: `4px solid ${color}`,
        boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p style={{ color: textSecondary }} className="text-sm font-medium">
            {title}
          </p>
        </div>
        <Icon size={20} style={{ color }} className="opacity-60" />
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold" style={{ color: textPrimary }}>
          {value}
        </div>
      </div>
      {subtitle && (
        <p style={{ color: textSecondary }} className="text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
          Insights & Analytics
        </h2>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {biggestSpender && (
          <InsightCard
            icon={PieChartIcon}
            title="Biggest Spender"
            value={biggestSpender.name}
            subtitle={`${biggestSpender.percent}% of spending`}
            color={CATEGORY_COLORS[biggestSpender.name]}
          />
        )}
        <InsightCard
          icon={Target}
          title="Spending Streak"
          value={`${streak} days`}
          subtitle="Consecutive days with expenses"
          color={THEME.accent.primary}
        />
      </div>

      {/* Monthly Comparison Chart */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: borderColor,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
          Monthly Comparison
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={getMonthlyData()}>
            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
            <XAxis dataKey="month" stroke={textSecondary} />
            <YAxis stroke={textSecondary} />
            <Tooltip
              contentStyle={{
                background: darkMode ? THEME.bg.secondary : '#ffffff',
                border: `1px solid ${THEME.accent.primary}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: textPrimary }}
            />
            <Legend />
            <Bar dataKey="Income" fill={THEME.status.income} />
            <Bar dataKey="Expenses" fill={THEME.status.expense} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 Expenses */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: borderColor,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
          Top 3 Expenses
        </h3>
        <div className="space-y-3">
          {top3.map((txn, idx) => (
            <div key={txn.id} className="flex items-center justify-between p-3 rounded" style={{
              background: bgTertiary,
            }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{
                  background: CATEGORY_COLORS[txn.category] + '30',
                  color: CATEGORY_COLORS[txn.category],
                }}>
                  {idx + 1}
                </div>
                <div>
                  <p style={{ color: textPrimary }} className="font-medium text-sm">
                    {txn.description}
                  </p>
                  <p style={{ color: textSecondary }} className="text-xs">
                    {formatFullDate(txn.date)}
                  </p>
                </div>
              </div>
              <p style={{ color: THEME.status.expense, fontVariantNumeric: 'tabular-nums' }} className="font-bold">
                {formatCurrency(txn.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goal */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: savingsData.savings < 0 ? THEME.status.expense : THEME.accent.primary,
          borderLeft: `4px solid ${savingsData.savings < 0 ? THEME.status.expense : THEME.accent.primary}`,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
              Savings Goal
            </h3>
            <p style={{ color: textSecondary }} className="text-sm mt-1">
              {savingsData.savings < 0 ? '⚠️ Below target' : '✓ On track'}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="mb-2">
              <p style={{ color: textSecondary }} className="text-sm mb-2">
                Progress this month
              </p>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: bgTertiary }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${savingsData.percent}%`,
                    background: savingsData.savings < 0 ? THEME.status.expense : THEME.accent.primary,
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(savingsData.savings)}
              </span>
              <span style={{ color: textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                Goal: {formatCurrency(SAVINGS_GOAL)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { role, setRole, darkMode, setDarkMode, resetData } = useAppContext();
  const { exportJSON, exportCSV } = useExport();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.85)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textPrimary = darkMode ? THEME.text.primary : '#1a1a1a';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const bgTertiary = darkMode ? THEME.bg.tertiary : '#f0f1f8';

  const PermissionBadge = ({ text, icon: Icon }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{
      background: bgTertiary,
    }}>
      <Icon size={14} style={{ color: THEME.accent.primary }} />
      <span style={{ color: textSecondary }}>{text}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
          Settings
        </h2>
      </div>

      {/* Role Settings */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: borderColor,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
          Account & Permissions
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-3" style={{ color: textSecondary }}>
              Current Role
            </label>
            <div className="flex gap-3">
              {['Admin', 'Viewer'].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: role === r ? THEME.accent.primary : bgTertiary,
                    color: role === r ? THEME.bg.primary : textPrimary,
                  }}
                >
                  {r === 'Admin' ? <Crown size={16} /> : <Eye size={16} />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-3" style={{ color: textSecondary }}>
              Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <PermissionBadge text="View Transactions" icon={CheckCircle2} />
              <PermissionBadge text="View Reports" icon={CheckCircle2} />
              {role === 'Admin' && (
                <>
                  <PermissionBadge text="Add/Edit/Delete" icon={CheckCircle2} />
                  <PermissionBadge text="Export Data" icon={CheckCircle2} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: borderColor,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
          Appearance
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: textPrimary }} className="font-medium">
              Dark Mode
            </p>
            <p style={{ color: textSecondary }} className="text-sm mt-1">
              Use dark theme for the dashboard
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 rounded-full transition-colors relative"
            style={{ background: darkMode ? THEME.accent.primary : '#ddd' }}
          >
            <div
              className="w-5 h-5 rounded-full absolute top-0.5 transition-transform"
              style={{
                background: 'white',
                transform: darkMode ? 'translateX(24px)' : 'translateX(2px)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: bg.card,
          borderColor: borderColor,
          boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: textPrimary }}>
          Data & Export
        </h3>

        <div className="space-y-3">
          <button
            onClick={exportJSON}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: bgTertiary,
              color: textPrimary,
            }}
          >
            <Download size={16} style={{ color: THEME.accent.primary }} />
            Export as JSON
          </button>

          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: bgTertiary,
              color: textPrimary,
            }}
          >
            <Download size={16} style={{ color: THEME.accent.primary }} />
            Export as CSV
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all data to demo defaults?')) {
                resetData();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: THEME.status.expense,
            }}
          >
            <RotateCcw size={16} />
            Reset to Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { role, setRole, activeTab, setActiveTab, darkMode, mobileMenuOpen, setMobileMenuOpen } = useAppContext();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textSecondary = darkMode ? THEME.text.secondary : '#7a7a8a';
  const bgTertiary = darkMode ? THEME.bg.tertiary : 'rgba(0,0,0,0.05)';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header
      style={{
        background: bg.secondary,
        borderBottom: `1px solid ${borderColor}`,
      }}
      className="sticky top-0 z-40"
    >
      <div className="px-4 md:px-6 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ background: THEME.accent.primary, color: THEME.bg.primary }}
            >
              F
            </div>
            <h1 className="text-xl font-bold hidden sm:block" style={{ color: darkMode ? THEME.text.primary : '#1a1a1a' }}>
              FinSight
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <div
              className="flex gap-1 p-1 rounded-full"
              style={{ background: bgTertiary }}
            >
              {['Admin', 'Viewer'].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="px-3 py-1 rounded-full font-medium text-sm transition-all flex items-center gap-1"
                  style={{
                    background: role === r ? THEME.accent.gold : 'transparent',
                    color: role === r ? THEME.bg.primary : textSecondary,
                  }}
                >
                  {r === 'Admin' ? <Crown size={14} /> : <Eye size={14} />}
                  <span className="hidden sm:inline">{r}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: textSecondary }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-0 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'} flex-col md:flex-row`}>
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 md:py-2.5 font-semibold text-sm transition-all duration-300"
                style={{
                  color: isActive ? THEME.accent.primary : textSecondary,
                  borderBottom: isActive ? `3px solid ${THEME.accent.primary}` : 'none',
                  paddingBottom: isActive ? 'calc(0.625rem - 3px)' : '0.625rem',
                }}
              >
                <TabIcon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-4 right-4 px-4 py-3 rounded-lg flex items-center gap-2 animate-slide-up"
      style={{
        background: THEME.accent.primary,
        color: THEME.bg.primary,
        zIndex: 9999,
      }}
    >
      <CheckCircle2 size={16} />
      <span className="font-medium">{message}</span>
    </div>
  );
}

function LoadingScreen({ darkMode }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 opacity-100 transition-opacity duration-500"
      style={{
        background: darkMode
          ? `linear-gradient(135deg, ${THEME.bg.primary} 0%, ${THEME.bg.secondary} 100%)`
          : `linear-gradient(135deg, #f8f9fa 0%, #f0f1f3 100%)`,
      }}
    >
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
        
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .loading-logo {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        
        .loading-bar {
          animation: float 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-3xl loading-logo"
            style={{ background: THEME.accent.primary, color: THEME.bg.primary }}
          >
            F
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: darkMode ? THEME.text.primary : '#1a1a1a' }}>
            FinSight
          </h1>
          <p style={{ color: darkMode ? THEME.text.secondary : '#666' }} className="text-sm">
            Premium Finance Dashboard
          </p>
        </div>

        <div className="w-32 h-1 rounded-full overflow-hidden" style={{
          background: darkMode ? THEME.bg.tertiary : 'rgba(0,0,0,0.1)',
        }}>
          <div
            className="h-full loading-bar"
            style={{
              background: `linear-gradient(90deg, ${THEME.accent.primary}, ${THEME.accent.secondary})`,
              width: '100%',
              animation: 'slideIn 2.5s ease-in-out forwards',
            }}
          />
        </div>

        <p style={{ color: darkMode ? THEME.text.tertiary : '#999' }} className="text-xs mt-2">
          Initializing your dashboard...
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from { width: 0%; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function FinSightDashboard() {
  const { activeTab, darkMode, toastMessage, isLoading } = useAppContext();

  const lightBg = {
    primary: '#ffffff',
    secondary: '#f8f9fb',
    tertiary: '#eef1f8',
    card: 'rgba(255, 255, 255, 0.8)',
  };

  const bg = darkMode ? THEME.bg : lightBg;
  const textColor = darkMode ? THEME.text.primary : '#1a1a1a';

  return (
    <div style={{ background: bg.primary }} className="min-h-screen transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Outfit:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', 'Outfit', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'DM Serif Display', serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {isLoading && <LoadingScreen darkMode={darkMode} />}

      {!isLoading && (
        <>
          <Header />

          <main className="px-4 md:px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'transactions' && <TransactionsTab />}
              {activeTab === 'insights' && <InsightsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </main>

          <Toast message={toastMessage} />
        </>
      )}
    </div>
  );
}

// ============================================================================
// APP ENTRY POINT
// ============================================================================

export default function App() {
  return (
    <AppProvider>
      <FinSightDashboard />
    </AppProvider>
  );
}
