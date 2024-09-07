FROM node:20.12-alpine3.19

ENV ARTIFACT_ID="xxx"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && apk add --no-cache bash curl
WORKDIR /home/appuser/app

RUN curl https://api.github.com/repos/TheRayquaza/loqui_chat/actions/artifacts/${ARTIFACT_ID} --output ws.zip && unzip ws.zip && rm ws.zip

USER appuser

CMD ["node ws/ws.js"]