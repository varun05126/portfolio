# Varun M — Portfolio & NodeMailer Email System

A high-performance, dark-glassmorphic personal portfolio website showcasing skills, projects, experience milestones, credentials, and an integrated NodeMailer contact backend.

## 🚀 Features

- **Rich Dark Glassmorphism UI**: Refined CSS design tokens, ambient lighting, frosted glass cards, and micro-interactions.
- **NodeMailer Integration**: Full-stack backend supporting automated email delivery to `malthumkarvarun@gmail.com` via Gmail App Passwords, Custom SMTP, or auto-generating Ethereal test accounts for development.
- **Responsive Layout**: Optimized across desktop, tablet, and mobile devices with a responsive navigation drawer.
- **Active Scrollspy & Smooth Scroll**: Automatic navigation indicator tracking and floating back-to-top button.
- **Sections**:
  - **Home (Hero)**: Interactive profile badge, tech chips, quick CTAs, and status pill.
  - **Key Metrics (Stats)**: 4+ Projects, 5+ Certifications, 15+ Technologies, Infosys Springboard 7.0.
  - **About Me**: Academic background, career goals, and core engineering philosophy.
  - **Technical Skills**: Grouped domain cards with interactive pills and core stack banner.
  - **Experience**: Responsive alternating timeline with milestone highlights.
  - **Projects**: Featured projects (ExamGPT, SkillHer, StudyStack, E-Waste Management) with status badges and GitHub links.
  - **Certifications**: Verified accreditations and dates.
  - **Contact**: Interactive form with real-time feedback and validation connected to NodeMailer.

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Properties, Flexbox, Grid, Glassmorphism), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express 5, NodeMailer, CORS, dotenv.
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*).

---

## 💻 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Gmail)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your email credentials:
```env
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
RECIPIENT_EMAIL=malthumkarvarun@gmail.com
```
> **Note**: If `.env` is not configured, NodeMailer automatically spins up a virtual **Ethereal Email** test account so form submission tests work instantly out-of-the-box, providing a preview URL in the response!

### 3. Start the Server
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📬 API Endpoints

- **`GET /api/health`**: Server health check and service status.
- **`POST /api/contact`**: Contact form submission. Accepts JSON payload:
  ```json
  {
    "fullName": "Alex Johnson",
    "email": "alex@example.com",
    "subject": "Project Collaboration",
    "message": "Hi Varun, would love to discuss a project..."
  }
  ```

---

## 📄 License

MIT License &copy; 2026 Varun M.