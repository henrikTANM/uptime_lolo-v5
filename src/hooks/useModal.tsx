"use client"

import React, {ReactElement, ReactNode, useRef, useState} from "react";
import { Modal, ModalProps} from "@/components/Modal";

const initialModalData = { title: '', author: '', date_published: '', lead_image_url: '', content: '', url: ''}

export type UseModalResp = {
    modal: ReactNode
    openModal: (data: typeof initialModalData) => void
    closeModal: () => void
}

export type UseModalProps = Omit<ModalProps, 'onBackdropClick'> & {
    shouldAllowBackdropClick?: boolean //if it is true then modal can be closed
    onModalOpen?: () => void //this function will be called on calling of openModal
    onModalClose?: () => void //this function will be called on calling of closeModal
}

export const useModal = ({
    children,
    shouldAllowBackdropClick = true,
    onModalClose,
    onModalOpen
}: UseModalProps): UseModalResp => {
    const ref = useRef<HTMLDialogElement | null>(null)
    const [data, setData] = useState(initialModalData)

    const closeModal = () => {
        onModalClose && onModalClose()
        ref.current?.close()
    }

    const openModal = (data: typeof initialModalData) => {
        setData(data)
        onModalOpen && onModalOpen()
        ref.current?.showModal()
    }

    const modal: ReactNode = (
        <Modal onBackdropClick={() => {
            if (shouldAllowBackdropClick) {
                closeModal()
            }
        }} ref={ref}>
            <div className="modalHeader">
                <button id="closeModal" onClick={() => {
                    closeModal()
                }} style={{outline:'none'}}>Close
                </button>
                <a href={data.url} target="_blank">
                    <button id="origArticle">Original Article</button>
                </a>
            </div>
            <div className="modalContainer">
                {data.lead_image_url && <img className="modalImage" src={data.lead_image_url} alt={""}/>}
                <h1>{data.title}</h1>
                <p>{data.author && "Author: " + data.author}</p>
                <p>{data.date_published}</p>
                <div className="modalContentContainer" dangerouslySetInnerHTML={{__html: data.content}}/>
            </div>
            {children}
        </Modal>
    )

    return {
        closeModal,
        openModal,
        modal
    }
}
