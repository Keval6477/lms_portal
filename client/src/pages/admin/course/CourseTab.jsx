import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const [preview, setPreview] = useState("");
  const {
    data: courseData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
  // console.log(course);
  const [publishCourse] = usePublishCourseMutation();
  useEffect(() => {
    const course = courseData?.course;
    if (course) {
      setInput({
        courseTitle: course?.courseTitle,
        subTitle: course?.subTitle,
        description: course?.description,
        category: course?.category,
        courseLevel: course?.courseLevel,
        coursePrice: course?.coursePrice,
        courseThumbnail: course?.courseThumbnail,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, courseData]);

  const [editCourse, { data, isSuccess, isLoading, isError }] =
    useEditCourseMutation();

  const changeHandler = async (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  //get file
  const selectThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreview(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input?.courseTitle);
    formData.append("subTitle", input?.courseTitle);
    formData.append("description", input?.description);
    formData.append("category", input?.category);
    formData.append("coursePrice", input?.coursePrice);
    formData.append("courseThumbnail", input?.courseThumbnail);
    formData.append("courseLevel", input?.courseLevel);
    await editCourse({ formData, courseId });
    console.log(input);
  };

  const publishStatusHandler = async (action) => {
    try {
      console.log(action);
      const response = await publishCourse({ courseId, action });
      if (response.data) {
        refetch();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "updated successfully");
      navigate("/admin/course");
    }
    if (isError) {
      toast.error(data?.error?.message || "something went wrong.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError]);

  if (courseByIdLoading) {
    return <h1>Loading....</h1>;
  }
  // console.log(courseData?.course?.isPublished)

  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Make changes to your courses</CardDescription>
        </div>
        <div className="space-x-4 gap-3">
          <Button
            variant="outline"
            onClick={() =>
              publishStatusHandler(
                courseData?.course?.isPublished ? "false" : "true"
              )
            }
            disabled={courseData?.course?.lectures.length == 0}
          >
            {courseData?.course?.isPublished ? "Unpublished" : "Published"}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <div className="space-y-4 mt-5">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Ex. Fullstack developer"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeHandler}
            />
          </div>
          <div className="space-y-4 mt-5">
            <Label>SubTitle</Label>
            <Input
              type="text"
              placeholder="Ex. Become Fullstack developer"
              name="subTitle"
              value={input.subTitle}
              onChange={changeHandler}
            />
          </div>
          <div className="space-y-4 mt-5">
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="mt-4 flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory} value={input.category}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next js">Next js</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="Kubernates">Kubernates</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Label</Label>
              <Select
                onValueChange={selectCourseLevel}
                value={input.courseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Beginner">Begginer</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={input?.coursePrice}
                name="coursePrice"
                onChange={changeHandler}
                placeholder="499"
                className="fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="images/*"
              className="fit"
              onChange={selectThumbnail}
            />
            {preview && (
              <img
                src={preview}
                className="w-64 my-2"
                alt={input.courseThumbnail}
              />
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancle
            </Button>
            <Button disabled={isLoading} onClick={updateHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
