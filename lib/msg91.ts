interface SendMsg91SmsParams {
  authKey: string
  senderId: string
  to: string
  message: string
  route: string
  country: string
  templateId?: string
}

interface Msg91ApiResponse {
  type?: string
  message?: string
}

export function normalizeIndianPhone(rawPhone: string, defaultCountryCode: string) {
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

export function buildPaymentReminderMessage({
  customerName,
  invoiceNumber,
  amount,
}: {
  customerName: string
  invoiceNumber: string
  amount: string
}) {
  return `Hi ${customerName}, your invoice ${invoiceNumber} for ${amount} is pending. Please complete payment. - Vadhus Beauty`
}

export async function sendMsg91Sms({
  authKey,
  senderId,
  to,
  message,
  route,
  country,
  templateId,
}: SendMsg91SmsParams) {
  const endpoint = 'https://control.msg91.com/api/v2/sendsms'

  const payload: {
    sender: string
    route: string
    country: string
    sms: Array<{ message: string; to: string[] }>
    template_id?: string
  } = {
    sender: senderId,
    route,
    country,
    sms: [
      {
        message,
        to: [to],
      },
    ],
  }

  if (templateId) {
    payload.template_id = templateId
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseJson = (await response.json()) as Msg91ApiResponse

  return {
    ok: response.ok,
    error: responseJson.message,
    raw: responseJson,
  }
}
