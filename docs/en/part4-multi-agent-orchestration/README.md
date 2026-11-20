---
hide:
  - navigation
---

# Part 4: Multi-Agent Orchestration and Workflows

<p align="center">
  <img src="../../part4-multi-agent-orchestration/bobchestrate_part4.png" alt="Bobchestrate - Setup" width="700">
</p>

**Duration**: 30 minutes

**Difficulty**: Advanced

**Note**: This is a standalone advanced exercise that can be completed without having done the previous parts.

## Overview

In this lesson you will learn to build sophisticated multi-agent systems where specialized agents collaborate to solve complex tasks. You will create agent hierarchies, implement routing logic, and orchestrate workflows across multiple agents.

This part presents a complete **travel planning system** as an advanced example of multi-agent orchestration. Unlike the customer service system built in earlier parts, this is a self-contained exercise that demonstrates advanced patterns.

### What you will learn

- When and why to use multiple agents
- How to create specialized agents for specific domains
- How to build agent hierarchies (parent-child relationships)
- How to implement intelligent routing between agents
- How to manage context and handoffs
- Best practices for multi-agent systems

### What you will build

**Travel Planning System** with multiple specialized agents:

- **Travel Concierge** (parent) - Routes requests to the specialists
- **Flight Specialist** - Handles flight bookings
- **Hotel Specialist** - Handles accommodation
- **Activity Planner** - Suggests local activities
- **Budget Advisor** - Provides cost analysis

---

## Why multi-agent systems?

### Single agent vs. Multi-agent

**Single-agent approach:**
```
Customer Support Agent
├── 50+ tools
├── 10+ knowledge bases
├── Complex instructions (1000+ lines)
└── Handles everything
```

**Problems:**

- ❌ Overwhelming complexity
- ❌ Hard to maintain
- ❌ Poor performance on specialized tasks
- ❌ Hard to test and debug

**Multi-agent approach:**
```
Orchestrator Agent
├── Order Specialist (5 tools, focused instructions)
├── Billing Specialist (3 tools, focused instructions)
├── Technical Support (8 tools, focused instructions)
└── Escalation Handler (2 tools, focused instructions)
```

**Advantages:**

- ✅ Clear separation of concerns
- ✅ Easier to maintain and update
- ✅ Better performance on specialized tasks
- ✅ Simpler testing and debugging
- ✅ Specialists reusable across different systems

### When to use multi-agent systems

| Use Multi-Agent when... | Use a Single Agent when... |
|-------------------------|--------------------------|
| The domain has clearly distinct specializations | The task is simple and focused |
| Expert-level performance is needed | General knowledge is enough |
| The system will grow over time | Requirements are stable |
| Several teams manage different parts | A single team manages everything |
| You need to reuse specialists | The agent has a single purpose |

---

## Part 1: Understanding agent hierarchies

### Agent roles

**1. Orchestrator Agent (Parent)**

- Routes requests to the appropriate specialists
- Manages the overall conversation flow
- Synthesizes responses from multiple agents
- Handles general queries

**2. Specialist Agents (Children)**

- Deep expertise in a specific domain
- Focused tools and knowledge
- Clear, specific instructions
- Return control to the orchestrator when finished

### Routing strategies

**1. Description-based routing**
The orchestrator uses the agents' descriptions to decide the routing:

```yaml
# Orchestrator sees these descriptions
collaborators:
  - flight_specialist  # "Handles flight searches, bookings, and changes"
  - hotel_specialist   # "Manages hotel reservations and accommodations"
```

**2. Instruction-based routing**
Explicit routing logic in the orchestrator's instructions:

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

**3. Tool-based routing (Supervisor pattern)**
The orchestrator acts as a supervisor with no domain tools of its own, delegating to the specialists that do have the actual tools:

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

**Why this works:**

- The orchestrator recognizes it does not have the tools needed for the task
- It must delegate to a specialist agent that does have them
- This creates natural routing based on capability boundaries
- It prevents the orchestrator from trying to handle domain-specific tasks directly

---

## Part 2: Building the specialist agents

### Step 1: Create the flight specialist

[Download](../../part4-multi-agent-orchestration/flight_specialist_agent.yaml) the `flight_specialist_agent.yaml` example or ask Bob for it (see the example prompt below the YAML). **HINT**: you should ask Bob. He will create something better than the simple example 🤓 And it only costs around 0.3 bobcoins 🪙

```yaml
spec_version: v1
kind: native
name: flight_specialist
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
  - search_flights
  - book_flight
  - modify_flight
  - cancel_flight

llm: groq/openai/gpt-oss-120b
```

**💡 Ask Bob:**
```
Bob, create a flight_specialist_agent.yaml file with focused instructions
for handling flight bookings and searches.
```
When Bob is done, you will have a new agent file saved in your agents directory. Take a look at what Bob created for you. Pretty professional, right? With real guidelines and placeholders for the tools. We will create the tools a bit later.

### Step 2: Create the hotel specialist

[Download](../../part4-multi-agent-orchestration/hotel_specialist_agent.yaml) the `hotel_specialist_agent.yaml` example or ask Bob for it. By now you should have an idea of how to phrase the prompt for this agent 😉 You can try several times until you are happy with the result.

```yaml
spec_version: v1
kind: native
name: hotel_specialist
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
  - search_hotels
  - book_hotel
  - modify_hotel_booking
  - cancel_hotel_booking

llm: groq/openai/gpt-oss-120b
```

### Step 3: Create the activity planner

[Download](../../part4-multi-agent-orchestration/activity_planner_agent.yaml) the `activity_planner_agent.yaml` example or ask Bob for it.

```yaml
spec_version: v1
kind: native
name: activity_planner
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
  - search_activities
  - get_activity_details
  - search_restaurants
  - create_itinerary

llm: groq/openai/gpt-oss-120b
```

### Step 4: Create the budget advisor

[Download](../../part4-multi-agent-orchestration/budget_advisor_agent.yaml) the `budget_advisor_agent.yaml` example or ask Bob for it. HINT: have you ever thought of asking Bob for a prompt to create a specific type of agent? Just saying 😉

```yaml
spec_version: v1
kind: native
name: budget_advisor
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
  - calculate_trip_cost
  - compare_options
  - find_deals
  - budget_optimizer

llm: groq/openai/gpt-oss-120b
```

---

## Part 3: Creating the orchestrator agent

### Step 1: Design the orchestrator's instructions

The orchestrator needs clear routing logic:

[Download](../../part4-multi-agent-orchestration/travel_concierge_agent.yaml) the `travel_concierge_agent.yaml` example or ask Bob for it (see the example prompt below the YAML).

```yaml
spec_version: v1
kind: native
name: travel_concierge
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
  - flight_specialist
  - hotel_specialist
  - activity_planner
  - budget_advisor

llm: groq/openai/gpt-oss-120b
```

**💡 Ask Bob:**
```
Bob, create a travel_concierge_agent.yaml that orchestrates between
the four specialist agents with clear routing logic. The collaborators are flight_specialist, hotel_specialist, activity_planner, and budget_advisor. The agent should handle complex multi-aspect travel requests by routing to the appropriate specialist and synthesizing responses.
```
---


## Part 4: Implementing mock tools

For this workshop, we will create mock tools that imitate the specialists' capabilities. This lets us focus on the orchestration logic without needing to integrate with real APIs yet. This approach is ideal for rapid prototyping, demos, and testing.

### Create the flight tools

Create `flight_tools.py`, or ask Bob to do it (look at the example prompt under this code):

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def search_flights(
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
def book_flight(
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
def modify_flight(
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
def cancel_flight(confirmation_number: str) -> dict:
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

**💡 Ask Bob:**
```
Bob, create flight_tools.py with mock implementations of search_flights,
book_flight, modify_flight, and cancel_flight tools.
```

### Create the hotel tools

Create `hotel_tools.py`, or ask Bob to do it (look at the example prompt under this code):

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def search_hotels(
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
def book_hotel(
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
def modify_hotel_booking(
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
def cancel_hotel_booking(confirmation_number: str) -> dict:
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

**💡 Ask Bob:**
```
Bob, create hotel_tools.py with mock implementations of search_hotels,
book_hotel, modify_hotel_booking, and cancel_hotel_booking tools.
```

### Create the activity tools

Create `activity_tools.py` with the tools for the activity planner:

**💡 Ask Bob:**
```
Bob, create activity_tools.py with mock implementations of search_activities, get_activity_details, search_restaurants, and create_itinerary tools.
```

The file should include:

- `search_activities`: Searches for activities based on location and interests
- `get_activity_details`: Gets detailed information about specific activities
- `search_restaurants`: Searches for restaurants by cuisine type and price range
- `create_itinerary`: Generates day-by-day itineraries

### Create the budget tools

Create `budget_tools.py` with the tools for the budget advisor:

**💡 Ask Bob:**
```
Bob, create budget_tools.py with mock implementations of calculate_trip_cost,
compare_options, find_deals, and budget_optimizer tools.
```

The file should include:

- `calculate_trip_cost`: Calculates the total trip cost with a detailed breakdown
- `compare_options`: Compares two travel options and provides recommendations
- `find_deals`: Finds current deals and discounts
- `budget_optimizer`: Optimizes budget distribution across categories

---
## Part 4.5: Naming convention for the shared environment

**⚠️ IMPORTANT: Workshop naming requirements** - **YOU CAN IGNORE THIS IF YOU ARE NOT USING THE SHARED WXO ENVIRONMENT**

Since all workshop participants share the same watsonx Orchestrate environment, you **must** add your initials as a suffix to the names of all tools and agents to avoid conflicts.

### Naming pattern

Use this pattern for all your tools and agents:

- **Tools**: `tool_name_XX` (where XX are your initials)
- **Agent YAML file names**: `agent_name_XX.yaml` (use underscores in the file name too)
- **Agent name field**: `agent_name_XX` (use underscores, not dashes)

### Example

If your name is **Jane Smith** (initials: JS), rename your tools and agents as follows:

**Tools:**
```python
# In flight_tools.py
@tool
def search_flights_JS(...):  # Added _JS postfix
    """Search for available flights."""
    ...

@tool
def book_flight_JS(...):  # Added _JS postfix
    """Book a flight."""
    ...
```

**Agent files:**
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

**⚠️ Critical naming rule:**

- The YAML **file name** also uses underscores: `flight_specialist_agent_JS.yaml`
- The agent's **name field** must use underscores (same as the file): `name: flight_specialist_JS`
- This is a watsonx Orchestrate requirement for the agent to be registered correctly

### Complete naming checklist

Before importing, make sure you have renamed:

**✅ Tool files:**

- [ ] All `@tool` function names in `flight_tools.py`
- [ ] All `@tool` function names in `hotel_tools.py`
- [ ] All `@tool` function names in `activity_tools.py`
- [ ] All `@tool` function names in `budget_tools.py`

**✅ Agent files:**

- [ ] Agent `name` field in `flight_specialist_agent.yaml`
- [ ] Tool references in the `tools` section
- [ ] Agent `name` field in `hotel_specialist_agent.yaml`
- [ ] Tool references in the `tools` section
- [ ] Agent `name` field in `activity_planner_agent.yaml`
- [ ] Tool references in the `tools` section
- [ ] Agent `name` field in `budget_advisor_agent.yaml`
- [ ] Tool references in the `tools` section
- [ ] Agent `name` field in `travel_concierge_agent.yaml`
- [ ] Collaborator agent names in the `collaborators` section

**💡 Ask Bob:**
```
Bob, add a postfix "_<your_initials>" to all tool function names in flight_tools.py, hotel_tools.py, activity_tools.py, and budget_tools.py. Then update all agent YAML files to use the renamed tools (activity planner to use activity tools, flifgt specialist to use flight tools, etc.) and add "_<your_initials>" postfix to agent name fields within their yaml-files.
```
>**NOTE**: Remember to update your initials in the prompt placeholders before sending it to Bob 😉

### Why this matters

Without unique names:

- ❌ Your tools will overwrite other participants' tools
- ❌ Your agents will conflict with others'
- ❌ Tests will produce unpredictable results
- ❌ You might accidentally use someone else's implementation

With unique names:

- ✅ Your tools and agents are isolated
- ✅ You can test independently
- ✅ No conflicts with other participants
- ✅ Clear ownership of your implementations

---

## Part 4: Testing multi-agent workflows

### Import all agents and tools

```bash
# Import all tools
orchestrate tools import -k python -f tools/flight_tools.py
orchestrate tools import -k python -f tools/hotel_tools.py
orchestrate tools import -k python -f tools/activity_tools.py
orchestrate tools import -k python -f tools/budget_tools.py

# Import specialist agents
orchestrate agents import -f agents/flight_specialist_agent.yaml
orchestrate agents import -f agents/hotel_specialist_agent.yaml
orchestrate agents import -f agents/activity_planner_agent.yaml
orchestrate agents import -f agents/budget_advisor_agent.yaml

# Import orchestrator (must be last, after collaborators exist)
orchestrate agents import -f agents/travel_concierge_agent.yaml
```
**💡 Ask Bob:**
```
Bob, create a shell script that imports all agents (flight specialist, hotel specialist, activty planner, budget advisor and finally tra) and their tools in the correct order. Make sure each agent is imported after its collaborators.
```
>**NOTE**: Check the tool and agent import syntax that Bob uses in the generated script. Although the information about the correct syntax is available in the custom development rule we are using, Bob may sometimes not consult it before creating things.

### Testing simple routing

**Test 1: Single specialist**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Find me flights from New York to London for next week"
```

Expected flow:

1. The Concierge receives the request
2. Routes to the flight_specialist
3. The flight specialist searches for flights
4. Returns the results to the user

**Test 2: Multiple specialists**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "Plan a 5-day trip to Paris including flights and hotels"
```

Expected flow:

1. The Concierge receives the request
2. Routes to the flight_specialist for flights
3. Routes to the hotel_specialist for hotels
4. Synthesizes the complete plan
5. Returns the result to the user

### Testing complex workflows

**Test 3: Full trip planning**
```bash
orchestrate chat ask --agent-name travel_concierge_agent_<your_initials> \
  "I want to visit Tokyo for a week. I have a budget of $3000. Help me plan everything including flights, hotel, and activities."
```

Expected flow:

1. The Concierge breaks down the request
2. Routes to the flight_specialist
3. Routes to the hotel_specialist
4. Routes to the activity_planner
5. Routes to the budget_advisor
6. Synthesizes the complete itinerary
7. Returns the full plan

---


## Part 6: Best practices

### 1. Agent design

**Keep specialists focused:**
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

**Clear descriptions:**
```yaml
# ✅ Good - Clear, specific description with collaborators
description: Expert in flight searches, bookings, changes, and cancellations.
  Handles all flight-related queries including availability, pricing, and
  itinerary modifications. Works with hotel_specialist and activity_planner
  for complete travel planning.

# ❌ Bad - Vague description
description: Helps with travel stuff
```

**NOTE:** Include mentions of collaborator agents in the descriptions to help the orchestrator understand the relationships between agents and the routing options.

### 2. Routing logic

**Explicit routing instructions:**
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

**Handle edge cases:**
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

### 3. Context management

**Pass relevant context:**
```yaml
instructions: |
  When routing to specialist:
  - Include all relevant details from conversation
  - Mention previous specialist interactions if relevant
  - Provide user preferences and constraints
```

**Synthesize responses:**
```yaml
instructions: |
  After receiving specialist response:
  - Summarize key points
  - Connect to user's original request
  - Suggest logical next steps
  - Maintain conversation flow
```

### 4. Error handling

**Fail gracefully:**
```yaml
instructions: |
  If specialist returns error:
  - Explain issue to user clearly
  - Suggest alternatives
  - Offer to try different approach
  - Don't expose technical details
```

**Timeout handling:**
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

**Input validation:**
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

**Logging and debugging:**
```yaml
instructions: |
  For debugging multi-agent workflows:
  - Log routing decisions and reasons
  - Track which specialist handled each request
  - Record context passed between agents
  - Note any errors or fallbacks used
  
  This helps identify issues in routing logic and specialist performance.
```

### 5. Optimizing agent performance

**Agent architecture:**
```yaml
# ✅ Good - Flat hierarchy with focused specialists
User → Orchestrator → Specialist → User

# ❌ Bad - Unnecessary intermediate layers
User → Orchestrator → Coordinator → Specialist → Coordinator → Orchestrator → User

# Keep your agent hierarchy simple. The LLM handles routing based on descriptions,
# so additional coordinator layers just add latency without improving routing.
```

**Clear agent descriptions:**
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

**Explicit routing instructions:**
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

**Tool design for specialists:**
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

**Reasoning efficiency (for GPT-OSS-120B):**
```yaml
instructions: |
  # Limit reasoning depth to improve response time
  
  Reasoning and brevity controls:
  - Use concise reasoning with at most 3 reasoning steps
  - Do not re-plan unless the last tool result contradicts prior assumptions
  - If you cannot progress after 3 steps, ask one focused question
  
  # This prevents excessive internal reasoning loops
```

**What you CANNOT control:**

- **Automatic routing:** The LLM decides which specialist to invoke based on descriptions → for more deterministic behavior, consider agentic workflows
- **Parallel processing:** Currently, agent calls are sequential (one at a time)
- **Routing algorithm:** The internal orchestration logic of watsonx Orchestrate
- **Response time:** Inherent to the LLM and tool execution time

**Best practices:**

1. **Keep hierarchies flat** - Minimize agent layers
2. **Write clear descriptions** - Help the LLM route correctly
3. **Use explicit instructions** - Guide routing decisions
4. **Limit tools per agent** - Keep specialists focused (≤10 tools)
5. **Design independent specialists** - Avoid dependencies between agents
6. **Test routing behavior** - Verify the LLM routes as expected

### 6. Testing strategies

Testing in multi-agent systems involves three levels: testing the specialists individually, testing the routing logic, and testing complete workflows.

**Understanding `assert` in Python tests**

Before looking at the examples, let's understand the `assert` statement:

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

**Why use `assert`?**

- Automatically checks whether your agent works correctly
- Fails immediately when something goes wrong
- Makes it easy to run hundreds of tests automatically
- Helps catch errors before users see them

Now let's see how we use `assert` to test our multi-agent system:

---

**Level 1: Unit tests of individual specialists**

Purpose: Verify that each specialist agent works correctly in isolation, independently of the orchestrator.

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

**Why unit test the specialists?**

- Verify that each specialist's tools work correctly
- Test the specialist's response format
- Ensure the specialist handles errors gracefully
- Faster than testing through the orchestrator
- Easier to debug when problems arise

**Level 2: Routing integration tests**

Purpose: Verify that the orchestrator correctly routes requests to the right specialists.

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

**Why do routing integration tests?**

- Verify that the orchestrator's descriptions and instructions work
- Ensure the LLM routes to the right specialists
- Test edge cases and ambiguous queries
- Validate workflows involving multiple specialists

**Level 3: End-to-end workflow tests**

Purpose: Test complete user journeys involving multiple specialists and conversation turns.

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

**Why do end-to-end tests?**

- Verify that complete user journeys work
- Test context retention across turns
- Ensure the specialists work together correctly
- Validate real usage patterns

**Testing best practices:**

1. **Start with unit tests** - Test the specialists individually first
2. **Use mock tools** - Avoid external API calls in tests for speed and reliability
3. **Test routing explicitly** - Verify the orchestrator routes to the right specialists
4. **Test conversation context** - Ensure information persists across turns
5. **Test error scenarios** - Invalid inputs, missing data, tool failures
6. **Use realistic queries** - Test with real user language, not just technical terms
7. **Automate tests** - Run the tests on every code change
8. **Test incrementally** - Add tests as you add specialists

**Example test structure:**
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

## Part 7: Advanced patterns

### Pattern 1: Sequential workflow

```yaml
instructions: |
  For trip planning:
  1. Get flights first (determines dates)
  2. Get hotels second (based on flight dates)
  3. Get activities third (based on location and dates)
  4. Get budget analysis last (based on all selections)
```

### Pattern 2: Conditional routing

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

### Pattern 3: Iterative refinement

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

### Pattern 4: Fallback chain

```yaml
instructions: |
  If primary specialist cannot help:
  1. Try secondary specialist
  2. If still cannot help, try general knowledge
  3. If still cannot help, escalate or admit limitation
```

---

## Exercises

### Exercise 1: Add a new specialist (Easy)

Add a "Car Rental Specialist" to the travel system.

**Requirements:**

- Create `car_rental_specialist_agent.yaml`
- Create `car_rental_tools.py` with search and booking functions
- Update `travel_concierge` to include the new specialist
- Test routing to the car rental specialist

**💡 Ask Bob:**
```
Bob, create a car_rental_specialist agent with tools for searching
and booking rental cars, and update the travel_concierge to route
car rental queries appropriately.
```

### Exercise 2: Implement the budget-first flow (Medium)

Modify the orchestrator so it always checks the budget first on trip planning requests.

**Requirements:**

- Update the `travel_concierge` instructions
- Route to `budget_advisor` before the other specialists
- Use the budget constraints when routing to other specialists
- Test with requests that have budget constraints

### Exercise 3: Create a system for a different domain (Advanced)

Build a multi-agent system for a different domain (for example, e-commerce, healthcare, education).

**Requirements:**

- Design 3-4 specialist agents
- Create an orchestrator with routing logic
- Implement mock tools
- Test the complete workflows

**Example domains:**

- **E-commerce**: Product Search, Inventory, Checkout, Support
- **Healthcare**: Appointments, Prescriptions, Billing, Records
- **Education**: Course Search, Enrollment, Assignments, Grades

---

## Common issues

### Issue: The orchestrator doesn't route

**Symptoms**: The orchestrator tries to answer directly instead of routing

**Solutions:**

1. Make the specialists' descriptions more specific
2. Add explicit routing rules to the orchestrator's instructions
3. Make sure the collaborators are correctly listed
4. Verify that the specialist agents exist and are imported

### Issue: Context is lost between agents

**Symptoms**: The specialist has no information from the previous conversation

**Solutions:**

1. Update the orchestrator to pass context explicitly
2. Include relevant details when routing
3. Have the orchestrator summarize previous interactions

### Issue: Circular routing

**Symptoms**: Agents keep routing to each other indefinitely

**Solutions:**

1. Add clear termination conditions
2. Limit routing depth
3. Have specialists indicate when they are done
4. The orchestrator should synthesize, not re-route

---

## Summary

In this lesson you learned:

✅ When and why to use multi-agent systems  
✅ How to design focused specialist agents  
✅ How to create orchestrator agents with routing logic  
✅ How to manage context and handoffs  
✅ Best practices for multi-agent architectures  
✅ Common patterns and anti-patterns  

### Key takeaways

1. **Separation of concerns** - Each agent has a clear, focused purpose
2. **Clear routing** - The orchestrator has explicit logic for routing decisions
3. **Context management** - Information flows smoothly between agents
4. **Graceful degradation** - The system handles errors and edge cases properly
5. **Maintainability** - Specialists can be updated independently

### Next steps

- Complete the exercises to reinforce your learning
- Try building multi-agent systems for your own use cases
- Explore advanced patterns such as parallel processing
- Consider how to monitor and optimize multi-agent systems

---

**Want to learn more?** This completes the advanced multi-agent orchestration module. You can now apply these patterns to build sophisticated agent systems for any domain! 🚀

> 💡 This content is based on the more extensive workshop available at [Bobchestrate Workshop](https://juseljuk.github.io/bobchestrate-workshop/). If you want to explore more exercises, advanced topics, or the extended version, visit the link!
