import os
import sys
from pathlib import Path

# database.py reads these at import time; point at a dummy server so the
# app can be imported without a running MongoDB.
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:1")
os.environ.setdefault("DB_NAME", "portfolio_test")
os.environ.setdefault("JWT_SECRET_KEY", "test-only-secret-key-at-least-32-bytes-long")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
