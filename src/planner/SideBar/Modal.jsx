import React from "react";
import "./Modal.scss";

function Modal({isOpen , onClose , plannerTitle, setPlannerTitle, plannerDescription, setPlannerDescription, isPublic,setIsPublic,onSave}){
    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">생성한 여행 계획의 이름과 설명을 정해주세요!</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <label>제목</label>
                <input
                  type="text"
                  className="form-control"
                  value={plannerTitle}
                  onChange={(e) => setPlannerTitle(e.target.value)}
                />
                <br />
                <label>설명</label>
                <textarea
                  className="form-control"
                  value={plannerDescription}
                  onChange={(e) => setPlannerDescription(e.target.value)}
                ></textarea>
                <br />
                <label className="isPublic-label">
                  다른 사용자에게 공개
                  <input
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSave}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Modal;