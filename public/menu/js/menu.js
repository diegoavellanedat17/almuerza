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
  numero_almuerzos=0;
  numero_platos_carta=0;


VerificarExistenciarestaurante()
VerificarDia()

function VerificarExistenciarestaurante(){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryRestaurante = urlParams.get('restaurante');
    const dia_actual=VerificarDia()
    const dias_semana = ["Lunes", "Martes", "Miercoles","Jueves","Viernes","Sábado","Domingo"];
    var consulta_restaurantes=db.collection('restaurantes').where("nombreRestaurante","==",QueryRestaurante)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            alert("Ingresa un restaurante válido") 
        }
        else{

            $("#button_pedir").css("display","block")



            querySnapshot.forEach(function(doc){

                
                var nombreRestaurante=doc.data().nombre
                uid_restaurante=doc.data().uid

                // Colocar el logo del restaurante si existe 
                LocateLogo(uid_restaurante,nombreRestaurante)

                var vista_menu=db.collection('menu').where("uid_restaurante","==",uid_restaurante)
                vista_menu.get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){
                        alert('Aun no hay un menú creado')
                    }
                    else{

                        querySnapshot.forEach(function(doc){
                            const categoria=doc.data().categoria
                            const nombre=doc.data().nombre
                            const descripcion=doc.data().descripcion
                            const estado= doc.data().estado
                            var categoriaFix = categoria.replace(/\s/g, '');
                            var dias= doc.data().dia
        
                            

                        if(dias[dia_actual]===true && estado==='activo'){    

                            if($("#" + categoriaFix).length == 0) {
                                //si no existe esa categoria debe crearse
                             if (categoriaFix === 'Entradas' || categoriaFix === 'Principio'){
                                // $(`
                                // <div class="col-12 col-md-6 clase-categoria" id="${categoriaFix}">
                                //         <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                //         <h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                //         <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>
                                // </div>`).insertAfter( "#tituloAlmuerzos" );


                                
                                $(`

                                <h5 class="categoria-name mt-3 ">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                
                                `).insertAfter( ".centro-restaurante-first" );
    
                             }
                             else if(categoriaFix === 'PlatoFuerte'){
                               
                                $(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                
                                `).insertAfter( ".centro-restaurante-second" );

                             }

                             else{


                                $(".centro-restaurante").append(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body clase-categoria" id="${categoriaFix}">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                  </div>
                                
                                `)
                             }
                              }
            
                            else{
                                //   $(`#${categoriaFix}`).append(`<h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                //                                         <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>`)

                                $(`#${categoriaFix}`).append(`   

                                <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu">${nombre}</h5>
                                <p class="card-text">${descripcion}</p>   
                                
                                `)
                              }
                            }


                        })
  
                    }
                })

                var consulta_precio=db.collection('restaurantes').where("uid","==",uid_restaurante)
                consulta_precio.get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        precio=doc.data().precio
                     

                        $(".precio-restaurant").append(` $ ${precio}`)


                    })
                })




                


                
  
            })
        }

        var vista_carta=db.collection('carta').where("uid_restaurante","==",uid_restaurante)
        vista_carta.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                console.log("No hay productos de carta ")
            }
            else{
                $(".centro-restaurante").append(`<h5 class="title-menu-carta col-12 d-flex justify-content-center  mt-5">Carta del restaurante <i class="material-icons icon">restaurant </i></h5>`)
                 
                querySnapshot.forEach(function(doc){
                    const categoria=doc.data().categoria
                    const nombre=doc.data().nombre
                    const descripcion=doc.data().descripcion
                    const precio= doc.data().precio
                    const estado= doc.data().estado
                   
                    var categoriaFix = categoria.replace(/\s/g, '');
    
                    if(estado==='activo'){  
                        if($(`#${categoriaFix}Carta`).length == 0) {
                            //si no existe esa categoria debe crearse
                        
                            if (categoriaFix === 'EntradasCarta' || categoriaFix === 'PrincipioCarta'){


                                $(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body" id="${categoriaFix}Carta">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu nombreEnCarta"id="${doc.id}">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                    <p class="card-text precioEnCarta">${precio}</p>
                                  </div>
                                
                                `).insertAfter( ".centro-restaurante-first-carta" );

                                

                            }
                            else if(categoriaFix === 'PlatoFuerteCarta'){
                             
                               $(`

                               <h5 class="categoria-name mt-3">${categoria}</h5>
                               <div class="card shadow" >
                                 <div class="card-body" id="${categoriaFix}Carta">
                                   <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu nombreEnCarta" id="${doc.id}">${nombre}</h5>
                                   <p class="card-text">${descripcion}</p>
                                   <p class="card-text precioEnCarta">${precio}</p>
                                 </div>
                               
                               `).insertAfter( ".centro-restaurante-second-carta" );

                            }
                            else{


                                $(".centro-restaurante").append(`

                                <h5 class="categoria-name mt-3">${categoria}</h5>
                                <div class="card shadow" >
                                  <div class="card-body" id="${categoriaFix}Carta">
                                    <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu nombreEnCarta"id="${doc.id}">${nombre}</h5>
                                    <p class="card-text">${descripcion}</p>
                                    <p class="card-text precioEnCarta">${precio}</p>
                                  </div>
                                
                                `)
                             }

                        }
    
                        else{
                            $(`#${categoriaFix}Carta`).append(`
                            <h5 class="card-title card-title-pretty d-inline-flex pb-2 platoMenu nombreEnCarta"id="${doc.id}">${nombre}</h5>
                            <p class="card-text">${descripcion}</p>   
                            <p class="card-text precioEnCarta">${precio}</p>  
                            `)
                        }
                    }
                })
    
            }
        })
        
    })
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

//Cuando quieran realizar un pedido

document.getElementById("button_pedir").addEventListener("click", function(){
    numero_almuerzos = 0
    numero_platos_carta = 0
    //debe decidirse cual modal mostrar si el de realizar pedido o realizar atenticación, esto depende si hay usuario o no 
    var user = firebase.auth().currentUser;
    console.log(user)
    
    if(user === null){
        $("#modal-usuario").modal()
    }
    else{
        //Debe verificarse que tipo de usuario quiere hacer un pedido, si es un restaurante redirige a restaurantes 
        // Si es un cliente abre el modal de hacer pedido 
        var consulta_precio=db.collection('clientes').where("uid","==",user.uid)
        consulta_precio.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                // Seguramente es un restaurante entonces redirigimos a UvR
                window.location = '../UvR/UvR.html'; //After successful login, user will be redirected to home.html

            }
            querySnapshot.forEach(function(doc){

                if(numero_almuerzos === 0){
                    $(".quitarMenu").remove()
                }

                if(numero_platos_carta === 0){
                    $(".quitarPlatoCarta").remove()
                }
                if(numero_platos_carta=== 0 && numero_almuerzos===0){
                    $(".notas").remove()
                    $(".hacerpedido").css("display","none")
                }
                
                
                const tipo=doc.data().tipo
                console.log(tipo)

                
                if(tipo==='cliente'){
                    $(".modalToHide").css("display","block")
                    $(".modal-body-pedido").css("display","block")
                    $(".btn-group").css("display","block")
                    $(".fieldTotal").remove()
                    $(".atrasBoton").remove()
                    $(".enviarOrden").remove()
                    $(".almuerzoDia").empty()
                    $(".PlatoDeLaCarta").empty()
                   
                    $(".ModalHacerPedido").empty()
                    $("#modal-pedido").modal()
                    $(".adicionarMenuCarta").css("display","block")
                    $(".adicionarMenu").css("display","block")

                }
                else{
                    alert("Comunicate con nosotros en delifast")
                    firebase.auth().signOut()
                }

            })
        })
    }
})

//click en navigation
$(".menu-click").click(function(){
console.log("click en menu")
$(".menu-click").addClass("navigation-select")
$(".carta-click").removeClass("navigation-select")
})

$(".carta-click").click(function(){
    console.log("click en menu")
    $(".carta-click").addClass("navigation-select")
    $(".menu-click").removeClass("navigation-select")
    })


function AdicionarMenu(){
    $(".notas").remove()
    numero_almuerzos++;
    $(".almuerzoDia").append( `       <div style="border-bottom: gray 1px solid;" id="almuerzoTitle${numero_almuerzos}">
                <h5 id="almuerzoTitle">Almuerzo ${numero_almuerzos} </h5>
                    </div>`)
    var categorias = $(".clase-categoria").map(function() { return this.id;});
                    var i;
                    for (i = 0; i < categorias.length; i++) { 

                        $(".almuerzoDia").append( `
                               
                                <div class="form-group col-md-12 ${categorias[i]}${numero_almuerzos}">
                                    <label for="input${categorias[i]}">${categorias[i]} ${numero_almuerzos}</label>
                                    <select id="input${categorias[i]}" class="form-control ${categorias[i]}${numero_almuerzos}class" name="${categorias[i]}${numero_almuerzos}">
                                        <option>Ninguna</option>
                                    </select>
                                </div> `)

                                var platoPorCategoria=$(`#${categorias[i]}`).find(".platoMenu").each(function(){
                                    console.log($( this ).text())
                                    $(`.${categorias[i]}${numero_almuerzos}class`).append(`<option>${$( this ).text()}</option>`)
                                })
                     }
                     $(".PlatoDeLaCarta").append( `   <div class="form-group col-md-12 notas">
                     <label for="notas">Notas</label>
                     <input type="notas" class="form-control" id="notas" placeholder="Notas">
                        </select>
                    </div> `)
                    

    if(numero_almuerzos>0 && $(".quitarMenu").length == 0){
        $(`<button type="button" class="btn btn-outline-danger col-3 quitarMenu modalButton" onclick="QuitarMenu()">Quitar un Menú</button>`).insertAfter(".adicionarMenu")
    }

    if(numero_platos_carta!= 0 || numero_almuerzos!=0){
   
        $(".hacerpedido").css("display","block")
    }

    console.log(`El numero de almuerzos es ${numero_almuerzos}`)

}


function AdicionarPlatoCarta(){
    // la idea es colocar un Dropdown menu con las opciones de platos de la carta
    var platosCartaID= $(".nombreEnCarta").map(function() { return this.id;});
    var platosCartaNombres= $(".nombreEnCarta").map(function() { return $( this ).text();});
    var platosCartaPrecios= $(".precioEnCarta").map(function() { return $( this ).text();});
    
    //se quitan las notas para ponerlas al final 
    $(".notas").remove();
    numero_platos_carta++;

    console.log(`El numero de almuerzos a la carta es ${numero_platos_carta}`)
    $(".PlatoDeLaCarta").append( `       <div style="border-bottom: gray 1px solid;" id="PlatoCarta${numero_platos_carta}">
            <label for="OpcionCarta${numero_platos_carta}" id="almuerzoTitle">Opción ${numero_platos_carta} de la carta</label>
            <select id="OpcionCarta${numero_platos_carta}" class="form-control" name="OpcionCarta${numero_platos_carta}" >
            </select>
        </div>`)
        var i;

        for (i = 0; i < platosCartaNombres.length; i++){
            $(`#OpcionCarta${numero_platos_carta}`).append( `                                
              <option id="${platosCartaPrecios[i]}">${platosCartaNombres[i]} </option>

             `)
        }

        $(".PlatoDeLaCarta").append( `   <div class="form-group col-md-12 notas">
        <label for="notas">Notas</label>
        <input type="notas" class="form-control" id="notas" placeholder="Notas">
           </select>
       </div> `)

       if(numero_platos_carta>0 && $(".quitarPlatoCarta").length == 0){
        $(`<button type="button" class="btn btn-outline-danger col-3 quitarPlatoCarta modalButton" onclick="QuitarPlatoCarta()">Quitar Plato Carta</button>`).insertAfter(".adicionarMenuCarta")
    }

    if(numero_platos_carta!= 0 || numero_almuerzos!=0){
   
        $(".hacerpedido").css("display","block")
    }
    
}

function QuitarPlatoCarta(){

    if (numero_platos_carta >=1){

                    $(`#PlatoCarta${numero_platos_carta}`).remove()
                    console.log(`El numero de Carta quitado es ${numero_platos_carta}`)
                    numero_platos_carta--;
    }

    if(numero_platos_carta === 0){
        $(".quitarPlatoCarta").remove()
    } 

    if(numero_platos_carta=== 0 && numero_almuerzos===0){
        $(".notas").remove()
        $(".hacerpedido").css("display","none")
    }


}

function QuitarMenu(){
    
    if (numero_almuerzos >= 1){

        var categorias = $(".clase-categoria").map(function() { return this.id;});
                    var i;
                    for (i = 0; i < categorias.length; i++) {
                        $(`.${categorias[i]}${numero_almuerzos}`).remove()
                       
                     }
                     $(`#almuerzoTitle${numero_almuerzos}`).remove()
                     console.log(`El numero de almuerzos quitado es ${numero_almuerzos}`)
        numero_almuerzos--;
    }

    if(numero_almuerzos === 0){
        $(".quitarMenu").remove()
    }

    if(numero_platos_carta=== 0 && numero_almuerzos===0){
        $(".notas").remove()
        $(".hacerpedido").css("display","none")

    }
 
}

// Cerrar sesión
function logout(){
    console.log("out")
    firebase.auth().signOut()
    location.reload()

}

// Click en entrar 
function entrar(){
    console.log("entrar")
    $("#modal-usuario").modal()

}




// Agregar boton de pedir 
// Agregar modal de registro o autenticacion

// reciclé la mayoría de tu código en el login.js

const formulario=document.forms['form-register']
const authForm=document.forms['form-auth']
const forgotForm=document.forms['form-forgot']
forgotForm.addEventListener('submit',olvidar_contrasena);
formulario.addEventListener('submit', crearUsuario);
authForm.addEventListener('submit', AutenticarUsuario);

var firstTime=false

function crearUsuario(event){
	event.preventDefault();
	const email = formulario['email'].value;
	const password = formulario['password'].value;
    const name = formulario['name'].value;
    const dir = formulario['dir'].value;
    const tel = formulario['telefono'].value;
    
	// se verifica si no lleno algun campo 
	if (!email || !name || !password || !tel || !dir ){
		console.log('Deben llenarse todos los campos')

		swal({
			title:"Advertencia",
			  text:"Debes llenar todos los campos",
			  icon:"warning"
		  }).then(function(){
            $("#modal-usuario").modal('toggle');
          })
	}

	else{
		console.log(`El usuario que quiere crearse es ${name} con email ${email} y contraseña ${password}`)
		      

		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(result=>{
			result.user.updateProfile({
				displayName: name
			})
			console.log("Entra a creacion de usuario")
			var user = firebase.auth().currentUser;
			console.log(user.emailVerified)
			
			user.sendEmailVerification().then(function() {
				console.log("Enviando correo de Verificacion")
				GuardarInformacionCliente(name,email,password,dir,tel,user.uid)
				// Email sent.

				swal({
					title:"Listo",
					  text:"Revisa tu email y regresa para pedir",
					  icon:"success"
				  
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
    firstTime=false
	event.preventDefault();
	const password = authForm['password'].value;
	const username = authForm['username'].value;
	console.log(`El usuario que quiere entrar es ${username} con  contraseña ${password}`)

  	firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result=>{
    	if(result.user.emailVerified){
            swal({
                title:"Check",
                  text:"Bienvenido",
                  icon:"success"
              
              }).then(function(){
                $("#modal-usuario").modal('toggle');
              })
    	
		}
		
      else{

      	if(confirm("Verifica en tu correo electronico")){
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
    var user = firebase.auth().currentUser;
    console.log(user)
    $(".icon-login").css("color","white")
    $(".user-name").append(user.displayName)
    $(".user-dropdown").empty()
    $(".user-dropdown").append(
    `
    <button class="dropdown-item" onClick="logout()"><i class="material-icons icon">logout</i>Salir</button>
    <button class="dropdown-item" onClick="user_dashboard()"><i class="material-icons icon">restaurant_menu</i>Mis Pedidos</button>
    <button class="dropdown-item" onClick="address()"><i class="material-icons icon">my_location</i>Cambiar dirección</button>
    
    `
    )
   
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){

    querySnapshot.forEach(function(doc){
         var direccionEntrega= doc.data().dir
         $(".direccion-space").empty()
         $(".direccion-space").append(`<p> ${direccionEntrega}</p>`)
    })

    })
    .catch((error)=>{
        console.log(error)
    })



    
    

  }
  else{
    
    console.log("Is the first time dont redirect or Logout")
    $(".icon-login").css("color","#606060")
    $(".user-name").empty()
    $(".user-dropdown").empty()
    $(".user-dropdown").append(`<button class="dropdown-item" onClick="entrar()"><i class="material-icons icon">login</i>Entrar</button>`)
    $(".direccion-space").empty()
    $(".direccion-space").append(`<p> Inicia Sesión para pedir</p>`)
  }
});

function user_dashboard(){
    window.location = '../clientes/clientes.html'
}

function GuardarInformacionCliente(name,email,password,dir,tel,userUid) {

	console.log('Enviando a base de datos')
    db.collection("clientes").doc().set({
		nombre:name,
        email: email,
        password: password,
        dir:dir,
		tel:tel,
		tipo:'cliente',
		uid:userUid,
	})
    .then(function() {
    console.log("Document successfully written!");
    firebase.auth().signOut()
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
	});
}


function HacerPedido(){
    var total_platos_carta=0
    // Aqui se mostrará el resumen de lo que se piensa pedir
    var categorias = $(".clase-categoria").map(function() { return this.id;});

    if($(".atrasBoton").length == 0){
        $(`<button type="button" class="btn btn-outline-danger col-3 atrasBoton" onclick="Atras()">Atras</button>`).insertAfter(".cerrar")
        $(`<button type="button" class="btn btn-primary col-3 enviarOrden" onclick="EnviarOrden()">Enviar Orden</button>`).insertAfter(".cerrar")
    }

    $(".modalToHide").css("display","none")
    $(".adicionarMenu").css("display","none")
    $(".quitarMenu").css("display","none")
    $(".atrasBoton").css("display","block")
    $(".hacerpedido").css("display","none")
    $(".adicionarMenuCarta").css("display","none")
    $(".quitarPlatoCarta").css("display","none")
    
    $(".enviarOrden").css("display","block")
    
    $(".ModalHacerPedido").css("display","block")
    $(".ModalHacerPedido").empty()

    console.log(`iterar pedido en ${numero_almuerzos}`)

    if(numero_almuerzos >0){

        $(".ModalHacerPedido").append(`
        <h5>Resumen del pedido Menú</h5>
        <table class="table table-sm TablaHacerPedido">
        <thead>
        <tr class="headerTablaHacerPedido">
        
        </tr>
        </thead>

        <tbody class="bodyTablaHacerPedido">


        </tbody>


        
        `)
        $(".headerTablaHacerPedido").empty()
        
        $(".headerTablaHacerPedido").append(`<th scope="col" >Tipo</th>`)

        
        var j;

        for (j = 1; j <= numero_almuerzos; j++) { 
            $(".bodyTablaHacerPedido").append(`  
                                                <tr class="tablaAlmuerzo${j}">
                                                    <th scope="row" >Almuerzo ${j} </th>
    
                                                </tr>
                                                `)
        }
    
        var i;

        for (i = 0; i < categorias.length; i++) { 
            $(".headerTablaHacerPedido").append(`<th scope="col">${categorias[i]}</th>`)
            

            var j;

            for (j = 1; j <= numero_almuerzos; j++) { 
                

                var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
                $(`.tablaAlmuerzo${j}`).append(`
                                                <td > ${valueTable} </td>
                                                `
                    )
            }


        }

    }

    if(numero_platos_carta>0){
        $(".ModalHacerPedido").append(`
        </table>
            <h5>Resumen del pedido Carta</h5>
            <table class="table table-sm TablaHacerPedidoCarta">
            <thead>
            <tr class="headerTablaHacerPedidoCarta">
            
            </tr>
            </thead>

            <tbody class="bodyTablaHacerPedidoCarta">


            </tbody>

        </table>
        
        `)
        $(".headerTablaHacerPedidoCarta").empty()
        $(".headerTablaHacerPedidoCarta").append(`
                <th scope="col" >Tipo</th>
                <th scope="col" >Pedido de Carta</th>`)

        //Recorrer todas las opciones y ponerlas como rows
        PlatosCartaPedidos=[]
        PlatosCartaPrecios=[]
        var i;
        for(i = 1; i <= numero_platos_carta; i++){

        

            var PlatoCartaValue=document.forms["PedidoForm"][`OpcionCarta${i}`].value

            PlatosCartaPedidos.push(PlatoCartaValue)

            //Array de precios

            var SelectedDelForm = document.getElementById(`OpcionCarta${i}`);
            var PlatoHijoSeleccionado = SelectedDelForm.options[SelectedDelForm.selectedIndex].id;
            PlatosCartaPrecios.push(PlatoHijoSeleccionado)
            
        }

        //Pasar a Entero 

        for(var i=0; i<PlatosCartaPrecios.length;i++) PlatosCartaPrecios[i] = parseInt(PlatosCartaPrecios[i], 10);

        console.log(PlatosCartaPrecios)
        // Total de platos de la carta 
      
        total_platos_carta = PlatosCartaPrecios.reduce((a, b) => a + b, 0)
          
        $(".bodyTablaHacerPedidoCarta").append(`  
        <tr >
            <th scope="row" >Carta </th>
            <td id="PedidoDeCarta">${PlatosCartaPedidos} </td>
        </tr>
        `)

    }

    const precio_menus=precio*numero_almuerzos
    const granTotal=precio_menus+total_platos_carta
    console.log(granTotal)
    $( `<div class="fieldTotal"><p class="totalPagar">Total</p> <small class="GranTotal">${granTotal}</small></div>`).insertAfter( ".ModalHacerPedido" );

    var notas=document.forms["PedidoForm"][`notas`].value
    if(notas!=""){
    $( `<p>Notas</p> <small>${notas}</small>`).insertAfter( ".totalPagar" );

    }


  
    
}

function Atras(){
    $(".fieldTotal").remove()
    $(".modalToHide").css("display","block")
    $(".modal-body-pedido").css("display","block")
    $(".adicionarMenu").css("display","block")
    $(".quitarMenu").css("display","block")
    $(".atrasBoton").css("display","none") 
    $(".enviarOrden").css("display","none") 
    $(".hacerpedido").css("display","block")
    $(".adicionarMenuCarta").css("display","block")
    $(".quitarPlatoCarta").css("display","block")

    $(".ModalHacerPedido").css("display","none")
}

function EnviarOrden(){
    var pedido = {};
  
    //Esta funcion escribe en la base de datos de pedidos y tambien hace un append al array 
    // de restaurante con el uiid del cliente. 
    var user = firebase.auth().currentUser
    // pedir la dirección y telefono a la base de datos 
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var direccion= doc.data().dir
            var telefono= doc.data().tel
            var nombre_cliente= doc.data().nombre
            pedido['nombre']=nombre_cliente
            pedido['tel']=telefono
            pedido['dir']=direccion
            
            var PedidoDeCarta=$("#PedidoDeCarta").text()
            var PedidoDeCarta = PedidoDeCarta.split(',');
            var totalpagar=$(".GranTotal").text()
            //se tendrá un array con el nombre de la categoria que tenga la orden 
            var categorias = $(".clase-categoria").map(function() { return this.id;});
            var categoriaPedido=[]
            
            //notas del pedido
            var notas=document.forms["PedidoForm"][`notas`].value
            var i;  
            for (i = 0; i < categorias.length; i++) { 
                // arreglo auxiliar para ingresarle lo que va en cada categoria
                var auxiliar_array=[]
                var j;
                for (j = 1; j <= numero_almuerzos; j++) { 
                    var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
                    auxiliar_array.push(valueTable)
                }


                pedido[`${categorias[i]}`] = auxiliar_array;
            }

            pedido['carta']=PedidoDeCarta
            pedido['uid_cliente']=user.uid
            pedido['uid_restaurante']=uid_restaurante
            pedido['notas']=notas
            pedido['hora_pedido']=Date.now()
            pedido['estado']='ordenado'
            pedido['total']=totalpagar

            

            GuardarPedido(pedido,uid_restaurante,user.uid)
            console.log(pedido)
        })
    })
    .catch(function(err){
        console.log(err)
    })
   
    
}

function GuardarPedido(pedido,uid_restaurante,user_uid) {

	
    db.collection("pedidos").doc().set(pedido)
    .then(function() {
        console.log("Document successfully written!");
        swal({
            title:"Listo",
              text:"Pedido enviado",
              icon:"success"
          
          }).then(()=>{
            $("#modal-pedido").modal('toggle');
            console.log("cerrar modal")
          })
        var consulta_restaurantes=db.collection('restaurantes').where("uid","==",uid_restaurante)
        consulta_restaurantes.get()
        .then(function(querySnapshot){


            querySnapshot.forEach(function(doc){
                    console.log(doc.data())
                    var clientes=doc.data().clientes
                    var doc_restaurante=doc.id
                    if(clientes.includes(user_uid)!= true){
                    clientes.push(user_uid)
                    var actualizacion_clientes=db.collection('restaurantes').doc(doc_restaurante)
                    return actualizacion_clientes.update({
                        clientes: clientes
                    })
                    .then(function(){
                        console.log("metido en restaurantes")
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                }

            })
            
    })
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });

 
    

}

//Cambio de Direccion del usuario 

function address(){
    console.log("cambiar direccion")

   
    var user = firebase.auth().currentUser
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){

        querySnapshot.forEach(function(doc){
            // Mostrar la direccion actual 
            const direccionActual=doc.data().dir
            
            $(".user-direccion-modify").empty()
            $(".user-direccion-modify").append(doc.id)
            $("#direccionInput").val(direccionActual)
            $("#modal-direccion").modal()
        })

    })

}

function cambiar_direccion(){
    var user_doc_id = $(".user-direccion-modify").text(); //preferred
    var direccionNueva= document.forms["DireccionForm"]["direccion"].value;
    var actualizacion_direccion=db.collection('clientes').doc(user_doc_id)
    return actualizacion_direccion.update({
        dir: direccionNueva
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Dirección de envío actualizada",
              icon:"success"
          
          }).then(function(){
            $("#modal-direccion").modal('toggle');
            location.reload();

          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function LocateLogo(uid_restaurante,nombreRestaurante){

    $(".header-portada").append(
        `
        <div class="centered ">
            <div class="image shadow-lg">
            </div>
            <div class="mt-5 row">
                <p class="pide-en col-12">Pide en ${nombreRestaurante}</p>
            </div>
        </div>



        `
    )


    var storageRef = firebase.storage().ref();

    var LogoRef = storageRef.child(`${uid_restaurante}/logo.png`);
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
            $(".image").css("background",`url(${url}) 50% 50% no-repeat`)
            $(".image").css("background-size", "100% auto")
            
        })
        .catch(function(error) {
        console.log(error)
        $(".image").css("background",`url(./assets/img/logo-default.JPG) 50% 50% no-repeat`)
        });
}