"use client"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const PhotoDetail = (props: any) => {
    const { params } = props;
    console.log("params.id >>> ", params.id)
    return (
        <>
            
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>params.id = {params.id}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Modal body text goes here.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary">Close</Button>
                        <Button variant="primary">Save changes</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        </>
    )
}

export default PhotoDetail