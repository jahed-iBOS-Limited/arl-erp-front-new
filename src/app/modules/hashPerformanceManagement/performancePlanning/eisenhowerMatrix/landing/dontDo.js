import React from "react";

const DontDo = ({dontDo}) => {
  return (
    <div className="card card-height">
      <div className="p-2">
        <strong>4. Don't Do</strong>
        <ol>
        {dontDo?.map((data) => (
          <li>{data?.strActivity}</li>
        ))}
      </ol>
      </div>
    </div>
  );
};

export default DontDo;
