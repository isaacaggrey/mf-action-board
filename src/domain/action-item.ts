export class ActionItem {
  name: string;
  priority: number;
  type: string;
  source: string;
  created: number;
  url: string;
  do_not_merge: boolean;
  model?: string;
  building?: boolean;
  buildPercentage?: number;
}
