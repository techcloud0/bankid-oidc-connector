FROM node:10.15

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm ci

RUN echo '{\n\
"https": false\n\
}\n'\
> /usr/src/app/config.custom.json

RUN npm run build

RUN cp dist/js/connector.bundle.min.js src/main/public/js/

EXPOSE 3000

CMD ["npm","start"]
