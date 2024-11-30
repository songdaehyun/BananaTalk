let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
  backendHost = "http://localhost:8080";
} else {
  backendHost =
    "http://todoapplication-backend-dev-song.us-east-1.elasticbeanstalk.com";
}

export const API_BASE_URL = `${backendHost}`;
