<template>
  <div class="welcome">
    <!-- 顶部 -->
    <el-row>
      <el-col :span="8">
        <div class="grid-content card-purple1">
          <div class="left_icon">
            <i class="el-icon-s-custom"></i>
          </div>
          <div>
            <p>月访问人数</p>
            <p>348</p>
            <p>
              <i class="el-icon-arrow-up"></i>
              <span>+20% 增长</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content card-purple2">
          <div class="left_icon">
            <i class="el-icon-s-custom"></i>
          </div>
          <div>
            <p>月销量</p>
            <p>666</p>
            <p>
              <i class="el-icon-arrow-up"></i>
              <span>+20% 增长</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content card-purple3">
          <div class="left_icon">
            <i class="el-icon-s-custom"></i>
          </div>
          <div>
            <p>月生产</p>
            <p>2048</p>
            <p>
              <i class="el-icon-arrow-up"></i>
              <span>+20% 增长</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 中间部分 -->
    <el-row class="main_middle">
      <el-col :span="9">
        <div ref="leftMain" style="height:400px;"></div>
      </el-col>
      <el-col :span="15">
        <div ref="rightMain" style="height:400px;"></div>
      </el-col>
    </el-row>
    <!-- 底部 -->
    <el-row class="main_bottom">
      <el-col>
        <div ref="bottomMain" style="height:400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* 引入echarts */
import echarts from 'echarts'
var colors = ['#5793f3', '#d14a61', '#675bba']
export default {
  data() {
    return {
      /* 左侧echarts */
      option: {
        title: {
          text: '访客数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: [
            'rose1',
            'rose2',
            'rose3',
            'rose4',
            'rose5',
            'rose6',
            'rose7',
            'rose8'
          ]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '半径模式',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '50%'],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { value: 10, name: 'rose1' },
              { value: 5, name: 'rose2' },
              { value: 15, name: 'rose3' },
              { value: 25, name: 'rose4' },
              { value: 20, name: 'rose5' },
              { value: 35, name: 'rose6' },
              { value: 30, name: 'rose7' },
              { value: 40, name: 'rose8' }
            ]
          },
          {
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            data: [
              { value: 10, name: 'rose1' },
              { value: 5, name: 'rose2' },
              { value: 15, name: 'rose3' },
              { value: 25, name: 'rose4' },
              { value: 20, name: 'rose5' },
              { value: 35, name: 'rose6' },
              { value: 30, name: 'rose7' },
              { value: 40, name: 'rose8' }
            ]
          }
        ]
      },
      /* 右侧echarts */
      option2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['销售量', '生产量', '平均盈利']
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value}件'
            }
          },
          {
            type: 'value',
            name: '时间',
            min: 0,
            max: 24,
            interval: 5,
            axisLabel: {
              formatter: '{value}点'
            }
          }
        ],
        series: [
          {
            name: '销售量',
            type: 'bar',
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: '生产量',
            type: 'bar',
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: '平均盈利',
            type: 'line',
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      },
      option3: {
        color: colors,

        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['2019 销售量', '2020 销售量']
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    '销售量  ' +
                    params.value +
                    (params.seriesData.length
                      ? '：' + params.seriesData[0].data
                      : '')
                  )
                }
              }
            },
            data: [
              '2016-1',
              '2016-2',
              '2016-3',
              '2016-4',
              '2016-5',
              '2016-6',
              '2016-7',
              '2016-8',
              '2016-9',
              '2016-10',
              '2016-11',
              '2016-12'
            ]
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    '销售量  ' +
                    params.value +
                    (params.seriesData.length
                      ? '：' + params.seriesData[0].data
                      : '')
                  )
                }
              }
            },
            data: [
              '2015-1',
              '2015-2',
              '2015-3',
              '2015-4',
              '2015-5',
              '2015-6',
              '2015-7',
              '2015-8',
              '2015-9',
              '2015-10',
              '2015-11',
              '2015-12'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '2019 销售量',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: '2020 销售量',
            type: 'line',
            smooth: true,
            data: [
              3.9,
              5.9,
              11.1,
              18.7,
              48.3,
              69.2,
              231.6,
              46.6,
              55.4,
              18.4,
              10.3,
              0.7
            ]
          }
        ]
      }
    }
  },
  mounted() {
    /* 左侧echarts */
    const leftMyChart = echarts.init(this.$refs.leftMain)
    leftMyChart.setOption(this.option)
    /* 右侧echarts */
    const rightMyChart = echarts.init(this.$refs.rightMain)
    rightMyChart.setOption(this.option2)
    /* 底部echarts */
    const bottomMyChart = echarts.init(this.$refs.bottomMain)
    bottomMyChart.setOption(this.option3)
  }
}
</script>

<style scoped lang="less">
.welcome {
  .grid-content {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    border: 1px solid #bdc3c7;
    color: #e67e22;
    font-size: 20px;
    padding: 15px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    .left_icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #c0392b;
      font-size: 40px;
      text-align: center;
      line-height: 60px;
      margin-right: 10px;
    }
    p {
      margin: 10px;
      font-size: 13px;
    }
    p:nth-child(2) {
      font-size: 30px;
    }
    p:last-child {
      color: #000000;
    }
  }
  .card-purple2 {
    color: #2980b9;
    .left_icon {
      border: 1px solid #2980b9;
    }
  }
  .card-purple3 {
    color: #8e44ad;
    .left_icon {
      border: 1px solid #8e44ad;
    }
  }
  .el-row {
    margin-top: 10px;
    padding: 10px;
  }
  .main_middle,
  .main_bottom {
    .el-col {
      border: 1px solid #000;
    }
  }
}
</style>
