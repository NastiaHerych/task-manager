export class Task {
  _id: string;
  title: string;
  description: string;
  project_id: string;
  dev_id: string;
  qa_id: string;
  created_by: string;
  created_at: Date;
  is_important: boolean;
  is_completed: boolean;
  status: string;
  story_points: number;
}
