import React from "react";
import CreateServiceListing from "./CreateServiceListing";

const EditServiceListing = ({ theme, setTheme }) => {
  return <CreateServiceListing mode="edit" theme={theme} setTheme={setTheme} />;
};

export default EditServiceListing;