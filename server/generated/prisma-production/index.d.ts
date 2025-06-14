
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model SellerProgress
 * 
 */
export type SellerProgress = $Result.DefaultSelection<Prisma.$SellerProgressPayload>
/**
 * Model BuyerProgress
 * 
 */
export type BuyerProgress = $Result.DefaultSelection<Prisma.$BuyerProgressPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model MessageAttachment
 * 
 */
export type MessageAttachment = $Result.DefaultSelection<Prisma.$MessageAttachmentPayload>
/**
 * Model Listing
 * 
 */
export type Listing = $Result.DefaultSelection<Prisma.$ListingPayload>
/**
 * Model Activity
 * 
 */
export type Activity = $Result.DefaultSelection<Prisma.$ActivityPayload>
/**
 * Model SellerQuestionnaire
 * 
 */
export type SellerQuestionnaire = $Result.DefaultSelection<Prisma.$SellerQuestionnairePayload>
/**
 * Model PreCloseChecklist
 * 
 */
export type PreCloseChecklist = $Result.DefaultSelection<Prisma.$PreCloseChecklistPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  BROKER: 'BROKER',
  AGENT: 'AGENT',
  SELLER: 'SELLER',
  BUYER: 'BUYER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ListingStatus: {
  ACTIVE: 'ACTIVE',
  UNDER_CONTRACT: 'UNDER_CONTRACT',
  CLOSED: 'CLOSED'
};

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus]


export const DocumentType: {
  EMAIL_AGENT: 'EMAIL_AGENT',
  UPLOADED_DOC: 'UPLOADED_DOC',
  PURCHASE_AGREEMENT: 'PURCHASE_AGREEMENT',
  DUE_DILIGENCE: 'DUE_DILIGENCE',
  PRE_CLOSE_CHECKLIST: 'PRE_CLOSE_CHECKLIST',
  CLOSING_DOCS: 'CLOSING_DOCS',
  NDA: 'NDA',
  FINANCIAL_STATEMENT: 'FINANCIAL_STATEMENT',
  CBR_CIM: 'CBR_CIM',
  PURCHASE_CONTRACT: 'PURCHASE_CONTRACT',
  LISTING_AGREEMENT: 'LISTING_AGREEMENT',
  QUESTIONNAIRE: 'QUESTIONNAIRE',
  AFTER_SALE: 'AFTER_SALE',
  FINANCIAL_DOCUMENTS: 'FINANCIAL_DOCUMENTS'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const DocumentStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]


export const DocumentOperationType: {
  UPLOAD: 'UPLOAD',
  DOWNLOAD: 'DOWNLOAD',
  BOTH: 'BOTH',
  NONE: 'NONE'
};

export type DocumentOperationType = (typeof DocumentOperationType)[keyof typeof DocumentOperationType]


export const MessageStatus: {
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ'
};

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]


export const DocumentCategory: {
  SELLER_UPLOAD: 'SELLER_UPLOAD',
  AGENT_PROVIDED: 'AGENT_PROVIDED',
  BUYER_UPLOAD: 'BUYER_UPLOAD',
  SYSTEM_GENERATED: 'SYSTEM_GENERATED'
};

export type DocumentCategory = (typeof DocumentCategory)[keyof typeof DocumentCategory]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ListingStatus = $Enums.ListingStatus

export const ListingStatus: typeof $Enums.ListingStatus

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

export type DocumentOperationType = $Enums.DocumentOperationType

export const DocumentOperationType: typeof $Enums.DocumentOperationType

export type MessageStatus = $Enums.MessageStatus

export const MessageStatus: typeof $Enums.MessageStatus

export type DocumentCategory = $Enums.DocumentCategory

export const DocumentCategory: typeof $Enums.DocumentCategory

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Documents
 * const documents = await prisma.document.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Documents
   * const documents = await prisma.document.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sellerProgress`: Exposes CRUD operations for the **SellerProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SellerProgresses
    * const sellerProgresses = await prisma.sellerProgress.findMany()
    * ```
    */
  get sellerProgress(): Prisma.SellerProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.buyerProgress`: Exposes CRUD operations for the **BuyerProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BuyerProgresses
    * const buyerProgresses = await prisma.buyerProgress.findMany()
    * ```
    */
  get buyerProgress(): Prisma.BuyerProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messageAttachment`: Exposes CRUD operations for the **MessageAttachment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MessageAttachments
    * const messageAttachments = await prisma.messageAttachment.findMany()
    * ```
    */
  get messageAttachment(): Prisma.MessageAttachmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.listing`: Exposes CRUD operations for the **Listing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Listings
    * const listings = await prisma.listing.findMany()
    * ```
    */
  get listing(): Prisma.ListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.activity`: Exposes CRUD operations for the **Activity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Activities
    * const activities = await prisma.activity.findMany()
    * ```
    */
  get activity(): Prisma.ActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sellerQuestionnaire`: Exposes CRUD operations for the **SellerQuestionnaire** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SellerQuestionnaires
    * const sellerQuestionnaires = await prisma.sellerQuestionnaire.findMany()
    * ```
    */
  get sellerQuestionnaire(): Prisma.SellerQuestionnaireDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.preCloseChecklist`: Exposes CRUD operations for the **PreCloseChecklist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PreCloseChecklists
    * const preCloseChecklists = await prisma.preCloseChecklist.findMany()
    * ```
    */
  get preCloseChecklist(): Prisma.PreCloseChecklistDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Document: 'Document',
    User: 'User',
    SellerProgress: 'SellerProgress',
    BuyerProgress: 'BuyerProgress',
    Message: 'Message',
    MessageAttachment: 'MessageAttachment',
    Listing: 'Listing',
    Activity: 'Activity',
    SellerQuestionnaire: 'SellerQuestionnaire',
    PreCloseChecklist: 'PreCloseChecklist'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "document" | "user" | "sellerProgress" | "buyerProgress" | "message" | "messageAttachment" | "listing" | "activity" | "sellerQuestionnaire" | "preCloseChecklist"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SellerProgress: {
        payload: Prisma.$SellerProgressPayload<ExtArgs>
        fields: Prisma.SellerProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SellerProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SellerProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          findFirst: {
            args: Prisma.SellerProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SellerProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          findMany: {
            args: Prisma.SellerProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>[]
          }
          create: {
            args: Prisma.SellerProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          createMany: {
            args: Prisma.SellerProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SellerProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>[]
          }
          delete: {
            args: Prisma.SellerProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          update: {
            args: Prisma.SellerProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          deleteMany: {
            args: Prisma.SellerProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SellerProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SellerProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>[]
          }
          upsert: {
            args: Prisma.SellerProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProgressPayload>
          }
          aggregate: {
            args: Prisma.SellerProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSellerProgress>
          }
          groupBy: {
            args: Prisma.SellerProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<SellerProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.SellerProgressCountArgs<ExtArgs>
            result: $Utils.Optional<SellerProgressCountAggregateOutputType> | number
          }
        }
      }
      BuyerProgress: {
        payload: Prisma.$BuyerProgressPayload<ExtArgs>
        fields: Prisma.BuyerProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuyerProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuyerProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          findFirst: {
            args: Prisma.BuyerProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuyerProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          findMany: {
            args: Prisma.BuyerProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>[]
          }
          create: {
            args: Prisma.BuyerProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          createMany: {
            args: Prisma.BuyerProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuyerProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>[]
          }
          delete: {
            args: Prisma.BuyerProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          update: {
            args: Prisma.BuyerProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          deleteMany: {
            args: Prisma.BuyerProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuyerProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BuyerProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>[]
          }
          upsert: {
            args: Prisma.BuyerProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerProgressPayload>
          }
          aggregate: {
            args: Prisma.BuyerProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuyerProgress>
          }
          groupBy: {
            args: Prisma.BuyerProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuyerProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuyerProgressCountArgs<ExtArgs>
            result: $Utils.Optional<BuyerProgressCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      MessageAttachment: {
        payload: Prisma.$MessageAttachmentPayload<ExtArgs>
        fields: Prisma.MessageAttachmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageAttachmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageAttachmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          findFirst: {
            args: Prisma.MessageAttachmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageAttachmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          findMany: {
            args: Prisma.MessageAttachmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>[]
          }
          create: {
            args: Prisma.MessageAttachmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          createMany: {
            args: Prisma.MessageAttachmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageAttachmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>[]
          }
          delete: {
            args: Prisma.MessageAttachmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          update: {
            args: Prisma.MessageAttachmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          deleteMany: {
            args: Prisma.MessageAttachmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageAttachmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageAttachmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>[]
          }
          upsert: {
            args: Prisma.MessageAttachmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageAttachmentPayload>
          }
          aggregate: {
            args: Prisma.MessageAttachmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessageAttachment>
          }
          groupBy: {
            args: Prisma.MessageAttachmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageAttachmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageAttachmentCountArgs<ExtArgs>
            result: $Utils.Optional<MessageAttachmentCountAggregateOutputType> | number
          }
        }
      }
      Listing: {
        payload: Prisma.$ListingPayload<ExtArgs>
        fields: Prisma.ListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findFirst: {
            args: Prisma.ListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findMany: {
            args: Prisma.ListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          create: {
            args: Prisma.ListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          createMany: {
            args: Prisma.ListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          delete: {
            args: Prisma.ListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          update: {
            args: Prisma.ListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          deleteMany: {
            args: Prisma.ListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          upsert: {
            args: Prisma.ListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          aggregate: {
            args: Prisma.ListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListing>
          }
          groupBy: {
            args: Prisma.ListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListingCountArgs<ExtArgs>
            result: $Utils.Optional<ListingCountAggregateOutputType> | number
          }
        }
      }
      Activity: {
        payload: Prisma.$ActivityPayload<ExtArgs>
        fields: Prisma.ActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          findFirst: {
            args: Prisma.ActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          findMany: {
            args: Prisma.ActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          create: {
            args: Prisma.ActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          createMany: {
            args: Prisma.ActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          delete: {
            args: Prisma.ActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          update: {
            args: Prisma.ActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          deleteMany: {
            args: Prisma.ActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>[]
          }
          upsert: {
            args: Prisma.ActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityPayload>
          }
          aggregate: {
            args: Prisma.ActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivity>
          }
          groupBy: {
            args: Prisma.ActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivityCountArgs<ExtArgs>
            result: $Utils.Optional<ActivityCountAggregateOutputType> | number
          }
        }
      }
      SellerQuestionnaire: {
        payload: Prisma.$SellerQuestionnairePayload<ExtArgs>
        fields: Prisma.SellerQuestionnaireFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SellerQuestionnaireFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SellerQuestionnaireFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          findFirst: {
            args: Prisma.SellerQuestionnaireFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SellerQuestionnaireFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          findMany: {
            args: Prisma.SellerQuestionnaireFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>[]
          }
          create: {
            args: Prisma.SellerQuestionnaireCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          createMany: {
            args: Prisma.SellerQuestionnaireCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SellerQuestionnaireCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>[]
          }
          delete: {
            args: Prisma.SellerQuestionnaireDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          update: {
            args: Prisma.SellerQuestionnaireUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          deleteMany: {
            args: Prisma.SellerQuestionnaireDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SellerQuestionnaireUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SellerQuestionnaireUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>[]
          }
          upsert: {
            args: Prisma.SellerQuestionnaireUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerQuestionnairePayload>
          }
          aggregate: {
            args: Prisma.SellerQuestionnaireAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSellerQuestionnaire>
          }
          groupBy: {
            args: Prisma.SellerQuestionnaireGroupByArgs<ExtArgs>
            result: $Utils.Optional<SellerQuestionnaireGroupByOutputType>[]
          }
          count: {
            args: Prisma.SellerQuestionnaireCountArgs<ExtArgs>
            result: $Utils.Optional<SellerQuestionnaireCountAggregateOutputType> | number
          }
        }
      }
      PreCloseChecklist: {
        payload: Prisma.$PreCloseChecklistPayload<ExtArgs>
        fields: Prisma.PreCloseChecklistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PreCloseChecklistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PreCloseChecklistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          findFirst: {
            args: Prisma.PreCloseChecklistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PreCloseChecklistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          findMany: {
            args: Prisma.PreCloseChecklistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>[]
          }
          create: {
            args: Prisma.PreCloseChecklistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          createMany: {
            args: Prisma.PreCloseChecklistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PreCloseChecklistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>[]
          }
          delete: {
            args: Prisma.PreCloseChecklistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          update: {
            args: Prisma.PreCloseChecklistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          deleteMany: {
            args: Prisma.PreCloseChecklistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PreCloseChecklistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PreCloseChecklistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>[]
          }
          upsert: {
            args: Prisma.PreCloseChecklistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreCloseChecklistPayload>
          }
          aggregate: {
            args: Prisma.PreCloseChecklistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePreCloseChecklist>
          }
          groupBy: {
            args: Prisma.PreCloseChecklistGroupByArgs<ExtArgs>
            result: $Utils.Optional<PreCloseChecklistGroupByOutputType>[]
          }
          count: {
            args: Prisma.PreCloseChecklistCountArgs<ExtArgs>
            result: $Utils.Optional<PreCloseChecklistCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    document?: DocumentOmit
    user?: UserOmit
    sellerProgress?: SellerProgressOmit
    buyerProgress?: BuyerProgressOmit
    message?: MessageOmit
    messageAttachment?: MessageAttachmentOmit
    listing?: ListingOmit
    activity?: ActivityOmit
    sellerQuestionnaire?: SellerQuestionnaireOmit
    preCloseChecklist?: PreCloseChecklistOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    managing: number
    listings: number
    buyerDocs: number
    sellerDocs: number
    uploadedDocuments: number
    activities: number
    sentMessages: number
    receivedMessages: number
    buyingListings: number
    sellerProgress: number
    buyerProgress: number
    updatedChecklists: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managing?: boolean | UserCountOutputTypeCountManagingArgs
    listings?: boolean | UserCountOutputTypeCountListingsArgs
    buyerDocs?: boolean | UserCountOutputTypeCountBuyerDocsArgs
    sellerDocs?: boolean | UserCountOutputTypeCountSellerDocsArgs
    uploadedDocuments?: boolean | UserCountOutputTypeCountUploadedDocumentsArgs
    activities?: boolean | UserCountOutputTypeCountActivitiesArgs
    sentMessages?: boolean | UserCountOutputTypeCountSentMessagesArgs
    receivedMessages?: boolean | UserCountOutputTypeCountReceivedMessagesArgs
    buyingListings?: boolean | UserCountOutputTypeCountBuyingListingsArgs
    sellerProgress?: boolean | UserCountOutputTypeCountSellerProgressArgs
    buyerProgress?: boolean | UserCountOutputTypeCountBuyerProgressArgs
    updatedChecklists?: boolean | UserCountOutputTypeCountUpdatedChecklistsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountManagingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBuyerDocsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSellerDocsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUploadedDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBuyingListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSellerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SellerProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBuyerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUpdatedChecklistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreCloseChecklistWhereInput
  }


  /**
   * Count Type MessageCountOutputType
   */

  export type MessageCountOutputType = {
    replies: number
    attachments: number
  }

  export type MessageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | MessageCountOutputTypeCountRepliesArgs
    attachments?: boolean | MessageCountOutputTypeCountAttachmentsArgs
  }

  // Custom InputTypes
  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageCountOutputType
     */
    select?: MessageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageAttachmentWhereInput
  }


  /**
   * Count Type ListingCountOutputType
   */

  export type ListingCountOutputType = {
    buyers: number
    documents: number
    sellerProgress: number
    buyerSelectedProgress: number
  }

  export type ListingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyers?: boolean | ListingCountOutputTypeCountBuyersArgs
    documents?: boolean | ListingCountOutputTypeCountDocumentsArgs
    sellerProgress?: boolean | ListingCountOutputTypeCountSellerProgressArgs
    buyerSelectedProgress?: boolean | ListingCountOutputTypeCountBuyerSelectedProgressArgs
  }

  // Custom InputTypes
  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingCountOutputType
     */
    select?: ListingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountBuyersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountSellerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SellerProgressWhereInput
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountBuyerSelectedProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    fileSize: number | null
    stepId: number | null
  }

  export type DocumentSumAggregateOutputType = {
    fileSize: number | null
    stepId: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    type: $Enums.DocumentType | null
    status: $Enums.DocumentStatus | null
    category: $Enums.DocumentCategory | null
    url: string | null
    fileName: string | null
    fileSize: number | null
    operationType: $Enums.DocumentOperationType | null
    stepId: number | null
    sellerId: string | null
    buyerId: string | null
    listingId: string | null
    uploadedAt: Date | null
    downloadedAt: Date | null
    uploadedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    type: $Enums.DocumentType | null
    status: $Enums.DocumentStatus | null
    category: $Enums.DocumentCategory | null
    url: string | null
    fileName: string | null
    fileSize: number | null
    operationType: $Enums.DocumentOperationType | null
    stepId: number | null
    sellerId: string | null
    buyerId: string | null
    listingId: string | null
    uploadedAt: Date | null
    downloadedAt: Date | null
    uploadedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    type: number
    status: number
    category: number
    url: number
    fileName: number
    fileSize: number
    operationType: number
    stepId: number
    sellerId: number
    buyerId: number
    listingId: number
    uploadedAt: number
    downloadedAt: number
    uploadedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    fileSize?: true
    stepId?: true
  }

  export type DocumentSumAggregateInputType = {
    fileSize?: true
    stepId?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    type?: true
    status?: true
    category?: true
    url?: true
    fileName?: true
    fileSize?: true
    operationType?: true
    stepId?: true
    sellerId?: true
    buyerId?: true
    listingId?: true
    uploadedAt?: true
    downloadedAt?: true
    uploadedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    type?: true
    status?: true
    category?: true
    url?: true
    fileName?: true
    fileSize?: true
    operationType?: true
    stepId?: true
    sellerId?: true
    buyerId?: true
    listingId?: true
    uploadedAt?: true
    downloadedAt?: true
    uploadedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    type?: true
    status?: true
    category?: true
    url?: true
    fileName?: true
    fileSize?: true
    operationType?: true
    stepId?: true
    sellerId?: true
    buyerId?: true
    listingId?: true
    uploadedAt?: true
    downloadedAt?: true
    uploadedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    type: $Enums.DocumentType
    status: $Enums.DocumentStatus
    category: $Enums.DocumentCategory
    url: string | null
    fileName: string | null
    fileSize: number | null
    operationType: $Enums.DocumentOperationType
    stepId: number | null
    sellerId: string
    buyerId: string | null
    listingId: string | null
    uploadedAt: Date | null
    downloadedAt: Date | null
    uploadedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    status?: boolean
    category?: boolean
    url?: boolean
    fileName?: boolean
    fileSize?: boolean
    operationType?: boolean
    stepId?: boolean
    sellerId?: boolean
    buyerId?: boolean
    listingId?: boolean
    uploadedAt?: boolean
    downloadedAt?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    status?: boolean
    category?: boolean
    url?: boolean
    fileName?: boolean
    fileSize?: boolean
    operationType?: boolean
    stepId?: boolean
    sellerId?: boolean
    buyerId?: boolean
    listingId?: boolean
    uploadedAt?: boolean
    downloadedAt?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    status?: boolean
    category?: boolean
    url?: boolean
    fileName?: boolean
    fileSize?: boolean
    operationType?: boolean
    stepId?: boolean
    sellerId?: boolean
    buyerId?: boolean
    listingId?: boolean
    uploadedAt?: boolean
    downloadedAt?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    type?: boolean
    status?: boolean
    category?: boolean
    url?: boolean
    fileName?: boolean
    fileSize?: boolean
    operationType?: boolean
    stepId?: boolean
    sellerId?: boolean
    buyerId?: boolean
    listingId?: boolean
    uploadedAt?: boolean
    downloadedAt?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "status" | "category" | "url" | "fileName" | "fileSize" | "operationType" | "stepId" | "sellerId" | "buyerId" | "listingId" | "uploadedAt" | "downloadedAt" | "uploadedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyer?: boolean | Document$buyerArgs<ExtArgs>
    listing?: boolean | Document$listingArgs<ExtArgs>
    uploader?: boolean | Document$uploaderArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      seller: Prisma.$UserPayload<ExtArgs>
      buyer: Prisma.$UserPayload<ExtArgs> | null
      listing: Prisma.$ListingPayload<ExtArgs> | null
      uploader: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.DocumentType
      status: $Enums.DocumentStatus
      category: $Enums.DocumentCategory
      url: string | null
      fileName: string | null
      fileSize: number | null
      operationType: $Enums.DocumentOperationType
      stepId: number | null
      sellerId: string
      buyerId: string | null
      listingId: string | null
      uploadedAt: Date | null
      downloadedAt: Date | null
      uploadedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    buyer<T extends Document$buyerArgs<ExtArgs> = {}>(args?: Subset<T, Document$buyerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    listing<T extends Document$listingArgs<ExtArgs> = {}>(args?: Subset<T, Document$listingArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    uploader<T extends Document$uploaderArgs<ExtArgs> = {}>(args?: Subset<T, Document$uploaderArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly type: FieldRef<"Document", 'DocumentType'>
    readonly status: FieldRef<"Document", 'DocumentStatus'>
    readonly category: FieldRef<"Document", 'DocumentCategory'>
    readonly url: FieldRef<"Document", 'String'>
    readonly fileName: FieldRef<"Document", 'String'>
    readonly fileSize: FieldRef<"Document", 'Int'>
    readonly operationType: FieldRef<"Document", 'DocumentOperationType'>
    readonly stepId: FieldRef<"Document", 'Int'>
    readonly sellerId: FieldRef<"Document", 'String'>
    readonly buyerId: FieldRef<"Document", 'String'>
    readonly listingId: FieldRef<"Document", 'String'>
    readonly uploadedAt: FieldRef<"Document", 'DateTime'>
    readonly downloadedAt: FieldRef<"Document", 'DateTime'>
    readonly uploadedBy: FieldRef<"Document", 'String'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document.buyer
   */
  export type Document$buyerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Document.listing
   */
  export type Document$listingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
  }

  /**
   * Document.uploader
   */
  export type Document$uploaderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    unreadCount: number | null
  }

  export type UserSumAggregateOutputType = {
    unreadCount: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
    managerId: string | null
    unreadCount: number | null
    lastReadAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
    managerId: string | null
    unreadCount: number | null
    lastReadAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    managerId: number
    unreadCount: number
    lastReadAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    unreadCount?: true
  }

  export type UserSumAggregateInputType = {
    unreadCount?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    managerId?: true
    unreadCount?: true
    lastReadAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    managerId?: true
    unreadCount?: true
    lastReadAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    managerId?: true
    unreadCount?: true
    lastReadAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    managerId: string | null
    unreadCount: number
    lastReadAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    managerId?: boolean
    unreadCount?: boolean
    lastReadAt?: boolean
    managedBy?: boolean | User$managedByArgs<ExtArgs>
    managing?: boolean | User$managingArgs<ExtArgs>
    listings?: boolean | User$listingsArgs<ExtArgs>
    buyerDocs?: boolean | User$buyerDocsArgs<ExtArgs>
    sellerDocs?: boolean | User$sellerDocsArgs<ExtArgs>
    uploadedDocuments?: boolean | User$uploadedDocumentsArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    receivedMessages?: boolean | User$receivedMessagesArgs<ExtArgs>
    buyingListings?: boolean | User$buyingListingsArgs<ExtArgs>
    sellerProgress?: boolean | User$sellerProgressArgs<ExtArgs>
    buyerProgress?: boolean | User$buyerProgressArgs<ExtArgs>
    sellerQuestionnaire?: boolean | User$sellerQuestionnaireArgs<ExtArgs>
    updatedChecklists?: boolean | User$updatedChecklistsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    managerId?: boolean
    unreadCount?: boolean
    lastReadAt?: boolean
    managedBy?: boolean | User$managedByArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    managerId?: boolean
    unreadCount?: boolean
    lastReadAt?: boolean
    managedBy?: boolean | User$managedByArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    managerId?: boolean
    unreadCount?: boolean
    lastReadAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "role" | "createdAt" | "updatedAt" | "managerId" | "unreadCount" | "lastReadAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managedBy?: boolean | User$managedByArgs<ExtArgs>
    managing?: boolean | User$managingArgs<ExtArgs>
    listings?: boolean | User$listingsArgs<ExtArgs>
    buyerDocs?: boolean | User$buyerDocsArgs<ExtArgs>
    sellerDocs?: boolean | User$sellerDocsArgs<ExtArgs>
    uploadedDocuments?: boolean | User$uploadedDocumentsArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    receivedMessages?: boolean | User$receivedMessagesArgs<ExtArgs>
    buyingListings?: boolean | User$buyingListingsArgs<ExtArgs>
    sellerProgress?: boolean | User$sellerProgressArgs<ExtArgs>
    buyerProgress?: boolean | User$buyerProgressArgs<ExtArgs>
    sellerQuestionnaire?: boolean | User$sellerQuestionnaireArgs<ExtArgs>
    updatedChecklists?: boolean | User$updatedChecklistsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managedBy?: boolean | User$managedByArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managedBy?: boolean | User$managedByArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      managedBy: Prisma.$UserPayload<ExtArgs> | null
      managing: Prisma.$UserPayload<ExtArgs>[]
      listings: Prisma.$ListingPayload<ExtArgs>[]
      buyerDocs: Prisma.$DocumentPayload<ExtArgs>[]
      sellerDocs: Prisma.$DocumentPayload<ExtArgs>[]
      uploadedDocuments: Prisma.$DocumentPayload<ExtArgs>[]
      activities: Prisma.$ActivityPayload<ExtArgs>[]
      sentMessages: Prisma.$MessagePayload<ExtArgs>[]
      receivedMessages: Prisma.$MessagePayload<ExtArgs>[]
      buyingListings: Prisma.$ListingPayload<ExtArgs>[]
      sellerProgress: Prisma.$SellerProgressPayload<ExtArgs>[]
      buyerProgress: Prisma.$BuyerProgressPayload<ExtArgs>[]
      sellerQuestionnaire: Prisma.$SellerQuestionnairePayload<ExtArgs> | null
      updatedChecklists: Prisma.$PreCloseChecklistPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
      managerId: string | null
      unreadCount: number
      lastReadAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    managedBy<T extends User$managedByArgs<ExtArgs> = {}>(args?: Subset<T, User$managedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    managing<T extends User$managingArgs<ExtArgs> = {}>(args?: Subset<T, User$managingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    listings<T extends User$listingsArgs<ExtArgs> = {}>(args?: Subset<T, User$listingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    buyerDocs<T extends User$buyerDocsArgs<ExtArgs> = {}>(args?: Subset<T, User$buyerDocsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sellerDocs<T extends User$sellerDocsArgs<ExtArgs> = {}>(args?: Subset<T, User$sellerDocsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    uploadedDocuments<T extends User$uploadedDocumentsArgs<ExtArgs> = {}>(args?: Subset<T, User$uploadedDocumentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activities<T extends User$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentMessages<T extends User$sentMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$sentMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedMessages<T extends User$receivedMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    buyingListings<T extends User$buyingListingsArgs<ExtArgs> = {}>(args?: Subset<T, User$buyingListingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sellerProgress<T extends User$sellerProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$sellerProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    buyerProgress<T extends User$buyerProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$buyerProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sellerQuestionnaire<T extends User$sellerQuestionnaireArgs<ExtArgs> = {}>(args?: Subset<T, User$sellerQuestionnaireArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    updatedChecklists<T extends User$updatedChecklistsArgs<ExtArgs> = {}>(args?: Subset<T, User$updatedChecklistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly managerId: FieldRef<"User", 'String'>
    readonly unreadCount: FieldRef<"User", 'Int'>
    readonly lastReadAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.managedBy
   */
  export type User$managedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * User.managing
   */
  export type User$managingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.listings
   */
  export type User$listingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    cursor?: ListingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * User.buyerDocs
   */
  export type User$buyerDocsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.sellerDocs
   */
  export type User$sellerDocsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.uploadedDocuments
   */
  export type User$uploadedDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.activities
   */
  export type User$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    where?: ActivityWhereInput
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    cursor?: ActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * User.sentMessages
   */
  export type User$sentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.receivedMessages
   */
  export type User$receivedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.buyingListings
   */
  export type User$buyingListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    cursor?: ListingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * User.sellerProgress
   */
  export type User$sellerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    where?: SellerProgressWhereInput
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    cursor?: SellerProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SellerProgressScalarFieldEnum | SellerProgressScalarFieldEnum[]
  }

  /**
   * User.buyerProgress
   */
  export type User$buyerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    where?: BuyerProgressWhereInput
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    cursor?: BuyerProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuyerProgressScalarFieldEnum | BuyerProgressScalarFieldEnum[]
  }

  /**
   * User.sellerQuestionnaire
   */
  export type User$sellerQuestionnaireArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    where?: SellerQuestionnaireWhereInput
  }

  /**
   * User.updatedChecklists
   */
  export type User$updatedChecklistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    where?: PreCloseChecklistWhereInput
    orderBy?: PreCloseChecklistOrderByWithRelationInput | PreCloseChecklistOrderByWithRelationInput[]
    cursor?: PreCloseChecklistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PreCloseChecklistScalarFieldEnum | PreCloseChecklistScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model SellerProgress
   */

  export type AggregateSellerProgress = {
    _count: SellerProgressCountAggregateOutputType | null
    _avg: SellerProgressAvgAggregateOutputType | null
    _sum: SellerProgressSumAggregateOutputType | null
    _min: SellerProgressMinAggregateOutputType | null
    _max: SellerProgressMaxAggregateOutputType | null
  }

  export type SellerProgressAvgAggregateOutputType = {
    currentStep: number | null
  }

  export type SellerProgressSumAggregateOutputType = {
    currentStep: number | null
  }

  export type SellerProgressMinAggregateOutputType = {
    id: string | null
    sellerId: string | null
    currentStep: number | null
    selectedListingId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerProgressMaxAggregateOutputType = {
    id: string | null
    sellerId: string | null
    currentStep: number | null
    selectedListingId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerProgressCountAggregateOutputType = {
    id: number
    sellerId: number
    currentStep: number
    completedSteps: number
    selectedListingId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SellerProgressAvgAggregateInputType = {
    currentStep?: true
  }

  export type SellerProgressSumAggregateInputType = {
    currentStep?: true
  }

  export type SellerProgressMinAggregateInputType = {
    id?: true
    sellerId?: true
    currentStep?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerProgressMaxAggregateInputType = {
    id?: true
    sellerId?: true
    currentStep?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerProgressCountAggregateInputType = {
    id?: true
    sellerId?: true
    currentStep?: true
    completedSteps?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SellerProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerProgress to aggregate.
     */
    where?: SellerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProgresses to fetch.
     */
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SellerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SellerProgresses
    **/
    _count?: true | SellerProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SellerProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SellerProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SellerProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SellerProgressMaxAggregateInputType
  }

  export type GetSellerProgressAggregateType<T extends SellerProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateSellerProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSellerProgress[P]>
      : GetScalarType<T[P], AggregateSellerProgress[P]>
  }




  export type SellerProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SellerProgressWhereInput
    orderBy?: SellerProgressOrderByWithAggregationInput | SellerProgressOrderByWithAggregationInput[]
    by: SellerProgressScalarFieldEnum[] | SellerProgressScalarFieldEnum
    having?: SellerProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SellerProgressCountAggregateInputType | true
    _avg?: SellerProgressAvgAggregateInputType
    _sum?: SellerProgressSumAggregateInputType
    _min?: SellerProgressMinAggregateInputType
    _max?: SellerProgressMaxAggregateInputType
  }

  export type SellerProgressGroupByOutputType = {
    id: string
    sellerId: string
    currentStep: number
    completedSteps: JsonValue
    selectedListingId: string | null
    createdAt: Date
    updatedAt: Date
    _count: SellerProgressCountAggregateOutputType | null
    _avg: SellerProgressAvgAggregateOutputType | null
    _sum: SellerProgressSumAggregateOutputType | null
    _min: SellerProgressMinAggregateOutputType | null
    _max: SellerProgressMaxAggregateOutputType | null
  }

  type GetSellerProgressGroupByPayload<T extends SellerProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SellerProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SellerProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SellerProgressGroupByOutputType[P]>
            : GetScalarType<T[P], SellerProgressGroupByOutputType[P]>
        }
      >
    >


  export type SellerProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["sellerProgress"]>

  export type SellerProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["sellerProgress"]>

  export type SellerProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["sellerProgress"]>

  export type SellerProgressSelectScalar = {
    id?: boolean
    sellerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SellerProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sellerId" | "currentStep" | "completedSteps" | "selectedListingId" | "createdAt" | "updatedAt", ExtArgs["result"]["sellerProgress"]>
  export type SellerProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }
  export type SellerProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }
  export type SellerProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | SellerProgress$selectedListingArgs<ExtArgs>
  }

  export type $SellerProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SellerProgress"
    objects: {
      seller: Prisma.$UserPayload<ExtArgs>
      selectedListing: Prisma.$ListingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sellerId: string
      currentStep: number
      completedSteps: Prisma.JsonValue
      selectedListingId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sellerProgress"]>
    composites: {}
  }

  type SellerProgressGetPayload<S extends boolean | null | undefined | SellerProgressDefaultArgs> = $Result.GetResult<Prisma.$SellerProgressPayload, S>

  type SellerProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SellerProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SellerProgressCountAggregateInputType | true
    }

  export interface SellerProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SellerProgress'], meta: { name: 'SellerProgress' } }
    /**
     * Find zero or one SellerProgress that matches the filter.
     * @param {SellerProgressFindUniqueArgs} args - Arguments to find a SellerProgress
     * @example
     * // Get one SellerProgress
     * const sellerProgress = await prisma.sellerProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SellerProgressFindUniqueArgs>(args: SelectSubset<T, SellerProgressFindUniqueArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SellerProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SellerProgressFindUniqueOrThrowArgs} args - Arguments to find a SellerProgress
     * @example
     * // Get one SellerProgress
     * const sellerProgress = await prisma.sellerProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SellerProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, SellerProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressFindFirstArgs} args - Arguments to find a SellerProgress
     * @example
     * // Get one SellerProgress
     * const sellerProgress = await prisma.sellerProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SellerProgressFindFirstArgs>(args?: SelectSubset<T, SellerProgressFindFirstArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressFindFirstOrThrowArgs} args - Arguments to find a SellerProgress
     * @example
     * // Get one SellerProgress
     * const sellerProgress = await prisma.sellerProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SellerProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, SellerProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SellerProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SellerProgresses
     * const sellerProgresses = await prisma.sellerProgress.findMany()
     * 
     * // Get first 10 SellerProgresses
     * const sellerProgresses = await prisma.sellerProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sellerProgressWithIdOnly = await prisma.sellerProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SellerProgressFindManyArgs>(args?: SelectSubset<T, SellerProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SellerProgress.
     * @param {SellerProgressCreateArgs} args - Arguments to create a SellerProgress.
     * @example
     * // Create one SellerProgress
     * const SellerProgress = await prisma.sellerProgress.create({
     *   data: {
     *     // ... data to create a SellerProgress
     *   }
     * })
     * 
     */
    create<T extends SellerProgressCreateArgs>(args: SelectSubset<T, SellerProgressCreateArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SellerProgresses.
     * @param {SellerProgressCreateManyArgs} args - Arguments to create many SellerProgresses.
     * @example
     * // Create many SellerProgresses
     * const sellerProgress = await prisma.sellerProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SellerProgressCreateManyArgs>(args?: SelectSubset<T, SellerProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SellerProgresses and returns the data saved in the database.
     * @param {SellerProgressCreateManyAndReturnArgs} args - Arguments to create many SellerProgresses.
     * @example
     * // Create many SellerProgresses
     * const sellerProgress = await prisma.sellerProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SellerProgresses and only return the `id`
     * const sellerProgressWithIdOnly = await prisma.sellerProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SellerProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, SellerProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SellerProgress.
     * @param {SellerProgressDeleteArgs} args - Arguments to delete one SellerProgress.
     * @example
     * // Delete one SellerProgress
     * const SellerProgress = await prisma.sellerProgress.delete({
     *   where: {
     *     // ... filter to delete one SellerProgress
     *   }
     * })
     * 
     */
    delete<T extends SellerProgressDeleteArgs>(args: SelectSubset<T, SellerProgressDeleteArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SellerProgress.
     * @param {SellerProgressUpdateArgs} args - Arguments to update one SellerProgress.
     * @example
     * // Update one SellerProgress
     * const sellerProgress = await prisma.sellerProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SellerProgressUpdateArgs>(args: SelectSubset<T, SellerProgressUpdateArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SellerProgresses.
     * @param {SellerProgressDeleteManyArgs} args - Arguments to filter SellerProgresses to delete.
     * @example
     * // Delete a few SellerProgresses
     * const { count } = await prisma.sellerProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SellerProgressDeleteManyArgs>(args?: SelectSubset<T, SellerProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SellerProgresses
     * const sellerProgress = await prisma.sellerProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SellerProgressUpdateManyArgs>(args: SelectSubset<T, SellerProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerProgresses and returns the data updated in the database.
     * @param {SellerProgressUpdateManyAndReturnArgs} args - Arguments to update many SellerProgresses.
     * @example
     * // Update many SellerProgresses
     * const sellerProgress = await prisma.sellerProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SellerProgresses and only return the `id`
     * const sellerProgressWithIdOnly = await prisma.sellerProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SellerProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, SellerProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SellerProgress.
     * @param {SellerProgressUpsertArgs} args - Arguments to update or create a SellerProgress.
     * @example
     * // Update or create a SellerProgress
     * const sellerProgress = await prisma.sellerProgress.upsert({
     *   create: {
     *     // ... data to create a SellerProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SellerProgress we want to update
     *   }
     * })
     */
    upsert<T extends SellerProgressUpsertArgs>(args: SelectSubset<T, SellerProgressUpsertArgs<ExtArgs>>): Prisma__SellerProgressClient<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SellerProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressCountArgs} args - Arguments to filter SellerProgresses to count.
     * @example
     * // Count the number of SellerProgresses
     * const count = await prisma.sellerProgress.count({
     *   where: {
     *     // ... the filter for the SellerProgresses we want to count
     *   }
     * })
    **/
    count<T extends SellerProgressCountArgs>(
      args?: Subset<T, SellerProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SellerProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SellerProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SellerProgressAggregateArgs>(args: Subset<T, SellerProgressAggregateArgs>): Prisma.PrismaPromise<GetSellerProgressAggregateType<T>>

    /**
     * Group by SellerProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SellerProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SellerProgressGroupByArgs['orderBy'] }
        : { orderBy?: SellerProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SellerProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSellerProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SellerProgress model
   */
  readonly fields: SellerProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SellerProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SellerProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    selectedListing<T extends SellerProgress$selectedListingArgs<ExtArgs> = {}>(args?: Subset<T, SellerProgress$selectedListingArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SellerProgress model
   */
  interface SellerProgressFieldRefs {
    readonly id: FieldRef<"SellerProgress", 'String'>
    readonly sellerId: FieldRef<"SellerProgress", 'String'>
    readonly currentStep: FieldRef<"SellerProgress", 'Int'>
    readonly completedSteps: FieldRef<"SellerProgress", 'Json'>
    readonly selectedListingId: FieldRef<"SellerProgress", 'String'>
    readonly createdAt: FieldRef<"SellerProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"SellerProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SellerProgress findUnique
   */
  export type SellerProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter, which SellerProgress to fetch.
     */
    where: SellerProgressWhereUniqueInput
  }

  /**
   * SellerProgress findUniqueOrThrow
   */
  export type SellerProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter, which SellerProgress to fetch.
     */
    where: SellerProgressWhereUniqueInput
  }

  /**
   * SellerProgress findFirst
   */
  export type SellerProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter, which SellerProgress to fetch.
     */
    where?: SellerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProgresses to fetch.
     */
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerProgresses.
     */
    cursor?: SellerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerProgresses.
     */
    distinct?: SellerProgressScalarFieldEnum | SellerProgressScalarFieldEnum[]
  }

  /**
   * SellerProgress findFirstOrThrow
   */
  export type SellerProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter, which SellerProgress to fetch.
     */
    where?: SellerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProgresses to fetch.
     */
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerProgresses.
     */
    cursor?: SellerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerProgresses.
     */
    distinct?: SellerProgressScalarFieldEnum | SellerProgressScalarFieldEnum[]
  }

  /**
   * SellerProgress findMany
   */
  export type SellerProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter, which SellerProgresses to fetch.
     */
    where?: SellerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProgresses to fetch.
     */
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SellerProgresses.
     */
    cursor?: SellerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProgresses.
     */
    skip?: number
    distinct?: SellerProgressScalarFieldEnum | SellerProgressScalarFieldEnum[]
  }

  /**
   * SellerProgress create
   */
  export type SellerProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a SellerProgress.
     */
    data: XOR<SellerProgressCreateInput, SellerProgressUncheckedCreateInput>
  }

  /**
   * SellerProgress createMany
   */
  export type SellerProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SellerProgresses.
     */
    data: SellerProgressCreateManyInput | SellerProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SellerProgress createManyAndReturn
   */
  export type SellerProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * The data used to create many SellerProgresses.
     */
    data: SellerProgressCreateManyInput | SellerProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SellerProgress update
   */
  export type SellerProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a SellerProgress.
     */
    data: XOR<SellerProgressUpdateInput, SellerProgressUncheckedUpdateInput>
    /**
     * Choose, which SellerProgress to update.
     */
    where: SellerProgressWhereUniqueInput
  }

  /**
   * SellerProgress updateMany
   */
  export type SellerProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SellerProgresses.
     */
    data: XOR<SellerProgressUpdateManyMutationInput, SellerProgressUncheckedUpdateManyInput>
    /**
     * Filter which SellerProgresses to update
     */
    where?: SellerProgressWhereInput
    /**
     * Limit how many SellerProgresses to update.
     */
    limit?: number
  }

  /**
   * SellerProgress updateManyAndReturn
   */
  export type SellerProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * The data used to update SellerProgresses.
     */
    data: XOR<SellerProgressUpdateManyMutationInput, SellerProgressUncheckedUpdateManyInput>
    /**
     * Filter which SellerProgresses to update
     */
    where?: SellerProgressWhereInput
    /**
     * Limit how many SellerProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SellerProgress upsert
   */
  export type SellerProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the SellerProgress to update in case it exists.
     */
    where: SellerProgressWhereUniqueInput
    /**
     * In case the SellerProgress found by the `where` argument doesn't exist, create a new SellerProgress with this data.
     */
    create: XOR<SellerProgressCreateInput, SellerProgressUncheckedCreateInput>
    /**
     * In case the SellerProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SellerProgressUpdateInput, SellerProgressUncheckedUpdateInput>
  }

  /**
   * SellerProgress delete
   */
  export type SellerProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    /**
     * Filter which SellerProgress to delete.
     */
    where: SellerProgressWhereUniqueInput
  }

  /**
   * SellerProgress deleteMany
   */
  export type SellerProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerProgresses to delete
     */
    where?: SellerProgressWhereInput
    /**
     * Limit how many SellerProgresses to delete.
     */
    limit?: number
  }

  /**
   * SellerProgress.selectedListing
   */
  export type SellerProgress$selectedListingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
  }

  /**
   * SellerProgress without action
   */
  export type SellerProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
  }


  /**
   * Model BuyerProgress
   */

  export type AggregateBuyerProgress = {
    _count: BuyerProgressCountAggregateOutputType | null
    _avg: BuyerProgressAvgAggregateOutputType | null
    _sum: BuyerProgressSumAggregateOutputType | null
    _min: BuyerProgressMinAggregateOutputType | null
    _max: BuyerProgressMaxAggregateOutputType | null
  }

  export type BuyerProgressAvgAggregateOutputType = {
    currentStep: number | null
  }

  export type BuyerProgressSumAggregateOutputType = {
    currentStep: number | null
  }

  export type BuyerProgressMinAggregateOutputType = {
    id: string | null
    buyerId: string | null
    currentStep: number | null
    selectedListingId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BuyerProgressMaxAggregateOutputType = {
    id: string | null
    buyerId: string | null
    currentStep: number | null
    selectedListingId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BuyerProgressCountAggregateOutputType = {
    id: number
    buyerId: number
    currentStep: number
    completedSteps: number
    selectedListingId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BuyerProgressAvgAggregateInputType = {
    currentStep?: true
  }

  export type BuyerProgressSumAggregateInputType = {
    currentStep?: true
  }

  export type BuyerProgressMinAggregateInputType = {
    id?: true
    buyerId?: true
    currentStep?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BuyerProgressMaxAggregateInputType = {
    id?: true
    buyerId?: true
    currentStep?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BuyerProgressCountAggregateInputType = {
    id?: true
    buyerId?: true
    currentStep?: true
    completedSteps?: true
    selectedListingId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BuyerProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuyerProgress to aggregate.
     */
    where?: BuyerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerProgresses to fetch.
     */
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuyerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BuyerProgresses
    **/
    _count?: true | BuyerProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BuyerProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BuyerProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuyerProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuyerProgressMaxAggregateInputType
  }

  export type GetBuyerProgressAggregateType<T extends BuyerProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateBuyerProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuyerProgress[P]>
      : GetScalarType<T[P], AggregateBuyerProgress[P]>
  }




  export type BuyerProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerProgressWhereInput
    orderBy?: BuyerProgressOrderByWithAggregationInput | BuyerProgressOrderByWithAggregationInput[]
    by: BuyerProgressScalarFieldEnum[] | BuyerProgressScalarFieldEnum
    having?: BuyerProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuyerProgressCountAggregateInputType | true
    _avg?: BuyerProgressAvgAggregateInputType
    _sum?: BuyerProgressSumAggregateInputType
    _min?: BuyerProgressMinAggregateInputType
    _max?: BuyerProgressMaxAggregateInputType
  }

  export type BuyerProgressGroupByOutputType = {
    id: string
    buyerId: string
    currentStep: number
    completedSteps: JsonValue
    selectedListingId: string | null
    createdAt: Date
    updatedAt: Date
    _count: BuyerProgressCountAggregateOutputType | null
    _avg: BuyerProgressAvgAggregateOutputType | null
    _sum: BuyerProgressSumAggregateOutputType | null
    _min: BuyerProgressMinAggregateOutputType | null
    _max: BuyerProgressMaxAggregateOutputType | null
  }

  type GetBuyerProgressGroupByPayload<T extends BuyerProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuyerProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuyerProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuyerProgressGroupByOutputType[P]>
            : GetScalarType<T[P], BuyerProgressGroupByOutputType[P]>
        }
      >
    >


  export type BuyerProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["buyerProgress"]>

  export type BuyerProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["buyerProgress"]>

  export type BuyerProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }, ExtArgs["result"]["buyerProgress"]>

  export type BuyerProgressSelectScalar = {
    id?: boolean
    buyerId?: boolean
    currentStep?: boolean
    completedSteps?: boolean
    selectedListingId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BuyerProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "buyerId" | "currentStep" | "completedSteps" | "selectedListingId" | "createdAt" | "updatedAt", ExtArgs["result"]["buyerProgress"]>
  export type BuyerProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }
  export type BuyerProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }
  export type BuyerProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | UserDefaultArgs<ExtArgs>
    selectedListing?: boolean | BuyerProgress$selectedListingArgs<ExtArgs>
  }

  export type $BuyerProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BuyerProgress"
    objects: {
      buyer: Prisma.$UserPayload<ExtArgs>
      selectedListing: Prisma.$ListingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      buyerId: string
      currentStep: number
      completedSteps: Prisma.JsonValue
      selectedListingId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["buyerProgress"]>
    composites: {}
  }

  type BuyerProgressGetPayload<S extends boolean | null | undefined | BuyerProgressDefaultArgs> = $Result.GetResult<Prisma.$BuyerProgressPayload, S>

  type BuyerProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BuyerProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BuyerProgressCountAggregateInputType | true
    }

  export interface BuyerProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BuyerProgress'], meta: { name: 'BuyerProgress' } }
    /**
     * Find zero or one BuyerProgress that matches the filter.
     * @param {BuyerProgressFindUniqueArgs} args - Arguments to find a BuyerProgress
     * @example
     * // Get one BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuyerProgressFindUniqueArgs>(args: SelectSubset<T, BuyerProgressFindUniqueArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BuyerProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BuyerProgressFindUniqueOrThrowArgs} args - Arguments to find a BuyerProgress
     * @example
     * // Get one BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuyerProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, BuyerProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BuyerProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressFindFirstArgs} args - Arguments to find a BuyerProgress
     * @example
     * // Get one BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuyerProgressFindFirstArgs>(args?: SelectSubset<T, BuyerProgressFindFirstArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BuyerProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressFindFirstOrThrowArgs} args - Arguments to find a BuyerProgress
     * @example
     * // Get one BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuyerProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, BuyerProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BuyerProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BuyerProgresses
     * const buyerProgresses = await prisma.buyerProgress.findMany()
     * 
     * // Get first 10 BuyerProgresses
     * const buyerProgresses = await prisma.buyerProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buyerProgressWithIdOnly = await prisma.buyerProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuyerProgressFindManyArgs>(args?: SelectSubset<T, BuyerProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BuyerProgress.
     * @param {BuyerProgressCreateArgs} args - Arguments to create a BuyerProgress.
     * @example
     * // Create one BuyerProgress
     * const BuyerProgress = await prisma.buyerProgress.create({
     *   data: {
     *     // ... data to create a BuyerProgress
     *   }
     * })
     * 
     */
    create<T extends BuyerProgressCreateArgs>(args: SelectSubset<T, BuyerProgressCreateArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BuyerProgresses.
     * @param {BuyerProgressCreateManyArgs} args - Arguments to create many BuyerProgresses.
     * @example
     * // Create many BuyerProgresses
     * const buyerProgress = await prisma.buyerProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuyerProgressCreateManyArgs>(args?: SelectSubset<T, BuyerProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BuyerProgresses and returns the data saved in the database.
     * @param {BuyerProgressCreateManyAndReturnArgs} args - Arguments to create many BuyerProgresses.
     * @example
     * // Create many BuyerProgresses
     * const buyerProgress = await prisma.buyerProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BuyerProgresses and only return the `id`
     * const buyerProgressWithIdOnly = await prisma.buyerProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuyerProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, BuyerProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BuyerProgress.
     * @param {BuyerProgressDeleteArgs} args - Arguments to delete one BuyerProgress.
     * @example
     * // Delete one BuyerProgress
     * const BuyerProgress = await prisma.buyerProgress.delete({
     *   where: {
     *     // ... filter to delete one BuyerProgress
     *   }
     * })
     * 
     */
    delete<T extends BuyerProgressDeleteArgs>(args: SelectSubset<T, BuyerProgressDeleteArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BuyerProgress.
     * @param {BuyerProgressUpdateArgs} args - Arguments to update one BuyerProgress.
     * @example
     * // Update one BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuyerProgressUpdateArgs>(args: SelectSubset<T, BuyerProgressUpdateArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BuyerProgresses.
     * @param {BuyerProgressDeleteManyArgs} args - Arguments to filter BuyerProgresses to delete.
     * @example
     * // Delete a few BuyerProgresses
     * const { count } = await prisma.buyerProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuyerProgressDeleteManyArgs>(args?: SelectSubset<T, BuyerProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuyerProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BuyerProgresses
     * const buyerProgress = await prisma.buyerProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuyerProgressUpdateManyArgs>(args: SelectSubset<T, BuyerProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuyerProgresses and returns the data updated in the database.
     * @param {BuyerProgressUpdateManyAndReturnArgs} args - Arguments to update many BuyerProgresses.
     * @example
     * // Update many BuyerProgresses
     * const buyerProgress = await prisma.buyerProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BuyerProgresses and only return the `id`
     * const buyerProgressWithIdOnly = await prisma.buyerProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BuyerProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, BuyerProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BuyerProgress.
     * @param {BuyerProgressUpsertArgs} args - Arguments to update or create a BuyerProgress.
     * @example
     * // Update or create a BuyerProgress
     * const buyerProgress = await prisma.buyerProgress.upsert({
     *   create: {
     *     // ... data to create a BuyerProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BuyerProgress we want to update
     *   }
     * })
     */
    upsert<T extends BuyerProgressUpsertArgs>(args: SelectSubset<T, BuyerProgressUpsertArgs<ExtArgs>>): Prisma__BuyerProgressClient<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BuyerProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressCountArgs} args - Arguments to filter BuyerProgresses to count.
     * @example
     * // Count the number of BuyerProgresses
     * const count = await prisma.buyerProgress.count({
     *   where: {
     *     // ... the filter for the BuyerProgresses we want to count
     *   }
     * })
    **/
    count<T extends BuyerProgressCountArgs>(
      args?: Subset<T, BuyerProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuyerProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BuyerProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuyerProgressAggregateArgs>(args: Subset<T, BuyerProgressAggregateArgs>): Prisma.PrismaPromise<GetBuyerProgressAggregateType<T>>

    /**
     * Group by BuyerProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuyerProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuyerProgressGroupByArgs['orderBy'] }
        : { orderBy?: BuyerProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuyerProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuyerProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BuyerProgress model
   */
  readonly fields: BuyerProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BuyerProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuyerProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    buyer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    selectedListing<T extends BuyerProgress$selectedListingArgs<ExtArgs> = {}>(args?: Subset<T, BuyerProgress$selectedListingArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BuyerProgress model
   */
  interface BuyerProgressFieldRefs {
    readonly id: FieldRef<"BuyerProgress", 'String'>
    readonly buyerId: FieldRef<"BuyerProgress", 'String'>
    readonly currentStep: FieldRef<"BuyerProgress", 'Int'>
    readonly completedSteps: FieldRef<"BuyerProgress", 'Json'>
    readonly selectedListingId: FieldRef<"BuyerProgress", 'String'>
    readonly createdAt: FieldRef<"BuyerProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"BuyerProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BuyerProgress findUnique
   */
  export type BuyerProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter, which BuyerProgress to fetch.
     */
    where: BuyerProgressWhereUniqueInput
  }

  /**
   * BuyerProgress findUniqueOrThrow
   */
  export type BuyerProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter, which BuyerProgress to fetch.
     */
    where: BuyerProgressWhereUniqueInput
  }

  /**
   * BuyerProgress findFirst
   */
  export type BuyerProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter, which BuyerProgress to fetch.
     */
    where?: BuyerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerProgresses to fetch.
     */
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuyerProgresses.
     */
    cursor?: BuyerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuyerProgresses.
     */
    distinct?: BuyerProgressScalarFieldEnum | BuyerProgressScalarFieldEnum[]
  }

  /**
   * BuyerProgress findFirstOrThrow
   */
  export type BuyerProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter, which BuyerProgress to fetch.
     */
    where?: BuyerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerProgresses to fetch.
     */
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuyerProgresses.
     */
    cursor?: BuyerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuyerProgresses.
     */
    distinct?: BuyerProgressScalarFieldEnum | BuyerProgressScalarFieldEnum[]
  }

  /**
   * BuyerProgress findMany
   */
  export type BuyerProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter, which BuyerProgresses to fetch.
     */
    where?: BuyerProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerProgresses to fetch.
     */
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BuyerProgresses.
     */
    cursor?: BuyerProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerProgresses.
     */
    skip?: number
    distinct?: BuyerProgressScalarFieldEnum | BuyerProgressScalarFieldEnum[]
  }

  /**
   * BuyerProgress create
   */
  export type BuyerProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a BuyerProgress.
     */
    data: XOR<BuyerProgressCreateInput, BuyerProgressUncheckedCreateInput>
  }

  /**
   * BuyerProgress createMany
   */
  export type BuyerProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BuyerProgresses.
     */
    data: BuyerProgressCreateManyInput | BuyerProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuyerProgress createManyAndReturn
   */
  export type BuyerProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * The data used to create many BuyerProgresses.
     */
    data: BuyerProgressCreateManyInput | BuyerProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuyerProgress update
   */
  export type BuyerProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a BuyerProgress.
     */
    data: XOR<BuyerProgressUpdateInput, BuyerProgressUncheckedUpdateInput>
    /**
     * Choose, which BuyerProgress to update.
     */
    where: BuyerProgressWhereUniqueInput
  }

  /**
   * BuyerProgress updateMany
   */
  export type BuyerProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BuyerProgresses.
     */
    data: XOR<BuyerProgressUpdateManyMutationInput, BuyerProgressUncheckedUpdateManyInput>
    /**
     * Filter which BuyerProgresses to update
     */
    where?: BuyerProgressWhereInput
    /**
     * Limit how many BuyerProgresses to update.
     */
    limit?: number
  }

  /**
   * BuyerProgress updateManyAndReturn
   */
  export type BuyerProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * The data used to update BuyerProgresses.
     */
    data: XOR<BuyerProgressUpdateManyMutationInput, BuyerProgressUncheckedUpdateManyInput>
    /**
     * Filter which BuyerProgresses to update
     */
    where?: BuyerProgressWhereInput
    /**
     * Limit how many BuyerProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuyerProgress upsert
   */
  export type BuyerProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the BuyerProgress to update in case it exists.
     */
    where: BuyerProgressWhereUniqueInput
    /**
     * In case the BuyerProgress found by the `where` argument doesn't exist, create a new BuyerProgress with this data.
     */
    create: XOR<BuyerProgressCreateInput, BuyerProgressUncheckedCreateInput>
    /**
     * In case the BuyerProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuyerProgressUpdateInput, BuyerProgressUncheckedUpdateInput>
  }

  /**
   * BuyerProgress delete
   */
  export type BuyerProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    /**
     * Filter which BuyerProgress to delete.
     */
    where: BuyerProgressWhereUniqueInput
  }

  /**
   * BuyerProgress deleteMany
   */
  export type BuyerProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuyerProgresses to delete
     */
    where?: BuyerProgressWhereInput
    /**
     * Limit how many BuyerProgresses to delete.
     */
    limit?: number
  }

  /**
   * BuyerProgress.selectedListing
   */
  export type BuyerProgress$selectedListingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    where?: ListingWhereInput
  }

  /**
   * BuyerProgress without action
   */
  export type BuyerProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    subject: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    readAt: Date | null
    senderId: string | null
    senderType: $Enums.UserRole | null
    senderName: string | null
    receiverId: string | null
    receiverType: $Enums.UserRole | null
    receiverName: string | null
    status: $Enums.MessageStatus | null
    isRead: boolean | null
    isArchived: boolean | null
    parentMessageId: string | null
    threadId: string | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    subject: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    readAt: Date | null
    senderId: string | null
    senderType: $Enums.UserRole | null
    senderName: string | null
    receiverId: string | null
    receiverType: $Enums.UserRole | null
    receiverName: string | null
    status: $Enums.MessageStatus | null
    isRead: boolean | null
    isArchived: boolean | null
    parentMessageId: string | null
    threadId: string | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    subject: number
    content: number
    createdAt: number
    updatedAt: number
    readAt: number
    senderId: number
    senderType: number
    senderName: number
    receiverId: number
    receiverType: number
    receiverName: number
    status: number
    isRead: number
    isArchived: number
    parentMessageId: number
    threadId: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    subject?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    readAt?: true
    senderId?: true
    senderType?: true
    senderName?: true
    receiverId?: true
    receiverType?: true
    receiverName?: true
    status?: true
    isRead?: true
    isArchived?: true
    parentMessageId?: true
    threadId?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    subject?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    readAt?: true
    senderId?: true
    senderType?: true
    senderName?: true
    receiverId?: true
    receiverType?: true
    receiverName?: true
    status?: true
    isRead?: true
    isArchived?: true
    parentMessageId?: true
    threadId?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    subject?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    readAt?: true
    senderId?: true
    senderType?: true
    senderName?: true
    receiverId?: true
    receiverType?: true
    receiverName?: true
    status?: true
    isRead?: true
    isArchived?: true
    parentMessageId?: true
    threadId?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    subject: string
    content: string
    createdAt: Date
    updatedAt: Date
    readAt: Date | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status: $Enums.MessageStatus
    isRead: boolean
    isArchived: boolean
    parentMessageId: string | null
    threadId: string | null
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readAt?: boolean
    senderId?: boolean
    senderType?: boolean
    senderName?: boolean
    receiverId?: boolean
    receiverType?: boolean
    receiverName?: boolean
    status?: boolean
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: boolean
    threadId?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    attachments?: boolean | Message$attachmentsArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readAt?: boolean
    senderId?: boolean
    senderType?: boolean
    senderName?: boolean
    receiverId?: boolean
    receiverType?: boolean
    receiverName?: boolean
    status?: boolean
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: boolean
    threadId?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readAt?: boolean
    senderId?: boolean
    senderType?: boolean
    senderName?: boolean
    receiverId?: boolean
    receiverType?: boolean
    receiverName?: boolean
    status?: boolean
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: boolean
    threadId?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    subject?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    readAt?: boolean
    senderId?: boolean
    senderType?: boolean
    senderName?: boolean
    receiverId?: boolean
    receiverType?: boolean
    receiverName?: boolean
    status?: boolean
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: boolean
    threadId?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "subject" | "content" | "createdAt" | "updatedAt" | "readAt" | "senderId" | "senderType" | "senderName" | "receiverId" | "receiverType" | "receiverName" | "status" | "isRead" | "isArchived" | "parentMessageId" | "threadId", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    attachments?: boolean | Message$attachmentsArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    parentMessage?: boolean | Message$parentMessageArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
      parentMessage: Prisma.$MessagePayload<ExtArgs> | null
      replies: Prisma.$MessagePayload<ExtArgs>[]
      attachments: Prisma.$MessageAttachmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subject: string
      content: string
      createdAt: Date
      updatedAt: Date
      readAt: Date | null
      senderId: string
      senderType: $Enums.UserRole
      senderName: string
      receiverId: string
      receiverType: $Enums.UserRole
      receiverName: string
      status: $Enums.MessageStatus
      isRead: boolean
      isArchived: boolean
      parentMessageId: string | null
      threadId: string | null
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parentMessage<T extends Message$parentMessageArgs<ExtArgs> = {}>(args?: Subset<T, Message$parentMessageArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends Message$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Message$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    attachments<T extends Message$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Message$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly subject: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
    readonly readAt: FieldRef<"Message", 'DateTime'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly senderType: FieldRef<"Message", 'UserRole'>
    readonly senderName: FieldRef<"Message", 'String'>
    readonly receiverId: FieldRef<"Message", 'String'>
    readonly receiverType: FieldRef<"Message", 'UserRole'>
    readonly receiverName: FieldRef<"Message", 'String'>
    readonly status: FieldRef<"Message", 'MessageStatus'>
    readonly isRead: FieldRef<"Message", 'Boolean'>
    readonly isArchived: FieldRef<"Message", 'Boolean'>
    readonly parentMessageId: FieldRef<"Message", 'String'>
    readonly threadId: FieldRef<"Message", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message.parentMessage
   */
  export type Message$parentMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
  }

  /**
   * Message.replies
   */
  export type Message$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message.attachments
   */
  export type Message$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    where?: MessageAttachmentWhereInput
    orderBy?: MessageAttachmentOrderByWithRelationInput | MessageAttachmentOrderByWithRelationInput[]
    cursor?: MessageAttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageAttachmentScalarFieldEnum | MessageAttachmentScalarFieldEnum[]
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model MessageAttachment
   */

  export type AggregateMessageAttachment = {
    _count: MessageAttachmentCountAggregateOutputType | null
    _avg: MessageAttachmentAvgAggregateOutputType | null
    _sum: MessageAttachmentSumAggregateOutputType | null
    _min: MessageAttachmentMinAggregateOutputType | null
    _max: MessageAttachmentMaxAggregateOutputType | null
  }

  export type MessageAttachmentAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type MessageAttachmentSumAggregateOutputType = {
    fileSize: number | null
  }

  export type MessageAttachmentMinAggregateOutputType = {
    id: string | null
    messageId: string | null
    fileName: string | null
    fileSize: number | null
    fileType: string | null
    fileUrl: string | null
    uploadedAt: Date | null
  }

  export type MessageAttachmentMaxAggregateOutputType = {
    id: string | null
    messageId: string | null
    fileName: string | null
    fileSize: number | null
    fileType: string | null
    fileUrl: string | null
    uploadedAt: Date | null
  }

  export type MessageAttachmentCountAggregateOutputType = {
    id: number
    messageId: number
    fileName: number
    fileSize: number
    fileType: number
    fileUrl: number
    uploadedAt: number
    _all: number
  }


  export type MessageAttachmentAvgAggregateInputType = {
    fileSize?: true
  }

  export type MessageAttachmentSumAggregateInputType = {
    fileSize?: true
  }

  export type MessageAttachmentMinAggregateInputType = {
    id?: true
    messageId?: true
    fileName?: true
    fileSize?: true
    fileType?: true
    fileUrl?: true
    uploadedAt?: true
  }

  export type MessageAttachmentMaxAggregateInputType = {
    id?: true
    messageId?: true
    fileName?: true
    fileSize?: true
    fileType?: true
    fileUrl?: true
    uploadedAt?: true
  }

  export type MessageAttachmentCountAggregateInputType = {
    id?: true
    messageId?: true
    fileName?: true
    fileSize?: true
    fileType?: true
    fileUrl?: true
    uploadedAt?: true
    _all?: true
  }

  export type MessageAttachmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageAttachment to aggregate.
     */
    where?: MessageAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageAttachments to fetch.
     */
    orderBy?: MessageAttachmentOrderByWithRelationInput | MessageAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MessageAttachments
    **/
    _count?: true | MessageAttachmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAttachmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageAttachmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageAttachmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageAttachmentMaxAggregateInputType
  }

  export type GetMessageAttachmentAggregateType<T extends MessageAttachmentAggregateArgs> = {
        [P in keyof T & keyof AggregateMessageAttachment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessageAttachment[P]>
      : GetScalarType<T[P], AggregateMessageAttachment[P]>
  }




  export type MessageAttachmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageAttachmentWhereInput
    orderBy?: MessageAttachmentOrderByWithAggregationInput | MessageAttachmentOrderByWithAggregationInput[]
    by: MessageAttachmentScalarFieldEnum[] | MessageAttachmentScalarFieldEnum
    having?: MessageAttachmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageAttachmentCountAggregateInputType | true
    _avg?: MessageAttachmentAvgAggregateInputType
    _sum?: MessageAttachmentSumAggregateInputType
    _min?: MessageAttachmentMinAggregateInputType
    _max?: MessageAttachmentMaxAggregateInputType
  }

  export type MessageAttachmentGroupByOutputType = {
    id: string
    messageId: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt: Date
    _count: MessageAttachmentCountAggregateOutputType | null
    _avg: MessageAttachmentAvgAggregateOutputType | null
    _sum: MessageAttachmentSumAggregateOutputType | null
    _min: MessageAttachmentMinAggregateOutputType | null
    _max: MessageAttachmentMaxAggregateOutputType | null
  }

  type GetMessageAttachmentGroupByPayload<T extends MessageAttachmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageAttachmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageAttachmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageAttachmentGroupByOutputType[P]>
            : GetScalarType<T[P], MessageAttachmentGroupByOutputType[P]>
        }
      >
    >


  export type MessageAttachmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    fileName?: boolean
    fileSize?: boolean
    fileType?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageAttachment"]>

  export type MessageAttachmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    fileName?: boolean
    fileSize?: boolean
    fileType?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageAttachment"]>

  export type MessageAttachmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    fileName?: boolean
    fileSize?: boolean
    fileType?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageAttachment"]>

  export type MessageAttachmentSelectScalar = {
    id?: boolean
    messageId?: boolean
    fileName?: boolean
    fileSize?: boolean
    fileType?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
  }

  export type MessageAttachmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messageId" | "fileName" | "fileSize" | "fileType" | "fileUrl" | "uploadedAt", ExtArgs["result"]["messageAttachment"]>
  export type MessageAttachmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }
  export type MessageAttachmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }
  export type MessageAttachmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    message?: boolean | MessageDefaultArgs<ExtArgs>
  }

  export type $MessageAttachmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MessageAttachment"
    objects: {
      message: Prisma.$MessagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messageId: string
      fileName: string
      fileSize: number
      fileType: string
      fileUrl: string
      uploadedAt: Date
    }, ExtArgs["result"]["messageAttachment"]>
    composites: {}
  }

  type MessageAttachmentGetPayload<S extends boolean | null | undefined | MessageAttachmentDefaultArgs> = $Result.GetResult<Prisma.$MessageAttachmentPayload, S>

  type MessageAttachmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageAttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageAttachmentCountAggregateInputType | true
    }

  export interface MessageAttachmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MessageAttachment'], meta: { name: 'MessageAttachment' } }
    /**
     * Find zero or one MessageAttachment that matches the filter.
     * @param {MessageAttachmentFindUniqueArgs} args - Arguments to find a MessageAttachment
     * @example
     * // Get one MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageAttachmentFindUniqueArgs>(args: SelectSubset<T, MessageAttachmentFindUniqueArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MessageAttachment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageAttachmentFindUniqueOrThrowArgs} args - Arguments to find a MessageAttachment
     * @example
     * // Get one MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageAttachmentFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageAttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageAttachment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentFindFirstArgs} args - Arguments to find a MessageAttachment
     * @example
     * // Get one MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageAttachmentFindFirstArgs>(args?: SelectSubset<T, MessageAttachmentFindFirstArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageAttachment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentFindFirstOrThrowArgs} args - Arguments to find a MessageAttachment
     * @example
     * // Get one MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageAttachmentFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageAttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MessageAttachments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MessageAttachments
     * const messageAttachments = await prisma.messageAttachment.findMany()
     * 
     * // Get first 10 MessageAttachments
     * const messageAttachments = await prisma.messageAttachment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageAttachmentWithIdOnly = await prisma.messageAttachment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageAttachmentFindManyArgs>(args?: SelectSubset<T, MessageAttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MessageAttachment.
     * @param {MessageAttachmentCreateArgs} args - Arguments to create a MessageAttachment.
     * @example
     * // Create one MessageAttachment
     * const MessageAttachment = await prisma.messageAttachment.create({
     *   data: {
     *     // ... data to create a MessageAttachment
     *   }
     * })
     * 
     */
    create<T extends MessageAttachmentCreateArgs>(args: SelectSubset<T, MessageAttachmentCreateArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MessageAttachments.
     * @param {MessageAttachmentCreateManyArgs} args - Arguments to create many MessageAttachments.
     * @example
     * // Create many MessageAttachments
     * const messageAttachment = await prisma.messageAttachment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageAttachmentCreateManyArgs>(args?: SelectSubset<T, MessageAttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MessageAttachments and returns the data saved in the database.
     * @param {MessageAttachmentCreateManyAndReturnArgs} args - Arguments to create many MessageAttachments.
     * @example
     * // Create many MessageAttachments
     * const messageAttachment = await prisma.messageAttachment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MessageAttachments and only return the `id`
     * const messageAttachmentWithIdOnly = await prisma.messageAttachment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageAttachmentCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageAttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MessageAttachment.
     * @param {MessageAttachmentDeleteArgs} args - Arguments to delete one MessageAttachment.
     * @example
     * // Delete one MessageAttachment
     * const MessageAttachment = await prisma.messageAttachment.delete({
     *   where: {
     *     // ... filter to delete one MessageAttachment
     *   }
     * })
     * 
     */
    delete<T extends MessageAttachmentDeleteArgs>(args: SelectSubset<T, MessageAttachmentDeleteArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MessageAttachment.
     * @param {MessageAttachmentUpdateArgs} args - Arguments to update one MessageAttachment.
     * @example
     * // Update one MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageAttachmentUpdateArgs>(args: SelectSubset<T, MessageAttachmentUpdateArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MessageAttachments.
     * @param {MessageAttachmentDeleteManyArgs} args - Arguments to filter MessageAttachments to delete.
     * @example
     * // Delete a few MessageAttachments
     * const { count } = await prisma.messageAttachment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageAttachmentDeleteManyArgs>(args?: SelectSubset<T, MessageAttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MessageAttachments
     * const messageAttachment = await prisma.messageAttachment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageAttachmentUpdateManyArgs>(args: SelectSubset<T, MessageAttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageAttachments and returns the data updated in the database.
     * @param {MessageAttachmentUpdateManyAndReturnArgs} args - Arguments to update many MessageAttachments.
     * @example
     * // Update many MessageAttachments
     * const messageAttachment = await prisma.messageAttachment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MessageAttachments and only return the `id`
     * const messageAttachmentWithIdOnly = await prisma.messageAttachment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageAttachmentUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageAttachmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MessageAttachment.
     * @param {MessageAttachmentUpsertArgs} args - Arguments to update or create a MessageAttachment.
     * @example
     * // Update or create a MessageAttachment
     * const messageAttachment = await prisma.messageAttachment.upsert({
     *   create: {
     *     // ... data to create a MessageAttachment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MessageAttachment we want to update
     *   }
     * })
     */
    upsert<T extends MessageAttachmentUpsertArgs>(args: SelectSubset<T, MessageAttachmentUpsertArgs<ExtArgs>>): Prisma__MessageAttachmentClient<$Result.GetResult<Prisma.$MessageAttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MessageAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentCountArgs} args - Arguments to filter MessageAttachments to count.
     * @example
     * // Count the number of MessageAttachments
     * const count = await prisma.messageAttachment.count({
     *   where: {
     *     // ... the filter for the MessageAttachments we want to count
     *   }
     * })
    **/
    count<T extends MessageAttachmentCountArgs>(
      args?: Subset<T, MessageAttachmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageAttachmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MessageAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAttachmentAggregateArgs>(args: Subset<T, MessageAttachmentAggregateArgs>): Prisma.PrismaPromise<GetMessageAttachmentAggregateType<T>>

    /**
     * Group by MessageAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAttachmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageAttachmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageAttachmentGroupByArgs['orderBy'] }
        : { orderBy?: MessageAttachmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageAttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MessageAttachment model
   */
  readonly fields: MessageAttachmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MessageAttachment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageAttachmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    message<T extends MessageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MessageDefaultArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MessageAttachment model
   */
  interface MessageAttachmentFieldRefs {
    readonly id: FieldRef<"MessageAttachment", 'String'>
    readonly messageId: FieldRef<"MessageAttachment", 'String'>
    readonly fileName: FieldRef<"MessageAttachment", 'String'>
    readonly fileSize: FieldRef<"MessageAttachment", 'Int'>
    readonly fileType: FieldRef<"MessageAttachment", 'String'>
    readonly fileUrl: FieldRef<"MessageAttachment", 'String'>
    readonly uploadedAt: FieldRef<"MessageAttachment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MessageAttachment findUnique
   */
  export type MessageAttachmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which MessageAttachment to fetch.
     */
    where: MessageAttachmentWhereUniqueInput
  }

  /**
   * MessageAttachment findUniqueOrThrow
   */
  export type MessageAttachmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which MessageAttachment to fetch.
     */
    where: MessageAttachmentWhereUniqueInput
  }

  /**
   * MessageAttachment findFirst
   */
  export type MessageAttachmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which MessageAttachment to fetch.
     */
    where?: MessageAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageAttachments to fetch.
     */
    orderBy?: MessageAttachmentOrderByWithRelationInput | MessageAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageAttachments.
     */
    cursor?: MessageAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageAttachments.
     */
    distinct?: MessageAttachmentScalarFieldEnum | MessageAttachmentScalarFieldEnum[]
  }

  /**
   * MessageAttachment findFirstOrThrow
   */
  export type MessageAttachmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which MessageAttachment to fetch.
     */
    where?: MessageAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageAttachments to fetch.
     */
    orderBy?: MessageAttachmentOrderByWithRelationInput | MessageAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageAttachments.
     */
    cursor?: MessageAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageAttachments.
     */
    distinct?: MessageAttachmentScalarFieldEnum | MessageAttachmentScalarFieldEnum[]
  }

  /**
   * MessageAttachment findMany
   */
  export type MessageAttachmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which MessageAttachments to fetch.
     */
    where?: MessageAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageAttachments to fetch.
     */
    orderBy?: MessageAttachmentOrderByWithRelationInput | MessageAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MessageAttachments.
     */
    cursor?: MessageAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageAttachments.
     */
    skip?: number
    distinct?: MessageAttachmentScalarFieldEnum | MessageAttachmentScalarFieldEnum[]
  }

  /**
   * MessageAttachment create
   */
  export type MessageAttachmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to create a MessageAttachment.
     */
    data: XOR<MessageAttachmentCreateInput, MessageAttachmentUncheckedCreateInput>
  }

  /**
   * MessageAttachment createMany
   */
  export type MessageAttachmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MessageAttachments.
     */
    data: MessageAttachmentCreateManyInput | MessageAttachmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MessageAttachment createManyAndReturn
   */
  export type MessageAttachmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * The data used to create many MessageAttachments.
     */
    data: MessageAttachmentCreateManyInput | MessageAttachmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MessageAttachment update
   */
  export type MessageAttachmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to update a MessageAttachment.
     */
    data: XOR<MessageAttachmentUpdateInput, MessageAttachmentUncheckedUpdateInput>
    /**
     * Choose, which MessageAttachment to update.
     */
    where: MessageAttachmentWhereUniqueInput
  }

  /**
   * MessageAttachment updateMany
   */
  export type MessageAttachmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MessageAttachments.
     */
    data: XOR<MessageAttachmentUpdateManyMutationInput, MessageAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which MessageAttachments to update
     */
    where?: MessageAttachmentWhereInput
    /**
     * Limit how many MessageAttachments to update.
     */
    limit?: number
  }

  /**
   * MessageAttachment updateManyAndReturn
   */
  export type MessageAttachmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * The data used to update MessageAttachments.
     */
    data: XOR<MessageAttachmentUpdateManyMutationInput, MessageAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which MessageAttachments to update
     */
    where?: MessageAttachmentWhereInput
    /**
     * Limit how many MessageAttachments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MessageAttachment upsert
   */
  export type MessageAttachmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * The filter to search for the MessageAttachment to update in case it exists.
     */
    where: MessageAttachmentWhereUniqueInput
    /**
     * In case the MessageAttachment found by the `where` argument doesn't exist, create a new MessageAttachment with this data.
     */
    create: XOR<MessageAttachmentCreateInput, MessageAttachmentUncheckedCreateInput>
    /**
     * In case the MessageAttachment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageAttachmentUpdateInput, MessageAttachmentUncheckedUpdateInput>
  }

  /**
   * MessageAttachment delete
   */
  export type MessageAttachmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
    /**
     * Filter which MessageAttachment to delete.
     */
    where: MessageAttachmentWhereUniqueInput
  }

  /**
   * MessageAttachment deleteMany
   */
  export type MessageAttachmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageAttachments to delete
     */
    where?: MessageAttachmentWhereInput
    /**
     * Limit how many MessageAttachments to delete.
     */
    limit?: number
  }

  /**
   * MessageAttachment without action
   */
  export type MessageAttachmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageAttachment
     */
    select?: MessageAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageAttachment
     */
    omit?: MessageAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageAttachmentInclude<ExtArgs> | null
  }


  /**
   * Model Listing
   */

  export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  export type ListingAvgAggregateOutputType = {
    price: number | null
  }

  export type ListingSumAggregateOutputType = {
    price: number | null
  }

  export type ListingMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    price: number | null
    status: $Enums.ListingStatus | null
    createdAt: Date | null
    sellerId: string | null
  }

  export type ListingMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    price: number | null
    status: $Enums.ListingStatus | null
    createdAt: Date | null
    sellerId: string | null
  }

  export type ListingCountAggregateOutputType = {
    id: number
    title: number
    description: number
    price: number
    status: number
    createdAt: number
    sellerId: number
    _all: number
  }


  export type ListingAvgAggregateInputType = {
    price?: true
  }

  export type ListingSumAggregateInputType = {
    price?: true
  }

  export type ListingMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    status?: true
    createdAt?: true
    sellerId?: true
  }

  export type ListingMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    status?: true
    createdAt?: true
    sellerId?: true
  }

  export type ListingCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    status?: true
    createdAt?: true
    sellerId?: true
    _all?: true
  }

  export type ListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listing to aggregate.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Listings
    **/
    _count?: true | ListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingMaxAggregateInputType
  }

  export type GetListingAggregateType<T extends ListingAggregateArgs> = {
        [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListing[P]>
      : GetScalarType<T[P], AggregateListing[P]>
  }




  export type ListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithAggregationInput | ListingOrderByWithAggregationInput[]
    by: ListingScalarFieldEnum[] | ListingScalarFieldEnum
    having?: ListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingCountAggregateInputType | true
    _avg?: ListingAvgAggregateInputType
    _sum?: ListingSumAggregateInputType
    _min?: ListingMinAggregateInputType
    _max?: ListingMaxAggregateInputType
  }

  export type ListingGroupByOutputType = {
    id: string
    title: string
    description: string
    price: number
    status: $Enums.ListingStatus
    createdAt: Date
    sellerId: string
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  type GetListingGroupByPayload<T extends ListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingGroupByOutputType[P]>
            : GetScalarType<T[P], ListingGroupByOutputType[P]>
        }
      >
    >


  export type ListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    status?: boolean
    createdAt?: boolean
    sellerId?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyers?: boolean | Listing$buyersArgs<ExtArgs>
    documents?: boolean | Listing$documentsArgs<ExtArgs>
    sellerProgress?: boolean | Listing$sellerProgressArgs<ExtArgs>
    buyerSelectedProgress?: boolean | Listing$buyerSelectedProgressArgs<ExtArgs>
    preCloseChecklist?: boolean | Listing$preCloseChecklistArgs<ExtArgs>
    _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    status?: boolean
    createdAt?: boolean
    sellerId?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    status?: boolean
    createdAt?: boolean
    sellerId?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    status?: boolean
    createdAt?: boolean
    sellerId?: boolean
  }

  export type ListingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "price" | "status" | "createdAt" | "sellerId", ExtArgs["result"]["listing"]>
  export type ListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
    buyers?: boolean | Listing$buyersArgs<ExtArgs>
    documents?: boolean | Listing$documentsArgs<ExtArgs>
    sellerProgress?: boolean | Listing$sellerProgressArgs<ExtArgs>
    buyerSelectedProgress?: boolean | Listing$buyerSelectedProgressArgs<ExtArgs>
    preCloseChecklist?: boolean | Listing$preCloseChecklistArgs<ExtArgs>
    _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ListingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Listing"
    objects: {
      seller: Prisma.$UserPayload<ExtArgs>
      buyers: Prisma.$UserPayload<ExtArgs>[]
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      sellerProgress: Prisma.$SellerProgressPayload<ExtArgs>[]
      buyerSelectedProgress: Prisma.$BuyerProgressPayload<ExtArgs>[]
      preCloseChecklist: Prisma.$PreCloseChecklistPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      price: number
      status: $Enums.ListingStatus
      createdAt: Date
      sellerId: string
    }, ExtArgs["result"]["listing"]>
    composites: {}
  }

  type ListingGetPayload<S extends boolean | null | undefined | ListingDefaultArgs> = $Result.GetResult<Prisma.$ListingPayload, S>

  type ListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ListingCountAggregateInputType | true
    }

  export interface ListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Listing'], meta: { name: 'Listing' } }
    /**
     * Find zero or one Listing that matches the filter.
     * @param {ListingFindUniqueArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingFindUniqueArgs>(args: SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Listing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ListingFindUniqueOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(args: SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Listing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingFindFirstArgs>(args?: SelectSubset<T, ListingFindFirstArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Listing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(args?: SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Listings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listings
     * const listings = await prisma.listing.findMany()
     * 
     * // Get first 10 Listings
     * const listings = await prisma.listing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingWithIdOnly = await prisma.listing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListingFindManyArgs>(args?: SelectSubset<T, ListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Listing.
     * @param {ListingCreateArgs} args - Arguments to create a Listing.
     * @example
     * // Create one Listing
     * const Listing = await prisma.listing.create({
     *   data: {
     *     // ... data to create a Listing
     *   }
     * })
     * 
     */
    create<T extends ListingCreateArgs>(args: SelectSubset<T, ListingCreateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Listings.
     * @param {ListingCreateManyArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListingCreateManyArgs>(args?: SelectSubset<T, ListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Listings and returns the data saved in the database.
     * @param {ListingCreateManyAndReturnArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(args?: SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Listing.
     * @param {ListingDeleteArgs} args - Arguments to delete one Listing.
     * @example
     * // Delete one Listing
     * const Listing = await prisma.listing.delete({
     *   where: {
     *     // ... filter to delete one Listing
     *   }
     * })
     * 
     */
    delete<T extends ListingDeleteArgs>(args: SelectSubset<T, ListingDeleteArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Listing.
     * @param {ListingUpdateArgs} args - Arguments to update one Listing.
     * @example
     * // Update one Listing
     * const listing = await prisma.listing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListingUpdateArgs>(args: SelectSubset<T, ListingUpdateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Listings.
     * @param {ListingDeleteManyArgs} args - Arguments to filter Listings to delete.
     * @example
     * // Delete a few Listings
     * const { count } = await prisma.listing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListingDeleteManyArgs>(args?: SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListingUpdateManyArgs>(args: SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings and returns the data updated in the database.
     * @param {ListingUpdateManyAndReturnArgs} args - Arguments to update many Listings.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ListingUpdateManyAndReturnArgs>(args: SelectSubset<T, ListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Listing.
     * @param {ListingUpsertArgs} args - Arguments to update or create a Listing.
     * @example
     * // Update or create a Listing
     * const listing = await prisma.listing.upsert({
     *   create: {
     *     // ... data to create a Listing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listing we want to update
     *   }
     * })
     */
    upsert<T extends ListingUpsertArgs>(args: SelectSubset<T, ListingUpsertArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingCountArgs} args - Arguments to filter Listings to count.
     * @example
     * // Count the number of Listings
     * const count = await prisma.listing.count({
     *   where: {
     *     // ... the filter for the Listings we want to count
     *   }
     * })
    **/
    count<T extends ListingCountArgs>(
      args?: Subset<T, ListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingAggregateArgs>(args: Subset<T, ListingAggregateArgs>): Prisma.PrismaPromise<GetListingAggregateType<T>>

    /**
     * Group by Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingGroupByArgs['orderBy'] }
        : { orderBy?: ListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Listing model
   */
  readonly fields: ListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    buyers<T extends Listing$buyersArgs<ExtArgs> = {}>(args?: Subset<T, Listing$buyersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    documents<T extends Listing$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Listing$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sellerProgress<T extends Listing$sellerProgressArgs<ExtArgs> = {}>(args?: Subset<T, Listing$sellerProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    buyerSelectedProgress<T extends Listing$buyerSelectedProgressArgs<ExtArgs> = {}>(args?: Subset<T, Listing$buyerSelectedProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preCloseChecklist<T extends Listing$preCloseChecklistArgs<ExtArgs> = {}>(args?: Subset<T, Listing$preCloseChecklistArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Listing model
   */
  interface ListingFieldRefs {
    readonly id: FieldRef<"Listing", 'String'>
    readonly title: FieldRef<"Listing", 'String'>
    readonly description: FieldRef<"Listing", 'String'>
    readonly price: FieldRef<"Listing", 'Float'>
    readonly status: FieldRef<"Listing", 'ListingStatus'>
    readonly createdAt: FieldRef<"Listing", 'DateTime'>
    readonly sellerId: FieldRef<"Listing", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Listing findUnique
   */
  export type ListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findUniqueOrThrow
   */
  export type ListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findFirst
   */
  export type ListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findFirstOrThrow
   */
  export type ListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findMany
   */
  export type ListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listings to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing create
   */
  export type ListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to create a Listing.
     */
    data: XOR<ListingCreateInput, ListingUncheckedCreateInput>
  }

  /**
   * Listing createMany
   */
  export type ListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Listing createManyAndReturn
   */
  export type ListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Listing update
   */
  export type ListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to update a Listing.
     */
    data: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
    /**
     * Choose, which Listing to update.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing updateMany
   */
  export type ListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to update.
     */
    limit?: number
  }

  /**
   * Listing updateManyAndReturn
   */
  export type ListingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Listing upsert
   */
  export type ListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The filter to search for the Listing to update in case it exists.
     */
    where: ListingWhereUniqueInput
    /**
     * In case the Listing found by the `where` argument doesn't exist, create a new Listing with this data.
     */
    create: XOR<ListingCreateInput, ListingUncheckedCreateInput>
    /**
     * In case the Listing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
  }

  /**
   * Listing delete
   */
  export type ListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter which Listing to delete.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing deleteMany
   */
  export type ListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listings to delete
     */
    where?: ListingWhereInput
    /**
     * Limit how many Listings to delete.
     */
    limit?: number
  }

  /**
   * Listing.buyers
   */
  export type Listing$buyersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Listing.documents
   */
  export type Listing$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Listing.sellerProgress
   */
  export type Listing$sellerProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProgress
     */
    select?: SellerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProgress
     */
    omit?: SellerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerProgressInclude<ExtArgs> | null
    where?: SellerProgressWhereInput
    orderBy?: SellerProgressOrderByWithRelationInput | SellerProgressOrderByWithRelationInput[]
    cursor?: SellerProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SellerProgressScalarFieldEnum | SellerProgressScalarFieldEnum[]
  }

  /**
   * Listing.buyerSelectedProgress
   */
  export type Listing$buyerSelectedProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerProgress
     */
    select?: BuyerProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerProgress
     */
    omit?: BuyerProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerProgressInclude<ExtArgs> | null
    where?: BuyerProgressWhereInput
    orderBy?: BuyerProgressOrderByWithRelationInput | BuyerProgressOrderByWithRelationInput[]
    cursor?: BuyerProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuyerProgressScalarFieldEnum | BuyerProgressScalarFieldEnum[]
  }

  /**
   * Listing.preCloseChecklist
   */
  export type Listing$preCloseChecklistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    where?: PreCloseChecklistWhereInput
  }

  /**
   * Listing without action
   */
  export type ListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Listing
     */
    omit?: ListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
  }


  /**
   * Model Activity
   */

  export type AggregateActivity = {
    _count: ActivityCountAggregateOutputType | null
    _min: ActivityMinAggregateOutputType | null
    _max: ActivityMaxAggregateOutputType | null
  }

  export type ActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    createdAt: Date | null
  }

  export type ActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    createdAt: Date | null
  }

  export type ActivityCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    data: number
    createdAt: number
    _all: number
  }


  export type ActivityMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    createdAt?: true
  }

  export type ActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    createdAt?: true
  }

  export type ActivityCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    data?: true
    createdAt?: true
    _all?: true
  }

  export type ActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Activity to aggregate.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Activities
    **/
    _count?: true | ActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivityMaxAggregateInputType
  }

  export type GetActivityAggregateType<T extends ActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivity[P]>
      : GetScalarType<T[P], AggregateActivity[P]>
  }




  export type ActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityWhereInput
    orderBy?: ActivityOrderByWithAggregationInput | ActivityOrderByWithAggregationInput[]
    by: ActivityScalarFieldEnum[] | ActivityScalarFieldEnum
    having?: ActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivityCountAggregateInputType | true
    _min?: ActivityMinAggregateInputType
    _max?: ActivityMaxAggregateInputType
  }

  export type ActivityGroupByOutputType = {
    id: string
    userId: string
    type: string
    data: JsonValue | null
    createdAt: Date
    _count: ActivityCountAggregateOutputType | null
    _min: ActivityMinAggregateOutputType | null
    _max: ActivityMaxAggregateOutputType | null
  }

  type GetActivityGroupByPayload<T extends ActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivityGroupByOutputType[P]>
            : GetScalarType<T[P], ActivityGroupByOutputType[P]>
        }
      >
    >


  export type ActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activity"]>

  export type ActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
  }

  export type ActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "data" | "createdAt", ExtArgs["result"]["activity"]>
  export type ActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Activity"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      data: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["activity"]>
    composites: {}
  }

  type ActivityGetPayload<S extends boolean | null | undefined | ActivityDefaultArgs> = $Result.GetResult<Prisma.$ActivityPayload, S>

  type ActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActivityCountAggregateInputType | true
    }

  export interface ActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Activity'], meta: { name: 'Activity' } }
    /**
     * Find zero or one Activity that matches the filter.
     * @param {ActivityFindUniqueArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivityFindUniqueArgs>(args: SelectSubset<T, ActivityFindUniqueArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Activity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActivityFindUniqueOrThrowArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindFirstArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivityFindFirstArgs>(args?: SelectSubset<T, ActivityFindFirstArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindFirstOrThrowArgs} args - Arguments to find a Activity
     * @example
     * // Get one Activity
     * const activity = await prisma.activity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Activities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Activities
     * const activities = await prisma.activity.findMany()
     * 
     * // Get first 10 Activities
     * const activities = await prisma.activity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activityWithIdOnly = await prisma.activity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivityFindManyArgs>(args?: SelectSubset<T, ActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Activity.
     * @param {ActivityCreateArgs} args - Arguments to create a Activity.
     * @example
     * // Create one Activity
     * const Activity = await prisma.activity.create({
     *   data: {
     *     // ... data to create a Activity
     *   }
     * })
     * 
     */
    create<T extends ActivityCreateArgs>(args: SelectSubset<T, ActivityCreateArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Activities.
     * @param {ActivityCreateManyArgs} args - Arguments to create many Activities.
     * @example
     * // Create many Activities
     * const activity = await prisma.activity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivityCreateManyArgs>(args?: SelectSubset<T, ActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Activities and returns the data saved in the database.
     * @param {ActivityCreateManyAndReturnArgs} args - Arguments to create many Activities.
     * @example
     * // Create many Activities
     * const activity = await prisma.activity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Activities and only return the `id`
     * const activityWithIdOnly = await prisma.activity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Activity.
     * @param {ActivityDeleteArgs} args - Arguments to delete one Activity.
     * @example
     * // Delete one Activity
     * const Activity = await prisma.activity.delete({
     *   where: {
     *     // ... filter to delete one Activity
     *   }
     * })
     * 
     */
    delete<T extends ActivityDeleteArgs>(args: SelectSubset<T, ActivityDeleteArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Activity.
     * @param {ActivityUpdateArgs} args - Arguments to update one Activity.
     * @example
     * // Update one Activity
     * const activity = await prisma.activity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivityUpdateArgs>(args: SelectSubset<T, ActivityUpdateArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Activities.
     * @param {ActivityDeleteManyArgs} args - Arguments to filter Activities to delete.
     * @example
     * // Delete a few Activities
     * const { count } = await prisma.activity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivityDeleteManyArgs>(args?: SelectSubset<T, ActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Activities
     * const activity = await prisma.activity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivityUpdateManyArgs>(args: SelectSubset<T, ActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activities and returns the data updated in the database.
     * @param {ActivityUpdateManyAndReturnArgs} args - Arguments to update many Activities.
     * @example
     * // Update many Activities
     * const activity = await prisma.activity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Activities and only return the `id`
     * const activityWithIdOnly = await prisma.activity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, ActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Activity.
     * @param {ActivityUpsertArgs} args - Arguments to update or create a Activity.
     * @example
     * // Update or create a Activity
     * const activity = await prisma.activity.upsert({
     *   create: {
     *     // ... data to create a Activity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Activity we want to update
     *   }
     * })
     */
    upsert<T extends ActivityUpsertArgs>(args: SelectSubset<T, ActivityUpsertArgs<ExtArgs>>): Prisma__ActivityClient<$Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Activities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityCountArgs} args - Arguments to filter Activities to count.
     * @example
     * // Count the number of Activities
     * const count = await prisma.activity.count({
     *   where: {
     *     // ... the filter for the Activities we want to count
     *   }
     * })
    **/
    count<T extends ActivityCountArgs>(
      args?: Subset<T, ActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivityAggregateArgs>(args: Subset<T, ActivityAggregateArgs>): Prisma.PrismaPromise<GetActivityAggregateType<T>>

    /**
     * Group by Activity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivityGroupByArgs['orderBy'] }
        : { orderBy?: ActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Activity model
   */
  readonly fields: ActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Activity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Activity model
   */
  interface ActivityFieldRefs {
    readonly id: FieldRef<"Activity", 'String'>
    readonly userId: FieldRef<"Activity", 'String'>
    readonly type: FieldRef<"Activity", 'String'>
    readonly data: FieldRef<"Activity", 'Json'>
    readonly createdAt: FieldRef<"Activity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Activity findUnique
   */
  export type ActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity findUniqueOrThrow
   */
  export type ActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity findFirst
   */
  export type ActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Activities.
     */
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity findFirstOrThrow
   */
  export type ActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activity to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Activities.
     */
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity findMany
   */
  export type ActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter, which Activities to fetch.
     */
    where?: ActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Activities to fetch.
     */
    orderBy?: ActivityOrderByWithRelationInput | ActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Activities.
     */
    cursor?: ActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Activities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Activities.
     */
    skip?: number
    distinct?: ActivityScalarFieldEnum | ActivityScalarFieldEnum[]
  }

  /**
   * Activity create
   */
  export type ActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a Activity.
     */
    data: XOR<ActivityCreateInput, ActivityUncheckedCreateInput>
  }

  /**
   * Activity createMany
   */
  export type ActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Activities.
     */
    data: ActivityCreateManyInput | ActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Activity createManyAndReturn
   */
  export type ActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * The data used to create many Activities.
     */
    data: ActivityCreateManyInput | ActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Activity update
   */
  export type ActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a Activity.
     */
    data: XOR<ActivityUpdateInput, ActivityUncheckedUpdateInput>
    /**
     * Choose, which Activity to update.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity updateMany
   */
  export type ActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Activities.
     */
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyInput>
    /**
     * Filter which Activities to update
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to update.
     */
    limit?: number
  }

  /**
   * Activity updateManyAndReturn
   */
  export type ActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * The data used to update Activities.
     */
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyInput>
    /**
     * Filter which Activities to update
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Activity upsert
   */
  export type ActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the Activity to update in case it exists.
     */
    where: ActivityWhereUniqueInput
    /**
     * In case the Activity found by the `where` argument doesn't exist, create a new Activity with this data.
     */
    create: XOR<ActivityCreateInput, ActivityUncheckedCreateInput>
    /**
     * In case the Activity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivityUpdateInput, ActivityUncheckedUpdateInput>
  }

  /**
   * Activity delete
   */
  export type ActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
    /**
     * Filter which Activity to delete.
     */
    where: ActivityWhereUniqueInput
  }

  /**
   * Activity deleteMany
   */
  export type ActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Activities to delete
     */
    where?: ActivityWhereInput
    /**
     * Limit how many Activities to delete.
     */
    limit?: number
  }

  /**
   * Activity without action
   */
  export type ActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Activity
     */
    select?: ActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Activity
     */
    omit?: ActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityInclude<ExtArgs> | null
  }


  /**
   * Model SellerQuestionnaire
   */

  export type AggregateSellerQuestionnaire = {
    _count: SellerQuestionnaireCountAggregateOutputType | null
    _min: SellerQuestionnaireMinAggregateOutputType | null
    _max: SellerQuestionnaireMaxAggregateOutputType | null
  }

  export type SellerQuestionnaireMinAggregateOutputType = {
    id: string | null
    sellerId: string | null
    submitted: boolean | null
    submittedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerQuestionnaireMaxAggregateOutputType = {
    id: string | null
    sellerId: string | null
    submitted: boolean | null
    submittedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerQuestionnaireCountAggregateOutputType = {
    id: number
    sellerId: number
    data: number
    submitted: number
    submittedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SellerQuestionnaireMinAggregateInputType = {
    id?: true
    sellerId?: true
    submitted?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerQuestionnaireMaxAggregateInputType = {
    id?: true
    sellerId?: true
    submitted?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerQuestionnaireCountAggregateInputType = {
    id?: true
    sellerId?: true
    data?: true
    submitted?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SellerQuestionnaireAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerQuestionnaire to aggregate.
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerQuestionnaires to fetch.
     */
    orderBy?: SellerQuestionnaireOrderByWithRelationInput | SellerQuestionnaireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SellerQuestionnaireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerQuestionnaires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerQuestionnaires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SellerQuestionnaires
    **/
    _count?: true | SellerQuestionnaireCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SellerQuestionnaireMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SellerQuestionnaireMaxAggregateInputType
  }

  export type GetSellerQuestionnaireAggregateType<T extends SellerQuestionnaireAggregateArgs> = {
        [P in keyof T & keyof AggregateSellerQuestionnaire]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSellerQuestionnaire[P]>
      : GetScalarType<T[P], AggregateSellerQuestionnaire[P]>
  }




  export type SellerQuestionnaireGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SellerQuestionnaireWhereInput
    orderBy?: SellerQuestionnaireOrderByWithAggregationInput | SellerQuestionnaireOrderByWithAggregationInput[]
    by: SellerQuestionnaireScalarFieldEnum[] | SellerQuestionnaireScalarFieldEnum
    having?: SellerQuestionnaireScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SellerQuestionnaireCountAggregateInputType | true
    _min?: SellerQuestionnaireMinAggregateInputType
    _max?: SellerQuestionnaireMaxAggregateInputType
  }

  export type SellerQuestionnaireGroupByOutputType = {
    id: string
    sellerId: string
    data: JsonValue
    submitted: boolean
    submittedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SellerQuestionnaireCountAggregateOutputType | null
    _min: SellerQuestionnaireMinAggregateOutputType | null
    _max: SellerQuestionnaireMaxAggregateOutputType | null
  }

  type GetSellerQuestionnaireGroupByPayload<T extends SellerQuestionnaireGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SellerQuestionnaireGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SellerQuestionnaireGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SellerQuestionnaireGroupByOutputType[P]>
            : GetScalarType<T[P], SellerQuestionnaireGroupByOutputType[P]>
        }
      >
    >


  export type SellerQuestionnaireSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    data?: boolean
    submitted?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sellerQuestionnaire"]>

  export type SellerQuestionnaireSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    data?: boolean
    submitted?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sellerQuestionnaire"]>

  export type SellerQuestionnaireSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sellerId?: boolean
    data?: boolean
    submitted?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sellerQuestionnaire"]>

  export type SellerQuestionnaireSelectScalar = {
    id?: boolean
    sellerId?: boolean
    data?: boolean
    submitted?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SellerQuestionnaireOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sellerId" | "data" | "submitted" | "submittedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["sellerQuestionnaire"]>
  export type SellerQuestionnaireInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SellerQuestionnaireIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SellerQuestionnaireIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seller?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SellerQuestionnairePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SellerQuestionnaire"
    objects: {
      seller: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sellerId: string
      data: Prisma.JsonValue
      submitted: boolean
      submittedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sellerQuestionnaire"]>
    composites: {}
  }

  type SellerQuestionnaireGetPayload<S extends boolean | null | undefined | SellerQuestionnaireDefaultArgs> = $Result.GetResult<Prisma.$SellerQuestionnairePayload, S>

  type SellerQuestionnaireCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SellerQuestionnaireFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SellerQuestionnaireCountAggregateInputType | true
    }

  export interface SellerQuestionnaireDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SellerQuestionnaire'], meta: { name: 'SellerQuestionnaire' } }
    /**
     * Find zero or one SellerQuestionnaire that matches the filter.
     * @param {SellerQuestionnaireFindUniqueArgs} args - Arguments to find a SellerQuestionnaire
     * @example
     * // Get one SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SellerQuestionnaireFindUniqueArgs>(args: SelectSubset<T, SellerQuestionnaireFindUniqueArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SellerQuestionnaire that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SellerQuestionnaireFindUniqueOrThrowArgs} args - Arguments to find a SellerQuestionnaire
     * @example
     * // Get one SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SellerQuestionnaireFindUniqueOrThrowArgs>(args: SelectSubset<T, SellerQuestionnaireFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerQuestionnaire that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireFindFirstArgs} args - Arguments to find a SellerQuestionnaire
     * @example
     * // Get one SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SellerQuestionnaireFindFirstArgs>(args?: SelectSubset<T, SellerQuestionnaireFindFirstArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerQuestionnaire that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireFindFirstOrThrowArgs} args - Arguments to find a SellerQuestionnaire
     * @example
     * // Get one SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SellerQuestionnaireFindFirstOrThrowArgs>(args?: SelectSubset<T, SellerQuestionnaireFindFirstOrThrowArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SellerQuestionnaires that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SellerQuestionnaires
     * const sellerQuestionnaires = await prisma.sellerQuestionnaire.findMany()
     * 
     * // Get first 10 SellerQuestionnaires
     * const sellerQuestionnaires = await prisma.sellerQuestionnaire.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sellerQuestionnaireWithIdOnly = await prisma.sellerQuestionnaire.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SellerQuestionnaireFindManyArgs>(args?: SelectSubset<T, SellerQuestionnaireFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SellerQuestionnaire.
     * @param {SellerQuestionnaireCreateArgs} args - Arguments to create a SellerQuestionnaire.
     * @example
     * // Create one SellerQuestionnaire
     * const SellerQuestionnaire = await prisma.sellerQuestionnaire.create({
     *   data: {
     *     // ... data to create a SellerQuestionnaire
     *   }
     * })
     * 
     */
    create<T extends SellerQuestionnaireCreateArgs>(args: SelectSubset<T, SellerQuestionnaireCreateArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SellerQuestionnaires.
     * @param {SellerQuestionnaireCreateManyArgs} args - Arguments to create many SellerQuestionnaires.
     * @example
     * // Create many SellerQuestionnaires
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SellerQuestionnaireCreateManyArgs>(args?: SelectSubset<T, SellerQuestionnaireCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SellerQuestionnaires and returns the data saved in the database.
     * @param {SellerQuestionnaireCreateManyAndReturnArgs} args - Arguments to create many SellerQuestionnaires.
     * @example
     * // Create many SellerQuestionnaires
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SellerQuestionnaires and only return the `id`
     * const sellerQuestionnaireWithIdOnly = await prisma.sellerQuestionnaire.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SellerQuestionnaireCreateManyAndReturnArgs>(args?: SelectSubset<T, SellerQuestionnaireCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SellerQuestionnaire.
     * @param {SellerQuestionnaireDeleteArgs} args - Arguments to delete one SellerQuestionnaire.
     * @example
     * // Delete one SellerQuestionnaire
     * const SellerQuestionnaire = await prisma.sellerQuestionnaire.delete({
     *   where: {
     *     // ... filter to delete one SellerQuestionnaire
     *   }
     * })
     * 
     */
    delete<T extends SellerQuestionnaireDeleteArgs>(args: SelectSubset<T, SellerQuestionnaireDeleteArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SellerQuestionnaire.
     * @param {SellerQuestionnaireUpdateArgs} args - Arguments to update one SellerQuestionnaire.
     * @example
     * // Update one SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SellerQuestionnaireUpdateArgs>(args: SelectSubset<T, SellerQuestionnaireUpdateArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SellerQuestionnaires.
     * @param {SellerQuestionnaireDeleteManyArgs} args - Arguments to filter SellerQuestionnaires to delete.
     * @example
     * // Delete a few SellerQuestionnaires
     * const { count } = await prisma.sellerQuestionnaire.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SellerQuestionnaireDeleteManyArgs>(args?: SelectSubset<T, SellerQuestionnaireDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerQuestionnaires.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SellerQuestionnaires
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SellerQuestionnaireUpdateManyArgs>(args: SelectSubset<T, SellerQuestionnaireUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerQuestionnaires and returns the data updated in the database.
     * @param {SellerQuestionnaireUpdateManyAndReturnArgs} args - Arguments to update many SellerQuestionnaires.
     * @example
     * // Update many SellerQuestionnaires
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SellerQuestionnaires and only return the `id`
     * const sellerQuestionnaireWithIdOnly = await prisma.sellerQuestionnaire.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SellerQuestionnaireUpdateManyAndReturnArgs>(args: SelectSubset<T, SellerQuestionnaireUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SellerQuestionnaire.
     * @param {SellerQuestionnaireUpsertArgs} args - Arguments to update or create a SellerQuestionnaire.
     * @example
     * // Update or create a SellerQuestionnaire
     * const sellerQuestionnaire = await prisma.sellerQuestionnaire.upsert({
     *   create: {
     *     // ... data to create a SellerQuestionnaire
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SellerQuestionnaire we want to update
     *   }
     * })
     */
    upsert<T extends SellerQuestionnaireUpsertArgs>(args: SelectSubset<T, SellerQuestionnaireUpsertArgs<ExtArgs>>): Prisma__SellerQuestionnaireClient<$Result.GetResult<Prisma.$SellerQuestionnairePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SellerQuestionnaires.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireCountArgs} args - Arguments to filter SellerQuestionnaires to count.
     * @example
     * // Count the number of SellerQuestionnaires
     * const count = await prisma.sellerQuestionnaire.count({
     *   where: {
     *     // ... the filter for the SellerQuestionnaires we want to count
     *   }
     * })
    **/
    count<T extends SellerQuestionnaireCountArgs>(
      args?: Subset<T, SellerQuestionnaireCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SellerQuestionnaireCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SellerQuestionnaire.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SellerQuestionnaireAggregateArgs>(args: Subset<T, SellerQuestionnaireAggregateArgs>): Prisma.PrismaPromise<GetSellerQuestionnaireAggregateType<T>>

    /**
     * Group by SellerQuestionnaire.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerQuestionnaireGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SellerQuestionnaireGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SellerQuestionnaireGroupByArgs['orderBy'] }
        : { orderBy?: SellerQuestionnaireGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SellerQuestionnaireGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSellerQuestionnaireGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SellerQuestionnaire model
   */
  readonly fields: SellerQuestionnaireFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SellerQuestionnaire.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SellerQuestionnaireClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seller<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SellerQuestionnaire model
   */
  interface SellerQuestionnaireFieldRefs {
    readonly id: FieldRef<"SellerQuestionnaire", 'String'>
    readonly sellerId: FieldRef<"SellerQuestionnaire", 'String'>
    readonly data: FieldRef<"SellerQuestionnaire", 'Json'>
    readonly submitted: FieldRef<"SellerQuestionnaire", 'Boolean'>
    readonly submittedAt: FieldRef<"SellerQuestionnaire", 'DateTime'>
    readonly createdAt: FieldRef<"SellerQuestionnaire", 'DateTime'>
    readonly updatedAt: FieldRef<"SellerQuestionnaire", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SellerQuestionnaire findUnique
   */
  export type SellerQuestionnaireFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter, which SellerQuestionnaire to fetch.
     */
    where: SellerQuestionnaireWhereUniqueInput
  }

  /**
   * SellerQuestionnaire findUniqueOrThrow
   */
  export type SellerQuestionnaireFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter, which SellerQuestionnaire to fetch.
     */
    where: SellerQuestionnaireWhereUniqueInput
  }

  /**
   * SellerQuestionnaire findFirst
   */
  export type SellerQuestionnaireFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter, which SellerQuestionnaire to fetch.
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerQuestionnaires to fetch.
     */
    orderBy?: SellerQuestionnaireOrderByWithRelationInput | SellerQuestionnaireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerQuestionnaires.
     */
    cursor?: SellerQuestionnaireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerQuestionnaires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerQuestionnaires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerQuestionnaires.
     */
    distinct?: SellerQuestionnaireScalarFieldEnum | SellerQuestionnaireScalarFieldEnum[]
  }

  /**
   * SellerQuestionnaire findFirstOrThrow
   */
  export type SellerQuestionnaireFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter, which SellerQuestionnaire to fetch.
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerQuestionnaires to fetch.
     */
    orderBy?: SellerQuestionnaireOrderByWithRelationInput | SellerQuestionnaireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerQuestionnaires.
     */
    cursor?: SellerQuestionnaireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerQuestionnaires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerQuestionnaires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerQuestionnaires.
     */
    distinct?: SellerQuestionnaireScalarFieldEnum | SellerQuestionnaireScalarFieldEnum[]
  }

  /**
   * SellerQuestionnaire findMany
   */
  export type SellerQuestionnaireFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter, which SellerQuestionnaires to fetch.
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerQuestionnaires to fetch.
     */
    orderBy?: SellerQuestionnaireOrderByWithRelationInput | SellerQuestionnaireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SellerQuestionnaires.
     */
    cursor?: SellerQuestionnaireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerQuestionnaires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerQuestionnaires.
     */
    skip?: number
    distinct?: SellerQuestionnaireScalarFieldEnum | SellerQuestionnaireScalarFieldEnum[]
  }

  /**
   * SellerQuestionnaire create
   */
  export type SellerQuestionnaireCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * The data needed to create a SellerQuestionnaire.
     */
    data: XOR<SellerQuestionnaireCreateInput, SellerQuestionnaireUncheckedCreateInput>
  }

  /**
   * SellerQuestionnaire createMany
   */
  export type SellerQuestionnaireCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SellerQuestionnaires.
     */
    data: SellerQuestionnaireCreateManyInput | SellerQuestionnaireCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SellerQuestionnaire createManyAndReturn
   */
  export type SellerQuestionnaireCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * The data used to create many SellerQuestionnaires.
     */
    data: SellerQuestionnaireCreateManyInput | SellerQuestionnaireCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SellerQuestionnaire update
   */
  export type SellerQuestionnaireUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * The data needed to update a SellerQuestionnaire.
     */
    data: XOR<SellerQuestionnaireUpdateInput, SellerQuestionnaireUncheckedUpdateInput>
    /**
     * Choose, which SellerQuestionnaire to update.
     */
    where: SellerQuestionnaireWhereUniqueInput
  }

  /**
   * SellerQuestionnaire updateMany
   */
  export type SellerQuestionnaireUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SellerQuestionnaires.
     */
    data: XOR<SellerQuestionnaireUpdateManyMutationInput, SellerQuestionnaireUncheckedUpdateManyInput>
    /**
     * Filter which SellerQuestionnaires to update
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * Limit how many SellerQuestionnaires to update.
     */
    limit?: number
  }

  /**
   * SellerQuestionnaire updateManyAndReturn
   */
  export type SellerQuestionnaireUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * The data used to update SellerQuestionnaires.
     */
    data: XOR<SellerQuestionnaireUpdateManyMutationInput, SellerQuestionnaireUncheckedUpdateManyInput>
    /**
     * Filter which SellerQuestionnaires to update
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * Limit how many SellerQuestionnaires to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SellerQuestionnaire upsert
   */
  export type SellerQuestionnaireUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * The filter to search for the SellerQuestionnaire to update in case it exists.
     */
    where: SellerQuestionnaireWhereUniqueInput
    /**
     * In case the SellerQuestionnaire found by the `where` argument doesn't exist, create a new SellerQuestionnaire with this data.
     */
    create: XOR<SellerQuestionnaireCreateInput, SellerQuestionnaireUncheckedCreateInput>
    /**
     * In case the SellerQuestionnaire was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SellerQuestionnaireUpdateInput, SellerQuestionnaireUncheckedUpdateInput>
  }

  /**
   * SellerQuestionnaire delete
   */
  export type SellerQuestionnaireDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
    /**
     * Filter which SellerQuestionnaire to delete.
     */
    where: SellerQuestionnaireWhereUniqueInput
  }

  /**
   * SellerQuestionnaire deleteMany
   */
  export type SellerQuestionnaireDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerQuestionnaires to delete
     */
    where?: SellerQuestionnaireWhereInput
    /**
     * Limit how many SellerQuestionnaires to delete.
     */
    limit?: number
  }

  /**
   * SellerQuestionnaire without action
   */
  export type SellerQuestionnaireDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerQuestionnaire
     */
    select?: SellerQuestionnaireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerQuestionnaire
     */
    omit?: SellerQuestionnaireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SellerQuestionnaireInclude<ExtArgs> | null
  }


  /**
   * Model PreCloseChecklist
   */

  export type AggregatePreCloseChecklist = {
    _count: PreCloseChecklistCountAggregateOutputType | null
    _min: PreCloseChecklistMinAggregateOutputType | null
    _max: PreCloseChecklistMaxAggregateOutputType | null
  }

  export type PreCloseChecklistMinAggregateOutputType = {
    id: string | null
    listingId: string | null
    lastUpdatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PreCloseChecklistMaxAggregateOutputType = {
    id: string | null
    listingId: string | null
    lastUpdatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PreCloseChecklistCountAggregateOutputType = {
    id: number
    listingId: number
    buyerItems: number
    sellerItems: number
    brokerItems: number
    lastUpdatedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PreCloseChecklistMinAggregateInputType = {
    id?: true
    listingId?: true
    lastUpdatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PreCloseChecklistMaxAggregateInputType = {
    id?: true
    listingId?: true
    lastUpdatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PreCloseChecklistCountAggregateInputType = {
    id?: true
    listingId?: true
    buyerItems?: true
    sellerItems?: true
    brokerItems?: true
    lastUpdatedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PreCloseChecklistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreCloseChecklist to aggregate.
     */
    where?: PreCloseChecklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreCloseChecklists to fetch.
     */
    orderBy?: PreCloseChecklistOrderByWithRelationInput | PreCloseChecklistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PreCloseChecklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreCloseChecklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreCloseChecklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PreCloseChecklists
    **/
    _count?: true | PreCloseChecklistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PreCloseChecklistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PreCloseChecklistMaxAggregateInputType
  }

  export type GetPreCloseChecklistAggregateType<T extends PreCloseChecklistAggregateArgs> = {
        [P in keyof T & keyof AggregatePreCloseChecklist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePreCloseChecklist[P]>
      : GetScalarType<T[P], AggregatePreCloseChecklist[P]>
  }




  export type PreCloseChecklistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreCloseChecklistWhereInput
    orderBy?: PreCloseChecklistOrderByWithAggregationInput | PreCloseChecklistOrderByWithAggregationInput[]
    by: PreCloseChecklistScalarFieldEnum[] | PreCloseChecklistScalarFieldEnum
    having?: PreCloseChecklistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PreCloseChecklistCountAggregateInputType | true
    _min?: PreCloseChecklistMinAggregateInputType
    _max?: PreCloseChecklistMaxAggregateInputType
  }

  export type PreCloseChecklistGroupByOutputType = {
    id: string
    listingId: string
    buyerItems: JsonValue
    sellerItems: JsonValue
    brokerItems: JsonValue
    lastUpdatedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: PreCloseChecklistCountAggregateOutputType | null
    _min: PreCloseChecklistMinAggregateOutputType | null
    _max: PreCloseChecklistMaxAggregateOutputType | null
  }

  type GetPreCloseChecklistGroupByPayload<T extends PreCloseChecklistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PreCloseChecklistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PreCloseChecklistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PreCloseChecklistGroupByOutputType[P]>
            : GetScalarType<T[P], PreCloseChecklistGroupByOutputType[P]>
        }
      >
    >


  export type PreCloseChecklistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    buyerItems?: boolean
    sellerItems?: boolean
    brokerItems?: boolean
    lastUpdatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["preCloseChecklist"]>

  export type PreCloseChecklistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    buyerItems?: boolean
    sellerItems?: boolean
    brokerItems?: boolean
    lastUpdatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["preCloseChecklist"]>

  export type PreCloseChecklistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    buyerItems?: boolean
    sellerItems?: boolean
    brokerItems?: boolean
    lastUpdatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["preCloseChecklist"]>

  export type PreCloseChecklistSelectScalar = {
    id?: boolean
    listingId?: boolean
    buyerItems?: boolean
    sellerItems?: boolean
    brokerItems?: boolean
    lastUpdatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PreCloseChecklistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "listingId" | "buyerItems" | "sellerItems" | "brokerItems" | "lastUpdatedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["preCloseChecklist"]>
  export type PreCloseChecklistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }
  export type PreCloseChecklistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }
  export type PreCloseChecklistIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
    lastUpdatedByUser?: boolean | PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>
  }

  export type $PreCloseChecklistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PreCloseChecklist"
    objects: {
      listing: Prisma.$ListingPayload<ExtArgs>
      lastUpdatedByUser: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      listingId: string
      buyerItems: Prisma.JsonValue
      sellerItems: Prisma.JsonValue
      brokerItems: Prisma.JsonValue
      lastUpdatedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["preCloseChecklist"]>
    composites: {}
  }

  type PreCloseChecklistGetPayload<S extends boolean | null | undefined | PreCloseChecklistDefaultArgs> = $Result.GetResult<Prisma.$PreCloseChecklistPayload, S>

  type PreCloseChecklistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PreCloseChecklistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PreCloseChecklistCountAggregateInputType | true
    }

  export interface PreCloseChecklistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PreCloseChecklist'], meta: { name: 'PreCloseChecklist' } }
    /**
     * Find zero or one PreCloseChecklist that matches the filter.
     * @param {PreCloseChecklistFindUniqueArgs} args - Arguments to find a PreCloseChecklist
     * @example
     * // Get one PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PreCloseChecklistFindUniqueArgs>(args: SelectSubset<T, PreCloseChecklistFindUniqueArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PreCloseChecklist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PreCloseChecklistFindUniqueOrThrowArgs} args - Arguments to find a PreCloseChecklist
     * @example
     * // Get one PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PreCloseChecklistFindUniqueOrThrowArgs>(args: SelectSubset<T, PreCloseChecklistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreCloseChecklist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistFindFirstArgs} args - Arguments to find a PreCloseChecklist
     * @example
     * // Get one PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PreCloseChecklistFindFirstArgs>(args?: SelectSubset<T, PreCloseChecklistFindFirstArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreCloseChecklist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistFindFirstOrThrowArgs} args - Arguments to find a PreCloseChecklist
     * @example
     * // Get one PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PreCloseChecklistFindFirstOrThrowArgs>(args?: SelectSubset<T, PreCloseChecklistFindFirstOrThrowArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PreCloseChecklists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PreCloseChecklists
     * const preCloseChecklists = await prisma.preCloseChecklist.findMany()
     * 
     * // Get first 10 PreCloseChecklists
     * const preCloseChecklists = await prisma.preCloseChecklist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const preCloseChecklistWithIdOnly = await prisma.preCloseChecklist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PreCloseChecklistFindManyArgs>(args?: SelectSubset<T, PreCloseChecklistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PreCloseChecklist.
     * @param {PreCloseChecklistCreateArgs} args - Arguments to create a PreCloseChecklist.
     * @example
     * // Create one PreCloseChecklist
     * const PreCloseChecklist = await prisma.preCloseChecklist.create({
     *   data: {
     *     // ... data to create a PreCloseChecklist
     *   }
     * })
     * 
     */
    create<T extends PreCloseChecklistCreateArgs>(args: SelectSubset<T, PreCloseChecklistCreateArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PreCloseChecklists.
     * @param {PreCloseChecklistCreateManyArgs} args - Arguments to create many PreCloseChecklists.
     * @example
     * // Create many PreCloseChecklists
     * const preCloseChecklist = await prisma.preCloseChecklist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PreCloseChecklistCreateManyArgs>(args?: SelectSubset<T, PreCloseChecklistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PreCloseChecklists and returns the data saved in the database.
     * @param {PreCloseChecklistCreateManyAndReturnArgs} args - Arguments to create many PreCloseChecklists.
     * @example
     * // Create many PreCloseChecklists
     * const preCloseChecklist = await prisma.preCloseChecklist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PreCloseChecklists and only return the `id`
     * const preCloseChecklistWithIdOnly = await prisma.preCloseChecklist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PreCloseChecklistCreateManyAndReturnArgs>(args?: SelectSubset<T, PreCloseChecklistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PreCloseChecklist.
     * @param {PreCloseChecklistDeleteArgs} args - Arguments to delete one PreCloseChecklist.
     * @example
     * // Delete one PreCloseChecklist
     * const PreCloseChecklist = await prisma.preCloseChecklist.delete({
     *   where: {
     *     // ... filter to delete one PreCloseChecklist
     *   }
     * })
     * 
     */
    delete<T extends PreCloseChecklistDeleteArgs>(args: SelectSubset<T, PreCloseChecklistDeleteArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PreCloseChecklist.
     * @param {PreCloseChecklistUpdateArgs} args - Arguments to update one PreCloseChecklist.
     * @example
     * // Update one PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PreCloseChecklistUpdateArgs>(args: SelectSubset<T, PreCloseChecklistUpdateArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PreCloseChecklists.
     * @param {PreCloseChecklistDeleteManyArgs} args - Arguments to filter PreCloseChecklists to delete.
     * @example
     * // Delete a few PreCloseChecklists
     * const { count } = await prisma.preCloseChecklist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PreCloseChecklistDeleteManyArgs>(args?: SelectSubset<T, PreCloseChecklistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PreCloseChecklists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PreCloseChecklists
     * const preCloseChecklist = await prisma.preCloseChecklist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PreCloseChecklistUpdateManyArgs>(args: SelectSubset<T, PreCloseChecklistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PreCloseChecklists and returns the data updated in the database.
     * @param {PreCloseChecklistUpdateManyAndReturnArgs} args - Arguments to update many PreCloseChecklists.
     * @example
     * // Update many PreCloseChecklists
     * const preCloseChecklist = await prisma.preCloseChecklist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PreCloseChecklists and only return the `id`
     * const preCloseChecklistWithIdOnly = await prisma.preCloseChecklist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PreCloseChecklistUpdateManyAndReturnArgs>(args: SelectSubset<T, PreCloseChecklistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PreCloseChecklist.
     * @param {PreCloseChecklistUpsertArgs} args - Arguments to update or create a PreCloseChecklist.
     * @example
     * // Update or create a PreCloseChecklist
     * const preCloseChecklist = await prisma.preCloseChecklist.upsert({
     *   create: {
     *     // ... data to create a PreCloseChecklist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PreCloseChecklist we want to update
     *   }
     * })
     */
    upsert<T extends PreCloseChecklistUpsertArgs>(args: SelectSubset<T, PreCloseChecklistUpsertArgs<ExtArgs>>): Prisma__PreCloseChecklistClient<$Result.GetResult<Prisma.$PreCloseChecklistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PreCloseChecklists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistCountArgs} args - Arguments to filter PreCloseChecklists to count.
     * @example
     * // Count the number of PreCloseChecklists
     * const count = await prisma.preCloseChecklist.count({
     *   where: {
     *     // ... the filter for the PreCloseChecklists we want to count
     *   }
     * })
    **/
    count<T extends PreCloseChecklistCountArgs>(
      args?: Subset<T, PreCloseChecklistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PreCloseChecklistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PreCloseChecklist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PreCloseChecklistAggregateArgs>(args: Subset<T, PreCloseChecklistAggregateArgs>): Prisma.PrismaPromise<GetPreCloseChecklistAggregateType<T>>

    /**
     * Group by PreCloseChecklist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreCloseChecklistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PreCloseChecklistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PreCloseChecklistGroupByArgs['orderBy'] }
        : { orderBy?: PreCloseChecklistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PreCloseChecklistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPreCloseChecklistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PreCloseChecklist model
   */
  readonly fields: PreCloseChecklistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PreCloseChecklist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PreCloseChecklistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listing<T extends ListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ListingDefaultArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lastUpdatedByUser<T extends PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs> = {}>(args?: Subset<T, PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PreCloseChecklist model
   */
  interface PreCloseChecklistFieldRefs {
    readonly id: FieldRef<"PreCloseChecklist", 'String'>
    readonly listingId: FieldRef<"PreCloseChecklist", 'String'>
    readonly buyerItems: FieldRef<"PreCloseChecklist", 'Json'>
    readonly sellerItems: FieldRef<"PreCloseChecklist", 'Json'>
    readonly brokerItems: FieldRef<"PreCloseChecklist", 'Json'>
    readonly lastUpdatedBy: FieldRef<"PreCloseChecklist", 'String'>
    readonly createdAt: FieldRef<"PreCloseChecklist", 'DateTime'>
    readonly updatedAt: FieldRef<"PreCloseChecklist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PreCloseChecklist findUnique
   */
  export type PreCloseChecklistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter, which PreCloseChecklist to fetch.
     */
    where: PreCloseChecklistWhereUniqueInput
  }

  /**
   * PreCloseChecklist findUniqueOrThrow
   */
  export type PreCloseChecklistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter, which PreCloseChecklist to fetch.
     */
    where: PreCloseChecklistWhereUniqueInput
  }

  /**
   * PreCloseChecklist findFirst
   */
  export type PreCloseChecklistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter, which PreCloseChecklist to fetch.
     */
    where?: PreCloseChecklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreCloseChecklists to fetch.
     */
    orderBy?: PreCloseChecklistOrderByWithRelationInput | PreCloseChecklistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreCloseChecklists.
     */
    cursor?: PreCloseChecklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreCloseChecklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreCloseChecklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreCloseChecklists.
     */
    distinct?: PreCloseChecklistScalarFieldEnum | PreCloseChecklistScalarFieldEnum[]
  }

  /**
   * PreCloseChecklist findFirstOrThrow
   */
  export type PreCloseChecklistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter, which PreCloseChecklist to fetch.
     */
    where?: PreCloseChecklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreCloseChecklists to fetch.
     */
    orderBy?: PreCloseChecklistOrderByWithRelationInput | PreCloseChecklistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreCloseChecklists.
     */
    cursor?: PreCloseChecklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreCloseChecklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreCloseChecklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreCloseChecklists.
     */
    distinct?: PreCloseChecklistScalarFieldEnum | PreCloseChecklistScalarFieldEnum[]
  }

  /**
   * PreCloseChecklist findMany
   */
  export type PreCloseChecklistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter, which PreCloseChecklists to fetch.
     */
    where?: PreCloseChecklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreCloseChecklists to fetch.
     */
    orderBy?: PreCloseChecklistOrderByWithRelationInput | PreCloseChecklistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PreCloseChecklists.
     */
    cursor?: PreCloseChecklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreCloseChecklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreCloseChecklists.
     */
    skip?: number
    distinct?: PreCloseChecklistScalarFieldEnum | PreCloseChecklistScalarFieldEnum[]
  }

  /**
   * PreCloseChecklist create
   */
  export type PreCloseChecklistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * The data needed to create a PreCloseChecklist.
     */
    data: XOR<PreCloseChecklistCreateInput, PreCloseChecklistUncheckedCreateInput>
  }

  /**
   * PreCloseChecklist createMany
   */
  export type PreCloseChecklistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PreCloseChecklists.
     */
    data: PreCloseChecklistCreateManyInput | PreCloseChecklistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PreCloseChecklist createManyAndReturn
   */
  export type PreCloseChecklistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * The data used to create many PreCloseChecklists.
     */
    data: PreCloseChecklistCreateManyInput | PreCloseChecklistCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PreCloseChecklist update
   */
  export type PreCloseChecklistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * The data needed to update a PreCloseChecklist.
     */
    data: XOR<PreCloseChecklistUpdateInput, PreCloseChecklistUncheckedUpdateInput>
    /**
     * Choose, which PreCloseChecklist to update.
     */
    where: PreCloseChecklistWhereUniqueInput
  }

  /**
   * PreCloseChecklist updateMany
   */
  export type PreCloseChecklistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PreCloseChecklists.
     */
    data: XOR<PreCloseChecklistUpdateManyMutationInput, PreCloseChecklistUncheckedUpdateManyInput>
    /**
     * Filter which PreCloseChecklists to update
     */
    where?: PreCloseChecklistWhereInput
    /**
     * Limit how many PreCloseChecklists to update.
     */
    limit?: number
  }

  /**
   * PreCloseChecklist updateManyAndReturn
   */
  export type PreCloseChecklistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * The data used to update PreCloseChecklists.
     */
    data: XOR<PreCloseChecklistUpdateManyMutationInput, PreCloseChecklistUncheckedUpdateManyInput>
    /**
     * Filter which PreCloseChecklists to update
     */
    where?: PreCloseChecklistWhereInput
    /**
     * Limit how many PreCloseChecklists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PreCloseChecklist upsert
   */
  export type PreCloseChecklistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * The filter to search for the PreCloseChecklist to update in case it exists.
     */
    where: PreCloseChecklistWhereUniqueInput
    /**
     * In case the PreCloseChecklist found by the `where` argument doesn't exist, create a new PreCloseChecklist with this data.
     */
    create: XOR<PreCloseChecklistCreateInput, PreCloseChecklistUncheckedCreateInput>
    /**
     * In case the PreCloseChecklist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PreCloseChecklistUpdateInput, PreCloseChecklistUncheckedUpdateInput>
  }

  /**
   * PreCloseChecklist delete
   */
  export type PreCloseChecklistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
    /**
     * Filter which PreCloseChecklist to delete.
     */
    where: PreCloseChecklistWhereUniqueInput
  }

  /**
   * PreCloseChecklist deleteMany
   */
  export type PreCloseChecklistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreCloseChecklists to delete
     */
    where?: PreCloseChecklistWhereInput
    /**
     * Limit how many PreCloseChecklists to delete.
     */
    limit?: number
  }

  /**
   * PreCloseChecklist.lastUpdatedByUser
   */
  export type PreCloseChecklist$lastUpdatedByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PreCloseChecklist without action
   */
  export type PreCloseChecklistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreCloseChecklist
     */
    select?: PreCloseChecklistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreCloseChecklist
     */
    omit?: PreCloseChecklistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreCloseChecklistInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    type: 'type',
    status: 'status',
    category: 'category',
    url: 'url',
    fileName: 'fileName',
    fileSize: 'fileSize',
    operationType: 'operationType',
    stepId: 'stepId',
    sellerId: 'sellerId',
    buyerId: 'buyerId',
    listingId: 'listingId',
    uploadedAt: 'uploadedAt',
    downloadedAt: 'downloadedAt',
    uploadedBy: 'uploadedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    managerId: 'managerId',
    unreadCount: 'unreadCount',
    lastReadAt: 'lastReadAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SellerProgressScalarFieldEnum: {
    id: 'id',
    sellerId: 'sellerId',
    currentStep: 'currentStep',
    completedSteps: 'completedSteps',
    selectedListingId: 'selectedListingId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SellerProgressScalarFieldEnum = (typeof SellerProgressScalarFieldEnum)[keyof typeof SellerProgressScalarFieldEnum]


  export const BuyerProgressScalarFieldEnum: {
    id: 'id',
    buyerId: 'buyerId',
    currentStep: 'currentStep',
    completedSteps: 'completedSteps',
    selectedListingId: 'selectedListingId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BuyerProgressScalarFieldEnum = (typeof BuyerProgressScalarFieldEnum)[keyof typeof BuyerProgressScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    subject: 'subject',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    readAt: 'readAt',
    senderId: 'senderId',
    senderType: 'senderType',
    senderName: 'senderName',
    receiverId: 'receiverId',
    receiverType: 'receiverType',
    receiverName: 'receiverName',
    status: 'status',
    isRead: 'isRead',
    isArchived: 'isArchived',
    parentMessageId: 'parentMessageId',
    threadId: 'threadId'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const MessageAttachmentScalarFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    fileName: 'fileName',
    fileSize: 'fileSize',
    fileType: 'fileType',
    fileUrl: 'fileUrl',
    uploadedAt: 'uploadedAt'
  };

  export type MessageAttachmentScalarFieldEnum = (typeof MessageAttachmentScalarFieldEnum)[keyof typeof MessageAttachmentScalarFieldEnum]


  export const ListingScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    price: 'price',
    status: 'status',
    createdAt: 'createdAt',
    sellerId: 'sellerId'
  };

  export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum]


  export const ActivityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    data: 'data',
    createdAt: 'createdAt'
  };

  export type ActivityScalarFieldEnum = (typeof ActivityScalarFieldEnum)[keyof typeof ActivityScalarFieldEnum]


  export const SellerQuestionnaireScalarFieldEnum: {
    id: 'id',
    sellerId: 'sellerId',
    data: 'data',
    submitted: 'submitted',
    submittedAt: 'submittedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SellerQuestionnaireScalarFieldEnum = (typeof SellerQuestionnaireScalarFieldEnum)[keyof typeof SellerQuestionnaireScalarFieldEnum]


  export const PreCloseChecklistScalarFieldEnum: {
    id: 'id',
    listingId: 'listingId',
    buyerItems: 'buyerItems',
    sellerItems: 'sellerItems',
    brokerItems: 'brokerItems',
    lastUpdatedBy: 'lastUpdatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PreCloseChecklistScalarFieldEnum = (typeof PreCloseChecklistScalarFieldEnum)[keyof typeof PreCloseChecklistScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'DocumentCategory'
   */
  export type EnumDocumentCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentCategory'>
    


  /**
   * Reference to a field of type 'DocumentCategory[]'
   */
  export type ListEnumDocumentCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentCategory[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DocumentOperationType'
   */
  export type EnumDocumentOperationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentOperationType'>
    


  /**
   * Reference to a field of type 'DocumentOperationType[]'
   */
  export type ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentOperationType[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MessageStatus'
   */
  export type EnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus'>
    


  /**
   * Reference to a field of type 'MessageStatus[]'
   */
  export type ListEnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'ListingStatus'
   */
  export type EnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus'>
    


  /**
   * Reference to a field of type 'ListingStatus[]'
   */
  export type ListEnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFilter<"Document"> | $Enums.DocumentCategory
    url?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    operationType?: EnumDocumentOperationTypeFilter<"Document"> | $Enums.DocumentOperationType
    stepId?: IntNullableFilter<"Document"> | number | null
    sellerId?: StringFilter<"Document"> | string
    buyerId?: StringNullableFilter<"Document"> | string | null
    listingId?: StringNullableFilter<"Document"> | string | null
    uploadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    downloadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    uploadedBy?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    buyer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    listing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
    uploader?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    status?: SortOrder
    category?: SortOrder
    url?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    operationType?: SortOrder
    stepId?: SortOrderInput | SortOrder
    sellerId?: SortOrder
    buyerId?: SortOrderInput | SortOrder
    listingId?: SortOrderInput | SortOrder
    uploadedAt?: SortOrderInput | SortOrder
    downloadedAt?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    seller?: UserOrderByWithRelationInput
    buyer?: UserOrderByWithRelationInput
    listing?: ListingOrderByWithRelationInput
    uploader?: UserOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFilter<"Document"> | $Enums.DocumentCategory
    url?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    operationType?: EnumDocumentOperationTypeFilter<"Document"> | $Enums.DocumentOperationType
    stepId?: IntNullableFilter<"Document"> | number | null
    sellerId?: StringFilter<"Document"> | string
    buyerId?: StringNullableFilter<"Document"> | string | null
    listingId?: StringNullableFilter<"Document"> | string | null
    uploadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    downloadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    uploadedBy?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    buyer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    listing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
    uploader?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    status?: SortOrder
    category?: SortOrder
    url?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    operationType?: SortOrder
    stepId?: SortOrderInput | SortOrder
    sellerId?: SortOrder
    buyerId?: SortOrderInput | SortOrder
    listingId?: SortOrderInput | SortOrder
    uploadedAt?: SortOrderInput | SortOrder
    downloadedAt?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    type?: EnumDocumentTypeWithAggregatesFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusWithAggregatesFilter<"Document"> | $Enums.DocumentStatus
    category?: EnumDocumentCategoryWithAggregatesFilter<"Document"> | $Enums.DocumentCategory
    url?: StringNullableWithAggregatesFilter<"Document"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"Document"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"Document"> | number | null
    operationType?: EnumDocumentOperationTypeWithAggregatesFilter<"Document"> | $Enums.DocumentOperationType
    stepId?: IntNullableWithAggregatesFilter<"Document"> | number | null
    sellerId?: StringWithAggregatesFilter<"Document"> | string
    buyerId?: StringNullableWithAggregatesFilter<"Document"> | string | null
    listingId?: StringNullableWithAggregatesFilter<"Document"> | string | null
    uploadedAt?: DateTimeNullableWithAggregatesFilter<"Document"> | Date | string | null
    downloadedAt?: DateTimeNullableWithAggregatesFilter<"Document"> | Date | string | null
    uploadedBy?: StringNullableWithAggregatesFilter<"Document"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    managerId?: StringNullableFilter<"User"> | string | null
    unreadCount?: IntFilter<"User"> | number
    lastReadAt?: DateTimeNullableFilter<"User"> | Date | string | null
    managedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    managing?: UserListRelationFilter
    listings?: ListingListRelationFilter
    buyerDocs?: DocumentListRelationFilter
    sellerDocs?: DocumentListRelationFilter
    uploadedDocuments?: DocumentListRelationFilter
    activities?: ActivityListRelationFilter
    sentMessages?: MessageListRelationFilter
    receivedMessages?: MessageListRelationFilter
    buyingListings?: ListingListRelationFilter
    sellerProgress?: SellerProgressListRelationFilter
    buyerProgress?: BuyerProgressListRelationFilter
    sellerQuestionnaire?: XOR<SellerQuestionnaireNullableScalarRelationFilter, SellerQuestionnaireWhereInput> | null
    updatedChecklists?: PreCloseChecklistListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    managerId?: SortOrderInput | SortOrder
    unreadCount?: SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    managedBy?: UserOrderByWithRelationInput
    managing?: UserOrderByRelationAggregateInput
    listings?: ListingOrderByRelationAggregateInput
    buyerDocs?: DocumentOrderByRelationAggregateInput
    sellerDocs?: DocumentOrderByRelationAggregateInput
    uploadedDocuments?: DocumentOrderByRelationAggregateInput
    activities?: ActivityOrderByRelationAggregateInput
    sentMessages?: MessageOrderByRelationAggregateInput
    receivedMessages?: MessageOrderByRelationAggregateInput
    buyingListings?: ListingOrderByRelationAggregateInput
    sellerProgress?: SellerProgressOrderByRelationAggregateInput
    buyerProgress?: BuyerProgressOrderByRelationAggregateInput
    sellerQuestionnaire?: SellerQuestionnaireOrderByWithRelationInput
    updatedChecklists?: PreCloseChecklistOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    managerId?: StringNullableFilter<"User"> | string | null
    unreadCount?: IntFilter<"User"> | number
    lastReadAt?: DateTimeNullableFilter<"User"> | Date | string | null
    managedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    managing?: UserListRelationFilter
    listings?: ListingListRelationFilter
    buyerDocs?: DocumentListRelationFilter
    sellerDocs?: DocumentListRelationFilter
    uploadedDocuments?: DocumentListRelationFilter
    activities?: ActivityListRelationFilter
    sentMessages?: MessageListRelationFilter
    receivedMessages?: MessageListRelationFilter
    buyingListings?: ListingListRelationFilter
    sellerProgress?: SellerProgressListRelationFilter
    buyerProgress?: BuyerProgressListRelationFilter
    sellerQuestionnaire?: XOR<SellerQuestionnaireNullableScalarRelationFilter, SellerQuestionnaireWhereInput> | null
    updatedChecklists?: PreCloseChecklistListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    managerId?: SortOrderInput | SortOrder
    unreadCount?: SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    managerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    unreadCount?: IntWithAggregatesFilter<"User"> | number
    lastReadAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type SellerProgressWhereInput = {
    AND?: SellerProgressWhereInput | SellerProgressWhereInput[]
    OR?: SellerProgressWhereInput[]
    NOT?: SellerProgressWhereInput | SellerProgressWhereInput[]
    id?: StringFilter<"SellerProgress"> | string
    sellerId?: StringFilter<"SellerProgress"> | string
    currentStep?: IntFilter<"SellerProgress"> | number
    completedSteps?: JsonFilter<"SellerProgress">
    selectedListingId?: StringNullableFilter<"SellerProgress"> | string | null
    createdAt?: DateTimeFilter<"SellerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"SellerProgress"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    selectedListing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
  }

  export type SellerProgressOrderByWithRelationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    seller?: UserOrderByWithRelationInput
    selectedListing?: ListingOrderByWithRelationInput
  }

  export type SellerProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sellerId?: string
    AND?: SellerProgressWhereInput | SellerProgressWhereInput[]
    OR?: SellerProgressWhereInput[]
    NOT?: SellerProgressWhereInput | SellerProgressWhereInput[]
    currentStep?: IntFilter<"SellerProgress"> | number
    completedSteps?: JsonFilter<"SellerProgress">
    selectedListingId?: StringNullableFilter<"SellerProgress"> | string | null
    createdAt?: DateTimeFilter<"SellerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"SellerProgress"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    selectedListing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
  }, "id" | "sellerId">

  export type SellerProgressOrderByWithAggregationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SellerProgressCountOrderByAggregateInput
    _avg?: SellerProgressAvgOrderByAggregateInput
    _max?: SellerProgressMaxOrderByAggregateInput
    _min?: SellerProgressMinOrderByAggregateInput
    _sum?: SellerProgressSumOrderByAggregateInput
  }

  export type SellerProgressScalarWhereWithAggregatesInput = {
    AND?: SellerProgressScalarWhereWithAggregatesInput | SellerProgressScalarWhereWithAggregatesInput[]
    OR?: SellerProgressScalarWhereWithAggregatesInput[]
    NOT?: SellerProgressScalarWhereWithAggregatesInput | SellerProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SellerProgress"> | string
    sellerId?: StringWithAggregatesFilter<"SellerProgress"> | string
    currentStep?: IntWithAggregatesFilter<"SellerProgress"> | number
    completedSteps?: JsonWithAggregatesFilter<"SellerProgress">
    selectedListingId?: StringNullableWithAggregatesFilter<"SellerProgress"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SellerProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SellerProgress"> | Date | string
  }

  export type BuyerProgressWhereInput = {
    AND?: BuyerProgressWhereInput | BuyerProgressWhereInput[]
    OR?: BuyerProgressWhereInput[]
    NOT?: BuyerProgressWhereInput | BuyerProgressWhereInput[]
    id?: StringFilter<"BuyerProgress"> | string
    buyerId?: StringFilter<"BuyerProgress"> | string
    currentStep?: IntFilter<"BuyerProgress"> | number
    completedSteps?: JsonFilter<"BuyerProgress">
    selectedListingId?: StringNullableFilter<"BuyerProgress"> | string | null
    createdAt?: DateTimeFilter<"BuyerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"BuyerProgress"> | Date | string
    buyer?: XOR<UserScalarRelationFilter, UserWhereInput>
    selectedListing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
  }

  export type BuyerProgressOrderByWithRelationInput = {
    id?: SortOrder
    buyerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    buyer?: UserOrderByWithRelationInput
    selectedListing?: ListingOrderByWithRelationInput
  }

  export type BuyerProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    buyerId?: string
    AND?: BuyerProgressWhereInput | BuyerProgressWhereInput[]
    OR?: BuyerProgressWhereInput[]
    NOT?: BuyerProgressWhereInput | BuyerProgressWhereInput[]
    currentStep?: IntFilter<"BuyerProgress"> | number
    completedSteps?: JsonFilter<"BuyerProgress">
    selectedListingId?: StringNullableFilter<"BuyerProgress"> | string | null
    createdAt?: DateTimeFilter<"BuyerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"BuyerProgress"> | Date | string
    buyer?: XOR<UserScalarRelationFilter, UserWhereInput>
    selectedListing?: XOR<ListingNullableScalarRelationFilter, ListingWhereInput> | null
  }, "id" | "buyerId">

  export type BuyerProgressOrderByWithAggregationInput = {
    id?: SortOrder
    buyerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BuyerProgressCountOrderByAggregateInput
    _avg?: BuyerProgressAvgOrderByAggregateInput
    _max?: BuyerProgressMaxOrderByAggregateInput
    _min?: BuyerProgressMinOrderByAggregateInput
    _sum?: BuyerProgressSumOrderByAggregateInput
  }

  export type BuyerProgressScalarWhereWithAggregatesInput = {
    AND?: BuyerProgressScalarWhereWithAggregatesInput | BuyerProgressScalarWhereWithAggregatesInput[]
    OR?: BuyerProgressScalarWhereWithAggregatesInput[]
    NOT?: BuyerProgressScalarWhereWithAggregatesInput | BuyerProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BuyerProgress"> | string
    buyerId?: StringWithAggregatesFilter<"BuyerProgress"> | string
    currentStep?: IntWithAggregatesFilter<"BuyerProgress"> | number
    completedSteps?: JsonWithAggregatesFilter<"BuyerProgress">
    selectedListingId?: StringNullableWithAggregatesFilter<"BuyerProgress"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BuyerProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BuyerProgress"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    subject?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    readAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    senderId?: StringFilter<"Message"> | string
    senderType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    senderName?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    receiverType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    receiverName?: StringFilter<"Message"> | string
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    isRead?: BoolFilter<"Message"> | boolean
    isArchived?: BoolFilter<"Message"> | boolean
    parentMessageId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    parentMessage?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
    attachments?: MessageAttachmentListRelationFilter
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    senderId?: SortOrder
    senderType?: SortOrder
    senderName?: SortOrder
    receiverId?: SortOrder
    receiverType?: SortOrder
    receiverName?: SortOrder
    status?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    parentMessageId?: SortOrderInput | SortOrder
    threadId?: SortOrderInput | SortOrder
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
    parentMessage?: MessageOrderByWithRelationInput
    replies?: MessageOrderByRelationAggregateInput
    attachments?: MessageAttachmentOrderByRelationAggregateInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    subject?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    readAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    senderId?: StringFilter<"Message"> | string
    senderType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    senderName?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    receiverType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    receiverName?: StringFilter<"Message"> | string
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    isRead?: BoolFilter<"Message"> | boolean
    isArchived?: BoolFilter<"Message"> | boolean
    parentMessageId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    parentMessage?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
    attachments?: MessageAttachmentListRelationFilter
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    senderId?: SortOrder
    senderType?: SortOrder
    senderName?: SortOrder
    receiverId?: SortOrder
    receiverType?: SortOrder
    receiverName?: SortOrder
    status?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    parentMessageId?: SortOrderInput | SortOrder
    threadId?: SortOrderInput | SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    subject?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    readAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    senderId?: StringWithAggregatesFilter<"Message"> | string
    senderType?: EnumUserRoleWithAggregatesFilter<"Message"> | $Enums.UserRole
    senderName?: StringWithAggregatesFilter<"Message"> | string
    receiverId?: StringWithAggregatesFilter<"Message"> | string
    receiverType?: EnumUserRoleWithAggregatesFilter<"Message"> | $Enums.UserRole
    receiverName?: StringWithAggregatesFilter<"Message"> | string
    status?: EnumMessageStatusWithAggregatesFilter<"Message"> | $Enums.MessageStatus
    isRead?: BoolWithAggregatesFilter<"Message"> | boolean
    isArchived?: BoolWithAggregatesFilter<"Message"> | boolean
    parentMessageId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    threadId?: StringNullableWithAggregatesFilter<"Message"> | string | null
  }

  export type MessageAttachmentWhereInput = {
    AND?: MessageAttachmentWhereInput | MessageAttachmentWhereInput[]
    OR?: MessageAttachmentWhereInput[]
    NOT?: MessageAttachmentWhereInput | MessageAttachmentWhereInput[]
    id?: StringFilter<"MessageAttachment"> | string
    messageId?: StringFilter<"MessageAttachment"> | string
    fileName?: StringFilter<"MessageAttachment"> | string
    fileSize?: IntFilter<"MessageAttachment"> | number
    fileType?: StringFilter<"MessageAttachment"> | string
    fileUrl?: StringFilter<"MessageAttachment"> | string
    uploadedAt?: DateTimeFilter<"MessageAttachment"> | Date | string
    message?: XOR<MessageScalarRelationFilter, MessageWhereInput>
  }

  export type MessageAttachmentOrderByWithRelationInput = {
    id?: SortOrder
    messageId?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
    message?: MessageOrderByWithRelationInput
  }

  export type MessageAttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageAttachmentWhereInput | MessageAttachmentWhereInput[]
    OR?: MessageAttachmentWhereInput[]
    NOT?: MessageAttachmentWhereInput | MessageAttachmentWhereInput[]
    messageId?: StringFilter<"MessageAttachment"> | string
    fileName?: StringFilter<"MessageAttachment"> | string
    fileSize?: IntFilter<"MessageAttachment"> | number
    fileType?: StringFilter<"MessageAttachment"> | string
    fileUrl?: StringFilter<"MessageAttachment"> | string
    uploadedAt?: DateTimeFilter<"MessageAttachment"> | Date | string
    message?: XOR<MessageScalarRelationFilter, MessageWhereInput>
  }, "id">

  export type MessageAttachmentOrderByWithAggregationInput = {
    id?: SortOrder
    messageId?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
    _count?: MessageAttachmentCountOrderByAggregateInput
    _avg?: MessageAttachmentAvgOrderByAggregateInput
    _max?: MessageAttachmentMaxOrderByAggregateInput
    _min?: MessageAttachmentMinOrderByAggregateInput
    _sum?: MessageAttachmentSumOrderByAggregateInput
  }

  export type MessageAttachmentScalarWhereWithAggregatesInput = {
    AND?: MessageAttachmentScalarWhereWithAggregatesInput | MessageAttachmentScalarWhereWithAggregatesInput[]
    OR?: MessageAttachmentScalarWhereWithAggregatesInput[]
    NOT?: MessageAttachmentScalarWhereWithAggregatesInput | MessageAttachmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MessageAttachment"> | string
    messageId?: StringWithAggregatesFilter<"MessageAttachment"> | string
    fileName?: StringWithAggregatesFilter<"MessageAttachment"> | string
    fileSize?: IntWithAggregatesFilter<"MessageAttachment"> | number
    fileType?: StringWithAggregatesFilter<"MessageAttachment"> | string
    fileUrl?: StringWithAggregatesFilter<"MessageAttachment"> | string
    uploadedAt?: DateTimeWithAggregatesFilter<"MessageAttachment"> | Date | string
  }

  export type ListingWhereInput = {
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    id?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringFilter<"Listing"> | string
    price?: FloatFilter<"Listing"> | number
    status?: EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus
    createdAt?: DateTimeFilter<"Listing"> | Date | string
    sellerId?: StringFilter<"Listing"> | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    buyers?: UserListRelationFilter
    documents?: DocumentListRelationFilter
    sellerProgress?: SellerProgressListRelationFilter
    buyerSelectedProgress?: BuyerProgressListRelationFilter
    preCloseChecklist?: XOR<PreCloseChecklistNullableScalarRelationFilter, PreCloseChecklistWhereInput> | null
  }

  export type ListingOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sellerId?: SortOrder
    seller?: UserOrderByWithRelationInput
    buyers?: UserOrderByRelationAggregateInput
    documents?: DocumentOrderByRelationAggregateInput
    sellerProgress?: SellerProgressOrderByRelationAggregateInput
    buyerSelectedProgress?: BuyerProgressOrderByRelationAggregateInput
    preCloseChecklist?: PreCloseChecklistOrderByWithRelationInput
  }

  export type ListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    title?: StringFilter<"Listing"> | string
    description?: StringFilter<"Listing"> | string
    price?: FloatFilter<"Listing"> | number
    status?: EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus
    createdAt?: DateTimeFilter<"Listing"> | Date | string
    sellerId?: StringFilter<"Listing"> | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
    buyers?: UserListRelationFilter
    documents?: DocumentListRelationFilter
    sellerProgress?: SellerProgressListRelationFilter
    buyerSelectedProgress?: BuyerProgressListRelationFilter
    preCloseChecklist?: XOR<PreCloseChecklistNullableScalarRelationFilter, PreCloseChecklistWhereInput> | null
  }, "id">

  export type ListingOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sellerId?: SortOrder
    _count?: ListingCountOrderByAggregateInput
    _avg?: ListingAvgOrderByAggregateInput
    _max?: ListingMaxOrderByAggregateInput
    _min?: ListingMinOrderByAggregateInput
    _sum?: ListingSumOrderByAggregateInput
  }

  export type ListingScalarWhereWithAggregatesInput = {
    AND?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    OR?: ListingScalarWhereWithAggregatesInput[]
    NOT?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Listing"> | string
    title?: StringWithAggregatesFilter<"Listing"> | string
    description?: StringWithAggregatesFilter<"Listing"> | string
    price?: FloatWithAggregatesFilter<"Listing"> | number
    status?: EnumListingStatusWithAggregatesFilter<"Listing"> | $Enums.ListingStatus
    createdAt?: DateTimeWithAggregatesFilter<"Listing"> | Date | string
    sellerId?: StringWithAggregatesFilter<"Listing"> | string
  }

  export type ActivityWhereInput = {
    AND?: ActivityWhereInput | ActivityWhereInput[]
    OR?: ActivityWhereInput[]
    NOT?: ActivityWhereInput | ActivityWhereInput[]
    id?: StringFilter<"Activity"> | string
    userId?: StringFilter<"Activity"> | string
    type?: StringFilter<"Activity"> | string
    data?: JsonNullableFilter<"Activity">
    createdAt?: DateTimeFilter<"Activity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    data?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActivityWhereInput | ActivityWhereInput[]
    OR?: ActivityWhereInput[]
    NOT?: ActivityWhereInput | ActivityWhereInput[]
    userId?: StringFilter<"Activity"> | string
    type?: StringFilter<"Activity"> | string
    data?: JsonNullableFilter<"Activity">
    createdAt?: DateTimeFilter<"Activity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    data?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ActivityCountOrderByAggregateInput
    _max?: ActivityMaxOrderByAggregateInput
    _min?: ActivityMinOrderByAggregateInput
  }

  export type ActivityScalarWhereWithAggregatesInput = {
    AND?: ActivityScalarWhereWithAggregatesInput | ActivityScalarWhereWithAggregatesInput[]
    OR?: ActivityScalarWhereWithAggregatesInput[]
    NOT?: ActivityScalarWhereWithAggregatesInput | ActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Activity"> | string
    userId?: StringWithAggregatesFilter<"Activity"> | string
    type?: StringWithAggregatesFilter<"Activity"> | string
    data?: JsonNullableWithAggregatesFilter<"Activity">
    createdAt?: DateTimeWithAggregatesFilter<"Activity"> | Date | string
  }

  export type SellerQuestionnaireWhereInput = {
    AND?: SellerQuestionnaireWhereInput | SellerQuestionnaireWhereInput[]
    OR?: SellerQuestionnaireWhereInput[]
    NOT?: SellerQuestionnaireWhereInput | SellerQuestionnaireWhereInput[]
    id?: StringFilter<"SellerQuestionnaire"> | string
    sellerId?: StringFilter<"SellerQuestionnaire"> | string
    data?: JsonFilter<"SellerQuestionnaire">
    submitted?: BoolFilter<"SellerQuestionnaire"> | boolean
    submittedAt?: DateTimeNullableFilter<"SellerQuestionnaire"> | Date | string | null
    createdAt?: DateTimeFilter<"SellerQuestionnaire"> | Date | string
    updatedAt?: DateTimeFilter<"SellerQuestionnaire"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SellerQuestionnaireOrderByWithRelationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    data?: SortOrder
    submitted?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    seller?: UserOrderByWithRelationInput
  }

  export type SellerQuestionnaireWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sellerId?: string
    AND?: SellerQuestionnaireWhereInput | SellerQuestionnaireWhereInput[]
    OR?: SellerQuestionnaireWhereInput[]
    NOT?: SellerQuestionnaireWhereInput | SellerQuestionnaireWhereInput[]
    data?: JsonFilter<"SellerQuestionnaire">
    submitted?: BoolFilter<"SellerQuestionnaire"> | boolean
    submittedAt?: DateTimeNullableFilter<"SellerQuestionnaire"> | Date | string | null
    createdAt?: DateTimeFilter<"SellerQuestionnaire"> | Date | string
    updatedAt?: DateTimeFilter<"SellerQuestionnaire"> | Date | string
    seller?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sellerId">

  export type SellerQuestionnaireOrderByWithAggregationInput = {
    id?: SortOrder
    sellerId?: SortOrder
    data?: SortOrder
    submitted?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SellerQuestionnaireCountOrderByAggregateInput
    _max?: SellerQuestionnaireMaxOrderByAggregateInput
    _min?: SellerQuestionnaireMinOrderByAggregateInput
  }

  export type SellerQuestionnaireScalarWhereWithAggregatesInput = {
    AND?: SellerQuestionnaireScalarWhereWithAggregatesInput | SellerQuestionnaireScalarWhereWithAggregatesInput[]
    OR?: SellerQuestionnaireScalarWhereWithAggregatesInput[]
    NOT?: SellerQuestionnaireScalarWhereWithAggregatesInput | SellerQuestionnaireScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SellerQuestionnaire"> | string
    sellerId?: StringWithAggregatesFilter<"SellerQuestionnaire"> | string
    data?: JsonWithAggregatesFilter<"SellerQuestionnaire">
    submitted?: BoolWithAggregatesFilter<"SellerQuestionnaire"> | boolean
    submittedAt?: DateTimeNullableWithAggregatesFilter<"SellerQuestionnaire"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SellerQuestionnaire"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SellerQuestionnaire"> | Date | string
  }

  export type PreCloseChecklistWhereInput = {
    AND?: PreCloseChecklistWhereInput | PreCloseChecklistWhereInput[]
    OR?: PreCloseChecklistWhereInput[]
    NOT?: PreCloseChecklistWhereInput | PreCloseChecklistWhereInput[]
    id?: StringFilter<"PreCloseChecklist"> | string
    listingId?: StringFilter<"PreCloseChecklist"> | string
    buyerItems?: JsonFilter<"PreCloseChecklist">
    sellerItems?: JsonFilter<"PreCloseChecklist">
    brokerItems?: JsonFilter<"PreCloseChecklist">
    lastUpdatedBy?: StringNullableFilter<"PreCloseChecklist"> | string | null
    createdAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
    updatedAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
    listing?: XOR<ListingScalarRelationFilter, ListingWhereInput>
    lastUpdatedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PreCloseChecklistOrderByWithRelationInput = {
    id?: SortOrder
    listingId?: SortOrder
    buyerItems?: SortOrder
    sellerItems?: SortOrder
    brokerItems?: SortOrder
    lastUpdatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    listing?: ListingOrderByWithRelationInput
    lastUpdatedByUser?: UserOrderByWithRelationInput
  }

  export type PreCloseChecklistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    listingId?: string
    AND?: PreCloseChecklistWhereInput | PreCloseChecklistWhereInput[]
    OR?: PreCloseChecklistWhereInput[]
    NOT?: PreCloseChecklistWhereInput | PreCloseChecklistWhereInput[]
    buyerItems?: JsonFilter<"PreCloseChecklist">
    sellerItems?: JsonFilter<"PreCloseChecklist">
    brokerItems?: JsonFilter<"PreCloseChecklist">
    lastUpdatedBy?: StringNullableFilter<"PreCloseChecklist"> | string | null
    createdAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
    updatedAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
    listing?: XOR<ListingScalarRelationFilter, ListingWhereInput>
    lastUpdatedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "listingId">

  export type PreCloseChecklistOrderByWithAggregationInput = {
    id?: SortOrder
    listingId?: SortOrder
    buyerItems?: SortOrder
    sellerItems?: SortOrder
    brokerItems?: SortOrder
    lastUpdatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PreCloseChecklistCountOrderByAggregateInput
    _max?: PreCloseChecklistMaxOrderByAggregateInput
    _min?: PreCloseChecklistMinOrderByAggregateInput
  }

  export type PreCloseChecklistScalarWhereWithAggregatesInput = {
    AND?: PreCloseChecklistScalarWhereWithAggregatesInput | PreCloseChecklistScalarWhereWithAggregatesInput[]
    OR?: PreCloseChecklistScalarWhereWithAggregatesInput[]
    NOT?: PreCloseChecklistScalarWhereWithAggregatesInput | PreCloseChecklistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PreCloseChecklist"> | string
    listingId?: StringWithAggregatesFilter<"PreCloseChecklist"> | string
    buyerItems?: JsonWithAggregatesFilter<"PreCloseChecklist">
    sellerItems?: JsonWithAggregatesFilter<"PreCloseChecklist">
    brokerItems?: JsonWithAggregatesFilter<"PreCloseChecklist">
    lastUpdatedBy?: StringNullableWithAggregatesFilter<"PreCloseChecklist"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PreCloseChecklist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PreCloseChecklist"> | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerDocsInput
    buyer?: UserCreateNestedOneWithoutBuyerDocsInput
    listing?: ListingCreateNestedOneWithoutDocumentsInput
    uploader?: UserCreateNestedOneWithoutUploadedDocumentsInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerDocsNestedInput
    buyer?: UserUpdateOneWithoutBuyerDocsNestedInput
    listing?: ListingUpdateOneWithoutDocumentsNestedInput
    uploader?: UserUpdateOneWithoutUploadedDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SellerProgressCreateInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerProgressInput
    selectedListing?: ListingCreateNestedOneWithoutSellerProgressInput
  }

  export type SellerProgressUncheckedCreateInput = {
    id?: string
    sellerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerProgressNestedInput
    selectedListing?: ListingUpdateOneWithoutSellerProgressNestedInput
  }

  export type SellerProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProgressCreateManyInput = {
    id?: string
    sellerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressCreateInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    buyer: UserCreateNestedOneWithoutBuyerProgressInput
    selectedListing?: ListingCreateNestedOneWithoutBuyerSelectedProgressInput
  }

  export type BuyerProgressUncheckedCreateInput = {
    id?: string
    buyerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyer?: UserUpdateOneRequiredWithoutBuyerProgressNestedInput
    selectedListing?: ListingUpdateOneWithoutBuyerSelectedProgressNestedInput
  }

  export type BuyerProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressCreateManyInput = {
    id?: string
    buyerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
    parentMessage?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
    parentMessage?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageCreateManyInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageAttachmentCreateInput = {
    id?: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
    message: MessageCreateNestedOneWithoutAttachmentsInput
  }

  export type MessageAttachmentUncheckedCreateInput = {
    id?: string
    messageId: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type MessageAttachmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: MessageUpdateOneRequiredWithoutAttachmentsNestedInput
  }

  export type MessageAttachmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageAttachmentCreateManyInput = {
    id?: string
    messageId: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type MessageAttachmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageAttachmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingCreateInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type ListingCreateManyInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
  }

  export type ListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
  }

  export type ActivityCreateInput = {
    id?: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutActivitiesInput
  }

  export type ActivityUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type ActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityCreateManyInput = {
    id?: string
    userId: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerQuestionnaireCreateInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    submitted?: boolean
    submittedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerQuestionnaireInput
  }

  export type SellerQuestionnaireUncheckedCreateInput = {
    id?: string
    sellerId: string
    data: JsonNullValueInput | InputJsonValue
    submitted?: boolean
    submittedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerQuestionnaireUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerQuestionnaireNestedInput
  }

  export type SellerQuestionnaireUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerQuestionnaireCreateManyInput = {
    id?: string
    sellerId: string
    data: JsonNullValueInput | InputJsonValue
    submitted?: boolean
    submittedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerQuestionnaireUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerQuestionnaireUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistCreateInput = {
    id?: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    listing: ListingCreateNestedOneWithoutPreCloseChecklistInput
    lastUpdatedByUser?: UserCreateNestedOneWithoutUpdatedChecklistsInput
  }

  export type PreCloseChecklistUncheckedCreateInput = {
    id?: string
    listingId: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreCloseChecklistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listing?: ListingUpdateOneRequiredWithoutPreCloseChecklistNestedInput
    lastUpdatedByUser?: UserUpdateOneWithoutUpdatedChecklistsNestedInput
  }

  export type PreCloseChecklistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistCreateManyInput = {
    id?: string
    listingId: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreCloseChecklistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type EnumDocumentCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentCategory | EnumDocumentCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentCategoryFilter<$PrismaModel> | $Enums.DocumentCategory
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumDocumentOperationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentOperationType | EnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentOperationTypeFilter<$PrismaModel> | $Enums.DocumentOperationType
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ListingNullableScalarRelationFilter = {
    is?: ListingWhereInput | null
    isNot?: ListingWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    status?: SortOrder
    category?: SortOrder
    url?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    operationType?: SortOrder
    stepId?: SortOrder
    sellerId?: SortOrder
    buyerId?: SortOrder
    listingId?: SortOrder
    uploadedAt?: SortOrder
    downloadedAt?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    stepId?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    status?: SortOrder
    category?: SortOrder
    url?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    operationType?: SortOrder
    stepId?: SortOrder
    sellerId?: SortOrder
    buyerId?: SortOrder
    listingId?: SortOrder
    uploadedAt?: SortOrder
    downloadedAt?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    status?: SortOrder
    category?: SortOrder
    url?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    operationType?: SortOrder
    stepId?: SortOrder
    sellerId?: SortOrder
    buyerId?: SortOrder
    listingId?: SortOrder
    uploadedAt?: SortOrder
    downloadedAt?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    fileSize?: SortOrder
    stepId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type EnumDocumentCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentCategory | EnumDocumentCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentCategoryWithAggregatesFilter<$PrismaModel> | $Enums.DocumentCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentCategoryFilter<$PrismaModel>
    _max?: NestedEnumDocumentCategoryFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDocumentOperationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentOperationType | EnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentOperationTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentOperationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentOperationTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentOperationTypeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ListingListRelationFilter = {
    every?: ListingWhereInput
    some?: ListingWhereInput
    none?: ListingWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type ActivityListRelationFilter = {
    every?: ActivityWhereInput
    some?: ActivityWhereInput
    none?: ActivityWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SellerProgressListRelationFilter = {
    every?: SellerProgressWhereInput
    some?: SellerProgressWhereInput
    none?: SellerProgressWhereInput
  }

  export type BuyerProgressListRelationFilter = {
    every?: BuyerProgressWhereInput
    some?: BuyerProgressWhereInput
    none?: BuyerProgressWhereInput
  }

  export type SellerQuestionnaireNullableScalarRelationFilter = {
    is?: SellerQuestionnaireWhereInput | null
    isNot?: SellerQuestionnaireWhereInput | null
  }

  export type PreCloseChecklistListRelationFilter = {
    every?: PreCloseChecklistWhereInput
    some?: PreCloseChecklistWhereInput
    none?: PreCloseChecklistWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ListingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SellerProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BuyerProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PreCloseChecklistOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    managerId?: SortOrder
    unreadCount?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    unreadCount?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    managerId?: SortOrder
    unreadCount?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    managerId?: SortOrder
    unreadCount?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    unreadCount?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SellerProgressCountOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProgressAvgOrderByAggregateInput = {
    currentStep?: SortOrder
  }

  export type SellerProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    currentStep?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProgressMinOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    currentStep?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProgressSumOrderByAggregateInput = {
    currentStep?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BuyerProgressCountOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    currentStep?: SortOrder
    completedSteps?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerProgressAvgOrderByAggregateInput = {
    currentStep?: SortOrder
  }

  export type BuyerProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    currentStep?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerProgressMinOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    currentStep?: SortOrder
    selectedListingId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerProgressSumOrderByAggregateInput = {
    currentStep?: SortOrder
  }

  export type EnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MessageNullableScalarRelationFilter = {
    is?: MessageWhereInput | null
    isNot?: MessageWhereInput | null
  }

  export type MessageAttachmentListRelationFilter = {
    every?: MessageAttachmentWhereInput
    some?: MessageAttachmentWhereInput
    none?: MessageAttachmentWhereInput
  }

  export type MessageAttachmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readAt?: SortOrder
    senderId?: SortOrder
    senderType?: SortOrder
    senderName?: SortOrder
    receiverId?: SortOrder
    receiverType?: SortOrder
    receiverName?: SortOrder
    status?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    parentMessageId?: SortOrder
    threadId?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readAt?: SortOrder
    senderId?: SortOrder
    senderType?: SortOrder
    senderName?: SortOrder
    receiverId?: SortOrder
    receiverType?: SortOrder
    receiverName?: SortOrder
    status?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    parentMessageId?: SortOrder
    threadId?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    readAt?: SortOrder
    senderId?: SortOrder
    senderType?: SortOrder
    senderName?: SortOrder
    receiverId?: SortOrder
    receiverType?: SortOrder
    receiverName?: SortOrder
    status?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    parentMessageId?: SortOrder
    threadId?: SortOrder
  }

  export type EnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MessageScalarRelationFilter = {
    is?: MessageWhereInput
    isNot?: MessageWhereInput
  }

  export type MessageAttachmentCountOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type MessageAttachmentAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type MessageAttachmentMaxOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type MessageAttachmentMinOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type MessageAttachmentSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | EnumListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus
  }

  export type PreCloseChecklistNullableScalarRelationFilter = {
    is?: PreCloseChecklistWhereInput | null
    isNot?: PreCloseChecklistWhereInput | null
  }

  export type ListingCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sellerId?: SortOrder
  }

  export type ListingAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type ListingMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sellerId?: SortOrder
  }

  export type ListingMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sellerId?: SortOrder
  }

  export type ListingSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | EnumListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumListingStatusFilter<$PrismaModel>
    _max?: NestedEnumListingStatusFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SellerQuestionnaireCountOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    data?: SortOrder
    submitted?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerQuestionnaireMaxOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    submitted?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerQuestionnaireMinOrderByAggregateInput = {
    id?: SortOrder
    sellerId?: SortOrder
    submitted?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingScalarRelationFilter = {
    is?: ListingWhereInput
    isNot?: ListingWhereInput
  }

  export type PreCloseChecklistCountOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    buyerItems?: SortOrder
    sellerItems?: SortOrder
    brokerItems?: SortOrder
    lastUpdatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PreCloseChecklistMaxOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    lastUpdatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PreCloseChecklistMinOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    lastUpdatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCreateNestedOneWithoutSellerDocsInput = {
    create?: XOR<UserCreateWithoutSellerDocsInput, UserUncheckedCreateWithoutSellerDocsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerDocsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBuyerDocsInput = {
    create?: XOR<UserCreateWithoutBuyerDocsInput, UserUncheckedCreateWithoutBuyerDocsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBuyerDocsInput
    connect?: UserWhereUniqueInput
  }

  export type ListingCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<ListingCreateWithoutDocumentsInput, ListingUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ListingCreateOrConnectWithoutDocumentsInput
    connect?: ListingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUploadedDocumentsInput = {
    create?: XOR<UserCreateWithoutUploadedDocumentsInput, UserUncheckedCreateWithoutUploadedDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploadedDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
  }

  export type EnumDocumentCategoryFieldUpdateOperationsInput = {
    set?: $Enums.DocumentCategory
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDocumentOperationTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentOperationType
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSellerDocsNestedInput = {
    create?: XOR<UserCreateWithoutSellerDocsInput, UserUncheckedCreateWithoutSellerDocsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerDocsInput
    upsert?: UserUpsertWithoutSellerDocsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSellerDocsInput, UserUpdateWithoutSellerDocsInput>, UserUncheckedUpdateWithoutSellerDocsInput>
  }

  export type UserUpdateOneWithoutBuyerDocsNestedInput = {
    create?: XOR<UserCreateWithoutBuyerDocsInput, UserUncheckedCreateWithoutBuyerDocsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBuyerDocsInput
    upsert?: UserUpsertWithoutBuyerDocsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBuyerDocsInput, UserUpdateWithoutBuyerDocsInput>, UserUncheckedUpdateWithoutBuyerDocsInput>
  }

  export type ListingUpdateOneWithoutDocumentsNestedInput = {
    create?: XOR<ListingCreateWithoutDocumentsInput, ListingUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ListingCreateOrConnectWithoutDocumentsInput
    upsert?: ListingUpsertWithoutDocumentsInput
    disconnect?: ListingWhereInput | boolean
    delete?: ListingWhereInput | boolean
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutDocumentsInput, ListingUpdateWithoutDocumentsInput>, ListingUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserUpdateOneWithoutUploadedDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutUploadedDocumentsInput, UserUncheckedCreateWithoutUploadedDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploadedDocumentsInput
    upsert?: UserUpsertWithoutUploadedDocumentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUploadedDocumentsInput, UserUpdateWithoutUploadedDocumentsInput>, UserUncheckedUpdateWithoutUploadedDocumentsInput>
  }

  export type UserCreateNestedOneWithoutManagingInput = {
    create?: XOR<UserCreateWithoutManagingInput, UserUncheckedCreateWithoutManagingInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagingInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutManagedByInput = {
    create?: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput> | UserCreateWithoutManagedByInput[] | UserUncheckedCreateWithoutManagedByInput[]
    connectOrCreate?: UserCreateOrConnectWithoutManagedByInput | UserCreateOrConnectWithoutManagedByInput[]
    createMany?: UserCreateManyManagedByInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ListingCreateNestedManyWithoutSellerInput = {
    create?: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput> | ListingCreateWithoutSellerInput[] | ListingUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutSellerInput | ListingCreateOrConnectWithoutSellerInput[]
    createMany?: ListingCreateManySellerInputEnvelope
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutBuyerInput = {
    create?: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput> | DocumentCreateWithoutBuyerInput[] | DocumentUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBuyerInput | DocumentCreateOrConnectWithoutBuyerInput[]
    createMany?: DocumentCreateManyBuyerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutSellerInput = {
    create?: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput> | DocumentCreateWithoutSellerInput[] | DocumentUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutSellerInput | DocumentCreateOrConnectWithoutSellerInput[]
    createMany?: DocumentCreateManySellerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutUploaderInput = {
    create?: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput> | DocumentCreateWithoutUploaderInput[] | DocumentUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUploaderInput | DocumentCreateOrConnectWithoutUploaderInput[]
    createMany?: DocumentCreateManyUploaderInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type ActivityCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput> | ActivityCreateWithoutUserInput[] | ActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutUserInput | ActivityCreateOrConnectWithoutUserInput[]
    createMany?: ActivityCreateManyUserInputEnvelope
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ListingCreateNestedManyWithoutBuyersInput = {
    create?: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput> | ListingCreateWithoutBuyersInput[] | ListingUncheckedCreateWithoutBuyersInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutBuyersInput | ListingCreateOrConnectWithoutBuyersInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type SellerProgressCreateNestedManyWithoutSellerInput = {
    create?: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput> | SellerProgressCreateWithoutSellerInput[] | SellerProgressUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSellerInput | SellerProgressCreateOrConnectWithoutSellerInput[]
    createMany?: SellerProgressCreateManySellerInputEnvelope
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
  }

  export type BuyerProgressCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput> | BuyerProgressCreateWithoutBuyerInput[] | BuyerProgressUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutBuyerInput | BuyerProgressCreateOrConnectWithoutBuyerInput[]
    createMany?: BuyerProgressCreateManyBuyerInputEnvelope
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
  }

  export type SellerQuestionnaireCreateNestedOneWithoutSellerInput = {
    create?: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
    connectOrCreate?: SellerQuestionnaireCreateOrConnectWithoutSellerInput
    connect?: SellerQuestionnaireWhereUniqueInput
  }

  export type PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput = {
    create?: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput> | PreCloseChecklistCreateWithoutLastUpdatedByUserInput[] | PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput[]
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput | PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput[]
    createMany?: PreCloseChecklistCreateManyLastUpdatedByUserInputEnvelope
    connect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutManagedByInput = {
    create?: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput> | UserCreateWithoutManagedByInput[] | UserUncheckedCreateWithoutManagedByInput[]
    connectOrCreate?: UserCreateOrConnectWithoutManagedByInput | UserCreateOrConnectWithoutManagedByInput[]
    createMany?: UserCreateManyManagedByInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ListingUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput> | ListingCreateWithoutSellerInput[] | ListingUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutSellerInput | ListingCreateOrConnectWithoutSellerInput[]
    createMany?: ListingCreateManySellerInputEnvelope
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutBuyerInput = {
    create?: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput> | DocumentCreateWithoutBuyerInput[] | DocumentUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBuyerInput | DocumentCreateOrConnectWithoutBuyerInput[]
    createMany?: DocumentCreateManyBuyerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput> | DocumentCreateWithoutSellerInput[] | DocumentUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutSellerInput | DocumentCreateOrConnectWithoutSellerInput[]
    createMany?: DocumentCreateManySellerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput> | DocumentCreateWithoutUploaderInput[] | DocumentUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUploaderInput | DocumentCreateOrConnectWithoutUploaderInput[]
    createMany?: DocumentCreateManyUploaderInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type ActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput> | ActivityCreateWithoutUserInput[] | ActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutUserInput | ActivityCreateOrConnectWithoutUserInput[]
    createMany?: ActivityCreateManyUserInputEnvelope
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ListingUncheckedCreateNestedManyWithoutBuyersInput = {
    create?: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput> | ListingCreateWithoutBuyersInput[] | ListingUncheckedCreateWithoutBuyersInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutBuyersInput | ListingCreateOrConnectWithoutBuyersInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
  }

  export type SellerProgressUncheckedCreateNestedManyWithoutSellerInput = {
    create?: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput> | SellerProgressCreateWithoutSellerInput[] | SellerProgressUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSellerInput | SellerProgressCreateOrConnectWithoutSellerInput[]
    createMany?: SellerProgressCreateManySellerInputEnvelope
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
  }

  export type BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput> | BuyerProgressCreateWithoutBuyerInput[] | BuyerProgressUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutBuyerInput | BuyerProgressCreateOrConnectWithoutBuyerInput[]
    createMany?: BuyerProgressCreateManyBuyerInputEnvelope
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
  }

  export type SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput = {
    create?: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
    connectOrCreate?: SellerQuestionnaireCreateOrConnectWithoutSellerInput
    connect?: SellerQuestionnaireWhereUniqueInput
  }

  export type PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput = {
    create?: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput> | PreCloseChecklistCreateWithoutLastUpdatedByUserInput[] | PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput[]
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput | PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput[]
    createMany?: PreCloseChecklistCreateManyLastUpdatedByUserInputEnvelope
    connect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutManagingNestedInput = {
    create?: XOR<UserCreateWithoutManagingInput, UserUncheckedCreateWithoutManagingInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagingInput
    upsert?: UserUpsertWithoutManagingInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutManagingInput, UserUpdateWithoutManagingInput>, UserUncheckedUpdateWithoutManagingInput>
  }

  export type UserUpdateManyWithoutManagedByNestedInput = {
    create?: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput> | UserCreateWithoutManagedByInput[] | UserUncheckedCreateWithoutManagedByInput[]
    connectOrCreate?: UserCreateOrConnectWithoutManagedByInput | UserCreateOrConnectWithoutManagedByInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutManagedByInput | UserUpsertWithWhereUniqueWithoutManagedByInput[]
    createMany?: UserCreateManyManagedByInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutManagedByInput | UserUpdateWithWhereUniqueWithoutManagedByInput[]
    updateMany?: UserUpdateManyWithWhereWithoutManagedByInput | UserUpdateManyWithWhereWithoutManagedByInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ListingUpdateManyWithoutSellerNestedInput = {
    create?: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput> | ListingCreateWithoutSellerInput[] | ListingUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutSellerInput | ListingCreateOrConnectWithoutSellerInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutSellerInput | ListingUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: ListingCreateManySellerInputEnvelope
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutSellerInput | ListingUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutSellerInput | ListingUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput> | DocumentCreateWithoutBuyerInput[] | DocumentUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBuyerInput | DocumentCreateOrConnectWithoutBuyerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutBuyerInput | DocumentUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: DocumentCreateManyBuyerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutBuyerInput | DocumentUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutBuyerInput | DocumentUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutSellerNestedInput = {
    create?: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput> | DocumentCreateWithoutSellerInput[] | DocumentUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutSellerInput | DocumentCreateOrConnectWithoutSellerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutSellerInput | DocumentUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: DocumentCreateManySellerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutSellerInput | DocumentUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutSellerInput | DocumentUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput> | DocumentCreateWithoutUploaderInput[] | DocumentUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUploaderInput | DocumentCreateOrConnectWithoutUploaderInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUploaderInput | DocumentUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: DocumentCreateManyUploaderInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUploaderInput | DocumentUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUploaderInput | DocumentUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type ActivityUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput> | ActivityCreateWithoutUserInput[] | ActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutUserInput | ActivityCreateOrConnectWithoutUserInput[]
    upsert?: ActivityUpsertWithWhereUniqueWithoutUserInput | ActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityCreateManyUserInputEnvelope
    set?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    disconnect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    delete?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    update?: ActivityUpdateWithWhereUniqueWithoutUserInput | ActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityUpdateManyWithWhereWithoutUserInput | ActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReceiverInput | MessageUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReceiverInput | MessageUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReceiverInput | MessageUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ListingUpdateManyWithoutBuyersNestedInput = {
    create?: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput> | ListingCreateWithoutBuyersInput[] | ListingUncheckedCreateWithoutBuyersInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutBuyersInput | ListingCreateOrConnectWithoutBuyersInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutBuyersInput | ListingUpsertWithWhereUniqueWithoutBuyersInput[]
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutBuyersInput | ListingUpdateWithWhereUniqueWithoutBuyersInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutBuyersInput | ListingUpdateManyWithWhereWithoutBuyersInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type SellerProgressUpdateManyWithoutSellerNestedInput = {
    create?: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput> | SellerProgressCreateWithoutSellerInput[] | SellerProgressUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSellerInput | SellerProgressCreateOrConnectWithoutSellerInput[]
    upsert?: SellerProgressUpsertWithWhereUniqueWithoutSellerInput | SellerProgressUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: SellerProgressCreateManySellerInputEnvelope
    set?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    disconnect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    delete?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    update?: SellerProgressUpdateWithWhereUniqueWithoutSellerInput | SellerProgressUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: SellerProgressUpdateManyWithWhereWithoutSellerInput | SellerProgressUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
  }

  export type BuyerProgressUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput> | BuyerProgressCreateWithoutBuyerInput[] | BuyerProgressUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutBuyerInput | BuyerProgressCreateOrConnectWithoutBuyerInput[]
    upsert?: BuyerProgressUpsertWithWhereUniqueWithoutBuyerInput | BuyerProgressUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BuyerProgressCreateManyBuyerInputEnvelope
    set?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    disconnect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    delete?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    update?: BuyerProgressUpdateWithWhereUniqueWithoutBuyerInput | BuyerProgressUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BuyerProgressUpdateManyWithWhereWithoutBuyerInput | BuyerProgressUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
  }

  export type SellerQuestionnaireUpdateOneWithoutSellerNestedInput = {
    create?: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
    connectOrCreate?: SellerQuestionnaireCreateOrConnectWithoutSellerInput
    upsert?: SellerQuestionnaireUpsertWithoutSellerInput
    disconnect?: SellerQuestionnaireWhereInput | boolean
    delete?: SellerQuestionnaireWhereInput | boolean
    connect?: SellerQuestionnaireWhereUniqueInput
    update?: XOR<XOR<SellerQuestionnaireUpdateToOneWithWhereWithoutSellerInput, SellerQuestionnaireUpdateWithoutSellerInput>, SellerQuestionnaireUncheckedUpdateWithoutSellerInput>
  }

  export type PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput = {
    create?: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput> | PreCloseChecklistCreateWithoutLastUpdatedByUserInput[] | PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput[]
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput | PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput[]
    upsert?: PreCloseChecklistUpsertWithWhereUniqueWithoutLastUpdatedByUserInput | PreCloseChecklistUpsertWithWhereUniqueWithoutLastUpdatedByUserInput[]
    createMany?: PreCloseChecklistCreateManyLastUpdatedByUserInputEnvelope
    set?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    disconnect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    delete?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    connect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    update?: PreCloseChecklistUpdateWithWhereUniqueWithoutLastUpdatedByUserInput | PreCloseChecklistUpdateWithWhereUniqueWithoutLastUpdatedByUserInput[]
    updateMany?: PreCloseChecklistUpdateManyWithWhereWithoutLastUpdatedByUserInput | PreCloseChecklistUpdateManyWithWhereWithoutLastUpdatedByUserInput[]
    deleteMany?: PreCloseChecklistScalarWhereInput | PreCloseChecklistScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutManagedByNestedInput = {
    create?: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput> | UserCreateWithoutManagedByInput[] | UserUncheckedCreateWithoutManagedByInput[]
    connectOrCreate?: UserCreateOrConnectWithoutManagedByInput | UserCreateOrConnectWithoutManagedByInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutManagedByInput | UserUpsertWithWhereUniqueWithoutManagedByInput[]
    createMany?: UserCreateManyManagedByInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutManagedByInput | UserUpdateWithWhereUniqueWithoutManagedByInput[]
    updateMany?: UserUpdateManyWithWhereWithoutManagedByInput | UserUpdateManyWithWhereWithoutManagedByInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ListingUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput> | ListingCreateWithoutSellerInput[] | ListingUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutSellerInput | ListingCreateOrConnectWithoutSellerInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutSellerInput | ListingUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: ListingCreateManySellerInputEnvelope
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutSellerInput | ListingUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutSellerInput | ListingUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput> | DocumentCreateWithoutBuyerInput[] | DocumentUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutBuyerInput | DocumentCreateOrConnectWithoutBuyerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutBuyerInput | DocumentUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: DocumentCreateManyBuyerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutBuyerInput | DocumentUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutBuyerInput | DocumentUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput> | DocumentCreateWithoutSellerInput[] | DocumentUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutSellerInput | DocumentCreateOrConnectWithoutSellerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutSellerInput | DocumentUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: DocumentCreateManySellerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutSellerInput | DocumentUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutSellerInput | DocumentUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput> | DocumentCreateWithoutUploaderInput[] | DocumentUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUploaderInput | DocumentCreateOrConnectWithoutUploaderInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUploaderInput | DocumentUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: DocumentCreateManyUploaderInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUploaderInput | DocumentUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUploaderInput | DocumentUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type ActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput> | ActivityCreateWithoutUserInput[] | ActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityCreateOrConnectWithoutUserInput | ActivityCreateOrConnectWithoutUserInput[]
    upsert?: ActivityUpsertWithWhereUniqueWithoutUserInput | ActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityCreateManyUserInputEnvelope
    set?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    disconnect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    delete?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    connect?: ActivityWhereUniqueInput | ActivityWhereUniqueInput[]
    update?: ActivityUpdateWithWhereUniqueWithoutUserInput | ActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityUpdateManyWithWhereWithoutUserInput | ActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReceiverInput | MessageUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReceiverInput | MessageUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReceiverInput | MessageUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ListingUncheckedUpdateManyWithoutBuyersNestedInput = {
    create?: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput> | ListingCreateWithoutBuyersInput[] | ListingUncheckedCreateWithoutBuyersInput[]
    connectOrCreate?: ListingCreateOrConnectWithoutBuyersInput | ListingCreateOrConnectWithoutBuyersInput[]
    upsert?: ListingUpsertWithWhereUniqueWithoutBuyersInput | ListingUpsertWithWhereUniqueWithoutBuyersInput[]
    set?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    disconnect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    delete?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    connect?: ListingWhereUniqueInput | ListingWhereUniqueInput[]
    update?: ListingUpdateWithWhereUniqueWithoutBuyersInput | ListingUpdateWithWhereUniqueWithoutBuyersInput[]
    updateMany?: ListingUpdateManyWithWhereWithoutBuyersInput | ListingUpdateManyWithWhereWithoutBuyersInput[]
    deleteMany?: ListingScalarWhereInput | ListingScalarWhereInput[]
  }

  export type SellerProgressUncheckedUpdateManyWithoutSellerNestedInput = {
    create?: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput> | SellerProgressCreateWithoutSellerInput[] | SellerProgressUncheckedCreateWithoutSellerInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSellerInput | SellerProgressCreateOrConnectWithoutSellerInput[]
    upsert?: SellerProgressUpsertWithWhereUniqueWithoutSellerInput | SellerProgressUpsertWithWhereUniqueWithoutSellerInput[]
    createMany?: SellerProgressCreateManySellerInputEnvelope
    set?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    disconnect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    delete?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    update?: SellerProgressUpdateWithWhereUniqueWithoutSellerInput | SellerProgressUpdateWithWhereUniqueWithoutSellerInput[]
    updateMany?: SellerProgressUpdateManyWithWhereWithoutSellerInput | SellerProgressUpdateManyWithWhereWithoutSellerInput[]
    deleteMany?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
  }

  export type BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput> | BuyerProgressCreateWithoutBuyerInput[] | BuyerProgressUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutBuyerInput | BuyerProgressCreateOrConnectWithoutBuyerInput[]
    upsert?: BuyerProgressUpsertWithWhereUniqueWithoutBuyerInput | BuyerProgressUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BuyerProgressCreateManyBuyerInputEnvelope
    set?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    disconnect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    delete?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    update?: BuyerProgressUpdateWithWhereUniqueWithoutBuyerInput | BuyerProgressUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BuyerProgressUpdateManyWithWhereWithoutBuyerInput | BuyerProgressUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
  }

  export type SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput = {
    create?: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
    connectOrCreate?: SellerQuestionnaireCreateOrConnectWithoutSellerInput
    upsert?: SellerQuestionnaireUpsertWithoutSellerInput
    disconnect?: SellerQuestionnaireWhereInput | boolean
    delete?: SellerQuestionnaireWhereInput | boolean
    connect?: SellerQuestionnaireWhereUniqueInput
    update?: XOR<XOR<SellerQuestionnaireUpdateToOneWithWhereWithoutSellerInput, SellerQuestionnaireUpdateWithoutSellerInput>, SellerQuestionnaireUncheckedUpdateWithoutSellerInput>
  }

  export type PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput = {
    create?: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput> | PreCloseChecklistCreateWithoutLastUpdatedByUserInput[] | PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput[]
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput | PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput[]
    upsert?: PreCloseChecklistUpsertWithWhereUniqueWithoutLastUpdatedByUserInput | PreCloseChecklistUpsertWithWhereUniqueWithoutLastUpdatedByUserInput[]
    createMany?: PreCloseChecklistCreateManyLastUpdatedByUserInputEnvelope
    set?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    disconnect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    delete?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    connect?: PreCloseChecklistWhereUniqueInput | PreCloseChecklistWhereUniqueInput[]
    update?: PreCloseChecklistUpdateWithWhereUniqueWithoutLastUpdatedByUserInput | PreCloseChecklistUpdateWithWhereUniqueWithoutLastUpdatedByUserInput[]
    updateMany?: PreCloseChecklistUpdateManyWithWhereWithoutLastUpdatedByUserInput | PreCloseChecklistUpdateManyWithWhereWithoutLastUpdatedByUserInput[]
    deleteMany?: PreCloseChecklistScalarWhereInput | PreCloseChecklistScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSellerProgressInput = {
    create?: XOR<UserCreateWithoutSellerProgressInput, UserUncheckedCreateWithoutSellerProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerProgressInput
    connect?: UserWhereUniqueInput
  }

  export type ListingCreateNestedOneWithoutSellerProgressInput = {
    create?: XOR<ListingCreateWithoutSellerProgressInput, ListingUncheckedCreateWithoutSellerProgressInput>
    connectOrCreate?: ListingCreateOrConnectWithoutSellerProgressInput
    connect?: ListingWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSellerProgressNestedInput = {
    create?: XOR<UserCreateWithoutSellerProgressInput, UserUncheckedCreateWithoutSellerProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerProgressInput
    upsert?: UserUpsertWithoutSellerProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSellerProgressInput, UserUpdateWithoutSellerProgressInput>, UserUncheckedUpdateWithoutSellerProgressInput>
  }

  export type ListingUpdateOneWithoutSellerProgressNestedInput = {
    create?: XOR<ListingCreateWithoutSellerProgressInput, ListingUncheckedCreateWithoutSellerProgressInput>
    connectOrCreate?: ListingCreateOrConnectWithoutSellerProgressInput
    upsert?: ListingUpsertWithoutSellerProgressInput
    disconnect?: ListingWhereInput | boolean
    delete?: ListingWhereInput | boolean
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutSellerProgressInput, ListingUpdateWithoutSellerProgressInput>, ListingUncheckedUpdateWithoutSellerProgressInput>
  }

  export type UserCreateNestedOneWithoutBuyerProgressInput = {
    create?: XOR<UserCreateWithoutBuyerProgressInput, UserUncheckedCreateWithoutBuyerProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutBuyerProgressInput
    connect?: UserWhereUniqueInput
  }

  export type ListingCreateNestedOneWithoutBuyerSelectedProgressInput = {
    create?: XOR<ListingCreateWithoutBuyerSelectedProgressInput, ListingUncheckedCreateWithoutBuyerSelectedProgressInput>
    connectOrCreate?: ListingCreateOrConnectWithoutBuyerSelectedProgressInput
    connect?: ListingWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBuyerProgressNestedInput = {
    create?: XOR<UserCreateWithoutBuyerProgressInput, UserUncheckedCreateWithoutBuyerProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutBuyerProgressInput
    upsert?: UserUpsertWithoutBuyerProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBuyerProgressInput, UserUpdateWithoutBuyerProgressInput>, UserUncheckedUpdateWithoutBuyerProgressInput>
  }

  export type ListingUpdateOneWithoutBuyerSelectedProgressNestedInput = {
    create?: XOR<ListingCreateWithoutBuyerSelectedProgressInput, ListingUncheckedCreateWithoutBuyerSelectedProgressInput>
    connectOrCreate?: ListingCreateOrConnectWithoutBuyerSelectedProgressInput
    upsert?: ListingUpsertWithoutBuyerSelectedProgressInput
    disconnect?: ListingWhereInput | boolean
    delete?: ListingWhereInput | boolean
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutBuyerSelectedProgressInput, ListingUpdateWithoutBuyerSelectedProgressInput>, ListingUncheckedUpdateWithoutBuyerSelectedProgressInput>
  }

  export type UserCreateNestedOneWithoutSentMessagesInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedMessagesInput = {
    create?: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedOneWithoutRepliesInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    connect?: MessageWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutParentMessageInput = {
    create?: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput> | MessageCreateWithoutParentMessageInput[] | MessageUncheckedCreateWithoutParentMessageInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutParentMessageInput | MessageCreateOrConnectWithoutParentMessageInput[]
    createMany?: MessageCreateManyParentMessageInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageAttachmentCreateNestedManyWithoutMessageInput = {
    create?: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput> | MessageAttachmentCreateWithoutMessageInput[] | MessageAttachmentUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageAttachmentCreateOrConnectWithoutMessageInput | MessageAttachmentCreateOrConnectWithoutMessageInput[]
    createMany?: MessageAttachmentCreateManyMessageInputEnvelope
    connect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutParentMessageInput = {
    create?: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput> | MessageCreateWithoutParentMessageInput[] | MessageUncheckedCreateWithoutParentMessageInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutParentMessageInput | MessageCreateOrConnectWithoutParentMessageInput[]
    createMany?: MessageCreateManyParentMessageInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput = {
    create?: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput> | MessageAttachmentCreateWithoutMessageInput[] | MessageAttachmentUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageAttachmentCreateOrConnectWithoutMessageInput | MessageAttachmentCreateOrConnectWithoutMessageInput[]
    createMany?: MessageAttachmentCreateManyMessageInputEnvelope
    connect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
  }

  export type EnumMessageStatusFieldUpdateOperationsInput = {
    set?: $Enums.MessageStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutSentMessagesNestedInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    upsert?: UserUpsertWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentMessagesInput, UserUpdateWithoutSentMessagesInput>, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedMessagesNestedInput = {
    create?: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedMessagesInput
    upsert?: UserUpsertWithoutReceivedMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedMessagesInput, UserUpdateWithoutReceivedMessagesInput>, UserUncheckedUpdateWithoutReceivedMessagesInput>
  }

  export type MessageUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    upsert?: MessageUpsertWithoutRepliesInput
    disconnect?: MessageWhereInput | boolean
    delete?: MessageWhereInput | boolean
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutRepliesInput, MessageUpdateWithoutRepliesInput>, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateManyWithoutParentMessageNestedInput = {
    create?: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput> | MessageCreateWithoutParentMessageInput[] | MessageUncheckedCreateWithoutParentMessageInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutParentMessageInput | MessageCreateOrConnectWithoutParentMessageInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutParentMessageInput | MessageUpsertWithWhereUniqueWithoutParentMessageInput[]
    createMany?: MessageCreateManyParentMessageInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutParentMessageInput | MessageUpdateWithWhereUniqueWithoutParentMessageInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutParentMessageInput | MessageUpdateManyWithWhereWithoutParentMessageInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageAttachmentUpdateManyWithoutMessageNestedInput = {
    create?: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput> | MessageAttachmentCreateWithoutMessageInput[] | MessageAttachmentUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageAttachmentCreateOrConnectWithoutMessageInput | MessageAttachmentCreateOrConnectWithoutMessageInput[]
    upsert?: MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput | MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: MessageAttachmentCreateManyMessageInputEnvelope
    set?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    disconnect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    delete?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    connect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    update?: MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput | MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: MessageAttachmentUpdateManyWithWhereWithoutMessageInput | MessageAttachmentUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: MessageAttachmentScalarWhereInput | MessageAttachmentScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutParentMessageNestedInput = {
    create?: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput> | MessageCreateWithoutParentMessageInput[] | MessageUncheckedCreateWithoutParentMessageInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutParentMessageInput | MessageCreateOrConnectWithoutParentMessageInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutParentMessageInput | MessageUpsertWithWhereUniqueWithoutParentMessageInput[]
    createMany?: MessageCreateManyParentMessageInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutParentMessageInput | MessageUpdateWithWhereUniqueWithoutParentMessageInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutParentMessageInput | MessageUpdateManyWithWhereWithoutParentMessageInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput> | MessageAttachmentCreateWithoutMessageInput[] | MessageAttachmentUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageAttachmentCreateOrConnectWithoutMessageInput | MessageAttachmentCreateOrConnectWithoutMessageInput[]
    upsert?: MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput | MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: MessageAttachmentCreateManyMessageInputEnvelope
    set?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    disconnect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    delete?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    connect?: MessageAttachmentWhereUniqueInput | MessageAttachmentWhereUniqueInput[]
    update?: MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput | MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: MessageAttachmentUpdateManyWithWhereWithoutMessageInput | MessageAttachmentUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: MessageAttachmentScalarWhereInput | MessageAttachmentScalarWhereInput[]
  }

  export type MessageCreateNestedOneWithoutAttachmentsInput = {
    create?: XOR<MessageCreateWithoutAttachmentsInput, MessageUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: MessageCreateOrConnectWithoutAttachmentsInput
    connect?: MessageWhereUniqueInput
  }

  export type MessageUpdateOneRequiredWithoutAttachmentsNestedInput = {
    create?: XOR<MessageCreateWithoutAttachmentsInput, MessageUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: MessageCreateOrConnectWithoutAttachmentsInput
    upsert?: MessageUpsertWithoutAttachmentsInput
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutAttachmentsInput, MessageUpdateWithoutAttachmentsInput>, MessageUncheckedUpdateWithoutAttachmentsInput>
  }

  export type UserCreateNestedOneWithoutListingsInput = {
    create?: XOR<UserCreateWithoutListingsInput, UserUncheckedCreateWithoutListingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutListingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutBuyingListingsInput = {
    create?: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput> | UserCreateWithoutBuyingListingsInput[] | UserUncheckedCreateWithoutBuyingListingsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBuyingListingsInput | UserCreateOrConnectWithoutBuyingListingsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutListingInput = {
    create?: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput> | DocumentCreateWithoutListingInput[] | DocumentUncheckedCreateWithoutListingInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutListingInput | DocumentCreateOrConnectWithoutListingInput[]
    createMany?: DocumentCreateManyListingInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type SellerProgressCreateNestedManyWithoutSelectedListingInput = {
    create?: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput> | SellerProgressCreateWithoutSelectedListingInput[] | SellerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSelectedListingInput | SellerProgressCreateOrConnectWithoutSelectedListingInput[]
    createMany?: SellerProgressCreateManySelectedListingInputEnvelope
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
  }

  export type BuyerProgressCreateNestedManyWithoutSelectedListingInput = {
    create?: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput> | BuyerProgressCreateWithoutSelectedListingInput[] | BuyerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutSelectedListingInput | BuyerProgressCreateOrConnectWithoutSelectedListingInput[]
    createMany?: BuyerProgressCreateManySelectedListingInputEnvelope
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
  }

  export type PreCloseChecklistCreateNestedOneWithoutListingInput = {
    create?: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutListingInput
    connect?: PreCloseChecklistWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutBuyingListingsInput = {
    create?: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput> | UserCreateWithoutBuyingListingsInput[] | UserUncheckedCreateWithoutBuyingListingsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBuyingListingsInput | UserCreateOrConnectWithoutBuyingListingsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutListingInput = {
    create?: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput> | DocumentCreateWithoutListingInput[] | DocumentUncheckedCreateWithoutListingInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutListingInput | DocumentCreateOrConnectWithoutListingInput[]
    createMany?: DocumentCreateManyListingInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput = {
    create?: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput> | SellerProgressCreateWithoutSelectedListingInput[] | SellerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSelectedListingInput | SellerProgressCreateOrConnectWithoutSelectedListingInput[]
    createMany?: SellerProgressCreateManySelectedListingInputEnvelope
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
  }

  export type BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput = {
    create?: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput> | BuyerProgressCreateWithoutSelectedListingInput[] | BuyerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutSelectedListingInput | BuyerProgressCreateOrConnectWithoutSelectedListingInput[]
    createMany?: BuyerProgressCreateManySelectedListingInputEnvelope
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
  }

  export type PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput = {
    create?: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutListingInput
    connect?: PreCloseChecklistWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumListingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ListingStatus
  }

  export type UserUpdateOneRequiredWithoutListingsNestedInput = {
    create?: XOR<UserCreateWithoutListingsInput, UserUncheckedCreateWithoutListingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutListingsInput
    upsert?: UserUpsertWithoutListingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutListingsInput, UserUpdateWithoutListingsInput>, UserUncheckedUpdateWithoutListingsInput>
  }

  export type UserUpdateManyWithoutBuyingListingsNestedInput = {
    create?: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput> | UserCreateWithoutBuyingListingsInput[] | UserUncheckedCreateWithoutBuyingListingsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBuyingListingsInput | UserCreateOrConnectWithoutBuyingListingsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBuyingListingsInput | UserUpsertWithWhereUniqueWithoutBuyingListingsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBuyingListingsInput | UserUpdateWithWhereUniqueWithoutBuyingListingsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBuyingListingsInput | UserUpdateManyWithWhereWithoutBuyingListingsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutListingNestedInput = {
    create?: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput> | DocumentCreateWithoutListingInput[] | DocumentUncheckedCreateWithoutListingInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutListingInput | DocumentCreateOrConnectWithoutListingInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutListingInput | DocumentUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: DocumentCreateManyListingInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutListingInput | DocumentUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutListingInput | DocumentUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type SellerProgressUpdateManyWithoutSelectedListingNestedInput = {
    create?: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput> | SellerProgressCreateWithoutSelectedListingInput[] | SellerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSelectedListingInput | SellerProgressCreateOrConnectWithoutSelectedListingInput[]
    upsert?: SellerProgressUpsertWithWhereUniqueWithoutSelectedListingInput | SellerProgressUpsertWithWhereUniqueWithoutSelectedListingInput[]
    createMany?: SellerProgressCreateManySelectedListingInputEnvelope
    set?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    disconnect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    delete?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    update?: SellerProgressUpdateWithWhereUniqueWithoutSelectedListingInput | SellerProgressUpdateWithWhereUniqueWithoutSelectedListingInput[]
    updateMany?: SellerProgressUpdateManyWithWhereWithoutSelectedListingInput | SellerProgressUpdateManyWithWhereWithoutSelectedListingInput[]
    deleteMany?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
  }

  export type BuyerProgressUpdateManyWithoutSelectedListingNestedInput = {
    create?: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput> | BuyerProgressCreateWithoutSelectedListingInput[] | BuyerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutSelectedListingInput | BuyerProgressCreateOrConnectWithoutSelectedListingInput[]
    upsert?: BuyerProgressUpsertWithWhereUniqueWithoutSelectedListingInput | BuyerProgressUpsertWithWhereUniqueWithoutSelectedListingInput[]
    createMany?: BuyerProgressCreateManySelectedListingInputEnvelope
    set?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    disconnect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    delete?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    update?: BuyerProgressUpdateWithWhereUniqueWithoutSelectedListingInput | BuyerProgressUpdateWithWhereUniqueWithoutSelectedListingInput[]
    updateMany?: BuyerProgressUpdateManyWithWhereWithoutSelectedListingInput | BuyerProgressUpdateManyWithWhereWithoutSelectedListingInput[]
    deleteMany?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
  }

  export type PreCloseChecklistUpdateOneWithoutListingNestedInput = {
    create?: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutListingInput
    upsert?: PreCloseChecklistUpsertWithoutListingInput
    disconnect?: PreCloseChecklistWhereInput | boolean
    delete?: PreCloseChecklistWhereInput | boolean
    connect?: PreCloseChecklistWhereUniqueInput
    update?: XOR<XOR<PreCloseChecklistUpdateToOneWithWhereWithoutListingInput, PreCloseChecklistUpdateWithoutListingInput>, PreCloseChecklistUncheckedUpdateWithoutListingInput>
  }

  export type UserUncheckedUpdateManyWithoutBuyingListingsNestedInput = {
    create?: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput> | UserCreateWithoutBuyingListingsInput[] | UserUncheckedCreateWithoutBuyingListingsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBuyingListingsInput | UserCreateOrConnectWithoutBuyingListingsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBuyingListingsInput | UserUpsertWithWhereUniqueWithoutBuyingListingsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBuyingListingsInput | UserUpdateWithWhereUniqueWithoutBuyingListingsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBuyingListingsInput | UserUpdateManyWithWhereWithoutBuyingListingsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutListingNestedInput = {
    create?: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput> | DocumentCreateWithoutListingInput[] | DocumentUncheckedCreateWithoutListingInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutListingInput | DocumentCreateOrConnectWithoutListingInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutListingInput | DocumentUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: DocumentCreateManyListingInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutListingInput | DocumentUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutListingInput | DocumentUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput = {
    create?: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput> | SellerProgressCreateWithoutSelectedListingInput[] | SellerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: SellerProgressCreateOrConnectWithoutSelectedListingInput | SellerProgressCreateOrConnectWithoutSelectedListingInput[]
    upsert?: SellerProgressUpsertWithWhereUniqueWithoutSelectedListingInput | SellerProgressUpsertWithWhereUniqueWithoutSelectedListingInput[]
    createMany?: SellerProgressCreateManySelectedListingInputEnvelope
    set?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    disconnect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    delete?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    connect?: SellerProgressWhereUniqueInput | SellerProgressWhereUniqueInput[]
    update?: SellerProgressUpdateWithWhereUniqueWithoutSelectedListingInput | SellerProgressUpdateWithWhereUniqueWithoutSelectedListingInput[]
    updateMany?: SellerProgressUpdateManyWithWhereWithoutSelectedListingInput | SellerProgressUpdateManyWithWhereWithoutSelectedListingInput[]
    deleteMany?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
  }

  export type BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput = {
    create?: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput> | BuyerProgressCreateWithoutSelectedListingInput[] | BuyerProgressUncheckedCreateWithoutSelectedListingInput[]
    connectOrCreate?: BuyerProgressCreateOrConnectWithoutSelectedListingInput | BuyerProgressCreateOrConnectWithoutSelectedListingInput[]
    upsert?: BuyerProgressUpsertWithWhereUniqueWithoutSelectedListingInput | BuyerProgressUpsertWithWhereUniqueWithoutSelectedListingInput[]
    createMany?: BuyerProgressCreateManySelectedListingInputEnvelope
    set?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    disconnect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    delete?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    connect?: BuyerProgressWhereUniqueInput | BuyerProgressWhereUniqueInput[]
    update?: BuyerProgressUpdateWithWhereUniqueWithoutSelectedListingInput | BuyerProgressUpdateWithWhereUniqueWithoutSelectedListingInput[]
    updateMany?: BuyerProgressUpdateManyWithWhereWithoutSelectedListingInput | BuyerProgressUpdateManyWithWhereWithoutSelectedListingInput[]
    deleteMany?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
  }

  export type PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput = {
    create?: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
    connectOrCreate?: PreCloseChecklistCreateOrConnectWithoutListingInput
    upsert?: PreCloseChecklistUpsertWithoutListingInput
    disconnect?: PreCloseChecklistWhereInput | boolean
    delete?: PreCloseChecklistWhereInput | boolean
    connect?: PreCloseChecklistWhereUniqueInput
    update?: XOR<XOR<PreCloseChecklistUpdateToOneWithWhereWithoutListingInput, PreCloseChecklistUpdateWithoutListingInput>, PreCloseChecklistUncheckedUpdateWithoutListingInput>
  }

  export type UserCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    upsert?: UserUpsertWithoutActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivitiesInput, UserUpdateWithoutActivitiesInput>, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserCreateNestedOneWithoutSellerQuestionnaireInput = {
    create?: XOR<UserCreateWithoutSellerQuestionnaireInput, UserUncheckedCreateWithoutSellerQuestionnaireInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerQuestionnaireInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSellerQuestionnaireNestedInput = {
    create?: XOR<UserCreateWithoutSellerQuestionnaireInput, UserUncheckedCreateWithoutSellerQuestionnaireInput>
    connectOrCreate?: UserCreateOrConnectWithoutSellerQuestionnaireInput
    upsert?: UserUpsertWithoutSellerQuestionnaireInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSellerQuestionnaireInput, UserUpdateWithoutSellerQuestionnaireInput>, UserUncheckedUpdateWithoutSellerQuestionnaireInput>
  }

  export type ListingCreateNestedOneWithoutPreCloseChecklistInput = {
    create?: XOR<ListingCreateWithoutPreCloseChecklistInput, ListingUncheckedCreateWithoutPreCloseChecklistInput>
    connectOrCreate?: ListingCreateOrConnectWithoutPreCloseChecklistInput
    connect?: ListingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUpdatedChecklistsInput = {
    create?: XOR<UserCreateWithoutUpdatedChecklistsInput, UserUncheckedCreateWithoutUpdatedChecklistsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpdatedChecklistsInput
    connect?: UserWhereUniqueInput
  }

  export type ListingUpdateOneRequiredWithoutPreCloseChecklistNestedInput = {
    create?: XOR<ListingCreateWithoutPreCloseChecklistInput, ListingUncheckedCreateWithoutPreCloseChecklistInput>
    connectOrCreate?: ListingCreateOrConnectWithoutPreCloseChecklistInput
    upsert?: ListingUpsertWithoutPreCloseChecklistInput
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutPreCloseChecklistInput, ListingUpdateWithoutPreCloseChecklistInput>, ListingUncheckedUpdateWithoutPreCloseChecklistInput>
  }

  export type UserUpdateOneWithoutUpdatedChecklistsNestedInput = {
    create?: XOR<UserCreateWithoutUpdatedChecklistsInput, UserUncheckedCreateWithoutUpdatedChecklistsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpdatedChecklistsInput
    upsert?: UserUpsertWithoutUpdatedChecklistsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUpdatedChecklistsInput, UserUpdateWithoutUpdatedChecklistsInput>, UserUncheckedUpdateWithoutUpdatedChecklistsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type NestedEnumDocumentCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentCategory | EnumDocumentCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentCategoryFilter<$PrismaModel> | $Enums.DocumentCategory
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDocumentOperationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentOperationType | EnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentOperationTypeFilter<$PrismaModel> | $Enums.DocumentOperationType
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type NestedEnumDocumentCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentCategory | EnumDocumentCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentCategory[] | ListEnumDocumentCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentCategoryWithAggregatesFilter<$PrismaModel> | $Enums.DocumentCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentCategoryFilter<$PrismaModel>
    _max?: NestedEnumDocumentCategoryFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDocumentOperationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentOperationType | EnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentOperationType[] | ListEnumDocumentOperationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentOperationTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentOperationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentOperationTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentOperationTypeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | EnumListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | EnumListingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ListingStatus[] | ListEnumListingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumListingStatusFilter<$PrismaModel>
    _max?: NestedEnumListingStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutSellerDocsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutSellerDocsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutSellerDocsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSellerDocsInput, UserUncheckedCreateWithoutSellerDocsInput>
  }

  export type UserCreateWithoutBuyerDocsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutBuyerDocsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutBuyerDocsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBuyerDocsInput, UserUncheckedCreateWithoutBuyerDocsInput>
  }

  export type ListingCreateWithoutDocumentsInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutDocumentsInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutDocumentsInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutDocumentsInput, ListingUncheckedCreateWithoutDocumentsInput>
  }

  export type UserCreateWithoutUploadedDocumentsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutUploadedDocumentsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutUploadedDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUploadedDocumentsInput, UserUncheckedCreateWithoutUploadedDocumentsInput>
  }

  export type UserUpsertWithoutSellerDocsInput = {
    update: XOR<UserUpdateWithoutSellerDocsInput, UserUncheckedUpdateWithoutSellerDocsInput>
    create: XOR<UserCreateWithoutSellerDocsInput, UserUncheckedCreateWithoutSellerDocsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSellerDocsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSellerDocsInput, UserUncheckedUpdateWithoutSellerDocsInput>
  }

  export type UserUpdateWithoutSellerDocsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSellerDocsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUpsertWithoutBuyerDocsInput = {
    update: XOR<UserUpdateWithoutBuyerDocsInput, UserUncheckedUpdateWithoutBuyerDocsInput>
    create: XOR<UserCreateWithoutBuyerDocsInput, UserUncheckedCreateWithoutBuyerDocsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBuyerDocsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBuyerDocsInput, UserUncheckedUpdateWithoutBuyerDocsInput>
  }

  export type UserUpdateWithoutBuyerDocsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBuyerDocsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type ListingUpsertWithoutDocumentsInput = {
    update: XOR<ListingUpdateWithoutDocumentsInput, ListingUncheckedUpdateWithoutDocumentsInput>
    create: XOR<ListingCreateWithoutDocumentsInput, ListingUncheckedCreateWithoutDocumentsInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutDocumentsInput, ListingUncheckedUpdateWithoutDocumentsInput>
  }

  export type ListingUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type UserUpsertWithoutUploadedDocumentsInput = {
    update: XOR<UserUpdateWithoutUploadedDocumentsInput, UserUncheckedUpdateWithoutUploadedDocumentsInput>
    create: XOR<UserCreateWithoutUploadedDocumentsInput, UserUncheckedCreateWithoutUploadedDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUploadedDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUploadedDocumentsInput, UserUncheckedUpdateWithoutUploadedDocumentsInput>
  }

  export type UserUpdateWithoutUploadedDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUploadedDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserCreateWithoutManagingInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutManagingInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutManagingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutManagingInput, UserUncheckedCreateWithoutManagingInput>
  }

  export type UserCreateWithoutManagedByInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutManagedByInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutManagedByInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput>
  }

  export type UserCreateManyManagedByInputEnvelope = {
    data: UserCreateManyManagedByInput | UserCreateManyManagedByInput[]
    skipDuplicates?: boolean
  }

  export type ListingCreateWithoutSellerInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutSellerInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutSellerInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput>
  }

  export type ListingCreateManySellerInputEnvelope = {
    data: ListingCreateManySellerInput | ListingCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutBuyerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerDocsInput
    listing?: ListingCreateNestedOneWithoutDocumentsInput
    uploader?: UserCreateNestedOneWithoutUploadedDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutBuyerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutBuyerInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput>
  }

  export type DocumentCreateManyBuyerInputEnvelope = {
    data: DocumentCreateManyBuyerInput | DocumentCreateManyBuyerInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutSellerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    buyer?: UserCreateNestedOneWithoutBuyerDocsInput
    listing?: ListingCreateNestedOneWithoutDocumentsInput
    uploader?: UserCreateNestedOneWithoutUploadedDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutSellerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutSellerInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput>
  }

  export type DocumentCreateManySellerInputEnvelope = {
    data: DocumentCreateManySellerInput | DocumentCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutUploaderInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerDocsInput
    buyer?: UserCreateNestedOneWithoutBuyerDocsInput
    listing?: ListingCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutUploaderInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutUploaderInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput>
  }

  export type DocumentCreateManyUploaderInputEnvelope = {
    data: DocumentCreateManyUploaderInput | DocumentCreateManyUploaderInput[]
    skipDuplicates?: boolean
  }

  export type ActivityCreateWithoutUserInput = {
    id?: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ActivityUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ActivityCreateOrConnectWithoutUserInput = {
    where: ActivityWhereUniqueInput
    create: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput>
  }

  export type ActivityCreateManyUserInputEnvelope = {
    data: ActivityCreateManyUserInput | ActivityCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
    parentMessage?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutReceiverInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    sender: UserCreateNestedOneWithoutSentMessagesInput
    parentMessage?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutReceiverInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput>
  }

  export type MessageCreateManyReceiverInputEnvelope = {
    data: MessageCreateManyReceiverInput | MessageCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type ListingCreateWithoutBuyersInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutBuyersInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutBuyersInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput>
  }

  export type SellerProgressCreateWithoutSellerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    selectedListing?: ListingCreateNestedOneWithoutSellerProgressInput
  }

  export type SellerProgressUncheckedCreateWithoutSellerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProgressCreateOrConnectWithoutSellerInput = {
    where: SellerProgressWhereUniqueInput
    create: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput>
  }

  export type SellerProgressCreateManySellerInputEnvelope = {
    data: SellerProgressCreateManySellerInput | SellerProgressCreateManySellerInput[]
    skipDuplicates?: boolean
  }

  export type BuyerProgressCreateWithoutBuyerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    selectedListing?: ListingCreateNestedOneWithoutBuyerSelectedProgressInput
  }

  export type BuyerProgressUncheckedCreateWithoutBuyerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressCreateOrConnectWithoutBuyerInput = {
    where: BuyerProgressWhereUniqueInput
    create: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput>
  }

  export type BuyerProgressCreateManyBuyerInputEnvelope = {
    data: BuyerProgressCreateManyBuyerInput | BuyerProgressCreateManyBuyerInput[]
    skipDuplicates?: boolean
  }

  export type SellerQuestionnaireCreateWithoutSellerInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    submitted?: boolean
    submittedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerQuestionnaireUncheckedCreateWithoutSellerInput = {
    id?: string
    data: JsonNullValueInput | InputJsonValue
    submitted?: boolean
    submittedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerQuestionnaireCreateOrConnectWithoutSellerInput = {
    where: SellerQuestionnaireWhereUniqueInput
    create: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
  }

  export type PreCloseChecklistCreateWithoutLastUpdatedByUserInput = {
    id?: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    listing: ListingCreateNestedOneWithoutPreCloseChecklistInput
  }

  export type PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput = {
    id?: string
    listingId: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreCloseChecklistCreateOrConnectWithoutLastUpdatedByUserInput = {
    where: PreCloseChecklistWhereUniqueInput
    create: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput>
  }

  export type PreCloseChecklistCreateManyLastUpdatedByUserInputEnvelope = {
    data: PreCloseChecklistCreateManyLastUpdatedByUserInput | PreCloseChecklistCreateManyLastUpdatedByUserInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutManagingInput = {
    update: XOR<UserUpdateWithoutManagingInput, UserUncheckedUpdateWithoutManagingInput>
    create: XOR<UserCreateWithoutManagingInput, UserUncheckedCreateWithoutManagingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutManagingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutManagingInput, UserUncheckedUpdateWithoutManagingInput>
  }

  export type UserUpdateWithoutManagingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutManagingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutManagedByInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutManagedByInput, UserUncheckedUpdateWithoutManagedByInput>
    create: XOR<UserCreateWithoutManagedByInput, UserUncheckedCreateWithoutManagedByInput>
  }

  export type UserUpdateWithWhereUniqueWithoutManagedByInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutManagedByInput, UserUncheckedUpdateWithoutManagedByInput>
  }

  export type UserUpdateManyWithWhereWithoutManagedByInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutManagedByInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    managerId?: StringNullableFilter<"User"> | string | null
    unreadCount?: IntFilter<"User"> | number
    lastReadAt?: DateTimeNullableFilter<"User"> | Date | string | null
  }

  export type ListingUpsertWithWhereUniqueWithoutSellerInput = {
    where: ListingWhereUniqueInput
    update: XOR<ListingUpdateWithoutSellerInput, ListingUncheckedUpdateWithoutSellerInput>
    create: XOR<ListingCreateWithoutSellerInput, ListingUncheckedCreateWithoutSellerInput>
  }

  export type ListingUpdateWithWhereUniqueWithoutSellerInput = {
    where: ListingWhereUniqueInput
    data: XOR<ListingUpdateWithoutSellerInput, ListingUncheckedUpdateWithoutSellerInput>
  }

  export type ListingUpdateManyWithWhereWithoutSellerInput = {
    where: ListingScalarWhereInput
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyWithoutSellerInput>
  }

  export type ListingScalarWhereInput = {
    AND?: ListingScalarWhereInput | ListingScalarWhereInput[]
    OR?: ListingScalarWhereInput[]
    NOT?: ListingScalarWhereInput | ListingScalarWhereInput[]
    id?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringFilter<"Listing"> | string
    price?: FloatFilter<"Listing"> | number
    status?: EnumListingStatusFilter<"Listing"> | $Enums.ListingStatus
    createdAt?: DateTimeFilter<"Listing"> | Date | string
    sellerId?: StringFilter<"Listing"> | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutBuyerInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutBuyerInput, DocumentUncheckedUpdateWithoutBuyerInput>
    create: XOR<DocumentCreateWithoutBuyerInput, DocumentUncheckedCreateWithoutBuyerInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutBuyerInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutBuyerInput, DocumentUncheckedUpdateWithoutBuyerInput>
  }

  export type DocumentUpdateManyWithWhereWithoutBuyerInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutBuyerInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFilter<"Document"> | $Enums.DocumentCategory
    url?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    operationType?: EnumDocumentOperationTypeFilter<"Document"> | $Enums.DocumentOperationType
    stepId?: IntNullableFilter<"Document"> | number | null
    sellerId?: StringFilter<"Document"> | string
    buyerId?: StringNullableFilter<"Document"> | string | null
    listingId?: StringNullableFilter<"Document"> | string | null
    uploadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    downloadedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    uploadedBy?: StringNullableFilter<"Document"> | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutSellerInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutSellerInput, DocumentUncheckedUpdateWithoutSellerInput>
    create: XOR<DocumentCreateWithoutSellerInput, DocumentUncheckedCreateWithoutSellerInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutSellerInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutSellerInput, DocumentUncheckedUpdateWithoutSellerInput>
  }

  export type DocumentUpdateManyWithWhereWithoutSellerInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutSellerInput>
  }

  export type DocumentUpsertWithWhereUniqueWithoutUploaderInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutUploaderInput, DocumentUncheckedUpdateWithoutUploaderInput>
    create: XOR<DocumentCreateWithoutUploaderInput, DocumentUncheckedCreateWithoutUploaderInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutUploaderInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutUploaderInput, DocumentUncheckedUpdateWithoutUploaderInput>
  }

  export type DocumentUpdateManyWithWhereWithoutUploaderInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutUploaderInput>
  }

  export type ActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: ActivityWhereUniqueInput
    update: XOR<ActivityUpdateWithoutUserInput, ActivityUncheckedUpdateWithoutUserInput>
    create: XOR<ActivityCreateWithoutUserInput, ActivityUncheckedCreateWithoutUserInput>
  }

  export type ActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: ActivityWhereUniqueInput
    data: XOR<ActivityUpdateWithoutUserInput, ActivityUncheckedUpdateWithoutUserInput>
  }

  export type ActivityUpdateManyWithWhereWithoutUserInput = {
    where: ActivityScalarWhereInput
    data: XOR<ActivityUpdateManyMutationInput, ActivityUncheckedUpdateManyWithoutUserInput>
  }

  export type ActivityScalarWhereInput = {
    AND?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
    OR?: ActivityScalarWhereInput[]
    NOT?: ActivityScalarWhereInput | ActivityScalarWhereInput[]
    id?: StringFilter<"Activity"> | string
    userId?: StringFilter<"Activity"> | string
    type?: StringFilter<"Activity"> | string
    data?: JsonNullableFilter<"Activity">
    createdAt?: DateTimeFilter<"Activity"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    subject?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    readAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    senderId?: StringFilter<"Message"> | string
    senderType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    senderName?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    receiverType?: EnumUserRoleFilter<"Message"> | $Enums.UserRole
    receiverName?: StringFilter<"Message"> | string
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    isRead?: BoolFilter<"Message"> | boolean
    isArchived?: BoolFilter<"Message"> | boolean
    parentMessageId?: StringNullableFilter<"Message"> | string | null
    threadId?: StringNullableFilter<"Message"> | string | null
  }

  export type MessageUpsertWithWhereUniqueWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutReceiverInput, MessageUncheckedUpdateWithoutReceiverInput>
    create: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutReceiverInput, MessageUncheckedUpdateWithoutReceiverInput>
  }

  export type MessageUpdateManyWithWhereWithoutReceiverInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutReceiverInput>
  }

  export type ListingUpsertWithWhereUniqueWithoutBuyersInput = {
    where: ListingWhereUniqueInput
    update: XOR<ListingUpdateWithoutBuyersInput, ListingUncheckedUpdateWithoutBuyersInput>
    create: XOR<ListingCreateWithoutBuyersInput, ListingUncheckedCreateWithoutBuyersInput>
  }

  export type ListingUpdateWithWhereUniqueWithoutBuyersInput = {
    where: ListingWhereUniqueInput
    data: XOR<ListingUpdateWithoutBuyersInput, ListingUncheckedUpdateWithoutBuyersInput>
  }

  export type ListingUpdateManyWithWhereWithoutBuyersInput = {
    where: ListingScalarWhereInput
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyWithoutBuyersInput>
  }

  export type SellerProgressUpsertWithWhereUniqueWithoutSellerInput = {
    where: SellerProgressWhereUniqueInput
    update: XOR<SellerProgressUpdateWithoutSellerInput, SellerProgressUncheckedUpdateWithoutSellerInput>
    create: XOR<SellerProgressCreateWithoutSellerInput, SellerProgressUncheckedCreateWithoutSellerInput>
  }

  export type SellerProgressUpdateWithWhereUniqueWithoutSellerInput = {
    where: SellerProgressWhereUniqueInput
    data: XOR<SellerProgressUpdateWithoutSellerInput, SellerProgressUncheckedUpdateWithoutSellerInput>
  }

  export type SellerProgressUpdateManyWithWhereWithoutSellerInput = {
    where: SellerProgressScalarWhereInput
    data: XOR<SellerProgressUpdateManyMutationInput, SellerProgressUncheckedUpdateManyWithoutSellerInput>
  }

  export type SellerProgressScalarWhereInput = {
    AND?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
    OR?: SellerProgressScalarWhereInput[]
    NOT?: SellerProgressScalarWhereInput | SellerProgressScalarWhereInput[]
    id?: StringFilter<"SellerProgress"> | string
    sellerId?: StringFilter<"SellerProgress"> | string
    currentStep?: IntFilter<"SellerProgress"> | number
    completedSteps?: JsonFilter<"SellerProgress">
    selectedListingId?: StringNullableFilter<"SellerProgress"> | string | null
    createdAt?: DateTimeFilter<"SellerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"SellerProgress"> | Date | string
  }

  export type BuyerProgressUpsertWithWhereUniqueWithoutBuyerInput = {
    where: BuyerProgressWhereUniqueInput
    update: XOR<BuyerProgressUpdateWithoutBuyerInput, BuyerProgressUncheckedUpdateWithoutBuyerInput>
    create: XOR<BuyerProgressCreateWithoutBuyerInput, BuyerProgressUncheckedCreateWithoutBuyerInput>
  }

  export type BuyerProgressUpdateWithWhereUniqueWithoutBuyerInput = {
    where: BuyerProgressWhereUniqueInput
    data: XOR<BuyerProgressUpdateWithoutBuyerInput, BuyerProgressUncheckedUpdateWithoutBuyerInput>
  }

  export type BuyerProgressUpdateManyWithWhereWithoutBuyerInput = {
    where: BuyerProgressScalarWhereInput
    data: XOR<BuyerProgressUpdateManyMutationInput, BuyerProgressUncheckedUpdateManyWithoutBuyerInput>
  }

  export type BuyerProgressScalarWhereInput = {
    AND?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
    OR?: BuyerProgressScalarWhereInput[]
    NOT?: BuyerProgressScalarWhereInput | BuyerProgressScalarWhereInput[]
    id?: StringFilter<"BuyerProgress"> | string
    buyerId?: StringFilter<"BuyerProgress"> | string
    currentStep?: IntFilter<"BuyerProgress"> | number
    completedSteps?: JsonFilter<"BuyerProgress">
    selectedListingId?: StringNullableFilter<"BuyerProgress"> | string | null
    createdAt?: DateTimeFilter<"BuyerProgress"> | Date | string
    updatedAt?: DateTimeFilter<"BuyerProgress"> | Date | string
  }

  export type SellerQuestionnaireUpsertWithoutSellerInput = {
    update: XOR<SellerQuestionnaireUpdateWithoutSellerInput, SellerQuestionnaireUncheckedUpdateWithoutSellerInput>
    create: XOR<SellerQuestionnaireCreateWithoutSellerInput, SellerQuestionnaireUncheckedCreateWithoutSellerInput>
    where?: SellerQuestionnaireWhereInput
  }

  export type SellerQuestionnaireUpdateToOneWithWhereWithoutSellerInput = {
    where?: SellerQuestionnaireWhereInput
    data: XOR<SellerQuestionnaireUpdateWithoutSellerInput, SellerQuestionnaireUncheckedUpdateWithoutSellerInput>
  }

  export type SellerQuestionnaireUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerQuestionnaireUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    submitted?: BoolFieldUpdateOperationsInput | boolean
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistUpsertWithWhereUniqueWithoutLastUpdatedByUserInput = {
    where: PreCloseChecklistWhereUniqueInput
    update: XOR<PreCloseChecklistUpdateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedUpdateWithoutLastUpdatedByUserInput>
    create: XOR<PreCloseChecklistCreateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedCreateWithoutLastUpdatedByUserInput>
  }

  export type PreCloseChecklistUpdateWithWhereUniqueWithoutLastUpdatedByUserInput = {
    where: PreCloseChecklistWhereUniqueInput
    data: XOR<PreCloseChecklistUpdateWithoutLastUpdatedByUserInput, PreCloseChecklistUncheckedUpdateWithoutLastUpdatedByUserInput>
  }

  export type PreCloseChecklistUpdateManyWithWhereWithoutLastUpdatedByUserInput = {
    where: PreCloseChecklistScalarWhereInput
    data: XOR<PreCloseChecklistUpdateManyMutationInput, PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserInput>
  }

  export type PreCloseChecklistScalarWhereInput = {
    AND?: PreCloseChecklistScalarWhereInput | PreCloseChecklistScalarWhereInput[]
    OR?: PreCloseChecklistScalarWhereInput[]
    NOT?: PreCloseChecklistScalarWhereInput | PreCloseChecklistScalarWhereInput[]
    id?: StringFilter<"PreCloseChecklist"> | string
    listingId?: StringFilter<"PreCloseChecklist"> | string
    buyerItems?: JsonFilter<"PreCloseChecklist">
    sellerItems?: JsonFilter<"PreCloseChecklist">
    brokerItems?: JsonFilter<"PreCloseChecklist">
    lastUpdatedBy?: StringNullableFilter<"PreCloseChecklist"> | string | null
    createdAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
    updatedAt?: DateTimeFilter<"PreCloseChecklist"> | Date | string
  }

  export type UserCreateWithoutSellerProgressInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutSellerProgressInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutSellerProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSellerProgressInput, UserUncheckedCreateWithoutSellerProgressInput>
  }

  export type ListingCreateWithoutSellerProgressInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutSellerProgressInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutSellerProgressInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutSellerProgressInput, ListingUncheckedCreateWithoutSellerProgressInput>
  }

  export type UserUpsertWithoutSellerProgressInput = {
    update: XOR<UserUpdateWithoutSellerProgressInput, UserUncheckedUpdateWithoutSellerProgressInput>
    create: XOR<UserCreateWithoutSellerProgressInput, UserUncheckedCreateWithoutSellerProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSellerProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSellerProgressInput, UserUncheckedUpdateWithoutSellerProgressInput>
  }

  export type UserUpdateWithoutSellerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSellerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type ListingUpsertWithoutSellerProgressInput = {
    update: XOR<ListingUpdateWithoutSellerProgressInput, ListingUncheckedUpdateWithoutSellerProgressInput>
    create: XOR<ListingCreateWithoutSellerProgressInput, ListingUncheckedCreateWithoutSellerProgressInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutSellerProgressInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutSellerProgressInput, ListingUncheckedUpdateWithoutSellerProgressInput>
  }

  export type ListingUpdateWithoutSellerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutSellerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type UserCreateWithoutBuyerProgressInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutBuyerProgressInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutBuyerProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBuyerProgressInput, UserUncheckedCreateWithoutBuyerProgressInput>
  }

  export type ListingCreateWithoutBuyerSelectedProgressInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistCreateNestedOneWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutBuyerSelectedProgressInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    preCloseChecklist?: PreCloseChecklistUncheckedCreateNestedOneWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutBuyerSelectedProgressInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutBuyerSelectedProgressInput, ListingUncheckedCreateWithoutBuyerSelectedProgressInput>
  }

  export type UserUpsertWithoutBuyerProgressInput = {
    update: XOR<UserUpdateWithoutBuyerProgressInput, UserUncheckedUpdateWithoutBuyerProgressInput>
    create: XOR<UserCreateWithoutBuyerProgressInput, UserUncheckedCreateWithoutBuyerProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBuyerProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBuyerProgressInput, UserUncheckedUpdateWithoutBuyerProgressInput>
  }

  export type UserUpdateWithoutBuyerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBuyerProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type ListingUpsertWithoutBuyerSelectedProgressInput = {
    update: XOR<ListingUpdateWithoutBuyerSelectedProgressInput, ListingUncheckedUpdateWithoutBuyerSelectedProgressInput>
    create: XOR<ListingCreateWithoutBuyerSelectedProgressInput, ListingUncheckedCreateWithoutBuyerSelectedProgressInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutBuyerSelectedProgressInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutBuyerSelectedProgressInput, ListingUncheckedUpdateWithoutBuyerSelectedProgressInput>
  }

  export type ListingUpdateWithoutBuyerSelectedProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutBuyerSelectedProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type UserCreateWithoutSentMessagesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutSentMessagesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutSentMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
  }

  export type UserCreateWithoutReceivedMessagesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutReceivedMessagesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutReceivedMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
  }

  export type MessageCreateWithoutRepliesInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
    parentMessage?: MessageCreateNestedOneWithoutRepliesInput
    attachments?: MessageAttachmentCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutRepliesInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
    attachments?: MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutRepliesInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
  }

  export type MessageCreateWithoutParentMessageInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
    replies?: MessageCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutParentMessageInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutParentMessageInput
    attachments?: MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutParentMessageInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput>
  }

  export type MessageCreateManyParentMessageInputEnvelope = {
    data: MessageCreateManyParentMessageInput | MessageCreateManyParentMessageInput[]
    skipDuplicates?: boolean
  }

  export type MessageAttachmentCreateWithoutMessageInput = {
    id?: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type MessageAttachmentUncheckedCreateWithoutMessageInput = {
    id?: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type MessageAttachmentCreateOrConnectWithoutMessageInput = {
    where: MessageAttachmentWhereUniqueInput
    create: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput>
  }

  export type MessageAttachmentCreateManyMessageInputEnvelope = {
    data: MessageAttachmentCreateManyMessageInput | MessageAttachmentCreateManyMessageInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSentMessagesInput = {
    update: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type UserUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUpsertWithoutReceivedMessagesInput = {
    update: XOR<UserUpdateWithoutReceivedMessagesInput, UserUncheckedUpdateWithoutReceivedMessagesInput>
    create: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedMessagesInput, UserUncheckedUpdateWithoutReceivedMessagesInput>
  }

  export type UserUpdateWithoutReceivedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type MessageUpsertWithoutRepliesInput = {
    update: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutRepliesInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
    parentMessage?: MessageUpdateOneWithoutRepliesNestedInput
    attachments?: MessageAttachmentUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutParentMessageInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutParentMessageInput, MessageUncheckedUpdateWithoutParentMessageInput>
    create: XOR<MessageCreateWithoutParentMessageInput, MessageUncheckedCreateWithoutParentMessageInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutParentMessageInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutParentMessageInput, MessageUncheckedUpdateWithoutParentMessageInput>
  }

  export type MessageUpdateManyWithWhereWithoutParentMessageInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutParentMessageInput>
  }

  export type MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput = {
    where: MessageAttachmentWhereUniqueInput
    update: XOR<MessageAttachmentUpdateWithoutMessageInput, MessageAttachmentUncheckedUpdateWithoutMessageInput>
    create: XOR<MessageAttachmentCreateWithoutMessageInput, MessageAttachmentUncheckedCreateWithoutMessageInput>
  }

  export type MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput = {
    where: MessageAttachmentWhereUniqueInput
    data: XOR<MessageAttachmentUpdateWithoutMessageInput, MessageAttachmentUncheckedUpdateWithoutMessageInput>
  }

  export type MessageAttachmentUpdateManyWithWhereWithoutMessageInput = {
    where: MessageAttachmentScalarWhereInput
    data: XOR<MessageAttachmentUpdateManyMutationInput, MessageAttachmentUncheckedUpdateManyWithoutMessageInput>
  }

  export type MessageAttachmentScalarWhereInput = {
    AND?: MessageAttachmentScalarWhereInput | MessageAttachmentScalarWhereInput[]
    OR?: MessageAttachmentScalarWhereInput[]
    NOT?: MessageAttachmentScalarWhereInput | MessageAttachmentScalarWhereInput[]
    id?: StringFilter<"MessageAttachment"> | string
    messageId?: StringFilter<"MessageAttachment"> | string
    fileName?: StringFilter<"MessageAttachment"> | string
    fileSize?: IntFilter<"MessageAttachment"> | number
    fileType?: StringFilter<"MessageAttachment"> | string
    fileUrl?: StringFilter<"MessageAttachment"> | string
    uploadedAt?: DateTimeFilter<"MessageAttachment"> | Date | string
  }

  export type MessageCreateWithoutAttachmentsInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
    parentMessage?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutParentMessageInput
  }

  export type MessageUncheckedCreateWithoutAttachmentsInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutParentMessageInput
  }

  export type MessageCreateOrConnectWithoutAttachmentsInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutAttachmentsInput, MessageUncheckedCreateWithoutAttachmentsInput>
  }

  export type MessageUpsertWithoutAttachmentsInput = {
    update: XOR<MessageUpdateWithoutAttachmentsInput, MessageUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<MessageCreateWithoutAttachmentsInput, MessageUncheckedCreateWithoutAttachmentsInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutAttachmentsInput, MessageUncheckedUpdateWithoutAttachmentsInput>
  }

  export type MessageUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
    parentMessage?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutParentMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutParentMessageNestedInput
  }

  export type UserCreateWithoutListingsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutListingsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutListingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutListingsInput, UserUncheckedCreateWithoutListingsInput>
  }

  export type UserCreateWithoutBuyingListingsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutBuyingListingsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutBuyingListingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput>
  }

  export type DocumentCreateWithoutListingInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerDocsInput
    buyer?: UserCreateNestedOneWithoutBuyerDocsInput
    uploader?: UserCreateNestedOneWithoutUploadedDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutListingInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutListingInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput>
  }

  export type DocumentCreateManyListingInputEnvelope = {
    data: DocumentCreateManyListingInput | DocumentCreateManyListingInput[]
    skipDuplicates?: boolean
  }

  export type SellerProgressCreateWithoutSelectedListingInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    seller: UserCreateNestedOneWithoutSellerProgressInput
  }

  export type SellerProgressUncheckedCreateWithoutSelectedListingInput = {
    id?: string
    sellerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProgressCreateOrConnectWithoutSelectedListingInput = {
    where: SellerProgressWhereUniqueInput
    create: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput>
  }

  export type SellerProgressCreateManySelectedListingInputEnvelope = {
    data: SellerProgressCreateManySelectedListingInput | SellerProgressCreateManySelectedListingInput[]
    skipDuplicates?: boolean
  }

  export type BuyerProgressCreateWithoutSelectedListingInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    buyer: UserCreateNestedOneWithoutBuyerProgressInput
  }

  export type BuyerProgressUncheckedCreateWithoutSelectedListingInput = {
    id?: string
    buyerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressCreateOrConnectWithoutSelectedListingInput = {
    where: BuyerProgressWhereUniqueInput
    create: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput>
  }

  export type BuyerProgressCreateManySelectedListingInputEnvelope = {
    data: BuyerProgressCreateManySelectedListingInput | BuyerProgressCreateManySelectedListingInput[]
    skipDuplicates?: boolean
  }

  export type PreCloseChecklistCreateWithoutListingInput = {
    id?: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    lastUpdatedByUser?: UserCreateNestedOneWithoutUpdatedChecklistsInput
  }

  export type PreCloseChecklistUncheckedCreateWithoutListingInput = {
    id?: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreCloseChecklistCreateOrConnectWithoutListingInput = {
    where: PreCloseChecklistWhereUniqueInput
    create: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
  }

  export type UserUpsertWithoutListingsInput = {
    update: XOR<UserUpdateWithoutListingsInput, UserUncheckedUpdateWithoutListingsInput>
    create: XOR<UserCreateWithoutListingsInput, UserUncheckedCreateWithoutListingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutListingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutListingsInput, UserUncheckedUpdateWithoutListingsInput>
  }

  export type UserUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutBuyingListingsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutBuyingListingsInput, UserUncheckedUpdateWithoutBuyingListingsInput>
    create: XOR<UserCreateWithoutBuyingListingsInput, UserUncheckedCreateWithoutBuyingListingsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutBuyingListingsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutBuyingListingsInput, UserUncheckedUpdateWithoutBuyingListingsInput>
  }

  export type UserUpdateManyWithWhereWithoutBuyingListingsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutBuyingListingsInput>
  }

  export type DocumentUpsertWithWhereUniqueWithoutListingInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutListingInput, DocumentUncheckedUpdateWithoutListingInput>
    create: XOR<DocumentCreateWithoutListingInput, DocumentUncheckedCreateWithoutListingInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutListingInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutListingInput, DocumentUncheckedUpdateWithoutListingInput>
  }

  export type DocumentUpdateManyWithWhereWithoutListingInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutListingInput>
  }

  export type SellerProgressUpsertWithWhereUniqueWithoutSelectedListingInput = {
    where: SellerProgressWhereUniqueInput
    update: XOR<SellerProgressUpdateWithoutSelectedListingInput, SellerProgressUncheckedUpdateWithoutSelectedListingInput>
    create: XOR<SellerProgressCreateWithoutSelectedListingInput, SellerProgressUncheckedCreateWithoutSelectedListingInput>
  }

  export type SellerProgressUpdateWithWhereUniqueWithoutSelectedListingInput = {
    where: SellerProgressWhereUniqueInput
    data: XOR<SellerProgressUpdateWithoutSelectedListingInput, SellerProgressUncheckedUpdateWithoutSelectedListingInput>
  }

  export type SellerProgressUpdateManyWithWhereWithoutSelectedListingInput = {
    where: SellerProgressScalarWhereInput
    data: XOR<SellerProgressUpdateManyMutationInput, SellerProgressUncheckedUpdateManyWithoutSelectedListingInput>
  }

  export type BuyerProgressUpsertWithWhereUniqueWithoutSelectedListingInput = {
    where: BuyerProgressWhereUniqueInput
    update: XOR<BuyerProgressUpdateWithoutSelectedListingInput, BuyerProgressUncheckedUpdateWithoutSelectedListingInput>
    create: XOR<BuyerProgressCreateWithoutSelectedListingInput, BuyerProgressUncheckedCreateWithoutSelectedListingInput>
  }

  export type BuyerProgressUpdateWithWhereUniqueWithoutSelectedListingInput = {
    where: BuyerProgressWhereUniqueInput
    data: XOR<BuyerProgressUpdateWithoutSelectedListingInput, BuyerProgressUncheckedUpdateWithoutSelectedListingInput>
  }

  export type BuyerProgressUpdateManyWithWhereWithoutSelectedListingInput = {
    where: BuyerProgressScalarWhereInput
    data: XOR<BuyerProgressUpdateManyMutationInput, BuyerProgressUncheckedUpdateManyWithoutSelectedListingInput>
  }

  export type PreCloseChecklistUpsertWithoutListingInput = {
    update: XOR<PreCloseChecklistUpdateWithoutListingInput, PreCloseChecklistUncheckedUpdateWithoutListingInput>
    create: XOR<PreCloseChecklistCreateWithoutListingInput, PreCloseChecklistUncheckedCreateWithoutListingInput>
    where?: PreCloseChecklistWhereInput
  }

  export type PreCloseChecklistUpdateToOneWithWhereWithoutListingInput = {
    where?: PreCloseChecklistWhereInput
    data: XOR<PreCloseChecklistUpdateWithoutListingInput, PreCloseChecklistUncheckedUpdateWithoutListingInput>
  }

  export type PreCloseChecklistUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUpdatedByUser?: UserUpdateOneWithoutUpdatedChecklistsNestedInput
  }

  export type PreCloseChecklistUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    lastUpdatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutActivitiesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutActivitiesInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
  }

  export type UserUpsertWithoutActivitiesInput = {
    update: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserCreateWithoutSellerQuestionnaireInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    updatedChecklists?: PreCloseChecklistCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserUncheckedCreateWithoutSellerQuestionnaireInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    updatedChecklists?: PreCloseChecklistUncheckedCreateNestedManyWithoutLastUpdatedByUserInput
  }

  export type UserCreateOrConnectWithoutSellerQuestionnaireInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSellerQuestionnaireInput, UserUncheckedCreateWithoutSellerQuestionnaireInput>
  }

  export type UserUpsertWithoutSellerQuestionnaireInput = {
    update: XOR<UserUpdateWithoutSellerQuestionnaireInput, UserUncheckedUpdateWithoutSellerQuestionnaireInput>
    create: XOR<UserCreateWithoutSellerQuestionnaireInput, UserUncheckedCreateWithoutSellerQuestionnaireInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSellerQuestionnaireInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSellerQuestionnaireInput, UserUncheckedUpdateWithoutSellerQuestionnaireInput>
  }

  export type UserUpdateWithoutSellerQuestionnaireInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSellerQuestionnaireInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type ListingCreateWithoutPreCloseChecklistInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    seller: UserCreateNestedOneWithoutListingsInput
    buyers?: UserCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressCreateNestedManyWithoutSelectedListingInput
  }

  export type ListingUncheckedCreateWithoutPreCloseChecklistInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
    sellerId: string
    buyers?: UserUncheckedCreateNestedManyWithoutBuyingListingsInput
    documents?: DocumentUncheckedCreateNestedManyWithoutListingInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
    buyerSelectedProgress?: BuyerProgressUncheckedCreateNestedManyWithoutSelectedListingInput
  }

  export type ListingCreateOrConnectWithoutPreCloseChecklistInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutPreCloseChecklistInput, ListingUncheckedCreateWithoutPreCloseChecklistInput>
  }

  export type UserCreateWithoutUpdatedChecklistsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
    managedBy?: UserCreateNestedOneWithoutManagingInput
    managing?: UserCreateNestedManyWithoutManagedByInput
    listings?: ListingCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentCreateNestedManyWithoutUploaderInput
    activities?: ActivityCreateNestedManyWithoutUserInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireCreateNestedOneWithoutSellerInput
  }

  export type UserUncheckedCreateWithoutUpdatedChecklistsInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    managerId?: string | null
    unreadCount?: number
    lastReadAt?: Date | string | null
    managing?: UserUncheckedCreateNestedManyWithoutManagedByInput
    listings?: ListingUncheckedCreateNestedManyWithoutSellerInput
    buyerDocs?: DocumentUncheckedCreateNestedManyWithoutBuyerInput
    sellerDocs?: DocumentUncheckedCreateNestedManyWithoutSellerInput
    uploadedDocuments?: DocumentUncheckedCreateNestedManyWithoutUploaderInput
    activities?: ActivityUncheckedCreateNestedManyWithoutUserInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
    buyingListings?: ListingUncheckedCreateNestedManyWithoutBuyersInput
    sellerProgress?: SellerProgressUncheckedCreateNestedManyWithoutSellerInput
    buyerProgress?: BuyerProgressUncheckedCreateNestedManyWithoutBuyerInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedCreateNestedOneWithoutSellerInput
  }

  export type UserCreateOrConnectWithoutUpdatedChecklistsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUpdatedChecklistsInput, UserUncheckedCreateWithoutUpdatedChecklistsInput>
  }

  export type ListingUpsertWithoutPreCloseChecklistInput = {
    update: XOR<ListingUpdateWithoutPreCloseChecklistInput, ListingUncheckedUpdateWithoutPreCloseChecklistInput>
    create: XOR<ListingCreateWithoutPreCloseChecklistInput, ListingUncheckedCreateWithoutPreCloseChecklistInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutPreCloseChecklistInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutPreCloseChecklistInput, ListingUncheckedUpdateWithoutPreCloseChecklistInput>
  }

  export type ListingUpdateWithoutPreCloseChecklistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutPreCloseChecklistInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
  }

  export type UserUpsertWithoutUpdatedChecklistsInput = {
    update: XOR<UserUpdateWithoutUpdatedChecklistsInput, UserUncheckedUpdateWithoutUpdatedChecklistsInput>
    create: XOR<UserCreateWithoutUpdatedChecklistsInput, UserUncheckedCreateWithoutUpdatedChecklistsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUpdatedChecklistsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUpdatedChecklistsInput, UserUncheckedUpdateWithoutUpdatedChecklistsInput>
  }

  export type UserUpdateWithoutUpdatedChecklistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
  }

  export type UserUncheckedUpdateWithoutUpdatedChecklistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
  }

  export type UserCreateManyManagedByInput = {
    id?: string
    email: string
    password: string
    name?: string
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    unreadCount?: number
    lastReadAt?: Date | string | null
  }

  export type ListingCreateManySellerInput = {
    id?: string
    title: string
    description: string
    price: number
    status?: $Enums.ListingStatus
    createdAt?: Date | string
  }

  export type DocumentCreateManyBuyerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateManySellerInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateManyUploaderInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    listingId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActivityCreateManyUserInput = {
    id?: string
    type: string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageCreateManySenderInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
  }

  export type MessageCreateManyReceiverInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    parentMessageId?: string | null
    threadId?: string | null
  }

  export type SellerProgressCreateManySellerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressCreateManyBuyerInput = {
    id?: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PreCloseChecklistCreateManyLastUpdatedByUserInput = {
    id?: string
    listingId: string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutManagedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutManagedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    buyingListings?: ListingUncheckedUpdateManyWithoutBuyersNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutManagedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ListingUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyers?: UserUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyers?: UserUncheckedUpdateManyWithoutBuyingListingsNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerDocsNestedInput
    listing?: ListingUpdateOneWithoutDocumentsNestedInput
    uploader?: UserUpdateOneWithoutUploadedDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyer?: UserUpdateOneWithoutBuyerDocsNestedInput
    listing?: ListingUpdateOneWithoutDocumentsNestedInput
    uploader?: UserUpdateOneWithoutUploadedDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerDocsNestedInput
    buyer?: UserUpdateOneWithoutBuyerDocsNestedInput
    listing?: ListingUpdateOneWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    listingId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
    parentMessage?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    parentMessage?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    parentMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ListingUpdateWithoutBuyersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutListingsNestedInput
    documents?: DocumentUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutBuyersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
    documents?: DocumentUncheckedUpdateManyWithoutListingNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    buyerSelectedProgress?: BuyerProgressUncheckedUpdateManyWithoutSelectedListingNestedInput
    preCloseChecklist?: PreCloseChecklistUncheckedUpdateOneWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateManyWithoutBuyersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    status?: EnumListingStatusFieldUpdateOperationsInput | $Enums.ListingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sellerId?: StringFieldUpdateOperationsInput | string
  }

  export type SellerProgressUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    selectedListing?: ListingUpdateOneWithoutSellerProgressNestedInput
  }

  export type SellerProgressUncheckedUpdateWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProgressUncheckedUpdateManyWithoutSellerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    selectedListing?: ListingUpdateOneWithoutBuyerSelectedProgressNestedInput
  }

  export type BuyerProgressUncheckedUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressUncheckedUpdateManyWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    selectedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistUpdateWithoutLastUpdatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listing?: ListingUpdateOneRequiredWithoutPreCloseChecklistNestedInput
  }

  export type PreCloseChecklistUncheckedUpdateWithoutLastUpdatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    buyerItems?: JsonNullValueInput | InputJsonValue
    sellerItems?: JsonNullValueInput | InputJsonValue
    brokerItems?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyParentMessageInput = {
    id?: string
    subject: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    readAt?: Date | string | null
    senderId: string
    senderType: $Enums.UserRole
    senderName: string
    receiverId: string
    receiverType: $Enums.UserRole
    receiverName: string
    status?: $Enums.MessageStatus
    isRead?: boolean
    isArchived?: boolean
    threadId?: string | null
  }

  export type MessageAttachmentCreateManyMessageInput = {
    id?: string
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type MessageUpdateWithoutParentMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
    replies?: MessageUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutParentMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutParentMessageNestedInput
    attachments?: MessageAttachmentUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutParentMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    senderName?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverType?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    receiverName?: StringFieldUpdateOperationsInput | string
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageAttachmentUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageAttachmentUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageAttachmentUncheckedUpdateManyWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileType?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyListingInput = {
    id?: string
    type: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    category?: $Enums.DocumentCategory
    url?: string | null
    fileName?: string | null
    fileSize?: number | null
    operationType?: $Enums.DocumentOperationType
    stepId?: number | null
    sellerId: string
    buyerId?: string | null
    uploadedAt?: Date | string | null
    downloadedAt?: Date | string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProgressCreateManySelectedListingInput = {
    id?: string
    sellerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerProgressCreateManySelectedListingInput = {
    id?: string
    buyerId: string
    currentStep?: number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutBuyingListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managedBy?: UserUpdateOneWithoutManagingNestedInput
    managing?: UserUpdateManyWithoutManagedByNestedInput
    listings?: ListingUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
    sellerProgress?: SellerProgressUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBuyingListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    managing?: UserUncheckedUpdateManyWithoutManagedByNestedInput
    listings?: ListingUncheckedUpdateManyWithoutSellerNestedInput
    buyerDocs?: DocumentUncheckedUpdateManyWithoutBuyerNestedInput
    sellerDocs?: DocumentUncheckedUpdateManyWithoutSellerNestedInput
    uploadedDocuments?: DocumentUncheckedUpdateManyWithoutUploaderNestedInput
    activities?: ActivityUncheckedUpdateManyWithoutUserNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
    sellerProgress?: SellerProgressUncheckedUpdateManyWithoutSellerNestedInput
    buyerProgress?: BuyerProgressUncheckedUpdateManyWithoutBuyerNestedInput
    sellerQuestionnaire?: SellerQuestionnaireUncheckedUpdateOneWithoutSellerNestedInput
    updatedChecklists?: PreCloseChecklistUncheckedUpdateManyWithoutLastUpdatedByUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutBuyingListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    unreadCount?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DocumentUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerDocsNestedInput
    buyer?: UserUpdateOneWithoutBuyerDocsNestedInput
    uploader?: UserUpdateOneWithoutUploadedDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    category?: EnumDocumentCategoryFieldUpdateOperationsInput | $Enums.DocumentCategory
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    operationType?: EnumDocumentOperationTypeFieldUpdateOperationsInput | $Enums.DocumentOperationType
    stepId?: NullableIntFieldUpdateOperationsInput | number | null
    sellerId?: StringFieldUpdateOperationsInput | string
    buyerId?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    downloadedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProgressUpdateWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seller?: UserUpdateOneRequiredWithoutSellerProgressNestedInput
  }

  export type SellerProgressUncheckedUpdateWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProgressUncheckedUpdateManyWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    sellerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressUpdateWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyer?: UserUpdateOneRequiredWithoutBuyerProgressNestedInput
  }

  export type BuyerProgressUncheckedUpdateWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerProgressUncheckedUpdateManyWithoutSelectedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    currentStep?: IntFieldUpdateOperationsInput | number
    completedSteps?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}