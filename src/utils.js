import * as XLSX from 'xlsx';

export function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      resolve(jsonData);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function generateSQL(data, customQuery) {
  if (!Array.isArray(data) || data.length < 2) {
    console.error("Data is not an array or does not contain enough rows:", data);
    return "Error: Data is not an array or does not contain enough rows.";
  }

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map((row, index) => {
    let query = customQuery;
    headers.forEach((header, i) => {
      query = query.replace(new RegExp(`{${header}}`, 'g'), `'${row[i]}'`);
    });
    query = query.replace(new RegExp(`{rowIndex}`, 'g'), index);
    return query;
  }).join('\n');
}
