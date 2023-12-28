<template>
  <div id="digital-flop">
    <div class="digital-flop-item digital-flop-item-school" v-for="item in digitalFlopData" :key="item.title">
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
  props: {
    sourceData: {},
  },
  data () {
    return {
      digitalFlopData: [],
    }
  },
  watch: {
    sourceData: {
      handler () {
        this.digitalFlopData = []
        console.log(`sourceData`)
        this.createData()
      },
      deep: true
    }
  },
  methods: {
    createData () {
      this.digitalFlopData = [
        {
          title: '签到（人）',
          number: {
            number: [this.sourceData.signNum || 0],
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
            number: [this.sourceData.leaveNum || 0],
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
            number: [this.sourceData.feedMedicineNum || 0],
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

    // setInterval(createData, 30000)
  },
}
</script>
