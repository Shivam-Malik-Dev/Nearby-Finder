import requests
from geopy.distance import geodesic

def recommend_places(category, latitude, longitude, radius):

    queries = {
        "food": '["amenity"~"restaurant|cafe|fast_food|food_court"]',
        "hospital": '["amenity"="hospital"]',
        "gym": '["leisure"="fitness_centre"]',
        "shopping": '["shop"]',
        "clothes": '["shop"="clothes"]',
        "shoes": '["shop"="shoes"]',
        "hotel": '["tourism"~"hotel|guest_house|motel"]',
        "atm": '["amenity"="atm"]',
        "fuel": '["amenity"="fuel"]'
    }

    tag = queries.get(category, queries["food"])
    radius_meters = radius * 1000

    # Timeout badhaya hai aur query optimize ki hai
    query = f"""
    [out:json][timeout:50];
    (
      node{tag}(around:{radius_meters},{latitude},{longitude});
      way{tag}(around:{radius_meters},{latitude},{longitude});
      relation{tag}(around:{radius_meters},{latitude},{longitude});
    );
    out center;
    """

    url = "https://overpass-api.de/api/interpreter"

    try:
        # Request timeout 60 seconds set kiya hai
        response = requests.get(url, params={"data": query}, timeout=60)

        if response.status_code != 200:
            print(f"API Error: {response.status_code}") # Console mein error dikhega
            return []

        data = response.json()

    except Exception as e:
        print(f"Request failed: {e}")
        return []

    results = []
    user_location = (latitude, longitude)

    for place in data.get("elements", []):
        tags = place.get("tags", {})

        # BIG FIX: Agar naam nahi hai toh usko reject mat karo, default naam de do
        name = tags.get("name") or tags.get("brand") or tags.get("operator") or f"Unnamed {category.capitalize()}"

        lat = place.get("lat") or place.get("center", {}).get("lat")
        lon = place.get("lon") or place.get("center", {}).get("lon")

        if lat and lon:
            distance = geodesic(user_location, (lat, lon)).km
            
            # Ek extra check ki result actually radius ke andar ho
            if distance <= radius:
                results.append({
                    "name": name,
                    "distance": round(distance, 2)
                })

    # Duplicate places remove karne ke liye logic (Kyunki node aur way kabhi kabhi same jagah return karte hain)
    unique_results = []
    seen = set()
    
    # Distance ke hisaab se sort karke duplicate remove karna
    results = sorted(results, key=lambda x: x["distance"])
    
    for r in results:
        # Unique check by Name and Distance
        identifier = f"{r['name']}_{r['distance']}"
        if identifier not in seen:
            seen.add(identifier)
            unique_results.append(r)

    return unique_results[:20]