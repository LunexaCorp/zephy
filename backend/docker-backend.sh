#!/bin/bash

case "$1" in
  up)
    docker compose up --build -d
    ;;
  down)
    docker compose down
    ;;
  restart)
    docker compose restart
    ;;
  logs)
    docker compose logs -f backend
    ;;
  *)
    echo "Uso: $0 {up|down|restart|logs}"
    exit 1
    ;;
esac
