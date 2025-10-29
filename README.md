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

To add a new blog post, simply edit the `blog/posts.json` file. Add a new entry to the array with the following structure:

```json
{
  "id": "unique-post-id",
  "title": "Your Post Title",
  "date": "YYYY-MM-DD",
  "excerpt": "A short description that appears on the blog listing page.",
  "content": "The full content of your blog post. You can use \n for line breaks."
}
```

### Example:

```json
{
  "id": "my-new-post",
  "title": "My Exciting New Post",
  "date": "2025-10-30",
  "excerpt": "This is a preview of my new post.",
  "content": "This is the full content of my post.\n\nYou can add multiple paragraphs by using line breaks."
}
```

Posts are automatically sorted by date (newest first) and displayed on the blog page at https://spencerallen.me/blog/
