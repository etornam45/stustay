import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = 'StuStay <noreply@stustay.com>'

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[email] To ${to}: ${subject}\n${html}`)
    return { data: null, error: null }
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  })
  return { data, error }
}

export async function sendVerificationEmail(to: string, code: string) {
  return sendEmail(
    to,
    'Verify your StuStay account',
    `<p>Your verification code is: <strong>${code}</strong></p><p>It expires in 15 minutes.</p>`
  )
}

export async function sendNewBookingEmail(
  to: string,
  listingTitle: string,
  studentName: string,
  semester: string,
  academicYear: string
) {
  return sendEmail(
    to,
    'New booking request',
    `<p><strong>${studentName}</strong> requested a viewing for <strong>${listingTitle}</strong> (${semester}, ${academicYear}).</p><p>Open the StuStay app to accept or reject.</p>`
  )
}

export async function sendBookingStatusEmail(
  to: string,
  status: 'accepted' | 'rejected',
  listingTitle: string
) {
  const label = status === 'accepted' ? 'accepted' : 'rejected'
  return sendEmail(
    to,
    `Booking request ${label}`,
    `<p>Your booking request for <strong>${listingTitle}</strong> has been ${label}.</p>`
  )
}
