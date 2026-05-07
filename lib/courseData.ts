export const courses = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript programming from variables to the DOM.",
    chapters: [
      {
        id: "js-c1",
        title: "Variables and Data Types",
        content: `
          <h3>Introduction to Variables</h3>
          <p>Variables in JavaScript act as labeled containers for storing data values. In modern JavaScript (introduced in ES6), we primarily use <code>let</code> and <code>const</code> instead of the older <code>var</code> keyword.</p>
          
          <p><strong><code>let</code></strong> allows you to declare block-scoped variables that can be reassigned later. It is perfect for counters in loops or values that you expect to change over time.</p>
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>let score = 0;
score = score + 10;
console.log(score); // Output: 10</code></pre>

          <h3>Understanding Const</h3>
          <p><strong><code>const</code></strong> creates a read-only reference to a value. Once assigned, a primitive <code>const</code> variable cannot be reassigned. This makes your code more predictable by preventing accidental overwrites.</p>
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>const API_URL = "https://api.example.com";
// API_URL = "http://hacked.com"; // TypeError: Assignment to constant variable.</code></pre>

          <h3>Primitive Data Types</h3>
          <p>Unlike strongly-typed languages, JavaScript is dynamically typed. The same variable can hold a string, and later hold a number. Here are the core primitive types:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>String:</strong> Text enclosed in single, double, or backtick quotes. (e.g., <code>"Hello World"</code>)</li>
            <li><strong>Number:</strong> Represents both integers and floating-point numbers. (e.g., <code>42</code>, <code>3.14</code>)</li>
            <li><strong>Boolean:</strong> A logical entity that is strictly <code>true</code> or <code>false</code>.</li>
            <li><strong>Undefined:</strong> A variable that has been declared but has not yet been assigned a value.</li>
            <li><strong>Null:</strong> The intentional absence of any object value.</li>
          </ul>
        `,
        quiz: [
          { q: "Which keyword is used to declare a variable that cannot be reassigned?", opts: ["var", "let", "const", "def"], ans: 2, exp: "The 'const' keyword creates an immutable binding, preventing reassignment." },
          { q: "Which of these is NOT a primitive data type in JS?", opts: ["String", "Number", "Array", "Boolean"], ans: 2, exp: "Array is a type of Object, not a primitive data type." },
          { q: "What is the modern alternative to 'var' for mutable variables?", opts: ["let", "const", "mutable", "change"], ans: 0, exp: "'let' provides block-scoped, mutable variable declaration." },
          { q: "What does 'dynamically typed' mean?", opts: ["Types change based on speed", "Variables can hold any type of data", "All types are dynamic arrays", "Strictly enforced types"], ans: 1, exp: "Dynamically typed languages determine variable types at runtime." },
          { q: "Is 'Null' a primitive data type in JavaScript?", opts: ["Yes", "No", "Only in strict mode", "It's an Object"], ans: 0, exp: "Null is a primitive data type, even though typeof null returns 'object' due to an old bug." }
        ]
      },
      {
        id: "js-c2",
        title: "Operators & Conditionals",
        content: `
          <h3>Operators in JavaScript</h3>
          <p>Operators allow you to manipulate, combine, and compare values. Arithmetic operators (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>) perform math, while assignment operators (<code>=</code>, <code>+=</code>) update variables.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>let health = 100;
health -= 20; // Same as: health = health - 20
console.log(health); // 80</code></pre>

          <h3>Comparison and Equality</h3>
          <p>When comparing values, you should almost always use the <strong>strict equality operator (<code>===</code>)</strong> instead of the loose equality operator (<code>==</code>). The strict operator checks both the <em>value</em> and the <em>data type</em>, preventing unexpected type coercion bugs.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>console.log(5 == "5");  // true (type coercion occurred)
console.log(5 === "5"); // false (number is not a string)</code></pre>

          <h3>Making Decisions with Conditionals</h3>
          <p>Conditionals allow your code to branch into different logic paths based on dynamic data. The <code>if...else</code> block is the most common tool for this.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>const userRole = "admin";

if (userRole === "admin") {
  console.log("Welcome to the dashboard.");
} else if (userRole === "editor") {
  console.log("Welcome to the editor tools.");
} else {
  console.log("Access denied.");
}</code></pre>
          <p>For scenarios with many possible matches against a single value, a <code>switch</code> statement is often much cleaner than a long chain of <code>else if</code> blocks.</p>
        `,
        quiz: [
          { q: "Which operator checks both value and type?", opts: ["=", "==", "===", "!="], ans: 2, exp: "Strict equality (===) checks both the value and the data type without type coercion." },
          { q: "What is the purpose of the 'switch' statement?", opts: ["To create loops", "To toggle variable types", "To make complex multi-way branching easier", "To stop execution"], ans: 2, exp: "Switch statements evaluate an expression and match it against multiple cases." },
          { q: "What does the '+=' operator do?", opts: ["Subtracts and assigns", "Adds and assigns", "Multiplies", "Compares values"], ans: 1, exp: "+= adds the right operand to the left operand and assigns the result." },
          { q: "Is '1' == 1 true or false?", opts: ["True", "False", "Syntax Error", "Undefined"], ans: 0, exp: "True. Loose equality (==) performs type coercion, converting the string to a number." },
          { q: "Which is a logical operator?", opts: ["+", "===", "&&", "="], ans: 2, exp: "&& is the logical AND operator." }
        ]
      },
      {
        id: "js-c3",
        title: "Loops & Iteration",
        content: `
          <h3>The Power of Loops</h3>
          <p>Loops are used to execute a block of code multiple times. The traditional <code>for</code> loop is excellent when you know exactly how many times you need to iterate. It consists of an initialization, a condition, and an incrementor.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>for (let i = 0; i < 5; i++) {
  console.log("Iteration number: " + i);
}</code></pre>

          <h3>While Loops</h3>
          <p>A <code>while</code> loop runs continuously as long as a specified condition evaluates to true. Be careful—if the condition never becomes false, you will create an infinite loop that crashes the browser!</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>let count = 3;
while (count > 0) {
  console.log(count + "...");
  count--;
}
console.log("Liftoff!");</code></pre>

          <h3>Modern Array Methods</h3>
          <p>In modern JavaScript development, we rarely use traditional <code>for</code> loops to iterate over arrays. Instead, we use declarative array methods like <code>.map()</code>, <code>.filter()</code>, and <code>.forEach()</code>. These methods make our code more readable and less prone to "off-by-one" index errors.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>const prices = [10, 20, 30];

// .map() creates a brand new array with transformed values
const withTax = prices.map(price => price * 1.2);
console.log(withTax); // [12, 24, 36]</code></pre>
        `,
        quiz: [
          { q: "Which loop is best when you know the exact number of iterations?", opts: ["while", "do...while", "for", "forEach"], ans: 2, exp: "The 'for' loop structure includes an explicit counter, making it ideal for known iterations." },
          { q: "What does Array.map() do?", opts: ["Modifies the original array", "Creates a new array with transformed elements", "Filters out items", "Loops without returning"], ans: 1, exp: ".map() returns a new array containing the results of calling a function on every element." },
          { q: "How do you stop a 'for' loop prematurely?", opts: ["stop", "exit", "return", "break"], ans: 3, exp: "The 'break' statement terminates the current loop." },
          { q: "Which array method filters elements based on a condition?", opts: ["map", "reduce", "filter", "forEach"], ans: 2, exp: ".filter() creates a new array with all elements that pass the test." },
          { q: "Does a 'while' loop guarantee at least one execution?", opts: ["Yes", "No", "Only if true", "Depends on scope"], ans: 1, exp: "No. A 'do...while' loop guarantees one execution, but 'while' checks the condition first." }
        ]
      },
      {
        id: "js-c4",
        title: "Functions & Scope",
        content: `
          <h3>Function Declarations</h3>
          <p>Functions are reusable blocks of code designed to perform specific tasks. A function is executed when something invokes (calls) it. The traditional way to declare a function is using the <code>function</code> keyword.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Alice")); // "Hello, Alice!"</code></pre>

          <h3>Arrow Functions</h3>
          <p>ES6 introduced <strong>Arrow Functions</strong>, which provide a more concise syntax. Arrow functions are particularly useful for short, single-line callbacks and have a distinct behavior: they do not bind their own <code>this</code> context.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>// Implicit return with no curly braces
const multiply = (a, b) => a * b;

console.log(multiply(4, 5)); // 20</code></pre>

          <h3>Understanding Scope</h3>
          <p>Scope determines the accessibility (visibility) of variables in your code. JavaScript has three main types of scope:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>Global Scope:</strong> Variables declared outside of any function or block are globally available.</li>
            <li><strong>Function Scope:</strong> Variables declared inside a function are isolated to that function.</li>
            <li><strong>Block Scope:</strong> Variables declared with <code>let</code> or <code>const</code> inside curly braces <code>{}</code> (like inside an <code>if</code> statement) cannot be accessed from outside those braces.</li>
          </ul>
        `,
        quiz: [
          { q: "Which is the correct arrow function syntax?", opts: ["function() => {}", "() => {}", "=> function()", "() -> {}"], ans: 1, exp: "() => {} is the standard ES6 arrow function syntax." },
          { q: "Variables declared inside a function are in what scope?", opts: ["Global", "Block", "Function", "Module"], ans: 2, exp: "They are in Function scope and cannot be accessed outside the function." },
          { q: "Do arrow functions have their own 'this' binding?", opts: ["Yes", "No", "Only in strict mode", "Always undefined"], ans: 1, exp: "Arrow functions do not bind their own 'this'; they inherit it from the parent scope." },
          { q: "Can a function be passed as an argument to another function?", opts: ["Yes", "No", "Only arrow functions", "Only in React"], ans: 0, exp: "Yes, functions are first-class citizens in JS and can be passed as callbacks." },
          { q: "What scope does 'var' use?", opts: ["Block", "Global/Function", "Module", "None"], ans: 1, exp: "'var' is function-scoped (or globally scoped if declared outside a function)." }
        ]
      },
      {
        id: "js-c5",
        title: "The DOM",
        content: `
          <h3>What is the DOM?</h3>
          <p>The Document Object Model (DOM) is a programming interface for web documents. When the browser loads an HTML file, it converts the HTML elements into a tree of JavaScript Objects. This allows us to use JavaScript to read, change, add, or delete HTML elements dynamically.</p>

          <h3>Selecting Elements</h3>
          <p>To manipulate the page, you first have to find the elements. The most versatile methods for this are <code>querySelector()</code> and <code>querySelectorAll()</code>.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>// Selects the first element with the class 'btn'
const button = document.querySelector(".btn");

// Changes the text inside the button
button.textContent = "Click Me Now!";

// Modifies the inline CSS styling
button.style.backgroundColor = "blue";</code></pre>

          <h3>Event Listeners</h3>
          <p>To make a page interactive, you need to listen for user actions like clicks, keypresses, or scrolls. We do this using <code>addEventListener()</code>, which waits for a specific event to occur on a specific element.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>button.addEventListener("click", () => {
  alert("Button was clicked!");
  // We can change the DOM further here!
  document.body.style.backgroundColor = "darkgray";
});</code></pre>
        `,
        quiz: [
          { q: "What does DOM stand for?", opts: ["Data Object Model", "Document Object Model", "Dynamic Output Method", "Document Output Module"], ans: 1, exp: "DOM stands for Document Object Model." },
          { q: "Which method selects the first element matching a CSS selector?", opts: ["getElementById", "querySelectorAll", "querySelector", "getElementsByClassName"], ans: 2, exp: "querySelector returns the first Element within the document that matches the specified selector." },
          { q: "How do you listen for a click event?", opts: ["element.onClick", "element.addEventListener('click', ...)", "element.listen('click')", "element.on('click')"], ans: 1, exp: "addEventListener is the standard method for attaching event handlers." },
          { q: "Which property changes the text inside an HTML element?", opts: ["innerText", "innerHTML", "textContent", "All of the above"], ans: 3, exp: "innerText, innerHTML, and textContent can all modify the contents of an element." },
          { q: "Is the DOM part of the core JavaScript language?", opts: ["Yes", "No", "Only in Node.js", "Only in ES6"], ans: 1, exp: "No, the DOM is a Web API provided by the browser, not part of the core JS language specification." }
        ]
      }
    ]
  },
  {
    id: "html-css-mastery",
    title: "HTML & CSS Mastery",
    description: "Learn to build beautiful, responsive web structures and stylesheets from scratch.",
    chapters: [
      {
        id: "hc-c1",
        title: "HTML Structure & Semantics",
        content: `
          <h3>The Skeleton of the Web</h3>
          <p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It provides the structure of the page, telling the browser what is a heading, what is a paragraph, and what is an image.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Welcome to Web Development&lt;/h1&gt;
    &lt;p&gt;This is a paragraph of text.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

          <h3>Semantic HTML</h3>
          <p>Semantic HTML means using HTML tags that clearly describe their meaning in a human- and machine-readable way. Instead of using generic <code>&lt;div&gt;</code> tags for everything, you should use tags like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;footer&gt;</code>.</p>
          
          <p>Why is this important? Semantic HTML drastically improves <strong>Accessibility</strong> (helping screen readers understand the page layout for visually impaired users) and <strong>SEO</strong> (Search Engine Optimization), helping Google understand what your page is about.</p>
        `,
        quiz: [
          { q: "Which tag is used for the main navigation?", opts: ["<nav>", "<menu>", "<header>", "<ul>"], ans: 0, exp: "<nav> defines a block of navigation links." },
          { q: "What does semantic HTML improve?", opts: ["Execution speed", "Accessibility and SEO", "Styling capabilities", "Database connection"], ans: 1, exp: "Semantic tags help screen readers and search engines understand the structure of the page." },
          { q: "Which tag contains the visible page content?", opts: ["<head>", "<meta>", "<body>", "<html>"], ans: 2, exp: "The <body> element contains everything the user sees." },
          { q: "What is the purpose of the <head> element?", opts: ["Display main title", "Hold metadata and links to styles", "Create a header section", "Import JavaScript only"], ans: 1, exp: "The <head> contains meta-information, title, and links to external resources." },
          { q: "Which element represents a self-contained composition?", opts: ["<div>", "<section>", "<article>", "<span>"], ans: 2, exp: "<article> specifies independent, self-contained content." }
        ]
      },
      {
        id: "hc-c2",
        title: "CSS Selectors & Properties",
        content: `
          <h3>Painting the Web</h3>
          <p>If HTML is the skeleton, CSS (Cascading Style Sheets) is the skin and clothing. CSS allows you to alter fonts, colors, spacing, and the positioning of elements.</p>

          <h3>Selectors</h3>
          <p>To style an element, you first have to select it. CSS provides several types of selectors:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>Element Selectors:</strong> Target all elements of a specific tag type (e.g., <code>p { color: red; }</code>).</li>
            <li><strong>Class Selectors:</strong> Target elements with a specific class attribute using a period. (e.g., <code>.btn { border: none; }</code>). Classes are reusable.</li>
            <li><strong>ID Selectors:</strong> Target a single, unique element using a hash. (e.g., <code>#header { background: black; }</code>).</li>
          </ul>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>/* This is a CSS Rule */
.hero-text {
  font-size: 48px;
  color: #3b82f6;
  text-align: center;
  font-weight: bold;
}</code></pre>

          <h3>The Cascade and Specificity</h3>
          <p>The "Cascade" in CSS means that if two rules conflict, the browser will look at Specificity and Source Order. An ID selector overrides a Class selector, and a Class selector overrides an Element selector. If specificities are tied, the rule written furthest down in the stylesheet wins.</p>
        `,
        quiz: [
          { q: "How do you select an element with class 'btn'?", opts: ["btn", "#btn", ".btn", "*btn"], ans: 2, exp: "The dot (.) denotes a class selector." },
          { q: "Which selector has the highest specificity?", opts: ["Class", "Tag", "ID", "Universal"], ans: 2, exp: "IDs have higher specificity than classes and tags." },
          { q: "What does the 'cascading' in CSS mean?", opts: ["Styles flow like water", "Order and specificity determine applied styles", "Styles only go downwards", "Elements inherit from the bottom up"], ans: 1, exp: "Cascading refers to the priority scheme determining which style rule applies." },
          { q: "How do you select all <p> elements inside a <div>?", opts: ["div > p", "div p", "div+p", "p.div"], ans: 1, exp: "The descendant selector (space) targets all nested elements." },
          { q: "Which property changes the text color?", opts: ["text-color", "font-color", "color", "fgcolor"], ans: 2, exp: "The 'color' property applies to the text color." }
        ]
      },
      {
        id: "hc-c3",
        title: "The Box Model",
        content: `
          <h3>Thinking in Boxes</h3>
          <p>In CSS, the term "box model" is used when talking about design and layout. Every HTML element on a page is essentially a rectangular box. The CSS box model consists of four areas:</p>
          
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>Content:</strong> The actual text, image, or media.</li>
            <li><strong>Padding:</strong> Transparent space <em>inside</em> the border, wrapping the content.</li>
            <li><strong>Border:</strong> A line that goes around the padding and content.</li>
            <li><strong>Margin:</strong> Transparent space <em>outside</em> the border, pushing other elements away.</li>
          </ul>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 40px auto;
}</code></pre>

          <h3>Box Sizing Magic</h3>
          <p>By default, if you set a width of 100px, and padding of 20px, the total width of the box becomes 140px (100 + left padding + right padding). This is notoriously annoying for layout math.</p>
          <p>We fix this by setting <code>box-sizing: border-box;</code>. This forces the browser to include the padding and border <em>within</em> the defined width. If you set width to 100px, the total width will be exactly 100px, and the content area will shrink to accommodate the padding.</p>
        `,
        quiz: [
          { q: "Which space is OUTSIDE the element's border?", opts: ["Padding", "Content", "Margin", "Outline"], ans: 2, exp: "Margin pushes other elements away from the border." },
          { q: "What does 'box-sizing: border-box' do?", opts: ["Makes borders invisible", "Includes padding/border in the element's total width/height", "Creates a box shadow", "Removes margins"], ans: 1, exp: "It alters the default CSS box model so specified width and height include padding and borders." },
          { q: "Which property affects the space INSIDE the border?", opts: ["Margin", "Padding", "Spacing", "Gaps"], ans: 1, exp: "Padding clears an area around the content, inside the border." },
          { q: "If width is 100px, padding is 10px, and border is 1px (content-box), what is the total width?", opts: ["100px", "111px", "122px", "120px"], ans: 2, exp: "100 + (10*2) + (1*2) = 122px." },
          { q: "Can margins overlap (collapse)?", opts: ["Yes", "No", "Only horizontal margins", "Only with flexbox"], ans: 0, exp: "Yes, vertical margins often collapse into the larger of the two margins." }
        ]
      },
      {
        id: "hc-c4",
        title: "Flexbox Layout",
        content: `
          <h3>One-Dimensional Alignment</h3>
          <p>Flexbox (Flexible Box Layout) was introduced to solve the incredibly difficult problem of aligning items vertically and horizontally. It is a one-dimensional layout system, meaning it deals with either a row or a column at one time.</p>

          <p>To use flexbox, you must declare a flex container by setting <code>display: flex;</code> on a parent element. Immediately, all of its direct children become "flex items" and will align in a row by default.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>.navbar {
  display: flex;
  justify-content: space-between; /* Spreads items apart horizontally */
  align-items: center; /* Centers items vertically */
  padding: 10px 20px;
}</code></pre>

          <h3>Axes and Alignment</h3>
          <p>Flexbox works on two axes: the <strong>Main Axis</strong> (horizontal by default) and the <strong>Cross Axis</strong> (vertical by default). You can flip these axes using <code>flex-direction: column;</code>.</p>
          <p>Use <code>justify-content</code> to align items along the Main Axis (e.g., <code>center</code>, <code>space-between</code>, <code>space-evenly</code>), and <code>align-items</code> to align items along the Cross Axis.</p>
        `,
        quiz: [
          { q: "Which property is needed on a parent to enable Flexbox?", opts: ["align-items: flex", "display: flex", "flex-direction: row", "layout: flexbox"], ans: 1, exp: "'display: flex' initializes a flex formatting context." },
          { q: "Which property aligns items horizontally (in a default row)?", opts: ["align-items", "justify-content", "flex-align", "horizontal-align"], ans: 1, exp: "justify-content aligns items along the main axis." },
          { q: "How do you perfectly center an item using Flexbox?", opts: ["justify-content: center; align-items: center;", "align-content: center;", "text-align: center;", "margin: auto;"], ans: 0, exp: "Using both justify-content and align-items set to center centers an element on both axes." },
          { q: "What is the default 'flex-direction'?", opts: ["column", "row", "row-reverse", "column-reverse"], ans: 1, exp: "The default main axis runs horizontally as a row." },
          { q: "What does 'flex-wrap: wrap' do?", opts: ["Hides overflow", "Forces items onto a single line", "Allows items to move to the next line if space runs out", "Shrinks items to fit"], ans: 2, exp: "It allows flex items to wrap onto multiple lines." }
        ]
      },
      {
        id: "hc-c5",
        title: "CSS Grid",
        content: `
          <h3>Two-Dimensional Architecture</h3>
          <p>While Flexbox is great for 1D alignments (like navbars or lists), CSS Grid is designed for 2-dimensional layouts. It allows you to build complex grid structures with rows and columns simultaneously, making it the ultimate tool for overall page layout.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>.grid-container {
  display: grid;
  /* Creates 3 columns of equal width */
  grid-template-columns: 1fr 1fr 1fr;
  /* Adds a 20px gap between all rows and columns */
  gap: 20px;
}</code></pre>

          <h3>The Fractional Unit (fr)</h3>
          <p>CSS Grid introduced a new length unit: the fractional unit (<code>fr</code>). It represents a fraction of the available space in the grid container. If you set <code>grid-template-columns: 1fr 2fr;</code>, the first column takes up 1/3 of the space, and the second column takes up 2/3.</p>
          
          <p>Grid items can also easily span across multiple rows and columns using properties like <code>grid-column: span 2;</code>.</p>
        `,
        quiz: [
          { q: "What is the main difference between Grid and Flexbox?", opts: ["Grid is 1D, Flexbox is 2D", "Grid is 2D, Flexbox is 1D", "Grid is older", "Flexbox doesn't support rows"], ans: 1, exp: "Flexbox is designed for 1D layouts (row or col), Grid is for 2D (both)." },
          { q: "What does the 'fr' unit represent?", opts: ["Frames per second", "Fractions of available space", "Fixed ratio", "Font ratio"], ans: 1, exp: "'fr' distributes remaining space proportionally." },
          { q: "How do you create 3 equal columns in Grid?", opts: ["grid-columns: 3;", "grid-template-columns: 1fr 1fr 1fr;", "columns: 3;", "display: grid-3;"], ans: 1, exp: "grid-template-columns defines the sizing of each column." },
          { q: "Which property creates space between grid cells?", opts: ["margin", "padding", "gap", "spacing"], ans: 2, exp: "The 'gap' (or grid-gap) property defines gutters between rows and columns." },
          { q: "Can a grid item span multiple columns?", opts: ["Yes, using grid-column", "No", "Only if it is a block element", "Only in CSS3"], ans: 0, exp: "The grid-column property allows items to span across defined tracks." }
        ]
      }
    ]
  },
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn how to build interactive UI components using React, Hooks, and State.",
    chapters: [
      {
        id: "re-c1",
        title: "JSX and Components",
        content: `
          <h3>The Component Architecture</h3>
          <p>React revolutionizes UI development by breaking interfaces down into reusable, isolated pieces of code called <strong>Components</strong>. A component is essentially a JavaScript function that returns UI markup. This modular approach makes code easier to test, maintain, and reuse across your application.</p>

          <h3>Understanding JSX</h3>
          <p>React components use a special syntax called <strong>JSX (JavaScript XML)</strong>. JSX allows you to write HTML-like markup directly inside your JavaScript files. Behind the scenes, tools like Babel compile this JSX into standard JavaScript <code>React.createElement()</code> function calls.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>function WelcomeButton() {
  const userName = "Mohit";
  
  // This is JSX! Notice the curly braces used to inject JS variables.
  return (
    &lt;button className="bg-blue-500 text-white p-2 rounded"&gt;
      Welcome back, {userName}!
    &lt;/button&gt;
  );
}</code></pre>

          <p>Because JSX is closer to JavaScript than HTML, there are a few syntax quirks. The most notable is that you must use <code>className</code> instead of <code>class</code> to assign CSS classes, because <code>class</code> is a reserved keyword in JavaScript.</p>
        `,
        quiz: [
          { q: "What does JSX stand for?", opts: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript XHR"], ans: 0, exp: "JSX stands for JavaScript XML." },
          { q: "Why do we use 'className' instead of 'class' in JSX?", opts: ["Because it's shorter", "Because 'class' is a reserved keyword in JavaScript", "Because React prefers camelCase", "You can use either"], ans: 1, exp: "'class' is a reserved keyword in JS, so JSX uses 'className'." },
          { q: "Can a React component return multiple sibling elements without a parent?", opts: ["Yes", "No, they must be wrapped in a single parent or Fragment", "Only if they are spans", "Depends on the version"], ans: 1, exp: "JSX expressions must have one parent element or a React Fragment (<>...</>)." },
          { q: "What is a Component in React?", opts: ["A database table", "A CSS stylesheet", "A reusable piece of UI", "A routing method"], ans: 2, exp: "Components let you split the UI into independent, reusable pieces." },
          { q: "How do you embed a JS expression inside JSX?", opts: ["Quotes", "Parentheses ()", "Curly braces {}", "Square brackets []"], ans: 2, exp: "Curly braces {} are used to evaluate JS expressions inside JSX." }
        ]
      },
      {
        id: "re-c2",
        title: "Props",
        content: `
          <h3>Passing Data with Props</h3>
          <p>Props (short for properties) are the mechanism for passing data from a parent component down to a child component. Think of props as arguments passed into a regular JavaScript function. They allow your components to be dynamic and reusable.</p>
          
          <p>A crucial rule in React is that <strong>Props are Read-Only</strong>. A child component can never modify the props it receives from its parent. This one-way data flow makes React applications highly predictable.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>// Parent Component
function App() {
  return &lt;UserCard name="Alice" role="Admin" /&gt;;
}

// Child Component
function UserCard(props) {
  return (
    &lt;div className="card"&gt;
      &lt;h3&gt;{props.name}&lt;/h3&gt;
      &lt;p&gt;Role: {props.role}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

          <p>Props aren't limited to strings. You can pass numbers, arrays, objects, and even functions down as props. Passing a function as a prop is how child components communicate back up to parents (by calling the function).</p>
        `,
        quiz: [
          { q: "What are props used for?", opts: ["Styling elements", "Passing data from parent to child", "Managing internal state", "Routing"], ans: 1, exp: "Props pass data downwards in the component tree." },
          { q: "Can a child component modify its own props?", opts: ["Yes", "No, props are read-only", "Only if passed as an object", "Only using Hooks"], ans: 1, exp: "Props are immutable from the child's perspective." },
          { q: "How do you access a prop called 'title' inside a functional component?", opts: ["this.props.title", "props.title", "state.title", "getProp('title')"], ans: 1, exp: "In functional components, props are passed as an argument, accessed via props.title." },
          { q: "Are props limited to string values?", opts: ["Yes", "No, they can be arrays, functions, objects, etc.", "They can only be primitives", "They can only be numbers"], ans: 1, exp: "Props can hold any JS value, including functions and objects." },
          { q: "What is the 'children' prop?", opts: ["An array of child components", "Special prop containing the content passed between the component's opening and closing tags", "A method to spawn components", "None of the above"], ans: 1, exp: "The children prop automatically captures elements nested inside the component tag." }
        ]
      },
      {
        id: "re-c3",
        title: "State and useState",
        content: `
          <h3>Internal Memory with State</h3>
          <p>While props represent data passed from the outside, <strong>State</strong> represents data managed internally by the component itself. State is the "memory" of a component. Whenever state changes, React automatically re-renders the component to ensure the UI matches the new data.</p>
          
          <h3>The useState Hook</h3>
          <p>In functional components, we hook into React's state system using the <code>useState</code> hook. It returns an array containing exactly two items: the current state value, and a function allowing you to update that value.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>import { useState } from 'react';

function Counter() {
  // Array destructuring is used to grab the two items returned by useState
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
          <p>Unlike regular variables, you should never mutate state directly (e.g., <code>count = 5</code>). You must always use the setter function (<code>setCount(5)</code>) so React knows a change occurred and a re-render is necessary.</p>
        `,
        quiz: [
          { q: "What is the primary difference between state and props?", opts: ["Props change, state is static", "State is managed internally, props are passed from parent", "There is no difference", "State is only for classes"], ans: 1, exp: "State is local to the component, props are external." },
          { q: "What does useState return?", opts: ["A string", "An object", "An array with the value and a setter function", "A boolean"], ans: 2, exp: "useState returns [state, setState]." },
          { q: "Can you call useState inside a nested if-statement?", opts: ["Yes", "No, Hooks must be called at the top level", "Only in dev mode", "Depends on the condition"], ans: 1, exp: "Rules of Hooks dictate they must be called at the top level, not inside loops or conditions." },
          { q: "Does updating state merge the new state with the old state in useState?", opts: ["Yes", "No, it completely replaces it", "Only for objects", "Depends on the variable name"], ans: 1, exp: "Unlike class component setState, the useState setter replaces the old value entirely." },
          { q: "What happens when a component's state is updated?", opts: ["The page reloads", "React re-renders the component", "Nothing", "The parent component updates"], ans: 1, exp: "State updates trigger a re-render to update the UI." }
        ]
      },
      {
        id: "re-c4",
        title: "useEffect",
        content: `
          <h3>Handling Side Effects</h3>
          <p>A React component's main job is to render UI. However, sometimes components need to reach out to the outside world. Fetching data from an API, setting up a web socket subscription, or manually mutating the DOM are all considered <strong>Side Effects</strong>.</p>
          <p>The <code>useEffect</code> Hook lets you perform these side effects safely. It tells React to run a specific function after the component has rendered to the screen.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() =&gt; {
    // This runs after render
    fetch(\`/api/users/\${userId}\`)
      .then(res =&gt; res.json())
      .then(userData =&gt; setData(userData));
      
  }, [userId]); // Dependency Array
  
  // ... render logic
}</code></pre>

          <h3>The Dependency Array</h3>
          <p>The second argument to <code>useEffect</code> is the dependency array. It controls exactly when the effect runs:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>No array:</strong> Effect runs after every single render.</li>
            <li><strong>Empty array <code>[]</code>:</strong> Effect runs exactly once when the component mounts.</li>
            <li><strong>Array with values <code>[userId]</code>:</strong> Effect runs only when those specific values change.</li>
          </ul>
        `,
        quiz: [
          { q: "What is a side effect?", opts: ["A bug in React", "Operations like data fetching or manual DOM manipulation", "A CSS transition", "A deprecated feature"], ans: 1, exp: "Side effects are anything that affects something outside the scope of the function being executed." },
          { q: "How do you make useEffect run ONLY once on mount?", opts: ["Pass no array", "Pass an empty array []", "Pass [null]", "Return false"], ans: 1, exp: "An empty dependency array tells React the effect doesn't depend on any values from props or state." },
          { q: "What is the purpose of the cleanup function returned from useEffect?", opts: ["To delete variables", "To clear memory leaks like intervals or event listeners before unmounting", "To reset state", "To format code"], ans: 1, exp: "Returning a function cleans up subscriptions/timers before the next effect runs or component unmounts." },
          { q: "If you omit the dependency array entirely, when does the effect run?", opts: ["Never", "Once", "After every render", "When state changes"], ans: 2, exp: "Without an array, useEffect runs after every single render." },
          { q: "Can useEffect be async?", opts: ["Yes, directly", "No, you must define an async function inside it and call it", "Only in Next.js", "Yes, by importing asyncEffect"], ans: 1, exp: "The effect callback itself cannot be async as it must return a cleanup function (not a Promise)." }
        ]
      },
      {
        id: "re-c5",
        title: "Event Handling",
        content: `
          <h3>Events in React</h3>
          <p>Handling events in React is very similar to handling events on DOM elements, but with a few syntactical differences. React events are named using camelCase, rather than lowercase (e.g., <code>onClick</code> instead of <code>onclick</code>). Furthermore, you pass a function reference as the event handler, rather than a string.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>function Form() {
  function handleSubmit(e) {
    // We must prevent default to stop the page from reloading
    e.preventDefault();
    console.log('Form submitted!');
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;button type="submit"&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

          <h3>Synthetic Events</h3>
          <p>The <code>e</code> parameter passed to your event handler is a <strong>SyntheticEvent</strong>. React wraps the native browser event into this cross-browser wrapper to ensure that events work identically across all browsers, removing the headache of writing browser-specific event code.</p>
        `,
        quiz: [
          { q: "Which is the correct way to attach a click event in React?", opts: ["onclick='doSomething()'", "onClick={doSomething}", "on-click={doSomething}", "click={doSomething()}"], ans: 1, exp: "React uses camelCase event names and accepts a function reference." },
          { q: "What is a SyntheticEvent?", opts: ["A fake event", "A cross-browser wrapper around the browser's native event", "A bug", "An event generated by AI"], ans: 1, exp: "React normalizes events so they have consistent properties across different browsers." },
          { q: "How do you prevent the default behavior of a form submission?", opts: ["return false", "e.preventDefault()", "e.stopPropagation()", "e.halt()"], ans: 1, exp: "You must explicitly call preventDefault() on the event object." },
          { q: "What happens if you write onClick={doSomething()}?", opts: ["It works normally", "The function executes immediately on render", "Syntax error", "It runs twice"], ans: 1, exp: "Including the parentheses calls the function during render, rather than passing it as a reference." },
          { q: "Can you pass custom arguments to an event handler?", opts: ["No", "Yes, by using an inline arrow function: () => handler(arg)", "Only via data-attributes", "Only in class components"], ans: 1, exp: "Wrapping the call in an arrow function allows you to pass specific arguments safely." }
        ]
      }
    ]
  },
  {
    id: "db-sql",
    title: "Database Design & SQL",
    description: "Learn how to structure relational data and write SQL queries effectively.",
    chapters: [
      {
        id: "db-c1",
        title: "Relational Databases",
        content: `
          <h3>What is a Relational Database?</h3>
          <p>A relational database organizes data into predefined tables (or 'relations') containing columns and rows. The power of a relational database lies in its ability to establish links—or relationships—between data in different tables.</p>

          <h3>Keys to Success</h3>
          <p>Relationships are established using keys. A <strong>Primary Key</strong> is a unique identifier for a specific row in a table (like a User ID). A <strong>Foreign Key</strong> is a column in one table that refers to the Primary Key of another table.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Creating a basic table with a Primary Key
CREATE TABLE Users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
);

-- Creating a table with a Foreign Key
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    amount DECIMAL(10, 2),
    user_id INT, -- This is the Foreign Key
    FOREIGN KEY (user_id) REFERENCES Users(id)
);</code></pre>

          <p>By organizing data this way (a process called <strong>Normalization</strong>), we drastically reduce data redundancy and improve data integrity. You update a user's email in one place, and all orders linked to that user automatically reflect the correct user identity.</p>
        `,
        quiz: [
          { q: "What organizes data into tables with predefined relationships?", opts: ["NoSQL", "Relational Database", "File System", "Graph Database"], ans: 1, exp: "Relational databases use tables to define relationships." },
          { q: "What is a Primary Key?", opts: ["A password", "A unique identifier for a record in a table", "The first column in a table", "A linked table"], ans: 1, exp: "Primary keys ensure every row is uniquely identifiable." },
          { q: "What does a Foreign Key do?", opts: ["Encrypts data", "Links a record to a primary key in another table", "Creates backups", "Sorts the database"], ans: 1, exp: "Foreign keys establish relationships between different tables." },
          { q: "Which of these is a benefit of relational databases?", opts: ["Data redundancy is reduced", "They require no schema", "They store data as JSON documents", "They are slower than CSV files"], ans: 0, exp: "Normalization reduces redundancy and ensures data integrity." },
          { q: "Can a table have multiple Primary Keys?", opts: ["Yes", "No, only one Primary Key constraint per table (though it can span multiple columns)", "Depends on the database size", "Only in MySQL"], ans: 1, exp: "A table can have only one primary key, but it can be a composite key (multiple columns combined)." }
        ]
      },
      {
        id: "db-c2",
        title: "Basic SELECT Queries",
        content: `
          <h3>Extracting Data</h3>
          <p>SQL (Structured Query Language) is the standard language for communicating with relational databases. The <code>SELECT</code> statement is the most commonly used command; it is utilized to retrieve data.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Retrieve specific columns
SELECT first_name, last_name, email FROM Users;

-- Retrieve everything from the table using the wildcard (*)
SELECT * FROM Products;</code></pre>

          <h3>Filtering Results</h3>
          <p>Fetching an entire database is rarely useful. The <code>WHERE</code> clause allows you to filter the results based on specific conditions.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Find all users who are over 18 years old
SELECT * FROM Users WHERE age >= 18;

-- Find a specific user by email
SELECT username FROM Users WHERE email = 'john@example.com';</code></pre>
        `,
        quiz: [
          { q: "Which SQL statement is used to extract data from a database?", opts: ["EXTRACT", "GET", "SELECT", "PULL"], ans: 2, exp: "SELECT is the fundamental querying command in SQL." },
          { q: "What does the '*' symbol mean in a SELECT statement?", opts: ["Multiply", "All columns", "Wildcard search", "Delete all"], ans: 1, exp: "SELECT * retrieves every column from the specified table." },
          { q: "Which clause filters the records?", opts: ["ORDER BY", "FILTER", "WHERE", "HAVING"], ans: 2, exp: "The WHERE clause restricts results based on a condition." },
          { q: "How do you select only unique values?", opts: ["SELECT UNIQUE", "SELECT DISTINCT", "SELECT DIFFERENT", "SELECT NEW"], ans: 1, exp: "DISTINCT removes duplicate values from the result set." },
          { q: "Which keyword sorts the result set?", opts: ["SORT", "ORDER BY", "GROUP BY", "ALIGN"], ans: 1, exp: "ORDER BY is used to sort results in ascending or descending order." }
        ]
      },
      {
        id: "db-c3",
        title: "Data Manipulation (INSERT, UPDATE, DELETE)",
        content: `
          <h3>Modifying the Database</h3>
          <p>To alter the data inside a table, we use Data Manipulation Language (DML) commands: <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code>.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Adding a new row
INSERT INTO Users (username, email) 
VALUES ('jane_doe', 'jane@example.com');

-- Modifying an existing row
UPDATE Users 
SET email = 'new_jane@example.com' 
WHERE username = 'jane_doe';

-- Removing a row
DELETE FROM Users 
WHERE username = 'jane_doe';</code></pre>

          <h3>The Golden Rule of Updates</h3>
          <p>It is absolutely critical to double-check your <code>WHERE</code> clause before executing an <code>UPDATE</code> or <code>DELETE</code> query. If you omit the <code>WHERE</code> clause, the command will apply to <strong>every single row in the entire table!</strong> For example, <code>DELETE FROM Users;</code> will erase all user accounts instantly.</p>
        `,
        quiz: [
          { q: "Which command adds a new row to a table?", opts: ["ADD", "CREATE", "INSERT INTO", "NEW ROW"], ans: 2, exp: "INSERT INTO is used to insert new records." },
          { q: "What happens if you run an UPDATE statement without a WHERE clause?", opts: ["Syntax Error", "Nothing happens", "All records in the table are updated", "Only the first record is updated"], ans: 2, exp: "Without WHERE, the condition applies to all rows." },
          { q: "Which command removes records from a table?", opts: ["REMOVE", "DELETE", "DROP", "TRUNCATE"], ans: 1, exp: "DELETE removes specific rows (or all if no WHERE is provided)." },
          { q: "What is the difference between DROP and DELETE?", opts: ["No difference", "DROP removes the table structure itself, DELETE removes data", "DELETE removes structure", "DROP only works on databases"], ans: 1, exp: "DROP is DDL (Data Definition Language) and destroys the table entirely." },
          { q: "Which command modifies existing data?", opts: ["MODIFY", "CHANGE", "UPDATE", "ALTER"], ans: 2, exp: "UPDATE is used to change existing records." }
        ]
      },
      {
        id: "db-c4",
        title: "Joins",
        content: `
          <h3>Reconstructing Normalized Data</h3>
          <p>Because relational databases store data across multiple tables, we need a way to combine them back together to form useful views. We do this using <strong>JOIN</strong> clauses.</p>

          <p>The <code>INNER JOIN</code> is the most common. It combines rows from two tables only if there is a match in both tables based on the specified condition.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>SELECT Users.username, Orders.amount
FROM Users
INNER JOIN Orders 
ON Users.id = Orders.user_id;</code></pre>

          <h3>Left Joins</h3>
          <p>A <code>LEFT JOIN</code> returns <em>all</em> records from the left table (the one mentioned first), and the matched records from the right table. If a user in the left table hasn't made any orders, they will still appear in the result set, but their order amount will show up as <code>NULL</code>.</p>
        `,
        quiz: [
          { q: "Which JOIN returns only rows with a match in both tables?", opts: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"], ans: 3, exp: "INNER JOIN requires the condition to be true in both tables." },
          { q: "What does a LEFT JOIN do?", opts: ["Returns all records from the left table, plus matched records from the right", "Returns only unmatched records", "Combines rows into a single column", "Is a syntax error"], ans: 0, exp: "LEFT JOIN prioritizes the left table, bringing in nulls if the right table has no match." },
          { q: "Which clause is used to specify the join condition?", opts: ["WHERE", "ON", "USING", "Both ON and USING"], ans: 3, exp: "ON is standard, and USING is a shorthand when column names match exactly." },
          { q: "What is a CROSS JOIN?", opts: ["A join that fails", "A Cartesian product combining every row of table A with every row of table B", "An Inner Join", "A join across databases"], ans: 1, exp: "Cross joins produce a massive Cartesian product, often by accident if ON is omitted." },
          { q: "Which join returns all records when there is a match in either left or right table?", opts: ["INNER JOIN", "FULL OUTER JOIN", "LEFT JOIN", "SELF JOIN"], ans: 1, exp: "FULL OUTER JOIN brings back everything from both tables." }
        ]
      },
      {
        id: "db-c5",
        title: "Grouping & Aggregation",
        content: `
          <h3>Data Analytics with SQL</h3>
          <p>Aggregation functions perform calculations on a set of values and return a single summary value. Common functions include <code>COUNT()</code>, <code>SUM()</code>, <code>AVG()</code>, <code>MAX()</code>, and <code>MIN()</code>.</p>

          <p>We combine these with the <code>GROUP BY</code> statement to group rows that have the same values into summary rows.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Find out how many total orders each user has made
SELECT user_id, COUNT(order_id) as total_orders
FROM Orders
GROUP BY user_id;</code></pre>

          <h3>The HAVING Clause</h3>
          <p>Because the <code>WHERE</code> keyword evaluates rows <em>before</em> aggregation takes place, you cannot use aggregate functions inside a <code>WHERE</code> clause. Instead, SQL provides the <code>HAVING</code> clause to filter grouped results.</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>-- Find users who have made MORE than 5 orders
SELECT user_id, COUNT(order_id)
FROM Orders
GROUP BY user_id
HAVING COUNT(order_id) > 5;</code></pre>
        `,
        quiz: [
          { q: "Which function returns the total sum of a numeric column?", opts: ["TOTAL()", "ADD()", "SUM()", "COUNT()"], ans: 2, exp: "SUM() calculates the total of the numeric values." },
          { q: "What is the purpose of the GROUP BY clause?", opts: ["To sort data", "To group rows that have the same values into summary rows", "To join tables", "To limit results"], ans: 1, exp: "GROUP BY aggregates identical data into single rows." },
          { q: "Which clause acts like a WHERE clause but for aggregated data?", opts: ["FILTER", "HAVING", "GROUP WHERE", "ORDER BY"], ans: 1, exp: "HAVING is used to filter groups based on aggregate conditions." },
          { q: "What does COUNT(*) do?", opts: ["Counts the number of columns", "Multiplies values", "Counts the number of rows", "Calculates the average"], ans: 2, exp: "COUNT(*) returns the total number of rows in the result set." },
          { q: "Can you use an aggregate function in a WHERE clause?", opts: ["Yes", "No", "Only SUM", "Only in subqueries"], ans: 1, exp: "No, WHERE filters rows before aggregation occurs. HAVING filters after." }
        ]
      }
    ]
  },
  {
    id: "git-github",
    title: "Git & GitHub Workflow",
    description: "Learn version control, branching, and collaborative workflows using Git.",
    chapters: [
      {
        id: "git-c1",
        title: "Version Control Basics",
        content: `
          <h3>What is Git?</h3>
          <p>Git is a distributed version control system. It meticulously tracks changes to your project files over time, allowing you to revert to older versions, compare code changes line-by-line, and collaborate seamlessly with other developers without overwriting their work.</p>

          <p>A repository (repo) is essentially a folder managed by Git. To start tracking a project, you initialize it via the terminal:</p>
          
          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code>$ git init
Initialized empty Git repository in /project/.git/</code></pre>

          <h3>The Three States</h3>
          <p>Understanding Git means understanding its three main states:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2 mt-4">
            <li><strong>Modified:</strong> You have changed the file, but have not safely saved it to the database yet.</li>
            <li><strong>Staged:</strong> You have marked a modified file in its current version to go into your next commit snapshot.</li>
            <li><strong>Committed:</strong> The data is safely stored in your local database.</li>
          </ul>
        `,
        quiz: [
          { q: "What command initializes a new Git repository?", opts: ["git start", "git init", "git create", "git new"], ans: 1, exp: "git init creates a new empty repository or reinitializes an existing one." },
          { q: "What are the three main states of a file in Git?", opts: ["Modified, Staged, Committed", "Saved, Pushed, Pulled", "Local, Remote, Origin", "New, Old, Deleted"], ans: 0, exp: "Files transition from modified, to staged, to committed." },
          { q: "Is Git the same thing as GitHub?", opts: ["Yes", "No", "Git is a company, GitHub is a tool", "They are unrelated"], ans: 1, exp: "Git is the version control software; GitHub is a cloud hosting service for Git repos." },
          { q: "What does a distributed version control system mean?", opts: ["Code is spread across multiple servers randomly", "Every developer has a full backup copy of the repository locally", "It doesn't use the internet", "It's only for large teams"], ans: 1, exp: "Distributed means the entire history is mirrored on every developer's local machine." },
          { q: "Which command shows the current state of the working directory?", opts: ["git log", "git show", "git status", "git check"], ans: 2, exp: "git status displays paths that have differences between the index file and the current HEAD commit." }
        ]
      },
      {
        id: "git-c2",
        title: "Committing Changes",
        content: `
          <h3>Capturing Snapshots</h3>
          <p>To save changes in Git, you create a commit. Think of a commit as a permanent snapshot of your project at a specific point in time. It creates a save point that you can always return to later.</p>

          <p>The workflow always follows two steps: first you <em>add</em> files to the staging area, and then you <em>commit</em> them.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code># Stage a specific file
$ git add index.html

# Or, stage all modified files in the current directory
$ git add .

# Create a snapshot with a descriptive message
$ git commit -m "Add navigation bar to header"</code></pre>

          <h3>Writing Good Commit Messages</h3>
          <p>Commit messages are the breadcrumbs you leave for your future self and your teammates. A good message should explain <em>what</em> changed and <em>why</em>. "Fix bug" is a terrible commit message. "Fix navbar alignment issue on mobile screens" is a great one.</p>
        `,
        quiz: [
          { q: "Which command moves a file to the staging area?", opts: ["git stage", "git add", "git commit", "git push"], ans: 1, exp: "git add stages changes for the next commit." },
          { q: "How do you add all modified files to the staging area at once?", opts: ["git add all", "git add *", "git add .", "git stage all"], ans: 2, exp: "git add . stages all changes in the current directory." },
          { q: "What is the purpose of the '-m' flag in git commit?", opts: ["Merge", "Modify", "Message", "Master"], ans: 2, exp: "-m allows you to pass the commit message directly in the terminal." },
          { q: "Can you change a commit after it's been made?", opts: ["No, commits are permanent", "Yes, using git commit --amend (for the latest commit)", "Only if you are an admin", "Yes, by just typing git change"], ans: 1, exp: "git commit --amend allows you to modify the most recent commit." },
          { q: "What command lets you view the commit history?", opts: ["git history", "git log", "git show-all", "git trace"], ans: 1, exp: "git log shows the commit logs." }
        ]
      },
      {
        id: "git-c3",
        title: "Branching & Merging",
        content: `
          <h3>Parallel Development</h3>
          <p>Branching is arguably Git's most powerful feature. It allows you to diverge from the main line of development (typically called <code>main</code> or <code>master</code>) and work on a feature independently without risking breaking the stable codebase.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code># Create a new branch and switch to it immediately
$ git checkout -b feature/user-login

# (Do some work, add, and commit...)

# Switch back to the main branch
$ git checkout main

# Merge your completed feature into main
$ git merge feature/user-login</code></pre>

          <h3>Merge Conflicts</h3>
          <p>Sometimes, two branches modify the exact same line of code in different ways. When you try to merge them, Git won't know which version to keep, resulting in a <strong>Merge Conflict</strong>. You must open the conflicting file, manually decide which code to keep, and then create a new commit to resolve the conflict.</p>
        `,
        quiz: [
          { q: "What is the default name for the primary branch in Git?", opts: ["primary", "trunk", "main (or master)", "production"], ans: 2, exp: "Historically 'master', but modern tooling defaults to 'main'." },
          { q: "Which command creates a new branch and switches to it immediately?", opts: ["git branch -new", "git checkout -b <name>", "git switch -new", "git branch -go"], ans: 1, exp: "git checkout -b creates and checks out the new branch in one step." },
          { q: "What does 'git merge' do?", opts: ["Deletes a branch", "Combines the history of two branches", "Uploads code to GitHub", "Reverts a commit"], ans: 1, exp: "Merging incorporates changes from one branch into another." },
          { q: "What happens if two branches modify the exact same line of code?", opts: ["Git picks the newest one automatically", "A merge conflict occurs, requiring manual resolution", "The older branch is deleted", "Git crashes"], ans: 1, exp: "Conflicts must be resolved manually by the developer before the merge can complete." },
          { q: "Which command lists all local branches?", opts: ["git list", "git show branches", "git branch", "git tree"], ans: 2, exp: "git branch without arguments lists existing local branches." }
        ]
      },
      {
        id: "git-c4",
        title: "Remotes & GitHub",
        content: `
          <h3>Connecting to the Cloud</h3>
          <p>A remote repository is a version of your project hosted on the internet (like on GitHub, GitLab, or Bitbucket). Utilizing a remote repo acts as an off-site backup and allows global teams to collaborate.</p>

          <p>By default, when you clone a repository from GitHub, Git automatically names the remote connection <strong>origin</strong>.</p>

          <pre class="bg-slate-900 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto my-6 font-mono"><code># Upload your local commits to the remote repository
$ git push origin main

# Download new commits from the remote and merge them locally
$ git pull origin main</code></pre>

          <h3>Forks and Clones</h3>
          <p>To contribute to an open-source project, you typically <strong>Fork</strong> the repository (creating a personal copy on your GitHub account), and then <strong>Clone</strong> your fork (downloading the files to your local computer).</p>
        `,
        quiz: [
          { q: "What command uploads your local commits to GitHub?", opts: ["git upload", "git send", "git push", "git transfer"], ans: 2, exp: "git push updates remote refs along with associated objects." },
          { q: "What is the conventional name for the default remote repository?", opts: ["github", "cloud", "origin", "remote1"], ans: 2, exp: "'origin' is the default alias assigned to the remote URL you cloned from." },
          { q: "What does 'git pull' actually do?", opts: ["Downloads files without committing", "git fetch followed by git merge", "Deletes local files and replaces them", "Just checks status"], ans: 1, exp: "git pull fetches the remote changes and immediately merges them into your current branch." },
          { q: "How do you copy an existing GitHub repository to your local machine?", opts: ["git copy", "git fork", "git clone", "git download"], ans: 2, exp: "git clone creates a local copy of a remote repository." },
          { q: "What is a 'fork' in GitHub?", opts: ["A bug fix", "A personal copy of someone else's repository on your GitHub account", "A merge conflict", "A new branch"], ans: 1, exp: "Forking allows you to freely experiment on changes without affecting the original project." }
        ]
      },
      {
        id: "git-c5",
        title: "Pull Requests",
        content: `
          <h3>Collaborative Code Review</h3>
          <p>A Pull Request (PR) is not actually a feature of Git; it is a feature built by platforms like GitHub. A PR is a way to notify your team members that you've completed a feature branch and are requesting that they "pull" your code into the main branch.</p>

          <h3>The PR Workflow</h3>
          <ol class="list-decimal pl-6 mb-6 space-y-2 mt-4">
            <li>Create a new branch and write your code.</li>
            <li>Commit your changes and push the branch to GitHub.</li>
            <li>Open a Pull Request on GitHub's interface.</li>
            <li>Your team reviews the code, leaves comments, and approves it.</li>
            <li>You click "Merge Pull Request", and the code is safely integrated into the <code>main</code> branch.</li>
          </ol>
          <p>During the review phase, if someone requests changes, you don't need to open a new PR. You simply make the changes locally, commit them, and push to the same branch. The PR will update automatically!</p>
        `,
        quiz: [
          { q: "Are Pull Requests a native feature of the Git command line?", opts: ["Yes", "No, they are a feature of hosting platforms like GitHub", "Only in Git version 2.0+", "Yes, accessed via 'git pr'"], ans: 1, exp: "PRs are a collaboration feature built by platforms like GitHub, GitLab, and Bitbucket." },
          { q: "What is the primary purpose of a Pull Request?", opts: ["To backup code", "To request code review and merge approval", "To pull code to your local machine", "To bypass merge conflicts"], ans: 1, exp: "PRs facilitate discussion and review before merging code into a protected branch." },
          { q: "Who typically resolves a merge conflict shown in a Pull Request?", opts: ["GitHub Support", "The repository owner only", "The developer who opened the PR", "The CI/CD pipeline"], ans: 2, exp: "The author of the PR is usually responsible for resolving conflicts locally and pushing the fix." },
          { q: "What happens when a Pull Request is approved and merged?", opts: ["The branch is automatically deleted", "The commits from the PR branch are added to the target branch", "The repository is locked", "The PR is converted to an Issue"], ans: 1, exp: "Merging applies the changes from the feature branch into the base branch." },
          { q: "Can you continue adding commits to a PR after opening it?", opts: ["No", "Yes, any new pushes to that branch automatically update the PR", "Only if you have admin rights", "Yes, but you have to open a new PR"], ans: 1, exp: "A PR tracks a branch, so pushing new commits to the branch updates the PR." }
        ]
      }
    ]
  }
];
