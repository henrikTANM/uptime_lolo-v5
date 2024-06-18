"use client"

import React, {ReactNode, useRef, useState} from "react";
import { Modal, ModalProps} from "@/components/Modal";

const initialModalData = { title: '', author: '', date_published: '', lead_image_url: '', content: '', url: ''}

export type UseModalResp = {
    modal: ReactNode
    showModal: (data: typeof initialModalData) => void
    closeModal: () => void
}

export type UseModalProps = Omit<ModalProps, 'onBackdropClick'> & {
    onModalOpen?: () => void
    onModalClose?: () => void
}

export const useModal = ({
    children,
    onModalClose,
    onModalOpen
}: UseModalProps): UseModalResp => {
    const ref = useRef<HTMLDialogElement | null>(null)
    const [data, setData] = useState(initialModalData)

    const closeModal = () => {
        onModalClose && onModalClose()
        ref.current?.close()
    }

    const showModal = (data: typeof initialModalData) => {
        setData(data)
        onModalOpen && onModalOpen()
        ref.current?.showModal()
    }

    const modal: ReactNode = (
        <Modal onBackdropClick={() => {closeModal()
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
                <p>{data.author && data.author}</p>
                <p>{data.date_published && data.date_published}</p>
                <div className="modalContentContainer" dangerouslySetInnerHTML={{__html: data.content}}/>
            </div>
            {children}
        </Modal>
    )

    return {
        closeModal,
        showModal,
        modal
    }
}
