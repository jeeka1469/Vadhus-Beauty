interface SendReminderParams {
  accessToken: string
  phoneNumberId: string
  templateName: string
  languageCode: string
  to: string
  customerName: string
  invoiceNumber: string
  totalAmount: string
  bookingDate: string
}

interface WhatsAppResponse {
  messages?: Array<{ id?: string }>
  error?: { message?: string }
}

export function normalizeWhatsappPhone(rawPhone: string, defaultCountryCode: string) {
  const digitsOnly = rawPhone.replace(/\D/g, '')
  const countryCode = defaultCountryCode.replace(/\D/g, '')

  if (!digitsOnly) {
    return ''
  }

  if (digitsOnly.length === 10) {
    return `${countryCode}${digitsOnly}`
  }

  if (countryCode && digitsOnly.startsWith(countryCode)) {
    return digitsOnly
  }

  return digitsOnly
}

export async function sendWhatsappPaymentReminder({
  accessToken,
  phoneNumberId,
  templateName,
  languageCode,
  to,
  customerName,
  invoiceNumber,
  totalAmount,
  bookingDate,
}: SendReminderParams) {
  const endpoint = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: invoiceNumber },
            { type: 'text', text: totalAmount },
            { type: 'text', text: bookingDate },
          ],
        },
      ],
    },
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseJson = (await response.json()) as WhatsAppResponse

  return {
    ok: response.ok,
    messageId: responseJson.messages?.[0]?.id,
    error: responseJson.error?.message,
    raw: responseJson,
  }
}
