# Rent on Cent auth.md

Welcome to the automated agent registration and authentication interface for **Rent on Cent Vehicle Rental Services**.

## Overview

Autonomous AI agents can programmatically query rental scooter and bike availability, check tariffs starting at ₹299/day, calculate delivery charges, and place reservations. This document specifies authentication mechanisms and agent provisioning.

## Agent Audience

This service supports autonomous AI travel agents, concierge bots, local booking coordinators, and transit assistants.

## Discovery Metadata

- **OAuth Protected Resource Metadata**: `/.well-known/oauth-protected-resource`
- **OAuth Authorization Server Metadata**: `/.well-known/oauth-authorization-server`
- **OpenID Connect Discovery**: `/.well-known/openid-configuration`
- **API Catalog (RFC 9727)**: `/.well-known/api-catalog`
- **MCP Server Card**: `/.well-known/mcp/server-card.json`
- **A2A Agent Card**: `/.well-known/agent-card.json`
- **Agent Skills**: `/.well-known/agent-skills/index.json`

## Supported Registration & Authentication Methods

1. **Anonymous / Free Public Tier**
   - **Method**: Direct API Key or public query.
   - **Provisioning Endpoint**: `POST /agent/register`
   - **Claim URI**: `https://rentoncent.bond/agent/claim`
   - **Credential Type**: `api_key` or unauthenticated bearer token for read-only fleet queries.

2. **Identity Assertion (ID-JAG & Verified Email)**
   - **Assertion Types**: `urn:ietf:params:oauth:token-type:id-jag`, `verified_email`
   - **Credential Types**: `oauth_client`
   - **Token Endpoint**: `POST /oauth/token`
   - **Revocation Endpoint**: `POST /oauth/revoke`

3. **Bearer Token Usage**
   - Provide credentials via standard HTTP Authorization header:
     ```http
     Authorization: Bearer <TOKEN>
     ```

## Scopes Supported

- `read:fleet`: Query available scooters, bikes, and tariffs
- `create:booking`: Create vehicle rental reservations
- `query:availability`: Check live inventory at specific delivery hubs
- `openid`: Standard OpenID profile access
- `profile`: General agent identity metadata
