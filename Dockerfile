FROM node:20-bookworm AS base
RUN corepack enable

COPY . /app

WORKDIR /app/server
FROM base AS prod-deps
RUN npm install --omit=dev --frozen-lockfile

FROM base AS build

WORKDIR /app/web-client
RUN npm install --frozen-lockfile
RUN npm run build

WORKDIR /app/atm-client
RUN npm install --frozen-lockfile
RUN npm run build

WORKDIR /app/server
RUN npm install --frozen-lockfile
RUN npm run build

FROM base
COPY --from=prod-deps /app/server/node_modules /app/server/node_modules
COPY --from=build /app/server/dist /app/server/dist
COPY --from=build /app/web-client/dist /app/web-client/dist
COPY --from=build /app/atm-client/dist /app/atm-client/dist
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]