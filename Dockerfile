FROM node:22-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
# COPY package-lock.json ./
COPY yarn.lock ./
#RUN npm ci --silent
# RUN npm install
RUN yarn install --force
#react-scripts@3.4.1 -g --silent
COPY . ./
# RUN npm run build
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80



CMD ["nginx", "-g", "daemon off;"]