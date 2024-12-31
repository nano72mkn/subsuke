export const category = ['life', 'entertainment', 'work', 'other'] as const;
export type CategoryType = typeof category[number];

export const categoryOptions: {
  id: CategoryType,
  label: string
}[] = [
  { label: '生活', id: 'life' },
  { label: '娯楽', id: 'entertainment' },
  { label: '仕事', id: 'work' },
  { label: 'その他', id: 'other' },
];
