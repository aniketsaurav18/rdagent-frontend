"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { PlatformOverview } from "@/components/social-media/platform-overview"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Globe, TrendingUp, TrendingDown, DollarSign, BarChart2, Search, ArrowUp, ArrowDown, Plus, X, Calendar, Eye, Hash, Info } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type PositionDistribution = {
  pos_1: number
  pos_2_3: number
  pos_4_10: number
  pos_11_20: number
  pos_21_30: number
  pos_31_40: number
  pos_41_50: number
  pos_51_60: number
  pos_61_70: number
  pos_71_80: number
  pos_81_90: number
  pos_91_100: number
}

type SerpFeatures = {
  featured_snippets: number
  people_also_ask: number
  local_pack: number
}

type RankingMovementDetail = {
  is_new: number
  is_up: number
  is_down: number
  is_lost: number
}

type RankingMovements = {
  organic: RankingMovementDetail
  paid: RankingMovementDetail
}

type SeoDomainOverview = {
  organic_keywords: number
  paid_keywords: number
  organic_etv: number
  paid_etv: number
  organic_estimated_paid_traffic_cost: number
  paid_estimated_traffic_cost: number
  domain_rank: number
  position_distribution: PositionDistribution
  serp_features: SerpFeatures
  ranking_movements: RankingMovements
  location_code: number
  language_code: string
  fetched_at: string | null
}

type MonthlySearch = {
  year: number
  month: number
  search_volume: number
}

type KeywordData = {
  keyword: string
  search_volume: number
  cpc: number | null
  competition: number
  competition_level: string
  difficulty: number | null
  traffic_value: number
  intent: string
  monthly_searches: MonthlySearch[]
}

type SeoKeywords = {
  total_count: number
  keywords: KeywordData[]
}

type HistoricalDataPoint = {
  date: string
  organic_keywords: number
  organic_traffic: number
  paid_keywords: number
  paid_traffic: number
}

type SeoHistorical = {
  history: HistoricalDataPoint[]
  total_months: number
  fetched_at: string | null
}

export type SeoTrafficData = {
  seo_domain_overview: SeoDomainOverview
  seo_keywords?: SeoKeywords
  seo_historical?: SeoHistorical
  seo_ranked_keywords?: SeoRankedKeywords
}

type RankedKeyword = {
  keyword: string
  search_volume: number
  cpc: number | null
  competition: number
  rank_absolute: number
  rank_group: number
  type: string
  url: string
  title: string
  description: string
  etv: number
  estimated_paid_traffic_cost: number | null
  is_new: boolean
  is_up: boolean
  is_down: boolean
  previous_rank: number | null
}

type SeoRankedKeywords = {
  total_count: number
  items_count: number
  ranked_keywords: RankedKeyword[]
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function SeoTraffic({ data }: { data: SeoTrafficData | null | undefined }) {
  // Handle null/undefined data
  if (!data?.seo_domain_overview) {
    return (
      <div className="space-y-6">
        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 rounded-none">
          <div className="flex flex-col items-center justify-center text-center">
            <Globe className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No SEO Data Available</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              SEO traffic data is not available for this competitor. This could be due to insufficient data or the analysis is still in progress.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const overview = data.seo_domain_overview

  const positionData = useMemo(() => {
    const dist = overview.position_distribution
    return [
      { name: "1", value: dist.pos_1 },
      { name: "2-3", value: dist.pos_2_3 },
      { name: "4-10", value: dist.pos_4_10 },
      { name: "11-20", value: dist.pos_11_20 },
      { name: "21-30", value: dist.pos_21_30 },
      { name: "31-40", value: dist.pos_31_40 },
      { name: "41-50", value: dist.pos_41_50 },
      { name: "51-60", value: dist.pos_51_60 },
      { name: "61-70", value: dist.pos_61_70 },
      { name: "71-80", value: dist.pos_71_80 },
      { name: "81-90", value: dist.pos_81_90 },
      { name: "91-100", value: dist.pos_91_100 },
    ]
  }, [overview])

  const chartConfig = {
    positions: {
      label: "Keywords",
      color: "hsl(220, 90%, 56%)",
    },
    organic_keywords: {
      label: "Organic Keywords",
      color: "hsl(220, 90%, 56%)",
    },
    organic_traffic: {
      label: "Organic Traffic",
      color: "hsl(142, 76%, 36%)",
    },
    paid_keywords: {
      label: "Paid Keywords",
      color: "hsl(38, 92%, 50%)",
    },
    paid_traffic: {
      label: "Paid Traffic",
      color: "hsl(0, 84%, 60%)",
    },
  } as const

  const historicalData = useMemo(() => {
    if (!data.seo_historical?.history) return []
    return data.seo_historical.history.map((h) => ({
      date: h.date,
      organic_keywords: h.organic_keywords,
      organic_traffic: Math.round(h.organic_traffic),
      paid_keywords: h.paid_keywords,
      paid_traffic: Math.round(h.paid_traffic),
    }))
  }, [data.seo_historical])


  const timePeriod = useMemo(() => {
    if (!data.seo_historical?.history || data.seo_historical.history.length === 0) return null
    const sorted = [...data.seo_historical.history].sort((a, b) => a.date.localeCompare(b.date))
    const formatDate = (dateStr: string) => {
      const [year, month] = dateStr.split('-')
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${monthNames[parseInt(month) - 1]} ${year}`
    }
    const start = formatDate(sorted[0].date)
    const end = formatDate(sorted[sorted.length - 1].date)
    return { start, end, months: data.seo_historical.total_months }
  }, [data.seo_historical])

  const overviewMetrics: Array<{
    icon: typeof Eye | typeof Search | typeof Hash | typeof BarChart2
    value: string | number
    label: string
    tooltip?: string
  }> = [
      {
        icon: Eye,
        value: formatNumber(Math.round(overview.organic_etv)),
        label: "Organic Traffic (Est.)",
        tooltip: "Estimated monthly organic traffic based on CTR & ranking positions (DataForSEO Labs ETV)"
      },
      {
        icon: Eye,
        value: formatNumber(Math.round(overview.paid_etv)),
        label: "Paid Traffic (Est.)",
        tooltip: "Estimated monthly paid traffic (DataForSEO Labs ETV)"
      },
      {
        icon: Search,
        value: formatNumber(overview.organic_keywords),
        label: "Organic Keywords",
        tooltip: "Total number of organic keywords ranking"
      },
      {
        icon: Hash,
        value: formatNumber(overview.paid_keywords),
        label: "Paid Keywords",
        tooltip: "Total number of paid keywords"
      },
      {
        icon: BarChart2,
        value: overview.domain_rank === 0 ? "N/A" : formatNumber(overview.domain_rank),
        label: "Domain Rank",
        tooltip: "Domain authority rank (N/A if domain is new or has insufficient authority signals)"
      },
    ]

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid gap-4">
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">SEO Overview</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Domain Performance</span>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {overviewMetrics.map((metric, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-gray-50 dark:bg-[#0A0A0A] rounded-none cursor-help">
                      <div className="flex items-center gap-1 mb-1">
                        <metric.icon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.value}</div>
                    </div>
                  </TooltipTrigger>
                  {metric.tooltip && (
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{metric.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Traffic Cost */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Estimated Traffic Cost</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-auto cursor-help">
                    <span className="text-xs text-gray-400 dark:text-gray-500">ℹ️</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Estimated monthly cost to acquire this traffic via paid search (DataForSEO Labs)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-sm">
                <div className="text-sm text-gray-500 mb-1">Organic Traffic Cost</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(overview.organic_estimated_paid_traffic_cost)}</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-sm">
                <div className="text-sm text-gray-500 mb-1">Paid Traffic Cost</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(overview.paid_estimated_traffic_cost)}</div>
              </div>
            </div>
          </Card>

          {/* Ranking Movements */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3 rounded-none">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ranking Movements</h3>
              </div>
              {timePeriod && (
                <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{timePeriod.start} - {timePeriod.end}</span>
                  <span>•</span>
                  <span>{timePeriod.months}m</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Organic */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Organic</h4>
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {formatNumber(
                      overview.ranking_movements.organic.is_new +
                      overview.ranking_movements.organic.is_up +
                      overview.ranking_movements.organic.is_down +
                      overview.ranking_movements.organic.is_lost
                    )}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {(() => {
                    const organic = overview.ranking_movements.organic
                    const total = organic.is_new + organic.is_up + organic.is_down + organic.is_lost
                    const getPercentage = (val: number) => total > 0 ? (val / total) * 100 : 0

                    return (
                      <>
                        <div className="px-2 py-1.5 bg-green-50/50 dark:bg-green-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Plus className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                              <span className="text-[11px] font-medium text-green-700 dark:text-green-400">New</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(organic.is_new)}</span>
                              <span className="text-[9px] text-green-600 dark:text-green-400">{getPercentage(organic.is_new).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: `${getPercentage(organic.is_new)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-blue-50/50 dark:bg-blue-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Up</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(organic.is_up)}</span>
                              <span className="text-[9px] text-blue-600 dark:text-blue-400">{getPercentage(organic.is_up).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: `${getPercentage(organic.is_up)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-orange-50/50 dark:bg-orange-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <ArrowDown className="h-2.5 w-2.5 text-orange-600 dark:text-orange-400" />
                              <span className="text-[11px] font-medium text-orange-700 dark:text-orange-400">Down</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(organic.is_down)}</span>
                              <span className="text-[9px] text-orange-600 dark:text-orange-400">{getPercentage(organic.is_down).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-orange-100 dark:bg-orange-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 dark:bg-orange-400 rounded-full" style={{ width: `${getPercentage(organic.is_down)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-red-50/50 dark:bg-red-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <X className="h-2.5 w-2.5 text-red-600 dark:text-red-400" />
                              <span className="text-[11px] font-medium text-red-700 dark:text-red-400">Lost</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(organic.is_lost)}</span>
                              <span className="text-[9px] text-red-600 dark:text-red-400">{getPercentage(organic.is_lost).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 dark:bg-red-400 rounded-full" style={{ width: `${getPercentage(organic.is_lost)}%` }} />
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
              {/* Paid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Paid</h4>
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {formatNumber(
                      overview.ranking_movements.paid.is_new +
                      overview.ranking_movements.paid.is_up +
                      overview.ranking_movements.paid.is_down +
                      overview.ranking_movements.paid.is_lost
                    )}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {(() => {
                    const paid = overview.ranking_movements.paid
                    const total = paid.is_new + paid.is_up + paid.is_down + paid.is_lost
                    const getPercentage = (val: number) => total > 0 ? (val / total) * 100 : 0

                    return (
                      <>
                        <div className="px-2 py-1.5 bg-green-50/50 dark:bg-green-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Plus className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                              <span className="text-[11px] font-medium text-green-700 dark:text-green-400">New</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(paid.is_new)}</span>
                              <span className="text-[9px] text-green-600 dark:text-green-400">{getPercentage(paid.is_new).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: `${getPercentage(paid.is_new)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-blue-50/50 dark:bg-blue-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Up</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(paid.is_up)}</span>
                              <span className="text-[9px] text-blue-600 dark:text-blue-400">{getPercentage(paid.is_up).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: `${getPercentage(paid.is_up)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-orange-50/50 dark:bg-orange-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <ArrowDown className="h-2.5 w-2.5 text-orange-600 dark:text-orange-400" />
                              <span className="text-[11px] font-medium text-orange-700 dark:text-orange-400">Down</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(paid.is_down)}</span>
                              <span className="text-[9px] text-orange-600 dark:text-orange-400">{getPercentage(paid.is_down).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-orange-100 dark:bg-orange-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 dark:bg-orange-400 rounded-full" style={{ width: `${getPercentage(paid.is_down)}%` }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-red-50/50 dark:bg-red-900/5 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <X className="h-2.5 w-2.5 text-red-600 dark:text-red-400" />
                              <span className="text-[11px] font-medium text-red-700 dark:text-red-400">Lost</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatNumber(paid.is_lost)}</span>
                              <span className="text-[9px] text-red-600 dark:text-red-400">{getPercentage(paid.is_lost).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-0.5 bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 dark:bg-red-400 rounded-full" style={{ width: `${getPercentage(paid.is_lost)}%` }} />
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4">
          {/* Position Distribution Chart */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Keyword Position Distribution</h3>
            </div>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={positionData} margin={{ left: 0, right: 0, top: 10, bottom: 40 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Historical Ranking Data */}
        {data.seo_historical && data.seo_historical.history.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Historical Keywords</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  {data.seo_historical.total_months} months
                </span>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={historicalData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-')
                      return `${month}/${year.slice(2)}`
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="organic_keywords"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid_keywords"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Organic Keywords</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-600 dark:text-gray-400">Paid Keywords</span>
                </div>
              </div>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Historical Traffic</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={historicalData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-')
                      return `${month}/${year.slice(2)}`
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="organic_traffic"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid_traffic"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Organic Traffic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-600 dark:text-gray-400">Paid Traffic</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Top Keywords Table */}
        {data.seo_keywords && data.seo_keywords.keywords.length > 0 && (() => {
          const keywordsPerPage = 10
          const totalPages = Math.ceil(data.seo_keywords.keywords.length / keywordsPerPage)
          const [currentPage, setCurrentPage] = useState(1)
          const startIndex = (currentPage - 1) * keywordsPerPage
          const endIndex = startIndex + keywordsPerPage
          const currentKeywords = data.seo_keywords.keywords.slice(startIndex, endIndex)

          return (
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Top Keywords (By Volume)</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">These are the most popular keywords driving traffic to the competitor's site based on search volume.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  Total: {formatNumber(data.seo_keywords.total_count)}
                </span>
              </div>

              <div className="rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead className="w-[300px]">Keyword</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead className="text-right">CPC</TableHead>
                      <TableHead className="text-center">KD</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead className="text-right">Competition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentKeywords.map((k, i) => (
                      <TableRow key={startIndex + i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[300px]" title={k.keyword}>{k.keyword}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(k.search_volume)}</TableCell>
                        <TableCell className="text-right">{k.cpc !== null ? formatCurrency(k.cpc) : '—'}</TableCell>
                        <TableCell className="text-center">
                          <div className={`mx-auto flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${(k.difficulty || 0) > 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            (k.difficulty || 0) > 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {k.difficulty ?? '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize font-normal text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            {k.intent}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-medium">{k.competition_level}</span>
                            <span className="text-[10px] text-muted-foreground">{typeof k.competition === 'number' ? k.competition.toFixed(2) : '-'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} - {Math.min(endIndex, data.seo_keywords.keywords.length)} of {formatNumber(data.seo_keywords.keywords.length)} keywords
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="h-8 w-8 p-0"
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-sm text-gray-500 dark:text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })()}

        {/* Ranked Keywords Table */}
        {data.seo_ranked_keywords && data.seo_ranked_keywords.ranked_keywords.length > 0 && (() => {
          const keywordsPerPage = 10
          const totalPages = Math.ceil(data.seo_ranked_keywords.ranked_keywords.length / keywordsPerPage)
          const [currentPage, setCurrentPage] = useState(1)
          const startIndex = (currentPage - 1) * keywordsPerPage
          const endIndex = startIndex + keywordsPerPage
          const currentKeywords = data.seo_ranked_keywords.ranked_keywords.slice(startIndex, endIndex)

          return (
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 rounded-none">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Ranked Keywords</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">These are keywords where the competitor is ranking in the top 100 search results.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  Total: {formatNumber(data.seo_ranked_keywords.total_count)}
                </span>
              </div>

              <div className="rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead className="w-[200px]">Keyword</TableHead>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead className="w-[60px] text-center">Rank</TableHead>
                      <TableHead className="w-[150px]">URL</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead className="text-right">CPC</TableHead>
                      <TableHead className="text-right">ETV</TableHead>
                      <TableHead className="text-right">Est. Cost</TableHead>
                      <TableHead className="text-right">Competition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentKeywords.map((k, i) => (
                      <TableRow key={startIndex + i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px]" title={k.keyword}>{k.keyword}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={k.description || k.title}>{k.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-[10px] h-5 px-1.5 font-normal">
                            {k.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-gray-900 dark:text-gray-100">{k.rank_absolute}</span>
                            {k.previous_rank && k.previous_rank !== k.rank_absolute && (
                              <div className="flex items-center text-[10px]">
                                {k.rank_absolute < k.previous_rank ? (
                                  <ArrowUp className="h-3 w-3 text-green-500" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={k.rank_absolute < k.previous_rank ? "text-green-500" : "text-red-500"}>
                                  {Math.abs(k.previous_rank - k.rank_absolute)}
                                </span>
                              </div>
                            )}
                            {k.is_new && <span className="text-[10px] text-blue-500 font-medium">New</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a href={k.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-[150px]" title={k.url}>
                            {k.url}
                          </a>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(k.search_volume)}</TableCell>
                        <TableCell className="text-right">{k.cpc !== null ? formatCurrency(k.cpc) : '—'}</TableCell>
                        <TableCell className="text-right" title="Estimated Traffic Volume">{formatNumber(Math.round(k.etv))}</TableCell>
                        <TableCell className="text-right">{k.estimated_paid_traffic_cost !== null ? formatCurrency(k.estimated_paid_traffic_cost) : '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground">{typeof k.competition === 'number' ? k.competition.toFixed(2) : '-'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} - {Math.min(endIndex, data.seo_ranked_keywords.ranked_keywords.length)} of {formatNumber(data.seo_ranked_keywords.ranked_keywords.length)} keywords
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="h-8 w-8 p-0"
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-sm text-gray-500 dark:text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })()}
      </div>
    </TooltipProvider>
  )
}

export default SeoTraffic





