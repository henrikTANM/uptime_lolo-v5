"use client"

import { forwardRef, ReactNode } from 'react'

export type ModalProps = {
    children?: ReactNode
    onBackdropClick?: () => void
    // you can add more classNames as per your level of customisation needs
}

// eslint-disable-next-line react/display-name
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    ({ children, onBackdropClick }, ref) => {
        return (
            <dialog ref={ref} className="modal">
                {children}
            </dialog>
        )
    }
)