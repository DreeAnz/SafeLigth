//ponemos la direccion del bakend en una const
console.log("corriendo app");


const API = "http://localhost:8000"; //ruta del backend

//crear mapa
const map= L.map('map').setView([25.67, -100.31], 13); //L = objeto de leaflet

//crear imag del mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'Map data'
}).addTo(map);


//Mostrar luminarias
async function cargarLuminarias(){
    console.log("corriendo luminarias");

    try {
        const res = await fetch(`${API}/luminarias`);
        const data = await res.json();

        console.log(data);

        data.forEach(i => {
            L.marker([25.67 + Math.random()/100, -100.31 + Math.random()/100]) 
                .addTo(map)
                .bindPopup(`Zona: ${i.zona}<br>Reportes: ${i.reportes}`);
        });

    } catch (error) {
        console.error("Error luminarias:", error);
    }
}
cargarLuminarias();



//Mostrar alertas
async function cargarAlertas() {
console.log("corriendo alertas");

    try{
    //pide al backend
    const res = await fetch(`${API}/alertas`);
    const data = await res.json();

    //consigue el id "alertas"
    const lista = document.getElementById("alertas");

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

    try{
    //llama al backend
    const res = await fetch(`${API}/zonas`);
    const data = await res.json();

    data.forEach(z =>{
        //coordenadas de las zonas
        const coordenadas = coordenadasZonas[z.zona];

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
    }
    catch (error) {
        console.error("Error zonas:", error);
    }
}

cargar_zonas();