
# Task Manager App 

A simple **Full Stack Task Manager** built with **Next.js (App Router, TypeScript)**, **MongoDB**, and **JWT authentication**.  
This project demonstrates **CRUD operations**, **authentication**, and **authorization** following best practices.  

---

## 🚀 Features

- User Authentication (Signup, Login, Logout) with **JWT**  
- Create, Read, Update, Delete (**CRUD**) tasks  
- Each user can only see **their own tasks**  
- Task fields: `title`, `description`, `priority`, `dueDate`  
- Search & Filter tasks  
- Protected routes using **middleware**  
- Responsive UI with **Tailwind CSS**  
- MongoDB integration with **Mongoose**  
- Graceful error handling & form validation  

---

## Project Structure

```
task-manager-app/
├── public/                  # Static assets
├── __tests__/                
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, signup)
│   │   ├── tasks/            # Task dashboard
│   │   ├── api/              # API routes (auth + tasks)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/           # Reusable UI components
│   ├── context/              # Auth context provider
│   ├── lib/                  # DB + Auth utils
│   ├── models/               # Mongoose models (User, Task)
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Protect routes (JWT check)
├── .env.example              # Example env vars
├── jest.config.js            # Jest config (tests)
├── Dockerfile                # Optional Docker deployment
├── vercel.json               # Optional Vercel deployment
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ManishMahto1/task-manager-app.git
cd task-manager-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Run Development Server

```bash
npm run dev
```


---

## 🧪 Running Tests

```bash
npm run test
```

Tests are inside the `__tests__/` folder.  

---

## 📦 Deployment

### Vercel (Recommended)

- Push to GitHub  
- Import repo on [Vercel](https://vercel.com/)  
- Add `MONGO_URI` and `JWT_SECRET` in project settings  

### Docker

```bash
docker build -t task-manager-app .
docker run -p 3000:3000 task-manager-app
```

---

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js (App Router, TypeScript)  
- **Database**: MongoDB with Mongoose  
- **Auth**: JWT + Middleware  
- **Styling**: Tailwind CSS  
- **Validation**: Zod 
- **Tests**: Jest + React Testing Library  

---


---

## 📜 License

MIT License © 2025 Manish Mahto
