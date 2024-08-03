import React from "react";

const DebitCredit = ({ netAmount, type, amount }) => {
  return (
    <div className="text-right">
      <b>
        Debit : {type === 6 ? amount : netAmount} Credit :{" "}
        {type === 6 ? amount : netAmount}
      </b>
    </div>
  );
};

export default DebitCredit;
