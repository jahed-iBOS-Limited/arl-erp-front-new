import React from "react";

const IndividualMin = ({ r }) => {
  return (
    <div>
      {r.numTarget === r.numAchivement ? (
        <div className="text-right">
          100 % <i className="ml-2 fas fa-arrow-alt-circle-up success-c"></i>
        </div>
      ) : (
        <div className="text-right">
          {(((r.numTarget || 0) / (r.numAchivement || 0)) * 100).toFixed(2) ===
          "Infinity"
            ? 0
            : (((r.numTarget || 0) / (r.numAchivement || 0)) * 100).toFixed(
                2
              )}{" "}
          %<i className="ml-2 fas fa-arrow-alt-circle-down text-danger"></i>
        </div>
      )}
    </div>
  );
};

export default IndividualMin;
