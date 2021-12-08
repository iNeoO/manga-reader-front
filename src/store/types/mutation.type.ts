// user store
export enum UserMutationTypes {
  SET_USER = 'userStore/SET_USER',
  SET_IS_USER_LOADING = 'userStore/SET_IS_USER_LOADING',
}

// auth store
export enum AuthMutationTypes {
  SET_IS_LOGGED = 'authStore/SET_IS_LOGGED',
  SET_IS_LOGIN_LOADING = 'authStore/SET_IS_LOGIN_LOADING',
}

// application store
export enum ApplicationMutationTypes {
  SET_IS_DARK_MODE = 'applicationStore/SET_IS_DARK_MODE',
  SET_IS_SIDEBAR_OPEN = 'applicationStore/SET_IS_SIDEBAR_OPEN',
}

// manga store
export enum MangaMutationTypes {
  SET_MANGAS = 'mangaStore/SET_MANGAS',
  SET_IS_MANGAS_LOADING = 'mangaStore/SET_IS_MANGAS_LOADING',
  SET_MANGA = 'mangaStore/SET_MANGA',
  SET_IS_MANGA_LOADING = 'mangaStore/SET_IS_MANGA_LOADING',
  SET_CHAPTER = 'mangaStore/SET_CHAPTER',
  SET_IS_CHAPTER_LOADING = 'mangaStore/SET_IS_CHAPTER_LOADING',
  SET_CHAPTERS_READ = 'mangaStore/SET_CHAPTERS_READ',
  SET_IS_CHAPTERS_READ_LOADING = 'mangaStore/SET_IS_CHAPTERS_READ_LOADING',
  SET_IS_POST_CHAPTER_READ_LOADING = 'mangaStore/SET_IS_POST_CHAPTER_READ_LOADING',
  SET_IS_DELETE_CHAPTER_READ_LOADING = 'mangaStore/SET_IS_DELETE_CHAPTER_READ_LOADING',
}
