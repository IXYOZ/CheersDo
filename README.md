# CheersDo 📝✨

**CheersDo** is a motivational To-Do List app designed to help you stay productive with a point system based on task priority — and a planned email reminder system to keep you on track!

---

## 🚀 Features

- ✅ Add, edit, check, and delete to-do tasks
- 🔺 Set priority levels: Low, Medium, High
- 🕒 Assign deadlines to tasks
- 🌟 Earn points for completed tasks (1–3 points based on priority)
- 🎯 Reward system: Once you hit your threshold, you get a fun message to reward yourself!
- 🔐 Email-based login (no password required)
- 🗃️ Data stored in a SQLite database using Prisma ORM
- Email reminding 

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- SQLite
- Docker
- 8n8 AI work flow

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/IXYOZ/CheersDo.git
cd CheersDo

# Install dependencies
npm install

# Setup the database
npx prisma generate
npx prisma migrate dev --name init

# Start the development server
npm run dev
