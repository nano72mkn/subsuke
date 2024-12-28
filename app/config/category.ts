export type Category = 'life' | 'entertainment' | 'work' | 'other';

export const categoryOptions: {
  id: Category,
  label: string
}[] = [
  { label: '生活', id: 'life' },
  { label: '娯楽', id: 'entertainment' },
  { label: '仕事', id: 'work' },
  { label: 'その他', id: 'other' },
];
