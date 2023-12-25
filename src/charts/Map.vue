<template>
  <!-- 定义echarts需要控制的dom元素 -->
  <div ref="charts" :style="{ height: height, width: width }" />
</template>
<script>
import * as echarts from 'echarts';
import guangzhoucity from "@/assets/data-guangzhou-city.json"
import schoolList from "../json/schoolList.json"

require('echarts/theme/dark') // echarts主题
export default {
  name: 'App',
  data () {
    return {
      width: '100%',
      height: '100%',
      /*echarts数据*/
      chartData: {},
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

      // 数据处理
      let echartsData = [];
      schoolList.data.forEach(item => {
        echartsData.push({
          name: item.shortName,
          value: item.value.concat([item.shortName])//item.[item.longitude, item.latitude, item.name]
        })
      })
      const option = {
        // 提示浮窗样式
        tooltip: {
          show: true,
          trigger: "item",
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
          formatter (params) {
            console.log(`params`, params)
            const list = {
              '荔湾区': ['广钢实验幼儿园', '宝学士托育中心', '广钢幼儿园'],
              '黄埔区': ['广钢和苑幼儿园', '广钢科城山庄幼儿园', '广钢中新第一幼儿园', '广钢华标幼儿园', '广钢雍景湾幼儿园', '广钢和苑第二幼儿园'],
              '番禺区': ['广钢倚莲半岛幼儿园', '广钢亚运城幼儿园', '广钢利凯花园幼儿园', '华工广钢幼儿园', '广钢亚运城第二幼儿园', '洛浦街广钢幼儿园', '广钢亚运城第三幼儿园', '广钢利联花园幼儿园'],
              '白云区': ['广钢新市元邦幼儿园', '广钢南湖幼儿园', '广钢新市幼儿园', '广钢瑞晖幼儿园', '广钢竹韵幼儿园']
            }
            return `<p style="text-align:center;line-height: 30px;height:30px;border-bottom: 1px solid #7A8698;">${params.name}（${list[params.name]?.length || 0}个）</p>
              <div style="line-height:22px;margin-top:5px"><span style="margin-left:12px;color:#fff;float:right">${list[params.name]?.join('<br/>') || ''}</span></div>`;
          },
          showDelay: 100
        },
        legend: {
          top: '30%',
        },
        // 地图配置
        geo: {
          //当前视角的缩放比例。
          roam: false,
          zoom: 1.22,
          projection: {
            project: (point) => [point[0] / 300 * Math.PI, - Math.log(Math.tan((Math.PI / 2 + point[1] / 300 * Math.PI) / 2))],
            unproject: (point) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90]
          },
          map: "guangzhou",
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            // 鼠标放上去的样式
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248, 1)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            type: "map",
            roam: true,
            zoom: 1,
            geoIndex: 0,
            label: {
              // 通常状态下的样式
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
              // 鼠标放上去的样式
              emphasis: {
                textStyle: {
                  color: "#640000",
                },
              },
            },
            // data: this.echartsData
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAADzZJREFUeF7tnQuQHEUZx//f7F4etzMQQ3aWBAVKQ5KdDQoVeSlIFAoBeSmCxFILEC0ESwVFqAoPFUQBgw8KLIhILB+IQgTEVxBRKcRCUhrJziaQKjUWyd3ugUlu9y6Pvfms3r0lx3KPnd3unp6Frkolle3+Xv2bfk8PoQvT9v/mZid6+HC2kAN4AcE6GOB5ANIA3jiOy0UGXgK4j4DNRNamgFHoQbBuhlt4vgtD9LJL1A3OcdGzy6CTwXwCAceBRMVLSyVmPJkgPJ6wEmumz3l2gzTJBgiKLQD8+NJkxetfxqAPEuEMjbFcx0yruVq9b58DNm7UqFeJqtgBUO5bdCgs6yIwLgZhmpKotCyUHrWAu3rd/P0tFzEsY2wAGHpx0TFBYH0OjHMNi6EwZwMR3ZpK51caaNukJhkPwOBWL0cWLwfRMuODS8gjwNfsjP9j420dNdBYAJhBlZJ3I4Cr4hLMhp3M9KiVwPLUnPzfTLfdSAAqpcWnMYJvgLHQ9ABOZh+DbnDc/DUm+2AcAOV+bwUIl5sctDC2MfCUBVyacv2/hymnK68xAOwoLVpgsfU9iHl89yUm8CdSbuFu01wzAoBKMXsqM/0QhNmmBUiqPYxb7Iz/RakyOxQWOQCVUvYiZord9KntuDPfa2cKH267vOSCkQIwVPIuDxgrJPtkvjjGb7fu2H3WIYds2hW1sZEBUO7PfhFEN0UdgMj0Ex5Pzdl9ClG0EEQCQLmY/SxA34os+MYo5jW2W3hvlOZoB6Dcn/0YiH4QpdNm6ab7bDd/XlQ2aQVgcCD3Hgr4saicNVYv8zftTCGStQ9tAAwNLDggCJJ/neBAhrF1o8swYr4klSl8V5e+hh5tAFSK3q8ZOEW3g3HSZyWCd/Tut+EpnTZrAWCw37uOCF/S6VhMda2zXf8wnbYrB2BH0TvOAv6s06k462LQtx03/zldPigHoFzy/grGUboc6go9zCfZmcKjOnxRCkC5lL0CTDfrcKRVHZQ4AJY1D+JvHnmhViwItrz871blqM3Hz9hu4Qi1OurSlQFQLnr7g/EvEGbocGQiHckZZyHRcwTE31OlkT1PI9jzDEZ2Px09FAFfZu9fUL5YpgyAStG7jYFPTxV0Fb+Lyp7We0ntKe8kVXc+iN1Dd0TVOgykqjMPonlrhzrxYaqySgAY3dvXfmRaVsU3By0qEMTMKZX2vzxVJXbyuxIABku5O4j5U50YFqasaOKnO1/t+ImfSueeoTuwu3L7VNlk/r49VZ05T2UrIB2ASik7l5m2yIzCZLJE5c+YtUqXOmhvDQhX2Gn/G6oclA6AzkUf8dS3MriTHTwxexjefoGWsQEBm1Kuf4hsHxrypANQLnn/BuMgVQY35M6YdQ8SPUeqVjOp/KGXTtIDgYWzUnP8h1Q4KxWASil3OjM/rMLQsTKjevKb/dLVEjBwv+P656iIq1QAyiXvh2B8RIWhDZmiyRcAmJLE2sGuwauVtwTV4cTsWQc9+z/ZfksDQLzJM1TyBhlIyTayIU/3gK9VPzTNDi60Xf+eVm1qNZ80AHb05U63LLXNf+/sNcqneq0Grjmf6vEAg1c7buHsdu2bqJw0AAaL3m2kcOVvWupS9PReItt/afJEV7Bz2wXS5L1KEKNiZ3xbtgJpAJT7vfWSb+Z4ha+pdF6279Ll7RpcXlsnUJUYfLzjFqRurUsBoLbxA2xV5bjpT3/Db9WzggBYvo/rizempSUpAFT6cmewxUrmqcJTk/t+nWMBZjzkZPyptzVD4CEFAJWrf2JHTwAQl6R0RkDYbKd9qYtsUgCoFL2fMaBkoSIuzX8DUNWDwZFdtN++b8q/JOuBkAJAuZhdB9BbZRk1Vo4JS75h/VI5JRwJ+Jh99y+I4/VSkiQAvB0AHCkWNQmJw+i/2W+VswEmWuak8z+VFeuOAdj2n0PfkJw5Iq1JGutY3Pr/hu0qAQDjCjsjb3u4YwB2lBYutDih5PbMuAKgeCB4i52Wd8lExwAMvZg9OhghJW+zmLr2P1XzKxaDRCugJtHdtpu/SJbsjgEoD2RPREBKzrC/DsB41Sz3beKOAdjRt+g0y7J+KYvIsXLiCoDKLoAID6fS/pmy4i0BgNwZlqJVwNfHAK+uZuMAqBS9Uxj4tSwim+XEcRqotAUAHki5/gdlxbvzFqDoHWsBT8gyqFlOnPYBGrbv3HY+RvYouyV2le360vadOwdA4TRQBNSU839hAK+UZH6vokkzwaxpYF/fW1O2VS2HCVCYvKadAZzKdtV7ARbwmV7Xv20qO1r9veMWQCgqF73/qrz6JU7dgMr+X8SagFNTrv+bVit4qnyyABAGnTyVsnZ/j9OGkNLmH0AiiYNmzvY3txvL5nJSAKgM5G7ggFUtfdVe79b5+le7wVX99ItTV7bri6+fSUtyABD3+3OgZDGo4WkcBoMqt4FFHJh5tZORezJYCgAvPj9/n+n7TtsuDctxBJneCmh4+iF7ADg6ppBTbeWi9wcA75YjbXwpJrcCqvv+WgtQtTxn3vqCzBhLaQFqM4F+7/MgKHuNueG0iTMCxQs/NdeZ+VknU5B+6koaANv6F78lScEmmXSOJ0vsD8zc9x5j3hDS0fTXAcBXnIx/nez4SgOg1gqUvMfAeI9sI5vlqboKJqzdavf9X2lNTwKLp+/nS387RioAlaJ3IQNavosjTgsnp58ZWUugesXvldXPf7TdgpLxlVQAmJcmKwPFEhizwj5N7eTXdTdQs226mv2X9Vp0vj0nr+SKfakAjHYDN4uDi+1UaDtldI8JdAz4muIgffFnrHzpAOgaDOoeF2i/HGrUQWa61snkr2/n4WiljHQAaq1A0RPjgAtbMUB2HrFWILqGTi+JbNglKl78Ubi/P3EIGDurOxPzVNwM0lCqBoD6J97/Kbtyw8gTg0Sr5+2wrANCwyDe8hUVHlnFjzpKwI0p11e2xyLUKAFACK4UcysZLO34cpjKb84rWoTEtCNrQIgkoGikIHgBPFK/1lBUuvjTuES6E50dl2VURnbTgTLfAxzPJmUAbC/m5ifAz3cciNeoAAJfnXILym/DUgZAbSzQn/06iK58jdZh224T8K+U67+5bQEhCioFYMuWJb37JIfF8vDcEDa9nhV0vu2qmfc3B1cpAPWxQPbjDBJfBX89tRIB5jV2Rt/HJJUDUOsKit5vAUT6hcxWYm9CHiLriFR6/TO6bNEDwP+8w7AHf9flVFz1MOirjpu/Wqf9WgAY7QquZpCyFS2dQVOk6x+26x+uSPaEYrUBUIfAe4KBY3U7GQd9bNEJzpy8OFWlNWkFYNuWhW9PJhPK3pnSGjmJyhi40VG84jeRuVoBqA0INR0dk1g/SkUx8KTj+pG1itoBqHcFuQcY/AGlkY2HcAbT4XYmvy4qcyMBoNy/OAMK1gLo7LtuUUVNkl5mXOxk/DsliWtLTCQACEu3l7LvSzA90pbVXVCImVc6mcIno3YlMgCE44N92eVk0Q1RB0G7fsLTdto34nvKkQJQg6CYvZdA52mvhOgUDnGSj3JmF9ZHZ8JezZEDwHzwjEqpV1wzd5gJAVFtAwMfclz/Z6r1tCo/cgDqU8Pc20D8JBR+b6jVgKjMp2uPP4wPRgAgDB4ayL4/CGh1GOPjlJeA76dc/+Om2WwMALWWoC93GSy+1bQgdWwP4TE77Z/YsRwFAowCoN4deCtAuFyBr1GJ3Ai2jrcz6/ujMmAyvcYBUIcg+xMQLTMxYGFsYmCHBSxNub6xW+FGAlCDoOT9HowTwgTcvLx0iu3mxWEYY5OxAPD23OzKLhbbo28zNnqTGcb4qJ3xf2S67cYCIAK3s5ibP0L8e9bwNXKZFcXAZxyJd/nJtK1ZltEACGMrpUVLGNajYLxBZSBkyWbwNY5biM3ytvEAiIoZ3LpoqZW0fseMabIqSo0cvsl2C1epka1GaiwAEK5v35o9NZGgX6kJgxSp37Fd/7NSJGkUEhsAREyG+rPvD8i81UIi3JlK+xdrrDdpqmIFQK07KHrnEnCftAh0Luj7toFLvK26FTsAhGPlUm4ZmH/SqpOq8hGwKiXx7n5Vdk4mN5YA1CDoy30YFv84iqDVdfIPbLdwfnT65WiOLQC17qCUO4+Y75UTilBS7rFdP5IbUEJZ2ULmWAMwOiY4hwBtByxMOcvXQt22lCX2AAgvKwPemRzgwZY87iATgW9PuYVPdyDCuKJdAUBtTFDMnQzmB0GYriTKhBV22v+CEtkRCu0aAEQMh4vZd40Q/QKM2TJjSsTXp9KFa2XKNEVWVwFQ6w5Ki5YA1mpmHCgnyHSV7eZvkiPLPCldB4AI8c7SogVVth4AsLiTkDPzpU6mcEcnMkwv25UA1McE3v4M3E/AO9uqBMZH7Iwf4TpDW1aHLtS1AIhIMM+fPjQw7efMOL3VyBAwBPA5Kbeg7HO4rdqiI19XAlAqLXRqwRuG48wku8q0AqDTWghoEQiuTBL+IvIODnPtg5jpAzfWb5LswhRrAGoVPQyndybNDapwrGTSBoLxP6vGdDaDT5qoDomwGUwrQVwcLw+DBmutSnVka08SW2pwzMRgOr2x9v9xTbECYGyFA9aS0EFnnMTA2a8qx8iDeCURDYeVKcBoQDEjveG5sOWjzh8LAOpTu+TcCZ/uMFEkHM0BXv76NgNPWYRVYURMlLfRSiQxsjYuMBgLgHjae0EL2nrSp6hNZvJQv8j6CSL8QkblN8sQMBBGnhsCP2dyN2EkAKOLOeGb+HA1KW4neSFckfC5GyCk0hvEjSjGJaMAqD/1PcdLaeoNC7UAwU7no9i6njQSRgFQKS0+rRsrv1EDJkJgDACjR78XGPbgKjAnWGtSd2AMAOKcH4HrCzhdnExrBYwBoFLyIr8xSxd3qbR/ly5dU+kxCIDu7v8bFRFUg+ecuRv+OFXF6PrdGADqM4BE7O8EmKziRPM/jOojJq0LGAOACFw3Q1Cr/OHqn0zbWDIKgL0QdNtagLUllV5v5K2oxgHQaEKlrv/r6lCb9Jj61I8101gAGkaKbmFGlZZYSStGawTBWtP3ABrxNR6AsSA4oLl7qphnGgyN9X5hq0mLPK00fLEBoNkZ0TLsBWKSgyCtRCFEnsaWr9jpE8Xi8qRP5GJsARjPocaBEXEMbARwxCkhkU+cFOIxq4zNK46NSt3bLNJgUK2WrSRqp30SwKA4AWTaCD4EtxNm/T9TwVTMYQ3iygAAAABJRU5ErkJggg==",
            legendHoverLink: true,
            symbolSize: [28, 28],
            // 这里渲染标志里的内容以及样式
            label: {
              show: false,
              position: 'top',
              formatter (value) {
                return value.data.value[2];
              },
              color: "#fff",
            },
            // 标志的样式
            itemStyle: {
              normal: {
                color: "rgba(13, 255, 255, 1)",
                shadowBlur: 2,
                shadowColor: "D8BC37",
              },
            },
            // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
            // 至于如何展示，完全是靠上面的formatter来自己定义的
            data: echartsData,
            // data: [
            //   { name: '从化区', value: [113.50, 23.64, '从化区'] },
            //   // { name: '白云区', value: [123.50, 25.64, '从化区'] },
            //   { name: '从化区', value: [113.24, 23.28, '白云区'] },
            //   { name: '从化区', value: [113.242111, 23.166166, '白云区22'] },
            // ],
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            hoverAnimation: true,
            zlevel: 1,
          },
        ],
      };
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      echarts.registerMap("guangzhou", guangzhoucity)

      charts.setOption(option);

    }
  }
}
</script>
