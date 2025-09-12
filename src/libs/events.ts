import { HttpStatus } from "@nestjs/common"
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
    UNAUTHORIZED: HttpStatus.UNAUTHORIZED, // NOTE: clients should logout and clear user data when this is recieved
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
  APPUPDATE: {
    VERSION_OUTDATED: 444,
    PLATFORM_INVALID: HttpStatus.BAD_REQUEST,
    BUILD_NUMBER_INVALID: HttpStatus.BAD_REQUEST,
  },
  REGULA: {
    TRANSACTIONID_NOT_FOUND: HttpStatus.NOT_FOUND,
    TRANSACTION_INFO_DATA_NOT_FOUND: HttpStatus.NOT_FOUND,
    FACE_DETECTION_FAILED: HttpStatus.FORBIDDEN,
    FACE_MATCHING_FAILED: HttpStatus.FORBIDDEN,
    LIVENESS_CHECK_FAILED: HttpStatus.FORBIDDEN,
  },
  S3: {
    OBJECT_NOT_FOUND: HttpStatus.NOT_FOUND,
  },
  LIBS: {
    SERVICE_FAILED: HttpStatus.FAILED_DEPENDENCY,
  },
  VALIDATION: {
    BAD_REQUEST: HttpStatus.BAD_REQUEST,
  },
  DEATHCERT: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
  },
  FACEIMAGE: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
  },
  RATIONCARD: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
  },
  // data domains
  CENTER: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    UNREGISTRABLE: HttpStatus.BAD_REQUEST,
    HOUSEHOLD_NOT_UNREGISTRABLE: HttpStatus.BAD_REQUEST,
    MEMBER_NOT_RESETTABLE: HttpStatus.BAD_REQUEST,
  },
  DATASTORE: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  HOUSEHOLD: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    PHONE_CONFLICT: HttpStatus.CONFLICT,
    NEW_MAIN_NOT_SET: HttpStatus.BAD_REQUEST,
    NEW_MAIN_NOT_FOUND: HttpStatus.NOT_FOUND,
    NEW_MAIN_INVALID: HttpStatus.BAD_REQUEST,
    MAIN_NOT_FOUND: HttpStatus.NOT_FOUND,
    UNCLAIMED: HttpStatus.FORBIDDEN,
  },
  EMPLOYEE: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    INACTIVE: HttpStatus.FORBIDDEN,
  },
  AGENT: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    PHONE_CONFLICT: HttpStatus.CONFLICT,
    UNCLAIMED: HttpStatus.FORBIDDEN,
  },
  MEMBER: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    UNSUBMITTED: HttpStatus.BAD_REQUEST,
    HOUSEHOLD_INVALID: HttpStatus.BAD_REQUEST,
    GEOLOCATION_NOT_FOUND: HttpStatus.NOT_FOUND,
  },
  LEGACYHOUSEHOLD: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  LEGACYMEMBER: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  NATIONALIDCARD: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    EXPIRED: HttpStatus.BAD_REQUEST,
  },
  RESIDENCYCARD: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  TICKET: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    MALFORMED: HttpStatus.BAD_REQUEST,
  },
  TICKETTEMPLATE: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  CHECKOUT: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  STATS: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  HISTORY: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
  ROLE: {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
  },
} as const

export type Domain = keyof typeof DomainMap
export type Reason = NestedKeys<typeof DomainMap>

// NOTE: domains that must have the base data reasons needed (NOT_FOUND and CONFLICT)
const DataDomains = [
  "CENTER",
  "HOUSEHOLD",
  "EMPLOYEE",
  "AGENT",
  "MEMBER",
  "LEGACYHOUSEHOLD",
  "LEGACYMEMBER",
  "NATIONALIDCARD",
  "RESIDENCYCARD",
  "DATASTORE",
  "TICKET",
  "TICKETTEMPLATE",
  "CHECKOUT",
  "STATS",
  "HISTORY",
  "ROLE",
] as const satisfies Domain[]
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
