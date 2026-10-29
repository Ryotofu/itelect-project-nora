# itelect4-project

[![CI](https://github.com/Ryotofu/itelect4-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Ryotofu/itelect4-project/actions/workflows/ci.yml)

Frontend application for ITELECT4 built with React, Vite, TypeScript, and React Query, integrated with Gemini AI.

- **Live Web App:** https://itelect-project-nora-azure.vercel.app/
- **Backend Repo:** https://github.com/Ryotofu/itelect4-backend

## Architecture

```mermaid
flowchart LR
  fe["itelect4-project<br/>React + Vite on Vercel"]
  be["itelect4-backend<br/>Express on Vercel"]
  db[("MongoDB Atlas")]
  ai["Gemini API"]
  fe -- "fetch + Bearer token" --> be
  be -- "Mongoose" --> db
  be -- "GEMINI_API_KEY" --> ai