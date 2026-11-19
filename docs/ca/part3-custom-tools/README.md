---
hide:
  - navigation
---

# Part 3: Afegir Eines Personalitzades

<p align="center">
  <img src="../../part3-custom-tools/bobchestrate_part3.png" alt="Bobchestrate - Custom Tools" width="700">
</p>

**Durada:** 30 minuts

**Objectiu:** Crear eines personalitzades en Python perquè els teus agents puguin dur a terme accions

## Què aprendràs

- Com crear eines Python per a watsonx Orchestrate
- L'estructura de les eines i les bones pràctiques
- Com connectar eines als agents
- Com utilitzar Bob per generar i depurar eines

## Per què eines personalitzades?

Les eines amplien les capacitats del teu agent més enllà de la conversa. Permeten als agents:

- 🔍 Consultar bases de dades i APIs
- 📊 Processar i analitzar dades
- 📝 Crear i modificar fitxers
- 🔧 Realitzar càlculs i transformacions
- 🌐 Integrar-se amb sistemes externs

## Estructura d'una eina

Una eina Python de watsonx Orchestrate té aquesta estructura:

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def my_tool(param1: str) -> dict:
    """Tool description that helps the agent understand when to use it.
    
    Args:
        param1 (str): What this parameter is for
        
    Returns:
        dict: The result of the tool execution
    """
    # Your code here
    return {
        "result": "success",
        "data": "your result"
    }
```

**Alternativa: utilitzar el paràmetre description del decorador:**

```python
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool(
    name="my_custom_tool",
    description="Tool description that helps the agent understand when to use it"
)
def my_tool(param1: str) -> dict:
    """
    Args:
        param1 (str): What this parameter is for
        
    Returns:
        dict: The result of the tool execution
    """
    # Your code here
    return {
        "result": "success",
        "data": "your result"
    }
```

**Punts clau:**

- Utilitza el decorador `@tool` per definir eines
- El nom de l'eina és per defecte el nom de la funció (o s'especifica amb `@tool(name="custom_name")`)
- La descripció es pot proporcionar de dues maneres:
  - **Mitjançant el docstring** (recomanat): s'extreu del docstring de la funció
  - **Mitjançant un paràmetre del decorador**: es passa directament al decorador com `@tool(description="Your description here")`
- Els tipus i les descripcions dels paràmetres provenen de les anotacions de tipus i de la secció Args del docstring
- Si utilitzes el docstring, has de fer servir docstrings d'estil Google per documentar bé els paràmetres
- El decorador `@tool` també accepta altres paràmetres opcionals, com ara `expect_credentials`, per a eines que requereixen autenticació

> 📖 **Referència:** Per veure tots els detalls del decorador `@tool` i els seus paràmetres, consulta la documentació [Authoring Python-Based Tools](https://developer.watson-orchestrate.ibm.com/tools/create_tool#authoring-python-based-tools).

## Pas 1: Crear una eina d'estat de comanda

Crearem una eina que consulti l'estat d'una comanda (simulada per a aquest taller).

### Pregunta-li a Bob:
```
Bob, create a Python tool for watsonx Orchestrate that checks order status. It should take an order_id parameter and return mock order information including status, items, and delivery date.
```

O crea-la manualment:

```python
# order_status_tool.py
from ibm_watsonx_orchestrate.agent_builder.tools import tool
from datetime import datetime, timedelta
import random

@tool
def check_order_status(order_id: str) -> dict:
    """
    Retrieves the current status and details of a customer order by order ID.
    Use this when customers ask about their order status, delivery date, or order details.
    
    Args:
        order_id (str): The unique order identifier (e.g., ORD-12345)
        
    Returns:
        dict: Dictionary with order details including status, items, dates, and tracking
    """
    # Validate order ID format
    if not order_id.startswith("ORD-"):
        return {
            "success": False,
            "error": "Invalid order ID format. Must start with 'ORD-'"
        }
    
    # Simulate order lookup
    statuses = ["Processing", "Shipped", "Out for Delivery", "Delivered"]
    status = random.choice(statuses)
    
    # Generate mock order data
    order_date = datetime.now() - timedelta(days=random.randint(1, 10))
    delivery_date = order_date + timedelta(days=random.randint(3, 7))
    
    items = [
        {"name": "Laptop", "quantity": 1, "price": 999.99},
        {"name": "Mouse", "quantity": 1, "price": 29.99},
        {"name": "Keyboard", "quantity": 1, "price": 79.99}
    ]
    
    total = sum(item["price"] * item["quantity"] for item in items)
    
    return {
        "success": True,
        "order_id": order_id,
        "status": status,
        "order_date": order_date.strftime("%Y-%m-%d"),
        "estimated_delivery": delivery_date.strftime("%Y-%m-%d"),
        "items": items,
        "total": f"${total:.2f}",
        "tracking_number": f"TRK{random.randint(100000, 999999)}"
    }
```

## Pas 2: Crear una eina de processament de reemborsaments

Ara crearem una eina que processi sol·licituds de reemborsament.

### Pregunta-li a Bob:
```
Bob, create a Python tool that processes refund requests. It should take order_id, reason, and amount parameters, validate them, and return a refund confirmation.
```
Un exemple del que Bob podria generar:
```python
# refund_tool.py
from ibm_watsonx_orchestrate.agent_builder.tools import tool
from datetime import datetime
import random

@tool
def process_refund(order_id: str, reason: str, amount: float) -> dict:
    """
    Processes a refund request for a customer order.
    Use this when customers request refunds or returns.
    
    Args:
        order_id (str): The order ID to refund (format: ORD-XXXXX)
        reason (str): Reason for the refund request (must be at least 10 characters)
        amount (float): Refund amount in dollars (must be positive and under $10,000)
        
    Returns:
        dict: Refund confirmation details including refund ID, status, and processing time
    """
    # Validation
    if not order_id.startswith("ORD-"):
        return {
            "success": False,
            "error": "Invalid order ID format"
        }
    
    if amount <= 0:
        return {
            "success": False,
            "error": "Refund amount must be greater than 0"
        }
    
    if amount > 10000:
        return {
            "success": False,
            "error": "Refund amount exceeds maximum. Please contact manager.",
            "requires_approval": True
        }
    
    if not reason or len(reason) < 10:
        return {
            "success": False,
            "error": "Please provide a detailed reason (at least 10 characters)"
        }
    
    # Process refund (simulated)
    refund_id = f"REF-{random.randint(10000, 99999)}"
    processing_time = "3-5 business days"
    
    return {
        "success": True,
        "refund_id": refund_id,
        "order_id": order_id,
        "amount": f"${amount:.2f}",
        "reason": reason,
        "status": "Approved",
        "processing_time": processing_time,
        "refund_method": "Original payment method",
        "confirmation_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
```

>NOTA: És possible que Bob creï també proves per a les eines i una mica de documentació relacionada. Si és així, pots explorar aquests fitxers també.

## Pas 3: Importar les teves eines

#### ❗️ IMPORTANT ❗️ ####
> Com que els participants del taller faran servir el mateix entorn de watsonx Orchestrate, REANOMENA els _noms de les teves eines_ (noms de les funcions) dins dels fitxers Python afegint les teves inicials com a sufix. RECORDA desar els canvis!
>
> Per exemple, `def check_order_status` passa a ser `def check_order_status_JKJ`. Assegura't de fer servir el mateix sufix a totes les teves eines.

<img src="../../part3-custom-tools/images/image-1.png" alt="" width="450px">

⬇︎

<img src="../../part3-custom-tools/images/image.png" alt="" width="480px">

Fixa't que, ara que Bob utilitza la regla personalitzada de desenvolupament per a wxO, les eines es desen al directori _**tools**_.

Importa les eines a watsonx Orchestrate:

```bash
orchestrate tools import -k python -f tools/check_order_status.py
orchestrate tools import -k python -f tools/process_refund.py
```

>NOTA: Els noms dels fitxers Python generats per Bob poden ser diferents dels que es mostren aquí. Fes servir els noms de fitxer tal com Bob els ha creat.

💡 O demana-li a Bob que ho faci per tu:

```bash
Import the created tools to my active wxO environment
```


Si veus missatges [WARNING], no passa res. Els causa un error de Langchain en analitzar els docstrings.

Verifica que s'han importat:
```
orchestrate tools list | grep -E "<your_initials>", for example: orchestrate tools list | grep -E "JKJ"
```

A Windows, fes servir aquesta ordre:
```
orchestrate tools list | findstr "<your_initials>"
```

Hauries de veure les teves eines a la llista!

## Pas 4: Crear un agent d'atenció al client amb eines

Ara crea un agent que utilitzi aquestes eines. Pots fer servir la definició de sota; també l'ha creat Bob.

1. Crea un nou fitxer `customer_support_agent.yaml` al directori `agents` del teu espai de treball. Bob hauria d'haver creat aquest directori en crear les eines. Si no existeix, crea'l manualment.
2. Copia el contingut de sota al fitxer i desa'l.


També pots crear la teva pròpia definició d'agent si ho prefereixes.

#### ❗️ IMPORTANT ❗️ ####
> Assegura't de canviar els noms de les eines a la definició de l'agent perquè coincideixin amb els noms de les eines que has importat! I afegeix també les teves inicials com a sufix al nom de l'agent!

```yaml
# customer_support_agent.yaml
spec_version: v1
kind: native
name: customer_support_agent_<your_initials_here>
description: A customer support agent that can check orders and process refunds

instructions: |
  You are a helpful customer support agent for an e-commerce company.
  
  Your capabilities:
  - Check order status using the check_order_status tool
  - Process refund requests using the process_refund tool
  - Answer general customer service questions
  
  When a customer asks about their order:
  1. Ask for their order ID if they haven't provided it
  2. Use the check_order_status tool to get order details
  3. Present the information clearly and helpfully
  
  When processing refunds:
  1. Confirm the order ID
  2. Ask for the reason if not provided
  3. Confirm the refund amount
  4. Use the process_refund tool to process the request
  5. Provide the refund confirmation details
  
  Always be professional, empathetic, and helpful. If you encounter errors,
  explain them clearly and offer alternatives.

llm: groq/openai/gpt-oss-120b

# Specify which tools this agent can use
tools:
  - check_order_status_<your_initials_here>
  - process_refund_<your_initials_here>

```

Importa l'agent:
```bash
orchestrate agents import -f agents/customer_support_agent.yaml
```

## Pas 5: Provar el teu agent amb eines

Prova l'agent:

```bash
orchestrate chat ask -n customer_support_agent_<your_initials_here>
```

Prova aquests escenaris:

**Escenari 1: Consultar l'estat d'una comanda**
```
User: Can you check the status of order ORD-12345?
```

L'agent hauria de cridar l'eina `check_order_status` i presentar els resultats.

**Escenari 2: Processar un reemborsament**
```
User: I need to request a refund for order ORD-12345
Agent: [asks for reason]
User: The product arrived damaged
Agent: [provides you with the refund amount / asks for confirmation]
User: $99.99
```

L'agent hauria de cridar l'eina `process_refund` i proporcionar la confirmació.

**Escenari 3: Gestió d'errors**
```
User: Check order status for ABC123
```

L'agent hauria de gestionar amb elegància l'ID de comanda no vàlid.

## Pas 6: Depurar problemes amb les eines

Si les teves eines no funcionen, demana ajuda a Bob:

```
Bob, my agent isn't calling the check_order_status tool. Here's the agent YAML and tool code: [paste code]
```

Problemes freqüents:<br>
- El nom de l'eina no coincideix entre el YAML de l'agent i la definició de l'eina<br>
- Descripcions de paràmetres absents o incorrectes<br>
- L'eina no s'ha importat correctament<br>
- Les instruccions de l'agent no mencionen quan utilitzar l'eina

## 🎙️ Extra: Demana al professor que et mostri l'agent de veu!

Has acabat la Part 3? Abans de passar a la part següent, **aixeca la mà i demana al teu professor que t'ensenyi l'agent de veu**. Veuràs com un agent de watsonx Orchestrate pot mantenir una conversa parlada, utilitzant eines com les que acabes de crear.

## Bones pràctiques per a eines

### ✅ FES:
- Fes servir noms d'eina clars i descriptius
- Escriu descripcions detallades dels paràmetres
- Inclou validació d'entrades
- Retorna respostes estructurades i coherents
- Gestiona els errors amb elegància
- Afegeix missatges d'error útils

### ❌ NO FACIS:
- Fer servir descripcions d'eina vagues
- Ometre la validació de paràmetres
- Retornar formats de resposta inconsistents
- Ignorar els casos d'error
- Fer que les eines facin massa coses (mantén-les enfocades)

## Avançat: Eines amb APIs externes

Les eines poden cridar APIs reals. Aquí tens un exemple d'estructura:

```python
import requests
from ibm_watsonx_orchestrate.agent_builder.tools import PythonTool

class WeatherTool(PythonTool):
    """Get weather information"""
    
    def __init__(self):
        super().__init__(
            name="get_weather",
            description="Get current weather for a city",
            parameters={
                "city": {
                    "type": "string",
                    "description": "City name",
                    "required": True
                }
            },
            # Specify credentials needed
            expect_credentials={
                "api_key": "Weather API key"
            }
        )
    
    def run(self, city: str, credentials: dict = None) -> dict:
        """Get weather data"""
        api_key = credentials.get("api_key") if credentials else None
        
        if not api_key:
            return {"error": "API key not configured"}
        
        # Call external API
        response = requests.get(
            f"https://api.weather.com/v1/current",
            params={"city": city, "key": api_key}
        )
        
        return response.json()
```

## Punts clau

✅ Les eines amplien les capacitats dels agents amb lògica personalitzada
✅ Les eines tenen noms clars, descripcions i paràmetres
✅ Els agents han de llistar les eines que poden utilitzar en la seva especificació YAML
✅ Les eines han de validar entrades i gestionar errors
✅ Bob et pot ajudar a generar, depurar i millorar eines

## Propers passos

Ara que el teu agent té eines, és el moment de combinar diversos agents en un sistema multiagent!

Continua amb [Part 4: Orquestració multiagent](../../part4-multi-agent-orchestration/README.md) →

## Recursos addicionals

- [Guia d'eines en Python](https://developer.watson-orchestrate.ibm.com/tools/create_tool)
- [Gestió d'eines](https://developer.watson-orchestrate.ibm.com/tools/manage_tool)
- [Associar connexions a eines Python](https://developer.watson-orchestrate.ibm.com/connections/associate_connection_to_tool/python_connections)

---

**💡 Consell professional:** Utilitza Bob per generar plantilles d'eines i després personalitza-les segons les teves necessitats.
