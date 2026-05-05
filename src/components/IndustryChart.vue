<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

use([
  BarChart,
  GridComponent,
  TooltipComponent
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

  const distribution = {}
  props.data.forEach(f => {
    const industry = f[F.Q2_INDUSTRY] || '未填写'
    distribution[industry] = (distribution[industry] || 0) + 1
  })

  const sortedEntries = Object.entries(distribution).sort((a, b) => {
    if (a[0] === '其他') return 1
    if (b[0] === '其他') return -1
    return b[1] - a[1]
  })

  const categories = sortedEntries.map(e => e[0])
  const values = sortedEntries.map(e => e[1])

  const textColor = props.isModal ? '#374151' : '#6b7280'
  const colors = props.isModal
    ? ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
    : ['#6b7280', '#4b5563', '#374151', '#9ca3af']

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: categories, axisLabel: { rotate: 30, color: textColor, fontSize: 11 } },
    yAxis: { type: 'value', minInterval: 1, axisLabel: { color: textColor, fontSize: 11 } },
    series: [{
      type: 'bar',
      data: values.map((value, index) => ({
        value,
        itemStyle: { 
          color: colors[index % colors.length],
          borderRadius: [6, 6, 0, 0]
        }
      })),
      barWidth: '50%'
    }]
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
