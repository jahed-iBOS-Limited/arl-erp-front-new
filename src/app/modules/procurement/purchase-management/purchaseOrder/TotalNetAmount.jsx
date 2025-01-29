import React, { useEffect, useState } from "react";

const TotalNetAmount = ({ rowDto }) => {
  let [total, setTotal] = useState(0);
  const [vatTotal, setVatTotal] = useState(0);

  useEffect(() => {
    if (rowDto.length > 0) {
      let total = rowDto.reduce((acc, item) => acc + +item?.netValue, 0);
      let vatTotal = rowDto.reduce((acc, item) => acc + +item?.vatAmount, 0);
      setVatTotal(vatTotal)
      setTotal(total);
    } else {
      setTotal(0);
      setVatTotal(0)
    }
  }, [rowDto]);

  return (
    <div className="d-flex justify-content-end">
      <h6>
        Total Vat : {vatTotal > 0 ? (vatTotal || 0).toFixed(4) : 0},
      </h6>
      <h6>
        &nbsp; Net Amount: {total > 0 ? (total || 0).toFixed(4) : 0}
      </h6>
    </div>
  );
};

export default TotalNetAmount;
