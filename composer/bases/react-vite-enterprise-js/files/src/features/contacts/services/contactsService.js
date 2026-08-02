// Maps JSONPlaceholder's /users shape into this feature's own Contact
// model — the seam between "whatever the API happens to return" and "what
// this feature's components actually work with". Swap this mapping (not
// every component that reads a contact) once you point at your real
// backend's actual response shape.
export function mapApiContact(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    company: apiUser.company?.name ?? "",
  };
}

export function mapApiContacts(apiUsers) {
  return apiUsers.map(mapApiContact);
}
