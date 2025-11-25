import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { cookies } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
  
  // Check cookie and prefer it over the default/inferred locale if it exists
  // This is necessary because localePrefix: 'never' combined with localeDetection: false
  // causes the middleware to default to 'en' (or undefined) regardless of the cookie.
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    locale = cookieLocale;
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

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
    locale
  }
})