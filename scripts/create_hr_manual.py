from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT = r"G:\ANSAR WEBSITE\ansar_website\ansar_website\HR Careers Recruitment Portal User Manual.docx"
doc = Document(); sec = doc.sections[0]
sec.top_margin = Inches(.65); sec.bottom_margin = Inches(.65); sec.left_margin = Inches(.75); sec.right_margin = Inches(.75)
styles = doc.styles
styles['Normal'].font.name = 'Aptos'; styles['Normal'].font.size = Pt(10.5); styles['Normal'].paragraph_format.space_after = Pt(5)
for name, size, color in [('Title', 25, '073F42'), ('Heading 1', 18, '073F42'), ('Heading 2', 13, '0D5360'), ('Heading 3', 11, '0F766E')]:
    s = styles[name]; s.font.name = 'Aptos Display'; s.font.size = Pt(size); s.font.bold = True; s.font.color.rgb = RGBColor.from_string(color)
def shade(cell, fill):
    p = cell._tc.get_or_add_tcPr(); x = OxmlElement('w:shd'); x.set(qn('w:fill'), fill); p.append(x)
def table(rows):
    t = doc.add_table(rows=0, cols=len(rows[0])); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.style = 'Table Grid'
    for ri, row in enumerate(rows):
        cells = t.add_row().cells
        for ci, value in enumerate(row):
            cells[ci].text = value
            for p in cells[ci].paragraphs: p.paragraph_format.space_after = Pt(3); p.paragraph_format.space_before = Pt(3)
            if ri == 0:
                shade(cells[ci], '073F42')
                for r in cells[ci].paragraphs[0].runs: r.bold = True; r.font.color.rgb = RGBColor(255,255,255)
            elif ri % 2 == 0: shade(cells[ci], 'F2F7F7')
    return t
def bullet(text): doc.add_paragraph(text, style='List Bullet')
def step(text): doc.add_paragraph(text, style='List Number')
def note(label, text):
    p = doc.add_paragraph(); r = p.add_run(label + ': '); r.bold = True; p.add_run(text)

p = doc.add_paragraph(style='Title'); p.add_run('HR Careers Recruitment Portal User Manual')
p = doc.add_paragraph(); r = p.add_run('Ansar English School | HR and authorised administrators'); r.bold = True; r.font.color.rgb = RGBColor(13,83,96)
doc.add_paragraph('This manual explains how to sign in, publish vacancies, review applications, open candidate documents, update recruitment status, contact candidates through WhatsApp, and manage records safely.')
table([['Quick reference','Details'],['HR portal','https://hiring.ansarschool.in'],['Public careers page','https://ansarschool.in/hiring'],['Authorised HR account','hr@ansarschool.in'],['Candidate files','Private Firebase Storage files visible to authorised HR/Admin users']])

doc.add_heading('1 Recruitment workflow', 1)
doc.add_paragraph('The portal uses one shared live recruitment record. HR and authorised administrators see the same vacancies and applications.')
for x in ['HR publishes a vacancy.', 'The vacancy appears on the public careers page.', 'A candidate submits personal details, a PDF resume, and a JPG/PNG photograph.', 'The application appears in the HR Applications tab.', 'HR reviews documents and changes the recruitment status.', 'WhatsApp opens with a prefilled message when the status changes; HR reviews and sends it.', 'Disabling or expiring a vacancy hides its public card but preserves applications and recruitment records.']: bullet(x)

doc.add_heading('2 Login and access', 1)
doc.add_paragraph('Candidates do not use the HR login. They use the public careers page. HR uses the private hiring subdomain.')
for x in ['Open https://hiring.ansarschool.in.', 'Sign in using the approved Firebase/Google account shown by the login screen.', 'Use hr@ansarschool.in for the HR account unless the website administrator has approved another account.', 'If access is denied, sign out of other Google accounts and sign in again with the authorised account.', 'Do not share passwords or use a personal account for recruitment work.']: step(x)
note('Device notifications', 'Select Allow when the browser asks for HR application notifications. If blocked, open browser site settings for hiring.ansarschool.in, allow Notifications, reload, and sign in again.')

doc.add_heading('3 Dashboard pages and tabs', 1)
table([['Page or tab','What it contains','What HR does there'],['Overview','Published vacancies, total applications, new applications, and shortlisted count.','Check the daily recruitment workload.'],['Vacancies','Add vacancy form and existing vacancy cards.','Create, edit, publish, enable, disable, and close roles.'],['Applications','Candidate pipeline with search, documents, status dropdown, and delete action.','Review candidates, open files, contact candidates, update progress, and delete authorised records.'],['Document viewer','Candidate details, resume preview, photo preview, download controls.','Read and save authorised recruitment documents.']])

doc.add_heading('4 Create and publish a vacancy', 1)
doc.add_paragraph('A vacancy is the public job card candidates read before applying. Complete every field accurately.')
for x in ['Open Vacancies.', 'Enter a clear Job title, such as Subject Teacher.', 'Enter Department / category.', 'Write the Short job description with responsibilities and school section.', 'Enter Required qualification and Required experience.', 'Set the Closing date if the role should close automatically.', 'Choose Full-time, Temporary, or Contract.', 'Select Publish vacancy when ready for public viewing.', 'Keep Public ON enabled to show the card on the school website.', 'Select Save vacancy.', 'Open https://ansarschool.in/hiring and confirm the card is visible.']: step(x)
note('Before publishing', 'Check spelling, qualification requirements, experience, employment type, and closing date. Candidates rely on this information.')

doc.add_heading('5 Edit, disable, or close a vacancy', 1)
for x in ['Open Vacancies and select Edit on the role.', 'Update the required field and save.', 'To stop accepting applications, turn Public ON off or disable the role.', 'Do not delete a vacancy merely because it has closed. Disabling it hides the card while retaining recruitment history.', 'Confirm the public card is no longer visible after disabling.']: step(x)

doc.add_heading('6 Review applications', 1)
doc.add_paragraph('Applications is the live candidate pipeline. Search by candidate name or application ID.')
for x in ['Open Applications.', 'Use the search box to find a candidate or application reference.', 'Select View files.', 'Read the candidate details: contact information, date of birth, address, qualifications, institution, completion year, experience, previous employment, skills, and additional information.', 'Select View PDF to read the resume.', 'Select Download PDF only when an authorised local copy is required.', 'Select View photo to inspect the photograph.', 'Select Download photo only when required for the approved recruitment process.']: step(x)
note('Confidentiality', 'Candidate information and documents are confidential. Do not forward, publish, or store copies outside approved HR systems.')

doc.add_heading('7 Recruitment statuses', 1)
table([['Status','Meaning','Next action'],['New Application','Received but not yet reviewed.','Check form and files.'],['Under Review','HR is evaluating the candidate.','Compare requirements and qualifications.'],['Shortlisted','Candidate passed initial screening.','Contact candidate and arrange next stage.'],['Interview Scheduled','Interview arrangements are confirmed.','Confirm date, time, and method.'],['Selected','Candidate is chosen.','Follow appointment and joining procedure.'],['Rejected','Candidate will not proceed.','Use the approved HR communication process.']])
doc.add_heading('8 Change status and contact the candidate', 1)
for x in ['Open Applications and locate the candidate.', 'Select the status dropdown and choose the new status.', 'Wait until the row updates; do not repeatedly click the dropdown.', 'WhatsApp Web or the WhatsApp app opens for the candidate number with a prefilled message.', 'Check the number, candidate name, position, status, and application reference.', 'Press Send in WhatsApp. HR must send the message manually.', 'The email notification is currently paused until ansar.in is verified in Resend. Status changes remain fully usable.']: step(x)
note('Phone numbers', 'A normal Indian 10-digit number is prefixed with 91. If the candidate entered the wrong number, verify the correct number before sending.')

doc.add_heading('9 Candidate document rules', 1)
table([['Document','Allowed format','Limit'],['Resume / CV','PDF','5 MB maximum'],['Recent photograph','JPG or PNG','2 MB maximum']])
doc.add_paragraph('Files are stored in Firebase Storage under the application reference. Public visitors cannot access them. Authorised HR/Admin users can view and download them through the document viewer.')

doc.add_heading('10 Delete an application', 1)
for x in ['Confirm the application ID and candidate name.', 'Obtain the required HR approval before deleting.', 'Select Delete.', 'Confirm the action.', 'The Firestore application record and associated Firebase Storage files are deleted.']: step(x)
note('Warning', 'Deletion is permanent from the admin workflow. Do not delete records to close a vacancy; disable the vacancy instead.')

doc.add_heading('11 Notifications', 1)
doc.add_heading('New application alert', 2)
doc.add_paragraph('When a candidate submits an application, HR devices that allowed browser notifications can receive a new-application alert. If alerts are unavailable, the application still appears in Applications.')
doc.add_heading('Candidate WhatsApp message', 2)
doc.add_paragraph('Changing status opens a WhatsApp conversation with a prefilled message. HR must review and press Send. This works independently of email.')
doc.add_heading('Candidate email', 2)
doc.add_paragraph('Automated email is intentionally held until the ansar.in sending domain is verified in Resend. This pause prevents failed email errors and does not affect applications, status changes, or WhatsApp.')

doc.add_heading('12 Candidate-facing application process', 1)
for x in ['Candidate opens https://ansarschool.in/hiring.', 'Candidate selects Apply now on a vacancy.', 'Candidate completes the form.', 'Date of birth is entered as DD/MM/YYYY.', 'Candidate selects a PDF resume up to 5 MB.', 'Candidate selects a JPG/PNG photograph up to 2 MB.', 'Candidate selects Submit application once.', 'The application reference and Under Review confirmation appear after successful submission.', 'The candidate is redirected to the school home page after the confirmation period.']: step(x)

doc.add_heading('13 Troubleshooting', 1)
table([['Problem','Action'],['Login denied','Use the authorised HR/Admin account. Sign out of other accounts and reload.'],['No notification','Allow browser notifications for hiring.ansarschool.in. Check Applications manually.'],['Vacancy not public','Check Publish vacancy, Public ON, enabled state, and closing date.'],['No applications shown','Refresh, open Applications, and confirm the account has HR/Admin access.'],['Files do not open','Confirm authorised login, refresh, and select View files again.'],['WhatsApp does not open','Allow pop-ups for hiring.ansarschool.in and verify the mobile number.'],['Upload rejected','Resume must be PDF <= 5 MB; photo must be JPG/PNG <= 2 MB.'],['Email not received','Email is paused until ansar.in is verified. Use WhatsApp meanwhile.'],['Status update fails','Check internet, reload once, and record the application ID for the website administrator.']])

doc.add_heading('14 Daily HR procedure', 1)
for x in ['Sign in to hiring.ansarschool.in.', 'Check Overview for new applications.', 'Review each new candidate in Applications.', 'Open and inspect the resume and photograph.', 'Set Under Review after initial checking.', 'Set Shortlisted for candidates moving forward and send the WhatsApp message.', 'Set Interview Scheduled once the interview is agreed.', 'Set Selected or Rejected after the approved decision.', 'Disable vacancies that are no longer accepting applications.', 'Keep documents confidential and delete only with authorisation.']: step(x)

doc.add_heading('15 Security checklist', 1)
for x in ['Never share HR login details.', 'Use only authorised HR/Admin accounts.', 'Do not download candidate documents unnecessarily.', 'Confirm candidate and application ID before changing status or deleting.', 'Use a trusted device and sign out on shared computers.', 'Report incorrect records, suspicious access, or missing documents immediately.']: bullet(x)

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; r = p.add_run('End of manual'); r.bold = True; r.font.color.rgb = RGBColor(13,83,96)
for s in doc.sections:
    p = s.footer.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.add_run('Ansar English School Careers and Recruitment | HR User Manual').font.size = Pt(8)
doc.core_properties.title = 'HR Careers Recruitment Portal User Manual'; doc.core_properties.author = 'Ansar English School'
doc.save(OUT); print(OUT)
