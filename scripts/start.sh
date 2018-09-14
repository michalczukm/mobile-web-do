#!/usr/bin/env bash
(cd ../`dirname "$0"` && docker-compose -f docker-compose.yml up -d --build)