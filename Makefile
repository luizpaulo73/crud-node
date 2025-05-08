start:
	docker-compose up --build -d

setup-db:
	docker exec app-node node ./setup/setupDynamoDB.js

restart-app:
	docker-compose restart app

stop:
	docker-compose down

logs:
	docker-compose logs -f app

dev: start setup-db logs
