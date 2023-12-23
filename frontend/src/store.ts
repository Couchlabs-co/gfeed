import { writable } from "svelte/store";

export const gFeedStore = writable({
    articles: [],
    sources: [],
    loading: true,
    error: false
    });