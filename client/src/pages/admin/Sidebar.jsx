import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-gray-300 p-5 sticky top-0 h-screen">
        <div className="space-y-4 mt-20">
          <Link to={"/admin/dashboard"} className="flex gap-2">
            <ChartNoAxesColumn size={22} />
            <h1> Dashboard</h1>
          </Link>
          <Link to={"/admin/course"} className="flex gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 md:p-24 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
