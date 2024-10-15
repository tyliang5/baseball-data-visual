import * as XLSX from 'xlsx';

export const readBaseballData = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
};
