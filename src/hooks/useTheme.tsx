import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () =>
        set((state) => {
          const newIsDark = !state.isDark;
          const editor = document.querySelector('[title="Editor"]') as HTMLIFrameElement;
          
          if (newIsDark) {
            document.documentElement.classList.add('dark');
            if (editor) {
              editor.contentWindow?.postMessage({ 
                type: 'SET_THEME', 
                theme: 'dark' 
              }, '*')
            }
          } else {
            document.documentElement.classList.remove('dark');
            if (editor) {
              editor.contentWindow?.postMessage({ 
                type: 'SET_THEME', 
                theme: 'light' 
              }, '*')
            }
          }
          return { isDark: newIsDark };
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);