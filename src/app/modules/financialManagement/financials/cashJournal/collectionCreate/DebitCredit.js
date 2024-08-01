import React from "react";

const DebitCredit = ({ netAmount, type, amount }) => {
  return (
    <div className="text-right">
      <b>
        Debit : {type === 3 ? amount : netAmount} Credit :{" "}
        {type === 3 ? amount : netAmount}
      </b>
    </div>
  );
};

export default DebitCredit;
