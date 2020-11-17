import xlsx from 'node-xlsx';

export default function parseExcel(params: any) {
  return xlsx.parse(params.path);
}
