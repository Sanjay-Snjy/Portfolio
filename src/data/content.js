export const stackGroups = [
  { id: 'languages', label: 'Programming Languages' },
  { id: 'web', label: 'Web Development' },
  { id: 'databases', label: 'Databases & Tools' },
  { id: 'data', label: 'Data & Analytics' },
];

/* ── Education ── */
export const education = [
  {
    id: 'be',
    degree: 'B.E. in Computer Science and Engineering',
    institution: 'Global Academy of Technology, Bangalore',
  },
  {
    id: 'pu',
    degree: 'Intermediate',
    institution: 'Vishwachetana PU College, Davanagere',
  },
  {
    id: 'school',
    degree: 'Schooling',
    institution: 'Vidya Vahini Vidyanikethana High School, Chitradurga',
  },
];

export const stack = [
  // Programming Languages
  {
    id: 'java',
    name: 'Java',
    group: 'languages',
    note: 'Object-oriented language used for building robust backend services and understanding core OOP principles.',
    features: ['OOP principles', 'Collections framework', 'Exception handling', 'Multithreading basics', 'JDBC'],
    useCases: ['Backend services', 'DSA practice', 'Desktop apps'],
    related: [],
  },
  {
    id: 'python',
    name: 'Python',
    group: 'languages',
    note: 'Versatile scripting language powering my data analysis, automation, and machine learning work.',
    features: ['Data analysis (Pandas, NumPy)', 'Scripting & automation', 'ML with Scikit-learn', 'API consumption', 'Virtual environments'],
    useCases: ['ML models', 'Data pipelines', 'Automation scripts'],
    related: ['numpy', 'pandas', 'ml'],
  },
  {
    id: 'js',
    name: 'JavaScript',
    group: 'languages',
    note: 'The core language behind my full-stack work — from interactive UIs to Node.js APIs.',
    features: ['ES6+ syntax', 'Async/await', 'DOM manipulation', 'Functional programming', 'Module systems'],
    useCases: ['Interactive UIs', 'API integration', 'Real-time features'],
    related: ['react', 'node', 'nextjs', 'html', 'css'],
  },
  {
    id: 'sql',
    name: 'SQL',
    group: 'languages',
    note: 'Query language for relational data — joins, aggregations, and schema design.',
    features: ['Joins & subqueries', 'Aggregations', 'Indexing basics', 'Schema design', 'Transactions'],
    useCases: ['Reporting queries', 'App backends', 'Data cleanup'],
    related: ['mysql'],
  },

  // Web Development
  {
    id: 'html',
    name: 'HTML',
    group: 'web',
    note: 'Building semantic, accessible markup that forms the backbone of every web interface.',
    features: ['Semantic elements', 'Accessibility (a11y)', 'Forms & validation', 'SEO structure', 'Responsive meta'],
    useCases: ['Landing pages', 'Web apps', 'Email templates'],
    related: ['css', 'js'],
  },
  {
    id: 'css',
    name: 'CSS',
    group: 'web',
    note: 'Crafting visually polished layouts with modern techniques and fluid animations.',
    features: ['Grid & Flexbox', 'Custom properties', 'Animations & transitions', 'Container queries', 'Backdrop filter'],
    useCases: ['Design systems', 'Responsive layouts', 'Glassmorphism UI'],
    related: ['html', 'js', 'tailwind'],
  },
  {
    id: 'react',
    name: 'React',
    group: 'web',
    note: 'Component-driven architecture for building scalable, maintainable user interfaces.',
    features: ['Hooks (useState, useEffect)', 'Context API', 'Framer Motion', 'React Router', 'Custom hooks'],
    useCases: ['Single-page apps', 'Dashboards', '3D web experiences'],
    related: ['js', 'nextjs', 'tailwind', 'node'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    group: 'web',
    note: 'Utility-first styling for shipping consistent, responsive interfaces fast.',
    features: ['Utility classes', 'Responsive prefixes', 'Dark mode', 'Custom config', 'Component extraction'],
    useCases: ['Rapid prototyping', 'Design systems', 'Marketing sites'],
    related: ['react', 'css', 'nextjs'],
  },
  {
    id: 'node',
    name: 'Node.js',
    group: 'web',
    note: 'Server-side JavaScript for building fast, scalable APIs and tooling.',
    features: ['Express.js', 'REST APIs', 'Middleware', 'WebSockets', 'Package management (npm)'],
    useCases: ['REST APIs', 'Real-time backends', 'Build tooling'],
    related: ['js', 'react', 'mongodb'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    group: 'web',
    note: 'React framework for production — routing, rendering strategies, and full-stack features in one.',
    features: ['App Router', 'Server components', 'API routes', 'SSR / SSG / ISR', 'Image optimization'],
    useCases: ['Full-stack apps', 'SEO-first sites', 'Dashboard apps'],
    related: ['react', 'js', 'tailwind'],
  },

  // Databases
  {
    id: 'mysql',
    name: 'MySQL',
    group: 'databases',
    note: 'Relational database for structured data — used alongside SQL for app backends.',
    features: ['Schema design', 'Joins & relations', 'Indexes', 'Stored procedures', 'ACID transactions'],
    useCases: ['App data storage', 'Reporting', 'Django backends'],
    related: ['sql'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    group: 'databases',
    note: 'NoSQL document database powering flexible schemas in my Node.js projects.',
    features: ['Document models', 'Mongoose ODM', 'Aggregation pipeline', 'Indexing', 'Atlas cloud'],
    useCases: ['Real-time apps', 'Flexible schemas', 'Prototyping'],
    related: ['node', 'js'],
  },

  // Data & Analytics
  {
    id: 'numpy',
    name: 'NumPy',
    group: 'data',
    note: 'Foundation for numerical computing — arrays, vectorized math, and matrix ops for ML.',
    features: ['ndarray operations', 'Vectorization', 'Broadcasting', 'Linear algebra', 'Random sampling'],
    useCases: ['ML preprocessing', 'Scientific computing', 'Feature scaling'],
    related: ['python', 'pandas', 'ml'],
  },
  {
    id: 'pandas',
    name: 'Pandas',
    group: 'data',
    note: 'DataFrame toolkit for cleaning, transforming, and analyzing real-world datasets.',
    features: ['DataFrames & Series', 'Cleaning & imputation', 'GroupBy aggregations', 'Merging & joining', 'CSV/JSON I/O'],
    useCases: ['Data analysis', 'ML preparation', 'Reporting'],
    related: ['numpy', 'python', 'sql'],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    group: 'data',
    note: 'Building data-driven models for prediction and classification — like my crop suitability system.',
    features: ['SVM classification', 'Scikit-learn pipelines', 'Model evaluation', 'Feature scaling', 'Train/test splitting'],
    useCases: ['Predictive analytics', 'Classification systems', 'Model evaluation reports'],
    related: ['python', 'numpy', 'pandas'],
  },

  // Databases & Tools
  {
    id: 'github',
    name: 'GitHub',
    group: 'databases',
    note: 'Version control and collaboration hub — branching, PRs, and project hosting.',
    features: ['Branching & merging', 'Pull requests', 'Actions (CI/CD)', 'Issues & projects', 'Code reviews'],
    useCases: ['Team collaboration', 'Portfolio hosting', 'CI/CD pipelines'],
    related: [],
  },
  {
    id: 'gcolab',
    name: 'Google Colab',
    group: 'databases',
    note: 'Cloud notebooks for writing and running Python ML code with free GPU access.',
    features: ['Jupyter notebooks in the cloud', 'Free GPU/TPU runtime', 'Dataset mounting from Drive', 'Sharing & collaboration', 'pip installs on the fly'],
    useCases: ['ML training runs', 'Data analysis', 'Sharing experiments'],
    related: ['python', 'numpy', 'pandas', 'ml'],
  },
];
