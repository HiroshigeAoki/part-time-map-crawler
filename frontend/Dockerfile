FROM node:18

WORKDIR /code/frontend/

COPY ./package*.json ./

RUN npm install
# RUN npm install --only=production

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]