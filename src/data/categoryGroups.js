// Broader groupings shown in the Figma search filters and the Course Detail
// breadcrumb ("Home › {group} › {category}"). Several sub-categories can
// share a group; a sub-category may appear in more than one group when
// Figma's own copy overlaps (e.g. Business / Marketing).
export const CATEGORY_GROUPS = [
  { key: 'design', label: 'Design & Creative', categories: ['ui-ux-design', 'graphic-design', '3d-animation', 'photography', 'branding'] },
  { key: 'business', label: 'Business', categories: ['business'] },
  { key: 'technology', label: 'Technology', categories: ['technology'] },
  { key: 'personal-development', label: 'Personal Development', categories: [] },
  { key: 'marketing', label: 'Marketing', categories: ['business'] },
]

export function groupLabelForCategory(categoryKey) {
  return CATEGORY_GROUPS.find((group) => group.categories.includes(categoryKey))?.label
}
