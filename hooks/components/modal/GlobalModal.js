import { setModal, unsetModal } from "@/store/siteSlice";
// import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import modalStyles from "@/styles/login_signup.module.css";

const GlobalModal = ({ onRequestClose, children }) => {
  const { modalOpen, modalData } = useSelector((store) => store.site);
  const dispatch = useDispatch();
  return (
    <Modal
      className="successfull_popup"
      show={modalOpen}
      onHide={() => dispatch(unsetModal())}
      centered
    >
      <Modal.Header closeButton>
        {/* <Modal.Title>Modal heading</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        {/* <div className="modal_inner">
          <div className="icon_block">
            <img src="/img/icon.png" alt="" />
          </div>
          <h3>For best results please complete your CV</h3>
          <button
            type="button"
            onClick={() => {
              document.getElementById("popupModelOpener").click();
              router.push("/job-seeker/create-cv/step1");
            }}
            className={`btn_primary w-100`}
          >
            Open CV Builder
          </button>
        </div> */}
        {modalData}
      </Modal.Body>
    </Modal>
  );
};

export default GlobalModal;
