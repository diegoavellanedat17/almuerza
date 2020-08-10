// Este archivo verificará si el usuario queingresa es un administrador o un usuario y lo redirige a la página correspondiente
// Cuando es un administrador lo redirije a PersonalDashBoard o a UsersDashboard
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

firebase.initializeApp(firebaseConfig);

// se verificará si es administradorpara redifirjir a la página.
db=firebase.firestore()

function getUserData(){
return new Promise((resolve,reject)=>{
    firebase.auth().onAuthStateChanged(user => {
        const userData={
            uid:user.uid,
            email:user.email,
            name:user.displayName
        }
        resolve(userData)
    });
})
}

function RedirijirUsuario(userData){
    var consulta_restaurantes=db.collection('restaurantes').where("uid","==",userData.uid)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            console.log("Es un cliente, verificar que tipo de permisos tiene")
            var consulta_clientes=db.collection('clientes').where("uid","==",userData.uid)
            consulta_clientes.get()
            .then(function(queryClientes){
                queryClientes.forEach(function(doc_client){
                    var tipo= doc_client.data().tipo
                    if (tipo ==='admin'){
                        window.location = '../admins/admins.html'//redirigiendo al html de prueba mientras miramos donde redireccionamos para realizar los pedidos
                    }
                    else{
                        window.location = '../clientes/clientes.html'//redirigiendo al html de prueba mientras miramos donde redireccionamos para realizar los pedidos
                    }
                })
            })
            .catch(function(err){
                console.log(err)
            })
           
        }
        else{
            querySnapshot.forEach(function(doc){
                setTimeout(function(){console.log("timer") }, 2000);
                console.log("Verificando Permiso")
                const tipo=doc.data().tipo
                if(tipo ==='restaurante'){
                    window.location = '../restaurantes/restaurantes.html'
                }
                else{
                    firebase.auth().signOut()
                    alert('no es un tipo de usuario restaurante')
                    window.location = '../login.html'
                }
            })
        }
        
    })

}

// Aqui por el correo vamos a verificar si el que intena entrar es un restaurante
getUserData()
.then(userData=>{
    console.log(userData)
    RedirijirUsuario(userData)
})
.catch(error=>{
    console.error(error)
    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html
    window.location = '../login.html'

})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location = '../login.html'; 
    }
});