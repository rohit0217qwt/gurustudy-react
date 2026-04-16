# ACGC Assessment Platform - PRD

## Original Problem Statement
Create a website frontend in React and backend in Python. Sample website is https://irap.acgc.com.au/ - make better UI.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI components
- **Backend**: FastAPI + MongoDB + JWT Auth
- **Database**: MongoDB (via Motor async driver)

## User Personas
- **Admin**: Creates assessments, bulk registers candidates, views results
- **Student**: Takes assessments, views scores, tracks progress

## Core Requirements
- User authentication (JWT-based, role: admin/student)
- Assessment CRUD with multiple-choice questions
- Bulk candidate registration with exam version and date
- Contact form
- Public pages: Home, About, Services, Contact
- Email notifications (SendGrid, currently using test keys)

## What's Been Implemented (Feb 2026)
- Full auth system (register, login, JWT tokens)
- Admin dashboard (overview, create assessments, bulk register, view candidates)
- Student dashboard (view assessments, take assessment, score tracking)
- Assessment engine with timer and auto-submit
- Contact form with backend storage
- Public pages: Home, About, Services, Contact
- Light theme (converted from dark) with Outfit + IBM Plex Sans fonts
- Seeded test accounts (admin@test.com, student@test.com)

## Prioritized Backlog
### P0 (Critical)
- Replace test SendGrid key with real key
- Password change/reset functionality

### P1 (Important)
- CSV import for bulk registration
- Assessment result export/PDF
- Dashboard analytics charts

### P2 (Nice to have)
- Dark/light theme toggle
- Email templates customization
- Assessment question types (essay, drag-drop)
