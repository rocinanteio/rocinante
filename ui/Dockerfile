FROM node:18 as Build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
COPY ./.next /.next
COPY ./node_modules /node_modules

FROM node:alpine

COPY ./package.json .
COPY ./package-lock.json .
COPY ./next.config.js .
COPY ./public ./public
COPY --from=Build ./.next /.next
COPY --from=Build ./node_modules /node_modules

EXPOSE 4001

CMD API_URL=${API_URL} npm start
