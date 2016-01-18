#!/bin/bash
set -e

to=$1
shift

cont=$(docker run -d "$@")

#code=$(timeout "$to" sudo docker wait "$cont" || true)
#docker kill $cont &> /dev/null
#echo -n 'status: '
#if [ -z "$code" ]; then
#    echo timeout
#else
#    echo exited: $code
#fi

#echo output:
# pipe to sed simply for pretty nice indentation
#sudo docker logs $cont | sed 's/^/\t/'

#sudo docker rm $cont &> /dev/null
