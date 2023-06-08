import React from "react";

const Delegate = ({delegate}) => {
  return (
    <div className="card card-height">
      <div className="p-2">
        <strong >3. Delegate</strong>
        <ol>
        {delegate?.map((data) => (
          <li>{data?.strActivity}</li>
        ))}
      </ol>
      </div>
    </div>
  );
};

export default Delegate;
