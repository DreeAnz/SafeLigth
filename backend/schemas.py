#COMO VIAJAN LOS DATOS

from pydantic import BaseModel      #pydantic validas datos automaticamente

#lo que el usuario puede mandar
class Crear_luminaria(BaseModel):
    zona: str
    estado: str
    antiguedad:int

#respuesta de la api
class Respuesta_luminaria(BaseModel):
    id: int
    zona: str
    estado: str
    reportes: int
    antiguedad: int
    
    #permite convertir objetos sqlalchemys en json
    class Config:
        orm_mode = True