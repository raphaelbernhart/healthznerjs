FROM node:20.18.3 AS build
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

RUN pnpm install

COPY src ./
COPY tsconfig.production.json ./tsconfig.json
RUN pnpm run build

FROM node:20.18.3-alpine
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

RUN pnpm install --prod --no-lockfile

COPY --from=build /app/dist ./

CMD pnpm run start