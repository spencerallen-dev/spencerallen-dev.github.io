# Blog Post Management Guide

Complete guide for adding, editing, and managing blog posts on spencerallen.me

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Detailed Instructions](#detailed-instructions)
- [Field Reference](#field-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The blog uses a JSON file (`blog/posts.json`) to store all blog posts. This approach means:
- ✅ No HTML editing required
- ✅ Simple text file that's easy to edit
- ✅ Version controlled with Git
- ✅ Automatic formatting and styling
- ✅ Posts sorted automatically by date

## Quick Start

**To add a new post in 3 steps:**

1. Open `blog/posts.json`
2. Add your post to the array (don't forget the comma!)
3. Save and commit

**Example:**
```json
[
  {
    "id": "my-first-post",
    "title": "My First Blog Post",
    "date": "2025-10-30",
    "excerpt": "This is my first post on this blog!",
    "content": "Hello world! This is my first blog post.\n\nI'm excited to start sharing my thoughts here."
  }
]
```

---

## Detailed Instructions

### Step 1: Open the posts file

Navigate to your repository and open:
```
blog/posts.json
```

You can edit this file:
- Directly on GitHub (click the file, then click the pencil icon)
- In any text editor on your computer
- In VS Code, Sublime Text, Notepad++, or even Notepad

### Step 2: Understand the JSON structure

The file contains a JSON array (indicated by `[` and `]`). Inside are post objects (each wrapped in `{` and `}`).

**Basic structure:**
```json
[
  {
    "id": "post-1",
    "title": "First Post",
    "date": "2025-10-28",
    "excerpt": "Short description",
    "content": "Full content"
  },
  {
    "id": "post-2",
    "title": "Second Post",
    "date": "2025-10-29",
    "excerpt": "Another description",
    "content": "More content"
  }
]
```

**Important JSON rules:**
- Properties are in quotes: `"id"`, `"title"`, etc.
- Values are in quotes: `"my-value"`
- Separate properties with commas: `"id": "value",`
- Separate posts with commas: `{ post 1 }, { post 2 }`
- NO comma after the last item in an array or object

### Step 3: Add your post

Place your cursor after the closing brace `}` of the last post, add a comma, and insert your new post.

**Before:**
```json
[
  {
    "id": "existing-post",
    "title": "Existing Post",
    "date": "2025-10-28",
    "excerpt": "Description",
    "content": "Content"
  }
]
```

**After:**
```json
[
  {
    "id": "existing-post",
    "title": "Existing Post",
    "date": "2025-10-28",
    "excerpt": "Description",
    "content": "Content"
  },
  {
    "id": "new-post",
    "title": "New Post",
    "date": "2025-10-30",
    "excerpt": "New description",
    "content": "New content"
  }
]
```

### Step 4: Fill in the fields

See the [Field Reference](#field-reference) section below for details on each field.

### Step 5: Validate your JSON

Before saving, check for syntax errors:
- Visit https://jsonlint.com
- Paste your entire `posts.json` content
- Click "Validate JSON"
- Fix any errors reported

### Step 6: Save and deploy

- **If editing on GitHub**: Click "Commit changes"
- **If editing locally**: Save the file, then:
  ```bash
  git add blog/posts.json
  git commit -m "Add new blog post: [your post title]"
  git push
  ```

GitHub Pages will automatically rebuild your site in 1-2 minutes.

---

## Field Reference

### `id` (required)
- **Purpose**: Unique identifier for the post, used in URLs
- **Format**: Lowercase letters, numbers, and hyphens only
- **Example**: `"learning-python"`, `"tech-tips-2025"`, `"game-review-1"`
- **Rules**:
  - Must be unique across all posts
  - No spaces or special characters
  - Use hyphens to separate words
  - Keep it descriptive but concise

**URL will be**: `https://spencerallen.me/blog/?post=your-id-here`

### `title` (required)
- **Purpose**: The headline of your post
- **Format**: Any text (will be displayed as-is)
- **Example**: `"10 Python Tips for Beginners"`, `"My Gaming Setup 2025"`
- **Tips**:
  - Make it descriptive and engaging
  - Keep it under 60 characters for best display
  - Use title case or sentence case
  - Can include numbers, emojis, punctuation

### `date` (required)
- **Purpose**: Publication date (posts sorted by this)
- **Format**: `"YYYY-MM-DD"` (Year-Month-Day)
- **Example**: `"2025-10-30"`, `"2024-12-25"`, `"2025-01-01"`
- **Rules**:
  - Must be in YYYY-MM-DD format
  - Use actual dates (the system displays them nicely)
  - Posts are sorted newest first
  - Use future dates to "schedule" posts

**Display**: `"2025-10-30"` becomes "October 30, 2025"

### `excerpt` (required)
- **Purpose**: Short preview shown on the blog listing page
- **Format**: Plain text (1-3 sentences)
- **Example**: `"Learn how to set up a Python development environment in under 10 minutes."`
- **Tips**:
  - Keep it between 100-150 characters
  - Make readers want to click "Read More"
  - Don't end with a cliffhanger
  - Avoid starting with "In this post..."

### `content` (required)
- **Purpose**: The full blog post text
- **Format**: Plain text with `\n` for line breaks
- **Line breaks**:
  - `\n` = single line break
  - `\n\n` = paragraph break (recommended)
- **Example**:
  ```json
  "content": "First paragraph here.\n\nSecond paragraph here.\n\nThird paragraph here."
  ```
- **Tips**:
  - Break into multiple paragraphs for readability
  - Use `\n\n` between paragraphs
  - Keep paragraphs 3-5 sentences
  - No HTML needed - just plain text

**Special characters to escape:**
- Double quotes: Use `\"` instead of `"`
  - Example: `"He said \"Hello\""`
- Backslash: Use `\\` instead of `\`
  - Example: `"File path: C:\\Users\\Spencer"`

---

## Examples

### Example 1: Simple Post

```json
{
  "id": "hello-world",
  "title": "Hello World",
  "date": "2025-10-30",
  "excerpt": "My first blog post where I introduce myself.",
  "content": "Welcome to my blog! I'm Spencer, a student from Brisbane, Australia. I'm excited to share my journey in tech and gaming."
}
```

### Example 2: Multi-Paragraph Post

```json
{
  "id": "python-basics",
  "title": "Python Basics for Beginners",
  "date": "2025-10-31",
  "excerpt": "A beginner-friendly introduction to Python programming with practical examples.",
  "content": "Python is one of the most popular programming languages today.\n\nWhy learn Python? Here are three great reasons:\n\n1. Easy to learn and read\n2. Versatile - from web dev to data science\n3. Huge community and resources\n\nI started learning Python last year and it's been amazing. The syntax is clean and the learning curve is gentle.\n\nIf you're interested in coding, I highly recommend starting with Python!"
}
```

### Example 3: Technical Post

```json
{
  "id": "setting-up-nodejs",
  "title": "Setting Up Node.js Development Environment",
  "date": "2025-11-01",
  "excerpt": "Step-by-step guide to installing and configuring Node.js for web development.",
  "content": "Today I'll show you how to set up Node.js on your computer.\n\nWhat you'll need:\n- A computer (Windows, Mac, or Linux)\n- Internet connection\n- 15 minutes of your time\n\nFirst, visit nodejs.org and download the LTS version. This is the most stable release.\n\nOnce downloaded, run the installer and follow the prompts. It's pretty straightforward!\n\nAfter installation, open your terminal and type:\nnpm --version\n\nIf you see a version number, you're all set! In my next post, I'll cover creating your first Node.js app."
}
```

### Example 4: Post with Quotes

```json
{
  "id": "favorite-coding-quotes",
  "title": "My Favorite Coding Quotes",
  "date": "2025-11-02",
  "excerpt": "Inspirational quotes that keep me motivated while coding.",
  "content": "Here are some quotes that inspire me:\n\n\"Code is like humor. When you have to explain it, it's bad.\" - Cory House\n\nThis one resonates with me because clean code should be self-explanatory.\n\n\"First, solve the problem. Then, write the code.\" - John Johnson\n\nI often remind myself of this when I'm tempted to jump straight into coding.\n\nWhat are your favorite coding quotes?"
}
```

---

## Troubleshooting

### Error: "Unexpected token"
**Problem**: JSON syntax error (missing comma, quote, or bracket)

**Solution**: 
1. Copy your entire `posts.json` content
2. Paste it into https://jsonlint.com
3. The validator will show you exactly where the error is

### Error: "Posts not loading"
**Problem**: JSON file has errors or browser cache

**Solutions**:
1. Validate JSON syntax at jsonlint.com
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors (F12 → Console tab)

### Post not appearing
**Problem**: JSON is valid but post doesn't show

**Check**:
1. Did you commit and push your changes?
2. Wait 2-3 minutes for GitHub Pages to rebuild
3. Clear browser cache
4. Verify the post has all required fields
5. Check that the date format is correct (YYYY-MM-DD)

### Post content looks wrong
**Problem**: Line breaks not working or text is jumbled

**Solution**:
- Use `\n\n` for paragraph breaks (double backslash-n)
- Make sure quotes are escaped: `\"` not `"`
- Check that content is within quotes

### "Post not found" error when clicking Read More
**Problem**: The post ID in the URL doesn't match any post ID in posts.json

**Solution**:
- Check that the `id` field matches exactly (case-sensitive)
- No typos in the ID
- The post exists in posts.json

---

## Best Practices

### Writing Tips
1. **Start with the excerpt**: Write this first to clarify your main message
2. **Hook readers early**: Make the first paragraph engaging
3. **Use short paragraphs**: 3-5 sentences each
4. **Be conversational**: Write like you're talking to a friend
5. **Proofread**: Check for typos and grammar before publishing

### Technical Tips
1. **Validate before committing**: Always check JSON syntax
2. **Use descriptive IDs**: `python-tutorial` not `post-1`
3. **Date format**: Always YYYY-MM-DD
4. **Commit messages**: Be descriptive, e.g., "Add blog post about Python basics"
5. **Back up**: Keep a copy of posts.json before major edits

### Content Tips
1. **Be yourself**: Your personality makes your blog unique
2. **Stay consistent**: Post regularly if possible
3. **Add value**: Teach something or share genuine experiences
4. **Engage**: Encourage comments and discussion
5. **Update**: You can edit posts.json anytime to fix typos or add content

### Organization Tips
1. **Order doesn't matter**: Posts auto-sort by date
2. **Use consistent ID naming**: Pick a pattern and stick with it
3. **Archive old posts**: You can remove posts from posts.json anytime
4. **Track ideas**: Keep a separate file for post ideas
5. **Review periodically**: Update old posts if information changes

---

## Advanced: Editing Existing Posts

To edit an existing post, simply find it in `posts.json` and modify the fields:

**Before:**
```json
{
  "id": "my-post",
  "title": "My Post",
  "date": "2025-10-30",
  "excerpt": "Short description",
  "content": "Content here"
}
```

**After:**
```json
{
  "id": "my-post",
  "title": "My Updated Post",
  "date": "2025-10-30",
  "excerpt": "Updated description with more details",
  "content": "Updated content with more information and new paragraphs.\n\nAdditional content here."
}
```

**Note**: Changing the `id` will break existing links to that post!

---

## Advanced: Deleting Posts

To delete a post, remove its entire object from the array:

**Before:**
```json
[
  {
    "id": "keep-this",
    "title": "Keep This Post",
    "date": "2025-10-30",
    "excerpt": "Keep",
    "content": "Keep"
  },
  {
    "id": "delete-this",
    "title": "Delete This Post",
    "date": "2025-10-29",
    "excerpt": "Delete",
    "content": "Delete"
  }
]
```

**After:**
```json
[
  {
    "id": "keep-this",
    "title": "Keep This Post",
    "date": "2025-10-30",
    "excerpt": "Keep",
    "content": "Keep"
  }
]
```

**Remember**: Remove the comma if it's the last item in the array!

---

## Need Help?

If you run into issues:
1. Validate your JSON at https://jsonlint.com
2. Check the browser console (F12) for errors
3. Review this guide's [Troubleshooting](#troubleshooting) section
4. Check that all required fields are present
5. Ensure proper comma placement between posts

Happy blogging! 🚀
