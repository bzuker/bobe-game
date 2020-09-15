import { GoogleSpreadsheet } from 'google-spreadsheet';

// Google sheet key
const doc = new GoogleSpreadsheet('1BQv9I3AlMMxBTLvCi9Fy4H4cupGIN_LB3EiUFS8v54k');
doc.useApiKey(process.env.SHEET_API_KEY);

export async function getQuestions() {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  if (!rows.every(x => x.text)) {
    console.log(rows);
    throw new Error("Could not load text from sheet")
  }

  const questions = rows.map(x => ({
    type: x.type,
    text: x.text,
    answer: x.answer,
    options: [ { text: x.opt1 || null }, { text: x.opt2 || null }, { text: x.opt3 || null }],
    image: x.image || null
  }));

  return questions;
}