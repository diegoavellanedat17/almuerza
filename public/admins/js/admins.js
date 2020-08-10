
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
  var db = firebase.firestore();

// Verificar cual es el nombre del restaurante para pasarlo como parametro
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


// Abrir Modal de Gestion del Restaurante
function ModalRestaurante(restaurant_id){
    $(".id-restaurante").empty()
    $(".id-restaurante").append(restaurant_id)
    $(".modal-body2").css("display","none")
    $(".modal-body").css("display","block")
    $("#eliminar").css("display","block")
    $("#seguro-eliminar").css("display","none")
    // buscar el restaurante actual en la base de datos 
    var Restaurante= db.collection("restaurantes").where('uid','==',restaurant_id)
    Restaurante.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(restaurant){
            var nombreRestaurante= restaurant.data().nombre
            var nombreRepresentante= restaurant.data().representante
            var tel= restaurant.data().tel
            var email= restaurant.data().email
            var estado= restaurant.data().estado
            var fechaInscripcion= restaurant.data().fechaInscripcion
            var fechaVencimiento= restaurant.data().fechaVencimiento
            fechaInscripcion=dateChanger(fechaInscripcion)
            fechaVencimiento=dateChanger(fechaVencimiento)

            var estado= restaurant.data().estado

            $(".datosRestaurante").empty()
            $(".datosRestaurante").append(`

                <div class="col-12 nombreRestaurante">${nombreRestaurante}</div>
                <div class="col-12 ">Nombre Admin: ${nombreRepresentante}</div>
                <div class="col-12">Tel: ${tel}</div>
                <div class="col-12">Email: ${email}</div>
                `
            )

            $(".estado").val(`${estado}`)
            $("#inscripcion-date").val(`${fechaInscripcion}`)
            $(".final-date").val(`${fechaVencimiento}`)
        })
    })
    .catch(function(err){
        console.log(err)
    })
    $('#modal-restaurante').modal();
}
// configuración del calendario
var today = new Date();
$('.date').datepicker({
    format: 'dd/mm/yyyy',
    //startDate: 'd',
    todayBtn: true,
    autoclose: true
});

MostrarTabla()
function MostrarTabla(){

    var listaRestaurantes= db.collection("restaurantes")
    listaRestaurantes.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(restaurant){
           
            var nombreRestaurante=restaurant.data().nombre
            var estadoRestaurante=restaurant.data().estado
            var fechaInscripcion=restaurant.data().fechaInscripcion
            var fechaVencimiento=restaurant.data().fechaVencimiento
            var numeroClientes=restaurant.data().clientes.length
            var representante=restaurant.data().representante
            var uidRestaurante= restaurant.data().uid
            fechaInscripcion=dateChanger(fechaInscripcion)
            fechaVencimiento=dateChanger(fechaVencimiento)
            
            $(".TablaRestaurantesBody").append(`
            
            <tr onclick="ModalRestaurante(this.id)" id="${uidRestaurante}">
            <td ><small>${nombreRestaurante}</small></td>
            <td ><small>${representante}</small></td>
            <td ><small>${estadoRestaurante}<i class="material-icons icon shadow ${estadoRestaurante}">stop_circle</i></small></td>
            <td ><small>${fechaInscripcion}</small></td>
            <td ><small></small></td>
            <td ><small>${fechaVencimiento}</small></td>
            <td ><small>${numeroClientes}</small></td>
            <td ><small class="numeroPedidos${restaurant.id}"></small></td>
            </tr>

            
            `)
            consulta_pedidos=db.collection('pedidos').where("uid_restaurante","==",uidRestaurante)
            consulta_pedidos.get()
            .then(function(queryPedidos){
      
            $(`.numeroPedidos${restaurant.id}`).append(`${queryPedidos.size}`)
            })
            .catch(function(err){
                console.log(err)
            })




        // aca se consultan Cuantos pedidos hay por restaurante 


        })
    })
    .catch(function(error){
         console.log(error)
     })
}

function fechas(){
    //dia actual 
    var today = new Date(); 
    //dia en 15 dias 
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate()+15)
    console.log(nextDate)

    const diffTime= Math.abs(nextDate - today)
    const diffDays= Math.ceil(diffTime/(1000*60*60*24))
    console.log(diffDays)

    var dia=String(nextDate.getDate()).padStart(2, '0');
    var mes=String(nextDate.getMonth()+1).padStart(2, '0');
    var anio=nextDate.getFullYear()

    var dateFormat=`${dia}/${mes}/${anio}`
    console.log(dateFormat)
    var fechaPasada= new Date("01/21/2020")
    console.log(fechaPasada)
   dateChanger("09/21/2020")

//    var insAndVen = db.collection('restaurantes')

//     var setWithMerge = insAndVen.set({
//         fechaInscripcion: '08/08/2020',
//         fechaVencimiento: '23/08/2020',
//         estado:'demo'
//     }, { merge: true })
//     .then(function(){
//         console.log("resuelto")
//     })
//     .catch(function(err){
//         console.log(err)
//     })
}

function dateChanger(date){
    var unidades= date.substring(0,2)
    var decenas= date.substring(3,5)
    var anios=date.substring(6,10)
    return `${decenas}/${unidades}/${anios}`

}
//--------------------------------Eliminar Restaurante-----------------------------------
function EliminarRestaurante(){
    $(".modal-body").css("display","none")
    $(".modal-body2").css("display","block")
    $("#eliminar").css("display","none")
    $("#seguro-eliminar").css("display","block")

}

function SeguroEliminar(){
    var uidRestauranteEliminar = $(".id-restaurante").text()
    console.log("listo eliminando el siguiente restaurante "+ uidRestauranteEliminar)
    //buscar pedidos para eliminar
    db.collection("pedidos").where('uid_restaurante','==',uidRestauranteEliminar).get()
    .then(function(queryPedidosBorrar){
        if(queryPedidosBorrar.empty){
            console.log("no hay pedidos para borrar")
        }
        queryPedidosBorrar.forEach(function(docPedidoBorrar){
            var doc_id_borrar= docPedidoBorrar.id
            console.log(doc_id_borrar)
            db.collection("pedidos").doc(doc_id_borrar).delete().then(function(){
                console.log("Pedido Borrado")
               
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });

    //buscar menu para eliminar
    db.collection("menu").where('uid_restaurante','==',uidRestauranteEliminar).get()
    .then(function(queryMenuBorrar){
        if(queryMenuBorrar.empty){
            console.log("no hay pedidos para borrar")
        }
        queryMenuBorrar.forEach(function(docMenuBorrar){
            var doc_id_borrar= docMenuBorrar.id
            console.log(doc_id_borrar)
            db.collection("menu").doc(doc_id_borrar).delete().then(function(){
                console.log("menu Borrado")
               
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
    //buscar carta para eliminar
    db.collection("carta").where('uid_restaurante','==',uidRestauranteEliminar).get()
    .then(function(queryMenuBorrar){
        if(queryMenuBorrar.empty){
            console.log("no hay pedidos para borrar")
        }
        queryMenuBorrar.forEach(function(docMenuBorrar){
            var doc_id_borrar= docMenuBorrar.id
            console.log(doc_id_borrar)
            db.collection("carta").doc(doc_id_borrar).delete().then(function(){
                console.log("carta Borrado")
               
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        })
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
    //buscar logo para eliminar 
    var storageRef=firebase.storage().ref(`${uidRestauranteEliminar}/logo.png`)
    storageRef.delete().then(function() {
    console.log('directorio borrado')
    }).catch(function(error) {
    console.log(error)
    });
    //buscar restaurantes para eliminar
        //buscar carta para eliminar
        db.collection("restaurantes").where('uid','==',uidRestauranteEliminar).get()
        .then(function(queryMenuBorrar){
            if(queryMenuBorrar.empty){
                console.log("no hay restaurantes para borrar")
            }
            queryMenuBorrar.forEach(function(docMenuBorrar){
                var doc_id_borrar= docMenuBorrar.id
                console.log(doc_id_borrar)
                db.collection("restaurantes").doc(doc_id_borrar).delete().then(function(){
                    console.log("restaurante")
                    swal({
                        title:"Listo Restaurante Borrado",
                          text:`Eliminalo del módulo de autenticación ${uidRestauranteEliminar}`,
                          icon:"success"
                      
                      }).then(function(){
                        $('#modal-restaurante').modal('toggle');
                      })
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            })
        })
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });

}


// contador General 
Contador()
function Contador() {
    var contadorDeRestaurantes= db.collection("restaurantes")
    contadorDeRestaurantes.get()
    .then(function(querySnapshot){
        console.log(querySnapshot.size)
    })
    var contadorDePedidos= db.collection("pedidos")
    contadorDePedidos.get()
    .then(function(querySnapshot){
        console.log(querySnapshot.size)
    })
    var contadorDeClientes= db.collection("clientes")
    contadorDeClientes.get()
    .then(function(querySnapshot){
        console.log(querySnapshot.size)
    })

}

VerificarAdmin()

function VerificarAdmin(){
    getUserData()
    .then(userData=>{
    
    var uid = userData.uid
    var consulta_clientes=db.collection('clientes').where("uid","==",uid)
    consulta_clientes.get()
    .then(function(queryClientes){
        if(queryClientes.empty){
            console.log("No es un admin")
            firebase.auth().signOut()
            window.location = '../login.html'//redirigiendo al html de prueba mientras miramos donde redireccionamos para realizar los pedidos
        }
        
        queryClientes.forEach(function(doc_client){
            var tipo= doc_client.data().tipo
            if (tipo !=='admin'){
                console.log("No es un admin")
                firebase.auth().signOut()
                window.location = '../login.html'
            }
        })
    })
    .catch(function(err){
        console.log(err)
        window.location = '../login.html'
    })
    

    })


}

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location = '../login.html'; 
    }
});
// Salir 
function logout(){
    firebase.auth().signOut()
}