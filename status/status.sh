#!/bin/bash
xargs -n1 -P 10 curl -o /dev/null --silent --head --write-out '%{url_effective};%{http_code};%{time_total}\n' < sites | sort | tee status
date +%s > timestamp
