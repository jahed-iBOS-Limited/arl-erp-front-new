import React from "react";
import Chips from "../../../../_helper/chips/Chips";
import { AddCircleOutlineSharp, Email, Phone } from "@material-ui/icons";

const CardBody = ({ name, id, item, CB }) => {
  return (
    <div className="card-body">
      {/* <h5 className="card-title">Special title treatment</h5> */}
      {id && id !== 0 ? (
        <div style={{ marginBottom: "8px" }}>
          <Chips classes="badge-primary" status={"Rank - " + item?.rank} />
          <h5 className="card-title mt-2">{item?.businessPartnerName}</h5>
          <p>
            {item?.currencyCode} {item?.totalAmount}
          </p>
          <p>
            <Phone /> {item?.contactNumber}
          </p>
          <p>
            {" "}
            <Email /> {item?.email}
          </p>
        </div>
      ) : (
        <button onClick={CB} className="btn btn-info">
          {name}
          <span style={{ marginLeft: "5px" }}>
            <AddCircleOutlineSharp />
          </span>
        </button>
      )}
    </div>
  );
};

export default CardBody;
