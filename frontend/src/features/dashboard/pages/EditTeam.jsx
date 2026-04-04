import React from "react";
import CreateTeam from "./CreateTeam";

const EditTeam = ({ theme, setTheme }) => {
  return <CreateTeam mode="edit" theme={theme} setTheme={setTheme} />;
};

export default EditTeam;
