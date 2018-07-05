#!/bin/sh

BRANCH=$1
PR=$2
TAG=$3

if [ x"" != x$PR ]; then
	echo Skipping docker image build for the pull request
	exit 0
fi

if [ xnext == x$BRANCH ]; then
	IMAGEVERSION=next;
elif [ xmaster == x$BRANCH ]; then
	IMAGEVERSION=latest
else
	echo Don\'t know, how to build for branch $BRANCH
fi

docker build -t mdg:$IMAGEVERSION .

if [ x"" != x$TAG ]; then
	docker tag mdg$IMAGEVERSION mdg:$TAG
fi