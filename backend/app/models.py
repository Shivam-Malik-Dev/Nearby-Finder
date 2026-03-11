from sqlalchemy import Column,Integer,String,Float,Boolean
from app.database import Base

class Place(Base):

    __tablename__ = "places"

    id = Column(Integer, primary_key=True,index=True)

    name = Column(String)

    category = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    rating = Column(Float)

    is_open = Column(Boolean)