---
name: vrindavan-rental-seo
description: >-
  Comprehensive SEO optimization, keyword research architecture, and programmatic
  micro-location ranking runbook for Rent on Cent (rentoncent.bond). Use whenever
  optimizing pages, adding location landing pages, configuring Schema.org structured data,
  or targeting Mathura, Vrindavan, Yamuna Expressway, and Braj tourism search intent.
---

# Rent on Cent — Local & Micro-Location SEO Playbook

This skill defines the technical, semantic, and programmatic SEO architecture for **Rent on Cent** (`https://rentoncent.bond`), the leading peer-to-peer bike and scooty rental service in Vrindavan and Mathura.

---

## 1. High-Priority Keyword Clusters

### Cluster A: Core Commercial Search Intent (High Volume)
* `bike rental in vrindavan` / `bike rental vrindavan`
* `scooty on rent in vrindavan` / `scooty rental vrindavan`
* `bike on rent in mathura` / `mathura bike hire`
* `two wheeler rental mathura vrindavan`
* `activa on rent in vrindavan` / `honda activa rental vrindavan`
* `electric scooter rental vrindavan` / `ev scooty on rent in vrindavan`
* `vrindavan bike rental price per day` / `scooty on rent in vrindavan starting 299`

### Cluster B: Micro-Location Specific Keywords (High Conversion)
* **Mathura Cut (Yamuna Expressway)**:
  * `bike on rent on mathura cut`
  * `yamuna expressway mathura cut bike rental`
  * `mathura cut scooty hire for vrindavan trip`
* **Raya Cut (Yamuna Expressway)**:
  * `raya cut yamuna expressway bike rental`
  * `raya cut scooty on rent near vrindavan`
  * `bike delivery at raya cut mathura expressway`
* **Chattikara Road / Chhatikara Junction**:
  * `bike rental service near chattikara`
  * `chattikara vrindavan scooty hire`
  * `scooty rent near vaishno devi mandir chattikara`
  * `rukmini vihar parking bike rental`
* **Bankey Bihari Ji Temple**:
  * `bike on rent near bankey bihari ji`
  * `scooty rental near banke bihari mandir vrindavan`
  * `vidyapeeth chauraha two wheeler parking and bike hire`
* **Prem Mandir / Raman Reti Road**:
  * `scooty rental near prem mandir vrindavan`
  * `bike hire raman reti road vrindavan`
  * `iskcon vrindavan bike rental`
* **Mathura Junction & Railway Stations**:
  * `bike on rent at mathura junction railway station`
  * `mathura cantt scooty hire`
  * `train arrival doorstep bike delivery mathura`
* **Govardhan Parikrama**:
  * `govardhan parikrama scooty rent`
  * `electric scooter for govardhan 21 km parikrama`
  * `radha kund shyam kund bike rental`

### Cluster C: Hotel, Tourist & Alternative Transit Keywords
* `vrindavan hotel bike delivery` / `doorstep scooty delivery at vrindavan hotel`
* `ashram bike rental vrindavan`
* `vrindavan tourist sightseeing bike rental package`
* `auto vs bike rental vrindavan` / `avoid e-rickshaw bargaining vrindavan`
* `mathura to vrindavan bike ride day trip`

---

## 2. Programmatic Landing Page URL Structure

Every micro-location has a dedicated, crawlable Next.js route under `/locations/[slug]`:

| Slug | Canonical URL | Primary Keyword |
| :--- | :--- | :--- |
| `mathura-cut-yamuna-expressway` | `https://rentoncent.bond/locations/mathura-cut-yamuna-expressway` | Bike on rent on Mathura cut |
| `raya-cut-yamuna-expressway` | `https://rentoncent.bond/locations/raya-cut-yamuna-expressway` | Raya cut Yamuna expressway bike rental |
| `chattikara-road` | `https://rentoncent.bond/locations/chattikara-road` | Bike rental service near Chattikara |
| `bankey-bihari-temple` | `https://rentoncent.bond/locations/bankey-bihari-temple` | Bike on rent near Bankey Bihari Ji |
| `prem-mandir-raman-reti` | `https://rentoncent.bond/locations/prem-mandir-raman-reti` | Scooty rental near Prem Mandir Vrindavan |
| `mathura-junction-railway-station` | `https://rentoncent.bond/locations/mathura-junction-railway-station` | Bike on rent Mathura Junction railway station |
| `govardhan-parikrama` | `https://rentoncent.bond/locations/govardhan-parikrama` | Scooty rent for Govardhan parikrama |
| `hotels-tourist-service` | `https://rentoncent.bond/locations/hotels-tourist-service` | Vrindavan hotel bike delivery & tourist service |

---

## 3. Schema.org Structured Data Requirements

Every location page must inject:
1. **`AutoRental` / `LocalBusiness`**:
   - Includes specific `address` (Street, Locality, PostalCode).
   - Exact `geo` latitude & longitude for Google Maps snippet.
   - `priceRange` (₹299 - ₹1200 / day).
   - `areaServed` linking to Vrindavan / Mathura entities.
2. **`FAQPage`**:
   - Minimum 4 location-specific Q&A items targeting long-tail voice and search queries.
3. **`BreadcrumbList`**:
   - `Home > Locations > [Location Name]` for clean Google sitelinks.

---

## 4. On-Page SEO Checklist for Next.js

1. **Title Tag**: Must be under 60 characters, format: `[Primary Keyword] | Rent on Cent`.
2. **Meta Description**: 150-160 characters with phone/WhatsApp CTA, starting price (₹299/day or ₹40/hr), and location landmarks.
3. **Heading Hierarchy**:
   - `H1`: Exact match / high-intent keyword.
   - `H2`s: Sub-locations, pickup spots, pricing table, travel tips, FAQs.
4. **Internal Linking**:
   - Footer links to location hubs.
   - Cross-linking between nearby locations (e.g., Chattikara -> Prem Mandir -> Bankey Bihari).
5. **Mobile Readiness**: Fast load, zero horizontal overflow, prominent sticky WhatsApp action button.
