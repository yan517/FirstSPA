import React from 'react'
import Nav from 'react-bootstrap/Nav';
import {useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import { Col, Row } from 'react-bootstrap';
import '../index.css';


export default function Navigate() {
    let navigate = useNavigate();
    return (
        <div>
            <Row>
                <Col xs={8}>
                    <div className='navTitle'>SEATTLE BUILDING DATA VISUALIZATION</div>
                </Col>
                <Col xs={4}>
                    <Nav className="d-flex">
                        <Nav.Link href="/building">overview</Nav.Link>
                        <Nav.Link href="/barchart">charts</Nav.Link>
                    </Nav>
                </Col>
            </Row>
                                    
        </div>
    )
}
