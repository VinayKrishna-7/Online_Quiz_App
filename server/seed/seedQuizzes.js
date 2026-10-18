require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Quiz = require('../models/Quiz');

const sampleQuizzes = [
  {
    title: 'JavaScript Basics',
    description: 'Master core JavaScript concepts including variables, data types, closures, and modern ES6 features.',
    category: 'Programming',
    durationMinutes: 10,
    passPercentage: 40,
    questions: [
      {
        questionText: 'Which keyword is used to declare a block-scoped variable that cannot be reassigned?',
        options: ['var', 'let', 'const', 'fixed'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is the output of "typeof null" in JavaScript?',
        options: ['null', 'undefined', 'object', 'number'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which method removes the last element from an array and returns it?',
        options: ['shift()', 'pop()', 'slice()', 'splice()'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What is the result of 2 + "2" in JavaScript?',
        options: ['4', '"22"', 'NaN', 'TypeError'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which of the following is NOT a primitive data type in JavaScript?',
        options: ['Symbol', 'BigInt', 'Object', 'Boolean'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What does the strict equality operator (===) compare?',
        options: [
          'Value only, with type conversion',
          'Both value and type without type conversion',
          'Reference identity only',
          'Length and character encoding',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which array method creates a new array with all elements that pass a test condition?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is a closure in JavaScript?',
        options: [
          'A way to close browser windows programmatically',
          'A function having access to its lexical scope even when called outside of it',
          'An API used to terminate web workers',
          'A syntactic feature for closing HTML tags',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which built-in object is used to parse JSON data into JavaScript objects?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.decode()'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What will "Boolean(\'\')" evaluate to in JavaScript?',
        options: ['true', 'false', 'undefined', 'null'],
        correctAnswer: 1,
        points: 1,
      },
    ],
  },
  {
    title: 'HTML Fundamentals',
    description: 'Learn the essentials of HTML5 structure, semantic markup, forms, and accessibility.',
    category: 'Web Development',
    durationMinutes: 10,
    passPercentage: 40,
    questions: [
      {
        questionText: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Hyperlink and Text Management Language',
          'Home Tool Markup Language',
        ],
        correctAnswer: 0,
        points: 1,
      },
      {
        questionText: 'Which HTML tag represents the top-level heading in a document?',
        options: ['<head>', '<heading>', '<h6>', '<h1>'],
        correctAnswer: 3,
        points: 1,
      },
      {
        questionText: 'Which attribute provides alternative text for screen readers and broken images in <img>?',
        options: ['title', 'alt', 'caption', 'src-desc'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which tag creates a hyperlink in HTML?',
        options: ['<link>', '<href>', '<a>', '<url>'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which HTML5 element represents self-contained content like a blog post or news story?',
        options: ['<section>', '<article>', '<aside>', '<main>'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which input type is specifically designed for entering email addresses with validation?',
        options: ['<input type="text">', '<input type="mail">', '<input type="email">', '<input type="address">'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is the correct tag for creating an unordered bullet list?',
        options: ['<ol>', '<ul>', '<list>', '<li>'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which attribute specifies that an input field must be filled out before submitting a form?',
        options: ['validate', 'necessary', 'important', 'required'],
        correctAnswer: 3,
        points: 1,
      },
      {
        questionText: 'What is the semantic tag used to define navigation links?',
        options: ['<navigate>', '<links>', '<nav>', '<menu>'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which tag specifies the character encoding for an HTML5 document?',
        options: ['<meta charset="UTF-8">', '<encoding charset="UTF-8">', '<charset utf-8>', '<header encoding="utf-8">'],
        correctAnswer: 0,
        points: 1,
      },
    ],
  },
  {
    title: 'CSS Basics',
    description: 'Test your understanding of CSS styling, selectors, box model, flexbox, and responsive design.',
    category: 'Web Development',
    durationMinutes: 10,
    passPercentage: 40,
    questions: [
      {
        questionText: 'What does CSS stand for?',
        options: [
          'Computer Style Sheets',
          'Cascading Style Sheets',
          'Creative Styling Syntax',
          'Colorful Sheet Styles',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which CSS selector targets elements with a specific class name?',
        options: ['#class-name', '.class-name', '*class-name', '$class-name'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which property in the CSS box model creates space between the content and the border?',
        options: ['margin', 'padding', 'spacing', 'gap'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What is the default value of the "position" property in CSS?',
        options: ['relative', 'fixed', 'absolute', 'static'],
        correctAnswer: 3,
        points: 1,
      },
      {
        questionText: 'Which CSS property is used to change the background color of an element?',
        options: ['color', 'bg-color', 'background-color', 'surface-color'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'In Flexbox, which property aligns items along the cross axis?',
        options: ['justify-content', 'align-items', 'flex-direction', 'flex-wrap'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which unit is relative to the font-size of the root (<html>) element?',
        options: ['em', 'px', 'rem', 'vh'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which CSS property controls the stacking order of positioned elements?',
        options: ['layer', 'z-index', 'stack-order', 'elevation'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What does "box-sizing: border-box" do?',
        options: [
          'Adds an extra outer border to the element',
          'Includes padding and border within the specified width and height',
          'Removes the margin from the element completely',
          'Makes the element circular',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which CSS rule is used to create responsive designs that adapt to different screen sizes?',
        options: ['@responsive', '@media', '@screen', '@viewport'],
        correctAnswer: 1,
        points: 1,
      },
    ],
  },
  {
    title: 'React Fundamentals',
    description: 'Assess your skills in React components, props, state, hooks, and lifecycle management.',
    category: 'Frontend',
    durationMinutes: 12,
    passPercentage: 40,
    questions: [
      {
        questionText: 'What is JSX in React?',
        options: [
          'A separate template engine requiring a compiler plugin',
          'A JavaScript syntax extension that allows writing HTML-like code in JavaScript',
          'A proprietary database query language for React apps',
          'A CSS preprocessor designed exclusively for React',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which React hook is used to declare state in functional components?',
        options: ['useEffect', 'useState', 'useRef', 'useContext'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What is the purpose of the dependency array in useEffect?',
        options: [
          'It lists external npm libraries required by the component',
          'It controls when the effect executes based on value changes',
          'It specifies which CSS files to load',
          'It defines prop validation rules',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'How are data passed from a parent component to a child component in React?',
        options: ['Using state', 'Using props', 'Using localStorage', 'Using closures'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Why is the "key" prop important when rendering lists in React?',
        options: [
          'It applies custom CSS styling to the list items',
          'It encrypts item data for transmission',
          'It helps React identify which items have changed, been added, or removed',
          'It determines the alphabetical sorting order of the items',
        ],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is the virtual DOM in React?',
        options: [
          'A full browser emulator built into React',
          'A lightweight in-memory representation of the real DOM tree',
          'A cloud-based database storing HTML elements',
          'A browser security feature for sandboxing apps',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which hook provides access to mutable values that persist across renders without causing rerenders?',
        options: ['useMemo', 'useCallback', 'useRef', 'useId'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is "prop drilling" in React applications?',
        options: [
          'Modifying props directly inside a child component',
          'Passing props through multiple intermediate levels of components to reach a deeply nested child',
          'Removing unnecessary props during optimization',
          'Validating props with TypeScript',
        ],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which built-in React feature is designed to share state globally without prop drilling?',
        options: ['React Context', 'React Redux', 'React Memo', 'React Router'],
        correctAnswer: 0,
        points: 1,
      },
      {
        questionText: 'In React 18, what is the default rendering behavior of state updates inside async callbacks?',
        options: [
          'Immediate synchronous rendering per update',
          'Automatic batching of state updates',
          'Updates are dropped unless wrapped in flushSync',
          'Components are destroyed and recreated',
        ],
        correctAnswer: 1,
        points: 1,
      },
    ],
  },
  {
    title: 'General Knowledge',
    description: 'Challenge yourself with fascinating questions on geography, science, history, and world culture.',
    category: 'General',
    durationMinutes: 10,
    passPercentage: 40,
    questions: [
      {
        questionText: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is the chemical symbol for gold?',
        options: ['Go', 'Ag', 'Au', 'Gd'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'In which year did the Apollo 11 mission land the first humans on the Moon?',
        options: ['1965', '1969', '1971', '1973'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'What is the largest organ of the human body?',
        options: ['Heart', 'Liver', 'Brain', 'Skin'],
        correctAnswer: 3,
        points: 1,
      },
      {
        questionText: 'Who painted the ceiling of the Sistine Chapel?',
        options: ['Leonardo da Vinci', 'Raphael', 'Michelangelo', 'Donatello'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'What is the deepest known oceanic trench on Earth?',
        options: ['Java Trench', 'Puerto Rico Trench', 'Mariana Trench', 'Tonga Trench'],
        correctAnswer: 2,
        points: 1,
      },
      {
        questionText: 'Which gas is the most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'How many bones are in the adult human skeleton?',
        options: ['186', '206', '216', '226'],
        correctAnswer: 1,
        points: 1,
      },
      {
        questionText: 'Which scientist formulated the Three Laws of Motion?',
        options: ['Albert Einstein', 'Galileo Galilei', 'Sir Isaac Newton', 'Nikola Tesla'],
        correctAnswer: 2,
        points: 1,
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    let inserted = 0;
    let skipped = 0;

    for (const quizData of sampleQuizzes) {
      const exists = await Quiz.findOne({ title: quizData.title });
      if (exists) {
        console.log(`Quiz "${quizData.title}" already exists, skipping.`);
        skipped++;
      } else {
        await Quiz.create(quizData);
        console.log(`Created quiz: "${quizData.title}" with ${quizData.questions.length} questions.`);
        inserted++;
      }
    }

    console.log(`\nSeeding complete: ${inserted} created, ${skipped} skipped.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
