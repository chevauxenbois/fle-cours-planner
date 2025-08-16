📘 FLE Cours Planner

A simple React + Tailwind web app to generate ready-to-use lesson plans for FLE (Français Langue Étrangère) classes.
It follows the standard méthodologie FLE for working with written documents (CE), oral documents (CO), and grammar concepts.

Teachers can select modules, enter durations, add objectives, and instantly get a structured plan.
The plan can then be copied, exported to PDF, or exported to DOCX for sharing or printing.

Features

Auto-generate lesson plans with the FLE methodology
Supports Compréhension Écrite (CE), Compréhension Orale (CO), and Grammaire
Add custom durations and objectives
Add references for exercises (pages, links)
Add production consignes (written/oral)
Clean UI built with React + TailwindCSS
Export your plan as PDF or DOCX in one click

Getting Started
1. Clone the repo
git clone https://github.com/chevauxenbois/fle-cours-planner.git
cd fle-cours-planner

2. Install dependencies
npm install

3. Run locally
npm run dev


Then open the printed URL (e.g. http://localhost:5173).

4. Build for production
npm run build
npm run preview

🌐 Deployment (GitHub Pages)

This repo is configured for GitHub Pages.
On every push to main, it auto-deploys using GitHub Actions.

Live app will be available at:
👉 https://chevauxenbois.github.io/fle-cours-planner/

📖 Example Use Cases

Prepare a 90-minute CE + Grammaire lesson plan

Create a CO activity with follow-up production in minutes

Share structured lesson plans with colleagues in PDF/DOCX format

🛠️ Tech Stack

React

Vite

TailwindCSS

docx (for Word export)

jsPDF (for PDF export)

Contributing

Pull requests are welcome!
If you’d like to suggest improvements (new fields, better exports, etc.), feel free to fork and open a PR.

📜 License

MIT © 2025 – chevauxenbois
