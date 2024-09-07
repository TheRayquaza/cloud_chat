FROM node:22.6.0-alpine3.19

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY dist .
WORKDIR /home/appuser/app
USER appuser

CMD ["node ws.js"]