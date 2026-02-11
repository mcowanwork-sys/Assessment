
import { jsPDF } from 'jspdf';
import { AssessmentData, MatchResult, NQFLevel, SalaryRange, ExperienceRange } from './types';
import { POINT_VALUES, MINIMUM_POINTS_REQUIRED } from './constants';

export const generateAssessmentPDF = (data: AssessmentData, matchResult: MatchResult | null, totalPoints: number, customLogo?: string) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const margin = 20; 
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  const lineSpacing = 1.15;
  const fontSize = 11;
  const stepHeight = fontSize * 0.3527 * lineSpacing;

  const pointsWithoutCSL = totalPoints - (data.isOccupationOnList ? 100 : 0);
  const qualifiedForCSWV = data.isOccupationOnList && data.hasMandatoryOffer;
  const qualifiedForGWV = pointsWithoutCSL >= MINIMUM_POINTS_REQUIRED && data.hasMandatoryOffer;
  const meetsRequirements = qualifiedForCSWV || qualifiedForGWV;
  const firstName = data.fullName ? data.fullName.split(' ')[0] : 'Applicant';

  const setStyle = (isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0); 
  };

  const drawHeader = (pageTitle: string) => {
    const headerY = 15;

    if (customLogo) {
      try {
        doc.addImage(customLogo, 'PNG', margin, headerY, 40, 20, undefined, 'FAST');
      } catch (e) {
        console.error("Failed to add custom logo to PDF", e);
      }
    } else {
      doc.setDrawColor(71, 85, 105);
      doc.setLineWidth(0.2);
      doc.circle(margin + 10, headerY + 10, 8, 'S');
      doc.line(margin + 2, headerY + 10, margin + 18, headerY + 10);
      doc.ellipse(margin + 10, headerY + 10, 3, 8, 'S');
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('XPAT', margin + 22, headerY + 12);
      doc.setTextColor(249, 115, 22);
      doc.text('WEB', margin + 44, headerY + 12);
      
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.3);
      doc.line(margin + 22, headerY + 15, margin + 110, headerY + 15);
      
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Work Permit & Expatriate Solutions', margin + 22, headerY + 20);
    }
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(pageTitle, 140, headerY + 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`DATE: ${date}`, 140, headerY + 17);
    doc.text(`REF: ${data.jobTitle.toUpperCase() || 'VISA ASSESSMENT'}`, 140, headerY + 21);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.1);
    doc.line(margin, headerY + 28, pageWidth - margin, headerY + 28);
  };

  const drawFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.line(margin, 280, pageWidth - margin, 280);
    doc.text('© 2024 XPATWEB - Leading Specialists in South African Immigration', margin, 285);
    const disclaimer = 'Disclaimer: Preliminary assessment based on current regulations. Final adjudication remains with the Department of Home Affairs.';
    doc.text(disclaimer, margin, 290);
  };

  // PAGE 1: ASSESSMENT
  drawHeader('VISA ASSESSMENT REPORT');
  let y = 50;

  setStyle(true);
  doc.text(`APPLICANT: ${data.fullName.toUpperCase() || 'VALUED CLIENT'}`, margin, y);
  y += stepHeight * 2;

  doc.setFillColor(meetsRequirements ? 248 : 255, meetsRequirements ? 250 : 241, meetsRequirements ? 252 : 242);
  doc.rect(margin, y, contentWidth, 12, 'F');
  setStyle(true);
  doc.setTextColor(meetsRequirements ? 21 : 185, meetsRequirements ? 128 : 28, meetsRequirements ? 61 : 28);
  doc.text(`PRELIMINARY OUTCOME: ${meetsRequirements ? 'POTENTIALLY QUALIFIED' : 'UNQUALIFIED AT THIS STAGE'}`, margin + 5, y + 8);
  y += stepHeight * 4;

  setStyle(true);
  doc.text('1. POINTS-BASED BREAKDOWN', margin, y);
  doc.setLineWidth(0.1);
  doc.line(margin, y + 1, margin + 55, y + 1);
  y += stepHeight * 2;

  const addLine = (label: string, value: string, pts: number) => {
    setStyle(false);
    doc.text(label, margin, y);
    doc.text(value, margin + 70, y);
    setStyle(true);
    doc.text(`${pts} pts`, margin + 150, y);
    y += stepHeight;
  };

  addLine('Education (NQF)', data.nqfLevel.replace('_', '/'), POINT_VALUES.NQF_LEVEL[data.nqfLevel]);
  addLine('Annual Salary Range', data.salaryRange.replace('_', '-'), POINT_VALUES.SALARY[data.salaryRange]);
  addLine('Years Professional Experience', data.yearsExperience, POINT_VALUES.EXPERIENCE[data.yearsExperience]);
  addLine('English Language Proficiency', data.isLanguageProficient ? 'Yes' : 'No', data.isLanguageProficient ? 10 : 0);
  if (data.isTrustedEmployer) addLine('Offer from Trusted Employer', 'Yes', 30);

  y += stepHeight * 0.5;
  doc.setDrawColor(0);
  doc.line(margin, y, margin + 170, y);
  y += stepHeight * 1.5;
  setStyle(true);
  doc.text('TOTAL SUPPLEMENTARY POINTS:', margin, y);
  doc.text(`${pointsWithoutCSL} / 100`, margin + 150, y);
  y += stepHeight * 3;

  if (matchResult && matchResult.matchType !== 'NONE') {
    setStyle(true);
    doc.text('2. CRITICAL SKILLS LIST VERIFICATION', margin, y);
    doc.line(margin, y + 1, margin + 70, y + 1);
    y += stepHeight * 2;
    
    setStyle(false);
    doc.text(`Identified Category: ${matchResult.officialOccupation}`, margin, y);
    y += stepHeight;
    doc.text('OFO Code: ', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${matchResult.ofoCode || 'N/A'}`, margin + 25, y);
    
    y += stepHeight * 1.5;
    setStyle(false);
    const reason = doc.splitTextToSize(`Verification Insight: ${matchResult.reason}`, contentWidth);
    doc.text(reason, margin, y);
  }

  drawFooter();

  // PAGE 2: COSTING
  if (meetsRequirements) {
    doc.addPage();
    drawHeader('PROFESSIONAL COSTING');
    
    y = 50;
    setStyle(false);
    doc.text(`Dear ${firstName},`, margin, y);
    y += stepHeight * 2;
    doc.text('Trust this email finds you well and thank you for your valued enquiry.', margin, y);
    y += stepHeight * 2.5;

    // VISA OPTIONS
    setStyle(true);
    doc.text('VISA OPTIONS', margin, y);
    doc.line(margin, y + 1, margin + 30, y + 1); // Underline
    y += stepHeight * 1.5;

    setStyle(false);
    doc.text("The following is our comprehensive service offering with regards to the facilitation of your application –", margin, y);
    y += stepHeight * 1.5;

    const offering = [
      "• We will assess your eligibility and confirm correct category, NQF level and Professional Body;",
      "• We will provide you with a full list of required documentation for the Visa application;",
      "• Draft all the required letters to accompany your application;",
      "• Review your documents to ensure compliance with the Immigration Act and regulations;",
      "• Compile your application in the proper format for submission;",
      "• Schedule a call to go through your application with you and address any questions you may have; and",
      "• Book/confirm an appointment for submission."
    ];

    offering.forEach(line => {
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += (split.length * stepHeight);
    });

    y += stepHeight * 2;

    if (qualifiedForGWV) {
      setStyle(true);
      doc.text('1 . GENERAL WORK VISA FACILITATION (POINTS-BASED)', margin, y);
      doc.line(margin, y + 0.5, margin + 110, y + 0.5); // Underline
      y += stepHeight * 1.5;
      
      const gwvText = [
        "You qualify for a General Work Visa based on the points-based system.",
        "The following quintessential documents must be submitted, inter alia, with the general work visa application:",
        "• A certified copy of your passport title page and current visa;",
        "• A letter to be issued by company in support of the application (draft provided by Xpatweb);",
        "• An updated Curriculum Vitae; and",
        "• A copy of the signed employment contract.",
        "",
        "BENEFITS & CONSIDERATIONS:",
        "• Pros: Does not require Professional Body Registration.",
        "• Cons: 5-year wait period for Permanent Residence eligibility.",
        "",
        "PROFESSIONAL FEES:",
        "• Facilitation Fee: R28,860.00 (excl. VAT)",
        "• Disbursement Fees: R2,685.00 (VFS & Embassy)"
      ];
      
      setStyle(false);
      gwvText.forEach(line => {
        const split = doc.splitTextToSize(line, contentWidth);
        doc.text(split, margin, y);
        y += (split.length * stepHeight);
      });
      y += stepHeight * 2;
    }

    if (qualifiedForCSWV) {
      if (y > 180) { doc.addPage(); drawHeader('PROFESSIONAL COSTING'); y = 50; }
      
      setStyle(true);
      const prefix = qualifiedForGWV ? "2" : "1";
      doc.text(`${prefix} . CRITICAL SKILLS WORK VISA FACILITATION`, margin, y);
      doc.line(margin, y + 0.5, margin + 95, y + 0.5); // Underline
      y += stepHeight * 1.5;
      
      const cswvText = [
        "You qualify for a Critical Skills Work Visa based on your occupation match and job offer.",
        "The following quintessential documents must be submitted, inter alia:",
        "• A certified copy of your passport title page and current visa;",
        "• Company support letter (draft provided by Xpatweb);",
        "• Updated Curriculum Vitae and Employment Contract;",
        "• SAQA Certificate of Evaluation; and",
        "• Proof of registration with the relevant Professional Body.",
        "",
        "BENEFITS & CONSIDERATIONS:",
        "• Pros: Immediate eligibility for Permanent Residence application upon visa issuance.",
        "• Cons: Mandatory Professional Body registration and SAQA verification required.",
        "",
        "PROFESSIONAL FEES:",
        "• Facilitation Fee: R36,120.00 (excl. VAT)",
        "• Disbursement Fees: approx. R4,020.00"
      ];
      
      setStyle(false);
      cswvText.forEach(line => {
        const split = doc.splitTextToSize(line, contentWidth);
        doc.text(split, margin, y);
        y += (split.length * stepHeight);
      });
    }

    if (y > 230) { doc.addPage(); drawHeader('PROFESSIONAL COSTING'); y = 50; }
    
    y += stepHeight * 2;
    setStyle(true);
    doc.text('Should you wish to proceed please provide me with the following:', margin, y);
    y += stepHeight;
    setStyle(false);
    doc.text('• Current Passport Copy; and', margin + 5, y);
    y += stepHeight;
    doc.text('• Physical address for Terms of Engagement preparation.', margin + 5, y);
    
    y += stepHeight * 3;
    doc.setFont('helvetica', 'italic');
    doc.text('Looking forward to hearing from you.', margin, y);
    
    drawFooter();
  }

  const filename = data.fullName 
    ? `XPATWEB_Assessment_${data.fullName.replace(/\s+/g, '_')}.pdf`
    : `XPATWEB_Assessment_Report.pdf`;

  doc.save(filename);
};
