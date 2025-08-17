## Wellnest — Habit & Wellness Tracker

Wellnest is a lightweight wellness companion that helps users build sustainable habits through daily tracking, friendly competition, and smart recommendations. Users complete a short intake survey, sign up, and start logging habits like sleep, water, food, and workouts. A social layer—Wellnest Circle—lets friends create or join group challenges and climb a shared leaderboard.

---

## Table of Contents

- [Features](#features)
- [Screens & Flows](#screens--flows)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Local Development](#local-development)
  - [Prerequisites](#1-prerequisites)
  - [Clone & Setup](#2-clone--set-up-a-virtual-environment)
  - [Configure Environment](#3-configure-environment)
  - [Migrate & Run](#4-apply-migrations--run)
- [Project Structure](#project-structure)
- [Team](#team)
- [Role Rotation & Individual Contributions](#role-rotation--individual-contributions)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)
- [Notes for Recruiters / Reviewers](#notes-for-recruiters--reviewers)

---

## Features

- Onboarding survey → Tailors recommended habits to the user’s goals.

- Account system → Sign up / sign in; profile with name, DOB, gender.

- Home dashboard → See your current streak, recent activity, and quick actions.

- Habits

  - Add custom habits or choose from pre-built: Sleep, Food, Water, Workout.

  - Log values with date & time.

  - Persistent streak tracking & summaries.

- Wellnest Circle (Social)

  - Create or join group challenges.

  - Invite friends, view leaderboard, and track challenge progress.

- Responsive vanilla front end for clarity and speed.

---

## Screens & Flows

- Intake Survey → Sign Up / Sign In → Home (streaks + shortcuts)

- Habits Page

  - Add habit (custom or recommended)

  - Log entries with value + timestamp

- Wellnest Circle

  - Create challenge → invite users → leaderboard

  - Join existing challenge → appear on leaderboard

- Profile

  - Edit personal info; view basic stats

 ---

## Tech Stack

- Platform & Ops

  - Server: AWS EC2 (t2.micro free tier)

  - OS: Ubuntu 24.04

  - SSL: Let’s Encrypt (Certbot)

  - Docker: 28.2.2

- Backend

  - Language: Python 3.12.3

  - Framework: Django 5.2.3

  - App/WSGI: Gunicorn 23

  - HTTP Server / Reverse Proxy: Nginx 1.24

  - Database: MySQL 8.0.42

- Frontend

  - Tech: HTML / CSS / JavaScript (vanilla)

- Tooling

  - Visual Studio Code, MySQL Workbench
 
---

- Architecture

  - Client (vanilla JS) calls Django views / REST endpoints for auth, habits, and Wellnest Circle.

  - Gunicorn runs the Django app; Nginx serves static assets and proxies requests to Gunicorn.

  - MySQL persists users, habits, logs, groups, and leaderboard state.

  - Docker used during deployment to achieve parity and repeatability.

Browser (HTML/CSS/JS) ──► Nginx (443/80) ──► Gunicorn (Django) ──► MySQL 8.0 (habit logs, users, groups)
                           
---

## Project Structure

The repo also contains course deliverables. The app lives under application/.

.
├─ application/                 # Django project (backend + templates/static)

│  ├─ WellNest/                 # Django app(s)

│  ├─ manage.py
│  └─ ...                       # settings, urls, views, models

├─ Final_Milestone/             # Curated docs for final submission

│  ├─ M5V1.md                   # Consolidated spec

│  ├─ files_M5/                 # Final images/assets (curated)

│  └─ _archive/                 # Older milestone docs, feedback, ERD/EER, etc.

├─ README.md                    # This file

├─ LICENSE                      # MIT

└─ ...                          # Remaining course artifacts

---

## Team

- Jacob Cordano

- Hamed Emari

- Jacob Vuong

- Shivani Bokka

- Kevin Hu

- Diego Antunez

Roles rotated each milestone. All Team Members - 

- Participated in design discussions, code reviews, and QA across milestones.

- Swapped roles (frontend/backend/database/dev-ops/docs) to ensure shared ownership and coverage.

As part of the team, the following are my contributions:

- **Backend Lead (Vertical Prototype):** Led the earliest end-to-end slice; stood up Django app, routes, and persistence for a working demonstrator.

- **Database Lead:** Designed schema, authored ERD and EER diagrams, created mock seed data to support integration and testing.

- **Frontend Lead:** Implemented Home, Sign In, Sign Up, Profile, and contributed to Leaderboard UI.

- **Technical Writer:** Owned repo documentation and milestone deliverables; curated final documentation set.

---

## Notes for Recruiters / Reviewers

The Final_Milestone folder contains a clean set of documents (the _archive subfolder preserves older milestone materials).

The application folder is the Django app used for the final demo deployment (EC2 + Nginx + Gunicorn + MySQL; SSL via Let’s Encrypt).

For a quick walk-through, start at the Home → Habits → Wellnest Circle flows.
