<template>
  <!-- 定义echarts需要控制的dom元素 -->
  <div @click="view" ref="charts" :style="{ height: height, width: width }" />
</template>
<script>
import * as echarts from 'echarts';

require('echarts/theme/dark') // echarts主题
export default {
  name: 'App',
  data () {
    return {
      width: '100%',
      height: '100%',
      /*echarts数据*/
      chartData: {}
    }
  },
  props: {
    title: {
      default: ''
    },
    subtext: {
      default: ''
    },
    series: {
      default: []
    },
    xAxis: {
      default: []
    },
    top: {
      default: '90px'
    },
    left: {
      default: '50px'
    },
    right: {
      default: '10px'
    },
    bottom: {
      default: '40px'
    },
  },
  watch: {
    series: {
      handler () {
        const charts = echarts.init(this.$el)
        charts.dispose()
        this.initEcharts()
      },
      deep: true
    },
    xAxis: {
      handler () {
        this.initEcharts()
      },
      deep: true
    }
  },
  mounted () {
    // dom元素加载完成后执行
    this.$nextTick(() => {
      // 初始化echarts实例
      this.initEcharts()
    })

    // 只要窗口大小发生像素变化就会触发
    window.addEventListener("resize", () => {
      const charts = echarts.init(this.$el)
      charts.resize()
    });
  },
  methods: {
    initEcharts () {
      const charts = echarts.init(this.$el)
      // charts.dispose();
      const option = {
        grid: {
          top: this.top,
          left: this.left,
          right: this.right,
          bottom: this.bottom
        },
        title: {
          text: this.title,
          textStyle: {
            color: '#FFF',
            fontSize: 15
          },
          subtext: this.subtext,
          subtextStyle: {
            color: '#FFF',
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          alwaysShowContent: false,
          backgroundColor: "#0C121C",
          borderColor: "rgba(0, 0, 0, 0.16);",
          hideDelay: 100,
          triggerOn: "mousemove",
          enterable: true,
          textStyle: {
            color: "#DADADA",
            fontSize: "12",
            width: 20,
            height: 30,
            overflow: "break",
          },
        },
        legend: {
          top: '10%',
          textStyle: {
            color: '#FFF',
            fontSize: 10
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxis,
            axisLine: {
              lineStyle: {
                color: "#FFF",
              },
            },
            // axisLabel: {
            //   interval: 0
            // }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: "#FFF",
              },
            }
          }
        ],
        series: [
        ]
      };

      // 为echarts对象加载数据
      const colors = ['rgb(0, 186, 255)', 'rgb(61, 231, 201)', 'rgb(255, 197, 48)'];
      option.series = this.series.map((item, index) => {
        return {
          name: item.name,
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          label: {
            show: false,
            position: 'inside',
            color: 'red'
          },
          data: item.data,
          showBackground: false,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: colors[index]
          }
        }
      })
      charts.setOption(option);
    },
    view () {
      this.$emit('click');
    }
  }
}
</script>
