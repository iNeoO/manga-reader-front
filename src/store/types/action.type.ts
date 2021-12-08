export enum UserActionTypes {
  getUser = 'userStore/getUser',
}

export enum AuthActionTypes {
  login = 'authStore/login',
}

export enum ApplicationActionTypes {}

export enum MangaActionTypes {
  getMangas = 'mangaStore/getMangas',
  getManga = 'mangaStore/getManga',
  getChapter = 'mangaStore/getChapter',
  postChapterReading = 'mangaStore/postChapterReading',
  getChaptersRead = 'mangaStore/getChaptersRead',
  deleteChapterReading = 'mangaStore/deleteChapterReading',
}
