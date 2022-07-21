#!/bin/bash

apt-get update
apt-get -y install cron
crontab -l | { cat; echo "0 3 * * * bash /code/backend/crawl.sh"; } | crontab -
cron -f
chmod +x crawl.sh
bash crawl.sh