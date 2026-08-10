import type { Route } from "./+types/diary";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Diary — Admin — Bobata" }];
}

export default function AdminDiary() {
  return (
    <p className="text-sm text-secondary">
      Not designed yet — waiting on Bobata's spec.
    </p>
  );
}
