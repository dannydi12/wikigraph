export type APIResponse = {
  from_title_id: string; // originating article
  to_title_id: string; // article being references
  to_title: string; // user friendly formatting of `to_title_id`
  link_id: number;
}[];

export type Link = {
  source: string;
  target: string;
};

export type Node = {
  id: string;
  title: string;
};

export type Data = {
  links: Link[];
  nodes: Node[];
};
