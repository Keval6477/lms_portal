import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data, isLoading, isSuccess, isError }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHanlder = async () => {
    await createCheckoutSession(courseId);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("course purchase completed successfully.");
      if (data?.url) {
        window.location.href = data.url;
      }
    }
    if (isError) {
      toast.error("somthing went wrong.");
    }
  }, [isSuccess, data]);
  return (
    // <div>
    <Button className="w-full" onClick={purchaseCourseHanlder}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase course"
      )}
    </Button>
    // </div>
  );
};

export default BuyCourseButton;
