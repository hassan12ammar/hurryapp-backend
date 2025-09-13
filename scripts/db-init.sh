#!/bin/bash

source ./.env
psql "$DATABASE_URL" -f sql/schema.sql
