import React from "react";
import CreateWebinar from "./CreateWebinar";

const EditWebinar = ({ theme, setTheme }) => {
  return <CreateWebinar mode="edit" theme={theme} setTheme={setTheme} />;
};

export default EditWebinar;
