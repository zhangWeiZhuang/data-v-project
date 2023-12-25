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
  </div>
</template>

<script>
export default {
  name: 'DigitalFlop',
  data () {
    return {
      digitalFlopData: [],
    }
  },
  methods: {
    createData () {
      this.digitalFlopData = [
        {
          title: '签到（人）',
          number: {
            number: [7920],
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
          title: '请假（人）',
          number: {
            number: [1112],
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
          title: '学生喂药（人）',
          number: {
            number: [144],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
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
    width: 32%;

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
