/**
 * 表单校验工具
 */
export const rules = {
  required: (value, field) => (!value || !String(value).trim()) ? `${field}不能为空` : null,
  minLength: (value, field, min) => String(value).length < min ? `${field}长度不能少于${min}个字符` : null,
  maxLength: (value, field, max) => String(value).length > max ? `${field}长度不能超过${max}个字符` : null,
  number: (value, field) => isNaN(Number(value)) ? `${field}必须是数字` : null,
  min: (value, field, min) => Number(value) < min ? `${field}不能小于${min}` : null,
  max: (value, field, max) => Number(value) > max ? `${field}不能大于${max}` : null,
  pattern: (value, field, regex, msg) => !regex.test(value) ? (msg || `${field}格式不正确`) : null,
  email: (value, field) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `${field}格式不正确` : null
}

export const validate = (value, fieldName, validations) => {
  for (const v of validations) {
    const error = v(value, fieldName)
    if (error) return error
  }
  return null
}

export const validateForm = (data, schema) => {
  const errors = {}
  for (const [field, validations] of Object.entries(schema)) {
    const error = validate(data[field], field, validations)
    if (error) errors[field] = error
  }
  return Object.keys(errors).length ? errors : null
}
