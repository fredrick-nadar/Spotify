import clevertap from 'clevertap-web-sdk'

clevertap.spa = true

const accountId = import.meta.env.VITE_CLEVERTAP_ACCOUNT_ID
const region = import.meta.env.VITE_CLEVERTAP_REGION

if (accountId && region) {
  clevertap.init(accountId, region)
} else {
  console.error(
    '[CleverTap] Initialization failed: Missing environment variables.',
    {
      accountIdPresent: Boolean(accountId),
      regionPresent: Boolean(region),
    }
  )
}
// Attach the new account to its CleverTap profile, then record the sign-up event.
export function Signup(user) {
  clevertap.onUserLogin.push({ Site: { Identity: user.id, Name: user.name, Email: user.email } })
  clevertap.event.push('Signed Up', { Method: 'Email' })
}

export function Login(user) {
  clevertap.onUserLogin.push({ Site: { Identity: user.id, Name: user.name, Email: user.email } })
  clevertap.event.push('Logged In', { Method: 'Email' })
}

export default clevertap
