<template>
  <div id="digital-flop">
    <div class="digital-flop-item" v-for="item in digitalFlopData" :key="item.title" @click="areaView()">
      <div class="digital-flop-title">{{ item.title }}</div>
      <div class="digital-flop">
        <dv-digital-flop :config="item.number" style="width:100px;height:50px;" />
        <div class="unit">{{ item.unit }}</div>
      </div>
    </div>

    <dv-decoration-10 />

    <el-dialog :destroy-on-close="true" :visible.sync="dialogVisible" width="60%" :append-to-body="true" @close="close">
      <div class="Breadcrumb">
        <el-link type="primary" :underline="false" :disabled="!areaName || curOrgModel.orgLevel != 0"
          @click="backArea">区域</el-link>
        <span v-if="areaName" style="padding:0px 6px;">/</span>
        <el-link :underline="false" type="info" disabled v-if="areaName">{{ areaName }}</el-link>
        <el-link type="primary" v-if="areaName && curOrgModel.orgLevel == 0" style="margin-left:10px" :underline="false"
          @click="backArea">返回上一层级</el-link>
      </div>
      <dv-scroll-board v-if="!areaName && dialogVisible" :config="configScroll" @click="rowClick" style="height:400px;" />
      <dv-scroll-board v-if="areaName && dialogVisible" :config="configScrollChild" style="height:400px;" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DigitalFlop',
  props: {
    resultData: [],
    groupData: {},
    curOrgModel: {},
  },
  data () {
    return {
      digitalFlopData: [],
      dialogVisible: false,
      areaName: '',
      configScroll: {
        header: ['师生比', '区域名称', '幼儿园（个）', '教职员工（人）', '在校学生（人）'],
        data: [],
        index: false,
        // columnWidth: [80, 140, 160, 160, 160],
        align: ['center'],
        rowNum: 7,
        headerBGC: '#1981f6',
        headerHeight: 35,
        waitTime: 99999999,
        carousel: ['page'],
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)',
      },
      configScrollChild: {
        header: ['师生比', '幼儿园名称', '教职员工（人）', '在校学生（人）'],
        data: [],
        index: false,
        // columnWidth: [80, 300, 160, 160],
        align: ['center'],
        rowNum: 7,
        headerBGC: '#1981f6',
        headerHeight: 35,
        waitTime: 99999999,
        carousel: ['page'],
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)',
      },
    }
  },
  watch: {
    groupData: {
      handler () {
        this.createData()
      },
      deep: true
    }
  },
  methods: {
    close () {
      this.configScroll.data = [];
      this.configScrollChild.data = [];
      this.areaName = ''
    },
    backArea () {
      this.configScrollChild.data = [];
      this.areaName = ''
    },
    rowClick (parms) {
      this.configScrollChild.data = [];
      this.$nextTick(() => {
        // 判断查询哪个区域
        this.areaName = parms.row[1];
        const area = this.resultData.find(item => item.orgName == parms.row[1])
        if (area) {
          //找到区域下数据
          const areaChild = this.resultData.filter(item => item.parentOrgCode == area.orgCode)
          //循环添加区域下数据
          areaChild.forEach(item => {
            this.configScrollChild.data.push([`${(item.teacherStudentRatio * 100).toFixed(2)}%`, item.orgName, item.teacherNum, item.studentNum])
          })
        }
      })
    },
    //区域查看
    areaView () {
      console.log(`curOrgModel`, this.curOrgModel)
      this.configScroll.data = [];
      this.configScrollChild.data = [];
      this.areaName = ''
      //最后一层不可查看
      if (this.curOrgModel.orgLevel == 2)
        return;
      else if (this.curOrgModel.orgLevel == 1) {
        this.areaName = this.curOrgModel.orgName
        this.rowClick({ row: [0, this.curOrgModel.orgName] })
      }
      else {
        //获取区域数据
        const arealist = this.resultData.filter(item => item.parentOrgCode == this.curOrgModel.orgCode)

        //循环添加区域数据
        arealist.forEach(item => {
          this.configScroll.data.push([`${(item.teacherStudentRatio * 100).toFixed(2)}%`, item.orgName, item.schoolNum, item.teacherNum, item.studentNum])
        })
      }

      this.dialogVisible = true;
    },
    createData () {
      //集团层数据
      // const group = this.resultData.find(item => item.orgCode == '398250825007173') || {}
      this.digitalFlopData = [
        {
          title: '幼儿园（个）',
          number: {
            number: [this.groupData.schoolNum || 0],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: ''
        },
        {
          title: '教职员工（人）',
          number: {
            number: [this.groupData.teacherNum || 0],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: ''
        },
        {
          title: '在校学生（人）',
          number: {
            number: [this.groupData.studentNum || 0],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: ''
        },
        {
          title: '师生比',
          number: {
            number: [(this.groupData.teacherStudentRatio * 100) || 0],
            content: '{nt}',
            toFixed: 2,
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '%'
        }
      ]
    },
  },
  mounted () {
    const { createData } = this
    createData()
    // setInterval(createData, 30000)
  },
}
</script>

<style scoped lang="less">
:deep(.el-dialog) {
  background: #282c34 !important;
  // background: url(http://192.168.2.129:8080/img/bg.3e094696.png) !important;
}
</style>
