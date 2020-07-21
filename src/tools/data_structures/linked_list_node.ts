export class LinkedListNode<T> {
  private _previous: LinkedListNode<T> | null

  private _next: LinkedListNode<T> | null

  private _item: T

  constructor(item: T = null) {
    this._item = item
    this._previous = null
    this._next = null
  }

  get item(): T {
    return this._item
  }

  set item(item: T) {
    this._item = item
  }

  get previous(): LinkedListNode<T> | null {
    return this._previous
  }

  set previous(previous: LinkedListNode<T>) {
    this._previous = previous
  }

  get next(): LinkedListNode<T> | null {
    return this._next
  }

  set next(next: LinkedListNode<T>) {
    this._next = next
  }
}
