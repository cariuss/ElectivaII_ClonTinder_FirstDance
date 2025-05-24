import React, { useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Modal = ({ isOpen, onClose, title, text, icon, confirmButtonText, children, onConfirm }) => {
    useEffect(() => {
        if (isOpen) {
            MySwal.fire({
                title: title || '',
                text: text || '',
                icon: icon || '',
                confirmButtonText: confirmButtonText || 'OK',
                showCancelButton: onConfirm ? true : false,
                html: children ? <div>{children}</div> : null,
                didClose: () => {
                    if (onClose) {
                        onClose();
                    }
                },
                preConfirm: () => {
                    if (onConfirm) {
                        return onConfirm();
                    }
                }
            });
        }
    }, [isOpen, onClose, title, text, icon, confirmButtonText, children, onConfirm]);

    return null;
};

export default Modal;
