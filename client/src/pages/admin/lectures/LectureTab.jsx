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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = `http://localhost:8080/api/v1/media`;
const LectureTab = () => {
  const { courseId, lectureId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [editLecture, { data, isSuccess, isLoading, error }] =
    useEditLectureMutation();
  const [removeLecture] = useRemoveLectureMutation();
  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  console.log(lectureData?.lecture);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture?.lectureTitle);
      setIsFree(lecture?.isPreviewFree ?? false);
    }
  }, [lecture]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res?.data?.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res?.data?.data?.url,
            publicId: res?.data?.data?.public_id,
          });
          setButtonDisabled(false);
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMediaProgress(false);
      }
    }
  };
  // console.log(uploadVideoInfo);
  const editLectureHanlder = async () => {
    // console.log(isFree);
    await editLecture({
      lectureTitle,
      isPreviewFree: isFree,
      videoInfo: uploadVideoInfo,
      courseId,
      lectureId,
    });
    // alert("abc");
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "lecture Updated");
    }
    if (error) {
      toast.error(error?.message || "something went wrong.");
    }
  }, [data, isSuccess, error]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Make changes to your lecture</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={removeLectureHandler}>
            Remove Lecture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter lecture Title"
            onChange={(e) => setLectureTitle(e.target.value)}
            value={lectureTitle}
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            className="w-fit"
            accept="video/*"
            onChange={(e) => handleFileChange(e)}
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="airplane-mode"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="airplane-mode">Is video Free</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress} % percentage</p>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={editLectureHanlder}>
            {isLoading ? "loading" : "Update"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
