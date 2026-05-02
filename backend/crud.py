#LOGICA

from sqlalchemy.orm import Session      
import models, schemas                  #importamos  models y schemas


#recibe loq ue mando el usuario (ubicacion, estado)
def crear_luminaria(db:Session, luminaria: schemas.Crear_luminaria):
    
    #creamos objeto tipo tabla
    nueva = models.Luminaria(
        zona=luminaria.zona,
        estado=luminaria.estado,
        antiguedad=luminaria.antiguedad
    )
    db.add(nueva)           #agregar
    db.commit()             #guardar en la BD
    db.refresh(nueva)       #actualizar el objeto (obtiene id)
    return nueva


#trae todas las luminarias, TODAS
def obtenter_luminarias(db:Session):
    return db.query(models.Luminaria).all() # = SELECT * FROM Luminaria


#reportar una luminaria creada, con su id
def reportar_luminarias(db:Session, luminaria_id:int):
    luminaria = db.query(models.Luminaria).filter(models.Luminaria.id==luminaria_id).first()

    if not luminaria:
        return{"Error": "Luminaria no encontrada"}

    luminaria.reportes += 1
    db.commit()
    db.refresh(luminaria)
    
    return luminaria


#Obtener zonas de riesgo
def obtener_zonas_riesgo(db: Session):
            #       consulta-  tabla-       todo
    luminarias = db.query(models.Luminaria).all()

    #zonas 0
    zonas = {}

    #verifica si existe alguna zona ya esta registrada
    for i in luminarias:
        #si no hay zonas se crean
        if i.zona not in zonas:
            zonas[i.zona] = {
                "total": 0,
                "reportes": 0
            }

        #se añade 1 al total de luminarias
        zonas[i.zona]["total"] += 1
        #suma los reportes
        zonas[i.zona]["reportes"] += i.reportes

    resultado = []

    #zona        datos (total,reportes)
    for zona, data in zonas.items():
        total = data["total"]
        reportes = data["reportes"]

        #nivel se define por los reportes entre el total / if evita divisiones de cero
        nivel = reportes / total if total > 0 else 0

        if nivel > 2:
            riesgo = "CRITICO"
        elif nivel > 1.5:
            riesgo = "ALTO"
        elif nivel > 1:
            riesgo=  "MEDIO"
        elif nivel > 0.5:
            riesgo= "BAJO"
        else:
            riesgo = "NULO"

        #resultado guardado
        resultado.append({
            "zona": zona,
            "riesgo": riesgo,
            "reportes": reportes,
            "total de luminarias":total
        })

    return resultado


# generar alertas
def generar_alertas(db:Session):
    #llamamos el metodo obtener_zonas_riesgo
    zonas = obtener_zonas_riesgo(db)

    alertas=[]

    # for de las zonas (recorre c/zona), si es medio da una alerta y si es alto otra alaerta con num de reportes
    for i in zonas:
        if i["riesgo"] == "CRITICO":
            alertas.append(f"Zona {i['zona']} tiene riesgo CRITICO con {i['reportes']} reportes")
        elif i["riesgo"] == "ALTO":
            alertas.append(f"Zona {i['zona']} tiene riesgo ALTO con {i['reportes']} reportes")
        elif i["riesgo"] == "MEDIO":
            alertas.append(f"Zona {i['zona']} tiene riesgo MEDIO con {i['reportes']} reportes")
        elif i["riesgo"] == "BAJO":
            alertas.append(f"Zona {i['zona']} tiene riesgo BAJO con {i['reportes']} reportes")
    
    return alertas


#posibles fallas
def predecir_fallas(db: Session):
    luminarias = db.query(models.Luminaria).all()

    predicciones = []

    for i in luminarias:
        if i.estado == "ok" and (i.reportes >= 1 or i.antiguedad >= 4):
            predicciones.append({
                "id": i.id,
                "zona": i.zona,
                "mensaje": "Posible falla proxima"
            })

    return predicciones