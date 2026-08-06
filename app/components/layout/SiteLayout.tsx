import { Outlet } from "react-router";
import { Rail } from "./Rail";
import { TopNav } from "./TopNav";

/** Left rail + top nav, wrapping every route. */
export default function SiteLayout() {
  return (
    <div className="flex min-h-screen items-stretch bg-void">
      <Rail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <Outlet />
      </div>
    </div>
  );
}
