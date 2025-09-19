import MVP1 from "../assets/projects/Screenshot 2025-09-01 145652.png?url";
import MVP2 from "../assets/projects/Screenshot 2025-09-01 145738.png?url";
import MVP3 from "../assets/projects/Screenshot 2025-09-01 145756.png?url";
import MVP4 from "../assets/projects/Screenshot 2025-09-07 175640.png?url";
import leetcode from "../assets/projects/image.png?url";
import dragon1 from "../assets/projects/Screenshot 2025-09-17 161838.png?url";
import dragon2 from "../assets/projects/Screenshot 2025-09-17 162001.png?url";
import mirath1 from "../assets/projects/Screenshot 2025-09-17 173039.png?url";
import mirath2 from "../assets/projects/Screenshot 2025-09-17 173050.png?url";
import mirath3 from "../assets/projects/Screenshot 2025-09-17 173050.png?url";
import formVald1 from "../assets/projects/Screenshot 2025-09-15 051522.png?url";
import formVald2 from "../assets/projects/Screenshot 2025-09-15 051534.png?url";
import TODO1 from "../assets/projects/Screenshot 2025-09-15 050804.png?url";
import TODO2 from "../assets/projects/Screenshot 2025-09-15 050815.png?url";
import portfolio from "../assets/projects/Screenshot 2025-09-17 174214.png?url";

interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  end: string;
  source: string;
  demo: string;
  img: string[];
}

const projects: Project[] = [
  {
    title: "AxeCode — Educational Coding Platform",
    description: "AxeCode is an educational platform for students and developers to practice coding challenges, follow structured courses, and share tutorials. The app combines learning and community: rich media posts, comments & likes, secure profiles, and a contribution graph to visualize progress.",
    tech: ["React(JS)", "Redux Toolkit", "Vite", "React Router", "Jest", "Restful", "Strapi", "PostgreSQL", "Node.js", "qs"],
    color: "from-blue-500 to-purple-600",
    demo: "https://github.com/mohamed-ctrl878/AxeCode", // Live demo / deployment — coming soon
    source: "https://github.com/mohamed-ctrl878/AxeCode",
    end: "MVP coming soon — live demo and deployment planned.",
    img: [MVP1, MVP2, MVP3, MVP4]
  },
  {
    title: "LeetCode & Problem Solving",
    description: "I have implemented several real applications thanks to God and practiced algorithmic problem solving extensively. I solved ~230 problems in total, including +150 on LeetCode. My practice spans fundamental and intermediate topics across arrays, strings, trees, DP, graphs, searching, and more — helping me build robust problem-solving skills and apply them to real projects.",
    tech: [
      "Dynamic Programming (12)",
      "Backtracking (8)",
      "Divide and Conquer (3)",
      "Game Theory (1)",
      "Trie (1)",
      "Monotonic Stack (1)",
      "Tree (31)",
      "Hash Table (31)",
      "Binary Tree (28)",
      "Depth-First Search (28)",
      "Math (24)",
      "Breadth-First Search (15)",
      "Binary Search (10)",
      "Bit Manipulation (10)",
      "Array (53)",
      "String (43)",
      "Two Pointers (28)",
      "Sorting (15)",
      "Stack (11)",
      "Linked List (11)",
      "Simulation (7)",
      "Matrix (6)"
    ],
    color: "from-blue-500 to-purple-600",
    demo: "https://leetcode.com/u/bnaboabdallah/",
    source: "https://leetcode.com/u/bnaboabdallah/",
    end: "Ongoing — +150 solved on LeetCode, ~230 problems total (actively practicing).",
    img: [leetcode]
  },
  {
    title: "Mirath — Islamic Inheritance Calculator",
    description: "Mirath is an interactive web application for calculating and distributing Islamic inheritance (mirath) according to Shariah principles. The app lets users build a connected family tree by adding relatives (spouse, parents, children, siblings, uncles/aunts, etc.), select the deceased's gender, and enter case-specific inputs. It computes fixed shares (furud) and residuary shares (asabah), handles complex scenarios such as blocking (hibah), agnation (ta`sib), grandparents, grandchildren, and step-relatives, then presents a detailed breakdown with fractional shares, alternative opinions, and explanatory notes. Session state can be saved and edited; the tool is intended to assist specialists and non-experts alike but is not a replacement for a qualified jurist.",
    tech: ["Vanilla JS", "HTML", "CSS", "JSON-based Rule Engine"],
    color: "from-green-400 to-emerald-600",
    demo: "https://mohamed-ctrl878.github.io/inheritance/", // add live demo URL when available
    source: "https://github.com/mohamed-ctrl878/inheritance", // add repo URL when available
    end: "MVP complete — further juristic sources and refinements planned.",
    img: [mirath1, mirath2, mirath3]
  },
  {
    title: "Portfolio Website",
    description: "Responsive portfolio with GSAP animations and simple design",
    tech: ["React", "GSAP", "TailwindCSS"],
    color: "from-green-500 to-teal-600",
    demo: "",
    source: "https://github.com/mohamed-ctrl878/portfolio",
    end: "",
    img: [portfolio]
  },
  {
    title: "taming-flutter-dragons",
    description: "Taming Flutter Dragons — connects students with mentors and tracks learning progress.",
    tech: ["React", "Pure Css", "React Router"],
    color: "from-orange-500 to-red-600",
    demo: "https://taming-flutter-dragons-l7c7fld15-mohamed-ctrl878s-projects.vercel.app/",
    source: "https://github.com/mohamed-ctrl878/Taming-Flutter-Dragons",
    end: "",
    img: [dragon1, dragon2]
  },
  {
    title: "From-validation (Mini-App)",
    description: "Form Validation — a lightweight interactive form-validation toolkit with feedback and visual validation states.",
    tech: ["vanillaJS", "Pure Css", "HTML"],
    color: "from-cyan-500 to-blue-600",
    demo: "https://mohamed-ctrl878.github.io/Form-Validation-App/",
    source: "https://github.com/mohamed-ctrl878/Form-Validation-App",
    end: "",
    img: [formVald1, formVald2]
  },
  {
    title: "TODO (Mini-App)",
    description: "TODO (Mini-App) — a modern , mobile-style task manager with Local Storage for storing data, and includes a dark and light mode",
    tech: ["vanillaJS", "Pure Css", "HTML"],
    color: "from-pink-500 to-rose-600",
    demo: "https://mohamed-ctrl878.github.io/New-Todo-List-App/",
    source: "https://github.com/mohamed-ctrl878/New-Todo-List-App",
    end: "",
    img: [TODO1, TODO2]
  },
];

export { projects }
