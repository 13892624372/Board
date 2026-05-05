<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

use([
  LineChart,
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

  const dailyStats = {}
  props.data.forEach(f => {
    const timestamp = f[F.TIMESTAMP]
    const satisfaction = parseInt(f[F.Q4_SATISFACTION])
    if (timestamp && !isNaN(satisfaction)) {
      const date = timestamp.split(' ')[0].split('/').slice(0, 2).join('/')
      if (!dailyStats[date]) {
        dailyStats[date] = { scores: [], count: 0 }
      }
      dailyStats[date].scores.push(satisfaction)
      dailyStats[date].count++
    }
  })

  const sortedDates = Object.keys(dailyStats).sort()
  const dates = sortedDates.map(date => {
    const parts = date.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : date
  })
  const avgScores = sortedDates.map(date => {
    const scores = dailyStats[date].scores
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
  })
  const counts = sortedDates.map(date => dailyStats[date].count)

  if (dates.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: { color: props.isModal ? '#374151' : '#6b7280', fontSize: 14 }
      }
    }
  }

  const textColor = props.isModal ? '#374151' : '#6b7280'
  const lineColor = props.isModal ? '#5470c6' : '#6b7280'
  const barColor = props.isModal ? '#91cc75' : '#4b5563'
  const areaColorStart = props.isModal ? 'rgba(84, 112, 198, 0.3)' : 'rgba(107, 114, 128, 0.3)'
  const areaColorEnd = props.isModal ? 'rgba(84, 112, 198, 0.05)' : 'rgba(107, 114, 128, 0.05)'

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: [
        { name: '平均满意度', itemStyle: { color: lineColor } },
        { name: '问卷数量', itemStyle: { color: barColor } }
      ],
      top: 0,
      textStyle: { fontSize: 11, color: textColor }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { fontSize: 11, color: textColor, rotate: 0 }
    },
    yAxis: [
      {
        type: 'value',
        name: '满意度',
        min: 0,
        max: 5,
        nameTextStyle: { fontSize: 11, color: textColor },
        axisLabel: { fontSize: 11, color: textColor }
      },
      {
        type: 'value',
        name: '数量',
        min: 0,
        nameTextStyle: { fontSize: 11, color: textColor },
        axisLabel: { fontSize: 11, color: textColor }
      }
    ],
    series: [
      {
        name: '平均满意度',
        type: 'line',
        data: avgScores,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: lineColor, width: 3 },
        itemStyle: { color: lineColor, borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: areaColorStart },
              { offset: 1, color: areaColorEnd }
            ]
          }
        }
      },
      {
        name: '问卷数量',
        type: 'bar',
        yAxisIndex: 1,
        data: counts,
        itemStyle: {
          color: barColor,
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: '40%'
      }
    ]
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
