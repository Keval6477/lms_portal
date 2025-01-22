/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/api/authApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch, isError } = useLoadUserQuery();
  if (isLoading) {
    console.log("Loading user profile...");
  }

  if (isError) {
    console.error("Error loading user profile:", isError);
  }
  console.log(data);
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError: error,
      isSuccess,
    },
  ] = useUpdateUserMutation();
  // console.log(data);

  const changeHandler = (e) => {
    const files = e.target.files?.[0];
    if (files) setProfilePhoto(files);
  };

  // // if (isLoading) {
  // //   return <h1>Profile loading...</h1>;
  // // }
  const user = data && data.user;
  // // const isLoading = false;
  // const enrolledCourses = [1, 2];
  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
    // console.log(name);
    // console.log(profilePhoto);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile Updated.");
    }
    if (error) {
      toast.error(error.message || "somethig went wrong.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    // <>ss</>
    <div className="max-w-4xl mx-auto my-24 px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 ">
              Name:
              <span className="font-normal text-gray-700">{user?.name}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 ">
              Email:
              <span className="font-normal text-gray-700">{user?.email}</span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 ">
              Role:
              <span className="font-normal text-gray-700">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="name"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile</Label>
                  <Input
                    type="file"
                    className="col-span-3"
                    accept="image*/"
                    onChange={changeHandler}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isLoading} onClick={updateUserHandler}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you are enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses.length == 0 ? (
            <h1>You have not enrolled any course</h1>
          ) : (
            user?.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
