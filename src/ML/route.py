from fastapi import APIRouter
import joblib
import pandas as pd
import json
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

# Load model and encoders
model = joblib.load("src/ML/click_model.pkl")
label_encoders = joblib.load("src/ML/label_encoders.pkl")

# Load resources
with open("src/ML/resources.json", "r") as f:
    resources = json.load(f)

original_df = pd.json_normalize(resources)

class RecommendationRequest(BaseModel):
    skills: List[str]
    scores: Dict[str, float]

@router.post("/magic-recommend")
def get_recommendations(req: RecommendationRequest):
    user_skills = [skill.lower() for skill in req.skills]  # Normalize to lowercase
    user_scores = {k.lower(): v for k, v in req.scores.items()} if req.scores else {}


    print("✅ Incoming user skills:", user_skills)
    print("📚 Available skills in resources:", original_df['skill'].unique().tolist())

    # Filter resources matching user skills
    filtered = original_df[original_df['skill'].isin(user_skills)].copy()
    print("🔍 Filtered resource count:", len(filtered))

    if filtered.empty:
        print("⚠️ No matching resources found for the given skills.")
        return {"recommendations": []}

    # Add score column based on user_scores (default 0.5)
    filtered['score'] = filtered['skill'].apply(lambda s: user_scores.get(s, 0.5))

    # Add required columns
    filtered['resource_level'] = filtered['level']
    filtered['tags_encoded'] = filtered['tags'].astype(str).apply(lambda x: hash(x) % 10000)

    # Encode categorical features
    for col in ['skill', 'level', 'resource_level', 'type']:
        le = label_encoders[col]
        filtered[f'{col}_encoded'] = le.transform(filtered[col])

    # Extract features and predict click probability
    feature_cols = ['skill_encoded', 'score', 'resource_level_encoded', 'type_encoded', 'tags_encoded']
    features = filtered[feature_cols]
    filtered['click_probability'] = model.predict_proba(features)[:, 1]

    # Return top N recommendations
    top_n = 5
    top_recs = filtered.sort_values(by='click_probability', ascending=False).head(top_n)

    print("🎯 Top recommendations:")
    print(top_recs[["title", "skill", "click_probability"]])

    return {
        "recommendations": top_recs[[
            "title", "skill", "level", "type", "link", "click_probability", "image"
        ]].rename(columns={
            "title": "name",
            "link": "link",
            "level": "category"
        }).to_dict(orient="records")
    }

