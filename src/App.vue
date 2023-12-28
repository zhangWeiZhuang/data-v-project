<template>
  <div id="app">
    <div id="data-view">
      <dv-full-screen-container>
        <div id="top-header">
          <dv-decoration-8 class="header-left-decoration"></dv-decoration-8>
          <dv-decoration-5 class="header-center-decoration" />
          <dv-decoration-8 class="header-right-decoration" :reverse="true" />
          <div class="center-title">
            <el-select class="custom-select" v-model="curOrgModel.orgCode" @change="(val) => { areaChangeHandle(val) }">
              <el-option :key="item.orgCode" v-for="item in orgData" :label="item.orgName"
                :value="item.orgCode"></el-option>
            </el-select>
          </div>
          <div class="center-subtitle">
            智慧幼教-数据大屏
          </div>
          <div class="top-nav-right">
            <div class="text-white">{{ dayInfo.city }}</div>
            <div class="text-white">
              <i v-if="dayInfo.weather == '晴'" class="el-icon-sunny"></i>
            </div>
            <div class="text-green">{{ dayInfo.weather }}</div>
            <div class="text-green">{{ dayInfo.temperature }}</div>
            <div class="text-green">{{ dayInfo.date }}</div>
            <div class="text-green">{{ dayInfo.week }}</div>
            <div class="text-shiny">{{ dayInfo.time }}</div>
          </div>
        </div>
        <div class="main-content">
          <div class="block-left-content">
            <!-- <dv-border-box-1 :reverse="true"> -->
            <digital-flop :resultData="resultData" :groupData="basicModel" />
            <!-- </dv-border-box-1> -->
            <dv-border-box-8 :reverse="true" style="margin-top:10px;box-sizing: content-box;">
              <div id="target" style="padding:10px">
                <div :key="target.value" v-for="target in targetItem" class="target-item">
                  <div class="target-item-title">
                    <el-select class="popper-class" v-model="target.yearMonth" size="mini" placeholder="请选择"
                      @change="(val) => yearMonthHandle(val, target.value)">
                      <el-option v-for="item in yearMonthList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <yysr :xAxis="target.xAxis" :series="target.series" :title="target.title">
                  </yysr>
                </div>
              </div>
            </dv-border-box-8>
          </div>
          <div class="block-center-content">
            <div id="map">
              <!-- 广州地图 -->
              <dv-border-box-10>
                <Map :orgData="orgData" @mapClick="mapClick" />
              </dv-border-box-10>
            </div>
          </div>
          <div class="block-right-content">
            <school :sourceData="showLifeData" />
            <dv-border-box-8 style="margin-top:10px;box-sizing: content-box;">
              <div class="block-right-content-main">
                <div class="block-right-content-main-item">
                  <div class="target-item-title">
                    <el-select class="popper-class" size="mini" v-model="yearMonthAttendance" placeholder="请选择"
                      @change="() => yearMonthAttendanceHandle()">
                      <el-option v-for="item in yearMonthList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>

                  <lineCharts v-if="xAxisAttendance" :xAxis="xAxisAttendance" :series="seriesAttendance"
                    :title="titleAttendance" />
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
          <div class="target-item" :key="target.orgCode" v-for="target in xAxisAreaList">
            <div class="target-item-title">
              <el-select class="popper-class" v-model="target.yearMonth" size="mini" placeholder="请选择"
                @change="(val) => yearMonthHandleArea(val, target.orgCode)">
                <el-option v-for="item in yearMonthList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <yysr :xAxis="target.xAxis" :series="target.series" :title="target.title">
            </yysr>
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
import { login, org, basic, businessData, lifeDataMonth, lifeDataDay, valueAddedData, weather, valueaddeddataproj } from './api/demo'
import _ from 'lodash';
import dayjs from 'dayjs'
export default {
  name: 'App',
  components: {
    Map,
    yysr,
    lineCharts,
    // eslint-disable-next-line vue/no-unused-components
    digitalFlop,
    school
  },
  data () {
    return {
      targetItem: [
        {
          title: "月度营业收入完成情况",
          value: "month_income",
          yearMonth: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`,
          series: [],
          xAxis: [],
          orgCode: ''
        },
        {
          title: "累计营业收入完成情况",
          value: "ytd_month_income",
          yearMonth: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`,
          series: [],
          xAxis: [],
          orgCode: ''
        },
        {
          title: "月度利润总额完成情况",
          value: "month_profit",
          yearMonth: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`,
          series: [],
          xAxis: [],
          orgCode: ''
        },
        {
          title: "累计利润总额完成情况",
          value: "ytd_month_profit",
          yearMonth: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`,
          series: [],
          xAxis: [],
          orgCode: ''
        }
      ],
      isLogin: false,
      yearMonthList: [],
      dialogVisible: false,
      dialogTitle: '',
      xAxisAreaList: [],
      xAxisAreaListOld: [],
      orgData: [],
      resultData: [],
      basicModel: {},
      areaName: '',
      areaOrgCode: '',
      lifeData: [],
      lifeDayData: [],
      showLifeData: {},
      valueAddedData: [],
      xAxisAttendance: [],
      seriesAttendance: [],
      titleAttendance: '',
      curYearMonth: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, 0)}`,
      yearMonthAttendance: '',
      xAxisSalesRevenue: [],
      seriesSalesRevenue: [],
      xAxisSalesProfit: [],
      seriesSalesProfit: [],
      xAxisProject: [],
      seriesProject: [],
      curOrgCode: '398250825007173',
      curOrgModel: {
        orgCode: '398250825007173',
        orgLevel: 0,
        orgName: '广州工控健康教育投资有限公司'
      },
      isopen: false,
      projectData: [],
      dayInfo: {
        city: '广州',
        date: '',
        week: '',
        time: '',
        weather: '',
        temperature: '',//18℃
      },
      monthList: []
    }
  },
  created () {
    this.dayInfo.date = dayjs().format("YYYY.MM.DD");
    this.dayInfo.time = dayjs().format("HH:mm:ss");
    setInterval(() => {
      this.dayInfo.time = dayjs().format("HH:mm:ss");
    }, 1000)

    if (!sessionStorage.getItem("dayInfo"))
      sessionStorage.setItem("dayInfo", JSON.stringify(this.dayInfo))
    else {
      //是否当天
      if (JSON.parse(sessionStorage.getItem("dayInfo")).date != this.dayInfo.date) {
        sessionStorage.removeItem("realtime")
        sessionStorage.removeItem("token")
        sessionStorage.setItem("dayInfo", JSON.stringify(this.dayInfo))
      }
    }
    const dayOfWeek = dayjs().format('dddd');
    const weekdayChinese = {
      Sunday: "星期日",
      Monday: "星期一",
      Tuesday: "星期二",
      Wednesday: "星期三",
      Thursday: "星期四",
      Friday: "星期五",
      Saturday: "星期六"
    };
    this.dayInfo.week = weekdayChinese[dayOfWeek]
    this.dayInfo.weather = `晴`
    this.dayInfo.temperature = `23℃`
    //判断是否有缓存
    if (!sessionStorage.getItem("realtime")) {
      weather('广州').then(res => {
        if (res.error_code == 0) {
          sessionStorage.setItem("realtime", JSON.stringify(res.result.realtime))
          this.dayInfo.weather = res.result.realtime.info
          this.dayInfo.temperature = `${res.result.realtime.temperature}℃`
        }
      })
    } else {
      this.dayInfo.weather = JSON.parse(sessionStorage.getItem("realtime")).info
      this.dayInfo.temperature = `${JSON.parse(sessionStorage.getItem("realtime")).temperature}℃`
    }

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
    //12月数组
    const monthAry = [];
    for (let i = 0; i < 12; i++) {
      monthAry.push(`${new Date().getFullYear()}${(i + 1).toString().padStart(2, 0)}`)
    }
    this.xAxisSalesRevenue = monthAry;
    this.xAxisSalesProfit = monthAry;
    this.monthList = monthAry

    this.yearMonthAttendance = this.curYearMonth;
    //判断是否存在token
    if (!sessionStorage.getItem("token")) {
      //模拟登录
      login({
        "username": "超级管理员",
        "password": "123456",
      }).then(res => {
        if (res.code == "200") {
          //记录token
          sessionStorage.setItem("token", res.token)
          this.isLogin = true;
          Promise.all([this.initOrg(),
          this.initBasic(),
          this.initValueAddedData(),
          this.initValueaddeddataproj(),
          this.initBusinessData(),
          //this.initLifeDataMonth(),
          this.initLifeDataDay()
          ]).then(() => {
            this.refresh()
          })

        } else
          this.$message.error(res.msg)
      })
    } else {
      this.isLogin = true;
      Promise.all([this.initOrg(),
      this.initBasic(),
      this.initValueAddedData(),
      this.initValueaddeddataproj(),
      this.initBusinessData(),
      //this.initLifeDataMonth(),
      this.initLifeDataDay()
      ]).then(() => {
        this.refresh()
      })
    }
  },
  methods: {
    initOrg () {
      //获取组织
      return new Promise((resolve) => {
        org().then(res => {
          if (res.code == 200)
            this.orgData = res.data;
          resolve();
        })
      })
    },
    initBasic () {
      //基础信息
      return new Promise((resolve) => {
        basic().then(res => {
          if (res.code == 200)
            this.resultData = res.data
          resolve();
        })
      })
    },
    initValueAddedData () {
      return new Promise((resolve) => {
        //增值服务信息
        valueAddedData(this.curYearMonth).then(res => {
          if (res.code == 200)
            this.valueAddedData = res.data;
          resolve();
        })
      })
    },
    initValueaddeddataproj () {
      //项目
      return new Promise((resolve) => {
        valueaddeddataproj(new Date().getFullYear()).then(res => {
          if (res.code == 200)
            this.projectData = res.data;
          resolve();
        })
      })
    },
    initLifeDataMonth () {
      //幼儿园日常信息-月
      return new Promise((resolve) => {
        lifeDataMonth(this.yearMonthAttendance).then(res => {
          if (res.code == 200)
            this.lifeData = res.data
          resolve();
        })
      })
    },
    initLifeDataDay () {
      //幼儿园日常信息-天
      return new Promise((resolve) => {
        lifeDataDay(this.yearMonthAttendance).then(res => {
          if (res.code == 200)
            this.lifeDayData = res.data
          resolve();
        })
      })
    },
    initBusinessData () {
      return new Promise((resolve) => {
        businessData(this.curYearMonth).then(res => {
          if (res.code == 200) {
            this.targetItem.forEach(target => {
              target.businessData = res.data;
            });
            resolve();
          }
        })
      });
    },
    //刷新数据
    refresh () {
      console.log(`刷新数据`, this.resultData)
      //基础信息
      this.basicModel = this.resultData.find(item => item.orgCode == this.curOrgCode) || {}

      //经营数据
      this.targetItem.forEach(target => {
        target.orgCode = this.curOrgCode;
        const { series, xAxis } = this.renderEcharts({ target });
        target.series = series;
        target.xAxis = xAxis;
      });
      if (this.lifeData.length > 0)
        //学生签到信息
        this.showLifeData = this.lifeData.find(item => item.orgCode == this.curOrgCode) || {}

      //学生出勤率
      this.titleAttendance = `学生出勤统计（${this.yearMonthAttendance.substring(4, 6)}月）`
      const list = this.lifeDayData.filter(item => item.orgCode == this.curOrgCode)
      let seriesAttendanceData = [];
      //平均出勤率
      let avgAttendanceData = [];

      //根据当前月份获取天数
      const days = new Date(this.yearMonthAttendance.substring(0, 4), this.yearMonthAttendance.substring(4, 6), 0).getDate();
      for (let i = 0; i < days; i++) {
        this.xAxisAttendance.push(`${(i + 1).toString().padStart(2, 0)}`)
      }

      list.forEach(item => {
        seriesAttendanceData.push((item.attendRate * 100).toFixed(2))
        avgAttendanceData.push((this.showLifeData.attendRate * 100).toFixed(2) || 0)
      })
      this.seriesAttendance.push({
        name: '出勤率',
        data: seriesAttendanceData
      })
      this.seriesAttendance.push({
        name: '平均出勤率',
        data: avgAttendanceData
      })

      //获取分类并去重
      const categoryList = _.uniq(this.valueAddedData.map(item => item.prodCategory));
      //销售收入
      this.seriesSalesRevenue = [];
      categoryList.forEach(category => {
        let seriesSalesRevenueTmp = [];
        this.monthList.forEach(month => {
          const item = this.valueAddedData.find(item => item.orgCode == this.curOrgCode && item.calendarMonth == month && item.prodCategory == category) || {};
          seriesSalesRevenueTmp.push(item.incomeVal || 0)
        })
        this.seriesSalesRevenue.push({
          name: category,
          data: seriesSalesRevenueTmp
        })
      });

      //销售利润
      this.seriesSalesProfit = [];
      categoryList.forEach(category => {
        let seriesSalesProfitTmp = [];
        this.monthList.forEach(month => {
          const item = this.valueAddedData.find(item => item.orgCode == this.curOrgCode && item.calendarMonth == month && item.prodCategory == category) || {};
          seriesSalesProfitTmp.push(item.profitVal || 0)
        })
        this.seriesSalesProfit.push({
          name: category,
          data: seriesSalesProfitTmp
        })
      });

      //工程
      this.seriesProject = [];
      this.xAxisProject = this.projectData.filter(item => item.orgCode == this.curOrgCode).map(item => item.project)
      let 投资额_DATA = [];
      let 合同总额_DATA = [];
      let 实际支付金额_DATA = [];
      this.xAxisProject.forEach(pro => {
        const contract = this.projectData.find(item => item.orgCode == this.curOrgCode && item.project == pro) || {}
        投资额_DATA.push(contract.projInvestVal || 0)
        合同总额_DATA.push(contract.projContractVal || 0)
        实际支付金额_DATA.push(contract.projActPayVal || 0)
      })

      this.seriesProject.push({
        name: '投资额',
        data: 投资额_DATA
      })
      this.seriesProject.push({
        name: '合同总额',
        data: 合同总额_DATA
      })
      this.seriesProject.push({
        name: '实际支付金额',
        data: 实际支付金额_DATA
      })
    },
    areaChangeHandle (val) {
      //找org数据
      const model = this.orgData.find(item => item.orgCode == val);
      if (model) {
        this.curOrgCode = model;
        this.mapClick(model);
      }
    },
    mapClick (target) {
      this.curOrgModel = target;
      this.curOrgCode = target.orgCode;
      this.refresh();
    },
    yearMonthHandle (yearMonth, type) {
      let target = this.targetItem.find(item => item.value == type);
      businessData(target.yearMonth).then(res => {
        if (res.code == 200) {
          target.businessData = res.data;
          const { series, xAxis } = this.renderEcharts({ target });
          target.series = series;
          target.xAxis = xAxis;
        }
      });
    },
    yearMonthAttendanceHandle () {
      this.initLifeDataDay();
    },
    renderEcharts (datas) {
      let [series, xAxis] = [[], []];
      const { target } = datas
      const 学前教育_DATA = target.businessData.find(item => item.orgCode == target.orgCode && item.category == '学前教育') || {}
      const 公司本部_DATA = target.businessData.find(item => item.orgCode == target.orgCode && item.category == '公司本部') || {}
      const 增值服务_DATA = target.businessData.find(item => item.orgCode == target.orgCode && item.category == '增值服务') || {}
      const 合计_DATA = target.businessData.find(item => item.orgCode == target.orgCode && item.category == '全部') || {}
      switch (target.value) {
        case "month_income": //月度营业收入完成情况
          xAxis = ['学前教育业务', '增值服务', '合计'];
          series = [
            {
              name: `${target.yearMonth.substring(4, 6)}月计划`,
              data: [学前教育_DATA.monthPlanIncomeVal || 0, 增值服务_DATA.monthPlanIncomeVal || 0, 合计_DATA.monthPlanIncomeVal || 0]
            },
            {
              name: `${target.yearMonth.substring(4, 6)}月实际完成`,
              data: [学前教育_DATA.monthActIncomeVal || 0, 增值服务_DATA.monthActIncomeVal || 0, 合计_DATA.monthActIncomeVal || 0]
            },
            {
              name: '上年同期',
              type: 'bar',
              data: [学前教育_DATA.monthActIncomeValLst || 0, 增值服务_DATA.monthActIncomeValLst || 0, 合计_DATA.monthActIncomeValLst || 0]
            }
          ]
          break;
        case "ytd_month_income": //累计营业收入完成情况
          xAxis = ['学前教育业务', '增值服务', '合计'];
          series = [
            {
              name: `累计计划`,
              data: [学前教育_DATA.ytdPlanIncomeVal || 0, 增值服务_DATA.ytdPlanIncomeVal || 0, 合计_DATA.ytdPlanIncomeVal || 0]
            },
            {
              name: `累计实际完成`,
              data: [学前教育_DATA.ytdActIncomeVal || 0, 增值服务_DATA.ytdActIncomeVal || 0, 合计_DATA.ytdActIncomeVal || 0]
            },
            {
              name: '上年同期',
              type: 'bar',
              data: [学前教育_DATA.ytdActIncomeValLst || 0, 增值服务_DATA.ytdActIncomeValLst || 0, 合计_DATA.ytdActIncomeValLst || 0]
            }
          ]
          break;
        case "month_profit": //月度利润总额完成情况
          xAxis = ['学前教育业务', '增值服务', '公司本部', '合计'];
          series = [
            {
              name: `${target.yearMonth.substring(4, 6)}月计划`,
              data: [学前教育_DATA.monthPlanProfitVal || 0, 增值服务_DATA.monthPlanProfitVal || 0, 0, 合计_DATA.monthPlanProfitVal || 0]
            },
            {
              name: `${target.yearMonth.substring(4, 6)}月实际完成`,
              data: [学前教育_DATA.monthActProfitVal || 0, 增值服务_DATA.monthActProfitVal || 0, 0, 合计_DATA.monthActProfitVal || 0]
            },
            {
              name: '上年同期',
              type: 'bar',
              data: [学前教育_DATA.monthActProfitValLst || 0, 增值服务_DATA.monthActProfitValLst || 0, 0, 合计_DATA.monthActProfitValLst || 0]
            }
          ]
          break;
        case "ytd_month_profit": //累计利润总额完成情况
          xAxis = ['学前教育业务', '增值服务', '公司本部', '合计'];
          series = [
            {
              name: `累计计划`,
              data: [学前教育_DATA.ytdPlanProfitVal || 0, 增值服务_DATA.ytdPlanProfitVal || 0, 公司本部_DATA.ytdPlanProfitVal || 0, 合计_DATA.ytdPlanProfitVal || 0]
            },
            {
              name: `累计实际完成`,
              data: [学前教育_DATA.ytdActProfitVal || 0, 增值服务_DATA.ytdActProfitVal || 0, 公司本部_DATA.ytdActProfitVal || 0, 合计_DATA.ytdActProfitVal || 0]
            },
            {
              name: '上年同期',
              type: 'bar',
              data: [学前教育_DATA.ytdActProfitValLst || 0, 增值服务_DATA.ytdActProfitValLst || 0, 公司本部_DATA.ytdActProfitValLst || 0, 合计_DATA.ytdActProfitValLst || 0]
            }
          ]
          break;
      }
      return { series, xAxis };
    },
    close () {
      this.dialogTitle = '';
      this.xAxisAreaListOld = [];
      this.xAxisAreaList = [];
      this.areaName = '';
      this.dialogVisible = false;
    },
    backArea () {
      this.areaName = '';
      this.xAxisAreaList = _.cloneDeep(this.xAxisAreaListOld);
    },
    viewArea (source, type) {
      //到顶
      if (type == 'school' && source.orgLevel == 2)
        return;

      if (type == 'area')
        this.dialogTitle = source.title;

      if (type == 'school') {
        this.areaName = source.title;
        this.xAxisAreaListOld = _.cloneDeep(this.xAxisAreaList);
      }
      //获取下层级
      this.xAxisAreaList = source.businessData.filter(item => item.parentOrgCode == source.orgCode && item.category == "全部");
      this.xAxisAreaList.forEach(target => {
        target.businessData = source.businessData
        target.yearMonth = source.yearMonth
        target.value = source.value
        target.title = target.orgName
        const { series, xAxis } = this.renderEcharts({ target });
        target.series = series;
        target.xAxis = xAxis;
      })
      this.dialogVisible = true;
    },
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
          // @media screen and (max-width: 1600px) {
          //   height: 160px;
          // }

          // @media screen and (min-width: 1601px) {
          //   height: 200px;
          // }

          .target-item-title {
            display: flex;
            justify-content: space-between;
            position: absolute;
            right: 10px;
            z-index: 1996;
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
    font-weight: bold;
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
    display: flex;

    .el-input__inner {
      border: none;
      background: transparent;
      text-align: center;
      color: #FFF;
      font-weight: bold;
    }


    // @media screen and (max-width: 1600px) {
    //   .custom-select {
    //     width: 300px;
    //   }
    // }

    // @media screen and (min-width: 1601px) {
    //   .custom-select {
    //     width: 460px;
    //   }
    // }
  }

  .center-subtitle {
    position: absolute;
    font-weight: bold;

    // @media screen and (max-width: 1600px) {
    //   left: 20%;
    // }

    // @media screen and (min-width: 1601px) {
    //   left: 13%;
    // }

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
  // height: calc(100vh - 160px);
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


.top-nav-left__selector {
  background: #1a7f66;
  border-radius: 0.2777777778vw;
  width: 1.2147569444vw;
  height: 1.2152777778vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}


.refreshIcon {
  transition: all .35s ease-in-out;
}

.selector-icon {
  transform: rotate(90deg);
}

.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 0vw;
  transition: all .5s ease-in-out;
  z-index: 9999;
  overflow: hidden;

  .selector-box {
    width: 480px;
    height: 300px;
    position: absolute;
    top: 3.75vw;
    left: 33.9409722222vw;
    transition: all .4s ease-in-out;
    background: #232323;
    border: 1px solid #232323;
    border-radius: 6px;
    overflow: auto;
  }

  .selector-box-item {
    font-family: PingFangSC;
    font-size: 16px;
    color: #fff;
    padding: 10px 20px;
    cursor: pointer;
  }

}

.mask-layer-height {
  height: 56.25vw;
}

.top-nav-right {
  position: absolute;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.0416666667vw;
  font-size: 1vw;

  .text-white {
    color: #ffffffde;
    text-shadow: 0px 0px 13px rgba(27, 126, 242, .91);
  }

  .text-green {
    color: #a6faff;
  }

  .text-shiny {
    color: #ffffffde;
    text-shadow: 0px 0px 13px #00ffb2;
  }
}
</style>
