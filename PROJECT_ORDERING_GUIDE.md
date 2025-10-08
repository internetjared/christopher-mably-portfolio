# Project Ordering Setup Guide

## How to Order Projects in Sanity CMS

### 1. Access Sanity Studio
- Go to `http://localhost:3333` (Sanity Studio)
- Make sure it's running with `cd sanity-studio && npm run dev`

### 2. Set Up Project Order
For each project in your CMS:

1. **Open the project** you want to edit
2. **Find the "Display Order" field** (it should be near the top)
3. **Set the order number**:
   - First project: `1`
   - Second project: `2` 
   - Third project: `3`
   - And so on...

### 3. Example Order Setup
```
Project 1: "Star Trek Discovery 'Rosetta'" → Order: 1
Project 2: "Another Project" → Order: 2
Project 3: "Third Project" → Order: 3
```

### 4. Save and Publish
- Click **"Publish"** after setting the order
- The projects will now appear in this order in the navigation

### 5. Verify the Setup
- Go back to your website (`http://localhost:5173` or `http://localhost:5174`)
- Pause the video to see thumbnail previews
- Click the left/right arrows to navigate between projects
- Check the browser console for debugging info

## Troubleshooting

### If Navigation Doesn't Work:
1. **Check the console** for error messages
2. **Verify slugs are set** - each project needs a valid slug
3. **Make sure order numbers are unique** - no duplicates
4. **Ensure projects are published** in Sanity

### If You See Double Slashes in URLs:
- This means a project's slug is empty or malformed
- Go back to Sanity and make sure each project has a proper slug
- The slug should be auto-generated from the title

### Console Debugging:
The website now shows detailed logging in the browser console:
- Project data being loaded
- Navigation attempts
- Slug information
- Order information

## Quick Setup Checklist

- [ ] Sanity Studio is running (`http://localhost:3333`)
- [ ] Website is running (`http://localhost:5173` or `http://localhost:5174`)
- [ ] All projects have unique order numbers (1, 2, 3, etc.)
- [ ] All projects have valid slugs
- [ ] All projects are published in Sanity
- [ ] Test navigation by clicking arrows when video is paused

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify your Sanity project has the correct project ID (`cr745m4x`)
3. Make sure CORS is set up correctly in Sanity settings
4. Try refreshing both the CMS and the website

