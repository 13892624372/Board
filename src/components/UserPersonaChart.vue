<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

use([
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const props = defineProps({
  data: Array,
  isModal: {
    type: Boolean,
    default: false
  }
})

const chartOption = computed(() => {
  const F = CONFIG.FIELDS

  const identityDist = {}
  props.data.forEach(f => {
    const identity = f[F.Q1_IDENTITY] || '未填写'
    identityDist[identity] = (identityDist[identity] || 0) + 1
  })

  let newUsers = 0
  let oldUsers = 0
  props.data.forEach(f => {
    const usage = f[F.Q3_USAGE_COUNT] || ''
    if (usage.includes('1') || usage.includes('第1次') || usage.includes('首次')) {
      newUsers++
    } else {
      oldUsers++
    }
  })

  const totalUsers = newUsers + oldUsers
  const newUsersPercent = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0
  const oldUsersPercent = totalUsers > 0 ? ((oldUsers / totalUsers) * 100).toFixed(1) : 0

  const textColor = props.isModal ? '#374151' : '#6b7280'
  const pieColors = props.isModal 
    ? ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
    : ['#6b7280', '#9ca3af', '#4b5563', '#374151', '#1f2937']
  const barColors = props.isModal
    ? [{ color: '#5470c6', borderRadius: [6, 6, 0, 0] }, { color: '#91cc75', borderRadius: [6, 6, 0, 0] }]
    : [{ color: '#6b7280', borderRadius: [6, 6, 0, 0] }, { color: '#4b5563', borderRadius: [6, 6, 0, 0] }]
  const legendColors = props.isModal
    ? [{ name: '身份分布', itemStyle: { color: '#5470c6' } }, { name: '用户类型', itemStyle: { color: '#91cc75' } }]
    : [{ name: '身份分布', itemStyle: { color: '#6b7280' } }, { name: '用户类型', itemStyle: { color: '#4b5563' } }]

  const pieData = Object.entries(identityDist).map(([name, value], index) => ({
    name,
    value,
    itemStyle: {
      color: pieColors[index % pieColors.length]
    }
  }))

  return {
    tooltip: { 
      trigger: 'item', 
      formatter: (params) => {
        if (params.seriesType === 'pie') {
          return `${params.name}: ${params.value} (${params.percent}%)`
        }
        const percent = params.data.percent
        return `${params.name}: ${params.value}人 (${percent}%)`
      }
    },
    legend: {
      data: legendColors,
      top: 0,
      textStyle: { fontSize: 10, color: textColor },
      itemWidth: 12,
      itemHeight: 12
    },
    grid: {
      left: '55%',
      right: '5%',
      top: '15%',
      bottom: '10%'
    },
    series: [
      {
        name: '身份分布',
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['28%', '55%'],
        data: pieData,
        label: { fontSize: 10, color: textColor },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
        }
      },
      {
        name: '用户类型',
        type: 'bar',
        barWidth: '50%',
        data: [
          { name: '新用户', value: newUsers, percent: newUsersPercent, itemStyle: barColors[0] },
          { name: '老用户', value: oldUsers, percent: oldUsersPercent, itemStyle: barColors[1] }
        ],
        label: {
          show: true,
          position: 'right',
          formatter: '{c}人',
          fontSize: 10,
          color: textColor
        }
      }
    ],
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { fontSize: 9, color: textColor },
      splitLine: { lineStyle: { type: 'dashed', color: props.isModal ? '#e5e7eb' : '#d1d5db' } }
    },
    yAxis: {
      type: 'category',
      data: ['新用户', '老用户'],
      axisLabel: { fontSize: 10, color: textColor },
      axisTick: { show: false }
    }
  }
})
</script>

<style scoped>
.chart-container { 
  width: 100%; 
  height: 100%; 
  min-height: 280px;
}
.chart { 
  width: 100%; 
  height: 100%; 
  min-height: 280px;
}
</style>
