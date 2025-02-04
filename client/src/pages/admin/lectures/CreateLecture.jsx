import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {
    data: lectureData,
    isLoading: lectureDataLoading,
    refetch,
  } = useGetCourseLecturesQuery(courseId);
  const [createLecture, { isLoading, isSuccess, data, error }] =
    useCreateLectureMutation();
  const [lectureTitle, setLectureTitle] = useState("");
  // const isLoading = false;

  const createLectureHandler = async () => {
    // alert(lectureTitle);
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "lecture created successfully");
    }
    if (error) {
      toast.error(error?.message || "Something went wrong.");
    }
  }, [data, isSuccess, error]);

  // console.log(lectureData);
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add Lecture, add some basic Lecture detail
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum, ea?
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            placeholder="Your lecture"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureDataLoading ? (
            <p>Loadin.....</p>
          ) : lectureData.lectures.lenght == 0 ? (
            <p>No lecture availabel.</p>
          ) : (
            lectureData?.lectures?.map((lecture, index) => {
              return (
                <Lecture
                  key={lecture?._id}
                  lecture={lecture}
                  index={index}
                  courseId={courseId}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
