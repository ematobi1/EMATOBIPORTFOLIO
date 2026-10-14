from fastapi.testclient import TestClient

from auth import AuthService
from server import app

# Not used as a context manager, so startup (DB init) does not run.
client = TestClient(app)


def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_root_lists_endpoints():
    resp = client.get("/api/")
    assert resp.status_code == 200
    assert "health" in resp.json()["endpoints"]


def test_admin_routes_require_auth():
    resp = client.get("/api/contacts")
    assert resp.status_code in (401, 403)


def test_password_hashing_round_trip():
    hashed = AuthService.hash_password("s3cret-pass")
    assert hashed != "s3cret-pass"
    assert AuthService.verify_password("s3cret-pass", hashed)
    assert not AuthService.verify_password("wrong", hashed)


def test_jwt_round_trip():
    token = AuthService.create_access_token({"sub": "user-1", "email": "a@b.co", "role": "admin"})
    payload = AuthService.verify_token(token)
    assert payload["sub"] == "user-1"
