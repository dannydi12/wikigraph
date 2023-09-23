export type Link = {
  from_title_id: string; // originating article
  to_title_id: string; // article being referenced
  to_title: string; // user friendly formatting of `to_title_id`
  link_id: number;
}