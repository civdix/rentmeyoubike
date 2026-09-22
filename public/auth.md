# Rent on Cent - Agent Registration & Authentication (auth.md)

> Automated Agent Registration, OAuth Discovery, and Programmatic Interaction Specification for Rent on Cent (`https://rentoncent.bond`).

This document defines how autonomous AI agents, personal assistants, and automated clients discover, authenticate, and interact with the **Rent on Cent** peer-to-peer bike and scooter rental platform in Vrindavan and Mathura.

---

## 1. Agent Audience & Intended Use

Rent on Cent welcomes autonomous shopping, travel, and logistics agents representing tourists, pilgrims, and local commuters. Agents are permitted to:
- Discover rental fleet inventory, hourly/daily tariffs, and vehicle availability.
- Estimate distance, rental rates, and doorstep delivery fees across Mathura, Vrindavan, and Yamuna Expressway hubs.
- Place vehicle booking requests on behalf of verified human users.

---

## 2. OAuth Protected Resource Metadata (PRM)

Per [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728), Rent on Cent publishes its protected resource metadata at:
- **PRM Endpoint:** `https://rentoncent.bond/.well-known/oauth-protected-resource`
- **Resource Identifier:** `https://rentoncent.bond`
- **Authorization Server:** `https://rentoncent.bond`
- **Bearer Methods Supported:** `["header"]`
- **Scopes Supported:**
  - `read:fleet`: Query available scooters, bikes, and tariffs.
  - `create:booking`: Create rental reservations on behalf of users.
  - `query:availability`: Check live inventory at specific delivery hubs.

---

## 3. OAuth 2.0 Authorization Server Metadata

Per [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414), Rent on Cent provides authorization server metadata at:
- **Discovery Endpoint:** `https://rentoncent.bond/.well-known/oauth-authorization-server`
- **OpenID Connect Discovery:** `https://rentoncent.bond/.well-known/openid-configuration`
- **Issuer:** `https://rentoncent.bond`
- **Token Endpoint:** `https://rentoncent.bond/api/oauth/token`
- **JWKS URI:** `https://rentoncent.bond/.well-known/jwks.json`

---

## 4. Supported Agent Authentication & Registration Methods

Rent on Cent supports the following registration flows for automated agents:

### Method A: Identity Assertion (ID-JAG)
- **Identity Type:** `identity_assertion`
- **Assertion Type:** `urn:ietf:params:oauth:token-type:id-jag`
- **Credential Types:** `bearer_token`, `jwk`
- **Registration URI:** `https://rentoncent.bond/api/agent/register`
- **Revocation URI:** `https://rentoncent.bond/api/agent/revoke`

### Method B: Verified Email Assertion
- **Identity Type:** `identity_assertion`
- **Assertion Type:** `verified_email`
- **Credential Types:** `bearer_token`, `api_key`
- **Claim URI:** `https://rentoncent.bond/api/agent/claim-email`

### Method C: Anonymous / Public Read Access
- **Identity Type:** `anonymous`
- **Credential Types:** `ephemeral_token`
- **Claim URI:** `https://rentoncent.bond/api/agent/anonymous-claim`
- **Allowed Operations:** Reading vehicle catalog, checking rates, and querying pickup locations without requiring credentials.

---

## 5. Machine-Readable Discovery Endpoints

Agents can parse the following machine-readable discovery manifests on `https://rentoncent.bond`:

| Protocol | Endpoint | Content-Type |
| :--- | :--- | :--- |
| **API Catalog (RFC 9727)** | `/.well-known/api-catalog` | `application/linkset+json` |
| **OpenAPI 3.1 Spec** | `/openapi.json` | `application/json` |
| **A2A Agent Card** | `/.well-known/agent-card.json` | `application/json` |
| **Agent Skills Index (v0.2.0)** | `/.well-known/agent-skills/index.json` | `application/json` |
| **MCP Server Card (SEP-1649)** | `/.well-known/mcp/server-card.json` | `application/json` |
| **Universal Commerce Protocol** | `/.well-known/ucp` | `application/json` |
| **Agentic Commerce Protocol** | `/.well-known/acp.json` | `application/json` |
| **ARD Capability Manifest** | `/.well-known/ai-catalog.json` | `application/json` |
| **Web Bot Auth JWKS** | `/.well-known/http-message-signatures-directory` | `application/json` |
| **LLMs Full Guide** | `/llms.txt` & `/llms-full.txt` | `text/plain` |

---

## 6. Support & Emergency Assistance

For automated agent operators requiring assistance or higher rate limits:
- **Engineering & Support:** `support@rentoncent.bond`
- **Customer Helpline:** `+91 97209 65985`
- **Base Hub:** Raman Reti Road, Near Prem Mandir, Vrindavan, Uttar Pradesh 281121, India
