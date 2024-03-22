import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [message,setMessage]=useState(initialMessage);
  const [email,setEmail]=useState(initialEmail);
  const [steps,setSteps]=useState(initialSteps);
  const [index,setIndex]=useState(initialIndex);
  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const x=(index%3)+1;
    const y=Math.floor(index/3)+1;
    return {x,y};
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const {x,y}=getXY();
    return `Koordinatlar (${x},${y})`

  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    switch(yon){
      case "left":
        if(index%3===0){
          setMessage("Sola gidemezsiniz")
          return index;
        }else{
          setSteps(steps+1);
          return index -1;
        }
      case "right":
        if(index%3===2){
          setMessage("Sağa gidemezsiniz")
          return index;
        }else{
          setSteps(steps+1);
          return index+1;
        }
      case "up":
        if(index<3){
          setMessage("Yukarıya gidemezsiniz")
          return index;
        }else{
          setSteps(steps+1);
          return index-3;
        }
      case "down":
        if(index>5){
          setMessage("Aşağıya gidemezsiniz")
          return index;
        }else{
          setSteps(steps+1);
          return index+3;
        }
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.    
    setMessage(initialMessage)
    const newIndex=sonrakiIndex(evt.target.value)
    setIndex(newIndex);    
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
  function validateCoordinates() {
    const {x, y} = getXY();
    return x >= 1 && x <= 3 && y >= 1 && y <= 3;
  }
  
  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault(); // Sayfanın yeniden yüklenmesini önlemek için
    if (validateEmail(email) && validateCoordinates()) {
      const payload = {
        "x": getXY().x,
        "y": getXY().y,
        "steps": steps,
        "email": email
      };
      axios.post('http://localhost:9000/api/result',payload)
      .then(res=>{
        setMessage(res.data.message)
        setEmail(initialEmail);
        setSteps(initialSteps);
        setIndex(initialIndex);
      }
      )
      .catch(error => {
        console.warn("Unprocessable Entity",error);
      });
    }else{
      if(email==''){
        setMessage('Ouch: email is required');
      }else{
        setMessage('Ouch: email must be a valid email');
      }
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle} value="left">SOL</button>
        <button id="up" onClick={ilerle} value="up">YUKARI</button>
        <button id="right" onClick={ilerle} value="right">SAĞ</button>
        <button id="down" onClick={ilerle} value="down">AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
