<template>
  <div class="find-car">
    <div class="meau-top">
      <div class="meau-top-container">
        <div class="top-item">
          <span class="name">在线车辆：</span>
          <span class="value">20</span>
        </div>
        <div class="top-item">
          <span class="name">离线车辆：</span>
          <span class="value">200</span>
        </div>
        <div class="top-item">
          <span class="name">车辆总数：</span>
          <span class="value">201</span>
        </div>
        <div class="top-item">
          <span class="name">报警车辆：</span>
          <span class="value">213</span>
        </div>
        <div class="refresh-area">
          <el-button
            size="mini"
            style="
              background: rgb(243, 243, 243);
              padding-left: 2px;
              padding-right: 2px;
            "
            icon="el-icon-monitor"
            >大屏监控</el-button
          >
          <div class="refresh-select">
            <el-select
              v-model="refresh_time_value"
              size="mini"
              style="width: 100px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in refresh_time_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="refresh-btn">
            <el-button
              size="mini"
              style="
                background: rgb(243, 243, 243);
                padding-left: 6px;
                padding-right: 6px;
              "
              icon="el-icon-refresh"
            ></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="meau-left">
      <div class="meau-left-container">
        <div class="tree-box">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
          >
          </el-tree>
        </div>
        <div class="left-c-b">
          <div class="status-box">
            <ul>
              <li v-for="item in state_list" :key="item.id">
                <img :src="item.url" alt="" />
                <p>{{ item.name }}</p>
              </li>
            </ul>
          </div>
          <div class="seach-box">
            <div class="ipt">
              <el-input
                v-model="input"
                placeholder="车牌号、VIN码、终端SN"
              ></el-input>
            </div>
            <el-button
              style="background: #f2f6fc; padding: 5px 5px; font-size: 12px"
              icon="el-icon-search"
              >搜索</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="meau-bottom">
      <el-table
        :data="tableData"
        max-height="200"
        size="mini"
        border
        style="width: 100%"
        @row-click="rowClick"
      >
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="number" label="车牌号码"> </el-table-column>
        <el-table-column prop="serial_number" label="车牌序列号">
        </el-table-column>
        <el-table-column prop="vin" label="车辆VIN"> </el-table-column>
        <el-table-column prop="speed" label="行驶速度"> </el-table-column>
        <el-table-column prop="mileage" label="行驶总里程"> </el-table-column>
        <el-table-column prop="location_time" label="最后定位时间">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindCar",
  data() {
    return {
      tableData: [
        {
          status: "行驶",
          number: "5615325252525",
          serial_number: "12313131",
          vin: "12313131313131",
          speed: "80.21 km/h",
          mileage: "123131km",
          location_time: "2022-09-06 10:56:60"
        },
      ],
      state_list: [
        {
          id: 1,
          url: require("@/assets/images/xings_icon.png"),
          name: "行驶",
        },
        {
          id: 2,
          url: require("@/assets/images/tingc_icon.png"),
          name: "停车",
        },
        {
          id: 3,
          url: require("@/assets/images/chongd_icon.png"),
          name: "充电",
        },
        {
          id: 4,
          url: require("@/assets/images/lix_icon.png"),
          name: "离线",
        },
        {
          id: 5,
          url: require("@/assets/images/weizc_icon.png"),
          name: "未注册",
        },
        {
          id: 6,
          url: require("@/assets/images/baoj_icon.png"),
          name: "报警",
        },
      ],
      data: [
        {
          id: 1,
          label: "所有车辆",
          children: [
            {
              id: 1 - 1,
              label: "HJGAACBH1N1005008",
            },
            {
              id: 1 - 2,
              label: "00862547051491790",
            },
            {
              id: 1 - 3,
              label: "3656232q336666666",
            },
            {
              id: 1 - 4,
              label: "HJGAACBH6N1005005",
            },
          ],
        },
      ],
      refresh_time_options: [
        {
          value: "10",
          label: "10s",
        },
        {
          value: "7",
          label: "7s",
        },
        {
          value: "5",
          label: "5s",
        },
        {
          value: "3",
          label: "3s",
        },
        {
          value: "1",
          label: "1s",
        },
      ],
      refresh_time_value: "",
    };
  },
  methods: {
    rowClick() {
      this.$router.push({
        path: "lookData"
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.find-car {
  min-height: calc(100vh - 84px);
  position: relative;
  .meau-top {
    position: absolute;
    width: 100%;
    background: rgb(243, 243, 243);
    height: 30px;
    left: 0;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid #ddd;
    .meau-top-container {
      position: relative;
      display: flex;
      justify-content: right;
      align-items: center;
      height: 100%;
      padding-right: 20px;
      .top-item {
        margin-left: 10px;
        font-size: 12px;
        .name {
          color: #333;
        }
        .value {
          color: #1989fa;
          opacity: 0.7;
        }
      }
      .refresh-area {
        position: absolute;
        right: 0;
        bottom: -29px;
        z-index: 11;
        display: flex;
        align-items: center;
      }
    }
  }
  .meau-left {
    height: calc(100vh - 114px);
    position: absolute;
    z-index: 10;
    left: 0;
    top: 30px;
    background: rgb(243, 243, 243);
    border-right: 1px solid #ddd;
    width: 250px;
    .meau-left-container {
      height: 100%;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .tree-box {
        padding-right: 10px;
        box-sizing: border-box;
        flex: 1;
        overflow-y: scroll;
      }
      .left-c-b {
        flex-shrink: 0;
        border-top: 1px solid #ddd;
        .status-box {
          ul {
            list-style: none;
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 0;
            margin: 0;
            padding-top: 10px;
            li {
              flex: 0 0 33%;
              text-align: center;
              margin-bottom: 10px;
              img {
                width: 18px;
                height: auto;
              }
              p {
                font-size: 12px;
                color: #333;
                margin-top: 5px;
                margin-bottom: 5px;
              }
            }
          }
        }
        .seach-box {
          display: flex;
          padding: 5px;
          box-sizing: border-box;
          border-top: 1px solid #ddd;
          font-size: 12px;
          .ipt {
            flex: 1;
            margin-right: 4px;
          }
        }
      }
    }
    .el-tree::v-deep {
      background: rgb(243, 243, 243);
    }
    /deep/.el-tree-node__label {
      font-size: 12px !important;
    }
  }

  .meau-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    background: #fff;
    padding-left: 250px;
    padding-bottom: 20px;
    box-sizing: border-box;
    ::v-deep .el-table th {
      background-color: rgb(243, 243, 243);
      color: #333;
      font-size: 12px;
      font-weight: 520;
      padding: 0;
      height: 20px;
      text-align: center;
    }
    ::v-deep .el-table td {
      padding: 0;
      height: 20px;
      text-align: center;
    }
  }
}
</style>
