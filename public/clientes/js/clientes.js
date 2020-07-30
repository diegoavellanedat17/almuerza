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
        
        homePage(user)
        
        $(".restaurants").click(function(){
            homePage(user)
        })
        
        $(".pedidos").click(function(){
        consulta_pedidos=db.collection('pedidos').where("uid_cliente","==",user.uid).orderBy("hora_pedido", "desc")
        .onSnapshot(function(querySnapshot) {
            $(".user-items").empty()
            $(".user-items").append(`
            <div class="table-responsive">
                <table class="table table-hover table table-bordered">
                    <thead class="thead-dark">
                    <tr class="TablaPedidosHeader">
                        <th scope="col">Fecha</th>
                        <th scope="col">Restaurante</th>
                        <th scope="col">Pedido</th>
                        <th scope="col">Notas</th>
                        <th scope="col">Estado</th>                    
                    </tr>
                    </thead>
                    <tbody class="TablaPedidosBody">

                    </tbody>
                </table>
                
            </div>`)
            
            querySnapshot.forEach(function(doc){
                var fecha = new Date(doc.data().hora_pedido).toLocaleString("es-CO")
                var uid_restaurante = doc.data().uid_restaurante
                var entrada = doc.data().Entradas
                var principio = doc.data().Principio
                var platofuerte = doc.data().PlatoFuerte
                var bebida = doc.data().Bebidas
                var carta=doc.data().carta
                var notas = doc.data().notas
                var estado = doc.data().estado
                var menu = [entrada, principio, platofuerte, bebida]
                var len

                if (platofuerte != undefined){
                    len = platofuerte.length
                } else if (entrada != undefined){
                    len = entrada.length
                } else if (principio != undefined){
                    len = principio.length
                } else {
                    len = bebida.length
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
                        
                        
                        console.log(menuaux)
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
                } else if (platofuerte == ""){
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
$(".settings").click(function(){
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    
    console.log("configuracion")

    $(".user-items").append( `Esto está pendiente`)
                

    
});
})
    $(".icon").css("color","white")
    $(".user-name").append(user.displayName)
        
    } else {
      console.log("Is the first time dont redirect or Logout")
      $(".icon").css("color","white")
      $(".user-name").empty()
    }
});

$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

function homePage(user){
    $(".user-items").empty()
    consulta_restaurantes=db.collection('restaurantes').where("clientes","array-contains",user.uid)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const name = doc.data().nombre
            const dir = doc.data().dir
            const tel = doc.data().tel
            $(".user-items").append(`
            <div class="col-12 col-md-6 col-lg-3 d-inline-flex" >
                <div class="card mb-3 mt-3 ">
                    <div class="card-body">
                        <h6 class="card-title col-12  d-flex justify-content-center" >${name}</h6>
                        <div class="row">
                            <div  class="col-2 d-flex justify-content-center mb-2">
                                <i class="material-icons icon " style="color:#CE571B;">call</i>
                            </div>
                            <div  class="col-10 mb-2">
                                <small class=" text-justify text-muted">${tel} </small>
                            </div>
            
                            <div  class="col-2 d-flex justify-content-center mb-2" >
                                <i class="material-icons icon " style="color:#CE571B;">home</i>
                            </div>
                            <div  class="col-10 mb-2">
                                <small class=" text-justify text-muted">${dir} </small>
                            </div>                                             
                        </div>
                    </div>
                </div>
            </div>  
            `)               
        })
    })

}