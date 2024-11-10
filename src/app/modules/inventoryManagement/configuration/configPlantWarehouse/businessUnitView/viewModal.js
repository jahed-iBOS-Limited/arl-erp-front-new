import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import ViewForm from "./viewForm";
export function ViewModal({ id, show, onHide, history }) {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 100);
    }, []);

    return (
        <div className="viewModal">
            <Modal
                show={show}
                onHide={onHide}
                size="xl"
                aria-labelledby="example-modal-sizes-title-xl"
            >
                {isLoading && <ModalProgressBar variant="query" />}
                <Modal.Body id="example-modal-sizes-title-xl">
                    <ViewForm id={id} />
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <button
                            type="button"
                            onClick={() => onHide()}
                            className="btn btn-light btn-elevate"
                        >
                            Cancel
          </button>
                        <> </>

                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
