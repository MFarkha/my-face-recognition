import React from "react";
import { createPortal } from 'react-dom';

import './Modal.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }
    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }
    render() {
        return createPortal(this.props.children, this.el);
    }
}

export default Modal;