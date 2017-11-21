FROM node:6.10

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g gulp
RUN npm install

EXPOSE 3000

CMD ["npm","start"]
