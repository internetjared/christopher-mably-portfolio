import { defineType, defineField } from 'sanity'

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Optional client name (will display above project title)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Commercial', value: 'commercial' },
          { title: 'Narrative', value: 'narrative' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      description: 'Used for drag-and-drop ordering in Sanity Studio',
      hidden: true, // Hide from editors - this is managed automatically
    }),
    defineField({
      name: 'thumbnail',
      title: 'Project Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'text',
      rows: 4,
      description: 'Brief description of the project',
    }),
    defineField({
      name: 'credits',
      title: 'Project Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              type: 'string',
              title: 'Role',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'name',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'topStills',
      title: 'Top Still Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Images to display above the film strip on hover',
    }),
    defineField({
      name: 'bottomStills',
      title: 'Bottom Still Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Images to display below the film strip on hover',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo Video URL',
      type: 'url',
      description: 'The Vimeo video URL for this project',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project on the homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      subtitle: 'overview',
    },
    prepare(selection) {
      const { title, media, subtitle } = selection
      return {
        title: title,
        media: media,
        subtitle: subtitle ? subtitle.substring(0, 100) + '...' : 'No overview',
      }
    },
  },
})
