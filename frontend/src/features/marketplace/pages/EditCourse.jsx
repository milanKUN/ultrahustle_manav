import React from "react";
import CreateCourse from "./CreateCourse";

const EditCourse = ({ theme, setTheme }) => {
  return <CreateCourse mode="edit" theme={theme} setTheme={setTheme} />;
};

export default EditCourse;
