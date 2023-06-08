import React from "react";

function DesciptionDetails({ description }) {
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
}

export default DesciptionDetails;
