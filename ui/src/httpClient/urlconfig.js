let baseUrl;
if(process.env.NODE_ENV === "production"){            //线上环境
    //  baseUrl = "https://yhreports.admin.10010.com/bbdservice_servicemanager";   // 生产环境
    //  baseUrl = "https://yhreports.admin.10010.com/bbdservice_servicemanager_pre";   // 预发布环境
        baseUrl = "http://info.admin.10010.com:8008/bbdservice_servicemanager"; // 测试环境
    //  baseUrl = "http://ecstest2018.10010.com/unicom-digital-report"; // 运营平台测试环境
}else{  //本地环境
    baseUrl = "/api-proxy";              //本地开发 接口代理
};
export {baseUrl};

let baseUrl_New;
if(process.env.NODE_ENV === "production"){                //线上环境
    //  baseUrl_New= "https://yhreports.admin.10010.com/bbdservice_servicemanager";      // 生产环境
    //  baseUrl_New = "https://yhreports.admin.10010.com/bbdservice_servicemanager_pre";// 预发布环境
        baseUrl_New = "http://info.admin.10010.com:8008/bbdservice_servicemanager";    // 测试环境 
    //  baseUrl = "http://ecstest2018.10010.com/unicom-digital-report"; // 运营平台测试环境 
}else{  //本地环境
    baseUrl_New = "/model-api-proxy"; //本地开发 接口代理
};
export {baseUrl_New};