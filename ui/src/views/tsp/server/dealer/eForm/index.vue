<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
      :before-close="resetVariable"
      :close-on-click-modal=false
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="经销商名称："
              prop="dealerName"
              label-width="110px"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.dealerName"
                placeholder="请输入经销商名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="经销商编码："
              prop="dealerCode"
              label-width="110px"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.dealerCode"
                placeholder="请输入经销商编码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="联系电话："
              prop="dealerPhone"
              label-width="110px"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.dealerPhone"
                maxlength="11"
                placeholder="请输入联系电话"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        <el-col :span="21"
          v-if="this.title != '查看详情'">
          <el-form-item
              label="位置查询："
              prop="querryAddress"
              label-width="110px"
            >
              <el-input
                id="search-input"
                v-model="querryAddress"
                class="input-with"
                placeholder="请输入名称或地址"
                clearable
                :disabled="this.title === '查看详情'"
                @clear="handelclearInput"
              >
                <el-button
                  slot="append"
                  size="small"
                  type="primary"
                  icon="el-icon-search"
                  @click="handelSearch"
                  >查询</el-button
                >
              </el-input>
            </el-form-item>
          </el-col>
        
          <el-col :span="21">
            <el-form-item
              label="经销商坐标："
              label-width="110px"
              prop="dealerLngLat"
            >
              <baidu-map
                class="map"
                :center="form.dealerLngLat == null ? { lng: 121.480539, lat: 31.235929 } : form.dealerLngLat"
                :zoom="zoom"
                :scroll-wheel-zoom="true"
                :style="{width: '470px', height: '300px', marginLeft: '0px', marginBottom: '20px'}"
                @ready="init">
                  <bm-marker
                    v-if="form.dealerLngLat"
                    :position="form.dealerLngLat"
                    :offset="{width: 0, height: 0}">
                  </bm-marker>
              </baidu-map>
            </el-form-item>
          </el-col>

        <el-col :span="21">
          <el-col :span="10">
            <el-form-item prop="dealerProvince" label="经销商地址：" label-width="110px">
                <el-select
                  :disabled="this.title === '查看详情'"
                  v-model="form.dealerProvince"
                  placeholder="请选择省"
                  @clear="clearProvince"
                  clearable
                  @change="chooseProvince(form.dealerProvince)"
                >
                  <el-option
                    v-for="province in provincesOpt"
                    :key="province.value"
                    :label="province.label"
                    :value="province.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="dealerCity" style="margin-left: -80px;">
                <el-select
                  v-model="form.dealerCity"
                  clearable
                  @clear="clearCity"
                  :disabled="disableCity"
                  placeholder="请选择市"
                  @change="chooseCity(form.dealerCity)"
                >
                  <el-option
                    v-for="city in cityTreesOpt"
                    :key="city.value"
                    :label="city.label"
                    :value="city.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="dealerDistrict" style="margin-left: -80px;">
              <template>
                <el-select
                  v-model="form.dealerDistrict"
                  clearable
                  :disabled="disableDistrict"
                  placeholder="请选择区"
                  @change="chooseDistrict(form.dealerDistrict)"
                >
                  <el-option
                    v-for="district in districtTreesOpt"
                    :key="district.value"
                    :label="district.label"
                    :value="district.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="21">
          <el-form-item prop="dealerStreetAndStreetNumber" label-width="110px">
            <el-input
                v-model="form.dealerStreetAndStreetNumber"
                class="input-with"
                placeholder="街道地址"
                clearable
                :disabled="this.title === '查看详情'"
              >
              </el-input>
          </el-form-item>
        </el-col>

          <el-col :span="14">
            <el-form-item
              label="编辑人"
              prop="updateBy"
              label-width="110px"
              v-if="this.title === '查看详情'"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.updateBy"
                placeholder="请输入编辑人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="编辑时间"
              prop="updateTime"
              label-width="110px"
              v-if="this.title === '查看详情'"
            >
              <el-input
                :disabled="this.title === '查看详情'"
                v-model="form.updateTime"
                placeholder="请输入编辑时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="this.title === '查看详情'"
          >确 定</el-button
        >
        <el-button @click="resetVariable">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { add, edit } from '@/api/tsp/dealer.js'
import { parseTime } from '../../../../../utils/paramsUtil'
import { areaTrees, cityTrees, provincesTrees } from '@/api/tsp/provinces.js'

//百度地图

export default {
  name: "dealer",
  data() {
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
      },
      dialogVisible: false,
      districts: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      // 表单校验
      rules: {
        dealerName: [
          { required: true, message: "经销商名称不能为空", trigger: "blur" },
        ],
        dealerCode: [
          { required: true, message: "经销商编码不能为空", trigger: "blur" },
        ],
        dealerPhone: [
          { required: true, message: "经销商电话不能为空", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "联系电话必须由11位数字组成",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]\d*$/,
            message: "联系电话必须由11位数字组成",
            trigger: "blur",
          },
        ],
        dealerProvince: [
          { required: true, message: "经销商所在省不能为空", trigger: "change" },
        ],
        dealerCity: [
          { required: true, message: "经销商所在市不能为空", trigger: "change" },
        ],
        dealerDistrict: [
          { required: true, message: "经销商所在区不能为空", trigger: "change" },
        ],
        dealerStreetAndStreetNumber: [
          { required: true, message: "经销商所在街道地址不能为空", trigger: ["change", "blur"] },
        ],
        dealerLngLat: [
          { required: true, message: "经销商坐标不能为空", trigger: "change" },
        ],
      },

      //BMap类
      BMap: null,
      //地图对象
      map: null,
      geocoder: null,
      zoom: 17,


      // 查询参数
      queryParams: {
      },
      //
      province: {
        label: null,
        value: null,
      },
      // 省
      provincesOpt: [],
      // 市
      cityTreesOpt: [],  //
      disableCity:true,  //
      //
      city: {
        label: null,
        value: null,
      },
      // 区
      districtTreesOpt: [],
      disableDistrict:true,  //
      //
      district: {
        label: null,
        value: null,
      },

      querryAddress: "",  //

      locationProvince: null,
      locationCity: null,
      locationDistrict: null,
    };
  },

  created() {
    provincesTrees().then((res) => {
      console.log("开始加载省份----");
      console.log(res.result);
      this.provincesOpt = res.result;
      console.log("赋值完毕---");
      console.log(this.provincesOpt);
    });

    this.initForm();
    this.initQueryParams();
  },

  // activated() {
  //   console.log('activated');
  //   debugger
  //   this.clear();
  // },

  watch: {
    'form.dealerProvince'(newValue, oldValue) {
      this.updateCityTrees(newValue);
    },
    'form.dealerCity'(newValue, oldValue) {
      this.updateDistrictTrees(newValue);
    },
    'form.dealerLngLat'(newValue, oldValue) {
      if (newValue === null) {
        return;
      }

      this.form.dealerLat = newValue.lat;
      this.form.dealerLng = newValue.lng;

      if (this.form.isUpdateMarkerPosition) {  //仅用于修复多次点击编辑或详情时地图上标注位置出现偏移BUG
        console.log("Force UpdateMarkerPosition:", newValue);
        this.form.isUpdateMarkerPosition = false;
        setTimeout(() => {
          this.form.dealerLngLat = { lng: parseFloat(newValue.lng), lat: parseFloat(newValue.lat)};
        }, 100);
      }

      if (this.$refs.form) {
        this.$refs.form.validate("dealerLngLat");
      }

      if (this.locationProvince === null && this.locationCity === null && this.locationDistrict === null ) {  //编辑页面，进行一次坐标转换给locationProvince、locationCity、locationDistrict赋值
        let point = new BMap.Point(newValue.lng, newValue.lat);
        this.geocoder.getLocation(point, (rs) => {
          this.locationProvince = rs.addressComponents.province;
          this.locationCity = rs.addressComponents.city;
          this.locationDistrict = rs.addressComponents.district;
        });
      }
    },
  },

  methods: {
    init({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;

      this.geocoder = new BMap.Geocoder();

      this.map.addEventListener("click", (e) => {
        if (this.title === '查看详情') {
          return;
        }
        // 点击地点获取经纬度
        console.log(e.point);

        this.zoom = this.map.getZoom();
        this.getLocation(e.point);
      });

      this.map.addEventListener("zoomend", (e) => {
        this.zoom = this.map.getZoom();
      });
    },

    getLocation(lnglat) {
      this.geocoder.getLocation(lnglat, (rs) => {
        this.locationProvince = rs.addressComponents.province;
        this.locationCity = rs.addressComponents.city;
        this.locationDistrict = rs.addressComponents.district;

        this.form.dealerLngLat = lnglat;
        this.form.dealerProvince = rs.addressComponents.province;
        this.form.dealerCity = rs.addressComponents.city;
        this.form.dealerDistrict = rs.addressComponents.district;
        this.form.dealerStreetAndStreetNumber = rs.addressComponents.street + rs.addressComponents.streetNumber;
        this.disableDistrict= false;
        this.disableCity= false;

        // this.$forceUpdate();
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if ("pageNum" in this.form) {
            (this.form.pageNum = 1), (this.form.pageSize = 10);
          } else {
            (this.form.pageNum = 1), (this.form.pageSize = 10);
          }

          if(this.form.dealerProvince===null||this.form.dealerCity===""||this.form.dealerDistrict===""||this.form.dealerStreetAndStreetNumber===""){
            this.$message.error("选择经销商地址~");
            return ;
          }
          this.form.dealerAddress = this.form.dealerProvince + this.form.dealerCity + this.form.dealerDistrict + this.form.dealerStreetAndStreetNumber;

          if(this.form.dealerProvince!==this.locationProvince||this.form.dealerCity!==this.locationCity||this.form.dealerDistrict!==this.locationDistrict){
            this.$message.error("经销商坐标位置（"+(this.locationProvince + this.locationCity + this.locationDistrict)+
              "）与经销商地址（"+(this.form.dealerProvince + this.form.dealerCity + this.form.dealerDistrict)+"）不一致！");
            return ;
          }
          
          if (this.title === "新增") {
            add(this.form).then((res) => {
              console.log("经销商res：" + res);
              this.$modal.msgSuccess("操作成功");
              console.log("新增中---");
              this.$parent.getList();
              console.log("新增结束---");
              this.resetVariable();
            });
          } else {
            console.log("开始修改---");
            this.form.createTime = null;
            this.form.updateTime = parseTime(new Date());

            edit(this.form).then((res) => {
              this.$modal.msgSuccess("操作成功");
              this.$parent.getList();
              this.resetVariable();
            });
          }
        }
      });
    },
    handelSearch() {
      this.geocoder.getPoint(this.querryAddress, (point) => {
        if(point){
          this.getLocation(point);
        }else{
          this.$message({
            showClose: true,
            message: '您选择的地址没有解析到结果！',
            type: 'warning'
          });
        }
      }, '全国');
    },
    handelclearInput() {
      this.querryAddress = "";
      this.$forceUpdate();
    },

    /**
     * 重置所有变量
     */
    resetVariable() {
      this.zoom = 17;
      this.open = false;

      this.initForm();
      this.initQueryParams();

      this.clearProvince();
      this.querryAddress = "";
      this.locationProvince = null;
      this.locationCity = null;
      this.locationDistrict = null;
    },

    initForm() {
      if (this.$refs.form) {
        // this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
      }

      // 表单默认值
      this.form = {
        pageNum: 1,
        pageSize: 10,
        dealerLng: null,
        dealerLat: null,
        dealerLngLat: null,
        dealerProvince: null,
        dealerCity: "",
        dealerDistrict: "",
        dealerStreetAndStreetNumber: "",
      };
    },

    initQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        provinceValue: null,
        cityValue: null,
        districtValue: null,
        dealerAddress: "",
      };
    },

    //已选省
    chooseProvince(provinceValue) {
      this.disableDistrict = true;
      this.disableCity = false;
      this.queryParams.districtValue = null;
      this.queryParams.cityValue = null;
      this.form.dealerDistrict = null;
      this.form.dealerCity = null;
      this.queryParams.provinceValue = provinceValue;
    },
    updateCityTrees(provinceValue) {
      if (provinceValue != null && provinceValue != "") {
        cityTrees(provinceValue).then((res) => {
          console.log("开始加载省份下面的地级市----");
          console.log(res.result);
          this.cityTreesOpt = res.result;
          console.log("赋值完毕---");
          console.log(this.cityTreesOpt);
        });
      }
    },

    //已选市
    chooseCity(cityValue) {
      this.disableDistrict = false;
      this.queryParams.cityValue = cityValue;
      this.queryParams.districtValue = null;
      this.form.dealerDistrict = null;
    },
    updateDistrictTrees(cityValue) {
      if (cityValue != null && cityValue !== "") {
        areaTrees(cityValue).then((res) => {
          console.log("开始加载地级市下面的区/县----");
          console.log(res.result);
          this.districtTreesOpt = res.result;
          console.log("赋值完毕---");
          console.log(this.districtTreesOpt);
        });
      }
    },

    //已选区
    chooseDistrict(districtValue) {
      this.queryParams.districtValue = districtValue;
      console.log(this.queryParams);
    },

    clearProvince() {
      this.disableDistrict= true;
      this.disableCity= true;
      this.form.dealerCity = "";
      this.form.dealerDistrict = "";
      this.city = {
        label: null,
        value: null,
      };
      this.district = {
        label: null,
        value: null,
      };
    },
    clearCity() {
      this.form.dealerDistrict = "";
      this.disableDistrict = true;
      this.district = {
        label: null,
        value: null,
      };
    },
  },
};
</script>

<style lang="scss">
</style>
