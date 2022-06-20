from typing import Dict, List
from fastapi import APIRouter, Depends, FastAPI

from backend.db import DatabaseManager, get_database
from backend.db.models import Job
from backend.query import Query

router = APIRouter()
app = FastAPI()

# for debug
@router.get('/example')
async def get_one_example(db: DatabaseManager = Depends(get_database)) -> Job:
    job = await db.get_one_example()
    return job

@router.post('/search')
async def search(query: Query, db: DatabaseManager = Depends(get_database)) -> List[Job]:
    query.str_to_int()
    jobs = await db.search(query)
    return [Job(**job) for job in jobs]
