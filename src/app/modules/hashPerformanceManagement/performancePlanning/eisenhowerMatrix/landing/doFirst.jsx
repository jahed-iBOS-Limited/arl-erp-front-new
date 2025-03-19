import React from "react";


const DoFirst = ({doFirst}) => {

  return (
    <div className="card card-height">
      <strong className="p-2">1. Do First</strong>
      <ol>
        {doFirst?.map((data) => (
          <li>{data?.strActivity}</li>
        ))}
      </ol>
    </div>
  );
};

export default DoFirst;
