
export interface Options {
  headers: Object,
}

export interface Fetcher<T> {
  fetch<T>(url: string, options: Options): Promise<T>
};