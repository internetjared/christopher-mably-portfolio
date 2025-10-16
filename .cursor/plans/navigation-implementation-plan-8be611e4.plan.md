<!-- 8be611e4-01ca-4beb-a2ef-281e516e0790 4a4cb712-0a05-4bf5-96c3-beeca01c9a5d -->
# Still Images Hover Feature

## Overview

When hovering over a project thumbnail in the film strip, display horizontal stripes of still images above and below the strip. Images should be 16:9 aspect ratio, span full width, with no padding between them.

## Confirmed Specifications

1. **Number of stills**: No limit - if many images, stripe will be scrollable horizontally
2. **Still image height**: Fixed at 175px with 16:9 aspect ratio (width auto-calculated)
3. **Loading strategy**: Load all stills on page load for immediate display
4. **Layout**: Still stripes inside strip wrapper, spanning full width (100vw)
5. **Spacing**: 60px white space between top stills and film strip, and between film strip and bottom stills

## Implementation Plan

### 1. Update Sanity Schema

**File**: `sanity-studio/schemas/project.ts`

**Changes**:

- Remove existing `stills` field
- Add `topStills` field (array of images, drag-and-drop ordering)
- Add `bottomStills` field (array of images, drag-and-drop ordering)
- Include alt text for each image
- Make fields optional

### 2. Update TypeScript Types

**File**: `src/lib/types/sanity.ts`

Add:

```typescript
topStills?: Array<{
  asset: { _ref: string; _type: string; };
  alt?: string;
}>;
bottomStills?: Array<{
  asset: { _ref: string; _type: string; };
  alt?: string;
}>;
```

### 3. Update Sanity Queries

**File**: `src/lib/sanity.ts`

Update `PROJECTS_QUERY` to include:

```groq
topStills[] { asset->, alt },
bottomStills[] { asset->, alt }
```

### 4. Create StillImagesStripe Component

**File**: `src/lib/components/StillImagesStripe.svelte` (NEW)

**Features**:

- Display horizontal stripe of images
- 16:9 aspect ratio, no padding
- Auto-calculate height: `width / (16/9)`
- Horizontal scroll if many images
- Fade in/out transitions (0.3s)
- Full viewport width

**Props**:

- `images`: Array of still images
- `position`: 'top' | 'bottom'
- `visible`: boolean

**Styling**:

- `overflow-x: auto` for scrollable behavior
- Images: `flex: 0 0 auto` for natural sizing
- Calculate image dimensions to fit screen evenly
- Smooth fade: `opacity` transition

### 5. Update ProjectCarousel Component

**File**: `src/lib/components/ProjectCarousel.svelte`

**Changes**:

a) **State Management**:

- Get hovered project's topStills and bottomStills
- Track hover state (already exists)

b) **Layout**:

```svelte
<div class="carousel-wrapper">
  <!-- Top Stills -->
  <StillImagesStripe 
    images={hoveredProject?.topStills || []} 
    position="top"
    visible={hoveredProjectIndex !== null}
  />
  
  <!-- Film Strip (existing) -->
  <div class="strip-wrapper">...</div>
  
  <!-- Bottom Stills -->
  <StillImagesStripe 
    images={hoveredProject?.bottomStills || []} 
    position="bottom"
    visible={hoveredProjectIndex !== null}
  />
</div>
```

c) **Logic**:

- On hover: Pause scrolling, show stills
- On hover end: Hide stills, resume scrolling
- Switch projects: Fade out old stills, fade in new

### 6. Styling & Layout

**StillImagesStripe**:

- Position: `absolute` or `fixed`
- Width: `100vw`
- Display: `flex`, `flex-wrap: nowrap`
- Overflow: `overflow-x: auto`, `overflow-y: hidden`
- Gap: `0`
- Images: Auto-sized for even distribution
- Aspect ratio: 16:9 maintained
- Z-index: Below UI, above strip background

**Image Sizing**:

- Calculate width per image to fill viewport
- If > 6 images: Allow horizontal scroll
- Height: Auto-calculated from width (16:9)

## Implementation Steps

1. Update Sanity schema - Add topStills/bottomStills
2. Update TypeScript types - Match schema
3. Update Sanity queries - Include new fields
4. Create StillImagesStripe component
5. Update ProjectCarousel - Integrate stills display
6. Test hover behavior and transitions
7. Deploy and verify in Sanity Studio

## Files to Create/Modify

**Create**:

- `src/lib/components/StillImagesStripe.svelte`

**Modify**:

- `sanity-studio/schemas/project.ts`
- `src/lib/types/sanity.ts`
- `src/lib/sanity.ts`
- `src/lib/components/ProjectCarousel.svelte`

## Expected Behavior

1. **Default**: Film strip scrolls, no stills visible
2. **On hover**: 

   - Film strip pauses
   - Top stills fade in above
   - Bottom stills fade in below
   - Title overlay shows on thumbnail

3. **Hover removed**: Stills fade out, scrolling resumes
4. **Different project hover**: Smooth transition to new stills

### To-dos

- [ ] Add stopPropagation and preventDefault to arrow click handlers
- [ ] Review and fix page transition z-index/opacity issues
- [ ] Ensure project page content is fully visible
- [ ] Test both arrow navigation and project page navigation