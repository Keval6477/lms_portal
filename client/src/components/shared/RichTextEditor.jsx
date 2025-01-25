// import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// eslint-disable-next-line react/prop-types
const RichTextEditor = ({ input, setInput }) => {
  //   const [value, setValue] = useState("");
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };
  return (
    <ReactQuill
      theme="snow"
      // eslint-disable-next-line react/prop-types
      value={input?.description}
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;
