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


firebase.auth().onAuthStateChanged(user => {
    if(user) {
        
        pedidosUsuario(user)
        
        $(".restaurants").click(function(){
            misRestaurantes(user)
        })
        
        $(".pedidos").click(function(){
            pedidosUsuario(user)
        })
        
        $(".settings").click(function(){
            misDatos(user)
        })
        $(".icon").css("color","white")
        $(".user-name").append(user.displayName)

    } else {
      console.log("Is the first time dont redirect or Logout")
      $(".icon").css("color","white")
      $(".user-name").empty()
      window.location = '../login.html';
    }
});

$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

function misRestaurantes(user){
    $(".user-items").empty()
    $(".user-items").append(`
    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">restaurant</i> Mis restaurantes  </h3>`)
    consulta_restaurantes=db.collection('restaurantes').where("clientes","array-contains",user.uid)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const name = doc.data().nombre
            const dir = doc.data().dir
            const tel = doc.data().tel
            const nombreRestaurante = doc.data().nombreRestaurante
            $(".user-items").append(`
            <div class="col-12 col-md-6 col-lg-3 d-inline-flex" >
                <div class="card mb-3 mt-3 ">
                    <div class="card-body">
                        <h6 class="card-title col-12  d-flex justify-content-center" >${name}</h6>
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
                            <div  class="col-10 mb-2">
                                <a href=https://almuerza.co/menu/menu.html?restaurante=${nombreRestaurante}><small class="align-items-center d-flex justify-content-center">Menú de hoy</small></a>                                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            `)               
        })
    })
    $("#wrapper").toggleClass("toggled");
}

function pedidosUsuario(user){
    
    consulta_pedidos=db.collection('pedidos').where("uid_cliente","==",user.uid).orderBy("hora_pedido", "desc")
    .onSnapshot(function(querySnapshot) {

        $(".user-items").empty()
        $(".user-items").append(`
        <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">restaurant_menu</i> Mis pedidos  </h3>
        <div class="panel panel-default shadow">
            <div class="table-responsive">
                <table class="table table-hover table">
                    <thead class="thead-dark">
                    <tr class="TablaPedidosHeader">
                        <th scope="col" class="fecha-corner">Fecha</th>
                        <th scope="col">Restaurante</th>
                        <th scope="col">Pedido</th>
                        <th scope="col">Total</th>
                        <th scope="col">Notas</th>
                        <th scope="col" class="fecha-corner" >Estado</th>                    
                    </tr>
                    </thead>
                    <tbody class="TablaPedidosBody">

                    </tbody>
                </table>
                
            </div>
        </div>`)
        
        querySnapshot.forEach(function(doc){
            var fecha = new Date(doc.data().hora_pedido).toLocaleString("es-CO")
            var uid_restaurante = doc.data().uid_restaurante
            var entrada = doc.data().Entradas
            var principio = doc.data().Principio
            var platofuerte = doc.data().PlatoFuerte
            var proteinas = doc.data().Proteinas
            var ensaladas = doc.data().Ensaladas
            var bebida = doc.data().Bebidas
            var total = doc.data().total
            var carta=doc.data().carta
            var notas = doc.data().notas
            var estado = doc.data().estado
            var menu = [entrada, principio, platofuerte, proteinas, ensaladas, bebida]
            var len

            if (platofuerte != undefined){
                len = platofuerte.length
            } else if (entrada != undefined){
                len = entrada.length
            } else if (principio != undefined){
                len = principio.length
            } else if (bebida != undefined){
                len = bebida.length
            } else {
                len = 1
            }
                        
            var consulta_restaurantes=db.collection('restaurantes').where("uid","==",uid_restaurante)
            .onSnapshot(function(querySnapshot) {
                querySnapshot.forEach(function(doc){
                    const name = doc.data().nombre

            function TableDisplay(i, len){
                var pedido ={};
                var menuaux = [];
                                    
                pedido['rs1'] = `
                    <tr>
                    <th rowspan="${len}" scope="rowgroup">${fecha}</th>
                    <th rowspan="${len}" scope="rowgroup"><b>${name}</b></th>`;
                pedido['cartatext'] =`
                    <td>Plato a la carta: ${carta}</td>`; 
                pedido['rs2'] = `
                    <th rowspan="${len}" scope="rowgroup" ><b>${total} </b></th>
                    <th rowspan="${len}" scope="rowgroup" >${notas}</th>
                    <th rowspan="${len}" scope="rowgroup">${estado}</th>`;
                pedido['tr1'] = `
                    <tr>`; 
                pedido['tr2'] =`
                    </tr>`;
                
                for (j =0 ; j < menu.length; j++){
                    if (menu[j] != undefined && menu[j].length != 0){
                    
                    menuaux.push(menu[j][i])
                    
                    pedido['menutext'] = `
                        <td>Menu ${[i+1]}: ${menuaux}</td>`;
                    
                    
                    console.log(menu.length)
                    }
                }
                return pedido
            }
            

            if (carta == "" || carta == undefined) {
                for(i = 0 ; i < len; i++){ 
                    pedido = TableDisplay(i, len);
                    if (i==0) {
                        $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2']))
                    } else {   
                        $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2']))
                    }
                }  
            } else if (platofuerte == "" || platofuerte == undefined){
                pedido = TableDisplay(0, 1);
                $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['cartatext'], pedido['rs2'], pedido['tr2']))
            } else if (len == 1 && carta != "") {
                pedido = TableDisplay(0, 2);
                $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2'], pedido['tr1'], pedido['cartatext'], pedido['tr2']))    
            } else {
                for(i = 0 ; i < len; i++){ 
                    pedido = TableDisplay(i, len+1);
                    if (i==0) {
                        $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2']))
                    } else if (i==len-1) {
                        $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2'], pedido['tr1'], pedido['cartatext'], pedido['tr2']))
                    } else {   
                        $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2']))
                    }
                }
            } 
        })
    })                              
})
})

$("#wrapper").toggleClass("toggled");

}


function misDatos(user){
    $(".user-items").empty()

    console.log("configuracion")

    $(".user-items").append( `

    <h3 class="col-12 d-flex flex-row-reverse" style="font-size:30px; color: #cccccc;"><i class="material-icons icon " style="font-size:30px;">person</i> Mis Datos  </h3>
                        <div class="col-12 mt-2 settings-logo">
                            <form enctype="multipart/form-data" name="user-data">

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
                        var consulta_precio=db.collection('clientes').where("uid","==",user.uid)
                        consulta_precio.get()
                        .then(function(querySnapshot){
                            querySnapshot.forEach(function(doc){
                                // const precio=doc.data().precio
                                docID=doc.id
                                
                                const direccion=doc.data().dir
                                const tel=doc.data().tel

                                document.forms["user-data"]["direccion"].value=direccion;
                                document.forms["user-data"]["tel"].value=tel;
                            })
                        })
    $("#wrapper").toggleClass("toggled");
}

function ActualizarDatos(){

    const direccion = document.forms["user-data"]["direccion"].value;
    const tel= document.forms["user-data"]["tel"].value;

    var actualizarDatos=db.collection('clientes').doc(docID)
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