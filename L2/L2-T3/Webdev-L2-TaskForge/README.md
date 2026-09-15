# TASKFORGE

**OASIS INFOBYTE SIP — Web Development & Designing — Level 2 Task 3**

## Objective

Build a complete interactive task-management web application with a polished, production-quality interface. TASKFORGE allows users to add, edit, complete, and delete tasks with data persistence across page refreshes.

## Features

- **Add Task** — Input field with Add Task button; prevents empty tasks
- **Pending Tasks** — Dedicated section with Mark Complete, Edit, and Delete controls
- **Inline Editing** — Edit tasks directly in place without leaving the page
- **Mark Complete** — Moves tasks from Pending to Completed with timestamp
- **Delete** — Permanently removes tasks from the list
- **Live Counts** — Automatic pending/completed task counters
- **Timestamps** — Displays when each task was added and completed
- **localStorage Persistence** — Tasks survive page refreshes
- **Empty States** — Friendly messages when lists are empty
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, focus states

## Bonus Features

- **Timestamps** — Shows added/completed times for each task
- **localStorage** — Full data persistence across sessions

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, CSS Grid)
- Vanilla JavaScript (IIFE, ES6+)

## localStorage Behavior

- Tasks are stored as JSON under the key `taskforge_tasks`
- On startup, saved tasks are loaded and rendered
- Corrupted or missing data is handled gracefully
- All changes (add, edit, complete, delete) are persisted immediately

## How to Run

1. Open `index.html` in any modern web browser
2. No server or build tools required

## File Structure

```
taskforge/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Author

Built as part of the OASIS INFOBYTE SIP program.
