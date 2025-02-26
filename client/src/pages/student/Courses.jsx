import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";
import { useGetPublishCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data: courses, isLoading } = useGetPublishCourseQuery();
  // const isLoading = false;
  // const courses = [1, 2, 3, 4, 5, 6];
  console.log(courses);
  if (isLoading) {
    return <h1>isLoading....</h1>;
  }
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses?.courses &&
              courses?.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4"></Skeleton>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
