import httpx
import os
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyC2uV9-EzVMjuzOh6uooLmmD2-JSmXz3-8")
YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"

async def get_interview_videos(job_title: str, company: str = "") -> list:
    queries = [
        f"{job_title} interview questions answers",
        f"{company} interview experience" if company else f"{job_title} interview preparation",
        f"how to crack {job_title} interview"
    ]
    
    all_videos = []
    
    async with httpx.AsyncClient() as client:
        for query in queries[:2]:
            try:
                params = {
                    "part": "snippet",
                    "q": query,
                    "key": YOUTUBE_API_KEY,
                    "maxResults": 3,
                    "type": "video",
                    "relevanceLanguage": "en",
                    "order": "relevance"
                }
                response = await client.get(YOUTUBE_BASE_URL, params=params)
                data = response.json()
                
                for item in data.get("items", []):
                    video_id = item["id"]["videoId"]
                    title = item["snippet"]["title"]
                    channel = item["snippet"]["channelTitle"]
                    thumbnail = item["snippet"]["thumbnails"]["medium"]["url"]
                    
                    all_videos.append({
                        "title": title,
                        "channel": channel,
                        "thumbnail": thumbnail,
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "embed_url": f"https://www.youtube.com/embed/{video_id}",
                        "query": query
                    })
            except Exception as e:
                print(f"YouTube API error: {e}")
                continue
    
    return all_videos[:4]

async def get_company_prep_videos(company: str, role: str) -> list:
    queries = [
        f"{company} interview process hiring",
        f"{role} at {company} preparation tips"
    ]
    
    videos = []
    async with httpx.AsyncClient() as client:
        for query in queries[:1]:
            try:
                params = {
                    "part": "snippet",
                    "q": query,
                    "key": YOUTUBE_API_KEY,
                    "maxResults": 2,
                    "type": "video",
                    "relevanceLanguage": "en"
                }
                response = await client.get(YOUTUBE_BASE_URL, params=params)
                data = response.json()
                
                for item in data.get("items", []):
                    video_id = item["id"]["videoId"]
                    videos.append({
                        "title": item["snippet"]["title"],
                        "channel": item["snippet"]["channelTitle"],
                        "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                    })
            except Exception as e:
                print(f"Error: {e}")
    
    return videos