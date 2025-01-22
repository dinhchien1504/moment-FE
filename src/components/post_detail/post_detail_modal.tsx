"use client"
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface IProps {
    showPostDetail : boolean
    setShowPostDetail : (value :boolean) => void
}


const PostDetailModal = (props:IProps) => {
    const {setShowPostDetail, showPostDetail} = props


    return (
        <>
            <Modal show={showPostDetail} onHide={() => {setShowPostDetail(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setShowPostDetail(false)}}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {setShowPostDetail(false)}}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PostDetailModal