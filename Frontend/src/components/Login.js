import React from 'react'
import { useState } from "react";
import {BrowserRouter, Routes, Route, useNavigate, resolvePath} from 'react-router-dom'
import '../index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { setUserSession } from '../Utils/Common';

export default function Login(props) {
    const [inputs, setInputs] = useState({username: '', password: ''});
    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

    const handleSubmit = (event) => {
        setError(null)
        setLoading(true)
        axios.post("http://localhost:5000/api/signin/",{
            username: inputs.username,
            password: inputs.password,
        }).then(response =>{
            setLoading(false)
            setUserSession(response.data.token, response.data.user)
            navigate('/building')
        }).catch(error =>{
            console.log(error)
            setLoading(false)
            if (error.response.status === 401 || error.response.status === 400) setError(error.response.data.error);
            else setError("Something went wrong. Please try again later.");
            console.log('error >>> ', error);
        })
        event.preventDefault();
    }

    return (
    <Container>
        
        <Row>
            <Col xs={3}></Col>
            <Col xs={6}>
            <div className='fontFamily'>
            
                <form className='form' onSubmit={handleSubmit}>
                    <h3 className='subtitle'>SEATTLE BUILDING DATA VISUALIZATION</h3>
                    <label className='loginLabel'>USERNAME&ensp;    
                    <input
                        type="text" 
                        name="username" 
                        autoComplete="off"
                        value={inputs.username || ""}
                        onChange={handleChange}
                    />
                    </label>
                    <label className='loginLabel'>PASSWORD&ensp;  
                    <input
                        type="password" 
                        name="password" 
                        value={inputs.password || ""}
                        onChange={handleChange}
                    />
                    </label><br></br>
                    {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
                    <br></br>
                    <Button type="submit">Login</Button>
                </form>
    
            </div>
            </Col>
            <Col xs={3}></Col>
        </Row>
    </Container>
    )
}
