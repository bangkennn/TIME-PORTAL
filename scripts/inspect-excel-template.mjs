import xlsx from 'xlsx';

const filePath = 'C:/Users/User/.gemini/antigravity/brain/c9b5e8f4-b654-4744-8791-293ab84fd00e/.user_uploaded/media_1793946430184_6643ab4c.xlsx';
const workbook = xlsx.readFile(filePath, { cellStyles: true });
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const headers = [];
for (let c = 0; c <= 102; c++) {
  const colLetter = xlsx.utils.encode_col(c);
  const cell = sheet[`${colLetter}2`];
  headers.push({ col: colLetter, name: cell ? cell.v : null, style: cell ? cell.s : null });
}

console.log('Headers count:', headers.length);
console.log('All Headers:', headers.map(h => `${h.col}: ${h.name}`).join(', '));
console.log('\nA1 style:', JSON.stringify(sheet['A1']?.s));
console.log('A2 style:', JSON.stringify(sheet['A2']?.s));
console.log('!merges:', sheet['!merges']);
console.log('!cols count:', sheet['!cols']?.length);
console.log('Cols sample:', sheet['!cols']?.slice(0, 15));
