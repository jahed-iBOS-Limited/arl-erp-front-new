import React from "react";

const Schedule = ({schedule}) => {
  return (
    <div className="card card-height">
      <div className="p-2">
        <strong>2. Schedule</strong>
        <ol>
        {schedule?.map((item) => (
          <li>{item?.strActivity}</li>
        ))}
      </ol>
      </div>
    </div>
  );
};

export default Schedule;
