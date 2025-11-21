<template>
  <div style="margin-left: 5%;margin-top: 10px;">
    <div>
      车牌号：{{ moveAlertInfo.carNumber }}<br/>
      车主姓名：{{ moveAlertInfo.carMaster }}<br/>
      车辆颜色：{{ moveAlertInfo.carColor }}<br/>
      车主手机号：{{ moveAlertInfo.carTel }}<br/>
      车辆VIN：{{ moveAlertInfo.vin }}<br/>
      ICCID：{{ moveAlertInfo.ICCID  || '无'}}<br/>
      位置：{{ moveAlertInfo.address }}<br/>
    </div>
    <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
      <bm-marker :position="markPoint" :dragging="true" @click="infoWindowOpen">
        <bm-info-window :show="show" style="width: 300px;" @close="infoWindowClose" @open="infoWindowOpen">
          车牌号：{{ moveAlertInfo.carNumber }}<br/>
          车主姓名：{{ moveAlertInfo.carMaster }}<br/>
          车辆颜色：{{ moveAlertInfo.carColor }}<br/>
          车主手机号：{{ moveAlertInfo.carTel }}<br/>
          车辆VIN：{{ moveAlertInfo.vin }}<br/>
          ICCID：{{ moveAlertInfo.ICCID || '无'}}<br/>
          位置：{{ moveAlertInfo.address }}<br/>
          经度：{{ moveAlertInfo.longitude }}<br/>
          纬度：{{ moveAlertInfo.latitude }}<br/>
        </bm-info-window>
      </bm-marker>
    </baidu-map>

  </div>
</template>

<script>

import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView' //地图视图
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch' //搜索
import BmMarker from 'vue-baidu-map/components/overlays/Marker' //点标注
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow' //标注弹窗
import { getById } from '@/api/move/move'

export default {
  name: "monitor",
  components: {
    BaiduMap,BmView,BmLocalSearch,BmMarker,BmInfoWindow
  },
  data() {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      moveAlertInfo: {},
      show: true,
      markPoint: {
        lng: 0,
        lat: 0
      }
    }
  },
  methods: {
    handler({BMap, map}) {
      console.log(BMap, map)
      let id = localStorage.getItem("alertInfoId")
      getById(id).then(res => {
        this.moveAlertInfo = res.result
        this.center.lng = this.moveAlertInfo.longitude
        this.center.lat = this.moveAlertInfo.latitude
        this.markPoint = {
          lng: this.moveAlertInfo.longitude,
          lat: this.moveAlertInfo.latitude
        }
      })
      this.zoom = 15
    },
    infoWindowClose() {
      this.show = false
    },
    infoWindowOpen() {
      this.show = true
    }
  }
}
</script>

<style scoped>
/*// 去除百度地图的图标 根据实际情况看是否要加样式穿透(::v-deep)*/
::v-deep .anchorBL {
  display: none !important;
}
.map {
  margin-top: 20px;
  width: 90%;
  height: 600px;
}
</style>
