<template>
  <div class="upload">
    <el-upload
      ref="my-upload"
      :class="{'disUoloadSty':imgList.length >= limit}"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="handleChange"
      :disabled="disabledImg"
      :file-list="imgList"
      :accept="acceptString"
      :limit="limit">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <!-- <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span> -->
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
    </el-upload>
    <el-dialog width="880px" :modal="false" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import uploader from '@/utils/uploader.js'
export default {
  name: '',
  components: {
  },
  props: {
    limit: {
      type: Number,
      default: null
    },
    imgList: {
      type: Array,
      default: null
    },
    acceptString: {
      type: String,
      default: null
    },
    disabledImg: {
      type: Boolean,
      default: null
    },
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
    }
  },
  created () {
    uploader.ossInitial()
  },
  mounted () {

  },
  methods: {
    handleRemove(file,fileList) {
      for (let i = 0; i < this.imgList.length; i++) {
        const name = this.imgList[i].name
        if (file.name == name) {
          this.imgList.splice(i,1)
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    getuuid(len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      var uuid = []
      var i = 0
      radix = radix || chars.length

      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
      } else {
        var r

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
          }
        }
      }

      return uuid.join('')
    },
    handleChange(file, fileList) {
      let name
      let index = file.name.lastIndexOf(".");
      let suffix = file.name.substring(index);
      const time = new Date().getTime()
      const uuid = this.getuuid(10)
      name = `${time}${uuid}${suffix}`
      uploader.uploadHandle(name,file).then(res => {
        this.imgList.push({
          name:res.name,
          url:uploader.authorizedAccessUrl(res.name),
        })
      })
      this.clearFiles()
    },
    clearFiles () {
      this.$refs['my-upload'].clearFiles();
    },
  }
}
</script>
<style lang='scss'>
.disUoloadSty .el-upload--picture-card{
  display:none !important;  /* 上传按钮隐藏 */
}
</style>
