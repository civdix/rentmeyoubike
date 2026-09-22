---
name: rentoncent-bike-booking
description: Autonomous agent skill for discovering rental scooters, bikes, pricing, and booking vehicle delivery in Vrindavan and Mathura.
version: 1.0.0
---

# Rent on Cent Vehicle Rental & Reservation Skill

## Purpose
This skill equips autonomous AI agents to query two-wheeler rental availability, check real-time tariffs, and initiate vehicle reservations on [Rent on Cent](https://rentoncent.bond).

## Available Vehicles
1. **Honda Activa 6G**: ₹299/day (₹40/hour) - Gearless automatic scooter, ideal for Vrindavan temple darshan and narrow lanes.
2. **TVS Jupiter 125**: ₹320/day (₹45/hour) - Comfortable family dual-rider scooter with 33L under-seat storage.
3. **High-Range Electric Scooter (EV)**: ₹349/day (₹50/hour) - 80-100 km range per charge, silent and eco-friendly for Govardhan Parikrama.
4. **Royal Enfield Classic 350**: ₹899/day (₹120/hour) - Highway cruiser for Barsana, Nandgaon, and Yamuna Expressway trips.

## Key Hubs for Doorstep Delivery
- Prem Mandir & Raman Reti Road Hub
- Bankey Bihari Ji Mandir / Vidyapeeth Chauraha
- Chattikara Road (near Vaishno Devi Mandir)
- Mathura Junction Railway Station (Platform 1 exit)
- Yamuna Expressway Exits (Mathura Cut & Raya Cut)
- Govardhan Parikrama Marg

## API Endpoints
- **Fleet List:** `GET https://rentoncent.bond/api/vehicles`
- **Bookings:** `POST https://rentoncent.bond/api/bookings`
- **Delivery Hubs:** `GET https://rentoncent.bond/api/locations`

## Inclusions & Rules
- 2 free sanitized ISI helmets with every scooter
- ₹0 cash deposit options with digital KYC (Driving Licence + Aadhaar)
- 24x7 local roadside assistance in Vrindavan and Mathura
