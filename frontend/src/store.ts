import { writable } from "svelte/store";

export const readingListStore = writable({
    articles: [],
    sources: [],
    loading: true,
    error: false
    });