import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import {
  CamelCasePlugin,
  Kysely,
  NoResultError,
  PostgresDialect,
  sql,
} from 'kysely'
import { DB } from './schema/types'
import { PostgresError } from 'pg-error-enum'
import { DataDomain, Event } from '../libs/events'
import { DatabaseError, Pool, types } from 'pg'
import { env } from 'src/libs/env'

@Injectable()
export class KyselyService implements OnModuleDestroy {
  private clientPrimary: Kysely<DB>

  constructor() {
    this.clientPrimary = this.createClient(env.DATABASE_URL)
  }

  async onModuleDestroy() {
    await this.clientPrimary.destroy()
  }

  get primary(): Kysely<DB> {
    return this.clientPrimary
  }

  createClient(connectionString: string) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString,
      }),
    })

    return new Kysely<DB>({
      dialect,
      plugins: [
        new CamelCasePlugin({
          maintainNestedObjectKeys: true,
        }),
      ],
    })
  }

  // NOTE: this persists on the db
  async initializeArrayParsers() {
    const enumData = await sql<{ typname: string; typarray: number }>`
      SELECT typname, typarray FROM pg_type
      WHERE typcategory = 'E' AND typarray != 0;
    `
      .execute(this.primary)
      .then(res => res.rows)

    for (const { typarray: typeId } of enumData) {
      types.setTypeParser(typeId, (val: string) => {
        return val === '{}' ? [] : val.slice(1, -1).split(',')
      })
    }
  }

  // NOTE: this persists on the db
  async initializeDateFormatParser() {
    const dateDate = await sql<{ oid: number }>`
      SELECT typname, oid FROM pg_type
      WHERE pg_type.typname='date';
    `
      .execute(this.primary)
      .then(res => res.rows)

    for (const { oid: typeId } of dateDate) {
      types.setTypeParser(typeId, (val: string) => {
        return val
      })
    }
  }

  static proccessError(e: unknown, domain: DataDomain) {
    if (e instanceof NoResultError)
      return new Event(domain, 'NOT_FOUND').setMeta('no data found')

    if (e instanceof DatabaseError) {
      const meta = `${e.code} ${e.message}`

      switch (e.code) {
        case PostgresError.NO_DATA: // 02000: No data found
          return new Event(domain, 'NOT_FOUND').setMeta(meta)
        case PostgresError.T_R_DEADLOCK_DETECTED: // 40P01: Deadlock detected
        case PostgresError.UNIQUE_VIOLATION: // 23505: Unique constraint violation
        case PostgresError.FOREIGN_KEY_VIOLATION: // 23503: Foreign key constraint violation
          return new Event(domain, 'CONFLICT').setMeta(meta)
        case PostgresError.INSUFFICIENT_PRIVILEGE: // 42501: User doesn't have the necessary permissions
        case PostgresError.NOT_NULL_VIOLATION: // 23502: Attempt to insert/update null in a NOT NULL column
        case PostgresError.CHECK_VIOLATION: // 23514: Check constraint violation
        case PostgresError.EXCLUSION_VIOLATION: // 23P01: Exclusion constraint violation
        case PostgresError.STRING_DATA_RIGHT_TRUNCATION: // 22001: String too long for a column
        case PostgresError.NUMERIC_VALUE_OUT_OF_RANGE: // 22003: Numeric value out of range
        case PostgresError.INVALID_TEXT_REPRESENTATION: // 22P02: Invalid input syntax
        case PostgresError.INVALID_PARAMETER_VALUE: // 22023: Invalid parameter value
        case PostgresError.NULL_VALUE_NO_INDICATOR_PARAMETER: // 22002: NULL in disallowed context
        case PostgresError.DIVISION_BY_ZERO: // 22012: Division by zero
        case PostgresError.SYNTAX_ERROR: // 42601: Syntax error
        case PostgresError.LOCK_NOT_AVAILABLE: // 55P03: Resource lock unavailable
        default:
          return new Event('LIBS', 'SERVICE_FAILED').setMeta(meta)
      }
    }
    return e
  }
}
