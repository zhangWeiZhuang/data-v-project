<template>
  <div id="digital-flop">
    <div class="digital-flop-item" v-for="item in digitalFlopData" :key="item.title" @click="dialogVisible = true">
      <div class="digital-flop-title">{{ item.title }}</div>
      <div class="digital-flop">
        <dv-digital-flop :config="item.number" style="width:100px;height:50px;" />
        <div class="unit">{{ item.unit }}</div>
      </div>
    </div>

    <dv-decoration-10 />

    <el-dialog :destroy-on-close="true" :visible.sync="dialogVisible" width="60%" :append-to-body="true" @close="close">
      <div class="Breadcrumb">
        <el-link type="primary" :underline="false" :disabled="!areaName" @click="backArea">区域</el-link>
        <span v-if="areaName" style="padding:0px 6px;">/</span>
        <el-link :underline="false" type="info" disabled v-if="areaName">{{ areaName }}</el-link>
        <el-link type="primary" v-if="areaName" style="margin-left:10px" :underline="false"
          @click="backArea">返回上一层级</el-link>
      </div>
      <dv-scroll-board v-if="!areaName" :config="configScroll" @click="rowClick" style="height:400px;" />
      <dv-scroll-board v-if="areaName" :config="configScrollChild" style="height:400px;" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DigitalFlop',
  data () {
    return {
      digitalFlopData: [],
      dialogVisible: false,
      configScroll: {
        header: ['师生比', '区域名称', '幼儿园（个）', '教职员工（人）', '在校学生（人）'],
        data: [['17.81%', '荔湾区', 3, '132', '741'],
        ['14.16%', '黄埔区', 6, '403', '2845',],
        ['13.65%', '番禺区', 8, '430', '3150'],
        ['12.41%', '白云区', 5, '147', '1184']],
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
      areaName: '',
      arealist: {
        '荔湾区': [
          ['53.84%', '宝学士托育中心', '7', '13',],
          ['24.77%', '广钢实验幼儿园', '28', '113'],
          ['15.77%', '广钢幼儿园', '97', '615']
        ],

        '黄埔区': [
          ['17.43%', '广钢科城山庄幼儿园', '72', '413',],
          ['15.34%', '广钢中新第一幼儿园', '54', '352'],
          ['13.67%', '广钢和苑幼儿园', '90', '658'],
          ['13.51%', '广钢和苑第二幼儿园', '63', '466'],
          ['12.91%', '广钢华标幼儿园', '55', '426'],
          ['12.26%', '广钢雍景湾幼儿园', '69', '530',]
        ],

        '番禺区': [
          ['22.05%', '华工广钢幼儿园', '15', '68'],
          ['17.16%', '广钢倚莲半岛幼儿园', '23', '134'],
          ['14.71%', '广钢利联花园幼儿园', '54', '367'],
          ['14.62%', '广钢利凯花园幼儿园', '31', '212'],
          ['13.96%', '洛浦街广钢幼儿园', '69', '494'],
          ['13.05%', '广钢亚运城幼儿园', '74', '567'],
          ['12.57%', '广钢亚运城第二幼儿园', '89', '708'],
          ['12.50%', '广钢亚运城第三幼儿园', '75', '600'],
        ],
        '白云区': [
          ['13.38%', '广钢南湖幼儿园', '34', '254'],
          ['13.17%', '广钢瑞晖幼儿园', '27', '205'],
          ['12.69%', '广钢竹韵幼儿园', '24', '189'],
          ['12.13%', '广钢新市元邦幼儿园', '33', '272'],
          ['10.98%', '广钢新市幼儿园', '29', '264'],
        ],
      }
    }
  },
  methods: {
    close () {
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
        console.log(parms)//
        // 判断查询哪个区域
        this.areaName = parms.row[1];
        console.log(`this.arealist[this.areaName]`, this.arealist[this.areaName])
        this.configScrollChild.data = this.arealist[this.areaName]
      })
    },
    //区域查看
    areaView () {
      this.$router.push('/area')
    },
    createData () {
      this.digitalFlopData = [
        {
          title: '幼儿园（个）',
          number: {
            number: [22],
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
            number: [1112],
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
            number: [7920],
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
            number: [14.04],
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

    setInterval(createData, 30000)
  },
}
</script>

<style scoped lang="less">
#digital-flop {
  position: relative;
  // height: 15%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(6, 30, 93, 0.5);
  flex-wrap: wrap;

  .dv-decoration-10 {
    position: absolute;
    width: 95%;
    left: 2.5%;
    height: 5px;
    bottom: 0px;
  }

  .digital-flop-item {
    width: 23%;

    //小于等于1600px时，高度为100px，大于1600px时，高度为140px
    @media screen and (max-width: 1600px) {
      height: 100px;
    }

    @media screen and (min-width: 1601px) {
      height: 140px;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 3px solid #061e5d;
    border-right: 3px solid #061e5d;
    cursor: pointer;
  }

  .digital-flop-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .digital-flop {
    display: flex;
  }

  .unit {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 13px;
  }
}

.row-item {
  height: 40px !important;
  line-height: 40px !important;
}

.el-dialog {
  background: #282c34 !important;
  // background: url(http://192.168.2.129:8080/img/bg.3e094696.png) !important;
}

.Breadcrumb {
  line-height: 40px;
  height: 40px;

  // span {
  //   color: #fff !important;
  // }

  // .el-link.el-link--default {
  //   color: #fff !important;
  // }
}
</style>
