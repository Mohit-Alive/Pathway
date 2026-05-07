import { Node, Edge } from '@xyflow/react';

export type NodeStatus = 'completed' | 'in-progress' | 'locked';

export interface RoadmapNode extends Node {
  data: {
    label: string;
    status: NodeStatus;
    hours: number;
    description: string;
    icon: string;
    topics: string[];
    resources: Array<{
      title: string;
      type: 'Course' | 'Article' | 'Project';
      duration: string;
      isFree: boolean;
    }>;
    projects: Array<{
      title: string;
      description: string;
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    }>;
  };
}

export interface RoadmapEdge extends Edge {
  animated?: boolean;
}

const nodeData = [
  {
    id: '1',
    data: {
      label: 'HTML Fundamentals',
      status: 'completed' as NodeStatus,
      hours: 10,
      description: 'Learn the foundation of web development with semantic HTML, forms, and accessibility.',
      icon: 'file-code',
      topics: ['Semantic HTML', 'Forms and validation', 'Accessibility basics', 'SEO-friendly markup'],
      resources: [
        { title: 'The Odin Project - HTML', type: 'Course' as const, duration: '5h', isFree: true },
        { title: 'MDN Web Docs', type: 'Article' as const, duration: '2h', isFree: true },
        { title: 'Build 5 Projects', type: 'Project' as const, duration: '3h', isFree: true },
      ],
      projects: [
        { title: 'Personal Resume Page', description: 'Build a semantic resume layout with sections and lists.', difficulty: 'Beginner' },
        { title: 'Product Landing Page', description: 'Create a landing page with forms and CTAs.', difficulty: 'Beginner' },
      ],
    },
    position: { x: 300, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'CSS & Styling',
      status: 'completed' as NodeStatus,
      hours: 15,
      description: 'Master CSS layouts, flexbox, grid, and responsive design techniques.',
      icon: 'palette',
      topics: ['Flexbox layouts', 'CSS Grid', 'Responsive design', 'Utility-first styling'],
      resources: [
        { title: 'CSS-Tricks', type: 'Article' as const, duration: '4h', isFree: true },
        { title: 'Tailwind CSS Docs', type: 'Article' as const, duration: '3h', isFree: true },
        { title: 'Build Responsive Sites', type: 'Project' as const, duration: '8h', isFree: true },
      ],
      projects: [
        { title: 'Responsive Portfolio', description: 'Design a grid-based portfolio with breakpoints.', difficulty: 'Beginner' },
        { title: 'Pricing Table', description: 'Build a multi-tier pricing section with hover states.', difficulty: 'Beginner' },
      ],
    },
    position: { x: 100, y: 150 },
  },
  {
    id: '3',
    data: {
      label: 'JavaScript Basics',
      status: 'completed' as NodeStatus,
      hours: 20,
      description: 'Understand variables, functions, DOM manipulation, and event handling.',
      icon: 'zap',
      topics: ['Variables and scope', 'Functions', 'DOM events', 'Arrays and objects'],
      resources: [
        { title: 'JavaScript.info', type: 'Article' as const, duration: '6h', isFree: true },
        { title: 'FreeCodeCamp JS Course', type: 'Course' as const, duration: '10h', isFree: true },
        { title: 'DOM Projects', type: 'Project' as const, duration: '4h', isFree: true },
      ],
      projects: [
        { title: 'Interactive Quiz', description: 'Render questions and track answers with DOM updates.', difficulty: 'Beginner' },
        { title: 'Weather Widget', description: 'Fetch API data and render results.', difficulty: 'Intermediate' },
      ],
    },
    position: { x: 500, y: 150 },
  },
  {
    id: '4',
    data: {
      label: 'JavaScript Advanced',
      status: 'in-progress' as NodeStatus,
      hours: 15,
      description: 'Learn async/await, promises, ES6+ features, and functional programming.',
      icon: 'rocket',
      topics: ['Promises and async/await', 'ES modules', 'Functional patterns', 'Error handling'],
      resources: [
        { title: 'You Don\'t Know JS', type: 'Article' as const, duration: '7h', isFree: true },
        { title: 'Async/Await Deep Dive', type: 'Course' as const, duration: '5h', isFree: true },
        { title: 'Build Async App', type: 'Project' as const, duration: '3h', isFree: true },
      ],
      projects: [
        { title: 'Task Manager API Client', description: 'Create a client app with async flows and caching.', difficulty: 'Intermediate' },
        { title: 'Streaming Search', description: 'Debounce and paginate API calls with async logic.', difficulty: 'Intermediate' },
      ],
    },
    position: { x: 500, y: 300 },
  },
  {
    id: '5',
    data: {
      label: 'React Fundamentals',
      status: 'locked' as NodeStatus,
      hours: 25,
      description: 'Master React components, hooks, state management, and lifecycle.',
      icon: 'atom',
      topics: ['Components and props', 'useState and useEffect', 'Forms', 'Component composition'],
      resources: [
        { title: 'React Docs', type: 'Article' as const, duration: '8h', isFree: true },
        { title: 'React Course', type: 'Course' as const, duration: '12h', isFree: false },
        { title: 'Build 3 Apps', type: 'Project' as const, duration: '5h', isFree: true },
      ],
      projects: [
        { title: 'Habit Tracker', description: 'Build a multi-page tracker with component state.', difficulty: 'Beginner' },
        { title: 'Movie Explorer', description: 'Fetch and render data with pagination.', difficulty: 'Intermediate' },
      ],
    },
    position: { x: 500, y: 450 },
  },
  {
    id: '6',
    data: {
      label: 'React Advanced',
      status: 'locked' as NodeStatus,
      hours: 20,
      description: 'Learn advanced patterns, performance optimization, and testing.',
      icon: 'wrench',
      topics: ['Memoization', 'Custom hooks', 'Testing patterns', 'Performance profiling'],
      resources: [
        { title: 'Advanced React Patterns', type: 'Article' as const, duration: '6h', isFree: true },
        { title: 'React Performance Course', type: 'Course' as const, duration: '8h', isFree: false },
        { title: 'Optimize App', type: 'Project' as const, duration: '6h', isFree: true },
      ],
      projects: [
        { title: 'Performance Audit', description: 'Measure and optimize render cycles.', difficulty: 'Intermediate' },
        { title: 'Component Library', description: 'Build reusable components with tests.', difficulty: 'Advanced' },
      ],
    },
    position: { x: 250, y: 600 },
  },
  {
    id: '7',
    data: {
      label: 'Node.js & Express',
      status: 'locked' as NodeStatus,
      hours: 20,
      description: 'Build backend servers with Node.js and Express framework.',
      icon: 'server',
      topics: ['Express routing', 'Middleware', 'REST patterns', 'Logging and monitoring'],
      resources: [
        { title: 'Node.js Guide', type: 'Article' as const, duration: '5h', isFree: true },
        { title: 'Express Course', type: 'Course' as const, duration: '10h', isFree: false },
        { title: 'Build API', type: 'Project' as const, duration: '5h', isFree: true },
      ],
      projects: [
        { title: 'REST API Starter', description: 'Build CRUD endpoints with validation.', difficulty: 'Intermediate' },
        { title: 'Auth Service', description: 'Add JWT-based authentication flows.', difficulty: 'Advanced' },
      ],
    },
    position: { x: 750, y: 600 },
  },
  {
    id: '8',
    data: {
      label: 'REST APIs',
      status: 'locked' as NodeStatus,
      hours: 15,
      description: 'Design and build RESTful APIs with proper error handling.',
      icon: 'plug',
      topics: ['HTTP methods', 'Status codes', 'Pagination', 'API documentation'],
      resources: [
        { title: 'REST API Design', type: 'Article' as const, duration: '4h', isFree: true },
        { title: 'API Security Course', type: 'Course' as const, duration: '6h', isFree: false },
        { title: 'Build Public API', type: 'Project' as const, duration: '5h', isFree: true },
      ],
      projects: [
        { title: 'Public API Portal', description: 'Publish API docs and examples.', difficulty: 'Intermediate' },
        { title: 'Rate Limit Middleware', description: 'Add throttling and error responses.', difficulty: 'Advanced' },
      ],
    },
    position: { x: 750, y: 750 },
  },
  {
    id: '9',
    data: {
      label: 'Databases',
      status: 'locked' as NodeStatus,
      hours: 20,
      description: 'Master relational databases, SQL, and database design.',
      icon: 'database',
      topics: ['Schema design', 'SQL queries', 'Indexes', 'Migrations'],
      resources: [
        { title: 'PostgreSQL Docs', type: 'Article' as const, duration: '5h', isFree: true },
        { title: 'SQL & DB Design', type: 'Course' as const, duration: '10h', isFree: false },
        { title: 'Design Schema', type: 'Project' as const, duration: '5h', isFree: true },
      ],
      projects: [
        { title: 'Schema Planner', description: 'Design a multi-tenant data model.', difficulty: 'Intermediate' },
        { title: 'Analytics Queries', description: 'Write reporting queries with joins.', difficulty: 'Advanced' },
      ],
    },
    position: { x: 750, y: 900 },
  },
  {
    id: '10',
    data: {
      label: 'Authentication & Security',
      status: 'locked' as NodeStatus,
      hours: 10,
      description: 'Implement secure authentication, JWT, and security best practices.',
      icon: 'lock',
      topics: ['Password hashing', 'JWT sessions', 'OWASP basics', 'RBAC'],
      resources: [
        { title: 'Web Security Guide', type: 'Article' as const, duration: '4h', isFree: true },
        { title: 'Auth Systems Course', type: 'Course' as const, duration: '5h', isFree: false },
        { title: 'Build Auth System', type: 'Project' as const, duration: '3h', isFree: true },
      ],
      projects: [
        { title: 'Role Based Access', description: 'Implement roles and permissions.', difficulty: 'Intermediate' },
        { title: 'Security Checklist', description: 'Harden endpoints and headers.', difficulty: 'Intermediate' },
      ],
    },
    position: { x: 1000, y: 750 },
  },
  {
    id: '11',
    data: {
      label: 'Full Stack Project',
      status: 'locked' as NodeStatus,
      hours: 30,
      description: 'Build a complete full-stack application from scratch.',
      icon: 'building-2',
      topics: ['Planning and architecture', 'API + UI integration', 'Deployment', 'Monitoring'],
      resources: [
        { title: 'Project Ideas', type: 'Article' as const, duration: '2h', isFree: true },
        { title: 'Full Stack Tutorial', type: 'Course' as const, duration: '15h', isFree: false },
        { title: 'Build Real App', type: 'Project' as const, duration: '13h', isFree: true },
      ],
      projects: [
        { title: 'Learning Planner', description: 'Build a planner with auth and persistence.', difficulty: 'Advanced' },
        { title: 'Team Dashboard', description: 'Create a multi-user dashboard with charts.', difficulty: 'Advanced' },
      ],
    },
    position: { x: 500, y: 1050 },
  },
];

const edges: RoadmapEdge[] = [
  // HTML -> CSS
  { id: '1-2', source: '1', target: '2', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // HTML -> JS Basics
  { id: '1-3', source: '1', target: '3', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // CSS -> JS Basics
  { id: '2-3', source: '2', target: '3', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // JS Basics -> JS Advanced
  { id: '3-4', source: '3', target: '4', animated: true, stroke: '#a1a1aa', strokeWidth: 2 },
  // JS Advanced -> React
  { id: '4-5', source: '4', target: '5', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // React -> React Advanced
  { id: '5-6', source: '5', target: '6', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // JS Advanced -> Node.js
  { id: '4-7', source: '4', target: '7', animated: true, stroke: '#a1a1aa', strokeWidth: 2 },
  // Node.js -> REST APIs
  { id: '7-8', source: '7', target: '8', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // REST APIs -> Databases
  { id: '8-9', source: '8', target: '9', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // React Advanced -> Full Stack
  { id: '6-11', source: '6', target: '11', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // Databases -> Full Stack
  { id: '9-11', source: '9', target: '11', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // Auth -> Full Stack
  { id: '10-11', source: '10', target: '11', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
  // REST APIs -> Auth
  { id: '8-10', source: '8', target: '10', animated: false, stroke: '#a1a1aa', strokeWidth: 2 },
];

export const mockRoadmapData = {
  nodes: nodeData as RoadmapNode[],
  edges,
};

export const onboardingData = {
  goals: [
    'Full Stack Web Development',
    'Machine Learning',
    'Mobile App Development',
    'Data Science',
    'DevOps & Cloud',
  ],
  timelines: ['1 Month', '3 Months', '6 Months', 'Custom'],
  goalTypes: ['Learn a new skill', 'Switch careers', 'Get certified', 'Build a project'],
  skills: [
    { name: 'HTML', icon: 'file-text' },
    { name: 'CSS', icon: 'palette' },
    { name: 'JavaScript', icon: 'zap' },
    { name: 'React', icon: 'atom' },
    { name: 'Node.js', icon: 'server' },
    { name: 'Databases', icon: 'database' },
  ],
  learningStyles: [
    { id: 'visual', label: 'Visual', description: 'Diagrams & Videos', icon: 'eye' },
    { id: 'reading', label: 'Reading', description: 'Docs & Articles', icon: 'book-open' },
    { id: 'hands-on', label: 'Hands-on', description: 'Projects & Code', icon: 'laptop' },
    { id: 'auditory', label: 'Auditory', description: 'Podcasts & Lectures', icon: 'headphones' },
  ],
  timeOptions: ['1h', '2h', '3h', '4h+'],
  schedules: ['Morning', 'Evening', 'Weekends'],
};

export const dashboardStats = {
  streak: 12,
  progress: 34,
  skillsCompleted: 4,
  skillsTotal: 11,
};

export const todayTasks = [
  {
    id: 1,
    title: 'Watch: JavaScript Promises Explained',
    type: 'Video',
    duration: '22 min',
  },
  {
    id: 2,
    title: 'Read: MDN Async/Await docs',
    type: 'Article',
    duration: '15 min',
  },
  {
    id: 3,
    title: 'Complete: Build a To-Do App',
    type: 'Project',
    duration: '45 min',
  },
];

export const resources = [
  { name: 'JavaScript.info', url: '#' },
  { name: 'MDN Web Docs', url: '#' },
  { name: 'The Odin Project', url: '#' },
];

export const userProfile = {
  name: 'Mohit K.',
  role: 'CTO at Zobique',
  avatar: 'MK',
};
