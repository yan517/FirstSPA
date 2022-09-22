import React, { useState,useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {Chart as Chartjs} from 'chart.js/auto'
import { Container, Button, Row, Col,Card } from 'react-bootstrap';
import Navigate from './Navigate';
import {useNavigate} from 'react-router-dom'
import '../index.css';
import { removeUserSession } from '../Utils/Common';

export default function BarChart() {
    let navigate = useNavigate();
    const [factchData,setfactchData] = useState('');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
                color: "rgb(255, 99, 132)",
                font: {
                  family: 'cursive' 
                }
            }                
          },
          tooltip: {
            bodyFont: {
              family: 'cursive' 
            },
            titleFont: {
              family: 'cursive' 
            }
          },         
          title: {
            display: true,
            text: 'Avg. EUI By Property Type',
            font: {
                size: 30,
                family: 'cursive'
              }
          },
        },
        scales: {
            yAxes: {
              ticks: {
                font: {
                  family: 'cursive', 
                  size: 13
                }
              }
            },
            xAxes: {
                ticks: {
                    font: {
                        family: 'cursive', 
                        size: 13
                      }
                    }
                }
        }
      };
    useEffect(()=>{ 
        fetch('http://localhost:5000/api/eui/')
        .then(response => response.json())
        .then(data => {
            setfactchData({
                labels: data.map(euiData => euiData.type),
                datasets:[
                    {
                        label:"Average EUI",
                        data: data.map(euiData => euiData.average_eui),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            });
            setIsLoaded(true);
        },(error) =>{
            setError(error);
        })
    },[])

    return (
        <div>
            {error? 
                <div>Error:{error.message}</div> 
                : !isLoaded
                ?<div>Loading...</div> 
                :<div>
                  <br></br>
                  <Container>
                    <Row>
                      <Col>
                        <Navigate />
                      </Col>
                    </Row><br></br><br></br>
                    <Row>
                      <Col>
                        <div className='chart'>
                            <Bar data={factchData} options={options}/>
                        </div>
                      </Col>
                    </Row>
                    <Row><Col xs={2}><Button variant="logout-btn" onClick={()=>{navigate('/');removeUserSession()}}>Logout</Button></Col></Row>
                  </Container>
                </div>}
        </div>
    )
}

