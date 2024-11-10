import React, { useState } from "react";
import { useEffect } from "react";
import { APIUrl } from "../../../../../../App";
import Loading from "../../../../../_helper/_loading";
import { getGrnAttachmentAction } from "../../helper";

const AttachmentComponent = ({ currentItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGrnAttachmentAction(currentItem?.referenceId, setData, setLoading);
  }, [currentItem]);

  return (
    <div className="p-5">
      {loading && <Loading />}
      {data?.length < 1 && !loading && <h4>No Attachment Found</h4>}
      {data?.map((item, index) => (
        <img
          key={index}
          style={{ width: "100%", marginBottom: "50px" }}
          src={`${APIUrl}/domain/Document/DownlloadFile?id=${item?.documentId}`}
          alt="document"
        />
      ))}
    </div>
  );
};

export default AttachmentComponent;
