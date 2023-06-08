import React, { useEffect, useState } from "react";

const TotalNetAmount = ({ rowDto, values }) => {
  let [total, setTotal] = useState();

  useEffect(() => {
    let othersTotalCost = ((+values?.othersCharge || 0) + (+values?.freight || 0)) - (+values?.discount || 0)
    if (rowDto.length > 0) {
      let totalRowAmount = rowDto.reduce((acc, item) => acc + +item?.netValue, 0);
      setTotal(othersTotalCost + totalRowAmount);
    } else {
      setTotal(othersTotalCost || 0);
    }
  }, [rowDto, values]);

  return (
    <div className="d-flex justify-content-end">
      <h6>
        &nbsp; Net Amount: {total > 0 ? (total || 0).toFixed(2) : 0}
      </h6>
    </div>
  );
};

export default TotalNetAmount;
