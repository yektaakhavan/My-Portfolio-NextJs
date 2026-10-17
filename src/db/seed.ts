import "dotenv/config";
import { randomBytes } from "node:crypto";
import { count } from "drizzle-orm";
import { db } from "./index";
import {
  messages,
  publicMessages,
  profile,
  projects,
  sessions,
  skills,
  users,
} from "./schema";
import { hashPassword } from "../lib/password";



const adminEmail = (process.env.ADMIN_EMAIL ?? "yekta@akhavan.dev").trim().toLowerCase();
// No more hard-coded default password: set ADMIN_PASSWORD in .env, or a random one is generated and printed once.
const generated = !process.env.ADMIN_PASSWORD;
const adminPassword = process.env.ADMIN_PASSWORD ?? randomBytes(9).toString("base64url");

async function main() {
  // SAFETY: this script wipes every table. Refuse to run on a database that already has data
  // unless you explicitly pass --force (so you can't destroy a live site by accident).
  const [{ n }] = await db.select({ n: count() }).from(users);
  if (n > 0 && !process.argv.includes("--force")) {
    console.error("Database already contains data. Re-run with --force to wipe it and re-seed.");
    process.exit(1);
  }

  await db.delete(sessions);
  await db.delete(messages);
  await db.delete(publicMessages);
  await db.delete(projects);
  await db.delete(skills);
  await db.delete(profile);
  await db.delete(users);

  const [user] = await db
    .insert(users)
    .values({
      name: "Yekta Akhavan",
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
    })
    .returning();

  await db.insert(profile).values({
    id: 1,
    name: "Yekta Akhavan",
    title: "Frontend Developer | Creative Technologist",
    tagline: "Turning ideas into clean, modern and functional user interfaces.",
    avatarUrl: "",
    avatarAlt: "",
    location: "Tehran, Iran",
    bio: [
      "Hello! I'm Yekta, a Frontend Developer passionate about turning ideas into clean, modern, and functional user interfaces.",
      "I began through online courses and self-learning, discovering a love for both design and logic. I enjoy crafting solutions that feel good to use.",
      "Currently, I'm looking to collaborate with professional teams to gain real-world experience and sharpen my skills even further.",
    ],
    traits: ["Fast Learner", "Problem Solver", "Team Friendly"],
    email: "hello@yektaakhavan.dev",
    phone: "+98 912 345 6789",
    githubUrl: "https://github.com/yektaakhavan",
    linkedinUrl: "https://linkedin.com/in/yektaakhavan",
    telegramUrl: "https://t.me/yektaakhavan",
    resumeUrl: "/resume",
    resumeTags: ["React", "JavaScript", "HTML/CSS", "Responsive UI"],
    experience: [
      {
        role: "Freelance Frontend Developer",
        company: "Self-employed",
        period: "2023 — Present",
        points: [
          "Designed and shipped 6+ responsive marketing sites and web apps for small businesses.",
          "Built reusable component libraries with React and Tailwind CSS, cutting delivery time by ~40%.",
          "Collaborated with clients end-to-end: wireframes, implementation, deployment and handoff.",
        ],
      },
      {
        role: "Frontend Development Intern",
        company: "Pixelwave Studio",
        period: "2022 — 2023",
        points: [
          "Converted Figma designs into pixel-perfect, accessible interfaces.",
          "Participated in code reviews and introduced a shared CSS naming convention.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc. Computer Engineering",
        school: "Azad University, Tehran",
        period: "2021 — Present",
      },
      {
        degree: "Frontend Web Development Bootcamp",
        school: "Online certificate track",
        period: "2022",
      },
    ],
  });

  await db.insert(skills).values([
    { name: "HTML5", category: "frontend", level: "Advanced", icon: "html5", sort: 1 },
    { name: "CSS3", category: "frontend", level: "Advanced", icon: "css3", sort: 2 },
    { name: "SASS", category: "frontend", level: "Advanced", icon: "sass", sort: 3 },
    { name: "Bootstrap", category: "frontend", level: "Advanced", icon: "bootstrap", sort: 4 },
    { name: "Responsive Design", category: "frontend", level: "Intermediate", icon: "responsive", sort: 5 },
    { name: "JavaScript", category: "frontend", level: "Intermediate", icon: "javascript", sort: 6 },
    { name: "React", category: "frontend", level: "Intermediate", icon: "react", sort: 7 },
    { name: "Git", category: "tools", level: "Advanced", icon: "git", sort: 8 },
    { name: "GitHub", category: "tools", level: "Advanced", icon: "github", sort: 9 },
    { name: "Figma", category: "tools", level: "Intermediate", icon: "figma", sort: 10 },
    { name: "Communication", category: "soft", level: "Advanced", icon: "comm", sort: 11 },
    { name: "Teamwork", category: "soft", level: "Advanced", icon: "team", sort: 12 },
    { name: "Problem Solving", category: "soft", level: "Intermediate", icon: "problem", sort: 13 },
  ]);

  await db.insert(projects).values([
    {
      title: "Author Portfolio",
      slug: "author-portfolio",
      description:
        "A personal website for an author, featuring biography details, book information, and sample content, providing users with a clear and structured browsing experience.",
      tags: ["React", "Tailwind"],
      tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      liveUrl: "https://author-portfolio.yekta.dev",
      githubUrl: "https://github.com/yektaakhavan/author-portfolio",
      images: [],
      accent: 0,
      featured: true,
      sort: 1,
    },
    {
      title: "Coffee Listing",
      slug: "coffee-listing",
      description:
        "A coffee listing interface that presents product details and pricing, streamlining the process of reviewing options and making selections efficiently.",
      tags: ["React", "API"],
      tech: ["React", "REST API", "CSS Modules"],
      liveUrl: "https://coffee-listing.yekta.dev",
      githubUrl: "https://github.com/yektaakhavan/coffee-listing",
      images: [],
      accent: 1,
      featured: false,
      sort: 2,
    },
    {
      title: "React ToDo App",
      slug: "react-todo-app",
      description:
        "A task management application that enables adding, removing, and completing tasks, supporting effective daily organization and planning.",
      tags: ["React"],
      tech: ["React", "Local Storage", "Vite"],
      liveUrl: "https://todo.yekta.dev",
      githubUrl: "https://github.com/yektaakhavan/react-todo-app",
      images: [],
      accent: 2,
      featured: false,
      sort: 3,
    },
    {
      title: "Time Tracking Dashboard",
      slug: "time-tracking-dashboard",
      description:
        "A time-tracking dashboard that displays activity data across different time periods, offering valuable insights into productivity patterns and time usage.",
      tags: ["Bootstrap", "Vanilla JS"],
      tech: ["Bootstrap", "JavaScript", "Chart.js", "REST API"],
      liveUrl: "https://timetrack.yekta.dev",
      githubUrl: "https://github.com/yektaakhavan/time-tracking-dashboard",
      images: [],
      accent: 4,
      featured: true,
      sort: 4,
    },
  ]);

  const now = Date.now();
  await db.insert(messages).values([
    {
      name: "Sara Mohammadi",
      email: "sara.m@brightstudio.io",
      phone: "+98 912 111 2233",
      body: "Hi Yekta! I came across your Author Portfolio and loved the typography work. We're looking for a frontend developer for a 3-month publishing platform project. Would you be open to a quick call this week?",
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 5),
    },
    {
      name: "Daniel Weber",
      email: "d.weber@nordiclabs.de",
      phone: "",
      body: "Hello, your time-tracking dashboard caught my eye. Could you share more about how you structured the chart components? We're evaluating a similar build for our internal tools.",
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 26),
    },
    {
      name: "Niloofar Rahimi",
      email: "niloofar.r@gmail.com",
      phone: "+98 935 444 5566",
      body: "Hi! I'm learning React and your ToDo app repo was super helpful. Thank you for keeping the code clean and commented. Do you plan to add a TypeScript version?",
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 72),
    },
    {
      name: "Arman Karimi",
      email: "arman@pixelwave.studio",
      phone: "+98 21 8877 6655",
      body: "Yekta, following up on your internship application — the team was impressed with your portfolio. We'd love to schedule a technical chat next Tuesday if you're available.",
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 120),
    },
  ]);

  console.log(`Seeded portfolio for ${user.email}`);
  if (generated) console.log(`Generated admin password (shown once, change it!): ${adminPassword}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
