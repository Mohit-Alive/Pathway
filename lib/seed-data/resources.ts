export interface SeedResource {
  title: string;
  description: string;
  url: string;
  type: "article" | "video" | "course" | "doc" | "book" | "tool";
  iconKey: string;
  tags: string[];
  level: string;
  estimatedMinutes: number;
  rating: number;
}

export const seedResources: SeedResource[] = [
  {
    title: "MDN Web Docs - JavaScript Guide",
    description: "The definitive guide to JavaScript primitives, objects, and browser APIs by Mozilla.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "doc",
    iconKey: "BookOpen",
    tags: ["javascript", "web-dev", "frontend"],
    level: "Beginner",
    estimatedMinutes: 45,
    rating: 4.9,
  },
  {
    title: "React Official Documentation & Tutorials",
    description: "Learn React through modern interactive tutorials with function components and hooks.",
    url: "https://react.dev/learn",
    type: "doc",
    iconKey: "Atom",
    tags: ["react", "javascript", "frontend"],
    level: "Intermediate",
    estimatedMinutes: 60,
    rating: 4.9,
  },
  {
    title: "PostgreSQL Tutorial - Relational DB Mastery",
    description: "Comprehensive step-by-step SQL & PostgreSQL guide covering schemas, indexes, and queries.",
    url: "https://www.postgresqltutorial.com/",
    type: "article",
    iconKey: "Database",
    tags: ["sql", "postgresql", "backend", "database"],
    level: "Intermediate",
    estimatedMinutes: 30,
    rating: 4.8,
  },
  {
    title: "Pro Git Book - Official Version Control Guide",
    description: "The entire Pro Git book written by Scott Chacon and Ben Straub, available online for free.",
    url: "https://git-scm.com/book/en/v2",
    type: "book",
    iconKey: "GitBranch",
    tags: ["git", "tools", "devops"],
    level: "All Levels",
    estimatedMinutes: 90,
    rating: 4.9,
  },
  {
    title: "Harvard CS50x - Introduction to Computer Science",
    description: "Harvard University's entry-level course on algorithms, data structures, and computer science principles.",
    url: "https://cs50.harvard.edu/x/",
    type: "course",
    iconKey: "GraduationCap",
    tags: ["cs-fundamentals", "algorithms", "c", "python"],
    level: "Beginner",
    estimatedMinutes: 120,
    rating: 5.0,
  },
  {
    title: "Tailwind CSS Official Documentation",
    description: "Utility-first CSS framework for rapid UI development and modern styling.",
    url: "https://tailwindcss.com/docs",
    type: "doc",
    iconKey: "Palette",
    tags: ["css", "frontend", "styling"],
    level: "All Levels",
    estimatedMinutes: 25,
    rating: 4.8,
  },
  {
    title: "roadmap.sh - Developer Roadmaps",
    description: "Community-driven roadmaps, guides, and educational resources for developers.",
    url: "https://roadmap.sh",
    type: "tool",
    iconKey: "Map",
    tags: ["architecture", "career", "cs-fundamentals"],
    level: "All Levels",
    estimatedMinutes: 15,
    rating: 4.9,
  },
  {
    title: "TypeScript Handbook",
    description: "Learn strongly-typed JavaScript development with the official Microsoft TypeScript manual.",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    type: "doc",
    iconKey: "Code",
    tags: ["typescript", "javascript", "fullstack"],
    level: "Intermediate",
    estimatedMinutes: 50,
    rating: 4.8,
  },
];
