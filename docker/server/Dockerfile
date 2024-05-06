FROM node:20.12-alpine3.19

ENV ARTIFACT_ID="xxx"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && apk add --no-cache bash curl unzip
WORKDIR /home/appuser/app

RUN curl https://api.github.com/repos/TheRayquaza/loqui_chat/actions/artifacts/${ARTIFACT_ID} --output server.zip && unzip server.zip && rm server.zip

USER appuser

CMD ["node server/app.js"]