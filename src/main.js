import { createApp } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent } from 'echarts/components'
import App from './App.vue'

// 注册渲染器和组件
use([CanvasRenderer, TitleComponent])

// 导入词云（自动注册）
import 'echarts-wordcloud'

createApp(App).mount('#app')
