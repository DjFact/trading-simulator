build:
	docker-compose build

rebuild:
	docker-compose stop; docker-compose build; docker-compose up -d; docker-compose ps;

rebuild_nocache:
	docker-compose stop; docker-compose build --no-cache; docker-compose up -d; docker-compose ps;

up:
	docker-compose up -d

down:
	docker-compose stop

ps:
	docker-compose ps
