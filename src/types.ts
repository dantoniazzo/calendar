export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'taskList';
  content: string;
}

export interface Note {
  blocks: Block[];
}

export type CalendarView = 'week' | 'month';