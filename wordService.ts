
import { AssessmentData, MatchResult, NQFLevel, SalaryRange, ExperienceRange } from './types';
import { POINT_VALUES, MINIMUM_POINTS_REQUIRED } from './constants';

export const generateAssessmentWord = (data: AssessmentData, matchResult: MatchResult | null, totalPoints: number, customLogo?: string) => {
  const date = new Date().toLocaleDateString();
  const pointsWithoutCSL = totalPoints - (data.isOccupationOnList ? 100 : 0);
  const qualifiedForCSWV = data.isOccupationOnList && data.hasMandatoryOffer;
  const qualifiedForGWV = pointsWithoutCSL >= MINIMUM_POINTS_REQUIRED && data.hasMandatoryOffer;
  const meetsRequirements = qualifiedForCSWV || qualifiedForGWV;
  const firstName = data.fullName ? data.fullName.split(' ')[0] : 'Applicant';

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Assessment Report</title>
      <style>
        @page {
          margin: 0.5in 0.5in 0.5in 0.25in; /* top right bottom left - tighter left margin */
        }
        body { 
          font-family: "Calibri", sans-serif; 
          font-size: 11pt; 
          line-height: 1.15; 
          color: black; 
          margin: 0; /* Remove body margin to rely on @page margin for the "sooner" look */
        }
        p, li, h1, h2 { 
          margin-top: 0pt; 
          margin-bottom: 0pt; 
        }
        h1 { 
          font-size: 14pt; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 2pt; 
          margin-bottom: 12pt; 
          font-weight: bold; 
        }
        h2 { 
          font-size: 11pt; 
          text-decoration: underline; 
          margin-top: 12pt; 
          margin-bottom: 6pt; 
          font-weight: bold; 
        }
        .banner { 
          background-color: #f8fafc; 
          padding: 8pt; 
          border: 1px solid #e2e8f0; 
          margin-top: 11pt; 
          margin-bottom: 11pt; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 6pt; 
          margin-bottom: 6pt; 
        }
        td { 
          padding: 2pt; 
          vertical-align: top; 
        }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .footer { 
          font-size: 8pt; 
          color: #94a3b8; 
          margin-top: 22pt; 
          border-top: 1px solid #e2e8f0; 
          padding-top: 6pt; 
        }
        .logo { 
          max-width: 250px; 
          max-height: 100px; 
          margin-bottom: 12pt; 
        }
        ul { 
          margin-top: 6pt; 
          margin-bottom: 11pt; 
          padding-left: 18pt; 
        }
        li { 
          margin-bottom: 1pt; 
        }
        .line-break { 
          height: 11pt; 
        }
      </style>
    </head>
    <body>
      <div style="text-align: right; font-size: 8pt;">DATE: ${date}</div>
      
      <div style="margin-bottom: 12pt;">
        ${customLogo ? `<img src="${customLogo}" class="logo" />` : `<div style="font-size: 20pt; font-weight: bold; color: #1e293b;">XPAT<span style="color: #f97316;">WEB</span></div><div style="font-size: 9pt; color: #64748b;">Work Permit & Expatriate Solutions</div>`}
      </div>

      <h1>VISA ASSESSMENT REPORT</h1>
      
      <p class="bold">APPLICANT: ${data.fullName.toUpperCase() || 'VALUED CLIENT'}</p>
      <div class="line-break"></div>
      
      <div class="banner bold">
        PRELIMINARY OUTCOME: ${meetsRequirements ? 'POTENTIALLY QUALIFIED' : 'UNQUALIFIED AT THIS STAGE'}
      </div>

      <h2>1. POINTS-BASED BREAKDOWN</h2>
      <table>
        <tr><td style="width: 50%;">Education (NQF)</td><td style="width: 30%;">${data.nqfLevel.replace('_', '/')}</td><td class="bold">${POINT_VALUES.NQF_LEVEL[data.nqfLevel]} pts</td></tr>
        <tr><td>Annual Salary Range</td><td>${data.salaryRange.replace('_', '-')}</td><td class="bold">${POINT_VALUES.SALARY[data.salaryRange]} pts</td></tr>
        <tr><td>Years Professional Experience</td><td>${data.yearsExperience}</td><td class="bold">${POINT_VALUES.EXPERIENCE[data.yearsExperience]} pts</td></tr>
        <tr><td>English Language Proficiency</td><td>${data.isLanguageProficient ? 'Yes' : 'No'}</td><td class="bold">${data.isLanguageProficient ? 10 : 0} pts</td></tr>
        ${data.isTrustedEmployer ? `<tr><td>Offer from Trusted Employer</td><td>Yes</td><td class="bold">30 pts</td></tr>` : ''}
      </table>
      <div style="border-top: 1px solid black; margin-top: 5pt; padding-top: 5pt;">
        <p class="bold">TOTAL SUPPLEMENTARY POINTS: ${pointsWithoutCSL} / 100</p>
      </div>

      ${matchResult && matchResult.matchType !== 'NONE' ? `
        <h2>2. CRITICAL SKILLS LIST VERIFICATION</h2>
        <p>Identified Category: ${matchResult.officialOccupation}</p>
        <p>OFO Code: <span class="bold">${matchResult.ofoCode || 'N/A'}</span></p>
        <p>Verification Insight: ${matchResult.reason}</p>
      ` : ''}

      ${meetsRequirements ? `
        <br clear=all style='page-break-before:always'>
        <div style="margin-bottom: 12pt;">
          ${customLogo ? `<img src="${customLogo}" class="logo" />` : `<div style="font-size: 20pt; font-weight: bold; color: #1e293b;">XPAT<span style="color: #f97316;">WEB</span></div><div style="font-size: 9pt; color: #64748b;">Work Permit & Expatriate Solutions</div>`}
        </div>
        <h1>PROFESSIONAL COSTING</h1>
        <p>Dear ${firstName},</p>
        <div class="line-break"></div>
        <p>Trust this email finds you well and thank you for your valued enquiry.</p>

        <h2>VISA OPTIONS</h2>
        <p>The following is our comprehensive service offering with regards to the facilitation of your application –</p>
        <ul>
          <li>We will assess your eligibility and confirm correct category, NQF level and Professional Body;</li>
          <li>We will provide you with a full list of required documentation for the Visa application;</li>
          <li>Draft all the required letters to accompany your application;</li>
          <li>Review your documents to ensure compliance with the Immigration Act and regulations;</li>
          <li>Compile your application in the proper format for submission;</li>
          <li>Schedule a call to go through your application with you and address any questions you may have; and</li>
          <li>Book/confirm an appointment for submission.</li>
        </ul>

        ${qualifiedForGWV ? `
          <h2>1 . GENERAL WORK VISA FACILITATION (POINTS-BASED)</h2>
          <p>You qualify for a General Work Visa based on the points-based system.</p>
          <div class="line-break"></div>
          <p>The following quintessential documents must be submitted, inter alia, with the general work visa application:</p>
          <ul>
            <li>A certified copy of your passport title page and current visa;</li>
            <li>A letter to be issued by company in support of the application (draft provided by Xpatweb);</li>
            <li>An updated Curriculum Vitae; and</li>
            <li>A copy of the signed employment contract.</li>
          </ul>
          <p class="bold">BENEFITS & CONSIDERATIONS:</p>
          <ul>
            <li>Pros: Does not require Professional Body Registration.</li>
            <li>Cons: 5-year wait period for Permanent Residence eligibility.</li>
          </ul>
          <p class="bold">PROFESSIONAL FEES:</p>
          <ul>
            <li>Facilitation Fee: R28,860.00 (excl. VAT)</li>
            <li>Disbursement Fees: R2,685.00 (VFS & Embassy)</li>
          </ul>
        ` : ''}

        ${qualifiedForCSWV ? `
          <h2>${qualifiedForGWV ? '2' : '1'} . CRITICAL SKILLS WORK VISA FACILITATION</h2>
          <p>You qualify for a Critical Skills Work Visa based on your occupation match and job offer.</p>
          <div class="line-break"></div>
          <p>The following quintessential documents must be submitted, inter alia:</p>
          <ul>
            <li>A certified copy of your passport title page and current visa;</li>
            <li>Company support letter (draft provided by Xpatweb);</li>
            <li>Updated Curriculum Vitae and Employment Contract;</li>
            <li>SAQA Certificate of Evaluation; and</li>
            <li>Proof of registration with the relevant Professional Body.</li>
          </ul>
          <p class="bold">BENEFITS & CONSIDERATIONS:</p>
          <ul>
            <li>Pros: Immediate eligibility for Permanent Residence application upon visa issuance.</li>
            <li>Cons: Mandatory Professional Body registration and SAQA verification required.</li>
          </ul>
          <p class="bold">PROFESSIONAL FEES:</p>
          <ul>
            <li>Facilitation Fee: R36,120.00 (excl. VAT)</li>
            <li>Disbursement Fees: approx. R4,020.00</li>
          </ul>
        ` : ''}

        <div class="line-break"></div>
        <p class="bold">Should you wish to proceed please provide me with the following:</p>
        <ul>
          <li>Current Passport Copy; and</li>
          <li>Physical address for Terms of Engagement preparation.</li>
        </ul>
        <div class="line-break"></div>
        <p class="italic">Looking forward to hearing from you.</p>
      ` : ''}

      <div class="footer">
        © 2024 XPATWEB - Leading Specialists in South African Immigration
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = data.fullName 
    ? `XPATWEB_Assessment_${data.fullName.replace(/\s+/g, '_')}.doc`
    : `XPATWEB_Assessment_Report.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
