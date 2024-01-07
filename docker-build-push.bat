docker build -f Dockerfile -t ghcr.io/softsquare-eas/arms-api:prod -t ghcr.io/softsquare-eas/arms-api:staging .
docker push ghcr.io/softsquare-eas/arms-api:prod
docker push ghcr.io/softsquare-eas/arms-api:staging
pause