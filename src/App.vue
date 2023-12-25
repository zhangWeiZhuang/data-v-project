<template>
  <div id="app">
    <div id="data-view">
      <dv-full-screen-container>
        <div id="top-header">
          <dv-decoration-8 class="header-left-decoration"></dv-decoration-8>
          <dv-decoration-5 class="header-center-decoration" />
          <dv-decoration-8 class="header-right-decoration" :reverse="true" />
          <div class="center-title">
            智慧幼教-数据大屏
          </div>
        </div>
        <div class="main-content">
          <div class="block-left-content">
            <div id="scroll-board">
              <digital-flop />
            </div>
            <dv-border-box-8 :reverse="true" style="margin-top:15px;;box-sizing: content-box;">
              <div id="target" style="padding:10px">
                <div :key="target" v-for="target in targetItem" class="target-item">
                  <div class="target-item-title">
                    <el-select class="popper-class" v-model="target.yearMonth" size="mini" placeholder="请选择">
                      <el-option v-for="item in yearMonthList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <yysr :xAxis="target.xAxis" :series="target.curIncome" :title="target.title"
                    @click="viewArea(target.name)"></yysr>
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
          <div class="target-item" :key="area" v-for="area in xAxisArea">
            <!-- 月度营业收入完成情况 -->
            <div class="target-item-title">
              <el-select class="popper-class" size="mini" placeholder="请选择">
                <el-option v-for="item in yearMonthList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
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
import targetItemList from "./json/targetItem.json"
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
      yearMonthList: [],
      targetItem: targetItemList.list,
      dialogVisible: false,
    }
  },
  created () {
    //当前年
    const year = new Date().getFullYear();

    //一年12月
    for (let i = 0; i < 12; i++) {
      this.yearMonthList.push(
        {
          value: `${year}${(i + 1).toString().padStart(2, 0)}`,
          label: `${year}年${(i + 1).toString().padStart(2, 0)}月`
        })
    }
    console.log(this.targetItem)
    //默认当前月
    this.targetItem.forEach(item => {
      item.yearMonth = `${year}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`
    })
  },
  methods: {
    close () {
      this.dialogVisible = false;
    },
    backArea () {

    },
    viewArea () {
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
      // margin: 10px 0px;
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
  display: flex;
  flex-wrap: wrap;

  .target-item {
    width: calc((100% - 10px) / 2);
    margin-top: 5px;
    height: 300px;

    position: relative;

    &-title {
      display: flex;
      justify-content: space-between;
      position: absolute;
      right: 10px;

      @media screen and (min-width: 1601px) {
        right: 0px;
      }

      z-index: 1996;
      width:100px;
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


//下拉框样式

.el-scrollbar {
  background: #232323 !important;
  border-color: #232323;
}

.el-popper[x-placement^=bottom] .popper__arrow::after,
.el-popper[x-placement^=bottom] .popper__arrow {
  border-bottom-color: #232323 !important;
}

.el-select-dropdown {
  border-color: #232323 !important;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #58585E !important;
  color: #FFF !important;
}

// .el-select-dropdown__item {
// color: #C8C8C9;
// padding: 0 10px !important;
// }

@select-border-color: #51d6a9;

.el-select-dropdown__item {
  color: #fff;
  padding: 0 10px !important;
  font-size: 12px !important;
  height: 30px !important;
  line-height: 30px !important;
}

.el-select:hover .el-input__inner {
  border-color: @select-border-color !important;
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: @select-border-color !important;
}

.el-select .el-input__inner:focus {
  border-color: @select-border-color !important;
}

.el-scrollbar__wrap {
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}

.el-select-dropdown__item.selected {
  color: @select-border-color !important;
}

.popper-class {
  .el-input__inner {
    padding: 0px 5px !important;
  }

  .el-input--suffix .el-input__inner {
    background: #232323 !important;
    border-color: #232323;
    color: #FFF !important;
  }
}
</style>
