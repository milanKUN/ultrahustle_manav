import React from "react";
import CreateDigitalProduct from "./CreateDigitalProduct";

const EditDigitalProduct = ({ theme, setTheme }) => {
  return (
    <CreateDigitalProduct
      mode="edit"
      theme={theme}
      setTheme={setTheme}
    />
  );
};

export default EditDigitalProduct;
