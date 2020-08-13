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
    // // Retrieve Firebase Messaging object.
    // const messaging = firebase.messaging();
    // //Permiso para recibir notificaciones 
    // messaging.requestPermission()
    // .then(function(){
    //     console.log('have permission')
    //     return messaging.getToken()
    // })
    // .then(function(token){
    //     console.log(token)
    // })
    // .catch(function(err){
    //     console.log(err)
    // })
    
  entra_consulta=0;
  entra_pedidos=0;
  entra_carta=0;

$(function () {
    $('[data-toggle="popover"]').popover()
})
homePage()

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


function PlaceLogo(){
    // Colocar el logo si no existe
    if($("#logoImage").length ===0){
    var storageRef = firebase.storage().ref();
    var user = firebase.auth().currentUser;
    var uid=user.uid
    var LogoRef = storageRef.child(`${uid}/logo.png`);
    // Get the download URL
    LogoRef.getDownloadURL()
        .then(function(url) {
        // Insert url into an <img> tag to "download"
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            console.log(url)
            // $( `
            //         <img id="logoImage" src="${url}" class="shadow " /> 
   
            // `).insertBefore( "#SideUserName" );
            getMeta(url)

            $(".image").css("background",`url(${url}) 50% 50% no-repeat`)
            $(".image").css("background-size", "100% auto")
            $("#logoImagen").empty()
            $("#logoImagen").append(`${url}`)
        })
        .catch(function(error) {
  
        $(".image").css("background",`url(./assets/img/logo-default.png) 50% 50% no-repeat`)
        $(".image").css("background-size", "100% auto")
        });
    }
}

function getMeta(url){   
    var img = new Image();
    img.onload = function(){
        logo_width=this.width
        logo_height=this.height
        console.log(logo_width + logo_height)
    };
    img.src = url;
}

$(".real-time").click(function(){
    entra_pedidos=1;
    
    $(".user-items").empty()
    $(".menuDia").empty()
    
    var cantidad_menu=0
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_carta!=0){
        consulta_carta()
    }
    var today12 = new Date();
    today12.setHours(0,0,0,0);
    today12=today12.getTime()
    console.log(today12)

    var user = firebase.auth().currentUser;
     consulta_pedidos=db.collection('pedidos').where("uid_restaurante","==",user.uid).where("hora_pedido", ">=", today12 ).orderBy("hora_pedido","desc")
    .onSnapshot(function(querySnapshot) {
        var audio = new Audio('./sounds/notification.mp3')
        audio.play()
        $(".user-items").empty()

        $(".user-items").append(`
        <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">update</i> Pedidos en Tiempo Real </h3>
        <div class="input-group input-group-sm mb-3 mt-1 inputFilter ">
            <input type="text" id="FitrarPedidos"class="form-control Filtrar" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar ....">
        </div>`
      )
        $(".user-items").append(`
        <div class="panel panel-default shadow">
            <div class="table-responsive">
                    <table class="table table-hover table ">
                                    <thead class="thead-dark">
                                    <tr class="TablaPedidosHeader">
                                        <th scope="col">Hora</th>
                                        <th scope="col">Pedido</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Dirección</th>
                                        <th scope="col">Notas</th>
                                        <th scope="col">Precio</th>
                                        <th scope="col">Estado</th>
                                    </tr>
                                    </thead>
                                    <tbody class="TablaPedidosBody" >
                                    </tbody>
                    </table>
                    
            </div>
        </div>
      `)

        querySnapshot.forEach(function(doc){
            var pedido={}
            cantidad_menu=0
            var EntradasPedido=doc.data().Entradas
            var PrincipioPedido=doc.data().Principio
            var PlatoFuertePedido=doc.data().PlatoFuerte
            var BebidasPedido=doc.data().Bebidas
            var PedidoCarta=doc.data().carta
            var ProteinasPedido=doc.data().Proteinas
            var EnsaladasPedido=doc.data().Ensaladas
            var PostresPedido=doc.data().Postres
            var AcompanamientosPedido=doc.data().Acompañamientos

            var nombreCliente=doc.data().nombre
            const hora_pedido=doc.data().hora_pedido
            const total=doc.data().total
            const direccion=doc.data().dir
            const notas=doc.data().notas
            const estado=doc.data().estado
            var date_pedido= new Date (hora_pedido)
            hora_print=date_pedido.toLocaleString()
            console.log(hora_print)
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(EntradasPedido!= undefined ){
                
                //Meterse a recorrer el arreglo
                cantidad_menu=EntradasPedido.length
                                
                for (i = 0; i < EntradasPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                     
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = EntradasPedido[i];
                    }
                    else{
         
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(EntradasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
              
                }
            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
                        
            if(PrincipioPedido!= undefined ){
                cantidad_menu=PrincipioPedido.length

                for (i = 0; i < PrincipioPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = PrincipioPedido[i];
                    }
                    else{
               
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(PrincipioPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                   
                }
   
            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header

            if(PlatoFuertePedido!= undefined ){
                cantidad_menu=PlatoFuertePedido.length

                for (i = 0; i < PlatoFuertePedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                    
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = PlatoFuertePedido[i];
                    }
                    else{
                 
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(PlatoFuertePedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                    //pedido[`menu${[i]}`] = EntradasPedido[i];
                }

            }

            //Primero toca Validar si hay algo dentro del item y no esta creado el header

            if(AcompanamientosPedido!= undefined ){
                cantidad_menu=AcompanamientosPedido.length
            
                for (i = 0; i < AcompanamientosPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                                
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = AcompanamientosPedido[i];
                        }
                        else{
                             
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(AcompanamientosPedido[i])
                            pedido[`menu${[i]}`] = array_aux;
                        }
                                //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
            
            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(BebidasPedido!= undefined ){
                cantidad_menu=BebidasPedido.length

                for (i = 0; i < BebidasPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                     
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = BebidasPedido[i];
                    }
                    else{
                     
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(BebidasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                    //pedido[`menu${[i]}`] = EntradasPedido[i];
                }
        
            }

                    //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(ProteinasPedido!= undefined ){
            cantidad_menu=ProteinasPedido.length
        
                    for (i = 0; i < ProteinasPedido.length; i++) {
                        //Verificar que exista ese key dentro del objeto
                        if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                         
                            pedido[`menu${[i]}`]=[]
                            pedido[`menu${[i]}`][0] = ProteinasPedido[i];
                        }
                        else{
                         
                            var array_aux= pedido[`menu${[i]}`]
                            array_aux.push(ProteinasPedido[i])
                            pedido[`menu${[i]}`] = array_aux;
                        }
                        //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
            
            }

            //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(EnsaladasPedido!= undefined ){
                cantidad_menu=EnsaladasPedido.length
                
            for (i = 0; i < EnsaladasPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                    
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = EnsaladasPedido[i];
                        }
                    else{
                                 
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(EnsaladasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                        }
                //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
                    
            }

                //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(PostresPedido!= undefined ){
                cantidad_menu=PostresPedido.length
        
            for (i = 0; i < PostresPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                         
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = PostresPedido[i];
                    }
                        else{
                         
                            var array_aux= pedido[`menu${[i]}`]
                            array_aux.push(PostresPedido[i])
                            pedido[`menu${[i]}`] = array_aux;
                        }
                        //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
            
            }

           

   

            $(".TablaPedidosBody").append(`     <tr id="${doc.id}" onClick="ClickPedido(this.id)">
                                                    <th scope="row" class="hour"><small>${hora_print}</small></th>
                                                    <td id="${doc.id}pedido"></td>
                                                </tr>`)
            
            for( i=0; i<cantidad_menu;i++){

                $(`#${doc.id}pedido`).append(`
                <div class="row">
                    <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                        <p>Menu: ${i+1} <small>${pedido[`menu${i}`]}</small></p>
                    </div>
                </div>
                `)
                
            }

            if(PedidoCarta != undefined && PedidoCarta != ""){

                $(`#${doc.id}pedido`).append(`
                <div class="row">
                    <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                        <p>Carta:  <small>${PedidoCarta}</small></p>
                    </div>
                </div>
                `)
            }

            $(`#${doc.id}`).append(`<td ><small>${nombreCliente}</small></td>
                                    <td ><small>${direccion}</small></td>
                                    <td ><small>${notas}</small></td>
                                    <td ><small>${total}</small></td>
                                    <td ><small>${estado}</small></td>`)

            // para la tabla de filtrado

            $(document).ready(function(){
                    $("#FitrarPedidos").on("keyup", function() {
                     var value = $(this).val().toLowerCase();
                    $(".TablaPedidosBody tr").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                            });
                            });
                    });                            

                   
        })
            
        

    })
    
});

$(".settings").click(function(){

    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }
    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }

    console.log("configuracion")

    $(".user-items").append( `
    
    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">settings</i> Configuración  </h3>
                        <div class="col-12 mt-2 settings-logo">
                            <form enctype="multipart/form-data" name="restaurant-data">


                                <div class="form-group">
                                <label for="logo">Elige tu Logo</label>
                                    <input type="file" class="form-control" id="logo-upload" placeholder="Ingresa tu Logo" name="logo" accept ="image/*" style="padding-bottom:10px;">
                                </div>

                                <div class="row d-flex flex-row-reverse">
                                <button type="button" class="btn btn-labeled  col-6 col-md-3  mt-2 ml-3 d-flex align-items-center" onClick="subirLogo()" style=" background-color: yellowgreen; color: white;">
                                    <span class="btn-label"><i class="material-icons icon d-flex align-items-center">add_photo_alternate</i></span>
                                    <small> Subir Logo</small>
                                </button>
                                </div>
                                
                                <div class="form-group">
                                <label for="logo"> Tu dirección: </label>
                                    <input type="text" class="form-control" id="direccion-change" placeholder="Aquí tu dirección " name="direccion">
                                </div>

                                <div class="form-group">
                                <label for="tel">Tu teléfono</label>
                                <input type="tel" class="form-control" id="tel-change" placeholder="Aquí tu número " name="tel">
                                </div>
                                <div class="row d-flex flex-row-reverse">
                                <button type="button" class="btn btn-labeled  col-6 col-md-3  mt-2 ml-3 d-flex align-items-center" onClick="ActualizarDatos()" style=" background-color:#FB747C ; color: white;">
                                    <span class="btn-label"><i class="material-icons icon d-flex align-items-center">contacts</i></span>
                                    <small> Actualizar Datos</small>
                                </button>
                                </div>
                            </form>
                        </div>`)

                        // poner los valores actuales en los input 



                        var user = firebase.auth().currentUser;
                        var consulta_precio=db.collection('restaurantes').where("uid","==",user.uid)
                        consulta_precio.get()
                        .then(function(querySnapshot){
                            querySnapshot.forEach(function(doc){
                                const precio=doc.data().precio
                                docID=doc.id
                                const direccion=doc.data().dir
                                const tel=doc.data().tel

                                document.forms["restaurant-data"]["direccion"].value=direccion;
                                document.forms["restaurant-data"]["tel"].value=tel;
                            })
                        })


    
});
// en este módulo se pueden ver los datos de las personas que han pedido al restaurante
$(".clients").click(function(){
    console.log("clientes")

    $(".user-items").empty()
    $(".menuDia").empty()

    $(".user-items").append(`
    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">group</i> Clientes </h3>
    <div class="input-group input-group-sm mb-3 mt-4 inputFilter ">
        <input type="text" id="FitrarClientes"class="form-control Filtrar" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar ....">
    </div>`
    )
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }


    $(".user-items").append(`
    <div class="panel panel-default shadow">
    <div class="table-responsive">
            <table class="table table-hover table ">
            <thead class="thead-dark TablaClientesHead">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Email</th>
                        <th scope="col">Dirección</th>
                        </tr>
                    </thead>
                    <tbody class="TablaClientesBody">
                        
                    </tbody>
                    </table>
                    </div>
    </div>
    
    `)
    var user = firebase.auth().currentUser;

    var consulta_restaurantes=db.collection('restaurantes').where("uid","==",user.uid)
        consulta_restaurantes.get()
        .then(function(querySnapshot){

            querySnapshot.forEach(function(doc){
                    
                    var clientes=doc.data().clientes
                    console.log(clientes)
                    clientes.forEach(function(element){
                        if(element!=""){
                            // Hacer el query a los clientes preguntando por la informacion y agregandola a la tabla 
                            console.log("consultando ",element)
                            var consulta_cliente=db.collection('clientes').where("uid","==",element)
                            consulta_cliente.get()
                                .then(function(query){
                                    query.forEach(function(doc){

                                    
                                    var nombre=doc.data().nombre
                                    var telefono=doc.data().tel
                                    var email=doc.data().email
                                    var direccion=doc.data().dir

                                    $(".TablaClientesBody").append(`
                                                        <tr>
                                                        <th >${nombre}</th>
                                                        <td>${telefono}</td>
                                                        <td>${email}</td>
                                                        <td>${direccion}</td>
                                                    </tr>
                                    `)

                                })

                            })
                            .catch(function(err){
                                console.log(err)
                            })
                        }
                    })
                    })

         // para la tabla de filtrado
            
            $(document).ready(function(){
                $("#FitrarClientes").on("keyup", function() {
                 var value = $(this).val().toLowerCase();
                $(".TablaClientesBody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                        });
                        });
                });    
            
        })
   
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });
        

    

});

$(".mi_pagina").click(function(){
    console.log("mi página")
        // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }
   
    $(".user-items").empty()
    $(".menuDia").empty()
    homePage()

})

$(".pedidos").click(function(){
    console.log("pedidos")
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }
    $(".user-items").empty()
    $(".menuDia").empty()
    var cantidad_menu=0

    var user = firebase.auth().currentUser;
    consulta_pedidos_historicos=db.collection('pedidos').where("uid_restaurante","==",user.uid).orderBy("hora_pedido","desc")
    consulta_pedidos_historicos.get()
    .then(function(querySnapshot){
        $(".user-items").empty()

        $(".user-items").append(`
        <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">food_bank</i> Pedidos Historicos </h3>
        <div class="input-group input-group-sm mb-3 mt-1 inputFilter ">
            <input type="text" id="FitrarPedidos"class="form-control Filtrar" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar ....">
        </div>`
      )
        $(".user-items").append(`
        <div class="panel panel-default shadow">
            <div class="table-responsive">
                    <table class="table table-hover ">
                                    <thead class="thead-dark redondear-tabla">
                                    <tr class="TablaPedidosHeader">
                                        <th scope="col">Hora</th>
                                        <th scope="col">Pedido</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Dirección</th>
                                        <th scope="col">Notas</th>
                                        <th scope="col">Precio</th>
                                        <th scope="col">Estado</th>
                                    </tr>
                                    </thead>
                                    <tbody class="TablaPedidosBody" >
                                    </tbody>
                    </table>
                    
            </div>
        </div>
      `)

      querySnapshot.forEach(function(doc){
        var pedido={}
        cantidad_menu=0
        // las categorias posibles 
        var EntradasPedido=doc.data().Entradas
        var PrincipioPedido=doc.data().Principio
        var PlatoFuertePedido=doc.data().PlatoFuerte
        var BebidasPedido=doc.data().Bebidas
        var PlatoFuertePedido=doc.data().PlatoFuerte
        var ProteinasPedido=doc.data().Proteinas
        var EnsaladasPedido=doc.data().Ensaladas
        var PostresPedido=doc.data().Postres
        var AcompanamientosPedido=doc.data().Acompañamientos

        var PedidoCarta=doc.data().carta
        var nombreCliente=doc.data().nombre
        const hora_pedido=doc.data().hora_pedido
        const total=doc.data().total
        const direccion=doc.data().dir
        const notas=doc.data().notas
        const estado=doc.data().estado
        var date_pedido= new Date (hora_pedido)
        hora_print=date_pedido.toLocaleString()
    
        //Primero toca Validar si hay algo dentro del item y no esta creado el header
        if(EntradasPedido!= undefined ){
        
            //Meterse a recorrer el arreglo
            cantidad_menu=EntradasPedido.length
                            
            for (i = 0; i < EntradasPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                 
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = EntradasPedido[i];
                }
                else{
     
                    var array_aux= pedido[`menu${[i]}`]
                    array_aux.push(EntradasPedido[i])
                    pedido[`menu${[i]}`] = array_aux;
                }
          
            }
        }
        //Primero toca Validar si hay algo dentro del item y no esta creado el header
                    
        if(PrincipioPedido!= undefined ){
         
            cantidad_menu=PrincipioPedido.length

            for (i = 0; i < PrincipioPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
            
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = PrincipioPedido[i];
                }
                else{
           
                    var array_aux= pedido[`menu${[i]}`]
                    array_aux.push(PrincipioPedido[i])
                    pedido[`menu${[i]}`] = array_aux;
                }
               
            }

        }
        //Primero toca Validar si hay algo dentro del item y no esta creado el header

        if(PlatoFuertePedido!= undefined ){
     
            cantidad_menu=PlatoFuertePedido.length

            for (i = 0; i < PlatoFuertePedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = PlatoFuertePedido[i];
                }
                else{
             
                    var array_aux= pedido[`menu${[i]}`]
                    array_aux.push(PlatoFuertePedido[i])
                    pedido[`menu${[i]}`] = array_aux;
                }
                //pedido[`menu${[i]}`] = EntradasPedido[i];
            }

        }

                    //Primero toca Validar si hay algo dentro del item y no esta creado el header

                    if(AcompanamientosPedido!= undefined ){
                        cantidad_menu=AcompanamientosPedido.length
                    
                        for (i = 0; i < AcompanamientosPedido.length; i++) {
                            //Verificar que exista ese key dentro del objeto
                            if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                                        
                                pedido[`menu${[i]}`]=[]
                                pedido[`menu${[i]}`][0] = AcompanamientosPedido[i];
                                }
                                else{
                                     
                                var array_aux= pedido[`menu${[i]}`]
                                array_aux.push(AcompanamientosPedido[i])
                                    pedido[`menu${[i]}`] = array_aux;
                                }
                                        //pedido[`menu${[i]}`] = EntradasPedido[i];
                            }
                    
                    }
        //Primero toca Validar si hay algo dentro del item y no esta creado el header
        if(BebidasPedido!= undefined ){
      
            cantidad_menu=BebidasPedido.length

            for (i = 0; i < BebidasPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                 
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = BebidasPedido[i];
                }
                else{
                 
                    var array_aux= pedido[`menu${[i]}`]
                    array_aux.push(BebidasPedido[i])
                    pedido[`menu${[i]}`] = array_aux;
                }
                //pedido[`menu${[i]}`] = EntradasPedido[i];
            }
    
        }

        //Primero toca Validar si hay algo dentro del item y no esta creado el header
        if(ProteinasPedido!= undefined ){

            cantidad_menu=ProteinasPedido.length
        
                    for (i = 0; i < ProteinasPedido.length; i++) {
                        //Verificar que exista ese key dentro del objeto
                        if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                         
                            pedido[`menu${[i]}`]=[]
                            pedido[`menu${[i]}`][0] = ProteinasPedido[i];
                        }
                        else{
                         
                            var array_aux= pedido[`menu${[i]}`]
                            array_aux.push(ProteinasPedido[i])
                            pedido[`menu${[i]}`] = array_aux;
                        }
                        //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
            
        }

        //Primero toca Validar si hay algo dentro del item y no esta creado el header
        if(EnsaladasPedido!= undefined ){
         
            cantidad_menu=EnsaladasPedido.length
                
            for (i = 0; i < EnsaladasPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                    
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = EnsaladasPedido[i];
                        }
                    else{
                                 
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(EnsaladasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                        }
                //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
                    
        }

        //Primero toca Validar si hay algo dentro del item y no esta creado el header
        if(PostresPedido!= undefined ){
         
            cantidad_menu=PostresPedido.length
        
            for (i = 0; i < PostresPedido.length; i++) {
                //Verificar que exista ese key dentro del objeto
                if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                         
                    pedido[`menu${[i]}`]=[]
                    pedido[`menu${[i]}`][0] = PostresPedido[i];
                    }
                        else{
                         
                            var array_aux= pedido[`menu${[i]}`]
                            array_aux.push(PostresPedido[i])
                            pedido[`menu${[i]}`] = array_aux;
                        }
                        //pedido[`menu${[i]}`] = EntradasPedido[i];
                    }
            
        }

        

        $(".TablaPedidosBody").append(`     <tr id="${doc.id}" onClick="ClickPedido(this.id)">
                                                <td scope="row" class="hour"><small>${hora_print}</small></th>
                                                <td id="${doc.id}pedido"></td>
                                            </tr>`)
        
        for( i=0; i<cantidad_menu;i++){

            $(`#${doc.id}pedido`).append(`
            <div class="row">
                <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                    <p>Menu: ${i+1} <small>${pedido[`menu${i}`]}</small></p>
                </div>
            </div>
            `)
            
        }

        if(PedidoCarta != undefined && PedidoCarta != ""){

            $(`#${doc.id}pedido`).append(`
            <div class="row">
                <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                    <p>Carta:  <small>${PedidoCarta}</small></p>
                </div>
            </div>
            `)
        }

        $(`#${doc.id}`).append(`<td ><small>${nombreCliente}</small></td>
                                <td ><small>${direccion}</small></td>
                                <td ><small>${notas}</small></td>
                                <td ><small>${total}</small></td>
                                <td ><small>${estado}</small></td>`)


        // para la tabla de filtrado

        $(document).ready(function(){
                $("#FitrarPedidos").on("keyup", function() {
                 var value = $(this).val().toLowerCase();
                $(".TablaPedidosBody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                        });
                        });
                });                            

    })

    })
    .catch(function(error){
        console.log(error)
    })

})

// convertir a BAse64 la imagen para poner en PDF
var convertImgToDataURLviaCanvas = function(url, callback) {
  var img = new Image();

  img.crossOrigin = 'Anonymous';

  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL();
    callback(dataURL);
    canvas = null;
  };

  img.src = url;
}
// verificar si hay una imagen 

//descargar PDF
function DescargarPDF(){



    var user = firebase.auth().currentUser;
    var nombreRestaurante=user.displayName;
    var src=$("#imagenQR").attr("src")
    var url_pdf_qr='./assets/img/qr_pdf.png'
    if($('#logoImagen').is(':empty')){


        convertImgToDataURLviaCanvas(url_pdf_qr,function(base_qr_pdf){
            console.log(base_qr_pdf)
            var doc = new jsPDF()
            doc.addImage(base_qr_pdf, 'JPEG', 0,0, 210, 300)
            doc.addImage(src, 'JPEG', 55,90, 100, 100)
    
           doc.save(`${nombreRestaurante}.pdf`)

        })
        

    }
    else{
    
        var Logosrc=$("#logoImagen").text()
        var url_pdf_qr='./assets/img/qr_pdf.png'

        convertImgToDataURLviaCanvas( Logosrc, function( base64_data ) {
    
            //console.log( base64_data );

            convertImgToDataURLviaCanvas(url_pdf_qr,function(base_qr_pdf){
                //console.log(base_qr_pdf)
                var doc = new jsPDF()
                var ratio=logo_width/logo_height
            
                doc.addImage(base_qr_pdf, 'JPEG', 0,0, 210, 300)
                doc.addImage(src, 'JPEG', 55,90, 100, 100)
                doc.addImage(base64_data, 'JPEG', 80, 60, 40, 40/ratio)
                doc.save(`${nombreRestaurante}.pdf`)
  
                console.log(doc)
            })



            

            
        } );
        
    }
    


}

$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

$(".menu").click(function(){
    if(entra_pedidos!=0){
        consulta_pedidos()
    }
    if(entra_carta!=0){
        consulta_carta()
    }


    
    console.log("menu")
    $(".user-items").empty()
   
    $(".user-items").append(`
    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">menu_book</i> Menú del día </h3>
        <button type="button" class="btn btn-labeled  col-12 col-md-3 mt-2 ml-3 d-flex align-items-center" onClick="AdicionarProducto()" style=" background-color: yellowgreen; color: white;">
            <span class="btn-label"><i class="material-icons icon d-flex align-items-center">queue</i></span>
            <small> Adicionar Plato </small>
        </button>  

        <button type="button" class="btn btn-labeled  col-12 col-md-3 mt-2 ml-3 d-flex align-items-center" onClick="PrecioMenu()" style="background-color: #F9A624; color: white;">
            <span class="btn-label"><i class="material-icons icon d-flex align-items-center">attach_money</i></span>
            <small> Precio del Menú </small>
        </button>  


    `)
    $(".user-items").append(`
    <div class="input-group input-group-sm mb-3 mt-4 inputFilter ">
        <input type="text" id="FitrarMenu"class="form-control Filtrar" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar ....">
    </div>`
    )
    MostrarMenuActual()
});

$(".carta").click(function(){
    console.log("carta")
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }


    console.log("menu")
    $(".user-items").empty()
    $(".user-items").append(`  
    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">restaurant</i> Carta </h3>            
    <button type="button" class="btn btn-labeled  col-12 col-md-6  mt-2 ml-3 d-flex align-items-center" onClick="AdicionarProductoCarta()" style=" background-color: yellowgreen; color: white;">
    <span class="btn-label"><i class="material-icons icon d-flex align-items-center">queue</i></span>
    <small> Adicionar Plato Carta</small>
    </button>  


    `)

    $(".user-items").append(`
    <div class="input-group input-group-sm mb-3 mt-4 inputFilter col-12">
        <input type="text" id="FitrarCarta"class="form-control Filtrar" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar ....">
    </div>`
    )
    MostrarCartaActual()

})

function AdicionarProducto(){
    document.forms["crearProductoForm"]["NombrePlato"].value="";
    document.forms["crearProductoForm"]["descripcion"].value ="";
     document.forms["crearProductoForm"]["Lunes"].checked = false;
     document.forms["crearProductoForm"]["Martes"].checked = false;
     document.forms["crearProductoForm"]["Miercoles"].checked = false;
     document.forms["crearProductoForm"]["Jueves"].checked = false;
     document.forms["crearProductoForm"]["Viernes"].checked = false;
     document.forms["crearProductoForm"]["Sabado"].checked = false;
     document.forms["crearProductoForm"]["Domingo"].checked = false;

    $('#modal-producto').modal();
}

function PrecioMenu(){
    console.log("Ajustar Precio del Menú")
    // Buscar en la base de datos el precio del menú, si no existe colocal el input vacio, si ya existe colocal el valor actual como placeholder
    var user = firebase.auth().currentUser;
    var consulta_precio=db.collection('restaurantes').where("uid","==",user.uid)
    consulta_precio.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const precio=doc.data().precio
            console.log(doc.id)
            $('.id-precio').empty()
            $('.id-precio').append(doc.id)
            $('#precio').val(precio)
            $('#modal-precio').modal();
        })
    })
}

function UpdatePrecio(){
    var precio=document.forms["PrecioForm"]["precio"].value;
    var user = firebase.auth().currentUser;
    var precio_id = $(".id-precio").text(); //preferred
    var actualizacion_precio=db.collection('restaurantes').doc(precio_id)
    return actualizacion_precio.update({
        precio:precio
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Precio de Menú Actualizado",
              icon:"success"
          
          }).then(function(){
            $('#modal-precio').modal('toggle');
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function Click_modificar(ref_id){
    console.log(ref_id)
    var consulta_producto=db.collection('menu').doc(ref_id)
    consulta_producto.get()
    .then(function(doc){
            
                const nombrePlato=doc.data().nombre
                const categoria=doc.data().categoria
                const descripcion=doc.data().descripcion
                const dia=doc.data().dia
                const estado=doc.data().estado
                const semana_array=['LunesM','MartesM','MiercolesM','JuevesM','ViernesM','SabadoM','DomingoM']
                var i;

                for (i = 0; i < dia.length; i++) { 
                         $(`#${semana_array[i]}`).prop('checked', false);  
                 }

                for (i = 0; i < dia.length; i++) {
                   if (dia[i]=== true){
                       
                        $(`#${semana_array[i]}`).prop('checked', true);
                   }
                }
                $('.id-modificar').empty()
                $('.id-modificar').append(ref_id)
                $('#modificar-nombrePlato').val(nombrePlato)
                $('#modificar-categoria').val(categoria)
                $('#modificar-descripcion').val(descripcion)
                $('#modificar-estado').val(estado)
                // Checks the box
                $('#modal-modificar-producto').modal();

            });
      
}

function UpdatePlato(){
    console.log("Actualizar el plato")
    ValidarFormularioModificarProducto()
}

function GuardarPlato(){
    ValidarFormularioProducto()
}

function EliminarPlato(){
    var ref_id = $(".id-modificar").text(); // tomo el ID del Documento 
    db.collection('menu').doc(ref_id).delete().then(function(){
        swal({
            title:"Listo",
              text:"Producto Eliminado ",
              icon:"success"
          
          }).then(()=>{
            $("#modal-modificar-producto").modal('toggle');
            console.log("cerrar modal")
          })

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


}

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location = '../login.html'; 
    }
});

function CrearNuevoPlato(categoria,semana,nombre,uid,descripcion){

   
   
        db.collection("menu").doc().set({
            categoria:categoria,
            dia:semana,
            nombre:nombre,
            estado:"activo",
            uid_restaurante:uid,
            descripcion:descripcion
        })
        .then(function() {
            swal({
                title:"Listo",
                  text:"Producto Adicionado ",
                  icon:"success"
              
              })
              .then(function(){
               document.forms["crearProductoForm"]["NombrePlato"].value="";
               document.forms["crearProductoForm"]["descripcion"].value ="";
                document.forms["crearProductoForm"]["Lunes"].checked = false;
                document.forms["crearProductoForm"]["Martes"].checked = false;
                document.forms["crearProductoForm"]["Miercoles"].checked = false;
                document.forms["crearProductoForm"]["Jueves"].checked = false;
                document.forms["crearProductoForm"]["Viernes"].checked = false;
                document.forms["crearProductoForm"]["Sabado"].checked = false;
                document.forms["crearProductoForm"]["Domingo"].checked = false;

              })
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
        });
    
    



}

function ModificarPlato(categoria,semana,nombre,ref_id,estado,descripcion){

    var actualizacion_producto=db.collection('menu').doc(ref_id)
    return actualizacion_producto.update({
        categoria:categoria,
        dia:semana,
        nombre:nombre,
        estado:estado,
        descripcion:descripcion
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Actualizado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-modificar-producto').modal("toggle");
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}


function ValidarFormularioProducto(){

    var NombrePlato = document.forms["crearProductoForm"]["NombrePlato"].value;
    var categoria = document.forms["crearProductoForm"]["categoria"].value;
    var Lunes = document.forms["crearProductoForm"]["Lunes"].checked;
    var Martes = document.forms["crearProductoForm"]["Martes"].checked;
    var Miercoles = document.forms["crearProductoForm"]["Miercoles"].checked;
    var Jueves = document.forms["crearProductoForm"]["Jueves"].checked;
    var Viernes = document.forms["crearProductoForm"]["Viernes"].checked;
    var Sabado = document.forms["crearProductoForm"]["Sabado"].checked;
    var Domingo = document.forms["crearProductoForm"]["Domingo"].checked;
    var Descripcion = document.forms["crearProductoForm"]["descripcion"].value;
    var Semana=[Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo]

    if(NombrePlato===""){
        alert("Debes agregar el nombre de algún plato")
    }
    var user = firebase.auth().currentUser;
    console.log(NombrePlato);
    console.log(Semana);
    console.log(categoria);
    CrearNuevoPlato(categoria,Semana,NombrePlato,user.uid,Descripcion)
}


function ValidarFormularioModificarProducto(){

    var NombrePlato = document.forms["modificarProductoForm"]["modificar-nombrePlato"].value;
    var categoria = document.forms["modificarProductoForm"]["modificar-categoria"].value;
    var Lunes = document.forms["modificarProductoForm"]["Lunes"].checked;
    var Martes = document.forms["modificarProductoForm"]["Martes"].checked;
    var Miercoles = document.forms["modificarProductoForm"]["Miercoles"].checked;
    var Jueves = document.forms["modificarProductoForm"]["Jueves"].checked;
    var Viernes = document.forms["modificarProductoForm"]["Viernes"].checked;
    var Sabado = document.forms["modificarProductoForm"]["Sabado"].checked;
    var Domingo = document.forms["modificarProductoForm"]["Domingo"].checked;
    var Descripcion = document.forms["modificarProductoForm"]["modificar-descripcion"].value;
    var Semana=[Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo]
    var estado=document.forms["modificarProductoForm"]["modificar-estado"].value;
    var ref_id = $(".id-modificar").text(); //preferred

    if(NombrePlato===""){
        alert("Debes agregar el nombre de algún plato")
    }

    var user = firebase.auth().currentUser;
    console.log("documento a modificar")
    console.log(ref_id);
 

    ModificarPlato(categoria,Semana,NombrePlato,ref_id,estado,Descripcion)

}


function MostrarMenuActual(){
    entra_consulta=1;
    var user = firebase.auth().currentUser;
     consulta_menu=db.collection('menu').where("uid_restaurante","==",user.uid).orderBy("categoria")
    .onSnapshot(function(querySnapshot) {
        $(".menuDia").empty()
        $(".menuDia").append(`
        <div class="panel panel-default shadow">
            <div class="table-responsive">
                    <table class="table table-hover table ">
                    <thead class="thead-dark">
                                    <tr>
                                    
                                        <th scope="col">Categoria</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Semana</th>
                                        <th scope="col">Estado</th>
                                    
                                    </tr>
                                    </thead>
                                    <tbody class="menu-item-body">
                                    <tr class="stopper-entradas"></tr>
                                    <tr class="stopper-proteinas"></tr>
                                    <tr class="stopper-principio"></tr>
                                    <tr class="stopper-acompanamientos"></tr>
                                    <tr class="stopper-ensaladas"></tr>
                                    <tr class="stopper-fuerte"></tr>
                                    <tr class="stopper-bebidas"></tr>
                                    <tr class="stopper-postres"></tr>
                                    </tbody>
                    </table>
                    
            </div>
        </div>
        `)

        querySnapshot.forEach(function(doc) {
        const nombrePlato=doc.data().nombre
        const categoria=doc.data().categoria
        const descripcion=doc.data().descripcion
        const dia=doc.data().dia
        const estado=doc.data().estado
        var dias_array=[];
        const semana_array=['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo']
        var i;
        for (i = 0; i < dia.length; i++) {
           if (dia[i]=== true){
                dias_array.push(semana_array[i])
           }
        }


        if(categoria ==="Entradas"){
            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-entradas")

        }
        else if(categoria ==="Proteinas"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-proteinas")

        }
        else if(categoria ==="Principio"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-principio")

        }

        else if(categoria ==="Acompañamientos"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-acompanamientos")

        }

        else if(categoria ==="Ensaladas"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-ensaladas")

        }

        else if(categoria ==="Plato Fuerte"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-fuerte")

        }

        else if(categoria ==="Bebidas"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-bebidas")

        }

        else if(categoria ==="Postres"){

            $(`
            <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                <td class="${categoria}TablaMenu">${categoria}</td>
                <td>${nombrePlato}</td>
                <td>${descripcion}</td>
                <td>${dias_array}</td>
                <td>${estado}</td>
            
            </tr>
            
            `).insertBefore(".stopper-postres")

        }
        else{
            $(".menu-item-body").append(`
                <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
                    <td class="${categoria}TablaMenu">${categoria}</td>
                    <td>${nombrePlato}</td>
                    <td>${descripcion}</td>
                    <td>${dias_array}</td>
                    <td>${estado}</td>
                
                </tr>
        
        `)
        }




        // para la tabla de filtrado
            
        $(document).ready(function(){
            $("#FitrarMenu").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".menu-item-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                });
            }); 
        
        });
    });

    
}

function VerificarDia(){
   
    today =  new Date();
    today_day_week=today.getDay();
    console.log(today_day_week);
    if(today_day_week===0){
        return 6
    }
    else{
        today_day_week=today_day_week-1
        return today_day_week
    }
}

function ClickPedido(ref_id){
    $('.id-pedido').empty()
    $('.id-pedido').append(ref_id)
    $(".infoPedido").empty()
    console.log(ref_id)
    var consulta_pedido=db.collection('pedidos').doc(ref_id)
    consulta_pedido.get()
    .then(function(doc){

        const tel= doc.data().tel
        const dir= doc.data().dir
        const estado= doc.data().estado
        console.log(tel)
        $(".infoPedido").append(`                                 
        <div>
        <h5>Contacto del pedido</h5>
        <p>Telefono : <small>${tel}</small></p>
        <p>Dirección: <small>${dir}</small></p>
        </div>`)
        $(`#pedido-ordenado`).prop('checked', false);  
        $(`#pedido-recibido`).prop('checked', false);  
        $(`#pedido-entregado`).prop('checked', false);  
        if(estado=== 'ordenado'){
            $(`#pedido-ordenado`).prop('checked', true);  
        }
        else if(estado==='recibido'){
            $(`#pedido-recibido`).prop('checked', true);  
        }
        else{
            $(`#pedido-entregado`).prop('checked', true);  
        }
    })
    
    $("#modal-pedido").modal()
}

function EstadoPedido(){
    var ref_id = $(".id-pedido").text(); //preferred
    var Ordenado = document.forms["PedidoForm"]["ordenado"].checked;
    var Recibido = document.forms["PedidoForm"]["recibido"].checked;
    var Entregado= document.forms["PedidoForm"]["entregado"].checked;
    if(Ordenado!=true && Recibido!=true && Entregado!= true){
        console.log("selecciona alguna")
    }

    else{
        var estado=''
        if(Ordenado===true){
            estado='ordenado'
        }
        else if (Recibido===true){
            estado='recibido'
        }
        else{
            estado='enviado'
        }
        var actualizar_estado_pedido=db.collection('pedidos').doc(ref_id)
        return actualizar_estado_pedido.update({
            estado: estado
        })
        .then(function() {
            swal({
                title:"Estado del Pedido",
                  text:"Modificado ",
                  icon:"success"
              
              }).then(()=>{
                $("#modal-pedido").modal('toggle');
                console.log("cerrar modal")
              })
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        
        
    }

}

// Módulo de Carta 

function MostrarCartaActual(){
    entra_carta=1;
    var user = firebase.auth().currentUser;
     consulta_carta=db.collection('carta').where("uid_restaurante","==",user.uid).orderBy("categoria")
    .onSnapshot(function(querySnapshot) {
        $(".menuDia").empty()
        $(".menuDia").append(`
        <div class="panel panel-default shadow">
        <div class="table-responsive">
                <table class="table table-hover table ">
                <thead class="thead-dark">
                                <tr>
                                
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                
                                </tr>
                                </thead>
                                <tbody class="carta-item-body">
                                </tbody>
                </table>
                
            </div>
        </div>`)

        querySnapshot.forEach(function(doc) {
        const nombrePlato=doc.data().nombre
        const categoria=doc.data().categoria
        const descripcion=doc.data().descripcion
        const precio=doc.data().precio
        const estado=doc.data().estado
       
        $(".carta-item-body").append(`
        <tr id="${doc.id}" onClick="Click_modificarCarta(this.id)" class="item_product"> 
            <td class="${categoria}TablaMenu">${categoria}</td>
            <td>${nombrePlato}</td>
            <td>${descripcion}</td>
            <td>$${precio}</td>
            <td>${estado}</td>
        
        </tr>
        
        `)

        $(document).ready(function(){
            $("#FitrarCarta").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".carta-item-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                });
            });
        
        });
    });

    
}

function AdicionarProductoCarta(){

    document.forms["crearProductoCartaForm"]["NombrePlato"].value="";
    document.forms["crearProductoCartaForm"]["descripcion"].value="";
    document.forms["crearProductoCartaForm"]["precio"].value="";

    $('#modal-producto-carta').modal();
}

function GuardarPlatoCarta(){
    ValidarFormularioProductoCarta()
}

function ValidarFormularioProductoCarta(){

    var NombrePlato = document.forms["crearProductoCartaForm"]["NombrePlato"].value;
    var categoria = document.forms["crearProductoCartaForm"]["categoria"].value;
    var Descripcion = document.forms["crearProductoCartaForm"]["descripcion"].value;
    var Precio =document.forms["crearProductoCartaForm"]["precio"].value;


    if(NombrePlato==="" || Precio ===""){
        swal({
            title:"Advertencia",
              text:"Recuerda que debes agregar el Precio y Nombre del Plato obligatoriamente ",
              icon:"warning"
          
          })
    }

    else{

        var user = firebase.auth().currentUser;
  
        CrearNuevoPlatoCarta(categoria,Precio,NombrePlato,user.uid,Descripcion)
    }


}

function CrearNuevoPlatoCarta(categoria,Precio,nombre,uid,descripcion){

   
   
    db.collection("carta").doc().set({
        categoria:categoria,
        nombre:nombre,
        estado:"activo",
        uid_restaurante:uid,
        descripcion:descripcion,
        precio: Precio,
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Adicionado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-producto-carta').modal("toggle");
          })
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });





}

function Click_modificarCarta(ref_id){
    console.log(ref_id)
    var consulta_producto=db.collection('carta').doc(ref_id)
    consulta_producto.get()
    .then(function(doc){
            
                const nombrePlato=doc.data().nombre
                const categoria=doc.data().categoria
                const descripcion=doc.data().descripcion
                const precio=doc.data().precio
                const estado=doc.data().estado
                

                $('.id-modificarCarta').empty()
                $('.id-modificarCarta').append(ref_id)
                $('#modificarCarta-nombrePlato').val(nombrePlato)
                $('#modificarCarta-categoria').val(categoria)
                $('#modificarCarta-descripcion').val(descripcion)
                $('#modificarCarta-precio').val(precio)
                $('#modificarCarta-estado').val(estado)
                // Checks the box
                $('#modal-modificarCarta-producto').modal();

            });
      
}

function UpdatePlatoCarta(){
    console.log("Actualizar el plato")
    ValidarFormularioModificarProductoCarta()
}


function ValidarFormularioModificarProductoCarta(){

    var NombrePlato = document.forms["modificarCartaProductoForm"]["modificarCarta-nombrePlato"].value;
    var categoria = document.forms["modificarCartaProductoForm"]["modificarCarta-categoria"].value;
    
    var Descripcion = document.forms["modificarCartaProductoForm"]["modificarCarta-descripcion"].value;
    var Precio = document.forms["modificarCartaProductoForm"]["modificarCarta-precio"].value;
    var estado=document.forms["modificarCartaProductoForm"]["modificarCarta-estado"].value;
    var ref_id = $(".id-modificarCarta").text(); //preferred

    if(NombrePlato==="" || Precio ===""){
        alert("Debes agregar el nombre de algún plato o el precio")
    }

    var user = firebase.auth().currentUser;
    console.log("documento a modificar")
    console.log(ref_id);
 

    ModificarPlatoCarta(categoria,Precio,NombrePlato,ref_id,estado,Descripcion)

}

function ModificarPlatoCarta(categoria,Precio,nombre,ref_id,estado,descripcion){

    var actualizacion_producto=db.collection('carta').doc(ref_id)
    return actualizacion_producto.update({
        categoria:categoria,
        precio:Precio,
        nombre:nombre,
        estado:estado,
        descripcion:descripcion
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Actualizado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-modificarCarta-producto').modal("toggle");
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}

function EliminarPlatoCarta(){
    var ref_id = $(".id-modificarCarta").text(); // tomo el ID del Documento 
    db.collection('carta').doc(ref_id).delete().then(function(){
        swal({
            title:"Listo",
              text:"Producto Eliminado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-modificarCarta-producto').modal("toggle");
          })

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


}

function subirLogo(){
    var user = firebase.auth().currentUser;
    var nombreRestaurante=user.displayName
    var uid=user.uid
    console.log(uid)
    // obtener la imagen 
    var image= document.getElementById("logo-upload").files[0]

    // verificar el tipo de archivo 
    if(image.type=="image/png" || image.type=="image/jpg" || image.type=="image/jpeg"){

        // obtener nombre de la imagen 
        var ImageName= image.name;
        // dodne se va guardar en firebase 
        var storageRef=firebase.storage().ref(`${uid}/logo.png`)
        // subir la imagen al path seleccionado del storage

        var uploadTask= storageRef.put(image);

        uploadTask.on('state_changed',function(snapshot){
            // Un observador del cambio de estado como el progereso, pausa y resume
            // mirar el progreso de la tarea incluyendo el porcentaje de bits subido 
            var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log(`La subida esta en ${progress}%`)

        },function(error){
            console.log(error)
        },function(){
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                console.log(downloadURL)
                swal({
                    title:"Listo",
                      text:"Imagen Actualizada",
                      icon:"success"
                  
                  }).then(()=>{
                    location.reload()
                  })
            })
        })
    }
    else{
        alert("Ingresa un formato válido para la imagen ")
    }
}

// Funcion que se activa apenas se abre el dashboard y cuando se da click en página

function homePage(){
    getUserData()
    .then(userData=>{
        $(".user-name").text(userData.name)
        
        console.log(userData)
        $("#nombre-restaurante").append(userData.name)
   
        // Hacer Query de restaurante para descargar la información básica 
        var consulta_restaurantes=db.collection('restaurantes').where("uid","==",userData.uid)
        consulta_restaurantes.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                console.log("No es un restaurante debe salir")
                firebase.auth().signOut()
            }
            else{
                querySnapshot.forEach(function(doc){
    
                    const tel=doc.data().tel 
                    const nombre=doc.data().nombre
                    const dir=doc.data().dir 
                    const email=doc.data().email 
                    const clientes=doc.data().clientes 
                    const link=doc.data().nombreRestaurante
                    const estado=doc.data().estado
                    var FechaVencimiento=doc.data().fechaVencimiento
                    FechaVencimientoFormat = dateChanger(FechaVencimiento)
                    
                    VerificarPago(estado,FechaVencimiento,nombre)

                    $(".user-items").append(` 
                    <div class="col-12  col-lg-6 d-inline-flex ">
                    
                        <div class="card mb-3 mt-3 shadow">
                            <img class="card-img-top" src="./assets/img/portada.jpg" alt="Card image cap">
                            <div class="card-body">
                                <div class="row d-flex align-items-center">
                                <i class="material-icons icon-store col-3 col-md-2" >storefront</i>
                                <h5 class="card-title col-9 ml-md-3 " >${userData.name}</h5>
                                <a href="https://almuerza.co/menu/menu.html?restaurante=${link}" class="to-menu" target="_blank">
                                <p class="card-text col-10" ><small class="text-muted small-link" id="linkCopy">https://almuerza.co/menu/menu.html?restaurante=${link}</small></p>
                                </a>
                                <button type="button" class="boton-copy justify-content-end col-1 mr-1" onclick="copyToClipboard('#linkCopy')" data-toggle="popover" title="Popover title" data-content="dd"><i class="material-icons icon " style="font-size:18px; cursor: pointer;">content_copy</i></button>
                                
                                </div>
                                
                            </div>
                
                        </div>
                
                    </div>
                
                    <div class="col-12 col-md-6 col-lg-3 d-inline-flex">
                
                        <div class="card mb-3 mt-3 shadow">
                            
                                <div class="card-body ">

                                    <h5 class="card-title col-12 col-md-12 d-flex justify-content-center" >Código  QR </h5>
                                    <a href="https://almuerza.co/menu/menu.html?restaurante=${link}" class="to-menu" target="_blank">
                                    <div class="row">
                                        <div id="qrcodeInicio" class="col-12 col-sm-6 col-md-12 d-flex justify-content-center"  ></div>
                                        <div  class="col-12 col-sm-6 col-md-12 mt-3">
                                            <small class=" text-justify text-muted">Los siguientes imprimibles te permiten ubicar los códigos en las mesas y puertas</small>
                                        </div>
                                        
                                    </div>
                                    </a>

                      

                                        <div class="row d-flex flex-row-reverse container-descargar-button " >
                                    
                                            <button type="button" class="btn btn-labeled  mt-3 d-flex align-items-center descargar-button" onClick="DescargarPDF()" style="  background: #FB747C; color: white;">
                                                <span class="btn-label"><i class="material-icons icon d-flex align-items-center">get_app</i></span>
                                                <small>Descargar</small>
                                            </button>
                                        </div>
                                 
                                </div>
                            
                
                        </div>
                
                    </div>
                
                    <div class="col-12 col-md-6 col-lg-3 d-inline-flex" >
                
                    <div class="card mb-3 mt-3 shadow">
                        
                        <div class="card-body">
                
                            <h6 class="card-title col-12  d-flex justify-content-center" >Información Básica</h6>
                            <div class="row">
                                <div  class="col-2 d-flex justify-content-center mb-2">
                                    <i class="material-icons icon " style="color:#FB747C;">call</i>
                                </div>
                                <div  class="col-10 mb-2">
                                    <small class=" text-justify text-muted">${tel} </small>
                                </div>
                
                                <div  class="col-2 d-flex justify-content-center mb-2" >
                                    <i class="material-icons icon " style="color:#FB747C;">home</i>
                                </div>
                                <div  class="col-10 mb-2">
                                    <small class=" text-justify text-muted">${dir} </small>
                                </div>
                
                                <div  class="col-2 d-flex justify-content-center mb-2" >
                                    <i class="material-icons icon " style="color:#FB747C;">email</i>
                                </div>
                                <div  class="col-10 mb-2">
                                    <small class=" text-justify text-muted"> ${email}</small>
                                </div>

                                <div  class="col-2 d-flex justify-content-center mb-2" >
                                    <i class="material-icons icon " style="color:#FB747C;">event</i>
                                </div>
                                <div  class="col-10 mb-2">
                                    <small class=" text-justify text-muted"> Vence ${FechaVencimientoFormat}</small>
                                </div>

                                <div  class="col-2 d-flex justify-content-center mb-2" >
                                <i class="material-icons icon " style="color:#FB747C;">payments</i>
                                </div>
                                <div  class="col-10 mb-2">
                                    <small class=" text-justify text-muted"> Estado ${estado}</small>
                                </div>

   
                
                                <div  class="col-4 d-flex justify-content-center mb-2 " >
                                    <h1 id="clientes-activos" >${clientes.length}</h1>
                                </div>
                                <div  class="col-8 mb-2 d-flex align-items-center">
                                    <small class=" text-justify text-muted"> Clientes Activos </small>
                                </div>
                
                
                
                            </div>
                            
                            
                        </div>
                
                    </div>
                
                </div>
                
                
                
                `
                )
    
                var qrcode= new QRCode(document.getElementById("qrcodeInicio"), `https://almuerza.co/menu/menu.html?restaurante=${link}`);
                console.log(qrcode)
                var QRBdom = $($("#qrcodeInicio").find('img')[0])
                var srcDOM = QRBdom.attr("id","imagenQR")
                QRBdom.attr("height","100")
                QRBdom.attr("width","100")
                console.log(srcDOM)
                
                })
    
            }
    
        })
    
        PlaceLogo()
    })
    .catch(error=>{
        console.error(error)
    
        //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html
    
    })
}

// funcion para actualizar los datos del restaurante 
function ActualizarDatos(){

    const direccion = document.forms["restaurant-data"]["direccion"].value;
     const tel= document.forms["restaurant-data"]["tel"].value;

    var actualizarDatos=db.collection('restaurantes').doc(docID)
    return actualizarDatos.update({
        dir:direccion,
        tel:tel
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Datos Actualizados",
              icon:"success"
          
          }).then(function(){
            location.reload()
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}
// cambiar las fechas para legibles 
function dateChanger(date){
    var unidades= date.substring(0,2)
    var decenas= date.substring(3,5)
    var anios=date.substring(6,10)
    return `${decenas}/${unidades}/${anios}`

}

function VerificarPago(estado,fechaDeVencimiento,nombre){

    var today = new Date();
    var nextDate= new Date(fechaDeVencimiento)

    const diffTime= nextDate - today
    const diffDays= Math.ceil(diffTime/(1000*60*60*24))
    console.log(diffDays)

    console.log(diffDays)
    if(estado==='activo' || estado ==='demo'){

    if(diffDays >= 5 ){
        $(".user-items").append(`
        <div class="alert alert-primary col-12" role="alert">
            Hola ${nombre} tienes aún ${diffDays} días de tu periodo ${estado}
        </div>
        `)
        $(".alert-primary").animate({height: "toggle", opacity: "toggle"}, 3000);
    }

    else if(diffDays < 5 && diffDays >=2){
        $(".user-items").append(`
        <div class="alert alert-warning col-12" role="alert">
            Hola ${nombre} te quedan ${diffDays} días de tu periodo ${estado}
        </div>
        `)
    }

    else if(diffDays >=-3){
        $(".user-items").append(`
        <div class="alert alert-danger col-12" role="alert">
           Realiza tu pago la plataforma se vence en ${diffDays} días
        </div>
        `)
    }

    else {
        swal({
            title:"Cuenta inactiva",
              text:`Realiza tu pago para volver a usar la plataforma`,
              icon:"error"
          
          }).then(function(){
            firebase.auth().signOut()
            window.location = '../login.html?modo=entrar'
    
          })
    }

    }
    else{

        swal({
            title:"Cuenta inactiva",
              text:`Realiza tu pago para volver a usar la plataforma`,
              icon:"error"
          
          }).then(function(){
            firebase.auth().signOut()
            window.location = '../login.html?modo=entrar'
    
          })

    }



}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }




  