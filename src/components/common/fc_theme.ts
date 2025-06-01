import { ref } from 'vue';

export const theme = ref<'light' | 'dark'>('light');

export const setTheme = (val: string) => {
  if (val === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
    theme.value = 'dark';
  } else {
    document.body.removeAttribute('arco-theme');
    theme.value = 'light';
  }
  localStorage.setItem('theme', val);
};

export const loadTheme = () => {
  const val: string | null = localStorage.getItem('theme');
  if (val) {
    setTheme(val);
  }
};
