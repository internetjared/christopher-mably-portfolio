# Fix Project Slugs in Sanity

## The Problem
The navigation is failing because project slugs are empty or malformed, causing URLs like `/project//star-trek` (double slash).

## Quick Fix Steps

### 1. Go to Sanity Studio
- Open `http://localhost:3333`
- Make sure it's running

### 2. Fix Each Project's Slug

For **each project** in your CMS:

1. **Click on the project** to edit it
2. **Find the "Slug" field** (should be near the top, after the title)
3. **Click the "Generate" button** next to the slug field
   - This will auto-generate a slug from the project title
   - For "Star Trek Discovery 'Rosetta'" → should become "star-trek-discovery-rosetta"
   - For "Nike" → should become "nike"
4. **Make sure the slug is not empty** and looks like: `star-trek-discovery-rosetta`
5. **Click "Publish"** to save

### 3. Verify the Slugs
After fixing each project, the slugs should look like:
- Project 1: `star-trek-discovery-rosetta`
- Project 2: `nike` (or whatever your second project is called)

### 4. Test Navigation
- Go back to your website
- Pause the video
- Click the navigation arrows
- Check the browser console - you should see proper URLs like `/project/star-trek-discovery-rosetta`

## What the Console Should Show

**Before fix (broken):**
```
Project slug: { current: "" }
Project slug.current: ""
No valid slug found for project: Star Trek Discovery 'Rosetta'
```

**After fix (working):**
```
Project slug: { current: "star-trek-discovery-rosetta" }
Project slug.current: "star-trek-discovery-rosetta"
Navigating to URL: /project/star-trek-discovery-rosetta
```

## If the Generate Button Doesn't Work

If the auto-generate doesn't work, manually type the slug:
- Use lowercase letters
- Replace spaces with hyphens
- Remove special characters
- Examples:
  - "Star Trek Discovery 'Rosetta'" → `star-trek-discovery-rosetta`
  - "Nike Commercial" → `nike-commercial`
  - "Project Name" → `project-name`

## Troubleshooting

### Still Getting Double Slashes?
1. Check that the slug field is not empty
2. Make sure you clicked "Publish" after setting the slug
3. Refresh the website after publishing
4. Check the browser console for the detailed debugging info

### Slug Field is Missing?
1. Make sure you're using the updated schema
2. Restart Sanity Studio: `cd sanity-studio && npm run dev`
3. The slug field should appear right after the title field

## Quick Checklist
- [ ] Sanity Studio is running
- [ ] Each project has a valid slug (not empty)
- [ ] All projects are published
- [ ] Website is refreshed
- [ ] Console shows proper URLs (no double slashes)

