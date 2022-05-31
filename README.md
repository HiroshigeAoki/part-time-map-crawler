# part-time-map

タウンワークなどのバイト情報をGoogle Map上にプロットして探しやすくするWebサイトです。

# Docker(Backend)

```
git clone https://github.com/HiroshigeAoki/part-time-map.git
cat example.env > .env
docker compose -f "docker-compose.yml" up -d --build
```
検証ページ
http://localhost:8000/docs#/
http://localhost:8000/redoc
