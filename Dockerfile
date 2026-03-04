FROM node:20.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20.14.0-alpine AS runner

WORKDIR /app

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# Bỏ dòng copy public nếu không có folder này
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]