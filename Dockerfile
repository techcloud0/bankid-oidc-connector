FROM node:6.10

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g gulp
RUN npm install

RUN echo '{\n\
"https": false\n\
}\n'\
> /usr/src/app/config.custom.json

EXPOSE 3000

CMD ["npm","start"]
