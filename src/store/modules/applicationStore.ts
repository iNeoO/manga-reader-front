export type State = {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
};

const state = {
  isDarkMode: localStorage.getItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY),
  isSidebarOpen: false,
};

if (localStorage.getItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY)) {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

const actions = {};

const getters = {
  isDarkMode: (state: State): boolean => state.isDarkMode,
  isSidebarOpen: (state: State): boolean => state.isSidebarOpen,
};

const mutations = {
  SET_IS_DARK_MODE(state: State, isDarkMode: boolean): void {
    if (isDarkMode) {
      localStorage.setItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY, 'true');
      document.body.classList.add('dark');
    } else {
      localStorage.removeItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY);
      document.body.classList.remove('dark');
    }
    state.isDarkMode = isDarkMode;
  },
  SET_IS_SIDEBAR_OPEN(state: State, isSidebarOpen: boolean): void {
    state.isSidebarOpen = isSidebarOpen;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
