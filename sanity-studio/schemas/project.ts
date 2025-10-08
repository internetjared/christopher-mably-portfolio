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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order projects will appear in navigation (1, 2, 3, etc.)',
      validation: (Rule) => Rule.min(1).integer().required(),
      initialValue: 1,
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
      name: 'stills',
      title: 'Project Stills',
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
      order: 'order',
    },
    prepare(selection) {
      const { title, media, subtitle, order } = selection
      return {
        title: `#${order || '?'} - ${title}`,
        media: media,
        subtitle: subtitle ? subtitle.substring(0, 100) + '...' : 'No overview',
      }
    },
  },
})
