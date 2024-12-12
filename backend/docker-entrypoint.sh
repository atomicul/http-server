#!/bin/sh

mkdir $SAVE_DIRECTORY &&
	chown -R crow:crow $SAVE_DIRECTORY &&
	exec runuser -u crow "$@"
