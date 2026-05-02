#SERVIDOR PRINCIPAL

from fastapi import FastAPI, Depends                    #framework
from sqlalchemy.orm import Session                      #tipos de sesion
import models, schemas, crud
from database import engine, SessionLocal, Base        #importamos conexion,sesion,base

Base.metadata.create_all(bind=engine)                   #crear tabla automaticamente

#crear la api
app = FastAPI()

#crea una condicion cada que alguien hace una peticion
def get_db():
    db=SessionLocal()  #abre conexion
    try: 
        yield db        #entrega la conexion al endpoint
    finally:
        db.close()      #cierra conexion



#ENDPOINTS -> url accesible
@app.get("/")
def root():
    return{"mensaje" : "Safeligth API funcionando"}

#crear luminarias
@app.post("/luminarias")
def crear(luminaria:schemas.Crear_luminaria, db:Session = Depends(get_db)):
    return crud.crear_luminaria(db,luminaria)   #llama a la logica

#obtener lista
@app.get("/luminarias")
def listar(db:Session = Depends(get_db)):
    return crud.obtenter_luminarias(db)         #llama a la logica

#reportes
@app.post("/reportar/{luminaria_id}")
def reportar(luminaria_id:int, db:Session=Depends(get_db)):
    return crud.reportar_luminarias(db,luminaria_id)

#zonas
@app.get("/zonas")
def zonas(db:Session = Depends(get_db)):
    return crud.obtener_zonas_riesgo(db)

#alertas
@app.get("/alertas")
def alertas(db:Session = Depends(get_db)):
    return crud.generar_alertas(db)

#predicciones
@app.get("/predicciones")
def prediciones(db:Session=Depends(get_db)):
    return crud.predecir_fallas(db)