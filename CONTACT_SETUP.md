# Contact form activation

Create a contact form at https://formspree.io and set the recipient to iammoeez@gmail.com. Complete any recipient verification in that account.

Set NEXT_PUBLIC_FORMSPREE_ENDPOINT to the actual https://formspree.io/f/FORM_ID endpoint in .env.local for local review, and in Vercel's environment settings before the approved deployment. Restart the dev server after changing it. This endpoint is public, not an API secret.

The form stays on the page, preserves inputs on failure, and shows success only after a successful service response. Until configured it reports unavailability rather than claiming a message was sent.

Before publishing, verify a real test submission arrives in the intended inbox and enable the service's spam controls. No message has been sent during implementation.

Social brand icons: Instagram, Behance and LinkedIn from the installed react-icons Font Awesome brand collection. Arc.dev icon downloaded from https://assets.arc.dev/icons/favicon-192x192.png.
