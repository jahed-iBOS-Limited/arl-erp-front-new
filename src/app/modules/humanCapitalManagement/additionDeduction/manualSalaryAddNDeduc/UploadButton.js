import React, { useState } from "react";
/* eslint-disable no-unused-vars */

const UploadButton = (props) => {
  const [fileName, setFileName] = useState("");
  function onFileChange(e) {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      props.onFileChange(e.target.files[0], props.values, setFileName);
    }
  }
  return (
    <div style={{ width: "235px" }} className="input-group">
      <div>
        <input
          accept=".xlsx"
          type="file"
          id="inputGroupFile02"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

export default UploadButton;
