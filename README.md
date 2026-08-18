# To-Do List Application with Kiro CLI

A modern, fully functional to-do list application with local storage persistence, built with vanilla JavaScript, HTML, and CSS. Includes GitHub Actions workflows for automated deployment with Kiro CLI and AWS SigV4 authentication.

## Features

✨ **Core Functionality**
- ➕ Add new tasks
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete individual tasks
- 💾 Automatic local storage persistence
- 🔄 Data persists across browser sessions

📊 **Filtering & Organization**
- View all tasks
- Filter by active tasks
- Filter by completed tasks
- Clear all completed tasks at once

🎨 **User Experience**
- Modern, responsive design
- Smooth animations and transitions
- Mobile-friendly interface
- Empty state messages
- Task counter with statistics
- Keyboard support (Enter to add task)

🚀 **Deployment & CI/CD**
- GitHub Actions workflows configured
- Kiro CLI integration with setup-kiro-action@v1.0.3
- AWS SigV4 authentication enabled
- Automated deployment pipeline
- OIDC-based AWS credentials

## How to Use

### Locally

1. **Open the application** in your web browser by opening `index.html`
2. **Add a task** by:
   - Typing in the input field
   - Clicking "Add" or pressing Enter
3. **Manage tasks**:
   - Check the checkbox to mark as complete
   - Click "Delete" to remove a task
4. **Filter tasks** using the filter buttons (All, Active, Completed)
5. **Clear completed tasks** using the "Clear Completed" button

## Technical Details

### Local Storage
- All tasks are automatically saved to browser's local storage
- Tasks persist even after closing and reopening the browser
- Storage key: `todoList`
- Data format: JSON array

### Data Structure
Each task object contains:
```javascript
{
  id: timestamp,           // Unique identifier
  text: "Task text",       // Task description
  completed: false,        // Completion status
  createdAt: "timestamp"   // Creation date/time
}
