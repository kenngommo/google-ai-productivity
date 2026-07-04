import sys
import os

# Append the user installation path for fpdf2
sys.path.append(r"C:\Users\Lecoo\AppData\Roaming\Python\Python313\site-packages")

from fpdf import FPDF

class CustomPDF(FPDF):
    def __init__(self, doc_type="playbook"):
        super().__init__()
        self.doc_type = doc_type
        self.set_margins(18, 18, 18)
        self.alias_nb_pages()
        
    def header(self):
        if self.page_no() == 1:
            return  # No header on cover page
        
        # Top banner with Google branding colors
        self.set_fill_color(66, 133, 244) # Blue
        self.rect(0, 0, 52, 4, 'F')
        self.set_fill_color(234, 67, 53) # Red
        self.rect(52, 0, 52, 4, 'F')
        self.set_fill_color(251, 188, 4) # Yellow
        self.rect(104, 0, 52, 4, 'F')
        self.set_fill_color(52, 168, 83) # Green
        self.rect(156, 0, 54, 4, 'F')
        
        self.set_y(8)
        self.set_font('helvetica', 'B', 8)
        self.set_text_color(100, 116, 139) # slate-500
        
        if self.doc_type == "playbook":
            self.cell(0, 10, "GEMINI PROMPT PLAYBOOK", border=0, align='L')
            self.set_font('helvetica', '', 8)
            self.cell(0, 10, "50+ Copy-Paste Office Prompts", border=0, align='R')
        else:
            self.cell(0, 10, "WORKSPACE AI STARTER GUIDE", border=0, align='L')
            self.set_font('helvetica', '', 8)
            self.cell(0, 10, "AI Automation Readiness Checklist", border=0, align='R')
            
        self.ln(10)
        self.set_draw_color(226, 232, 240) # slate-200
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(148, 163, 184) # slate-400
        self.cell(0, 10, "GeminiFlow AI Productivity Toolkit  |  Confidential & Proprietary", border=0, align='L')
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", border=0, align='R')

    def add_cover_page(self):
        self.add_page()
        
        # Color bar on the left margin
        self.set_fill_color(66, 133, 244) # Blue
        self.rect(0, 0, 6, 297, 'F')
        
        self.ln(35)
        
        # Category/Tag
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(66, 133, 244) # Blue
        self.cell(0, 6, "GEMINIFLOW EXCLUSIVE RESOURCE", ln=1)
        self.ln(3)
        
        # Title
        self.set_font('helvetica', 'B', 32)
        self.set_text_color(15, 23, 42) # slate-900
        if self.doc_type == "playbook":
            self.multi_cell(0, 12, "Gemini Prompt\nPlaybook")
            self.ln(10)
            
            # Subtitle
            self.set_font('helvetica', '', 14)
            self.set_text_color(71, 85, 105) # slate-600
            self.multi_cell(0, 7, "50+ copy-paste prompts designed specifically for office administration, scheduling, sheet parsing, and report writing.")
        else:
            self.multi_cell(0, 12, "Workspace AI\nStarter Guide")
            self.ln(10)
            
            # Subtitle
            self.set_font('helvetica', '', 14)
            self.set_text_color(71, 85, 105) # slate-600
            self.multi_cell(0, 7, "A checklist of admin switches, browser shortcuts, and sidebar configurations to get your Google Workspace ready for AI automation.")
            
        self.ln(30)
        
        # Accent separator
        self.set_fill_color(226, 232, 240)
        self.rect(24, self.get_y(), 60, 1, 'F')
        self.ln(15)
        
        # Author / Info block
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(15, 23, 42)
        self.cell(0, 6, "Created by GeminiFlow Training Team", ln=1)
        
        self.set_font('helvetica', '', 9)
        self.set_text_color(100, 116, 139)
        self.cell(0, 5, "Version 1.0 (June 2026)", ln=1)
        self.cell(0, 5, "Target Audience: Office Admins, Operations, & Executives", ln=1)
        
        self.ln(45)
        
        # Small branding note
        self.set_font('helvetica', 'B', 9)
        self.set_text_color(52, 168, 83) # Green
        self.cell(0, 5, "Accelerate your daily workflow by 10x with Google Gemini integration.", ln=1)

    def add_section_header(self, title):
        self.ln(8)
        self.set_font('helvetica', 'B', 14)
        self.set_text_color(15, 23, 42) # slate-900
        self.cell(0, 10, title, ln=1)
        self.set_draw_color(66, 133, 244) # Blue accent line
        self.set_line_width(0.5)
        self.line(self.get_x(), self.get_y(), self.get_x() + 40, self.get_y())
        self.ln(6)
        self.set_line_width(0.2) # reset

    def add_prompt_card(self, num, title, desc, prompt_text):
        # Prevent page breaks in the middle of a card if possible
        # Check height: estimated height is title(6) + desc(10) + prompt(multi_cell lines * 5) + padding
        # Let's check remaining height on page, if < 60, start new page
        if self.get_y() > 220:
            self.add_page()
            
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(66, 133, 244) # Blue
        self.cell(10, 6, f"#{num}", ln=0)
        self.set_text_color(15, 23, 42)
        self.cell(0, 6, title, ln=1)
        
        self.set_font('helvetica', 'I', 8.5)
        self.set_text_color(100, 116, 139)
        self.multi_cell(0, 4.5, f"Use case: {desc}")
        self.ln(1.5)
        
        # Prompt Box
        self.set_font('courier', '', 8.5)
        self.set_text_color(15, 23, 42)
        self.set_fill_color(248, 250, 252) # slate-50
        self.set_draw_color(226, 232, 240) # slate-200
        
        # Render prompt text
        self.multi_cell(0, 4.5, prompt_text.strip(), border=1, fill=True)
        self.ln(5)

def build_playbook_pdf(output_path):
    pdf = CustomPDF(doc_type="playbook")
    pdf.add_cover_page()
    
    # Page 2: Intro & TOC
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Introduction", ln=1)
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    intro_text = (
        "Welcome to the Gemini Prompt Playbook. This guide provides highly tailored, "
        "copy-paste prompts optimized for office operations, administrative tasks, spreadsheet calculations, "
        "and content polishing. By utilizing these prompts, administrative teams can eliminate repetitive work, "
        "streamline scheduling, format complex documents, and speed up reporting by 10x.\n\n"
        "How to use this playbook:\n"
        "1. Copy the text inside the prompt boxes.\n"
        "2. Replace any bracketed text [like this] with your actual business data or context.\n"
        "3. Paste the prompt directly into Google Gemini (gemini.google.com) or the Gemini side panel in Google Workspace."
    )
    pdf.multi_cell(0, 5, intro_text)
    pdf.ln(8)
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 8, "Table of Contents", ln=1)
    
    toc = [
        ("Section 1: Office Administration & Communications", "Prompts #1 - #15"),
        ("Section 2: Calendar, Scheduling & Event Planning", "Prompts #16 - #27"),
        ("Section 3: Spreadsheet Formulas & Data Analysis", "Prompts #28 - #40"),
        ("Section 4: Report Writing, Editing & Summarization", "Prompts #41 - #51")
    ]
    
    pdf.set_font('helvetica', '', 9.5)
    for title, pages in toc:
        pdf.cell(120, 6, title, border=0)
        pdf.cell(0, 6, pages, border=0, align='R', ln=1)
        
    # --- SECTION 1 ---
    pdf.add_page()
    pdf.add_section_header("Section 1: Office Administration & Communications")
    
    s1_prompts = [
        ("Meeting Minutes Summarizer", "Translate raw transcript notes into structured meeting minutes.", 
         "Act as an expert administrative assistant. Read the raw, chaotic meeting notes below and organize them into professional meeting minutes. Use this structure: 1) Meeting Topic & Date (estimate from text), 2) Attendee List (if mentioned), 3) Key Discussion Points (summarized in bullets), 4) Action Items (table with Columns: Task, Assigned To, Deadline). Keep the tone professional and concise.\n\nRaw Notes:\n[Insert raw notes/transcript here]"),
        
        ("SOP Generator", "Generate a Standard Operating Procedure (SOP) draft for common tasks.",
         "Create a comprehensive, step-by-step Standard Operating Procedure (SOP) for [insert task, e.g., processing weekly travel expense reports]. The SOP must include: 1) Objective, 2) Prerequisites/Systems Needed, 3) Detailed Step-by-Step Instructions, 4) Troubleshooting common issues, and 5) Approvals/Review timeline. Format with clear subheadings and bullet points."),
         
        ("Email Tone Adjuster", "Change email draft to be polite yet assertive.",
         "Rewrite the following draft email to [insert recipient role, e.g., vendor] requesting [insert request, e.g., the delayed invoices]. The tone should be highly professional, polite, yet firm and assertive about the deadline. Maintain clarity and keep it under 150 words.\n\nDraft Email:\n[Insert draft here]"),
         
        ("Policy Simplifier", "Translate legal policies into plain, employee-friendly text.",
         "Analyze the corporate policy excerpt below. Translate it into clear, plain English (or Vietnamese if input is VI) that any employee can easily understand. Create a 'Key Takeaways' bulleted section at the top, followed by a 'What you need to do' section. Remove all complex legal jargon.\n\nPolicy Excerpt:\n[Insert policy here]"),
         
        ("Internal Newsletter Draft", "Write a monthly office announcement/newsletter.",
         "Draft a monthly internal newsletter for our team. Include sections for: 1) A warm greeting from management, 2) Spotlights on key team achievements this month: [achievements], 3) Upcoming office events: [events], and 4) Reminders about the upcoming office holiday schedule: [dates]. Tone should be engaging, friendly, and collaborative."),
         
        ("Project Kickoff Announcement", "Notify the company or team about a new project launch.",
         "Draft a professional internal email announcing the launch of [Project Name]. Explain: 1) The core objective of the project, 2) Why it matters to the company, 3) Key milestones, and 4) How employees can reach out if they have questions. Set the tone to be inspiring and informative."),
         
        ("New Client Onboarding Checklist", "Create a standard checklist for onboarding clients.",
         "Generate a detailed checklist of administrative tasks required to onboard a new client in [industry/type of business]. Group the checklist into 3 phases: 1) Pre-onboarding (contracts, system setup), 2) Welcome phase (orientation, scheduling first call), and 3) Post-launch (feedback loop, weekly status setups)."),
         
        ("Standard Document Template", "Generate a blank template framework for reports.",
         "Design an outline framework template for a [insert document type, e.g., Monthly Sales Performance Report]. Provide the exact headings, subheadings, and brief instructions in brackets of what information should be filled in under each section. This will be used as a reusable template."),
         
        ("Office FAQ Document", "Draft an FAQ page based on basic office rules.",
         "Write an FAQ (Frequently Asked Questions) document containing 8 common questions and clear answers about [insert topic, e.g., remote work hybrid schedule, office parking permissions, or keycard access]. Use clear, friendly, and definitive language."),
         
        ("Official Corporate Memo", "Draft an official memo from the executive team.",
         "Draft an official company memo. Sender: [Executive Team/Name], Recipient: [All Staff], Date: [Today's Date], Subject: [Subject, e.g., Transition to new ERP system]. The memo must clearly communicate: 1) The change occurring, 2) Effective date, 3) Specific actions expected from staff, and 4) Contact details for questions. Tone must be authoritative yet helpful."),
         
        ("Out of Office Email", "Create professional, structured out-of-office replies.",
         "Draft three variations of an Out-of-Office (OOO) email auto-reply for my upcoming vacation from [Start Date] to [End Date]. Variation 1: Standard professional (directs urgent requests to [Name/Email]). Variation 2: Friendly/Casual for internal teammates. Variation 3: Short and direct for external clients. Ensure brackets are clear for easy filling."),
         
        ("New Employee Checklist", "Create an onboarding checklist for the HR/Admin side.",
         "Create a checklist for HR and Admin teams to prepare for a new employee's first week. Include tasks for: 1) IT/Hardware provisioning, 2) Software/Account setups (Slack, Email, Workspace), 3) HR documentation (contracts, bank details), and 4) Welcome activities (buddy system assignment, lunch setup)."),
         
        ("Document Clean-up & Formatting", "Polish raw notes into a structured, readable document.",
         "Review the raw, unformatted text below. Clean up any obvious grammar/spelling issues, add appropriate headers and bullet points where logical, and format it into a highly readable, professional document fit for executive review.\n\nRaw Text:\n[Insert text here]"),
         
        ("Multilingual Email Translator", "Translate an email accurately while retaining business tone.",
         "Translate the following business email from [Source Language, e.g., English] to [Target Language, e.g., Vietnamese]. Ensure the translation uses proper corporate grammar, polite idioms specific to the target language, and maintains a highly respectful, cooperative business tone.\n\nEmail Text:\n[Insert email here]"),
         
        ("Expense Claim Review Template", "Draft description text for submitted claims.",
         "Write a short, standardized description for an expense reimbursement claim. The claim is for [expense reason, e.g., hosting a dinner for Client XYZ on June 22]. Include fields for Date, Purpose, Attendees, Total Amount, and Project Code to ensure finance audits go smoothly.")
    ]
    
    for i, (title, desc, prompt) in enumerate(s1_prompts):
        pdf.add_prompt_card(i+1, title, desc, prompt)
        
    # --- SECTION 2 ---
    pdf.add_page()
    pdf.add_section_header("Section 2: Calendar, Scheduling & Event Planning")
    
    s2_prompts = [
        ("Calendar Conflict Resolution", "Draft an email resolving multiple calendar clashes.",
         "Draft a polite email to [Client/Stakeholder Name] explaining that we have a scheduling conflict for our meeting on [Date/Time]. Suggest three alternative timeslots: [Slot 1, Slot 2, Slot 3]. Ask them to confirm which slot works best, or to propose a time of their convenience. Keep the tone warm and highly flexible."),
         
        ("VIP Visit Itinerary", "Design a structured itinerary for a VIP client visiting the office.",
         "Create a detailed, minute-by-minute itinerary for a VIP guest visiting our headquarters on [Date]. The visit is from [Start Time] to [End Time]. Include slots for: arrival & welcome coffee, office tour, main executive presentation, catered lunch, product demo, and wrap-up discussion. Include placeholders for assigned hosts for each segment."),
         
        ("Business Travel Planner", "Organize flights, hotels, and meetings into a compact guide.",
         "Create a consolidated business travel itinerary table based on this raw information: [Insert flight numbers, departure times, hotel booking details, and meeting schedules]. The output must be a clean, chronological markdown table showing Date, Time, Activity/Event, Location, and Confirmation/Notes."),
         
        ("Project Timeline Estimator", "Estimate dates and durations based on milestones.",
         "Given a project starting on [Start Date] with a total duration of [Duration, e.g., 6 weeks], list the estimated start and end dates for the following standard project phases: 1) Discovery & Kickoff (10%), 2) Design & Planning (20%), 3) Execution & Development (50%), 4) Review & QA (10%), and 5) Launch (10%). Adjust percentage durations based on standard practices if necessary."),
         
        ("Scrum Sprint Planning Agenda", "Organize a sprint kickoff meeting structure.",
         "Create a 45-minute sprint planning meeting agenda for a software team. Break it down into timed blocks (e.g., 5 mins, 10 mins). For each block, specify: 1) Goal/Objective, 2) Presenter/Lead, and 3) Discussion topics (e.g., backlog review, capacity planning, task commitment)."),
         
        ("Workshop Agenda Builder", "Plan a half-day corporate training workshop.",
         "Design a detailed agenda for a half-day (4-hour) training workshop on [topic, e.g., AI productivity tools]. The agenda must include: 1) Introduction/Icebreaker, 2) Session 1 (Core concepts), 3) Mid-session break, 4) Session 2 (Hands-on exercise), 5) Q&A session, and 6) Feedback & closing. Provide suggested durations and interactive prompt ideas for the facilitator."),
         
        ("Shift Rotation Schedule Creator", "Draft guidelines for managing shift allocations.",
         "Create a policy outline and simple guidelines for managing a rotating shift schedule for a team of [number, e.g., 8] customer support representatives. Define rules for: shift handovers, requesting time off, maximum consecutive night shifts, and shift swaps. Ensure the tone is fair and employee-focused."),
         
        ("VIP Board Meeting Schedule", "Plan the scheduling process for board members.",
         "Draft a formal request email to our board members' executive assistants to schedule the Q3 Board Meeting. Suggest a date range [e.g., October 10-15] and ask them to share their executives' availability via a voting poll [insert link placeholder] or direct response by [Response Deadline]. Keep it highly polite and professional."),
         
        ("Brainstorming Session Outline", "Draft a structured outline for a brainstorming workshop.",
         "Create a structured plan for a 1-hour brainstorming session with [number] teammates. The goal is to brainstorm ideas for [insert objective, e.g., reducing paper waste in the office]. Include rules of engagement, 3 specific prompt questions to trigger discussion, and a system for voting on the best ideas."),
         
        ("Eisenhower Priority Matrix Classifier", "Classify a list of raw tasks into a 4-quadrant system.",
         "Act as a productivity coach. Read the list of administrative tasks below and categorize them into the 4 quadrants of the Eisenhower Matrix: 1) Urgent & Important (Do first), 2) Important but Not Urgent (Schedule), 3) Urgent but Not Important (Delegate), 4) Neither Urgent nor Important (Delete/Postpone). Explain the logic briefly for each.\n\nTasks:\n[Insert tasks here]"),
         
        ("Project Timeline Adjuster", "Draft a communication explaining project schedule shifts.",
         "Draft an email to [Project Sponsor/Client] explaining that the timeline for [Project Name] has slipped by [e.g., 2 weeks] due to [insert reason, e.g., delays in third-party API approval]. Detail: 1) The new target launch date, 2) What steps we are taking to mitigate further delays, and 3) A request for a brief call to align on this adjustments. Keep it transparent and solution-oriented."),
         
        ("Time-Blocking Schedule Planner", "Translate a raw to-do list into a structured daily schedule.",
         "Below is my to-do list and energy levels for tomorrow. Organize this into a time-blocked daily schedule from 9:00 AM to 5:00 PM. Group high-energy tasks in the morning and administrative/routine tasks in the afternoon. Include lunch and short breaks.\n\nTo-do list:\n[Insert list here]\n\nEnergy note: High energy between 9-11 AM, low energy after 3 PM.")
    ]
    
    for i, (title, desc, prompt) in enumerate(s2_prompts):
        pdf.add_prompt_card(i+16, title, desc, prompt)
        
    # --- SECTION 3 ---
    pdf.add_page()
    pdf.add_section_header("Section 3: Spreadsheet Formulas & Data Analysis")
    
    s3_prompts = [
        ("Excel Formula Generator", "Explain what formula is needed based on a plain-text request.",
         "I need a Google Sheets/Excel formula that does the following: [explain logic, e.g., looks up the value in cell A2 in column G of another sheet named 'Inventory' and returns the corresponding price in column I, but if it is not found, returns 'Out of Stock']. Provide the exact formula, explain how each part of it works, and list any requirements (like column sorting)."),
         
        ("CSV Data Insights Summarizer", "Extract key trends, outliers, and insights from CSV text.",
         "Analyze the CSV data paste below. Act as a senior data analyst and write a summary containing: 1) Key trends observed, 2) Top 3 outliers or anomalies in the numbers, 3) Calculated averages or totals for [key column], and 4) Strategic recommendations based on these numbers.\n\nCSV Data:\n[Insert CSV text here]"),
         
        ("Data Cleaning Helper", "Write instructions/formulas to clean messy text inputs.",
         "I have a column of messy data in Google Sheets containing [insert description, e.g., customer names with weird spaces, mixed capitalization, and random special characters]. Tell me the exact steps, formulas (like TRIM, PROPER, REGEXREPLACE), or Google Apps Script I can use to clean up this entire column to look standard and uniform."),
         
        ("Customer Feedback Classifier", "Categorize text reviews into sentiment and departments.",
         "Analyze the list of customer reviews below. Categorize each review into: 1) Sentiment (Positive, Neutral, Negative), and 2) Responsible Department (Support, Product, Billing, Sales). Present the output in a markdown table.\n\nReviews:\n[Insert reviews here]"),
         
        ("Conversion Rate Calculator", "Generate a formula and explain calculations for marketing metrics.",
         "Explain how to calculate the Lead Conversion Rate and Cost Per Lead (CPL) in a marketing tracking spreadsheet. Provide the exact mathematical formulas, the equivalent Google Sheets formulas (using cell references like B2 for visitors and C2 for leads), and brief advice on how to interpret these metrics."),
         
        ("Pivot Table Setup Guide", "Provide step-by-step instructions on setting up pivot tables.",
         "I have a large spreadsheet table with columns: Date, Product Category, Region, Sales Representative, and Revenue. Give me step-by-step instructions on how to set up a Pivot Table in Google Sheets to show: 1) Total sales by Product Category, broken down by Region, and 2) Filtered to show only the year 2026."),
         
        ("Budget Tracker Setup Plan", "Structure a spreadsheet for tracking department expenses.",
         "Design the column structure and formatting rules for a department budget tracker spreadsheet in Google Sheets. Suggest columns, data validation dropdown rules (e.g., Expense Category list), and custom conditional formatting rules (e.g., highlight red if expense exceeds budget)."),
         
        ("Sales Forecasting Formula Plan", "Explain formulas for moving averages or projections.",
         "How do I set up a simple 3-month moving average sales forecast in Google Sheets? Provide the formula (e.g., using AVERAGE) with cell coordinates, explain how to drag it down for future months, and outline its limitations compared to exponential smoothing."),
         
        ("Inventory Alert Rules", "Create logical conditions for alerting on low stock.",
         "Write an IF/AND/OR logic formula in Excel/Google Sheets that checks: 1) If the 'Current Stock' (Column B) is less than the 'Minimum Threshold' (Column C), AND 2) If 'On Order' (Column D) is FALSE. If both are met, display 'Reorder Immediately'. Otherwise, display 'OK'. Explain the formula parts."),
         
        ("RegEx Pattern Writer", "Get regular expressions for extracting data from columns.",
         "Write a Regular Expression (RegEx) pattern that matches [insert requirement, e.g., standard email addresses, or tax codes with format XX-999999]. Explain how the pattern matches each character and provide the Google Sheets formula `REGEXEXTRACT` or `REGEXMATCH` syntax to apply it to Column A."),
         
        ("Duplicate Row Resolver", "Find and resolve duplicate entries in large sheets.",
         "Explain the best methods to find, highlight, and delete duplicate rows in Google Sheets. Show: 1) The menu path to remove duplicates, 2) A conditional formatting custom formula to highlight duplicates in red, and 3) A formula (using UNIQUE or QUERY) to extract unique entries into a new sheet."),
         
        ("Data Masking Formula", "Mask sensitive columns like emails or phone numbers.",
         "Provide a formula to mask email addresses in Google Sheets (e.g., turning 'john.doe@email.com' into 'jo***ee@email.com' or masking the first 5 digits of a phone number in Column A). Explain how the text extraction formulas work together."),
         
        ("Query Function Builder", "Create powerful SQL-like queries in Google Sheets.",
         "Write a Google Sheets `=QUERY()` formula that pulls data from a sheet named 'MasterData' (columns A to F). The query should select Product (Col B), Region (Col D), and Profit (Col F) where Region is 'North America' and Profit is greater than 1000, sorted by Profit in descending order. Explain the query syntax.")
    ]
    
    for i, (title, desc, prompt) in enumerate(s3_prompts):
        pdf.add_prompt_card(i+28, title, desc, prompt)
        
    # --- SECTION 4 ---
    pdf.add_page()
    pdf.add_section_header("Section 4: Report Writing, Editing & Summarization")
    
    s4_prompts = [
        ("Executive Summary Writer", "Condense a long report into a 3-paragraph executive summary.",
         "Read the attached project report below. Act as a professional communications officer and write a compelling, high-level Executive Summary designed for our CEO. Keep it strictly to 3 paragraphs: Paragraph 1: Background & Objective. Paragraph 2: Key Findings & Results. Paragraph 3: Strategic Recommendations & Next Steps.\n\nReport:\n[Insert report text here]"),
         
        ("Performance Review Builder", "Draft constructive, balanced performance review points.",
         "Draft a constructive performance review paragraph for an employee. The employee's key strength is [insert, e.g., strong analytical skills and meeting deadlines], but an area of improvement is [insert, e.g., communication during project delays and active collaboration in meetings]. Frame the feedback in a supportive, professional, and growth-oriented manner."),
         
        ("Weekly Status Report Builder", "Summarize task bullet points into a readable weekly update.",
         "I want to compile my weekly status update for my manager. Below are the tasks I worked on this week. Group them into three standard categories: 1) Completed this week, 2) In-progress/Next steps, and 3) Blockers/Risks. Summarize them into clear, professional bullet points.\n\nRaw task list:\n[Insert tasks here]"),
         
        ("Project Post-Mortem Report", "Structure a post-project review highlighting lessons learned.",
         "Help me draft a Project Post-Mortem/Retrospective report for [Project Name]. The project succeeded in [successes] but struggled with [challenges]. Structure the report with these sections: 1) Executive Summary, 2) Project Performance vs. Original Plan, 3) What Went Well, 4) What Didn't Go Well, 5) Lessons Learned & Actionable Recommendations for future projects. Use bullet points."),
         
        ("Brand Copy Tone Adjuster", "Change technical text into engaging, benefits-focused copy.",
         "Act as a professional copywriter. Rewrite the highly technical description below to be engaging, benefit-driven, and written in a [insert tone, e.g., modern, conversational, and inspiring] voice. Focus on how this features solves problems for the end user rather than just listing tech specs.\n\nTechnical Draft:\n[Insert text here]"),
         
        ("Style Guide Editor", "Align a draft text to match a corporate style guide.",
         "Review the text below and align it with the following corporate style guidelines: 1) Use active voice instead of passive voice, 2) Spell out acronyms on first use, 3) Use bolding for user actions, and 4) Keep paragraphs under 3 sentences. Explain any edits you made.\n\nStyle Guide: [Insert guide or write brief rules]\nText to edit: [Insert draft here]"),
         
        ("Grammar & Clarity Proofreader", "Clean up grammatical issues and improve sentence flow.",
         "Read the text below and check it for grammatical accuracy, spelling, and sentence flow. Provide: 1) A clean, polished version, 2) A list of major corrections made, and 3) Explanations of why the phrasing was changed to improve clarity.\n\nDraft Text:\n[Insert text here]"),
         
        ("Competitor Analysis Outliner", "Structure a report analyzing key competitors.",
         "Create a structured framework template for a competitor analysis report in our industry ([insert industry]). Detail what information should be gathered for each competitor, including sections for: Market Position, Core Product Strengths, Pricing Strategy, Marketing Channels, and Vulnerabilities/Opportunities for us. Explain how to conduct the SWOT component."),
         
        ("Presentation Slide Outliner", "Translate a report into a 10-slide deck structure.",
         "Convert the report content below into a structured outline for a 10-slide presentation deck. For each slide, provide: 1) Slide Title, 2) Visual concept/layout suggestion (e.g., split layout, chart, quote), and 3) Bullet points for the speaker's talking notes.\n\nReport Content:\n[Insert content here]"),
         
        ("KPI Tracking Report Generator", "Summarize monthly metric performance.",
         "Draft a monthly KPI status report based on these metrics: [insert metrics, e.g., Sales: +5% MoM, Customer Support tickets closed: 98%, Website traffic: -2%]. Group by department, write a short summary analysis explaining what these numbers indicate, and flag any areas of concern (e.g., negative trends) with suggested next actions."),
         
        ("Annual Report Intro Writer", "Draft an inspiring opening letter to shareholders.",
         "Draft an opening letter to shareholders/stakeholders for our annual report. The company achieved [milestones, e.g., record revenue growth, launched new sustainability initiative] this year, despite facing [challenges, e.g., supply chain costs]. Set a tone of resilience, transparency, and strategic confidence for the future. Keep it around 300 words.")
    ]
    
    for i, (title, desc, prompt) in enumerate(s4_prompts):
        pdf.add_prompt_card(i+41, title, desc, prompt)
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    print(f"Successfully generated Playbook PDF at: {output_path}")

def build_guide_pdf(output_path):
    pdf = CustomPDF(doc_type="guide")
    pdf.add_cover_page()
    
    # Page 2: Introduction
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Workspace AI Starter Guide", ln=1)
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    intro_text = (
        "Google Workspace is a powerful suite of collaboration tools. With the addition of Gemini "
        "AI integration, it transforms from a communication system into an automated productivity engine. "
        "However, before you can start leveraging AI features like 'Help me write' in Gmail, data analysis "
        "in Sheets, or document summary sidebars in Docs, your Workspace must be properly configured.\n\n"
        "This guide serves as a practical checklist for Google Workspace Administrators and power users. "
        "It outlines the essential admin switches, browser optimizations, and in-app configurations "
        "required to unlock the full potential of Gemini AI in your daily office operations while ensuring "
        "data security and enterprise compliance."
    )
    pdf.multi_cell(0, 5, intro_text)
    pdf.ln(8)
    
    # Checklist style helper
    def draw_checkbox(pdf_obj, label, desc):
        # Save coordinates
        x = pdf_obj.get_x()
        y = pdf_obj.get_y()
        
        # Check height to prevent split checkbox
        if y > 240:
            pdf_obj.add_page()
            x = pdf_obj.get_x()
            y = pdf_obj.get_y()
            
        # Draw small square box
        pdf_obj.set_draw_color(148, 163, 184) # slate-400
        pdf_obj.rect(x, y + 1, 4, 4)
        
        # Draw text beside the box
        pdf_obj.set_xy(x + 8, y)
        pdf_obj.set_font('helvetica', 'B', 9.5)
        pdf_obj.set_text_color(15, 23, 42)
        pdf_obj.cell(0, 6, label, ln=1)
        
        pdf_obj.set_font('helvetica', '', 8.5)
        pdf_obj.set_text_color(71, 85, 105)
        pdf_obj.set_x(x + 8)
        pdf_obj.multi_cell(0, 4.5, desc)
        pdf_obj.ln(3)

    # --- SECTION 1 ---
    pdf.add_section_header("1. Admin Console Configurations (Admin Switches)")
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 5, "These configurations must be done by a Google Workspace Administrator in the Google Admin Console (admin.google.com).")
    pdf.ln(4)
    
    draw_checkbox(pdf, "Assign Gemini Licenses to Target Users", 
                  "Navigate to Directory > Users. Select users individually or in bulk, click 'Licenses', and assign the 'Gemini for Google Workspace' license. Users cannot see the side panel without an active license.")
                  
    draw_checkbox(pdf, "Enable Smart Features and Personalization",
                  "Go to Apps > Google Workspace > Settings for Gmail > Smart Features and Personalization. Ensure this is turned ON. This allows Gemini to analyze email threads, draft replies, and access details like travel dates or parcel tracking details across your account.")
                  
    draw_checkbox(pdf, "Configure Enterprise Data Protection Settings",
                  "Go to Security > Access and data control > Gemini settings. Set 'Gemini data access' to 'Restricted/Do not use data for training'. This ensures that the inputs and outputs generated by your employees are kept completely confidential within your tenant and never used to train public models.")
                  
    draw_checkbox(pdf, "Manage Workspace Marketplace App Policies",
                  "Navigate to Apps > Google Workspace Marketplace Apps > Apps list. Ensure that third-party AI add-ons are audited. If using third-party scripts, configure whitelist permissions to prevent unauthorized data extraction.")

    # --- SECTION 2 ---
    pdf.add_page()
    pdf.add_section_header("2. Browser Optimization (Chrome Setup)")
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 5, "Optimize Google Chrome settings to ensure rapid, seamless access to the Gemini web app and tools.")
    pdf.ln(4)
    
    draw_checkbox(pdf, "Create a Custom Google Chrome Search Shortcut",
                  "Go to Chrome Settings > Search engine > Manage search engines and site search. Under 'Site search', click 'Add'. Set Name: 'Gemini', Shortcut: '@gemini' or 'g', URL: 'https://gemini.google.com/app?query=%s'. Now, you can type '@gemini [your prompt]' directly in the Chrome Address bar for instant answers.")
                  
    draw_checkbox(pdf, "Pin the Gemini Web App to the Taskbar",
                  "Open Chrome and navigate to gemini.google.com. Click the three vertical dots in the top-right corner, select 'Save and share' (or 'More tools'), then click 'Install page as app' or 'Create shortcut'. Check 'Open as window'. This runs Gemini as a standalone desktop utility.")
                  
    draw_checkbox(pdf, "Enable Google Chrome Sidebar Panel",
                  "Ensure Chrome is updated to the latest version. In Google Docs or Sheets, look for the 'Ask Gemini' side panel shortcut in the top right corner. Ensure that the sidebar doesn't block notifications and is pinned for easy toggling.")
                  
    draw_checkbox(pdf, "Set Up Keyboard Shortcuts for Side Panel",
                  "Open Chrome extensions settings (chrome://extensions/shortcuts). Scroll down to Google Workspace or Gemini extensions and assign a custom hotkey combo (e.g., Ctrl+Shift+G or Alt+G) to open the side panel instantly.")

    # --- SECTION 3 ---
    pdf.add_section_header("3. In-App Layouts & Sidebar Configurations")
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 5, "How to configure and access Gemini inside each core Google Workspace application.")
    pdf.ln(4)
    
    draw_checkbox(pdf, "Gmail Sidebar: Email Summary & Smart Compose",
                  "Open Gmail. Open any long email thread. Look for the Gemini spark icon (sparkle logo) in the top-right utility bar. Click it to open the Gemini side panel, which will automatically show 'Summarize this email'. Enable Smart Compose in Gmail Settings > General to see real-time AI word suggestions.")
                  
    draw_checkbox(pdf, "Google Docs: 'Help me write' & Document Chat",
                  "Open a blank Google Doc. Hover over any empty line to see the circular blue 'Help me write' icon on the left margin. Click it to enter a prompt. For existing documents, click the Gemini icon in the top right corner to chat about the doc, ask for formatting tweaks, or draft summaries.")
                  
    draw_checkbox(pdf, "Google Sheets: 'Help me organize' & Column Auto-fill",
                  "Open Google Sheets. Click the Gemini sparkle icon in the top right. Select 'Help me organize' to write a prompt and auto-generate structured tables. For column math, start typing a pattern (e.g., Name -> Email) and click 'Enhanced auto-fill' when the AI suggests a preview.")
                  
    draw_checkbox(pdf, "Google Slides: Image Generator & Presentation Outliner",
                  "Open Google Slides. Open the Gemini side panel. Use the 'Create image' tool to generate custom illustrations directly inside slides, selecting styles like 'Photography', '3D model', or 'Vector'. Use 'Summarize slide' to create presenter notes automatically.")

    # --- SECTION 4 ---
    pdf.add_page()
    pdf.add_section_header("4. Pilot Deployment & Onboarding Checklist")
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 5, "Follow this deployment path to rollout Gemini AI to your organization smoothly.")
    pdf.ln(4)
    
    # Simple table for deployment roadmap
    # Table headers
    pdf.set_fill_color(241, 245, 249) # slate-100
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(15, 8, "Phase", border=1, fill=True, align='C')
    pdf.cell(50, 8, "Deployment Step", border=1, fill=True)
    pdf.cell(75, 8, "Key Deliverables", border=1, fill=True)
    pdf.cell(34, 8, "Responsibility", border=1, fill=True, align='C')
    pdf.ln(8)
    
    # Table rows
    pdf.set_font('helvetica', '', 8)
    pdf.set_text_color(71, 85, 105)
    
    # Row 1
    pdf.cell(15, 12, "Phase 1", border=1, align='C')
    pdf.cell(50, 12, "License Assignment & Security Setup", border=1)
    
    # Multicell wrapper for long table text
    curr_x = pdf.get_x()
    curr_y = pdf.get_y()
    pdf.multi_cell(75, 4, "Allocate licenses. Enable Smart features. Set data access to Restricted (no training).", border=1)
    pdf.set_xy(curr_x + 75, curr_y)
    pdf.cell(34, 12, "IT Administrator", border=1, align='C', ln=1)
    
    # Row 2
    pdf.cell(15, 12, "Phase 2", border=1, align='C')
    pdf.cell(50, 12, "Pilot User Group Onboarding", border=1)
    
    curr_x = pdf.get_x()
    curr_y = pdf.get_y()
    pdf.multi_cell(75, 4, "Train 5-10 operations champions. Configure search shortcuts & desktop app wrappers.", border=1)
    pdf.set_xy(curr_x + 75, curr_y)
    pdf.cell(34, 12, "Operations Lead", border=1, align='C', ln=1)
    
    # Row 3
    pdf.cell(15, 12, "Phase 3", border=1, align='C')
    pdf.cell(50, 12, "Template & SOP Automation", border=1)
    
    curr_x = pdf.get_x()
    curr_y = pdf.get_y()
    pdf.multi_cell(75, 4, "Deploy the Gemini Prompt Playbook. Convert standard tasks into SOP templates.", border=1)
    pdf.set_xy(curr_x + 75, curr_y)
    pdf.cell(34, 12, "All Pilot Champions", border=1, align='C', ln=1)
    
    # Row 4
    pdf.cell(15, 12, "Phase 4", border=1, align='C')
    pdf.cell(50, 12, "Full Rollout & Feedback Loop", border=1)
    
    curr_x = pdf.get_x()
    curr_y = pdf.get_y()
    pdf.multi_cell(75, 4, "Provision licenses company-wide. Collect feedback and document custom prompt library.", border=1)
    pdf.set_xy(curr_x + 75, curr_y)
    pdf.cell(34, 12, "HR & Executive Team", border=1, align='C', ln=1)
    
    pdf.ln(12)
    
    # Pro Tip box
    pdf.set_fill_color(239, 246, 255) # light blue
    pdf.set_draw_color(191, 219, 254) # blue-200
    pdf.set_font('helvetica', 'B', 9.5)
    pdf.set_text_color(30, 58, 138) # dark blue
    pdf.cell(0, 6, "PRO TIP: Ensure Data Privacy Compliance", border='TLR', fill=True, ln=1)
    pdf.set_font('helvetica', '', 8.5)
    pdf.set_text_color(30, 58, 138)
    tip_text = (
        "Never paste personally identifiable customer data (PII) or sensitive passwords "
        "into any AI tool, including Gemini, unless your enterprise licensing package "
        "explicitly includes enterprise data protection (like Gemini Business/Enterprise licenses)."
    )
    pdf.multi_cell(0, 4.5, tip_text, border='BLR', fill=True)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    print(f"Successfully generated Starter Guide PDF at: {output_path}")

if __name__ == "__main__":
    build_playbook_pdf(r"d:\PROJECT\SALES\google-ai-productivity\public\gemini-prompt-playbook.pdf")
    build_guide_pdf(r"d:\PROJECT\SALES\google-ai-productivity\public\workspace-ai-starter-guide.pdf")
