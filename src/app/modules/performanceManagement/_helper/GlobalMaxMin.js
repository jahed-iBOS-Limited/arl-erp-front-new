import React from "react";

const GlobalMaxMin = ({ r }) => {
  return (
    <div>
      {(r.numTarget >= r.numAchivement) & (r.intMaxMin === 1) ? (
        <div className="text-right">
          {r.numTarget && r.numAchivement
            ? ((r.numAchivement / r.numTarget) * 100).toFixed(2)
            : 0}{" "}
          % <i className="ml-2 fas fa-arrow-alt-circle-up success-c"></i>
          {/* Don't remove this white space => {" "} */}
        </div>
      ) : (r.numTarget >= r.numAchivement) & (r.intMaxMin === 2) ? (
        <div className="text-right">
          {r.numTarget && r.numAchivement
            ? ((r.numAchivement / r.numTarget) * 100).toFixed(2)
            : 0}{" "}
          %<i className="ml-2 fas fa-arrow-alt-circle-down text-danger"></i>
        </div>
      ) : (r.numTarget <= r.numAchivement) & (r.intMaxMin === 1) ? (
        <div className="text-right">
          {r.numTarget && r.numAchivement
            ? ((r.numAchivement / r.numTarget) * 100).toFixed(2)
            : 0}{" "}
          % <i className="ml-2 fas fa-arrow-alt-circle-up success-c"></i>
        </div>
      ) : (
        (r.numTarget <= r.numAchivement) & (r.intMaxMin === 2) && (
          <div className="text-right">
            {r.numTarget && r.numAchivement
              ? ((r.numAchivement / r.numTarget) * 100).toFixed(2)
              : 0}{" "}
            %<i className="ml-2 fas fa-arrow-alt-circle-down text-danger"></i>
          </div>
        )
      )}
    </div>
  );
};

export default GlobalMaxMin;
