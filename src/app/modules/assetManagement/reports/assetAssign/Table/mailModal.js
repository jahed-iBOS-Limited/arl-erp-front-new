import React, { useState } from 'react';
import styles from './mailModal.module.css';
import { exportToPDF, uploadPDF } from '../../../../shippingOperation/deadWeightPreStowagePlanning/deadWeightPreStowagePlanningChild/helper';
import { generateFileUrl } from '../../../../shippingOperation/utils/helper';
import Loading from '../../../../_helper/_loading';
import moment from 'moment';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { marineBaseUrlPythonAPI } from '../../../../../App';

const MailModal = ({ singleItem }) => {
    const [loading, setLoading] = useState(false)
    const [, onSendEmail, loader] = useAxiosPost();


    return (
        <>
            {(loading || loader) && <Loading />}
            <div className='text-right my-2'>
                <button onClick={async () => {
                    const pdfBlob = await exportToPDF("AssetAssignmailModal", "vessel_nomination");
                    const uploadResponse = await uploadPDF(pdfBlob, setLoading);
                    const pdfURL = uploadResponse?.[0]?.id || "";
                    console.log("pdfURL", generateFileUrl(pdfURL))

                    // const payload = {

                    //     attachment: pdfURL,
                    // };

                    // onSendEmail(
                    //     `${marineBaseUrlPythonAPI}/test}`,
                    //     payload,
                    //     null,
                    //     true
                    // );
                }} className='btn btn-primary'>Send</button>
            </div>
            <div
                id='AssetAssignmailModal'
                contentEditable={true}
                className={styles.container}
            >
                <div className={styles.section}>
                    <p>Ref: No-AR/HR & Admin/2024/9736</p>
                    <p>Date: {moment().format('DD/MM/YYYY')}</p>
                </div>

                <div className={styles.section}>
                    <p>Md. Baharul Islam</p>
                    <p>Enroll: 563645</p>
                    <p>Assistant General Manager</p>
                    <p>Akij Agro Feed Ltd.</p>
                </div>

                <div className={styles.section}>
                    <p className={styles.subject}>Sub: Regarding Allotment of Car (Dhaka Metro-GA-18- 6954)</p>
                </div>

                <div className={styles.section}>
                    <p className={styles.mb_10}>Dear Mr. Islam,</p>
                    <p>
                        As per decision by Management, this is to inform you that to help the Organization,
                        a car mentioned in the heading is to be allotted against you with immediate effect.
                        In this regard, you are hereby advised to receive your <strong>Car</strong> from the Administration Department
                        at Akij Resource Corporate Office, Tejgaon, Dhaka-1208, at the earliest.
                    </p>
                    <p className={styles.mt_10}>
                        Management expects you will accomplish your duties and responsibilities perfectly and smoothly.
                    </p>
                </div>

                <div className={`${styles.section} ${styles.note}`}>
                    <p>Note: System generated mail</p>
                </div>
            </div>
        </>
    );
};

export default MailModal;
