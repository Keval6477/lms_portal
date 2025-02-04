/* eslint-disable react/prop-types */
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, index, courseId }) => {
  const navigate = useNavigate();
  const gotoUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };
  return (
    <div className="flex items-center justify-between bg-[#bbe2f6] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800">
        Lecture - {index + 1} {lecture?.lectureTitle}
      </h1>
      <Edit
        className="cursor-pointer text-gray-600 hover:text-blue-600"
        size={20}
        onClick={gotoUpdateLecture}
      />
    </div>
  );
};

export default Lecture;
