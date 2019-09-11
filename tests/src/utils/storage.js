import {
  validatenull
} from '@/utils/validate'
/**
 * Set storage
 *
 * @param name
 * @param content
 * @param maxAge
 */
export const setStore = (name, content, maxAge = null) => {
  if (!global.window || !name) {
    return
  }

  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }

  const storage = global.window.localStorage

  storage.setItem(name, content)
  if (maxAge && !isNaN(parseInt(maxAge))) {
    const timeout = parseInt(new Date().getTime() / 1000)
    storage.setItem(`${name}_expire`, timeout + maxAge)
  }
}

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStore = name => {
  if (!global.window || !name) {
    return
  }

  const content = window.localStorage.getItem(name)
  const _expire = window.localStorage.getItem(`${name}_expire`)

  if (_expire) {
    const now = parseInt(new Date().getTime() / 1000)
    if (now > _expire) {
      return
    }
  }

  try {
    return JSON.parse(content)
  } catch (e) {
    return content
  }
}

/**
 * Clear storage
 *
 * @param name
 */
export const clearStore = name => {
  if (!global.window || !name) {
    return
  }

  window.localStorage.removeItem(name)
  window.localStorage.removeItem(`${name}_expire`)
}

/**
 * Clear all storage
 */
export const clearAll = () => {
  if (!global.window || !name) {
    return
  }

  window.localStorage.clear()
}

export const setSessionStore = (params) => {
  const {
    name,
    content
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    datetime: new Date().getTime()
  }
  window.sessionStorage.setItem(name, JSON.stringify(obj))
}

export const getSessionStore = (params) => {
  const {
    name
    // type
  } = params
  let obj = {}
  let content
  obj = window.localStorage.getItem(name)
  if (validatenull(obj)) obj = window.sessionStorage.getItem(name)
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    /* eslint-disable */
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}

export const removeSessionStore = params => {
  const {
    name
  } = params
  window.sessionStorage.removeItem(name)
}
export const clearSessionStore = () => {
  window.sessionStorage.clear()
}
