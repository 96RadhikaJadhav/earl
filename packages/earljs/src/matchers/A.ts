import { Exact } from 'ts-essentials'

import { BigIntLike, NewableOrPrimitive } from '../types'
import { Matcher } from './Base'

export type Class2Primitive<T> = T extends String
  ? string
  : T extends Number
  ? number
  : T extends Boolean
  ? boolean
  : T extends BigIntLike
  ? bigint
  : T extends Symbol
  ? symbol
  : T extends Exact<Object, T>
  ? any
  : T

/**
 * Matches a instance of a class.
 * It's works with primitives as expected (uses typeof).
 * When matching Object won't match nulls.
 */
export class AMatcher<T> extends Matcher {
  constructor(private readonly clazz: NewableOrPrimitive<T>) {
    super()
  }

  check(v: unknown) {
    if (this.clazz === (String as any)) {
      return typeof v === 'string' || v instanceof String
    }
    if (this.clazz === (Number as any)) {
      return (typeof v === 'number' && !isNaN(v)) || v instanceof Number
    }
    if (this.clazz === (Boolean as any)) {
      return typeof v === 'boolean' || v instanceof Boolean
    }
    if (this.clazz === BigInt) {
      return typeof v === 'bigint' || v instanceof BigInt
    }
    if (this.clazz === (Function as any)) {
      return typeof v === 'function' || v instanceof Function
    }
    if (this.clazz === (Object as any)) {
      return typeof v === 'object' && v !== null
    }
    if (this.clazz === Symbol) {
      return typeof v === 'symbol'
    }
    if (this.clazz === (Array as any)) {
      return Array.isArray(v)
    }

    return v instanceof this.clazz
  }

  toString() {
    return `[A: ${this.clazz.name}]`
  }

  static make<T>(clazz: NewableOrPrimitive<T>): Class2Primitive<T> {
    return new AMatcher(clazz) as any
  }
}
