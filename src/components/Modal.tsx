"use client"

import { forwardRef, ReactNode } from 'react'
import {event} from "next/dist/build/output/log";

export type ModalProps = {
    children?: ReactNode
    onBackdropClick?: () => void
}

// Modal component
// eslint-disable-next-line react/display-name
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    ({ children, onBackdropClick }, ref) => {
        return (
            <dialog ref={ref} className="modal" onClick={() => {onBackdropClick && onBackdropClick()}}>
                {children}
            </dialog>
        )
    }
)