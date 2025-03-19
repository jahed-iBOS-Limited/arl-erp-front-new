import React, { Fragment } from 'react'
import AttachmentUploaderNew from '../../../_helper/attachmentUploaderNew';
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../_helper/_redux/Actions';
import ICon from '../../../chartering/_chartinghelper/icons/_icon';

const AttachmentListTable = ({ attachmentLists, setAttachmentLists }) => {

    const dispatch = useDispatch()


    return (
        <Fragment>
            <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                    <thead>
                        <tr>
                            <th
                                className="text-center cursor-pointer"
                                style={{ width: "40px" }}
                            >
                                <input
                                    type="checkbox"
                                    checked={attachmentLists?.every(item => item.isSelected) && attachmentLists.length > 0}
                                    onChange={(e) => {
                                        const data = attachmentLists?.map(item => ({ ...item, isSelected: e.target.checked })
                                        )
                                        setAttachmentLists(data)
                                    }
                                    }
                                />
                            </th>
                            <th>SL</th>
                            <th>Channel Name</th>
                            <th>Partner Name</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attachmentLists?.map((item, index) => {
                            return (
                                <>
                                    <tr key={index}>
                                        <td
                                            className="text-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item?.isSelected}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updatedLists = attachmentLists.map((list, idx) => {
                                                        if (idx === index) {
                                                            return { ...list, isSelected: checked };
                                                        }
                                                        return list;
                                                    });
                                                    setAttachmentLists(updatedLists);
                                                }}
                                            />
                                        </td>
                                        <td> {index + 1}</td>
                                        <td>
                                            {item?.channelName}
                                        </td>
                                        <td>
                                            {item?.businessPartnerName}
                                        </td>
                                        <td>{item?.monthId}</td>
                                        <td>{item?.yearId}</td>
                                        <td>
                                            <div className="">
                                                {item?.isSelected && item.attachment.length < 1 && (
                                                    <AttachmentUploaderNew
                                                        CBAttachmentRes={(image) => {

                                                            const data = [...attachmentLists]
                                                            data[index]['attachment'] = image[0]?.id
                                                            setAttachmentLists(data)
                                                        }}
                                                        showIcon
                                                        attachmentIcon={'fa fa-paperclip'}
                                                        customStyle={{ 'background': 'transparent', 'padding': '4px 0' }}
                                                        fileUploadLimits={1}

                                                    />
                                                )}
                                                {
                                                    item?.attachment.length > 0 &&
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(
                                                                getDownlloadFileView_Action(item?.attachment)
                                                            );
                                                        }}
                                                    >
                                                        <ICon title={`View Attachment`}>
                                                            <i class="far fa-file-image"></i>
                                                        </ICon>
                                                    </span>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default AttachmentListTable