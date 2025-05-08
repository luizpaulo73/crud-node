start-db:
	docker-compose up -d dynamodb-local

setup-db:
	node ./setup/setupDynamoDB.js

start-app:
	node server.js

dev: start-db setup-db start-app
