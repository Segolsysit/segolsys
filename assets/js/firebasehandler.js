// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgFbQK3JW3u-jjFR5ro0JyJ9qRJaFS-gg",
    authDomain: "segolsys-ff122.firebaseapp.com",
    projectId: "segolsys-ff122",
    storageBucket: "segolsys-ff122.appspot.com",
    messagingSenderId: "327379074583",
    appId: "1:327379074583:web:0628ecdf8ea9961bdee652",
    measurementId: "G-KG5DV81ZNS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

var submitButton = document.getElementById('submit');

var firstname, lastname, email, phoneno, message;

submitButton.addEventListener('click', (e)=>{
    e.preventDefault();    
    firstname = document.getElementById('firstname');
    lastname = document.getElementById('lastname');
    email = document.getElementById('email');
    phoneno = document.getElementById('phone');
    message = document.getElementById('message');
    checkInputs();
    
    if (
        !firstname.classList.contains("error") &&
        !lastname.classList.contains("error") &&
        !email.classList.contains("error") &&
        !phoneno.classList.contains("error") &&
        !message.classList.contains("error")
      ) {
        sendMessage();
      }
    })

function checkInputs(){
    const items = document.querySelectorAll('.form-control');

    for(const item of items){
        if(item.value==""){
            item.classList.add("error");
            item.parentElement.classList.add("error");
        }

        if(items[2].value != ""){
            checkEmail();
        }
        
        items[2].addEventListener('keyup',() => {
            checkEmail();
        });

        if(items[3].value != ""){
            checkPhoneno();
        }
        
        items[3].addEventListener('keyup',() => {
            checkPhoneno();
        });

        item.addEventListener('keyup',()=>{
            if(item.value !== ""){
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            }else{
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        });
    }
}

function checkPhoneno(){
    const phnRegex = /^[0-9]+$/;
    const errphn = document.querySelector('.error-txt.phn')
    if(!phoneno.value.match(phnRegex)){
        phoneno.classList.add("error");
        phoneno.parentElement.classList.add("error");
        if(phoneno.value !== ""){
            errphn.innerText = "Number must not contains symbols or letters!";
        }else{
            errphn.innerText = "Phone Number can't be blank!";
        }
    }else if(phoneno.value.length !== 10){        
        phoneno.classList.add("error");
        phoneno.parentElement.classList.add("error");
        if(phoneno.value !== ""){
            errphn.innerText = "Enter the valid number!";
        }else{
            errphn.innerText = "Phone Number can't be blank!";
        }
    }else{
        phoneno.classList.remove("error");
        phoneno.parentElement.classList.remove("error");
    }
}

function checkEmail(){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errmail = document.querySelector('.error-txt.email');
    if(!email.value.match(emailRegex)){
        email.classList.add("error");
        email.parentElement.classList.add("error");
        if(email.value == ""){
            errmail.innerText = "Enter can't be Empty!";
        }else{
            errmail.innerText = "Enter valid Email address!";
        }
    }else{
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}

async function sendMessage(){
    //for firebase real-time databse
    /*set(ref(db, 'user/'+data.firstname),{
        firstname: firstname,
        lastname: lastname,
        email: email,
        phoneno: phoneno,
        message: message
    });*/


    //for firebase firestore database
    addDoc(collection(db, `EnquiryData/`), {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        phoneno: phoneno.value,
        message: message.value
    })
    .then((docRef) => {
        return getDoc(docRef);
    })
    .then((snapshot) => { 
        var details = snapshot.data();
        if(snapshot.exists){
            Email.send({
                Host : "smtp.elasticemail.com",
                Username : "segolsys@gmail.com",
                Password : "52D22AC455C551CCCF299A5B5B6CFFA63AAA",
                To : 'curlysiva@gmail.com',
                From : 'segolsys@gmail.com',
                Subject : `Query from ${details.firstname}`+ "."+ ` ${details.lastname}`,
                Body : `${details.firstname}` + `,
                <br>
                ${details.message}

                contact:<br>
                ${details.email}<br`
                +`${details.phoneno}`
            }).then(
              message => alert(message)
            );
        }
    })
    .catch((err) => console.log(err));
}

