import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 const data = [
    ["姓名", "年龄", "职业"],
    ["Alice", 28, "Engineer"],
    ["Bob", 22, "Designer"]
    ]; 
    */
export function exportToExcel(data, fileName) {
    // 将数据转换为工作表
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // 创建工作簿并添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 使用blob和FileReader创建一个URL然后下载
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(dataBlob, `${fileName}.xlsx`);
}