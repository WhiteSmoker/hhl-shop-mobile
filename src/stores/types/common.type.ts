export type FCWithRefFromComponent<P, C> = React.FC<{ ref?: React.MutableRefObject<C | undefined> } & Omit<P, 'ref'>>;
export interface ISectionHeader<T> {
  section: {
    title: T;
  };
}

export interface IRenderItem<T> {
  item: T;
  index: number;
}
export interface ISectionData<T> {
  title: string;
  data: T[];
}

export type TFieldStumpTab =
  | 'created'
  | 'liked'
  | 'restumped'
  | 'joined'
  | 'createdProfile'
  | 'likedProfile'
  | 'restumpedProfile'
  | 'joinedProfile';
