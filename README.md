# spencerallen-dev.github.io
https://spencerallen.me/
Personal website for Spencer Allen - A modern, animated portfolio site with a cyberpunk theme.

## Structure

```
├── css/               # Stylesheets
│   ├── style.css     # Main shared styles
│   ├── tech.css      # Tech page specific styles
│   ├── about.css     # About page specific styles
│   └── blog.css      # Blog page specific styles
├── js/               # JavaScript files
│   ├── main.js       # Main script with button animations
│   ├── simple.js     # Simplified script for pages without buttons
│   └── blog.js       # Blog functionality
├── tech/             # Tech projects section
│   └── index.html
├── about/            # About page
│   └── index.html
├── blog/             # Blog section
│   ├── index.html
│   └── posts.json    # Blog posts data
├── index.html        # Homepage
├── 404.html          # 404 error page
└── robots.txt        # SEO configuration
```

## Features

- Animated particle background
- Responsive design
- Dark theme with cyan accents
- Smooth fade-in animations
- Blog with dynamic post loading
- GitHub Pages deployment

## Adding New Blog Posts

The blog system uses a simple JSON file to manage all posts. No HTML editing required!

### Step-by-Step Guide

#### 1. **Locate the posts file**
   - Navigate to the `blog/` directory
   - Open the file `posts.json`

#### 2. **Understand the structure**
   The file contains an array of post objects. Each post has these fields:
   
   - **`id`** (required): A unique identifier for the post. Use lowercase letters, numbers, and hyphens only. This appears in the URL.
     - ✅ Good: `"my-first-post"`, `"python-tutorial-2024"`, `"game-review-1"`
     - ❌ Bad: `"My Post!"`, `"post with spaces"`, `"post@123"`
   
   - **`title`** (required): The title of your post that appears as the heading.
     - Example: `"Welcome to My Blog"`, `"10 Python Tips for Beginners"`
   
   - **`date`** (required): Publication date in YYYY-MM-DD format. Posts are automatically sorted by this date (newest first).
     - Format: `"2025-10-30"` (Year-Month-Day)
   
   - **`excerpt`** (required): A short preview (1-2 sentences) that appears on the blog listing page.
     - Keep it under 150 characters for best display
     - Example: `"Learn the basics of Python programming in this beginner-friendly tutorial."`
   
   - **`content`** (required): The full text of your blog post.
     - Use `\n` for single line breaks
     - Use `\n\n` for paragraph breaks
     - Keep it readable - the blog will format it nicely

#### 3. **Add your new post**

   Open `blog/posts.json` and add your new post to the array. **Important**: Make sure to add a comma after the previous post!

   **Before adding a post:**
   ```json
   [
     {
       "id": "existing-post",
       "title": "Existing Post",
       "date": "2025-10-28",
       "excerpt": "An existing post.",
       "content": "Content here."
     }
   ]
   ```

   **After adding your post:**
   ```json
   [
     {
       "id": "existing-post",
       "title": "Existing Post",
       "date": "2025-10-28",
       "excerpt": "An existing post.",
       "content": "Content here."
     },
     {
       "id": "my-new-post",
       "title": "My New Post",
       "date": "2025-10-30",
       "excerpt": "This is my brand new blog post about coding.",
       "content": "Welcome to my new post!\n\nThis is the first paragraph with some interesting content.\n\nThis is the second paragraph with more details.\n\nAnd here's a third paragraph to wrap things up."
     }
   ]
   ```

#### 4. **Complete Example**

   Here's a full example of adding a new post about learning JavaScript:

   ```json
   {
     "id": "learning-javascript-2025",
     "title": "My JavaScript Learning Journey in 2025",
     "date": "2025-10-30",
     "excerpt": "Sharing my experience learning JavaScript and building my first interactive web applications.",
     "content": "I recently started learning JavaScript and it's been an amazing journey!\n\nJavaScript is everywhere - from websites to mobile apps to even backend servers. Here are three things that surprised me:\n\n1. The language is more powerful than I expected\n2. There are so many frameworks to choose from\n3. The community is incredibly helpful\n\nIf you're thinking about learning JavaScript, I highly recommend starting with the basics and building small projects. That's how I learned best!\n\nNext, I plan to dive into React and build a portfolio website. Stay tuned for updates!"
   }
   ```

#### 5. **Test your post**

   After saving `posts.json`:
   
   1. **Check JSON syntax**: Use a JSON validator (like https://jsonlint.com) to ensure there are no syntax errors
   2. **Preview locally**: If running a local server, refresh the blog page
   3. **Check on GitHub Pages**: After committing and pushing, wait a minute for GitHub Pages to rebuild

#### 6. **Common mistakes to avoid**

   ❌ **Missing comma between posts**
   ```json
   [
     {"id": "post-1", ...}
     {"id": "post-2", ...}  // ERROR: Missing comma after post-1
   ]
   ```

   ✅ **Correct syntax**
   ```json
   [
     {"id": "post-1", ...},
     {"id": "post-2", ...}
   ]
   ```

   ❌ **Trailing comma after last post**
   ```json
   [
     {"id": "post-1", ...},
     {"id": "post-2", ...},  // ERROR: Extra comma
   ]
   ```

   ❌ **Invalid date format**
   ```json
   "date": "10/30/2025"  // Wrong format
   ```

   ✅ **Correct date format**
   ```json
   "date": "2025-10-30"  // YYYY-MM-DD
   ```

   ❌ **Unescaped special characters**
   ```json
   "content": "This is a quote: "Hello""  // ERROR: Unescaped quotes
   ```

   ✅ **Properly escaped**
   ```json
   "content": "This is a quote: \"Hello\""
   ```

#### 7. **Tips for writing great posts**

   - **Keep excerpts engaging**: Make readers want to click "Read More"
   - **Use descriptive IDs**: `python-tutorial` is better than `post-1`
   - **Format for readability**: Use `\n\n` to separate paragraphs
   - **Date consistently**: Always use YYYY-MM-DD format
   - **Proofread**: Check spelling and grammar before publishing

#### 8. **Viewing your posts**

   - **All posts**: https://spencerallen.me/blog/
   - **Single post**: https://spencerallen.me/blog/?post=your-post-id

   Posts are automatically sorted by date (newest first) on the listing page.

### Quick Reference Template

Copy and paste this template when adding a new post:

```json
{
  "id": "post-id-here",
  "title": "Post Title Here",
  "date": "YYYY-MM-DD",
  "excerpt": "Brief description here (1-2 sentences).",
  "content": "Full post content here.\n\nAdd paragraphs with double line breaks.\n\nKeep writing your thoughts!"
}
```

**Remember**: The blog system automatically handles:
- ✅ Sorting posts by date
- ✅ Formatting dates nicely
- ✅ Creating individual post pages
- ✅ Generating "Read More" links
- ✅ Styling with the site theme

You only need to maintain the `posts.json` file!
