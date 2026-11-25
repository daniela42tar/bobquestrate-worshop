---
hide:
  - navigation
---

# Part 4: Orquestració multiagent i fluxos de treball

<p align="center">
  <img src="../../part4-multi-agent-orchestration/bobchestrate_part4.png" alt="Bobchestrate - Setup" width="700">
</p>

**Durada**: 55 minuts

**Dificultat**: Avançat

**Nota**: Aquest és un exercici avançat independent que es pot completar sense haver fet les parts anteriors.

## Descripció general

En aquesta lliçó aprendràs a construir sistemes multiagent sofisticats on agents especialitzats col·laboren per resoldre tasques complexes. Crearàs jerarquies d'agents, implementaràs lògica d'enrutament i orquestraràs fluxos de treball entre diversos agents.

Aquesta part presenta un **sistema de planificació de viatges** complet com a exemple avançat d'orquestració multiagent. A diferència del sistema d'atenció al client construït en parts anteriors, aquest és un exercici autònom que demostra patrons avançats.

### El que aprendràs

- Quan i per què utilitzar diversos agents
- Com crear agents especialitzats per a dominis específics
- Com construir jerarquies d'agents (relacions pare-fill)
- Com implementar un enrutament intel·ligent entre agents
- Com gestionar el context i els traspassos
- Bones pràctiques per a sistemes multiagent

### El que construiràs

**Sistema de planificació de viatges** amb diversos agents especialitzats:

- **Travel Concierge** (pare) - Encamina les sol·licituds cap als especialistes
- **Flight Specialist** - Gestiona les reserves de vols
- **Hotel Specialist** - Gestiona l'allotjament
- **Activity Planner** - Suggereix activitats locals
- **Budget Advisor** - Proporciona anàlisi de costos

---

## Per què sistemes multiagent?

### Agent únic vs. multiagent

**Enfocament d'agent únic:**
```
Customer Support Agent
├── 50+ tools
├── 10+ knowledge bases
├── Complex instructions (1000+ lines)
└── Handles everything
```

**Problemes:**

- ❌ Complexitat aclaparadora
- ❌ Difícil de mantenir
- ❌ Rendiment deficient en tasques especialitzades
- ❌ Difícil de provar i depurar

**Enfocament multiagent:**
```
Orchestrator Agent
├── Order Specialist (5 tools, focused instructions)
├── Billing Specialist (3 tools, focused instructions)
├── Technical Support (8 tools, focused instructions)
└── Escalation Handler (2 tools, focused instructions)
```

**Avantatges:**

- ✅ Clara separació de responsabilitats
- ✅ Més fàcil de mantenir i actualitzar
- ✅ Millor rendiment en tasques especialitzades
- ✅ Proves i depuració més senzilles
- ✅ Especialistes reutilitzables en diferents sistemes

### Quan utilitzar sistemes multiagent

| Utilitza multiagent quan... | Utilitza un agent únic quan... |
|-------------------------|--------------------------|
| El domini té especialitzacions clarament diferenciades | La tasca és simple i enfocada |
| Cal un rendiment de nivell expert | El coneixement general és suficient |
| El sistema creixerà amb el temps | Els requisits són estables |
| Diversos equips gestionen parts diferents | Un únic equip ho gestiona tot |
| Necessites reutilitzar especialistes | L'agent té un propòsit únic |

---

## Part 1: Comprendre les jerarquies d'agents

### Rols dels agents

**1. Agent orquestrador (pare)**

- Encamina les sol·licituds cap als especialistes adequats
- Gestiona el flux general de la conversa
- Sintetitza les respostes de diversos agents
- Gestiona les consultes generals

**2. Agents especialistes (fills)**

- Experiència profunda en un domini específic
- Eines i coneixement enfocats
- Instruccions clares i específiques
- Retornen el control a l'orquestrador quan acaben

### Estratègies d'enrutament

**1. Enrutament basat en la descripció**
L'orquestrador utilitza les descripcions dels agents per decidir l'enrutament:

```yaml
# Orchestrator sees these descriptions
collaborators:
  - flight_specialist  # "Handles flight searches, bookings, and changes"
  - hotel_specialist   # "Manages hotel reservations and accommodations"
```

**2. Enrutament basat en les instruccions**
Lògica d'enrutament explícita en les instruccions de l'orquestrador:

```yaml
instructions: |
  When user asks about flights:
  - Route to flight_specialist

  When user asks about hotels:
  - Route to hotel_specialist

  When user needs both:
  - Route to flight_specialist first
  - Then route to hotel_specialist
  - Synthesize both responses
```

**3. Enrutament basat en eines (patró de supervisió)**
L'orquestrador actua com a supervisor sense eines de domini pròpies i delega en els especialistes que sí que tenen les eines reals:

```yaml
# Orchestrator Agent (Supervisor)
# - Has NO flight/hotel/activity tools
# - Only has access to specialist agents as collaborators
# - Analyzes user request and delegates to appropriate specialist

# Flight Specialist Agent
# - HAS flight search and booking tools
# - Handles all flight-related operations

# Hotel Specialist Agent
# - HAS hotel search and booking tools
# - Handles all hotel-related operations
```

**Per què funciona això:**

- L'orquestrador reconeix que no té les eines necessàries per a la tasca
- Ha de delegar en un agent especialista que sí que les tingui
- Això crea un enrutament natural basat en els límits de capacitat
- Evita que l'orquestrador intenti gestionar directament tasques específiques d'un domini

---

## Part 2: Construir els agents especialistes

### Pas 1: Crear l'especialista en vols

Copia l'exemple `flight_specialist_agent_<your-initials>.yaml` o demana-l'hi a Bob (mira el prompt d'exemple sota el YAML). **PISTA**: hauries de demanar-l'hi a Bob. Crearà alguna cosa millor que el simple exemple 🤓 I només costa uns 0,3 bobcoins 🪙

```yaml
spec_version: v1
kind: native
name: flight_specialist_<your-initials>
title: Flight Booking Specialist
description: Expert in flight searches, bookings, changes, and cancellations. Handles all flight-related queries including availability, pricing, and itinerary modifications.

instructions: |
  You are a flight booking specialist with deep expertise in air travel.
  
  Your capabilities:
  - Search for flights based on dates, destinations, preferences
  - Provide detailed flight information (times, prices, airlines)
  - Handle booking requests
  - Process flight changes and cancellations
  - Explain baggage policies and fees
  
  Guidelines:
  - Always ask for essential details: origin, destination, dates, passengers
  - Present options clearly with prices and durations
  - Highlight best value and most convenient options
  - Explain any restrictions or fees upfront
  - Confirm all details before booking
  
  When you've completed the user's flight-related request:
  - Summarize what was accomplished
  - Ask if they need anything else flight-related
  - If they need other travel services (hotels, activities), let them know
    you'll hand back to the travel concierge
  
  Response format:
  - Be concise but complete
  - Use bullet points for options
  - Include all relevant details (times, prices, airlines)
  - End with clear next steps

tools:
  - search_flights_<your-initials>
  - book_flight_<your-initials>
  - modify_flight_<your-initials>
  - cancel_flight_<your-initials>

llm: groq/openai/gpt-oss-120b
```

**💡 Pregunta-ho a Bob:**
```
Bob, create a flight_specialist_agent_<your-initials>.yaml file with focused instructions
for handling flight bookings and searches.
```
Quan Bob acabi, tindràs un nou fitxer d'agent desat al teu directori d'agents. Fes un cop d'ull al que Bob ha creat per a tu. Força professional, oi? Amb pautes reals i marcadors de posició per a les eines. Crearem les eines una mica més endavant.

### Pas 2: Crear l'especialista en hotels

Copia l'exemple `hotel_specialist_agent.yaml` o demana-l'hi a Bob. A hores d'ara ja hauries de tenir una idea de com formular el prompt per a aquest agent 😉 Pots provar-ho diverses vegades fins que quedis satisfet amb el resultat.

```yaml
spec_version: v1
kind: native
name: hotel_specialist_<your-initials>
title: Hotel Booking Specialist
description: Expert in hotel accommodations, reservations, and lodging options. Handles hotel searches, bookings, modifications, and provides recommendations based on preferences and budget.

instructions: |
  You are a hotel booking specialist with extensive knowledge of accommodations.
  
  Your capabilities:
  - Search hotels by location, dates, and preferences
  - Provide detailed hotel information (amenities, ratings, prices)
  - Handle reservation requests
  - Process booking modifications and cancellations
  - Recommend hotels based on budget and needs
  
  Guidelines:
  - Ask for: location, check-in/out dates, guests, budget, preferences
  - Present 3-5 options with key details
  - Highlight amenities that match user preferences
  - Explain cancellation policies clearly
  - Confirm all details before booking
  
  When you've completed the user's hotel-related request:
  - Summarize the booking or recommendations
  - Ask if they need anything else hotel-related
  - If they need other travel services, indicate you'll return to
    the travel concierge
  
  Response format:
  - Clear hotel names and locations
  - Price per night and total cost
  - Key amenities (WiFi, breakfast, parking, etc.)
  - Guest ratings if available
  - Cancellation policy summary

tools:
  - search_hotels_<your-initials>
  - book_hotel_<your-initials>
  - modify_hotel_booking_<your-initials>
  - cancel_hotel_booking_<your-initials>

llm: groq/openai/gpt-oss-120b
```

### Pas 3: Crear el planificador d'activitats

Copia l'exemple `activity_planner_agent_<your-initials>.yaml` o demana-l'hi a Bob.

```yaml
spec_version: v1
kind: native
name: activity_planner_<your-initials>
title: Local Activity Specialist
description: Expert in local attractions, activities, tours, and experiences. Provides personalized recommendations for things to do based on interests, location, and travel dates.

instructions: |
  You are a local activity and experience specialist.
  
  Your capabilities:
  - Suggest activities based on location and interests
  - Provide details on tours, attractions, and experiences
  - Recommend restaurants and local cuisine
  - Suggest itineraries for different trip lengths
  - Provide insider tips and local knowledge
  
  Guidelines:
  - Ask about: destination, travel dates, interests, group size
  - Tailor suggestions to user preferences (adventure, culture, food, etc.)
  - Include practical details (duration, cost, booking requirements)
  - Suggest a mix of popular and off-the-beaten-path options
  - Consider timing and logistics
  
  When you've provided activity recommendations:
  - Summarize the suggested itinerary
  - Offer to provide more details on specific activities
  - If they need other travel services, indicate you'll return to
    the travel concierge
  
  Response format:
  - Activity name and brief description
  - Duration and best time to visit
  - Approximate cost
  - Why it's recommended for them
  - Booking/reservation requirements

tools:
  - search_activities_<your-initials>
  - get_activity_details_<your-initials>
  - search_restaurants_<your-initials>
  - create_itinerary_<your-initials>

llm: groq/openai/gpt-oss-120b
```

### Pas 4: Crear l'assessor de pressupost

Copia l'exemple `budget_advisor_agent_<your-initials>.yaml` o demana-l'hi a Bob.

```yaml
spec_version: v1
kind: native
name: budget_advisor_<your-initials>
title: Travel Budget Specialist
description: Expert in travel cost analysis, budget planning, and money-saving strategies. Helps travelers understand costs, find deals, and optimize their travel budget.

instructions: |
  You are a travel budget and cost analysis specialist.
  
  Your capabilities:
  - Analyze total trip costs (flights, hotels, activities, meals)
  - Suggest budget-friendly alternatives
  - Identify money-saving opportunities
  - Compare costs across different options
  - Provide budget breakdowns and forecasts
  
  Guidelines:
  - Ask about: total budget, trip duration, priorities
  - Break down costs by category
  - Highlight where most money is spent
  - Suggest specific ways to save money
  - Be realistic about costs
  
  When you've completed the budget analysis:
  - Provide clear cost breakdown
  - Highlight savings opportunities
  - Recommend budget allocation
  - If they want to book based on your analysis, indicate you'll
    return to the travel concierge
  
  Response format:
  - Total estimated cost
  - Cost breakdown by category
  - Budget vs actual comparison
  - Money-saving recommendations
  - Alternative options if over budget

tools:
  - calculate_trip_cost_<your-initials>
  - compare_options_<your-initials>
  - find_deals_<your-initials>
  - budget_optimizer_<your-initials>

llm: groq/openai/gpt-oss-120b
```

---

## Part 3: Crear l'agent orquestrador

### Pas 1: Dissenyar les instruccions de l'orquestrador

L'orquestrador necessita una lògica d'enrutament clara:

Copia l'exemple `travel_concierge_agent.yaml` o demana-l'hi a Bob (mira el prompt d'exemple sota el YAML).

```yaml
spec_version: v1
kind: native
name: travel_concierge_<your-initials>
title: Travel Concierge
description: Your personal travel planning assistant that coordinates with specialists to help plan your perfect trip.

instructions: |
  You are a friendly travel concierge who helps users plan their trips by
  coordinating with specialized travel agents.
  
  Your role:
  - Understand the user's travel needs and preferences
  - Route requests to appropriate specialists
  - Synthesize information from multiple specialists
  - Provide a cohesive travel planning experience
  
  Available specialists:
  - flight_specialist: For all flight-related queries (searches, bookings, changes)
  - hotel_specialist: For accommodation needs (hotels, reservations)
  - activity_planner: For things to do, attractions, restaurants
  - budget_advisor: For cost analysis and budget planning
  
  Routing guidelines:
  
  1. Flight queries → flight_specialist
     Examples: "Find me flights to Paris", "Change my flight booking"
  
  2. Hotel queries → hotel_specialist
     Examples: "Find hotels in Tokyo", "Book a hotel near the airport"
  
  3. Activity queries → activity_planner
     Examples: "What should I do in Rome?", "Recommend restaurants"
  
  4. Budget queries → budget_advisor
     Examples: "How much will this trip cost?", "Help me save money"
  
  5. Complex queries → Multiple specialists in sequence
     Example: "Plan a week in London"
     - Route to flight_specialist first
     - Then hotel_specialist
     - Then activity_planner
     - Finally budget_advisor
  
  Workflow for complex requests:
  1. Break down the request into components
  2. Route to specialists in logical order
  3. Synthesize responses into cohesive plan
  4. Present complete solution to user
  
  General queries you handle directly:
  - Greetings and general questions
  - Travel tips and advice
  - Clarifying user needs
  - Summarizing plans
  
  Response style:
  - Friendly and helpful
  - Clear about which specialist is helping
  - Synthesize specialist responses naturally
  - Proactive in suggesting next steps

collaborators:
  - flight_specialist_<your-initials>
  - hotel_specialist_<your-initials>
  - activity_planner_<your-initials>
  - budget_advisor_<your-initials>

llm: groq/openai/gpt-oss-120b
```

**💡 Pregunta-ho a Bob:**
```
Bob, create a travel_concierge_agent_<your-initials>.yaml that orchestrates between the four specialist agents with clear routing logic. The collaborators are flight_specialist_<your-initials>, hotel_specialist_<your-initials>, activity_planner_<your-initials>, and budget_advisor_<your-initials>. The agent should handle complex multi-aspect travel requests by routing to the appropriate specialist and synthesizing responses.
```
---


## Part 4: Implementar eines simulades

Per a aquest taller crearem eines simulades que imiten les capacitats dels especialistes. Això ens permet centrar-nos en la lògica d'orquestració sense necessitat d'integrar-nos encara amb API reals. Aquest enfocament és ideal per a prototips ràpids, demostracions i proves.

### Crear les eines de vols

Crea `flight_tools_<your-initials>.py`, o demana-li a Bob que ho faci (mira el prompt d'exemple sota el codi):

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def search_flights_<your-initials>(
    origin: str,
    destination: str,
    departure_date: str,
    return_date: str = None,
    passengers: int = 1
) -> dict:
    """
    Search for available flights.
    
    Args:
        origin: Departure city or airport code
        destination: Arrival city or airport code
        departure_date: Departure date (YYYY-MM-DD)
        return_date: Return date for round trip (YYYY-MM-DD)
        passengers: Number of passengers
    
    Returns:
        Dictionary with flight options
    """
    # Mock flight data
    flights = [
        {
            "flight_number": "AA123",
            "airline": "American Airlines",
            "departure": f"{origin} 08:00",
            "arrival": f"{destination} 14:30",
            "duration": "6h 30m",
            "price": 450.00,
            "stops": 0,
            "class": "Economy"
        },
        {
            "flight_number": "UA456",
            "airline": "United Airlines",
            "departure": f"{origin} 10:30",
            "arrival": f"{destination} 17:15",
            "duration": "6h 45m",
            "price": 425.00,
            "stops": 0,
            "class": "Economy"
        },
        {
            "flight_number": "DL789",
            "airline": "Delta",
            "departure": f"{origin} 14:00",
            "arrival": f"{destination} 22:00",
            "duration": "8h 00m",
            "price": 380.00,
            "stops": 1,
            "class": "Economy"
        }
    ]
    
    result = {
        "origin": origin,
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date,
        "passengers": passengers,
        "flights": flights,
        "count": len(flights)
    }
    
    if return_date:
        result["trip_type"] = "round-trip"
        result["total_price_range"] = f"${flights[-1]['price'] * 2} - ${flights[0]['price'] * 2}"
    else:
        result["trip_type"] = "one-way"
        result["total_price_range"] = f"${flights[-1]['price']} - ${flights[0]['price']}"
    
    return result


@tool
def book_flight_<your-initials>(
    flight_number: str,
    passenger_name: str,
    passenger_email: str
) -> dict:
    """
    Book a flight.
    
    Args:
        flight_number: Flight number to book
        passenger_name: Passenger full name
        passenger_email: Passenger email
    
    Returns:
        Booking confirmation
    """
    import random
    confirmation = f"CONF{random.randint(100000, 999999)}"
    
    return {
        "status": "confirmed",
        "confirmation_number": confirmation,
        "flight_number": flight_number,
        "passenger_name": passenger_name,
        "email": passenger_email,
        "booking_date": "2024-01-15",
        "message": f"Flight {flight_number} booked successfully! Confirmation: {confirmation}",
        "next_steps": [
            "Check-in opens 24 hours before departure",
            "Confirmation email sent to " + passenger_email,
            "Download boarding pass via airline app"
        ]
    }


@tool
def modify_flight_<your-initials>(
    confirmation_number: str,
    new_date: str = None,
    new_flight: str = None
) -> dict:
    """
    Modify an existing flight booking.
    
    Args:
        confirmation_number: Booking confirmation number
        new_date: New departure date (optional)
        new_flight: New flight number (optional)
    
    Returns:
        Modification confirmation
    """
    changes = []
    if new_date:
        changes.append(f"Date changed to {new_date}")
    if new_flight:
        changes.append(f"Flight changed to {new_flight}")
    
    return {
        "status": "modified",
        "confirmation_number": confirmation_number,
        "changes": changes,
        "change_fee": 75.00,
        "fare_difference": 25.00,
        "total_cost": 100.00,
        "message": "Flight modified successfully. Total cost: $100.00 (change fee + fare difference)"
    }


@tool
def cancel_flight_<your-initials>(confirmation_number: str) -> dict:
    """
    Cancel a flight booking.
    
    Args:
        confirmation_number: Booking confirmation number
    
    Returns:
        Cancellation confirmation
    """
    return {
        "status": "cancelled",
        "confirmation_number": confirmation_number,
        "cancellation_fee": 100.00,
        "refund_amount": 350.00,
        "refund_method": "original payment method",
        "processing_time": "5-7 business days",
        "message": "Flight cancelled. Refund of $350.00 will be processed within 5-7 business days."
    }
```

**💡 Pregunta-ho a Bob:**
```
Bob, create flight_tools._<your-initials>py with mock implementations of search_flights_<your-initials>, book_flight_<your-initials>, modify_flight_<your-initials>, and cancel_flight_<your-initials> tools.
```

### Crear les eines d'hotels

Crea `hotel_tools_<your-initials>.py`, o demana-li a Bob que ho faci (mira el prompt d'exemple sota el codi):

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def search_hotels_<your-initials>(
    location: str,
    check_in: str,
    check_out: str,
    guests: int = 2,
    max_price: float = None
) -> dict:
    """
    Search for available hotels.
    
    Args:
        location: City or area
        check_in: Check-in date (YYYY-MM-DD)
        check_out: Check-out date (YYYY-MM-DD)
        guests: Number of guests
        max_price: Maximum price per night
    
    Returns:
        Dictionary with hotel options
    """
    hotels = [
        {
            "name": "Grand Plaza Hotel",
            "location": location,
            "rating": 4.5,
            "price_per_night": 180.00,
            "amenities": ["WiFi", "Breakfast", "Pool", "Gym", "Parking"],
            "cancellation": "Free cancellation until 24h before",
            "distance_to_center": "0.5 miles"
        },
        {
            "name": "City Center Inn",
            "location": location,
            "rating": 4.0,
            "price_per_night": 120.00,
            "amenities": ["WiFi", "Breakfast", "Business Center"],
            "cancellation": "Free cancellation until 48h before",
            "distance_to_center": "0.2 miles"
        },
        {
            "name": "Budget Stay",
            "location": location,
            "rating": 3.5,
            "price_per_night": 80.00,
            "amenities": ["WiFi", "24h Reception"],
            "cancellation": "Non-refundable",
            "distance_to_center": "1.5 miles"
        },
        {
            "name": "Luxury Suites",
            "location": location,
            "rating": 5.0,
            "price_per_night": 350.00,
            "amenities": ["WiFi", "Breakfast", "Pool", "Spa", "Gym", "Restaurant", "Parking"],
            "cancellation": "Free cancellation until 72h before",
            "distance_to_center": "0.3 miles"
        }
    ]
    
    # Filter by max price if specified
    if max_price:
        hotels = [h for h in hotels if h["price_per_night"] <= max_price]
    
    # Calculate total cost
    from datetime import datetime
    check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
    check_out_date = datetime.strptime(check_out, "%Y-%m-%d")
    nights = (check_out_date - check_in_date).days
    
    for hotel in hotels:
        hotel["total_cost"] = hotel["price_per_night"] * nights
        hotel["nights"] = nights
    
    return {
        "location": location,
        "check_in": check_in,
        "check_out": check_out,
        "guests": guests,
        "nights": nights,
        "hotels": hotels,
        "count": len(hotels)
    }


@tool
def book_hotel_<your-initials>(
    hotel_name: str,
    guest_name: str,
    guest_email: str,
    check_in: str,
    check_out: str,
    room_type: str = "Standard"
) -> dict:
    """
    Book a hotel room.
    
    Args:
        hotel_name: Name of the hotel
        guest_name: Guest full name
        guest_email: Guest email
        check_in: Check-in date
        check_out: Check-out date
        room_type: Type of room (Standard, Deluxe, Suite)
    
    Returns:
        Booking confirmation
    """
    import random
    confirmation = f"HTL{random.randint(100000, 999999)}"
    
    return {
        "status": "confirmed",
        "confirmation_number": confirmation,
        "hotel_name": hotel_name,
        "guest_name": guest_name,
        "check_in": check_in,
        "check_out": check_out,
        "room_type": room_type,
        "email": guest_email,
        "message": f"Hotel booked successfully! Confirmation: {confirmation}",
        "check_in_time": "3:00 PM",
        "check_out_time": "11:00 AM",
        "next_steps": [
            "Confirmation email sent to " + guest_email,
            "Check-in starts at 3:00 PM",
            "Early check-in available upon request"
        ]
    }


@tool
def modify_hotel_booking_<your-initials>(
    confirmation_number: str,
    new_check_in: str = None,
    new_check_out: str = None,
    new_room_type: str = None
) -> dict:
    """
    Modify hotel booking dates or room type.
    
    Args:
        confirmation_number: Booking confirmation number
        new_check_in: New check-in date (optional)
        new_check_out: New check-out date (optional)
        new_room_type: New room type (optional)
    
    Returns:
        Modification confirmation
    """
    changes = []
    if new_check_in:
        changes.append(f"Check-in changed to {new_check_in}")
    if new_check_out:
        changes.append(f"Check-out changed to {new_check_out}")
    if new_room_type:
        changes.append(f"Room type changed to {new_room_type}")
    
    return {
        "status": "modified",
        "confirmation_number": confirmation_number,
        "changes": changes,
        "modification_fee": 0.00,
        "message": "Hotel booking modified successfully. No modification fee."
    }


@tool
def cancel_hotel_booking_<your-initials>(confirmation_number: str) -> dict:
    """
    Cancel hotel booking.
    
    Args:
        confirmation_number: Booking confirmation number
    
    Returns:
        Cancellation confirmation
    """
    return {
        "status": "cancelled",
        "confirmation_number": confirmation_number,
        "refund_amount": 240.00,
        "cancellation_fee": 0.00,
        "refund_method": "original payment method",
        "processing_time": "3-5 business days",
        "message": "Hotel booking cancelled. Full refund of $240.00 will be processed within 3-5 business days."
    }
```

**💡 Pregunta-ho a Bob:**
```
Bob, create hotel_tools_<your-initials>.py with mock implementations of search_hotels_<your-initials>, book_hotel_<your-initials>, modify_hotel_booking_<your-initials>, and cancel_hotel_booking_<your-initials> tools.
```

### Crear les eines d'activitats

Crea `activity_tools_<your-initials>.py` amb les eines per al planificador d'activitats:

**💡 Pregunta-ho a Bob:**
```
Bob, create activity_tools_<your-initials>.py with mock implementations of search_activities_<your-initials>, get_activity_details_<your-initials>, search_restaurants_<your-initials>, and create_itinerary_<your-initials> tools.
```

El fitxer ha d'incloure:

- `search_activities`: Cerca activitats segons la ubicació i els interessos
- `get_activity_details`: Obté informació detallada sobre activitats específiques
- `search_restaurants`: Cerca restaurants per tipus de cuina i rang de preus
- `create_itinerary`: Genera itineraris dia a dia

### Crear les eines de pressupost

Crea `budget_tools_<your-initials>.py` amb les eines per a l'assessor de pressupost:

**💡 Pregunta-ho a Bob:**
```
Bob, create budget_tools_<your-initials>.py with mock implementations of calculate_trip_cost_<your-initials>, compare_options_<your-initials>, find_deals_<your-initials>, and budget_optimizer_<your-initials> tools.
```

El fitxer ha d'incloure:

- `calculate_trip_cost`: Calcula el cost total del viatge amb un desglossament detallat
- `compare_options`: Compara dues opcions de viatge i proporciona recomanacions
- `find_deals`: Troba ofertes i descomptes actuals
- `budget_optimizer`: Optimitza la distribució del pressupost entre categories

---
## Part 4.5: Convenció de noms per a l'entorn compartit

**⚠️ IMPORTANT: Requisits de nomenclatura al taller** - **POTS IGNORAR AIXÒ SI NO UTILITZES L'ENTORN WXO COMPARTIT**

Com que tots els participants del taller comparteixen el mateix entorn de watsonx Orchestrate, **has** d'afegir les teves inicials com a sufix als noms de totes les eines i agents per evitar conflictes.

### Patró de nomenclatura

Utilitza aquest patró per a totes les teves eines i agents:

- **Eines**: `tool_name_XX` (on XX són les teves inicials)
- **Noms de fitxer d'agent YAML**: `agent_name_XX.yaml` (utilitza també guions baixos al nom del fitxer)
- **Camp name de l'agent**: `agent_name_XX` (utilitza guions baixos, no guions)

### Exemple

Si et dius **Jane Smith** (inicials: JS), reanomena les teves eines i agents de la manera següent:

**Eines:**
```python
# In flight_tools_JS.py
@tool
def search_flights_JS(...):  # Added _JS postfix
    """Search for available flights."""
    ...

@tool
def book_flight_JS(...):  # Added _JS postfix
    """Book a flight."""
    ...
```

**Fitxers d'agent:**
```yaml
# Filename: flight_specialist_agent_JS.yaml (underscores in filename)
name: flight_specialist_JS  # IMPORTANT: Use underscores in name field, not dashes!
description: Specialist agent for flight bookings
instructions: |
  You are a flight booking specialist...
tools:
  - search_flights_JS      # Reference tools with _JS postfix
  - book_flight_JS
  - modify_flight_JS
  - cancel_flight_JS
```

**⚠️ Regla de nomenclatura crítica:**

- El **nom de fitxer** YAML també utilitza guions baixos: `flight_specialist_agent_JS.yaml`
- El **camp name** de l'agent ha d'utilitzar guions baixos (igual que el fitxer): `name: flight_specialist_JS`
- Aquest és un requisit de watsonx Orchestrate per al registre correcte de l'agent

### Llista de verificació de nomenclatura completa

Abans d'importar, assegura't que has reanomenat:

**✅ Fitxers d'eines:**

- [ ] Tots els noms de funció `@tool` a `flight_tools.py`
- [ ] Tots els noms de funció `@tool` a `hotel_tools.py`
- [ ] Tots els noms de funció `@tool` a `activity_tools.py`
- [ ] Tots els noms de funció `@tool` a `budget_tools.py`

**✅ Fitxers d'agents:**

- [ ] Camp `name` de l'agent a `flight_specialist_agent.yaml`
- [ ] Referències d'eines a la secció `tools`
- [ ] Camp `name` de l'agent a `hotel_specialist_agent.yaml`
- [ ] Referències d'eines a la secció `tools`
- [ ] Camp `name` de l'agent a `activity_planner_agent.yaml`
- [ ] Referències d'eines a la secció `tools`
- [ ] Camp `name` de l'agent a `budget_advisor_agent.yaml`
- [ ] Referències d'eines a la secció `tools`
- [ ] Camp `name` de l'agent a `travel_concierge_agent.yaml`
- [ ] Noms dels agents col·laboradors a la secció `collaborators`

**💡 Pregunta-ho a Bob:**
```
Bob, add a postfix "_<your_initials>" to all tool function names in flight_tools.py, hotel_tools.py, activity_tools.py, and budget_tools.py. Then update all agent YAML files to use the renamed tools (activity planner to use activity tools, flifgt specialist to use flight tools, etc.) and add "_<your_initials>" postfix to agent name fields within their yaml-files.
```
>**NOTA**: Recorda actualitzar les teves inicials als marcadors de posició del prompt abans d'enviar-lo a Bob 😉

### Per què és important

Sense noms únics:

- ❌ Les teves eines sobreescriuran les eines d'altres participants
- ❌ Els teus agents entraran en conflicte amb els dels altres
- ❌ Les proves produiran resultats impredictibles
- ❌ Podries utilitzar per error la implementació d'una altra persona

Amb noms únics:

- ✅ Les teves eines i agents estan aïllats
- ✅ Pots provar de manera independent
- ✅ Sense conflictes amb altres participants
- ✅ Propietat clara de les teves implementacions

---

## Part 5: Provar els fluxos de treball multiagent

### Importar tots els agents i eines

```bash
# Import all tools
orchestrate tools import -k python -f tools/flight_tools_<your-initials>.py
orchestrate tools import -k python -f tools/hotel_tools_<your-initials>.py
orchestrate tools import -k python -f tools/activity_tools_<your-initials>.py
orchestrate tools import -k python -f tools/budget_tools_<your-initials>.py

# Import specialist agents
orchestrate agents import -f agents/flight_specialist_agent_<your-initials>.yaml
orchestrate agents import -f agents/hotel_specialist_agent_<your-initials>.yaml
orchestrate agents import -f agents/activity_planner_agent_<your-initials>.yaml
orchestrate agents import -f agents/budget_advisor_agent_<your-initials>.yaml

# Import orchestrator (must be last, after collaborators exist)
orchestrate agents import -f agents/travel_concierge_agent_<your-initials>.yaml
```
**💡 Pregunta-ho a Bob:**
```
Bob, create a shell script that imports all agents (flight specialist, hotel specialist, activty planner, budget advisor and finally tra) and their tools in the correct order. Make sure each agent is imported after its collaborators.
```
>**NOTA**: Revisa la sintaxi d'importació d'eines i agents que utilitza Bob al script generat. Tot i que la informació sobre la sintaxi correcta està disponible a la regla de desenvolupament personalitzada que estem utilitzant, de vegades Bob pot no consultar-la abans de crear coses.

### Provar l'enrutament simple

**Prova 1: Especialista únic**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Find me flights from New York to London for next week"
```

Flux esperat:

1. El Concierge rep la sol·licitud
2. Encamina cap al flight_specialist
3. L'especialista en vols cerca vols
4. Retorna els resultats a l'usuari

**Prova 2: Diversos especialistes**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Plan a 5-day trip to Paris including flights and hotels"
```

Flux esperat:

1. El Concierge rep la sol·licitud
2. Encamina cap al flight_specialist per als vols
3. Encamina cap al hotel_specialist per als hotels
4. Sintetitza el pla complet
5. Retorna el resultat a l'usuari

### Provar fluxos de treball complexos

**Prova 3: Planificació completa del viatge**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "I want to visit Tokyo for a week. I have a budget of $3000. Help me plan everything including flights, hotel, and activities."
```

Flux esperat:

1. El Concierge desglossa la sol·licitud
2. Encamina cap al flight_specialist
3. Encamina cap al hotel_specialist
4. Encamina cap al activity_planner
5. Encamina cap al budget_advisor
6. Sintetitza l'itinerari complet
7. Retorna el pla complet

---


## Part 6: Bones pràctiques

### 1. Disseny d'agents

**Mantén els especialistes enfocats:**
```yaml
# ✅ Good - Focused specialist
name: flight_specialist
tools:
  - search_flights
  - book_flight
  - modify_flight
  - cancel_flight

# ❌ Bad - Too broad
name: travel_specialist
tools:
  - search_flights
  - search_hotels
  - search_activities
  - book_everything
```

**Descripcions clares:**
```yaml
# ✅ Good - Clear, specific description with collaborators
description: Expert in flight searches, bookings, changes, and cancellations.
  Handles all flight-related queries including availability, pricing, and
  itinerary modifications. Works with hotel_specialist and activity_planner
  for complete travel planning.

# ❌ Bad - Vague description
description: Helps with travel stuff
```

**NOTA:** Inclou mencions als agents col·laboradors a les descripcions per ajudar l'orquestrador a entendre les relacions entre agents i les opcions d'enrutament.

### 2. Lògica d'enrutament

**Instruccions d'enrutament explícites:**
```yaml
instructions: |
  # ✅ Good - Clear routing rules
  When user asks about flights:
  - Route to flight_specialist
  - Wait for response
  - Present to user
  
  When user asks about hotels:
  - Route to hotel_specialist
  - Wait for response
  - Present to user
```

**Gestionar casos límit:**
```yaml
instructions: |
  If user request is ambiguous:
  - Ask clarifying questions first
  - Then route to appropriate specialist
  
  If specialist cannot help:
  - Acknowledge limitation
  - Suggest alternative
  - Route to different specialist if appropriate
```

### 3. Gestió del context

**Passar el context rellevant:**
```yaml
instructions: |
  When routing to specialist:
  - Include all relevant details from conversation
  - Mention previous specialist interactions if relevant
  - Provide user preferences and constraints
```

**Sintetitzar les respostes:**
```yaml
instructions: |
  After receiving specialist response:
  - Summarize key points
  - Connect to user's original request
  - Suggest logical next steps
  - Maintain conversation flow
```

### 4. Gestió d'errors

**Fallar amb elegància:**
```yaml
instructions: |
  If specialist returns error:
  - Explain issue to user clearly
  - Suggest alternatives
  - Offer to try different approach
  - Don't expose technical details
```

**Gestió dels temps d'espera:**
```yaml
instructions: |
  If specialist doesn't respond within expected time:
  - Acknowledge the delay to user
  - Explain what might be happening
  - Offer to try again or use alternative approach
  - Log timeout for debugging
  
  Example: "The flight specialist is taking longer than expected.
  This might be due to high search volume. Would you like me to
  try a simpler search or wait a bit longer?"
```

**Validació d'entrades:**
```yaml
instructions: |
  Before routing to specialist:
  - Validate user input completeness
  - Check for required parameters
  - Verify data format (dates, numbers, etc.)
  - Ask for missing information before routing
  
  Example: If user asks "book a flight" without destination,
  ask for required details before routing to flight_specialist.
```

**Registre i depuració:**
```yaml
instructions: |
  For debugging multi-agent workflows:
  - Log routing decisions and reasons
  - Track which specialist handled each request
  - Record context passed between agents
  - Note any errors or fallbacks used
  
  This helps identify issues in routing logic and specialist performance.
```

### 5. Optimitzar el rendiment dels agents

**Arquitectura d'agents:**
```yaml
# ✅ Good - Flat hierarchy with focused specialists
User → Orchestrator → Specialist → User

# ❌ Bad - Unnecessary intermediate layers
User → Orchestrator → Coordinator → Specialist → Coordinator → Orchestrator → User

# Keep your agent hierarchy simple. The LLM handles routing based on descriptions,
# so additional coordinator layers just add latency without improving routing.
```

**Descripcions d'agent clares:**
```yaml
# The LLM uses descriptions to route requests
# Make them specific and action-oriented

# ✅ Good - Clear scope and capabilities
description: |
  Expert in flight searches, bookings, changes, and cancellations.
  Handles all flight-related queries including availability, pricing,
  and itinerary modifications. Works with hotel_specialist and
  activity_planner for complete travel planning.

# ❌ Bad - Vague or overlapping scope
description: Helps with travel arrangements
```

**Instruccions d'enrutament explícites:**
```yaml
instructions: |
  # Guide the LLM on when to route to specialists
  
  When user asks about flights:
  - Call the flight_specialist agent immediately
  - Do NOT ask for additional parameters before routing
  - Pass all available context from the conversation
  
  When user asks about hotels:
  - Call the hotel_specialist agent immediately
  - Include destination and dates if mentioned
  
  # Use explicit action verbs: "Call", "Execute", "Use"
  # Avoid implicit language: "delegate", "route", "consider"
```

**Disseny d'eines per als especialistes:**
```yaml
# Keep specialist tools focused and simple
# LLMs perform best with ≤10 tools per agent

# ✅ Good - Focused tool set
flight_specialist:
  tools:
    - search_flights
    - book_flight
    - modify_booking
    - cancel_booking

# ❌ Bad - Too many tools
travel_agent:
  tools:
    - search_flights
    - search_hotels
    - search_activities
    - search_restaurants
    - book_flight
    - book_hotel
    # ... 20+ more tools
```

**Eficiència en el raonament (per a GPT-OSS-120B):**
```yaml
instructions: |
  # Limit reasoning depth to improve response time
  
  Reasoning and brevity controls:
  - Use concise reasoning with at most 3 reasoning steps
  - Do not re-plan unless the last tool result contradicts prior assumptions
  - If you cannot progress after 3 steps, ask one focused question
  
  # This prevents excessive internal reasoning loops
```

**El que NO pots controlar:**

- **Enrutament automàtic:** El LLM decideix quin especialista invocar segons les descripcions → per a un comportament més determinista, considera els fluxos de treball agèntics
- **Processament en paral·lel:** Actualment, les crides a agents són seqüencials (una alhora)
- **Algorisme d'enrutament:** La lògica d'orquestració interna de watsonx Orchestrate
- **Temps de resposta:** Inherent al LLM i al temps d'execució de les eines

**Bones pràctiques:**

1. **Mantén les jerarquies planes** - Minimitza les capes d'agents
2. **Escriu descripcions clares** - Ajuda el LLM a enrutar correctament
3. **Utilitza instruccions explícites** - Guia les decisions d'enrutament
4. **Limita les eines per agent** - Mantén els especialistes enfocats (≤10 eines)
5. **Dissenya especialistes independents** - Evita dependències entre agents
6. **Prova el comportament d'enrutament** - Verifica que el LLM enruta com s'espera

### 6. Estratègies de prova

Les proves en sistemes multiagent impliquen tres nivells: provar els especialistes individualment, provar la lògica d'enrutament i provar els fluxos de treball complets.

**Comprendre `assert` en les proves de Python**

Abans de veure els exemples, entenguem la sentència `assert`:

```python
# assert checks if a condition is True
# If True: test passes, continues
# If False: test fails, stops with an error

assert 5 > 3                    # ✅ Passes (5 is greater than 3)
assert "hello" in "hello world" # ✅ Passes ("hello" is in the string)
assert 2 + 2 == 4               # ✅ Passes (2+2 equals 4)

assert 5 < 3                    # ❌ Fails! (5 is NOT less than 3)
assert "cat" in "dog"           # ❌ Fails! ("cat" is NOT in "dog")

# In our tests, we use assert to verify agent behavior:
response = agent.chat("Find flights to Paris")
assert "flight" in response.lower()  # ✅ Pass if response mentions flights
                                     # ❌ Fail if response doesn't mention flights
```

**Per què utilitzar `assert`?**

- Comprova automàticament si el teu agent funciona correctament
- Falla immediatament quan alguna cosa va malament
- Facilita l'execució de centenars de proves de manera automàtica
- Ajuda a detectar errors abans que els usuaris els vegin

Vegem ara com utilitzem `assert` per provar el nostre sistema multiagent:

---

**Nivell 1: Proves unitàries d'especialistes individuals**

Propòsit: Verificar que cada agent especialista funciona correctament de manera aïllada, independentment de l'orquestrador.

```python
# Test that the flight specialist can handle flight queries correctly
# This tests ONLY the specialist, not the routing to it

import pytest
from ibm_watsonx_orchestrate import Agent

def test_flight_specialist_search():
    """
    Test that flight_specialist correctly uses search_flights tool
    and returns flight information
    """
    # Load the specialist agent
    agent = Agent.from_yaml("flight_specialist_agent.yaml")
    
    # Send a query directly to the specialist
    response = agent.chat("Find flights from NYC to LAX on Dec 15")
    
    # Verify the response contains flight information
    assert "flight" in response.lower() or "airline" in response.lower()
    assert "NYC" in response or "New York" in response
    assert "LAX" in response or "Los Angeles" in response
    
def test_flight_specialist_with_mock_tools():
    """
    Test specialist behavior with mock tools to avoid external API calls
    """
    # Create mock tool that returns predictable data
    def mock_search_flights(origin, destination, date):
        return {
            "flights": [
                {"airline": "United", "price": 350, "departure": "08:00"},
                {"airline": "Delta", "price": 375, "departure": "10:30"}
            ]
        }
    
    # Load agent and replace tool with mock
    agent = Agent.from_yaml("flight_specialist_agent.yaml")
    agent.tools["search_flights"] = mock_search_flights
    
    response = agent.chat("Find flights from NYC to LAX")
    
    # Verify agent used the tool and formatted results
    assert "United" in response
    assert "350" in response or "$350" in response
```

**Per què fer proves unitàries dels especialistes?**

- Verificar que les eines de cada especialista funcionen correctament
- Provar el format de resposta de l'especialista
- Assegurar que l'especialista gestiona els errors amb elegància
- Més ràpid que provar a través de l'orquestrador
- Més fàcil de depurar quan sorgeixen problemes

**Nivell 2: Proves d'integració de l'enrutament**

Propòsit: Verificar que l'orquestrador enruta correctament les sol·licituds cap als especialistes adequats.

```python
def test_orchestrator_routes_to_flight_specialist():
    """
    Test that orchestrator recognizes flight queries and routes to flight_specialist
    """
    # Load the orchestrator agent
    orchestrator = Agent.from_yaml("travel_concierge_agent.yaml")
    
    # Ask about flights
    response = orchestrator.chat("I need to book a flight to Paris")
    
    # Check that response contains flight information
    # (indicating flight_specialist was called)
    assert "flight" in response.lower()
    
    # You can also check orchestrator's internal logs if available
    # to verify which collaborator was called

def test_orchestrator_routes_to_hotel_specialist():
    """
    Test that orchestrator recognizes hotel queries
    """
    orchestrator = Agent.from_yaml("travel_concierge_agent.yaml")
    
    response = orchestrator.chat("Find me a hotel in Paris")
    
    # Verify hotel-related response
    assert "hotel" in response.lower() or "accommodation" in response.lower()

def test_orchestrator_handles_ambiguous_query():
    """
    Test that orchestrator asks clarifying questions for ambiguous requests
    """
    orchestrator = Agent.from_yaml("travel_concierge_agent.yaml")
    
    response = orchestrator.chat("I want to go to Paris")
    
    # Should ask what kind of help is needed
    assert "?" in response  # Contains a question
    assert any(word in response.lower() for word in ["flight", "hotel", "help"])
```

**Per què fer proves d'integració de l'enrutament?**

- Verificar que les descripcions i instruccions de l'orquestrador funcionen
- Assegurar que el LLM enruta cap als especialistes correctes
- Provar casos límit i consultes ambigües
- Validar fluxos de treball amb diversos especialistes

**Nivell 3: Proves d'extrem a extrem del flux de treball**

Propòsit: Provar recorreguts d'usuari complets que involucrin diversos especialistes i torns de conversa.

```python
def test_complete_trip_planning_workflow():
    """
    Test a realistic multi-turn conversation that uses multiple specialists
    """
    orchestrator = Agent.from_yaml("travel_concierge_agent.yaml")
    
    # Turn 1: Initial request
    response1 = orchestrator.chat("I want to plan a trip to Tokyo in March")
    assert "tokyo" in response1.lower()
    
    # Turn 2: Flight request
    response2 = orchestrator.chat("I need flights from New York")
    assert "flight" in response2.lower()
    
    # Turn 3: Budget constraint
    response3 = orchestrator.chat("My budget is $3000 total")
    assert "budget" in response3.lower() or "3000" in response3
    
    # Turn 4: Hotel request
    response4 = orchestrator.chat("What hotels do you recommend?")
    assert "hotel" in response4.lower()
    
    # Verify conversation context is maintained
    # (orchestrator should remember Tokyo, March, $3000 budget)
    assert "tokyo" in response4.lower() or "march" in response4.lower()

def test_error_recovery_workflow():
    """
    Test that system handles errors gracefully in multi-agent workflow
    """
    orchestrator = Agent.from_yaml("travel_concierge_agent.yaml")
    
    # Request with invalid date
    response = orchestrator.chat("Find flights to Paris on February 30")
    
    # Should handle gracefully, not crash
    assert response is not None
    assert "error" not in response.lower() or "invalid" in response.lower()
```

**Per què fer proves d'extrem a extrem?**

- Verificar que els recorreguts d'usuari complets funcionen
- Provar la retenció del context entre torns
- Assegurar que els especialistes treballen correctament junts
- Validar patrons d'ús reals

**Bones pràctiques de prova:**

1. **Comença amb proves unitàries** - Prova primer els especialistes individualment
2. **Utilitza eines simulades** - Evita crides a API externes a les proves per a més velocitat i fiabilitat
3. **Prova l'enrutament explícitament** - Verifica que l'orquestrador enruta cap als especialistes correctes
4. **Prova el context de la conversa** - Assegura que la informació es manté entre torns
5. **Prova escenaris d'error** - Entrades invàlides, dades que falten, errors d'eines
6. **Utilitza consultes realistes** - Prova amb llenguatge d'usuari real, no només termes tècnics
7. **Automatitza les proves** - Executa les proves a cada canvi de codi
8. **Prova de manera incremental** - Afegeix proves a mesura que afegeixes especialistes

**Estructura de proves d'exemple:**
```
tests/
├── test_specialists/
│   ├── test_flight_specialist.py
│   ├── test_hotel_specialist.py
│   ├── test_activity_planner.py
│   └── test_budget_advisor.py
├── test_routing/
│   └── test_orchestrator_routing.py
└── test_workflows/
    └── test_trip_planning_workflows.py
```

---

## Part 7: Patrons avançats

### Patró 1: Flux de treball seqüencial

```yaml
instructions: |
  For trip planning:
  1. Get flights first (determines dates)
  2. Get hotels second (based on flight dates)
  3. Get activities third (based on location and dates)
  4. Get budget analysis last (based on all selections)
```

### Patró 2: Enrutament condicional

```yaml
instructions: |
  If user mentions budget constraints:
  - Route to budget_advisor FIRST
  - Get budget recommendations
  - Then route to other specialists with budget in mind
  
  If user has no budget constraints:
  - Route directly to relevant specialists
  - Offer budget analysis at the end
```

### Patró 3: Refinament iteratiu

```yaml
instructions: |
  For complex requests:
  1. Get initial options from specialist
  2. Present to user
  3. If user wants refinements:
     - Route back to same specialist with new criteria
     - Repeat until user satisfied
  4. Move to next specialist
```

### Patró 4: Cadena de reserva

```yaml
instructions: |
  If primary specialist cannot help:
  1. Try secondary specialist
  2. If still cannot help, try general knowledge
  3. If still cannot help, escalate or admit limitation
```

---

## Exercicis

### Exercici 1: Afegir un nou especialista (Fàcil)

Afegeix un "Especialista en lloguer de cotxes" al sistema de viatges.

**Requisits:**

- Crear `car_rental_specialist_agent.yaml`
- Crear `car_rental_tools.py` amb funcions de cerca i reserva
- Actualitzar `travel_concierge` per incloure el nou especialista
- Provar l'enrutament cap a l'especialista de lloguer de cotxes

**💡 Pregunta-ho a Bob:**
```
Bob, create a car_rental_specialist agent with tools for searching
and booking rental cars, and update the travel_concierge to route
car rental queries appropriately.
```

### Exercici 2: Implementar el flux pressupost-primer (Mitjà)

Modifica l'orquestrador perquè comprovi sempre el pressupost primer en les sol·licituds de planificació de viatges.

**Requisits:**

- Actualitzar les instruccions de `travel_concierge`
- Enrutar cap al `budget_advisor` abans que cap als altres especialistes
- Utilitzar les restriccions de pressupost en enrutar cap a altres especialistes
- Provar amb sol·licituds amb restriccions de pressupost

### Exercici 3: Crear un sistema per a un domini diferent (Avançat)

Construeix un sistema multiagent per a un domini diferent (per exemple, comerç electrònic, sanitat, educació).

**Requisits:**

- Dissenyar 3-4 agents especialistes
- Crear un orquestrador amb lògica d'enrutament
- Implementar eines simulades
- Provar els fluxos de treball complets

**Dominis d'exemple:**

- **Comerç electrònic**: Cerca de productes, Inventari, Pagament, Suport
- **Sanitat**: Cites, Prescripcions, Facturació, Historial
- **Educació**: Cerca de cursos, Matriculació, Tasques, Qualificacions

---

## Problemes freqüents

### Problema: L'orquestrador no enruta

**Símptomes**: L'orquestrador intenta respondre directament en lloc d'enrutar

**Solucions:**

1. Fer les descripcions dels especialistes més específiques
2. Afegir regles d'enrutament explícites a les instruccions de l'orquestrador
3. Assegurar-se que els col·laboradors estiguin ben llistats
4. Verificar que els agents especialistes existeixen i estan importats

### Problema: El context es perd entre agents

**Símptomes**: L'especialista no té informació de la conversa anterior

**Solucions:**

1. Actualitzar l'orquestrador perquè passi el context explícitament
2. Incloure detalls rellevants en enrutar
3. Fer que l'orquestrador resumeixi les interaccions anteriors

### Problema: Enrutament circular

**Símptomes**: Els agents s'enruten els uns als altres indefinidament

**Solucions:**

1. Afegir condicions clares de terminació
2. Limitar la profunditat d'enrutament
3. Fer que els especialistes indiquin quan han acabat
4. L'orquestrador ha de sintetitzar, no tornar a enrutar

---

## Resum

En aquesta lliçó has après:

✅ Quan i per què utilitzar sistemes multiagent  
✅ Com dissenyar agents especialistes enfocats  
✅ Com crear agents orquestradors amb lògica d'enrutament  
✅ Com gestionar el context i els traspassos  
✅ Bones pràctiques per a arquitectures multiagent  
✅ Patrons comuns i antipatrons  

### Punts clau

1. **Separació de responsabilitats** - Cada agent té un propòsit clar i enfocat
2. **Enrutament clar** - L'orquestrador té lògica explícita per a les decisions d'enrutament
3. **Gestió del context** - La informació flueix amb fluïdesa entre agents
4. **Degradació elegant** - El sistema gestiona errors i casos límit correctament
5. **Mantenibilitat** - Els especialistes es poden actualitzar de manera independent

### Propers passos

- Implementa els exercicis per reforçar l'aprenentatge
- Prova de construir sistemes multiagent per als teus propis casos d'ús
- Explora patrons avançats com el processament en paral·lel
- Considera com monitoritzar i optimitzar els sistemes multiagent

---

**Vols saber-ne més?** Això completa el mòdul avançat d'orquestració multiagent. Ara pots aplicar aquests patrons per construir sistemes d'agents sofisticats per a qualsevol domini! 🚀

> 💡 Aquest contingut es basa en el taller més extens disponible a [Bobchestrate Workshop](https://juseljuk.github.io/bobchestrate-workshop/). Si vols explorar més exercicis, temes avançats o la versió estesa, visita l'enllaç!
