import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { projectSchema } from './schemas/project'
import { CopyIcon } from '@sanity/icons'

export default defineConfig({
  name: 'christ-mably-cms',
  title: 'Christopher Mably CMS',
  
  projectId: 'cr745m4x',
  dataset: 'production',
  
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // Orderable Projects List
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              S,
              context,
            }),
          ]),
    }),
  ],
  
  schema: {
    types: [projectSchema],
  },
  
})