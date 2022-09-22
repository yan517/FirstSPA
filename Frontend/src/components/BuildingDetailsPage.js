
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

import { Container, Button, Row, Col,Card } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import GMap from './gMap';
import Navigate from './Navigate';
import '../index.css';
import { removeUserSession } from '../Utils/Common';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { IconButton } from '@mui/material';

export default function BuildingDetails() {
  let navigate = useNavigate();
  let [buildingList, setBuildingList] = useState([])
  let [ori, setOri] = useState(0)
  let [cur, setCur] = useState(10)
  let [buildingProfile, setbuildingProfile] = useState('')
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState({
    lat: 47.61317,
    lng: -122.33393});

  useEffect(()=>{
            fetch('http://localhost:5000/api/list/')
            .then(response => response.json())
            .then(data => {
              setBuildingList(data);
              setCenter({    
                lat: data[0].Latitude,
                lng: data[0].Longitude})
              setIsLoaded(true);  
            },(error) =>{
              setError(error);
            })
  },[])



  const display = (building) => {
    setbuildingProfile(building)
    setCenter({    
      lat: building.Latitude,
      lng: building.Longitude})
  };


  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  },[]);

  return (
    <div>
    <br></br>
    <Container>
        <Row>
          <Col>
            <Navigate />
          </Col>
        </Row>
      
      <br></br> <br></br>
        <Row >
          
          <Col xs={12} md={8} lg={6}>
              <Card>
                {buildingProfile && 
                <Card.Body>
                  <Card.Title>{buildingProfile.PropertyName}</Card.Title>
                  <Card.Text>{buildingProfile.PrimaryPropertyType}</Card.Text>
                  <Card.Text>{buildingProfile.Address}</Card.Text>  
                  <Card.Text># of floor: {buildingProfile.NumberofFloors}</Card.Text>  
                  <Card.Text>District: {buildingProfile.CouncilDistrictCode}</Card.Text>  
                  <Card.Text>Build in {buildingProfile.YearBuilt}</Card.Text>  
                   
                  {error? 
                    <Card.Text>Error:{error.message}</Card.Text>
                  : !isLoaded
                  ?<Card.Text>Loading...</Card.Text>
                  :<GMap display={center}/>}
                </Card.Body>
                }
                {
                  !buildingProfile && <h3 style={{position:'relative',top:'40%' ,textAlign:'center'}}>Please select the item, the details of the item will be shown</h3>
                }
            </Card>
          </Col>
          <Col xs={12} md={4} lg={5}>
            <ListGroup as="ul">    
            {buildingList && buildingList.slice(ori, cur).map(building =>
            <ListGroup.Item key={building.OSEBuildingID}  action onClick={event => display(building)}> 
                {building.PropertyName}
              </ListGroup.Item>
              )}
            </ListGroup> 
          </Col>
        </Row>
        <br></br>
        <Row>
          
          <Col xs={3} >
            <Button variant="logout-btn" onClick={()=>{navigate('/');removeUserSession()}}>Logout</Button>
          </Col>
          <Col xs={5}></Col>
          <Col xs={4}>
            <div className='divPos'>
              <IconButton onClick={()=>{
                  if (cur === buildingList.length){
                    let tmp = cur % 10
                    setCur(cur-tmp)
                    setOri(cur-tmp-10)
                  }
                  else if (ori-10 >= 0){
                    setCur(cur-10)
                    setOri(ori-10)
                  }else if(ori !== 0){
                    setCur(10)
                    setOri(0)
                  }
                }} aria-label="back">
                <IoIosArrowRoundBack />
              </IconButton>
      
              <IconButton onClick={()=>{
                            if (cur+10 <= buildingList.length){
                              setCur(cur+10)
                              setOri(ori+10)
                            }else if(cur !== buildingList.length){
                              let tmp = buildingList.length - cur
                              setCur(buildingList.length)
                              setOri(buildingList.length-tmp)
                            }
                          }} aria-label="forward">
                <IoIosArrowRoundForward />
              </IconButton>
            </div> 
          </Col>
        </Row>
    </Container>

    </div>
  )
}
