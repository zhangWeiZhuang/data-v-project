<template>
  <div id="app">
    <div id="data-view">
      <dv-full-screen-container>
        <div id="top-header">
          <dv-decoration-8 class="header-left-decoration" />
          <dv-decoration-5 class="header-center-decoration" />
          <dv-decoration-8 class="header-right-decoration" :reverse="true" />
          <div class="center-title">智慧幼教-数据大屏</div>
        </div>
        <div class="main-content">
          <div class="block-left-content">
            <div id="scroll-board">
              <!-- <dv-scroll-board :config="configScroll" /> -->
              <digital-flop />
            </div>
            <dv-border-box-8 :reverse="true" style="margin-top:15px;;box-sizing: content-box;">
              <div id="target" style="padding:10px">
                <div class="target-item">
                  <!-- 月度营业收入完成情况 -->
                  <div class="target-item-title">
                    <select>
                      <option>2023年10月</option>
                      <option selected>2023年11月</option>
                    </select>
                  </div>
                  <yysr :xAxis="xAxis" :series="curIncome" title="月度营业收入完成情况" right="0px" @click="viewArea(1)"></yysr>
                </div>
                <div class="target-item">
                  <!-- 累计营业收入完成情况 -->
                  <div class="target-item-title">
                    <select>
                      <option>2023年10月</option>
                      <option selected>2023年11月</option>
                    </select>
                  </div>
                  <yysr :xAxis="xAxis" :series="totalIncome" title="累计营业收入完成情况" right="0px" @click="viewArea(2)"></yysr>
                </div>
                <div class="target-item">
                  <!-- 月度利润总额完成情况 -->
                  <div class="target-item-title">
                    <select>
                      <option>2023年10月</option>
                      <option selected>2023年11月</option>
                    </select>
                  </div>
                  <yysr :xAxis="xAxisProfit" :series="curProfit" title="月度利润总额完成情况" right="0px" @click="viewArea(3)">
                  </yysr>
                </div>
                <div class="target-item">
                  <!-- 累计利润总额完成情况 -->
                  <div class="target-item-title">
                    <select>
                      <option>2023年10月</option>
                      <option selected>2023年11月</option>
                    </select>
                  </div>
                  <yysr :xAxis="xAxisProfit" :series="totalProfit" title="累计利润总额完成情况" right="0px" @click="viewArea(4)">
                  </yysr>
                </div>
              </div>
            </dv-border-box-8>
          </div>
          <div class="block-center-content">
            <div id="map">
              <!-- 广州地图 -->
              <dv-border-box-10>
                <Map />
              </dv-border-box-10>
            </div>
          </div>
          <div class="block-right-content">
            <div>
              <school />
            </div>
            <!-- <dv-border-box-8 :reverse="true" style="margin-top:15px;height:300px;">
              <div class="block-right-content-main">
                <div class="block-right-content-main-item">
                  <lineCharts :xAxis="xAxisAttendance" :series="seriesAttendance" title="学生出勤统计（11月）" />
                </div>
              </div>
            </dv-border-box-8> -->
            <dv-border-box-8 style="margin-top:15px;;box-sizing: content-box;">
              <div class="block-right-content-main">
                <div class="block-right-content-main-item">
                  <lineCharts :xAxis="xAxisAttendance" :series="seriesAttendance" title="学生出勤统计（11月）" />
                </div>
                <div class="block-right-content-main-item">
                  <lineCharts :xAxis="xAxisSalesRevenue" :series="seriesSalesRevenue" title="销售收入趋势（近12月）"
                    subtext="金额：元" />
                </div>
                <div class="block-right-content-main-item">
                  <yysr :xAxis="xAxisSalesProfit" :series="seriesSalesProfit" left="70px" title="销售利润统计（近12月）"
                    subtext="金额：元" />
                </div>
                <div class="block-right-content-main-item">
                  <yysr :xAxis="xAxisProject" :series="seriesProject" left="70px" title="工程类项目汇总统计（本年）" subtext="金额：元" />
                </div>
              </div>
            </dv-border-box-8>
          </div>
        </div>
      </dv-full-screen-container>
    </div>

    <el-dialog :title="dialogTitle" :destroy-on-close="true" :visible.sync="dialogVisible" width="70%"
      :append-to-body="true" @close="close">
      <div class="dialogHeight" ref="scroll">
        <div class="Breadcrumb">
          <el-link type="primary" :underline="false" :disabled="!areaName" @click="backArea">区域</el-link>
          <span v-if="areaName" style="padding:0px 6px;">/</span>
          <el-link :underline="false" type="info" disabled v-if="areaName">{{ areaName }}</el-link>
          <el-link type="primary" v-if="areaName" style="margin-left:10px" :underline="false"
            @click="backArea">返回上一层级</el-link>
        </div>
        <div id="target">
          <div class="target-item" :key="area" v-for="  area   in   xAxisArea  ">
            <!-- 月度营业收入完成情况 -->
            <div class="target-item-title">
              <select>
                <option>2023年10月</option>
                <option selected>2023年11月</option>
              </select>
            </div>
            <yysr v-if="dialogVisible" :xAxis="xAxisAreaList" :series="areaSeries[area]" :title="area"
              @click="viewArea('nursery', area)"></yysr>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Map from './charts/Map.vue'
import yysr from './charts/yysr.vue'
import lineCharts from './charts/lineCharts.vue'
import digitalFlop from './components/digitalFlop';
import school from './components/school';
import data from './data.json';
import salesTrend from './salesTrend.json';
import profitStatistics from './profitStatistics.json';
import contract from './contract.json';
export default {
  name: 'App',
  components: {
    Map,
    yysr,
    lineCharts,
    digitalFlop,
    school
  },
  data () {
    return {
      dialogTitle: '',
      areaName: '',
      dialogVisible: false,
      viewType: -1,
      xAxis: ['学前教育业务', '增值服务', '合计'],
      xAxisProfit: ['学前教育业务', '增值服务', '公司本部', '合计'],
      xAxisAreaList: ['学前教育业务', '增值服务', '合计'],
      // 月度营业收入完成情况
      curIncome: [
        {
          name: '11月计划',
          data: [1006, 84, 1090]
        },
        {
          name: '11月实际完成',
          data: [1091, 89, 1180]
        },
        {
          name: '上年同期',
          type: 'bar',
          data: [376, 5, 381]
        }
      ],
      // 累计营业收入完成情况
      totalIncome: [
        {
          name: '累计计划',
          data: [8802, 1492, 10294]
        },
        {
          name: '累计实际完成',
          data: [9143, 1277, 10420]
        },
        {
          name: '上年同期',
          type: 'bar',
          data: [6223, 880, 7103]
        }
      ],
      // 月度利润总额完成情况
      curProfit: [
        {
          name: '11月计划',
          data: [64, 125, -247, -58]
        },
        {
          name: '11月实际完成',
          data: [210, 69, -125, 154]
        },
        {
          name: '上年同期',
          type: 'bar',
          data: [-272, -1, -113, -385]
        }
      ],
      // 累计利润总额完成情况
      totalProfit: [
        {
          name: '累计计划',
          data: [-178, 1143, -1953, -988]
        },
        {
          name: '累计实际完成',
          data: [809, 998, -1356, 451]
        },
        {
          name: '上年同期',
          type: 'bar',
          data: [45, 765, -1170, -360]
        }
      ],
      xAxisArea: ['荔湾区', '黄埔区', '番禺区', '白云区'],
      oldxAxisArea: [],
      //区域数据
      areaSeries: {
        // '荔湾区': [{
        //   name: '11月计划',
        //   data: [1006, 84, 1090]
        // },
        // {
        //   name: '11月实际完成',
        //   data: [1091, 89, 1180]
        // },
        // {
        //   name: '上年同期',
        //   type: 'bar',
        //   data: []
        // }],
        // '黄浦区': [{
        //   name: '11月计划',
        //   data: [1006, 84, 1090]
        // },
        // {
        //   name: '11月实际完成',
        //   data: [1091, 89, 1180]
        // },
        // {
        //   name: '上年同期',
        //   type: 'bar',
        //   data: []
        // }],
        // '番禺区': [{
        //   name: '11月计划',
        //   data: [1006, 84, 1090]
        // },
        // {
        //   name: '11月实际完成',
        //   data: [1091, 89, 1180]
        // },
        // {
        //   name: '上年同期',
        //   type: 'bar',
        //   data: []
        // }],
        // '白云区': [{
        //   name: '11月计划',
        //   data: [1006, 84, 1090]
        // },
        // {
        //   name: '11月实际完成',
        //   data: [1091, 89, 1180]
        // },
        // {
        //   name: '上年同期',
        //   type: 'bar',
        //   data: []
        // }],
      },
      xAxisSalesRevenue: [],
      seriesSalesRevenue: [],
      xAxisSalesProfit: [],
      seriesSalesProfit: [],
      xAxisProject: [],
      seriesProject: [],
      xAxisAttendance: [],
      seriesAttendance: [],
    }
  },
  created () {
    //销售收入趋势（近12月）
    this.xAxisSalesRevenue = salesTrend.data.map(item => item.years).reverse();
    this.seriesSalesRevenue.push({
      name: '园服',
      data: salesTrend.data.map(item => item.categoryAndSalesAmountVoList[0]?.salesRevenue || 0).reverse()
    })

    //销售利润统计（近12月）
    this.xAxisSalesProfit = profitStatistics.data.map(item => item.years).reverse();
    this.seriesSalesProfit.push({
      name: '园服',
      data: profitStatistics.data.map(item => item.categoryAndSalesAmountVoList[0]?.profitAmount || 0).reverse()
    })

    //学生出勤率 循环30天
    for (let i = 0; i < 30; i++) {
      this.xAxisAttendance.push(i + 1)
    }
    //出勤率随机数
    let seriesAttendanceData = [];
    for (let i = 0; i < 30; i++) {
      //随机数80-100范围内两位小数
      seriesAttendanceData.push((Math.random() * 20 + 80).toFixed(2))



      // seriesAttendanceData.push((Math.random() * 100).toFixed(2))
    }
    this.seriesAttendance.push({
      name: '出勤率',
      data: seriesAttendanceData
    })


    //'投资额', '合同总额', '实际支付金额'
    //工程类项目汇总统计（本年）
    // contract.data.forEach(item => {
    //   this.seriesProject.push({
    //     name: '投资额',
    //     data: [item.totalCost, item.amountPayable, item.accountPaid]
    //   })
    // })
    this.xAxisProject = contract.data.map(item => item.name)
    this.seriesProject.push({
      name: '投资额',
      data: contract.data.map(item => item.totalCost)
    })
    this.seriesProject.push({
      name: '合同总额',
      data: contract.data.map(item => item.amountPayable)
    })
    this.seriesProject.push({
      name: '实际支付金额',
      data: contract.data.map(item => item.accountPaid)
    })
  },
  methods: {
    close () {
      this.viewType = -1;
      this.xAxisArea = ['荔湾区', '黄埔区', '番禺区', '白云区'];
      this.areaName = ''
      this.areaSeries = {}
    },
    backArea () {
      this.xAxisArea = this.oldxAxisArea
      this.viewArea(this.viewType, '')
      this.oldxAxisArea = ''; this.areaName = '';
    },
    viewArea (type, area) {
      const titleAry = ['月度营业收入完成情况', '累计营业收入完成情况', '月度利润总额完成情况', '累计利润总额完成情况']
      //渲染数据
      if (type != "nursery") {
        this.viewType = type;
        this.dialogTitle = titleAry[this.viewType - 1]
      }
      else
        this.areaName = area;
      if ([1, 2].includes(this.viewType))
        this.xAxisAreaList = this.xAxis;
      else
        this.xAxisAreaList = this.xAxisProfit;
      // const clone = JSON.parse(JSON.stringify(data));
      //取出区域下幼儿园名称
      const nursery = data.filter(item => item["区域"] === area).map(m => m['营业收入'])

      if (nursery.length > 0) {
        this.oldxAxisArea = this.xAxisArea
        this.xAxisArea = nursery;
      }
      this.xAxisArea.forEach(item => {
        let list = [];
        if (type != "nursery")
          list = data.filter(child => child["区域"] === item);
        else list = data.filter(child => child["区域"] === this.areaName && child["营业收入"] === item);

        let [保教_营收计划, 增值服务_营收计划, 保教_营收实际, 增值服务_营收实际] = [0, 0, 0, 0]
        //月度营业收入完成情况
        if (this.viewType == 1) {
          保教_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['保教营收计划'];
          }, 0)).toFixed(2)
          增值服务_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['增值服务计划'];
          }, 0)).toFixed(2)

          保教_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['保教营收实际'];
          }, 0)).toFixed(2)
          增值服务_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['增值服务实际'];
          }, 0)).toFixed(2)
        }
        //累计营业收入完成情况
        if (this.viewType == 2) {
          保教_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计保教计划营收'];
          }, 0)).toFixed(2)
          增值服务_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计增值服务计划营收'];
          }, 0)).toFixed(2)

          保教_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计保教营收实际'];
          }, 0)).toFixed(2)
          增值服务_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计增值服务营收实际'];
          }, 0)).toFixed(2)
        }

        //月度利润总额完成情况
        if (this.viewType == 3) {
          保教_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['保教利润计划'];
          }, 0)).toFixed(2)
          增值服务_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['增值服务利润计划'];
          }, 0)).toFixed(2)

          保教_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['保教利润实际'];
          }, 0)).toFixed(2)
          增值服务_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['增值利润实际'];
          }, 0)).toFixed(2)
        }

        //累计利润总额完成情况
        if (this.viewType == 4) {
          保教_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计保教计划利润'];
          }, 0)).toFixed(2)
          增值服务_营收计划 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计增值服务计划利润'];
          }, 0)).toFixed(2)

          保教_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计保教利润实际'];
          }, 0)).toFixed(2)
          增值服务_营收实际 = +parseFloat(list.reduce(function (prev, item) {
            return prev + item['累计增值服务利润实际'];
          }, 0)).toFixed(2)
        }

        const zero = 0;
        if (this.viewType == 1) {
          this.areaSeries[item] = [{
            name: '11月计划',
            data: [保教_营收计划, 增值服务_营收计划, parseFloat(保教_营收计划 + 增值服务_营收计划).toFixed(2)]
          },
          {
            name: '11月实际完成',
            data: [保教_营收实际, 增值服务_营收实际, parseFloat(保教_营收实际 + 增值服务_营收实际).toFixed(2)]
          }, {
            name: '上年同期',
            data: [zero, zero, zero]
          }
          ]
        }

        if (this.viewType == 2) {
          this.areaSeries[item] = [{
            name: '累计计划',
            data: [保教_营收计划, 增值服务_营收计划, parseFloat(保教_营收计划 + 增值服务_营收计划).toFixed(2)]
          },
          {
            name: '累计实际完成',
            data: [保教_营收实际, 增值服务_营收实际, parseFloat(保教_营收实际 + 增值服务_营收实际).toFixed(2)]
          }, {
            name: '上年同期',
            data: [zero, zero, zero]
          }
          ]
        }

        if (this.viewType == 3) {
          this.areaSeries[item] = [{
            name: '11月计划',
            data: [保教_营收计划, 增值服务_营收计划, zero, parseFloat(保教_营收计划 + 增值服务_营收计划).toFixed(2)]
          },
          {
            name: '11月实际完成',
            data: [保教_营收实际, 增值服务_营收实际, zero, parseFloat(保教_营收实际 + 增值服务_营收实际).toFixed(2)]
          }, {
            name: '上年同期',
            data: [zero, zero, zero, zero]
          }
          ]
        }

        if (this.viewType == 4) {
          this.areaSeries[item] = [{
            name: '累计计划',
            data: [保教_营收计划, 增值服务_营收计划, zero, parseFloat(保教_营收计划 + 增值服务_营收计划).toFixed(2)]
          },
          {
            name: '累计实际完成',
            data: [保教_营收实际, 增值服务_营收实际, zero, parseFloat(保教_营收实际 + 增值服务_营收实际).toFixed(2)]
          }, {
            name: '上年同期',
            data: [zero, zero, zero, zero]
          }
          ]
        }
      })
      this.dialogVisible = true;
    }
  }
}
</script>
<style lang="less">
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('./assets/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;

    .main-content {
      flex: 1;
      display: flex;
      margin: 10px 0px;
    }

    .block-left-content {
      flex: 3;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
    }

    .block-center-content {
      flex: 2;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      margin: 0px 15px;
    }

    .block-right-content {
      flex: 3;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;

      &-main {
        display: flex;
        flex-direction: column;
        margin: 0px 10px;
        box-sizing: content-box;

        &-item {
          margin-top: 10px;

          //小于等于1600px时，高度为100px，大于1600px时，高度为140px
          @media screen and (max-width: 1600px) {
            height: 160px;
          }

          @media screen and (min-width: 1601px) {
            height: 280px;
          }
        }
      }
    }
  }
}

#top-header {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;

  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 30px;
  }

  .header-left-decoration,
  .header-right-decoration {
    width: 25%;
    height: 60px;
  }

  .center-title {
    position: absolute;
    font-size: 30px;
    font-weight: bold;
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
  }
}

#scroll-board {
  box-sizing: border-box;
  // height: 300px;
  // overflow: hidden;
}

#map {
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 120px);
  box-sizing: border-box;
}

#target {
  // margin-top: 15px;
  display: flex;
  flex-wrap: wrap;

  // flex-direction: column;
  .target-item {
    width: calc((100% - 10px) / 2);
    margin-top: 5px;
    height: 300px;

    position: relative;
    // background-color: red;

    &-title {
      display: flex;
      justify-content: space-between;
      position: absolute;
      right: 10px;

      @media screen and (min-width: 1601px) {
        right: 0px;
      }

      z-index: 1996;
    }
  }

  .target-item:nth-child(2n) {
    margin-left: 10px;
  }
}

.el-dialog {
  background: #282c34 !important;

  .el-dialog__title {
    color: #fff;
  }

  .target-item {
    // width: 48% !important;
    height: 380px !important;
  }

  // background: url(http://192.168.2.129:8080/img/bg.3e094696.png) !important;
}

.Breadcrumb {
  line-height: 40px;
  height: 40px;
}

.dialogHeight {
  height: calc(100vh * 0.65);
  overflow-y: sroll;
  overflow-x: hidden;
}

/* 全局修改 */
::-webkit-scrollbar {
  background-color: #f5f5f5;
  width: 8px;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
}

::-webkit-scrollbar-track {
  background-color: #232323;
}
</style>
