import React, { useEffect, useState } from 'react';
import useAxiosGet from '../../_helper/customHooks/useAxiosGet';
import { downloadFile } from '../../_helper/downloadFile';
import Loading from '../../_helper/_loading';

const ViewModal = ({ currentItem }) => {
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [fileLoading, setFileLoading] = useState(false);

  console.log('Current item', currentItem);

  useEffect(() => {
    getRowDto(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentNameFileById&intDocumentId=${currentItem?.intDocumentId}`
    );
  }, [currentItem]);

  return (
    <div>
      {loading && fileLoading && <Loading />}
      <p className="mb-0 mt-2">
        <span className="font-weight-bold">Document Name: </span>
        {currentItem?.strDocumentName}
      </p>
      <p>
        <span className="font-weight-bold">Description:</span>
        <div
          className="card p-3"
          dangerouslySetInnerHTML={{
            __html: currentItem?.strDescriptionHTML,
          }}
        ></div>
      </p>

      <table
        className="table table-striped table-bordered global-table"
        id="table-to-xlsx"
      >
        <thead>
          <tr>
            <th style={{ width: '100px' }}>SL</th>
            <th>File Name</th>
            <th style={{ width: '100px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((data, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td> {data?.strFileUrl} </td>
              <td className="text-center">
                <button
                  className="btn btn-primary mr-1"
                  type="button"
                  onClick={() => {
                    let arr = data?.strFileUrl?.split('.');

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
