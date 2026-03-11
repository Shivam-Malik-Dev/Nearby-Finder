from pydantic import BaseModel


class RecommendRequest(BaseModel):

    category: str
    latitude: float
    longitude: float
    radius: int


class PlaceResponse(BaseModel):

    name:str
    distance:float
    rating:float
    open:bool