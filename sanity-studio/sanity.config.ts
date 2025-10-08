import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { projectSchema } from './schemas/project'

export default defineConfig({
  name: 'christ-mably-cms',
  title: 'Christ Mably CMS',
  
  projectId: 'cr745m4x',
  dataset: 'production',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Projects')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .filter('_type == "project"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
          ]),
    }),
  ],
  
  schema: {
    types: [projectSchema],
  },
})
