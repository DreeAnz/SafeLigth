#BASE DE DATOS CREACION Y CONEXION  

from sqlalchemy import create_engine                            #importar la funcion para conectar la BD
from sqlalchemy.ext.declarative import declarative_base         #crear clases que representan tablas
from sqlalchemy.orm import sessionmaker                         #crea sesiones (conexiones activas a la BD en de hacer SELECT)

#Crea un archivo de BD        ///=ruta relativa    ./safe = archivo de BD
DATABASE_URL = "sqlite:///./safeligth.db"

#crear la base de datos
#engine = conexion a la BD
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread":False})

#sesiones para  comunicarse con la BD
SessionLocal = sessionmaker(bind=engine)

#las tablas van a heredar de aqui
Base = declarative_base()