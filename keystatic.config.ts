import { config, fields, collection } from '@keystatic/core';

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'Heijo-Studio/heijo-studio-web',
        branchPrefix: 'content/',
      }
    : {
        kind: 'local',
      },
  collections: {
    architecture: collection({
      label: 'Architecture',
      slugField: 'title',
      path: 'src/content/works/architecture/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'src/assets/images/works/architecture',
          publicPath: '@assets/images/works/architecture',
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/images/works/architecture',
              publicPath: '@assets/images/works/architecture',
            }),
            alt: fields.text({ label: 'Alt text' }),
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.fields.alt.value || 'Gallery Image',
          },
        ),
        size: fields.text({ label: 'Size' }),
        design: fields.text({ label: 'Design' }),
        construction: fields.date({ label: 'Construction' }),
        location: fields.text({ label: 'Location' }),
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      },
    }),
    constructionEngineering: collection({
      label: 'Construction Engineering',
      slugField: 'title',
      path: 'src/content/works/construction-engineering/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'src/assets/images/works/construction-engineering',
          publicPath: '@assets/images/works/construction-engineering',
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/images/works/construction-engineering',
              publicPath: '@assets/images/works/construction-engineering',
            }),
            alt: fields.text({ label: 'Alt text' }),
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.fields.alt.value || 'Gallery Image',
          },
        ),
        size: fields.text({ label: 'Size' }),
        design: fields.text({ label: 'Design' }),
        construction: fields.date({ label: 'Construction' }),
        location: fields.text({ label: 'Location' }),
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      },
    }),
    interior: collection({
      label: 'Interior',
      slugField: 'title',
      path: 'src/content/works/interior/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'src/assets/images/works/interior',
          publicPath: '@assets/images/works/interior',
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/images/works/interior',
              publicPath: '@assets/images/works/interior',
            }),
            alt: fields.text({ label: 'Alt text' }),
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.fields.alt.value || 'Gallery Image',
          },
        ),
        size: fields.text({ label: 'Size' }),
        design: fields.text({ label: 'Design' }),
        construction: fields.date({ label: 'Construction' }),
        location: fields.text({ label: 'Location' }),
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      },
    }),
    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'src/content/works/products/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'src/assets/images/works/products',
          publicPath: '@assets/images/works/products',
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/images/works/products',
              publicPath: '@assets/images/works/products',
            }),
            alt: fields.text({ label: 'Alt text' }),
          }),
          {
            label: 'Gallery',
            itemLabel: (props) => props.fields.alt.value || 'Gallery Image',
          },
        ),
        size: fields.text({ label: 'Size' }),
        design: fields.text({ label: 'Design' }),
        construction: fields.date({ label: 'Construction' }),
        location: fields.text({ label: 'Location' }),
        content: fields.mdx({ label: 'Content', extension: 'md' }),
      },
    }),
  },
});
