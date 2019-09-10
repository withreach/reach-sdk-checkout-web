FROM node

RUN apt-get update \
    && apt-get install -y \
        python3-pip \
    && pip3 install --upgrade pip \
    && apt-get clean

RUN pip3 --no-cache-dir install --upgrade awscli boto boto3

ENV HOME .