import { TMDB } from "tmdb-ts";

const emptyPayload = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
  cast: [],
  crew: [],
  parts: [],
  backdrops: [],
  posters: [],
  logos: [],
  genres: [],
  episodes: [],
  seasons: [],
  id: 0,
  title: "",
  name: "",
  overview: "No content available.",
  poster_path: null,
  backdrop_path: null,
  runtime: 0,
  release_date: "",
  first_air_date: "",
  vote_average: 0,
  similar: { results: [], page: 1, total_pages: 0, total_results: 0 },
  recommendations: { results: [], page: 1, total_pages: 0, total_results: 0 },
  credits: { cast: [], crew: [] },
  images: { backdrops: [], posters: [], logos: [] },
  videos: { results: [] },
};

const createMockProxy = (): any => {
  return new Proxy(function () { }, {
    get: (target, prop) => {
      if (prop === "then") return undefined;
      return createMockProxy();
    },
    apply: () => {
      // The promise resolves to a PLAIN JS object, which is serializable by RSC.
      return Promise.resolve(emptyPayload);
    },
  });
};

export const tmdb = createMockProxy() as unknown as TMDB;
