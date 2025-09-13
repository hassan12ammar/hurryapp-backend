import { HttpStatus } from '@nestjs/common'
type NestedKeys<T> = { [K in keyof T]: keyof T[K] }[keyof T]

const DomainMap = {
  SERVER: {
    INTERNAL: HttpStatus.INTERNAL_SERVER_ERROR,
    DEBUG: HttpStatus.INTERNAL_SERVER_ERROR,
    PAYLOAD_TOO_LARGE: HttpStatus.PAYLOAD_TOO_LARGE,
    ENDPOINT_NOT_FOUND: HttpStatus.NOT_FOUND,
    REQ_TIMEOUT: HttpStatus.REQUEST_TIMEOUT,
  },
  AUTH: {
    UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
    FORBIDDEN: HttpStatus.FORBIDDEN,
    UPDATED_HASH: HttpStatus.FORBIDDEN,
    JWT_INVALID: HttpStatus.UNAUTHORIZED,
    JWT_EXPIRE: HttpStatus.UNAUTHORIZED,
    OTP_INVALID: HttpStatus.BAD_REQUEST,
    TOTP_INVALID: HttpStatus.BAD_REQUEST,
    CREDS_INVALID: HttpStatus.BAD_REQUEST,
    SESSION_NOT_FOUND: HttpStatus.NOT_FOUND,
    OTP_NOT_FOUND: HttpStatus.NOT_FOUND,
    OTP_TOO_MANY_ATTEMPTS: HttpStatus.TOO_MANY_REQUESTS,
    OTP_TOO_MANY_REQUESTS: HttpStatus.TOO_MANY_REQUESTS,
  },
  LIBS: {
    SERVICE_FAILED: HttpStatus.FAILED_DEPENDENCY,
  },
  VALIDATION: {
    BAD_REQUEST: HttpStatus.BAD_REQUEST,
  },
  USER: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    CREATED: HttpStatus.CREATED,
    UPDATED: HttpStatus.OK,
  },
} as const

export type Domain = keyof typeof DomainMap
export type Reason = NestedKeys<typeof DomainMap>

// NOTE: domains that must have the base data reasons needed (NOT_FOUND and CONFLICT)
const DataDomains = ['USER'] as const satisfies Domain[]
export type DataDomain = (typeof DataDomains)[number]

export class Event<D extends Domain> {
  domain: Domain
  reason: Reason
  statusCode: number
  message?: string
  meta?: string

  constructor(domain: D, reason: keyof (typeof DomainMap)[D]) {
    this.domain = domain
    this.reason = reason as Reason
    this.statusCode = DomainMap[domain][reason] as number
  }

  get key() {
    return `${this.domain}_${this.reason}`
  }

  setMeta(meta: any) {
    this.meta = meta
    return this
  }

  json() {
    return {
      statusCode: this.statusCode,
      key: this.key,
      meta: this.meta,
    }
  }
}
