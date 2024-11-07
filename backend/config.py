import os
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# OpenAI configuration
client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")

# CORS settings
cors_settings = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
} 