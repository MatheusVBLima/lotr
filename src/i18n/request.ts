import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale = 'en' }) => {
  console.log(`🌐 [REQUEST CONFIG] Loading messages for locale: ${locale}`)
  
  // Always try to load the requested locale, fallback to 'en' if not found
  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
    console.log(`✅ [REQUEST CONFIG] Messages loaded for locale: ${locale}`)
  } catch (error) {
    console.log(`⚠️ [REQUEST CONFIG] Fallback to 'en' for locale: ${locale}`)
    messages = (await import(`../../messages/en.json`)).default;
  }

  return {
    messages,
    locale: locale as string
  }
})