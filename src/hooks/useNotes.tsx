import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note } from '../types';

interface NotesStore {
  notes: { [date: string]: Note };
  updateNote: (date: string, note: Note) => void;
}

export const useNotes = create<NotesStore>()(
  persist(
    (set) => ({
      notes: {},
      updateNote: (date, note) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [date]: note,
          },
        })),
    }),
    {
      name: 'calendar-notes',
    }
  )
);