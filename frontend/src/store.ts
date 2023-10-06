import { writable } from "svelte/store";

export const readingListStore = writable({
    articles: [],
    loading: true,
    error: false
    });