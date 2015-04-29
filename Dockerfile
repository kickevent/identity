FROM nodejs
VOLUME /code
WORKDIR /code
EXPOSE 4000
ENTRYPOINT cp src/config/config.js.docker src/config/config.js \
  && npm install \
  && node src/server.js
