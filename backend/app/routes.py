from fastapi import APIRouter
from app.schemas import RecommendRequest
from app.recommendation import recommend_places

router = APIRouter()


@router.post("/recommend")
def recommend(data: RecommendRequest):

    results = recommend_places(
        data.category,
        data.latitude,
        data.longitude,
        data.radius
    )

    return results