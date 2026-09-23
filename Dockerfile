FROM node:22-alpine

WORKDIR /app

COPY gym-tracker/backend/package.json gym-tracker/backend/package-lock.json ./

RUN npm ci --omit=dev

COPY gym-tracker/backend/ ./

ENV NODE_ENV=production

EXPOSE 5050

CMD ["npm", "start"]
