import type { Route } from "./+types/articles";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Articles — Admin — Bobata" }];
}

export default function AdminArticles() {
  return <p className="text-sm text-secondary">Not built yet.</p>;
}
