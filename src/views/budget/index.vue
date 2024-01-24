<template>
  <div>
    <el-card shadow="hover" class="mb-10">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="预算类型" prop="userName">
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度" prop="userName">
          <el-date-picker v-model="value3" type="year" size="small" value-format="yyyy" placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSerach" size="small">查询</el-button>
          <el-button icon="el-icon-upload2" @click="handleUpload" size="small">导入</el-button>
          <el-button icon="el-icon-download" size="small">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover">
      <el-table v-loading="loading" :data="sourceData" size="small" class="mb-10">
        <el-table-column label="年月" prop="yearMonth" />
        <el-table-column label="园所名称" prop="nameOfThePark" />
        <el-table-column label="业务类别" prop="businessCategory" />
        <el-table-column label="计划金额" prop="plannedAmount" />
      </el-table>
      <el-pagination :page-size="30" :page-sizes="[10, 30, 50, 100]" background layout="total, prev, pager, next"
        :total="sourceData.length" />
    </el-card>
    <el-dialog destroy-on-close title="预算导入" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-upload class="upload-demo" ref="upload" action="" :on-remove="handleRemove" :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import schoolList from "@/json/schoolList.json"
export default {
  name: 'BudgetComponent',
  data () {
    return {
      options: [{
        value: '营业收入',
        label: '营业收入'
      }, {
        value: '利润总额',
        label: '利润总额'
      }],
      value: '营业收入',
      value3: '2024',
      loading: false,
      sourceData: [],
      dialogVisible: false,
      fileList: [],
    }
  },
  created () {
    this.handleSerach();
  },
  methods: {
    handleSerach () {
      this.sourceData = [];
      schoolList.data.forEach(item => {
        //随机金额千分符
        item.plannedAmount = Math.floor(Math.random() * 1000000).toLocaleString()
        // 随机年月
        this.value3 = this.value3 || '2024'
        item.yearMonth = this.value3 + '年' + Math.floor(Math.random() * 12 + 1) + '月'
        //随机类别options
        item.businessCategory = this.value
        this.sourceData.push({
          yearMonth: item.yearMonth,
          nameOfThePark: item.shortName,
          businessCategory: item.businessCategory,
          plannedAmount: item.plannedAmount
        })
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleUpload () {
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    submitUpload () {
      this.$refs.upload.submit();
    },
  }
}
</script>
<style scoped>
.mb-10 {
  margin-bottom: 10px;
}

/deep/ .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 12px;
  font-weight: 700;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/deep/ .el-table .el-table__fixed-header-wrapper th,
/deep/ .el-table .el-table__header-wrapper th {
  word-break: break-word;
  background-color: #e9ebf2;
  color: #515a6e;
  height: 40px;
  font-size: 13px;
}

/deep/ .el-pagination {
  justify-content: end;
  display: flex;
}
</style>
