#!/bin/bash

bun kysely-codegen \
    --env-file ".env" \
    --out-file "./src/kysely/schema/types.ts" \
    --camel-case true \
    --dialect postgres --runtime-enums --camel-case
