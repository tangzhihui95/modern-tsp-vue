<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">摩登车联网服务平台</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-row>
        <el-col :span="4">
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        </el-col>
<!--        <el-col :span="5" :offset="13">-->
<!--          <el-link type="warning">密码重置</el-link>-->
<!--        </el-col>-->
      </el-row>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>湖南成为科技有限公司版权所有 Copyright © 2016 HuNan Become Technology Co., Ltd. All rights reserved
        <br/>
        <span>湘ICP备14016782号-2&nbsp;&nbsp;&nbsp;科技立远，驱动世界</span>
      </span>
    </div> -->
  </div>
</template>

<script>
  import {getCodeImg} from "@/api/login";
  import Cookies from "js-cookie";
  import {encrypt, decrypt} from '@/utils/jsencrypt'

  export default {
    name: "Login",
    data() {
      return {
        codeUrl: "",
        cookiePassword: "",
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: ""
        },
        loginRules: {
          username: [
            {required: true, trigger: "blur", message: "请输入您的账号"}
          ],
          password: [
            {required: true, trigger: "blur", message: "请输入您的密码"}
          ],
          code: [{required: true, trigger: "change", message: "请输入验证码"}]
        },
        loading: false,
        // 验证码开关
        captchaOnOff: true,
        // 注册开关
        register: false,
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    destroyed(){
      // 清除popstate事件 否则会影响到其他页面
      window.removeEventListener("popstate", this.disableBrowserBack, false);
    },
    created() {
      this.getCode();
      this.getCookie();
    },
    mounted(){
      // 禁用浏览器返回键

      history.pushState(null, null, document.URL);

      window.addEventListener('popstate', this.disableBrowserBack);
    },
    methods: {　
      disableBrowserBack() {

        history.pushState(null, null, process.env.VUE_APP_LOGIN_URL);

      },
      getCode() {
        getCodeImg().then(res => {
          this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
          if (this.captchaOnOff) {
            this.codeUrl = "data:image/gif;base64," + res.img;
            this.loginForm.uuid = res.uuid;
          }
        });
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set("username", this.loginForm.username, {expires: 30});
              Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
              Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
            } else {
              Cookies.remove("username");
              Cookies.remove("password");
              Cookies.remove('rememberMe');
            }
            this.$store.dispatch("Login", this.loginForm).then(() => {

              this.loading = false;
              this.$router.push({path: this.redirect || "/"}).catch(() => {
              });

              // window.location.href = '/test/tsp-admin/';
              // window.location.href = this.redirect ? '/index#' + this.redirect : '/index';
            }).catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login-background.jpg");
    background-size: cover;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 80px;
    line-height: 35px;
    position: fixed;
    bottom: 0;
    padding: 0px 0px 0px 0px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }
</style>
