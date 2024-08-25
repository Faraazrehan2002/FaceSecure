import { useState } from 'react';
import './App.css';
import bgimage from '../src/visitors/skysea.jpeg'

const uuid = require('uuid');

function App() {
 
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [visitorName, setVisitorName] = useState('emp.png');
  const [isAuth, setAuth] = useState(false);
 
  function sendImage(e){
    
    e.preventDefault();
    
    setVisitorName(image.name);
    console.log(image.name);
    const visitorImageName = uuid.v4();
    console.log(visitorImageName);
    fetch(`${process.env.REACT_APP_SEND_IMG}/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
        //'Access-Control-Allow-Origin': '*' 
      },
      body : image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName'].charAt(0).toUpperCase()}${response['firstName'].slice(1)} ${response['lastName'].charAt(0).toUpperCase()}${response['lastName'].slice(1)}, welcome to work. Hope you have a productive day today!!!`);
      } else{
          setAuth(false);
          setUploadResultMessage('Authentication Failed: This person is not an employee.');
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication process. Please try again.');
      console.error(error);
    })
  }
  

  async function authenticate(visitorImageName){
    const requestUrl = `${process.env.REACT_APP_AUTHENTICATE}` + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) =>{
      console.log(data);
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App" style={{backgroundImage:bgimage}}>
    <div className="section-main">
      <div className="container form-container">

      <h2>
        FaceSecure 
      </h2>
      <form onSubmit = {sendImage}>
        <input className='fileInput' type = 'file' name = 'image' onChange = {e => setImage(e.target.files[0])}/>
        <button type = 'submit' className='button-3'>Authenticate</button>
      </form>
      <div className = {isAuth ? 'success' : 'failure'}>
        {uploadResultMessage}
      </div>
      <img src = { require(`./visitors/${visitorName}`)} alt = "Visitor" height = {150} width = {150}/>
    </div>
    </div>
    </div>
  );
}

export default App;
