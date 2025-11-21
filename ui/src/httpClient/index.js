import { postRequest, getRequest } from "./axios";
import { baseUrl,baseUrl_New} from "./urlconfig";


// 头部数据接口
export const  tbDate = (data)=>{
    return postRequest(`${baseUrl}/fpil/qry`,data)
}
//省份数据
export const  shengfen = (data)=>{
    return postRequest(`${baseUrl}/largeScreen/findProvinceListForeign`,data)                                
} 
//下载数据接口
export const downloadExcel = (data) => {
	return postRequest(`${baseUrl}/fpil/downloadQry`,data)
}
// 头部数据接口
export const  tanChuang = (data)=>{
    return postRequest(`${baseUrl}/fpil/qryDetail`,data)
}
