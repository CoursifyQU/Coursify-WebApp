# 📚 CourseCentralQU – Webapp

The webapp code for CourseCentralQU, a course insights platform built for Queen's University students. This repository powers the data collection layer for a system that:

- Displays **historic grade distribution data** for courses.
- Hosts a **RAG-powered chatbot** trained on real student feedback from Reddit and RateMyProfessors.

The chatbot enables Queen’s students to get honest, up-to-date insights on courses and instructors — beyond just what's in the calendar.

---

## 📦 Related Repositories

This project is split across multiple repositories:

| Repository | Purpose |
|-----------|---------|
| [CourseCentralQU-Scrapers](https://github.com/CourseCentralQU/CourseCentral-Scrapers) | Handles scraping data from Queen’s calendar, Reddit, and RateMyProf |
| **CourseCentralQU-RAG** (🚧 under construction) | Fine-tunes embeddings and manages vector DB for retrieval |
| [CourseCentralQU-Web](https://github.com/CourseCentralQU/CourseCentral-WebApp) | Frontend built in Next.js for the public-facing site |

> 🔗 Live Website: [CourseCentralQU](https://course-central-web-1p9pc64uw-amaans-projects-0cfc711a.vercel.app/)

---

## 🛠️ Tech Stack

This web application is built with:

- **Next.js** – React framework for fast, scalable web development
- **Tailwind CSS** – Utility-first CSS framework for rapid UI styling
- **TypeScript** – Ensures robust typing and better dev experience
- **Supabase** – Handles the PostgreSQL database and auth
- **Vercel** – Deploys and hosts the web app

---

## ⚙️ Key Features

- 🔍 **Course Search** – Search Queen’s University courses and view historical grade data
- 💬 **AI Chatbot (RAG)** – Ask questions about courses and professors based on scraped reviews
- 📈 **Grade Distributions** – Quickly visualize historical grade stats per course

---

## 🚀 Setup & Development

1. Clone the repository:

```bash
git clone https://github.com/your-username/CourseCentralQU-Web.git
cd CourseCentralQU-Web
