'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  GraduationCap,
  Calendar,
  Filter,
  RefreshCw,
  PieChart as PieChartIcon,
  Layers,
  Award,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Line,
} from 'recharts';
import {
  GlobalAnalyticsData,
  SingleFormAnalytics,
} from '@/types/tracer-study';
import { tracerStudyService } from '@/services/tracer-study.service';

interface TracerAnalyticsViewProps {
  initialFormId?: number | null;
  onBack: () => void;
  defaultMode?: 'global' | 'single';
}

const PALETTE = [
  '#0D3B82', // STMIK Navy
  '#2563EB', // Royal Blue
  '#0D9488', // Teal
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#E11D48', // Rose
  '#059669', // Emerald
  '#4F46E5', // Indigo
];

export default function TracerAnalyticsView({
  initialFormId = null,
  onBack,
  defaultMode = 'global',
}: TracerAnalyticsViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'single'>(
    initialFormId ? 'single' : defaultMode
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Global State
  const [globalData, setGlobalData] = useState<GlobalAnalyticsData | null>(null);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedProdi, setSelectedProdi] = useState<string>('');
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  // Single Form State
  const [singleData, setSingleData] = useState<SingleFormAnalytics | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(initialFormId);
  const [allFormsList, setAllFormsList] = useState<{ id: number; title: string; year?: string | null }[]>([]);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);
  const [questionChartTypes, setQuestionChartTypes] = useState<Record<number, 'pie' | 'bar'>>({});

  // Load all forms for dropdown selector
  useEffect(() => {
    const fetchFormsList = async () => {
      try {
        const res = await tracerStudyService.getAdminForms();
        if (res.status === 'success') {
          const mapped = res.data.map((f) => ({
            id: f.id,
            title: f.title,
            year: f.target_graduation_year,
          }));
          setAllFormsList(mapped);
          if (!selectedFormId && mapped.length > 0) {
            setSelectedFormId(mapped[0].id);
          }
        }
      } catch {
        // silent error
      }
    };
    fetchFormsList();
  }, [selectedFormId]);

  // Fetch Global Analytics
  const fetchGlobalAnalytics = async () => {
    try {
      setIsLoadingGlobal(true);
      const res = await tracerStudyService.getGlobalAnalytics({
        years: selectedYears.length > 0 ? selectedYears : undefined,
        prodi: selectedProdi || undefined,
      });
      if (res.status === 'success') {
        setGlobalData(res.data);
      }
    } catch {
      toast.error('Gagal mengambil data analitik seluruh angkatan.');
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'global') {
      fetchGlobalAnalytics();
    }
  }, [activeTab, selectedYears, selectedProdi]);

  // Fetch Single Form Analytics
  const fetchSingleAnalytics = async (formId: number) => {
    try {
      setIsLoadingSingle(true);
      const res = await tracerStudyService.getSingleFormAnalytics(formId);
      if (res.status === 'success') {
        setSingleData(res.data);
      }
    } catch {
      toast.error('Gagal mengambil analitik formulir.');
    } finally {
      setIsLoadingSingle(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'single' && selectedFormId) {
      fetchSingleAnalytics(selectedFormId);
    }
  }, [activeTab, selectedFormId]);

  // Filter handlers
  const handleToggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleSelectAllYears = () => {
    setSelectedYears([]);
  };

  // Quick summary calculations for Global
  const globalSummaryMetrics = useMemo(() => {
    if (!globalData || !globalData.summary_per_year.length) return null;
    const totalRespondents = globalData.total_respondents_all;
    const totalEmployed = globalData.summary_per_year.reduce(
      (acc, curr) => acc + curr.employed_count,
      0
    );
    const avgEmployedRate =
      totalRespondents > 0 ? Math.round((totalEmployed / totalRespondents) * 100) : 0;

    const sortedByRespondents = [...globalData.summary_per_year].sort(
      (a, b) => b.total_respondents - a.total_respondents
    );
    const topYear = sortedByRespondents[0]?.year || '-';

    return {
      totalRespondents,
      avgEmployedRate,
      topYear,
      yearCount: globalData.available_years.length,
    };
  }, [globalData]);

  // Transform Employment Comparison into Overall Pie Data
  const overallEmploymentPieData = useMemo(() => {
    if (!globalData || !globalData.employment_comparison) return [];
    const activeYears = selectedYears.length > 0 ? selectedYears : globalData.available_years;

    return globalData.employment_comparison.map((row) => {
      const sum = activeYears.reduce((acc, yr) => acc + (Number(row[yr]) || 0), 0);
      return {
        name: row.status,
        value: sum,
      };
    }).filter((item) => item.value > 0);
  }, [globalData, selectedYears]);

  // Trend Data for Area/Line Chart across graduation years
  const employmentTrendData = useMemo(() => {
    if (!globalData || !globalData.summary_per_year) return [];
    return [...globalData.summary_per_year]
      .sort((a, b) => a.year.localeCompare(b.year))
      .map((item) => ({
        year: `Angkatan ${item.year}`,
        employedPercentage: item.employed_percentage,
        totalRespondents: item.total_respondents,
        employedCount: item.employed_count,
      }));
  }, [globalData]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================= HEADER BAR ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Kembali ke Daftar Formulir"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0D3B82] font-bold text-[11px] border border-blue-200">
                Pusat Analitik & Visualisasi Data
              </span>
              <span className="text-xs text-slate-400">Tracer Study Alumni</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              {activeTab === 'global'
                ? 'Visualisasi Analitik Lintas Seluruh Angkatan'
                : 'Visualisasi Analitik Spesifik Formulir'}
            </h1>
          </div>
        </div>

        {/* Tab Switcher & Refresh */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('global')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'global'
                  ? 'bg-white text-[#0D3B82] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Seluruh Angkatan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-white text-[#0D3B82] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Per Formulir</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'global') fetchGlobalAnalytics();
              else if (selectedFormId) fetchSingleAnalytics(selectedFormId);
            }}
            disabled={isLoadingGlobal || isLoadingSingle}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer disabled:opacity-60"
            title="Segarkan data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingGlobal || isLoadingSingle ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* ================= TAB 1: GLOBAL ANALYTICS ================= */}
      {activeTab === 'global' && (
        <div className="flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-[#0D3B82]" />
              <span>Filter Angkatan Lulus:</span>
              <div className="flex flex-wrap items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={handleSelectAllYears}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedYears.length === 0
                      ? 'bg-[#0D3B82] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Angkatan
                </button>
                {globalData?.available_years.map((year, yIdx) => {
                  const isChecked = selectedYears.includes(year);
                  return (
                    <button
                      key={`filter-year-${year}-${yIdx}`}
                      type="button"
                      onClick={() => handleToggleYear(year)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                        isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-extrabold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prodi Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Prodi:</span>
              <select
                value={selectedProdi}
                onChange={(e) => setSelectedProdi(e.target.value)}
                className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">Semua Program Studi</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Manajemen Informatika">Manajemen Informatika</option>
              </select>
            </div>
          </div>

          {/* KPI Summary Cards */}
          {globalSummaryMetrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Total Responden</span>
                  <Users className="w-4 h-4 text-[#0D3B82]" />
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {globalSummaryMetrics.totalRespondents}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Dari {globalSummaryMetrics.yearCount} kelompok angkatan
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Rata-rata Kebekerjaan</span>
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {globalSummaryMetrics.avgEmployedRate}%
                </div>
                <span className="text-[11px] text-emerald-700/80 font-semibold mt-0.5 block">
                  Bekerja atau berwirausaha
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Angkatan Terbanyak</span>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-[#0D3B82]">
                  {globalSummaryMetrics.topYear}
                </div>
                <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">
                  Partisipasi tertinggi survei
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Visualisasi Metrik</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-slate-800">Recharts Aktif</div>
                <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
                  Pie, Bar, & Trend Line Chart
                </span>
              </div>
            </div>
          )}

          {isLoadingGlobal ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl py-20 text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#0D3B82] animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">
                Mengagregasi data analitik seluruh angkatan...
              </p>
            </div>
          ) : !globalData || globalData.total_respondents_all === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl py-16 text-center flex flex-col items-center justify-center gap-3">
              <BarChart3 className="w-12 h-12 text-slate-300" />
              <h3 className="text-base font-bold text-slate-700">Belum Ada Data Respon Masuk</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Tanggapan alumni dari formulir kuesioner yang ber-tag metrik (pendapatan/gaji) akan
                otomatis dirangkum ke dalam visualisasi chart ini.
              </p>
            </div>
          ) : (
            <>
              {/* ================= VISUALISASI 1: CLUSTERED BAR CHART PENDAPATAN ================= */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-800">
                      Grafik Batang Komparasi Gaji / Pendapatan Alumni per Angkatan
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Visualisasi perbandingan jumlah alumni pada tiap rentang penghasilan bulanan
                  </p>
                </div>

                <div className="w-full h-80 min-h-[320px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={globalData.salary_comparison}
                        margin={{ top: 10, right: 25, left: 0, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                          dataKey="bracket"
                          tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#64748B', fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
                        {(selectedYears.length > 0 ? selectedYears : globalData.available_years).map(
                          (yr, idx) => (
                            <Bar
                              key={`bar-${yr}-${idx}`}
                              dataKey={yr}
                              name={`Angkatan ${yr}`}
                              fill={PALETTE[idx % PALETTE.length]}
                              radius={[6, 6, 0, 0]}
                              maxBarSize={45}
                            />
                          )
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ================= DUAL CHARTS GRID: LINE TREND & PIE CHART ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visualisasi 2: Line / Area Chart Tingkat Kebekerjaan */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-800">
                        Tren Persentase Tingkat Kebekerjaan (%)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perkembangan rasio lulusan bekerja / berwirausaha dari tiap angkatan
                    </p>
                  </div>

                  <div className="w-full h-72 min-h-[280px]">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={employmentTrendData}
                          margin={{ top: 10, right: 25, left: -10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="employedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0D3B82" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#0D3B82" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis
                            dataKey="year"
                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            unit="%"
                            tick={{ fill: '#64748B', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <RechartsTooltip
                            formatter={(value: unknown) => [`${value}%`, 'Tingkat Bekerja']}
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #E2E8F0',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="employedPercentage"
                            name="Tingkat Bekerja"
                            stroke="#0D3B82"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#employedGradient)"
                            dot={{ r: 5, fill: '#0D3B82', stroke: '#FFFFFF', strokeWidth: 2 }}
                            activeDot={{ r: 7 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Visualisasi 3: Donut / Pie Chart Distribusi Status Pekerjaan */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-800">
                        Diagram Lingkaran (Pie) Status Kebekerjaan Lulusan
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Proporsi seluruh alumni: Full Time, Part Time, Wirausaha, Studi, atau Mencari Kerja
                    </p>
                  </div>

                  <div className="w-full h-72 min-h-[280px]">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overallEmploymentPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            label={(entry) => `${entry.name ? String(entry.name).split(" ")[0] : ""} ${Math.round((entry.percent || 0) * 100)}%`}
                            labelLine={false}
                          >
                            {overallEmploymentPieData.map((entry, index) => (
                              <Cell
                                key={`pie-cell-${entry.name}-${index}`}
                                fill={PALETTE[index % PALETTE.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: unknown) => [`${value} Alumni`, 'Jumlah']}
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #E2E8F0',
                              fontSize: '12px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= SUMMARY TABLE PER ANGKATAN ================= */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Tabel Ringkasan Performa Lulusan Tiap Angkatan
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                    {globalData.summary_per_year.length} Angkatan Terdata
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Tahun Angkatan</th>
                        <th className="px-5 py-3.5 text-center">Total Responden</th>
                        <th className="px-5 py-3.5 text-center">Tingkat Bekerja (%)</th>
                        <th className="px-5 py-3.5 text-center">Bekerja / Wirausaha</th>
                        <th className="px-5 py-3.5 text-center">Mencari Kerja</th>
                        <th className="px-5 py-3.5">Rentang Pendapatan Dominan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {globalData.summary_per_year.map((row, rIdx) => (
                        <tr key={`summary-row-${row.year}-${rIdx}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-[#0D3B82] flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span>Angkatan {row.year}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-bold text-slate-800 font-mono">
                            {row.total_respondents}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/80">
                              {row.employed_percentage}%
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-slate-700">
                            {row.employed_count} orang
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-slate-500">
                            {row.unemployed_count} orang
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700">
                            {row.top_salary_bracket !== '-' ? (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                {row.top_salary_bracket}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Belum terdata</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= TAB 2: SINGLE FORM ANALYTICS ================= */}
      {activeTab === 'single' && (
        <div className="flex flex-col gap-6">
          {/* Form Selector Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0D3B82]" />
              <span className="text-xs font-bold text-slate-700">Pilih Formulir / Angkatan:</span>
            </div>
            <select
              value={selectedFormId || ''}
              onChange={(e) => setSelectedFormId(Number(e.target.value))}
              className="w-full sm:w-96 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
            >
              {allFormsList.map((f, fIdx) => (
                <option key={`opt-form-${f.id}-${fIdx}`} value={f.id}>
                  {f.title} {f.year ? `(Angkatan ${f.year})` : ''}
                </option>
              ))}
            </select>
          </div>

          {isLoadingSingle ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl py-20 text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#0D3B82] animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">
                Memuat analitik formulir terpilih...
              </p>
            </div>
          ) : !singleData ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl py-16 text-center">
              <p className="text-xs text-slate-500">Pilih formulir untuk melihat analitiknya.</p>
            </div>
          ) : (
            <>
              {/* Form Info Banner */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0D3B82] font-bold text-xs border border-blue-200">
                        {singleData.form.target_graduation_year
                          ? `Angkatan ${singleData.form.target_graduation_year}`
                          : 'Semua Angkatan'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                        {singleData.form.visibility.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{singleData.form.title}</h2>
                    {singleData.form.start_date && singleData.form.end_date && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tempo Pengisian:</span>
                        <span className="font-semibold text-slate-700">
                          {singleData.form.start_date} s/d {singleData.form.end_date}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl px-5 py-3 text-center">
                      <span className="text-[11px] font-semibold text-blue-700 block">
                        Total Responden
                      </span>
                      <span className="text-2xl font-black text-[#0D3B82] font-mono">
                        {singleData.form.total_responses}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualisasi Demografi: Pie Chart Program Studi */}
              {singleData.prodi_breakdown.length > 0 && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-800">
                        Visualisasi Diagram Pie: Distribusi Program Studi Responden
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sebaran latar belakang program studi dari lulusan yang telah merespon kuesioner ini
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="w-full h-64 min-h-[240px]">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={singleData.prodi_breakdown}
                              dataKey="count"
                              nameKey="label"
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={80}
                              paddingAngle={3}
                            >
                              {singleData.prodi_breakdown.map((entry, index) => (
                                <Cell
                                  key={`prodi-cell-${entry.label}-${index}`}
                                  fill={PALETTE[index % PALETTE.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value: unknown) => [`${value} Alumni`, 'Jumlah']}
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                fontSize: '12px',
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="space-y-3">
                      {singleData.prodi_breakdown.map((p, pIdx) => (
                        <div
                          key={`prodi-${p.label}-${pIdx}`}
                          className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: PALETTE[pIdx % PALETTE.length] }}
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{p.label}</span>
                              <span className="text-[11px] text-slate-400">{p.count} Alumni Merespon</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#0D3B82] bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs font-mono">
                            {p.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Analysis Breakdown Cards with Interactive Visualizations */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#0D3B82]" />
                    <span>Visualisasi Grafik Pertanyaan Kuesioner</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {singleData.questions_analysis.length} Pertanyaan Teranalisis
                  </span>
                </div>

                {singleData.questions_analysis.map((q, qIdx) => {
                  const currentChartType = questionChartTypes[q.question_id] || 'pie';
                  const chartData = q.breakdown.map((item) => ({
                    name: item.label,
                    count: item.count,
                    percentage: item.percentage || 0,
                  }));

                  return (
                    <div
                      key={`q-analysis-${q.question_id || qIdx}`}
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      {/* Header Soal & Switcher Pie vs Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600">No. {qIdx + 1}</span>
                            {q.metric_tag && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Metrik: {q.metric_tag}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-0.5">{q.question_text}</h4>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {/* Toggle Pie / Bar Button */}
                          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                setQuestionChartTypes((prev) => ({ ...prev, [q.question_id]: 'pie' }))
                              }
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                currentChartType === 'pie'
                                  ? 'bg-white text-[#0D3B82] shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <PieChartIcon className="w-3 h-3" />
                              <span>Pie</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setQuestionChartTypes((prev) => ({ ...prev, [q.question_id]: 'bar' }))
                              }
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                currentChartType === 'bar'
                                  ? 'bg-white text-[#0D3B82] shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <BarChart3 className="w-3 h-3" />
                              <span>Bar</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content: Chart + Legend/Table Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-1">
                        {/* Visual Chart (Pie or Bar) */}
                        <div className="w-full h-64 min-h-[250px] bg-slate-50/40 rounded-xl p-2 border border-slate-100">
                          {isMounted && (
                            <ResponsiveContainer width="100%" height="100%">
                              {currentChartType === 'pie' ? (
                                <PieChart>
                                  <Pie
                                    data={chartData}
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={80}
                                    paddingAngle={3}
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${entry.name}-${index}`}
                                        fill={PALETTE[index % PALETTE.length]}
                                      />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip
                                    formatter={(value: unknown, name: unknown) => [
                                      `${value} suara`,
                                      String(name),
                                    ]}
                                    contentStyle={{
                                      backgroundColor: '#FFFFFF',
                                      borderRadius: '12px',
                                      border: '1px solid #E2E8F0',
                                      fontSize: '12px',
                                    }}
                                  />
                                </PieChart>
                              ) : (
                                <BarChart
                                  data={chartData}
                                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748B', fontSize: 10 }}
                                    tickLine={false}
                                    interval={0}
                                    tickFormatter={(val) => (val.length > 12 ? `${val.slice(0, 10)}...` : val)}
                                  />
                                  <YAxis
                                    tick={{ fill: '#64748B', fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                  />
                                  <RechartsTooltip
                                    formatter={(value: unknown) => [`${value} suara`, 'Responden']}
                                    contentStyle={{
                                      backgroundColor: '#FFFFFF',
                                      borderRadius: '12px',
                                      border: '1px solid #E2E8F0',
                                      fontSize: '12px',
                                    }}
                                  />
                                  <Bar dataKey="count" name="Responden" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                      <Cell
                                        key={`bar-cell-${entry.name}-${index}`}
                                        fill={PALETTE[index % PALETTE.length]}
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              )}
                            </ResponsiveContainer>
                          )}
                        </div>

                        {/* Breakdown Data Rows with Color Indicators */}
                        <div className="space-y-2.5">
                          {q.breakdown.map((opt, oIdx) => (
                            <div
                              key={`q-${q.question_id || qIdx}-opt-${oIdx}-${opt.label}`}
                              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
                            >
                              <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: PALETTE[oIdx % PALETTE.length] }}
                                  />
                                  <span className="font-semibold text-slate-700">{opt.label}</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono">
                                  <span className="text-slate-500 text-[11px]">{opt.count} suara</span>
                                  <span className="font-bold text-slate-800 w-12 text-right">
                                    {opt.percentage || 0}%
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${opt.percentage || 0}%`,
                                    backgroundColor: PALETTE[oIdx % PALETTE.length],
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
