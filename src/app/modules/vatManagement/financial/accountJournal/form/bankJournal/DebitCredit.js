import React from "react";

const DebitCredit = ({ netAmount, type, amount }) => {
  return (
    <div className="text-right">
      <b style={{fontSize:"8px"}}>
        <p>Debit : {type === 6 ? amount : netAmount} </p>
        <p>Credit :{type === 6 ? amount : netAmount}</p>
      </b>
    </div>
  );
};

export default DebitCredit;
