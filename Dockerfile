FROM alpine:3.17

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --update --no-cache \
tzdata \
bash \
nodejs \
npm

ENV TZ Europe/Paris

COPY ./ /usr/src/app

ENTRYPOINT ["/bin/bash", "run.sh"]