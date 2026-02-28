#!/bin/bash
set -e

echo "🏥 Healthcare Analytics Database Setup"
echo "======================================"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

CONTAINER_NAME="healthcare-demo-db"
DB_USER="demo"
DB_PASSWORD="demo123"
DB_NAME="healthcare_demo"
DB_PORT="5433"

# Remove old container + volume
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo -e "${YELLOW}Removing existing container...${NC}"
    docker rm -f $CONTAINER_NAME 2>/dev/null || true
    docker volume rm healthcare_pgdata 2>/dev/null || true
fi

echo -e "${BLUE}Starting PostgreSQL (15-alpine)...${NC}"

docker run -d \
  --name $CONTAINER_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -p $DB_PORT:5432 \
  -v healthcare_pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

echo -e "${BLUE}Waiting for database...${NC}"
sleep 3

for i in {1..30}; do
    if docker exec $CONTAINER_NAME pg_isready -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Database ready${NC}"
        break
    fi
    sleep 1
    echo -n "."
done

echo ""
echo -e "${BLUE}Loading schema...${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < healthcare-schema.sql
echo -e "${GREEN}✓ Schema loaded${NC}"

echo -e "${BLUE}Loading seed data...${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < healthcare-data.sql
echo -e "${GREEN}✓ Seed data loaded${NC}"

echo ""
echo -e "${GREEN}✅ Setup Complete${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Connection:"
echo "postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"
echo ""
echo "Stop:   docker stop $CONTAINER_NAME"
echo "Remove: docker rm -f $CONTAINER_NAME"
echo "Logs:   docker logs $CONTAINER_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"