// Se crea el archivo de configuracion para realizar la autenticacion por medio de firebase 
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBjasCFXiGf7JZAdqlG_lo-7XMwLwUJw0E",
    authDomain: "delifast-7576c.firebaseapp.com",
    databaseURL: "https://delifast-7576c.firebaseio.com",
    projectId: "delifast-7576c",
    storageBucket: "delifast-7576c.appspot.com",
    messagingSenderId: "415819035666",
    appId: "1:415819035666:web:9300f229e79d85c0f6d4cb",
    measurementId: "G-ESS36GVJTN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.firestore();
  

// Lo que queremos es que si un usuario se va a registrar, se meta al formulario de registro
// el cual tiene la clase register-form/ entonces vamos a crear un formulario register form 
// se  supone que aca tenemos el formulario de registro, en caso de que no, se procede a colocarle desde el html un nombre
const formulario=document.forms['form-register']


// tomar el segundo formulario y a este se le hace el login
const authForm=document.forms['form-auth']

const forgotForm=document.forms['form-forgot']

forgotForm.addEventListener('submit',olvidar_contrasena);

formulario.addEventListener('submit', crearUsuario);
//El siguiente escucha es el otro boton
authForm.addEventListener('submit', AutenticarUsuario);

var firstTime=false

function crearUsuario(event){
	event.preventDefault();
	const email = formulario['email'].value;
	const password = formulario['password'].value;
    const name = formulario['name'].value;
    const person= formulario['persona'].value;
    const nit = formulario['nit'].value;
	const tel = formulario['telefono'].value;
	const dir = formulario['dir'].value;
	const link = formulario['link'].value;
    
	// se verifica si no lleno algun campo 
	if (!email || !name || !password || !person || !tel || !nit || !dir || !link){
		console.log('Deben llenarse todos los campos')

		swal({
			title:"Advertencia",
			  text:"Debes llenar todos los campos",
			  icon:"warning"
		  })
	}

	else if (validateAddress(link)!=true){
		
		swal({
			title:"Advertencia",
			  text:"Recuerda que el link no debe tener caracteres especiales",
			  icon:"warning"
		  })
	}

	else{

		// empezamos con el meneito de firebase 
        // como ya tenemos la info vamos a agregarla 
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(result=>{
			result.user.updateProfile({
				displayName: name
			})
		
			var user = firebase.auth().currentUser;
			console.log(user.emailVerified)
			
			user.sendEmailVerification().then(function() {
			
				GuardarInformacionRestaurante(name,email,password,person,nit,tel,user.uid,dir,link)
				// Email sent.

				swal({
					title:"¡ Muy Bien !",
					  text:"Revisa tu Email y regresa para entrar",
					  icon:"success"
				  
				  }).then(function(){
					location.reload()
				  })

			  }).catch(function(error) {
				alert(error)
			  });
			  firstTime=true
			  
	})
	.catch(error=>{
		alert(error)
		console.error(error)
	})
	

}
}

function AutenticarUsuario(event){
	event.preventDefault();
	const password = authForm['password'].value;
	const username = authForm['username'].value;
	console.log(`El usuario que quiere entrar es ${username} con  contraseña ${password}`)

  	firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result=>{
    	if(result.user.emailVerified){
			window.location = './UvR/UvR.html'; //After successful login, user will be redirected to home.html
    		console.log('Restaurante');
		}
		
      else{

      	if(confirm("Verifica en tu correo electronico")){
      		// const configuracion={
			// 	url: 'http://bloggeekplatzi1.firebaseapp.com'
			// }
			// //Vamos a enviar un correo para que el usuario pueda verificarse 
			result.user.sendEmailVerification()
			.catch(error=>{// en caso deque hayaerror en el envío del correo 
				alert(error)

			console.error(error)
		})

      	console.log('Listo ya lo enviamos')
      	}
      	else{
      		console.log('okay como quieras')
      	}
      	//si va entrar pero se sale
      	firebase.auth().signOut()
      }
  	})
    
    .catch(function (error) {
    alert(error)
	  console.log(error);

    });
}

function olvidar_contrasena(event){
    var auth = firebase.auth();
    event.preventDefault();
    const email = forgotForm['email-address'].value;

    auth.sendPasswordResetEmail(email).then(function() {
        swal({
            title:"Check",
              text:"An email has been sent",
              icon:"success"
          
          })
        // Email sent.
      }).catch(function(error) {
        alert(error)
        console.log(error)
      });
}


// tengo un objeto mirando si hay o no autenticacion, si la hay abre lo otro
firebase.auth().onAuthStateChanged(user => {
  if(user && firstTime===false) {
   
	console.log("Allowed User")
	window.location = './UvR/UvR.html';

  }
  else{
	console.log("Is the first time dont redirect or Logout")
  }
});

function GuardarInformacionRestaurante(name,email,password,person,nit,tel,userUid,dir,link) {

	// Add a new document in collection "cities"
	//Acá se debe validar el link 


	console.log('Enviando a base de datos')
    database.collection("restaurantes").doc().set({
		nombre:name,
		nombreRestaurante: link,
		dir:dir,
        email: email,
        password: password,
        representante: person,
        nit:nit,
		tel:tel,
		tipo:'restaurante',
		uid:userUid,
		precio:'0',
		clientes:[],
    })
    .then(function() {
	console.log("Document successfully written!");
	firebase.auth().signOut()
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
	});

	//setTimeout(function(){console.log("timer") }, 2000);

}

function validateAddress(string_word){
    
    if( /[^a-zA-Z0-9\-\/]/.test( string_word ) ) {
        return false;
    }
    return true;     
}

