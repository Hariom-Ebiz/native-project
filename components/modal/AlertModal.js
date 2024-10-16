import { setAlertModal, unsetAlertModal } from "@/store/siteSlice";
// import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import modalStyles from "@/styles/login_signup.module.css";
import Link from "next/link";

const AlertModel = ({ onRequestClose, children }) => {
  const { alertModelOpen, modalData } = useSelector((store) => store.site);
  const dispatch = useDispatch();
  return (
    <Modal
      className="successfull_popup"
      show={alertModelOpen}
      onHide={() => dispatch(unsetAlertModal())}
      centered
    >
      <Modal.Header closeButton>
        {/* <Modal.Title>Modal heading</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <div className="modal_inner">
            <div className={modalStyles.icon_block}>
            <img src={modalData?.imageUrl} alt="" />
            </div>
            <h3 className="modal_heading_formate">
                {modalData?.content}
            </h3>
            <Link href={modalData?.buttonHref ?? ""} className="popup_btn_bottom" onClick={() => dispatch(unsetAlertModal())}>
            <button
                type="btn"
                // className="link_btn"
                className="btn-primary w-100"
            >
                {modalData?.buttonText}
            </button>
            </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AlertModel;
