FROM ubuntu:trusty

# File Author / Maintainer
MAINTAINER Dongho Paul Choi

RUN apt-get update
RUN apt-get install -y graphicsmagick
RUN apt-get install -y imagemagick
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install -y nodejs


# node_modules를 설치하게 소스 폴더로 옴긴다
# 잠시 tmp 캐시 폴더에 저장한다
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# 작업디렉토리를 생성하고 현 소스파일들을 전체를 붙여 넣는다.
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  3000

# Run app using nodemon
CMD ["node", "/src/app.js"]
