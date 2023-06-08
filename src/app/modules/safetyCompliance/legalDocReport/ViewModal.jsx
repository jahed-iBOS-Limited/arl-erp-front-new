import React, { useEffect, useState } from "react";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import { downloadFile } from "../../_helper/downloadFile";
import Loading from "../../_helper/_loading";

const ViewModal = ({ currentItem }) => {
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    getRowDto(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentFileListByRegistrationId&intLegalDocumentRegId=${currentItem?.intLegalDocumentRegId}`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  return (
    <div>
      {loading && fileLoading && <Loading />}
      <table
        className="table table-striped table-bordered global-table"
        id="table-to-xlsx"
      >
        <thead>
          <tr>
            <th style={{ width: "100px" }}>SL</th>
            <th>File Name</th>
            <th style={{ width: "100px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((data, i) => (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td> {data?.strFileUrl} </td>
              <td className="text-center">
                <button
                  className="btn btn-primary mr-1"
                  type="button"
                  onClick={() => {
                    let arr = data?.strFileUrl?.split(".");

                    downloadFile(
                      `/domain/Document/DownlloadFile?id=${data?.strFileUrl}`,
                      `${data?.strFileUrl}`,
                      `${arr[arr?.length - 1]}`,
                      setFileLoading
                    );
                  }}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewModal;
