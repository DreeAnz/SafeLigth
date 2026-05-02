#TABLAS DE LA BD

from sqlalchemy import Column,Integer,String    #se importan tipos de columnas
from database import Base                       #importamos la base de datos que creamos


#Clase luminarias = creando una TABLA 
class Luminaria(Base):
    __tablename__ = "luminarias"

    #columnas de la tabla luminarias                
    id = Column(Integer,primary_key=True,index=True)    #index=mejora busquedas
    zona = Column(String)
    estado = Column(String)         #ok o fallando
    reportes = Column(Integer,default=0) #por defecto esta en 0
    antiguedad= Column(Integer,default=0)