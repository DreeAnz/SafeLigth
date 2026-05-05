//ponemos la direccion del bakend en una const
console.log("corriendo app");
const API = "http://localhost:8000"; //ruta del backend


//crear mapa
const map= L.map('map').setView([25.67, -100.31], 13); //L = objeto de leaflet

//crear imag del mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'Map data'
}).addTo(map);

//el mapa aparece desde la posicion del usuario
navigator.geolocation.getCurrentPosition(pos =>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    //se ponen lat y long del usuario en el mapa
    map.setView([lat,lon],15);

    L.marker([lat,lon])
        .addTo(map)
        .bindPopup("📍Estás aquí")
        .openPopup();
});


//crear luminarias en el mapa ----------------------------------------------------
map.on("click", async function(e) {
    const zona = prompt("Ingresa la zona");
    const estado = "ok";

    if(!zona) return;

    try{
        await fetch(`${API}/luminarias`,{
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: json.stringify({
                zona:zona,
                estado:estado,
                antiguedad:0
            })
        });
        alert("Luminaria creada");

        location.reload(); //recarga para ver los cambios
    } catch(error){
        console.error("Error al crear la luminaria",error);
    }
});


//Mostrar luminarias
async function cargarLuminarias(){
    console.log("corriendo luminarias");

    try {
        const res = await fetch(`${API}/luminarias`);
        const data = await res.json();

        console.log(data);

        data.forEach(i => {

            const icono = L.icon({
                iconUrl: i.reportes > 2 
                    ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                iconSize: [32, 32]
            });

            L.marker(
                [25.67 + Math.random()/100, -100.31 + Math.random()/100],
                { icon: icono }
            )
            .addTo(map)
            .bindPopup(`Zona: ${i.zona}<br>Reportes: ${i.reportes}`);

        });

        document.getElementById("total").textContent = "Total: " + data.length;

    } catch (error) {
        console.error("Error luminarias:", error);
    }
}

cargarLuminarias();


//Cargar lista de luminarias
async function cargarListaLuminarias(){
    const res =await fetch(`${API}/luminarias`);
    const data = await res.json();

    const lista = document.getElementById("lista-luminarias");

    data.forEach(i =>{
        const li =document.createElement("li");
        li.textContent = `ID:${i.id} | ${i.zona} | rep:${i.reportes} | ant:${i.antiguedad}`;

        lista.appendChild(li);
    });
}
cargarListaLuminarias();

//Mostrar alertas
async function cargarAlertas() {
console.log("corriendo alertas");

    try{
    //pide al backend
    const res = await fetch(`${API}/alertas`);
    const data = await res.json();

    //consigue el id "alertas"
    const lista = document.getElementById("alertas");

    lista.innerHTML="";

    //recorre alertas
    data.forEach(a=>{
        const li = document.createElement("li");    //crea elemento
        li.textContent=a;           //toma el contenido del elemento a y lo pone en li
        lista.appendChild(li);      //agrega el texto a li y lo pone en la lista de alertas
    });
    }catch (error) {
        console.error("Error alertas:", error);
    }
}

cargarAlertas();


//coordenadas simuladas
const coordenadasZonas = {
    "centro": [25.67, -100.31],
    "sur": [25.65, -100.30],
    "norte": [25.70, -100.32],
    "este": [25.67, -100.28],
    "oeste": [25.67, -100.35],
    "suroeste": [25.64, -100.33],
    "noroeste": [25.69, -100.34]
};
//asigna colores al nivel de riesgo
function obtenerColor(riesgo) {
    if (riesgo === "CRITICO") return "red";
    if (riesgo === "ALTO") return "orange";
    if (riesgo === "MEDIO") return "yellow";
    if (riesgo === "BAJO") return "green";
    return "gray";
}


//carga las zonas
async function cargar_zonas() {
console.log("corriendo zonas");

    let criticas=0;
    try{
    //llama al backend
    const res = await fetch(`${API}/zonas`);
    const data = await res.json();

    data.forEach(z =>{
        //coordenadas de las zonas
        const coordenadas = coordenadasZonas[z.zona];

        if (z.riesgo === "CRITICO") criticas++;


        //si hay cordenadas las pone del color segun su riesgo
        if(coordenadas){
            const color = obtenerColor(z.riesgo);

            //dibuja un circulo en el mapa
            L.circle(coordenadas, {
                color: color,               //borde
                fillColor: color,           //color interior
                fillOpacity:0.5,            //transparencia
                radius:200                  //tamaño
            })

            .addTo(map)
            //saldra ventana con zona, riesgo y cant de reportes
            .bindPopup(`
                Zona: ${z.zona}<br>
                Riesgo: ${z.riesgo}<br>
                Reportes: ${z.reportes}<br>
                `);
        }
    });
    document.getElementById("zonas").textContent = "Zonas críticas: " + criticas;

    }
    catch (error) {
        console.error("Error zonas:", error);
    }
}

cargar_zonas();