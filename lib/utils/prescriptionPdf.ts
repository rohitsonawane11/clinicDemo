type PrescriptionPdfInput = {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  doctorName: string;
  doctorQualification: string;
  doctorRegistration: string;
  patientName: string;
  patientDetails: string;
  patientMobile: string;
  patientId: string;
  prescriptionId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  investigations?: string;
  recommendedTests?: string[];
  prescriptionLanguage?: string;
  medicines: { name: string; type: string; dose: string; timing: string; duration: number }[];
  advice: string;
};

const ascii = (value: string) => value.normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/[()\\]/g, (character) => `\\${character}`);
const wrap = (value: string, width = 82) => {
  const words = ascii(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    if (`${line} ${word}`.trim().length > width) { if (line) lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  });
  if (line) lines.push(line);
  return lines;
};

export function createPrescriptionPdf(input: PrescriptionPdfInput) {
  const commands: string[] = [];
  const text = (value: string, x: number, y: number, size = 9, bold = false, color = '0.12 0.16 0.25') => {
    commands.push(`BT ${color} rg /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${ascii(value)}) Tj ET`);
  };
  const line = (x1: number, y1: number, x2: number, y2: number, width = 1, color = '0.82 0.86 0.91') => commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  const fill = (x: number, y: number, width: number, height: number, color: string) => commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  const wrappedText = (value: string, x: number, y: number, width: number, size = 9, leading = 12, bold = false, color?: string) => {
    const approximateCharacters = Math.max(12, Math.floor(width / (size * 0.52)));
    const lines = wrap(value, approximateCharacters);
    lines.forEach((part, index) => text(part, x, y - index * leading, size, bold, color));
    return y - lines.length * leading;
  };

  fill(0, 0, 595, 842, '1 1 1');
  fill(0, 747, 595, 95, '0.035 0.20 0.42');
  text(input.clinicName.toUpperCase(), 42, 805, 21, true, '1 1 1');
  wrappedText(input.clinicAddress, 42, 783, 315, 8.5, 11, false, '0.86 0.92 1');
  text(`Phone: ${input.clinicPhone}`, 42, 758, 8.5, false, '0.86 0.92 1');
  text(input.doctorName, 385, 806, 11, true, '1 1 1');
  text(input.doctorQualification, 385, 790, 8, false, '0.86 0.92 1');
  text(`Reg. No: ${input.doctorRegistration}`, 385, 774, 8.5, true, '1 1 1');

  fill(36, 677, 523, 54, '0.96 0.98 1');
  text('PATIENT', 46, 714, 7, true, '0.25 0.42 0.66');
  text(input.patientName, 46, 697, 12, true);
  text(input.patientDetails, 180, 697, 9);
  text(`Patient ID: ${input.patientId}`, 46, 683, 7.5, false, '0.35 0.42 0.53');
  text(`Mobile: ${input.patientMobile}`, 246, 683, 7.5, false, '0.35 0.42 0.53');
  text('PRESCRIPTION', 390, 714, 7, true, '0.25 0.42 0.66');
  text(`No: ${input.prescriptionId}`, 390, 697, 8.5, true);
  text(input.date, 390, 683, 7.5, false, '0.35 0.42 0.53');
  text(`Language: ${input.prescriptionLanguage || 'English'}`, 390, 671, 7.5, false, '0.35 0.42 0.53');

  text('CLINICAL DETAILS', 42, 655, 8, true, '0.035 0.20 0.42');
  text('Diagnosis', 42, 635, 7.5, true, '0.35 0.42 0.53');
  wrappedText(input.diagnosis || 'Not recorded', 105, 635, 185, 8.5, 11, true);
  text('Symptoms', 315, 635, 7.5, true, '0.35 0.42 0.53');
  wrappedText(input.symptoms.join(', ') || 'Not recorded', 380, 635, 170, 8.5, 11);
  text('Investigations', 42, 610, 7.5, true, '0.35 0.42 0.53');
  wrappedText(input.investigations || 'Not recorded', 125, 610, 180, 8, 10);
  text('Recommended tests', 315, 610, 7.5, true, '0.35 0.42 0.53');
  wrappedText(input.recommendedTests?.join(', ') || 'Not recommended', 420, 610, 130, 8, 10);
  line(42, 588, 553, 588);

  text('Rx', 42, 559, 25, true, '0.035 0.20 0.42');
  const columns = [42, 270, 333, 414, 477, 553];
  fill(42, 523, 511, 24, '0.91 0.95 1');
  ['MEDICINE / FORMULATION', 'FREQUENCY', 'INSTRUCTIONS', 'DURATION', 'QUANTITY'].forEach((label, index) => text(label, columns[index] + 6, 532, 6.5, true, '0.18 0.32 0.52'));
  let y = 523;
  input.medicines.forEach((medicine, index) => {
    const rowHeight = 43;
    if (index % 2 === 1) fill(42, y - rowHeight, 511, rowHeight, '0.98 0.99 1');
    text(`${index + 1}. ${medicine.name.toUpperCase()}`, 48, y - 16, 8.5, true);
    text(medicine.type, 48, y - 31, 7.5, false, '0.40 0.46 0.56');
    text(medicine.dose, columns[1] + 6, y - 20, 8.5, true);
    wrappedText(medicine.timing, columns[2] + 6, y - 18, 72, 7.5, 10);
    text(`${medicine.duration} days`, columns[3] + 6, y - 20, 8);
    text(estimateQuantity(medicine), columns[4] + 6, y - 20, 8);
    line(42, y - rowHeight, 553, y - rowHeight, 0.5);
    y -= rowHeight;
  });
  columns.forEach((x) => line(x, y, x, 547, 0.35, '0.82 0.86 0.91'));

  y -= 24;
  text('ADVICE / INSTRUCTIONS', 42, y, 8, true, '0.035 0.20 0.42');
  y = wrappedText(input.advice || 'As discussed during consultation.', 42, y - 18, 511, 8.5, 12);
  y -= 20;
  fill(42, y - 42, 250, 42, '0.97 0.98 0.99');
  text('Important', 52, y - 15, 7.5, true, '0.35 0.42 0.53');
  wrappedText('Use medicines only as directed. Seek medical attention for worsening symptoms or adverse reactions.', 52, y - 29, 230, 6.8, 9, false, '0.35 0.42 0.53');
  line(360, y - 33, 540, y - 33, 0.7, '0.25 0.31 0.40');
  text(input.doctorName, 405, y - 47, 8, true);
  text('Signature / digital authentication', 385, y - 59, 6.5, false, '0.40 0.46 0.56');
  text(`Reg. No: ${input.doctorRegistration}`, 411, y - 71, 6.5, true);

  fill(0, 0, 595, 42, '0.98 0.94 0.78');
  text('FICTIONAL DEMONSTRATION PRESCRIPTION - NOT VALID FOR DISPENSING', 105, 17, 7.5, true, '0.48 0.31 0.02');
  text('Generated by Bharat Clinic Demo', 42, 55, 6.5, false, '0.45 0.50 0.58');
  text('Page 1 of 1', 500, 55, 6.5, false, '0.45 0.50 0.58');
  const stream = commands.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

export function estimateQuantity(medicine: { type: string; dose: string; duration: number }) {
  const form = medicine.type.toLowerCase();
  if (form.includes('syrup') || form.includes('drop')) return '1 bottle';
  if (form.includes('ointment')) return '1 tube';
  if (form.includes('inhaler')) return '1 inhaler';
  if (form.includes('sachet')) return `${Math.max(1, medicine.duration)} sachets`;
  if (medicine.dose === 'SOS') return 'As required';
  const daily = medicine.dose.split('-').map(Number).filter(Number.isFinite).reduce((sum, value) => sum + value, 0);
  return `${Math.max(1, daily || 1) * Math.max(1, medicine.duration)} units`;
}
