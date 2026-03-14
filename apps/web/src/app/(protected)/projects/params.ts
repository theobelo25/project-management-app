export const PROJECTS_SEARCH_PARAMS = {
  page: "page",
  search: "q",
  filter: "filter",
  sort: "sort",
} as const;

export type ProjectsFilter = "all" | "owned" | "member" | "archived";
export type ProjectsSort = "updated-desc" | "created-desc" | "name-asc";

const DEFAULT_FILTER: ProjectsFilter = "all";
const DEFAULT_SORT: ProjectsSort = "updated-desc";

export function parseProjectsSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const page = Math.max(
    1,
    Number(searchParams[PROJECTS_SEARCH_PARAMS.page]) || 1,
  );
  const search =
    typeof searchParams[PROJECTS_SEARCH_PARAMS.search] === "string"
      ? searchParams[PROJECTS_SEARCH_PARAMS.search]
      : "";
  const filter =
    searchParams[PROJECTS_SEARCH_PARAMS.filter] === "owned" ||
    searchParams[PROJECTS_SEARCH_PARAMS.filter] === "member" ||
    searchParams[PROJECTS_SEARCH_PARAMS.filter] === "archived"
      ? (searchParams[PROJECTS_SEARCH_PARAMS.filter] as ProjectsFilter)
      : DEFAULT_FILTER;
  const sort =
    searchParams[PROJECTS_SEARCH_PARAMS.sort] === "created-desc" ||
    searchParams[PROJECTS_SEARCH_PARAMS.sort] === "name-asc"
      ? (searchParams[PROJECTS_SEARCH_PARAMS.sort] as ProjectsSort)
      : DEFAULT_SORT;
  return { page, search, filter, sort };
}

export function buildProjectsSearchParams(params: {
  page?: number;
  search?: string;
  filter?: ProjectsFilter;
  sort?: ProjectsSort;
}) {
  const p = new URLSearchParams();
  if (params.page != null && params.page !== 1)
    p.set(PROJECTS_SEARCH_PARAMS.page, String(params.page));
  if (params.search?.trim())
    p.set(PROJECTS_SEARCH_PARAMS.search, params.search.trim());
  if (params.filter && params.filter !== DEFAULT_FILTER)
    p.set(PROJECTS_SEARCH_PARAMS.filter, params.filter);
  if (params.sort && params.sort !== DEFAULT_SORT)
    p.set(PROJECTS_SEARCH_PARAMS.sort, params.sort);
  return p.toString();
}
