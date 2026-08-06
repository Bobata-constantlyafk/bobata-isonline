declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { ArticleFrontmatter } from "~/lib/articles";

  export const frontmatter: ArticleFrontmatter;
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>;
  export default MDXComponent;
}
