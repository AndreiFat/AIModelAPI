from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model.Test import Test

app = FastAPI()

# Add your frontend domains here (production + dev)
origins = [
    "http://localhost:3000",               # Dev (Next.js)
    "https://your-nextjs-app.vercel.app",  # Replace with your real frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.post("/predict")
def predict(person: Test):
    print(person)
    if person.bmi > 30 or person.has_diabetes:
        return {"risk": "High"}
    return {"risk": "Low"}