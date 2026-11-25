---
hide:
  - navigation
---

# Parte 4: Orquestación Multi-Agente y Flujos de Trabajo

<p align="center">
  <img src="bobchestrate_part4.png" alt="Bobchestrate - Setup" width="700">
</p>

**Duración**: 55 minutos

**Dificultad**: Avanzado

**Nota**: Este es un ejercicio avanzado independiente que puede completarse sin necesidad de haber realizado las partes anteriores.

## Descripción general

En esta lección aprenderás a construir sistemas multi-agente sofisticados donde agentes especializados colaboran para resolver tareas complejas. Crearás jerarquías de agentes, implementarás lógica de enrutamiento y orquestarás flujos de trabajo entre múltiples agentes.

Esta parte presenta un completo **sistema de planificación de viajes** como ejemplo avanzado de orquestación multi-agente. A diferencia del sistema de atención al cliente construido en partes anteriores, este es un ejercicio autónomo que demuestra patrones avanzados.

### Lo que aprenderás

- Cuándo y por qué usar múltiples agentes
- Cómo crear agentes especializados para dominios específicos
- Cómo construir jerarquías de agentes (relaciones padre-hijo)
- Cómo implementar enrutamiento inteligente entre agentes
- Cómo gestionar el contexto y los traspasos
- Buenas prácticas para sistemas multi-agente

### Lo que construirás

**Sistema de Planificación de Viajes** con múltiples agentes especializados:

- **Travel Concierge** (padre) - Enruta las solicitudes a los especialistas
- **Flight Specialist** - Gestiona reservas de vuelos
- **Hotel Specialist** - Gestiona el alojamiento
- **Activity Planner** - Sugiere actividades locales
- **Budget Advisor** - Proporciona análisis de costes

---

## ¿Por qué sistemas multi-agente?

### Agente único vs. Multi-agente

**Enfoque de agente único:**
```
Customer Support Agent
├── 50+ tools
├── 10+ knowledge bases
├── Complex instructions (1000+ lines)
└── Handles everything
```

**Problemas:**

- ❌ Complejidad abrumadora
- ❌ Difícil de mantener
- ❌ Rendimiento deficiente en tareas especializadas
- ❌ Difícil de probar y depurar

**Enfoque multi-agente:**
```
Orchestrator Agent
├── Order Specialist (5 tools, focused instructions)
├── Billing Specialist (3 tools, focused instructions)
├── Technical Support (8 tools, focused instructions)
└── Escalation Handler (2 tools, focused instructions)
```

**Ventajas:**

- ✅ Clara separación de responsabilidades
- ✅ Más fácil de mantener y actualizar
- ✅ Mejor rendimiento en tareas especializadas
- ✅ Pruebas y depuración más sencillas
- ✅ Especialistas reutilizables en distintos sistemas

### Cuándo usar sistemas multi-agente

| Usa Multi-Agente cuando... | Usa un Agente único cuando... |
|-------------------------|--------------------------|
| El dominio tiene especializaciones claramente diferenciadas | La tarea es simple y enfocada |
| Se necesita rendimiento de nivel experto | El conocimiento general es suficiente |
| El sistema crecerá con el tiempo | Los requisitos son estables |
| Varios equipos gestionan partes distintas | Un único equipo gestiona todo |
| Necesitas reutilizar especialistas | El agente es de propósito único |

---

## Parte 1: Comprender las jerarquías de agentes

### Roles de los agentes

**1. Agente Orquestador (Padre)**

- Enruta las solicitudes a los especialistas adecuados
- Gestiona el flujo general de la conversación
- Sintetiza respuestas de varios agentes
- Maneja consultas generales

**2. Agentes Especialistas (Hijos)**

- Experiencia profunda en un dominio específico
- Herramientas y conocimiento enfocados
- Instrucciones claras y específicas
- Devuelven el control al orquestador cuando terminan

### Estrategias de enrutamiento

**1. Enrutamiento basado en descripción**
El orquestador usa las descripciones de los agentes para decidir el enrutamiento:

```yaml
# Orchestrator sees these descriptions
collaborators:
  - flight_specialist  # "Handles flight searches, bookings, and changes"
  - hotel_specialist   # "Manages hotel reservations and accommodations"
```

**2. Enrutamiento basado en instrucciones**
Lógica de enrutamiento explícita en las instrucciones del orquestador:

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

**3. Enrutamiento basado en herramientas (Patrón de supervisión)**
El orquestador actúa como supervisor sin herramientas de dominio propias, delegando en los especialistas que sí tienen las herramientas reales:

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

**Por qué funciona esto:**

- El orquestador reconoce que no tiene las herramientas necesarias para la tarea
- Debe delegar en un agente especialista que sí las tenga
- Esto crea un enrutamiento natural basado en los límites de capacidad
- Evita que el orquestador intente gestionar tareas específicas de dominio directamente

---

## Parte 2: Construir los agentes especialistas

### Paso 1: Crear el especialista en vuelos

Copia el ejemplo `flight_specialist_agent_<your-initials>.yaml` o pídeselo a Bob (mira el prompt de ejemplo bajo el YAML). **PISTA**: deberías pedírselo a Bob. Creará algo mejor que el simple ejemplo 🤓 Y solo cuesta alrededor de 0,3 bobcoins 🪙

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

**💡 Pregúntale a Bob:**
```
Bob, create a flight_specialist_agent_<your-initials>.yaml file with focused instructions for handling flight bookings and searches.
```
Cuando Bob termine, tendrás un nuevo fichero de agente guardado en tu directorio de agentes. Echa un vistazo a lo que Bob ha creado para ti. ¡Bastante profesional, verdad? Con directrices reales y marcadores de posición para las herramientas. Crearemos las herramientas un poco más adelante.

### Paso 2: Crear el especialista en hoteles

Copia el ejemplo `hotel_specialist_agent_<your-initials>.yaml` o pídeselo a Bob. A estas alturas ya deberías tener una idea de cómo formular el prompt para este agente 😉 Puedes intentarlo varias veces hasta quedar satisfecho con el resultado.

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

### Paso 3: Crear el planificador de actividades

Copia el ejemplo `activity_planner_agent_<your-initials>.yaml` o pídeselo a Bob.

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

### Paso 4: Crear el asesor de presupuesto

Copia el ejemplo `budget_advisor_agent_<your-initials>.yaml` o pídeselo a Bob.

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

## Parte 3: Crear el agente orquestador

### Paso 1: Diseñar las instrucciones del orquestador

El orquestador necesita una lógica de enrutamiento clara:

Copia el ejemplo `travel_concierge_agent.yaml` o pídeselo a Bob (mira el prompt de ejemplo bajo el YAML).

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

**💡 Pregúntale a Bob:**
```
Bob, create a travel_concierge_agent_<your-initials>.yaml that orchestrates between the four specialist agents with clear routing logic. The collaborators are flight_specialist_<your-initials>, hotel_specialist_<your-initials>, activity_planner_<your-initials>, and budget_advisor_<your-initials>. The agent should handle complex multi-aspect travel requests by routing to the appropriate specialist and synthesizing responses.
```
---

## Parte 4: Implementar herramientas simuladas

Para este taller, crearemos herramientas simuladas que imitan las capacidades de los especialistas. Esto nos permite centrarnos en la lógica de orquestación sin necesidad de integrarnos con APIs reales todavía. Este enfoque es ideal para prototipos rápidos, demostraciones y pruebas.

### Crear las herramientas de vuelos

Crea `flight_tools_<your-initials>.py`, o pídeselo a Bob (mira el prompt de ejemplo bajo el código):

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

**💡 Pregúntale a Bob:**
```
Bob, create flight_tools_<your-initials>.py with mock implementations of search_flights_<your-initials>, book_flight_<your-initials>, modify_flight_<your-initials>, and cancel_flight_<your-initials> tools.
```

### Crear las herramientas de hoteles

Crea `hotel_tools_<your-initials>.py`, o pídeselo a Bob (mira el prompt de ejemplo bajo el código).:

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

**💡 Pregúntale a Bob:**
```
Bob, create hotel_tools_<your-initials>.py with mock implementations of search_hotels_<your-initials>, book_hotel_<your-initials>, modify_hotel_booking_<your-initials>, and cancel_hotel_booking_<your-initials> tools.
```

### Crear las herramientas de actividades

Crea `activity_tools_<your-initials>.py` con las herramientas para el planificador de actividades:

**💡 Pregúntale a Bob:**
```
Bob, create activity_tools_<your-initials>.py with mock implementations of search_activities_<your-initials>, get_activity_details_<your-initials>, search_restaurants_<your-initials>, and create_itinerary_<your-initials> tools.
```

El fichero debe incluir:

- `search_activities`: Busca actividades según la ubicación y los intereses
- `get_activity_details`: Obtiene información detallada sobre actividades específicas
- `search_restaurants`: Busca restaurantes por tipo de cocina y rango de precios
- `create_itinerary`: Genera itinerarios día a día

### Crear las herramientas de presupuesto

Crea `budget_tools_<your-initials>.py` con las herramientas para el asesor de presupuesto:

**💡 Pregúntale a Bob:**
```
Bob, create budget_tools_<your-initials>.py with mock implementations of calculate_trip_cost_<your-initials>, compare_options_<your-initials>, find_deals_<your-initials>, and budget_optimizer_<your-initials> tools.
```

El fichero debe incluir:

- `calculate_trip_cost`: Calcula el coste total del viaje con un desglose detallado
- `compare_options`: Compara dos opciones de viaje y proporciona recomendaciones
- `find_deals`: Encuentra ofertas y descuentos actuales
- `budget_optimizer`: Optimiza la distribución del presupuesto entre categorías

---
## Parte 4.5: Convención de nombres para el entorno compartido

**⚠️ IMPORTANTE: Requisitos de nomenclatura en el taller** - **PUEDES IGNORAR ESTO SI NO USAS EL ENTORNO WXO COMPARTIDO**

Dado que todos los participantes del taller comparten el mismo entorno de watsonx Orchestrate, **debes** añadir tus iniciales como sufijo en los nombres de todas las herramientas y agentes para evitar conflictos.

### Patrón de nomenclatura

Usa este patrón para todas tus herramientas y agentes:

- **Herramientas**: `tool_name_XX` (donde XX son tus iniciales)
- **Nombres de fichero de agente YAML**: `agent_name_XX.yaml` (usa guiones bajos también en el nombre de fichero)
- **Campo name del agente**: `agent_name_XX` (usa guiones bajos, no guiones)

### Ejemplo

Si tu nombre es **Jane Smith** (iniciales: JS), renombra tus herramientas y agentes de la siguiente forma:

**Herramientas:**
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

**Ficheros de agente:**
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

- El **nombre de fichero** YAML también usa guiones bajos: `flight_specialist_agent_JS.yaml`
- El **campo name** del agente debe usar guiones bajos (igual que el fichero): `name: flight_specialist_JS`
- Este es un requisito de watsonx Orchestrate para el registro correcto del agente

### Lista de verificación de nomenclatura completa

Antes de importar, asegúrate de haber renombrado:

**✅ Ficheros de herramientas:**

- [ ] Todos los nombres de función `@tool` en `flight_tools.py`
- [ ] Todos los nombres de función `@tool` en `hotel_tools.py`
- [ ] Todos los nombres de función `@tool` en `activity_tools.py`
- [ ] Todos los nombres de función `@tool` en `budget_tools.py`

**✅ Ficheros de agentes:**

- [ ] Campo `name` del agente en `flight_specialist_agent.yaml`
- [ ] Referencias de herramientas en la sección `tools`
- [ ] Campo `name` del agente en `hotel_specialist_agent.yaml`
- [ ] Referencias de herramientas en la sección `tools`
- [ ] Campo `name` del agente en `activity_planner_agent.yaml`
- [ ] Referencias de herramientas en la sección `tools`
- [ ] Campo `name` del agente en `budget_advisor_agent.yaml`
- [ ] Referencias de herramientas en la sección `tools`
- [ ] Campo `name` del agente en `travel_concierge_agent.yaml`
- [ ] Nombres de agentes colaboradores en la sección `collaborators`

**💡 Pregúntale a Bob:**
```
Bob, add a postfix "_<your_initials>" to all tool function names in flight_tools.py, hotel_tools.py, activity_tools.py, and budget_tools.py. Then update all agent YAML files to use the renamed tools (activity planner to use activity tools, flifgt specialist to use flight tools, etc.) and add "_<your_initials>" postfix to agent name fields within their yaml-files.
```
>**NOTA**: Recuerda actualizar tus iniciales en los marcadores de posición del prompt antes de enviárselo a Bob 😉

### Por qué importa esto

Sin nombres únicos:

- ❌ Tus herramientas sobrescribirán las herramientas de otros participantes
- ❌ Tus agentes entrarán en conflicto con los de otros
- ❌ Las pruebas producirán resultados impredecibles
- ❌ Podrías usar accidentalmente la implementación de otra persona

Con nombres únicos:

- ✅ Tus herramientas y agentes están aislados
- ✅ Puedes probar de forma independiente
- ✅ Sin conflictos con otros participantes
- ✅ Propiedad clara de tus implementaciones

---

## Parte 5: Probar los flujos de trabajo multi-agente

### Importar todos los agentes y herramientas

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
**💡 Pregúntale a Bob:**
```
Bob, create a script that imports all agents (flight specialist, hotel specialist, activty planner, budget advisor and finally tra) and their tools in the correct order. Make sure each agent is imported after its collaborators.
```
>**NOTA**: Revisa la sintaxis de importación de herramientas y agentes que usa Bob en el script generado. Aunque la información sobre la sintaxis correcta está disponible en la regla de desarrollo personalizada que estamos usando, a veces Bob puede no consultarla antes de crear cosas.

### Probar el enrutamiento simple

**Prueba 1: Especialista único**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Find me flights from New York to London for next week"
```

Flujo esperado:

1. El Concierge recibe la solicitud
2. Enruta al flight_specialist
3. El especialista en vuelos busca vuelos
4. Devuelve los resultados al usuario

**Prueba 2: Múltiples especialistas**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Plan a 5-day trip to Paris including flights and hotels"
```

Flujo esperado:

1. El Concierge recibe la solicitud
2. Enruta al flight_specialist para los vuelos
3. Enruta al hotel_specialist para los hoteles
4. Sintetiza el plan completo
5. Devuelve el resultado al usuario

### Probar flujos de trabajo complejos

**Prueba 3: Planificación completa del viaje**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "I want to visit Tokyo for a week. I have a budget of $3000. Help me plan everything including flights, hotel, and activities."
```

Flujo esperado:

1. El Concierge desglosa la solicitud
2. Enruta al flight_specialist
3. Enruta al hotel_specialist
4. Enruta al activity_planner
5. Enruta al budget_advisor
6. Sintetiza el itinerario completo
7. Devuelve el plan completo

---

## Parte 6: Buenas prácticas

### 1. Diseño de agentes

**Mantén los especialistas enfocados:**
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

**Descripciones claras:**
```yaml
# ✅ Good - Clear, specific description with collaborators
description: Expert in flight searches, bookings, changes, and cancellations.
  Handles all flight-related queries including availability, pricing, and
  itinerary modifications. Works with hotel_specialist and activity_planner
  for complete travel planning.

# ❌ Bad - Vague description
description: Helps with travel stuff
```

**NOTA:** Incluye menciones a los agentes colaboradores en las descripciones para ayudar al orquestador a entender las relaciones entre agentes y las opciones de enrutamiento.

### 2. Lógica de enrutamiento

**Instrucciones de enrutamiento explícitas:**
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

**Gestionar casos límite:**
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

### 3. Gestión del contexto

**Pasar el contexto relevante:**
```yaml
instructions: |
  When routing to specialist:
  - Include all relevant details from conversation
  - Mention previous specialist interactions if relevant
  - Provide user preferences and constraints
```

**Sintetizar las respuestas:**
```yaml
instructions: |
  After receiving specialist response:
  - Summarize key points
  - Connect to user's original request
  - Suggest logical next steps
  - Maintain conversation flow
```

### 4. Manejo de errores

**Fallos con elegancia:**
```yaml
instructions: |
  If specialist returns error:
  - Explain issue to user clearly
  - Suggest alternatives
  - Offer to try different approach
  - Don't expose technical details
```

**Gestión de tiempos de espera:**
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

**Validación de entradas:**
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

**Registro y depuración:**
```yaml
instructions: |
  For debugging multi-agent workflows:
  - Log routing decisions and reasons
  - Track which specialist handled each request
  - Record context passed between agents
  - Note any errors or fallbacks used
  
  This helps identify issues in routing logic and specialist performance.
```

### 5. Optimizar el rendimiento de los agentes

**Arquitectura de agentes:**
```yaml
# ✅ Good - Flat hierarchy with focused specialists
User → Orchestrator → Specialist → User

# ❌ Bad - Unnecessary intermediate layers
User → Orchestrator → Coordinator → Specialist → Coordinator → Orchestrator → User

# Keep your agent hierarchy simple. The LLM handles routing based on descriptions,
# so additional coordinator layers just add latency without improving routing.
```

**Descripciones de agente claras:**
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

**Instrucciones de enrutamiento explícitas:**
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

**Diseño de herramientas para especialistas:**
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

**Eficiencia en el razonamiento (para GPT-OSS-120B):**
```yaml
instructions: |
  # Limit reasoning depth to improve response time
  
  Reasoning and brevity controls:
  - Use concise reasoning with at most 3 reasoning steps
  - Do not re-plan unless the last tool result contradicts prior assumptions
  - If you cannot progress after 3 steps, ask one focused question
  
  # This prevents excessive internal reasoning loops
```

**Lo que NO puedes controlar:**

- **Enrutamiento automático:** El LLM decide qué especialista invocar según las descripciones → para un comportamiento más determinista, considera los flujos de trabajo agénticos
- **Procesamiento en paralelo:** Actualmente, las llamadas a agentes son secuenciales (una a la vez)
- **Algoritmo de enrutamiento:** La lógica de orquestación interna de watsonx Orchestrate
- **Tiempo de respuesta:** Inherente al LLM y al tiempo de ejecución de las herramientas

**Buenas prácticas:**

1. **Mantén jerarquías planas** - Minimiza las capas de agentes
2. **Escribe descripciones claras** - Ayuda al LLM a enrutar correctamente
3. **Usa instrucciones explícitas** - Guía las decisiones de enrutamiento
4. **Limita las herramientas por agente** - Mantén a los especialistas enfocados (≤10 herramientas)
5. **Diseña especialistas independientes** - Evita dependencias entre agentes
6. **Prueba el comportamiento de enrutamiento** - Verifica que el LLM enrute como se espera

### 6. Estrategias de prueba

Las pruebas en sistemas multi-agente implican tres niveles: probar los especialistas individualmente, probar la lógica de enrutamiento y probar los flujos de trabajo completos.

**Comprender `assert` en las pruebas de Python**

Antes de ver los ejemplos, entendamos la sentencia `assert`:

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

**¿Por qué usar `assert`?**

- Comprueba automáticamente si tu agente funciona correctamente
- Falla de inmediato cuando algo va mal
- Facilita la ejecución de cientos de pruebas de forma automática
- Ayuda a detectar errores antes de que los usuarios los vean

Veamos ahora cómo usamos `assert` para probar nuestro sistema multi-agente:

---

**Nivel 1: Pruebas unitarias de especialistas individuales**

Propósito: Verificar que cada agente especialista funciona correctamente de forma aislada, independientemente del orquestador.

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

**¿Por qué hacer pruebas unitarias de los especialistas?**

- Verificar que las herramientas de cada especialista funcionan correctamente
- Probar el formato de respuesta del especialista
- Asegurar que el especialista gestiona los errores con elegancia
- Más rápido que probar a través del orquestador
- Más fácil de depurar cuando surgen problemas

**Nivel 2: Pruebas de integración del enrutamiento**

Propósito: Verificar que el orquestador enruta correctamente las solicitudes a los especialistas adecuados.

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

**¿Por qué hacer pruebas de integración del enrutamiento?**

- Verificar que las descripciones e instrucciones del orquestador funcionan
- Asegurar que el LLM enruta a los especialistas correctos
- Probar casos límite y consultas ambiguas
- Validar flujos de trabajo con múltiples especialistas

**Nivel 3: Pruebas de extremo a extremo del flujo de trabajo**

Propósito: Probar recorridos de usuario completos que involucren múltiples especialistas y turnos de conversación.

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

**¿Por qué hacer pruebas de extremo a extremo?**

- Verificar que los recorridos de usuario completos funcionan
- Probar la retención de contexto entre turnos
- Asegurar que los especialistas trabajan correctamente juntos
- Validar patrones de uso reales

**Buenas prácticas de prueba:**

1. **Empieza con pruebas unitarias** - Prueba los especialistas individualmente primero
2. **Usa herramientas simuladas** - Evita llamadas a APIs externas en las pruebas para mayor velocidad y fiabilidad
3. **Prueba el enrutamiento explícitamente** - Verifica que el orquestador enruta a los especialistas correctos
4. **Prueba el contexto de la conversación** - Asegura que la información se mantiene entre turnos
5. **Prueba escenarios de error** - Entradas inválidas, datos faltantes, fallos de herramientas
6. **Usa consultas realistas** - Prueba con lenguaje de usuario real, no solo términos técnicos
7. **Automatiza las pruebas** - Ejecuta las pruebas en cada cambio de código
8. **Prueba incrementalmente** - Añade pruebas a medida que añades especialistas

**Estructura de pruebas de ejemplo:**
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

## Parte 7: Patrones avanzados

### Patrón 1: Flujo de trabajo secuencial

```yaml
instructions: |
  For trip planning:
  1. Get flights first (determines dates)
  2. Get hotels second (based on flight dates)
  3. Get activities third (based on location and dates)
  4. Get budget analysis last (based on all selections)
```

### Patrón 2: Enrutamiento condicional

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

### Patrón 3: Refinamiento iterativo

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

### Patrón 4: Cadena de respaldo

```yaml
instructions: |
  If primary specialist cannot help:
  1. Try secondary specialist
  2. If still cannot help, try general knowledge
  3. If still cannot help, escalate or admit limitation
```

---

## Ejercicios

### Ejercicio 1: Añadir un nuevo especialista (Fácil)

Añade un "Especialista en alquiler de coches" al sistema de viajes.

**Requisitos:**

- Crear `car_rental_specialist_agent.yaml`
- Crear `car_rental_tools.py` con funciones de búsqueda y reserva
- Actualizar `travel_concierge` para incluir el nuevo especialista
- Probar el enrutamiento al especialista de alquiler de coches

**💡 Pregúntale a Bob:**
```
Bob, create a car_rental_specialist agent with tools for searching
and booking rental cars, and update the travel_concierge to route
car rental queries appropriately.
```

### Ejercicio 2: Implementar el flujo presupuesto-primero (Medio)

Modifica el orquestador para comprobar siempre el presupuesto primero en las solicitudes de planificación de viajes.

**Requisitos:**

- Actualizar las instrucciones de `travel_concierge`
- Enrutar al `budget_advisor` antes que a los otros especialistas
- Usar las restricciones de presupuesto al enrutar a otros especialistas
- Probar con solicitudes con restricciones de presupuesto

### Ejercicio 3: Crear un sistema para un dominio diferente (Avanzado)

Construye un sistema multi-agente para un dominio diferente (por ejemplo, comercio electrónico, sanidad, educación).

**Requisitos:**

- Diseñar 3-4 agentes especialistas
- Crear un orquestador con lógica de enrutamiento
- Implementar herramientas simuladas
- Probar los flujos de trabajo completos

**Dominios de ejemplo:**

- **Comercio electrónico**: Búsqueda de productos, Inventario, Pago, Soporte
- **Sanidad**: Citas, Prescripciones, Facturación, Historial
- **Educación**: Búsqueda de cursos, Matriculación, Tareas, Calificaciones

---

## Problemas frecuentes

### Problema: El orquestador no enruta

**Síntomas**: El orquestador intenta responder directamente en lugar de enrutar

**Soluciones:**

1. Hacer las descripciones de los especialistas más específicas
2. Añadir reglas de enrutamiento explícitas en las instrucciones del orquestador
3. Asegurarse de que los colaboradores estén correctamente listados
4. Verificar que los agentes especialistas existen y están importados

### Problema: El contexto se pierde entre agentes

**Síntomas**: El especialista no tiene información de la conversación anterior

**Soluciones:**

1. Actualizar el orquestador para pasar el contexto explícitamente
2. Incluir detalles relevantes al enrutar
3. Hacer que el orquestador resuma las interacciones anteriores

### Problema: Enrutamiento circular

**Síntomas**: Los agentes se siguen enrutando entre sí indefinidamente

**Soluciones:**

1. Añadir condiciones claras de terminación
2. Limitar la profundidad de enrutamiento
3. Hacer que los especialistas indiquen cuándo han terminado
4. El orquestador debe sintetizar, no volver a enrutar

---

## Resumen

En esta lección aprendiste:

✅ Cuándo y por qué usar sistemas multi-agente  
✅ Cómo diseñar agentes especialistas enfocados  
✅ Cómo crear agentes orquestadores con lógica de enrutamiento  
✅ Cómo gestionar el contexto y los traspasos  
✅ Buenas prácticas para arquitecturas multi-agente  
✅ Patrones comunes y antipatrones  

### Puntos clave

1. **Separación de responsabilidades** - Cada agente tiene un propósito claro y enfocado
2. **Enrutamiento claro** - El orquestador tiene lógica explícita para las decisiones de enrutamiento
3. **Gestión del contexto** - La información fluye con fluidez entre agentes
4. **Degradación elegante** - El sistema gestiona errores y casos límite correctamente
5. **Mantenibilidad** - Los especialistas pueden actualizarse de forma independiente

### Próximos pasos

- Implementa los ejercicios para reforzar el aprendizaje
- Prueba a construir sistemas multi-agente para tus propios casos de uso
- Explora patrones avanzados como el procesamiento en paralelo
- Considera cómo monitorizar y optimizar los sistemas multi-agente

---

**¿Quieres saber más?** Esto completa el módulo avanzado de orquestación multi-agente. ¡Ahora puedes aplicar estos patrones para construir sistemas de agentes sofisticados para cualquier dominio! 🚀

> 💡 Este contenido está basado en el taller más extenso disponible en [Bobchestrate Workshop](https://juseljuk.github.io/bobchestrate-workshop/). Si deseas explorar más ejercicios, temas avanzados o la versión extendida, ¡visita el enlace!
