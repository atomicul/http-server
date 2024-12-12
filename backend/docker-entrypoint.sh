#!/bin/sh

chown -R crow:crow /uploads
exec runuser -u crow "$@"
