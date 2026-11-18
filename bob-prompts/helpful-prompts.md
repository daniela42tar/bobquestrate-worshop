---
hide:
  - navigation
---

# Prompts útiles de Bob para el desarrollo con watsonx Orchestrate

<p align="center">
  <img src="../bobchestrate_helpful_prompts.png" alt="Bobchestrate - Prompts útiles" width="700">
</p>

Esta guía contiene prompts útiles para ayudarte a trabajar con Bob durante el taller y más allá.

## Desarrollo general de agentes

### Comprender los conceptos
```
Bob, explain what watsonx Orchestrate agents are and how they differ from regular chatbots
```

```
Bob, what are the key components of a watsonx Orchestrate agent?
```

```
Bob, explain the difference between native, external, and assistant agents
```

### Primeros pasos
```
Bob, help me set up my watsonx Orchestrate development environment
```

```
Bob, show me how to verify my watsonx Orchestrate connection is working
```

```
Bob, what's the basic structure of an agent YAML file?
```

## Crear agentes

### Creación básica de agentes
```
Bob, create a YAML file for a customer service agent that can help with orders and refunds
```

```
Bob, create an agent that acts as a Python programming tutor
```

```
Bob, build an agent specification for a travel booking assistant
```

### Mejorar las instrucciones de los agentes
```
Bob, review these agent instructions and suggest improvements: [paste instructions]
```

```
Bob, make these agent instructions more specific and actionable: [paste instructions]
```

```
Bob, add error handling guidance to these agent instructions: [paste instructions]
```

### Configuración del agente
```
Bob, explain what the 'hide_reasoning' configuration option does
```

```
Bob, help me choose the right LLM model for my agent
```

```
Bob, what's the difference between agent styles (default, react, planner)?
```

## Construir herramientas

### Creación de herramientas
```
Bob, create a Python tool that checks order status given an order ID
```

```
Bob, build a tool that validates email addresses and returns detailed feedback
```

```
Bob, create a tool that calls the OpenWeather API to get current weather
```

### Mejora de herramientas
```
Bob, add input validation to this tool: [paste tool code]
```

```
Bob, improve the error handling in this tool: [paste tool code]
```

```
Bob, add type hints and better documentation to this tool: [paste tool code]
```

### Depuración de herramientas
```
Bob, why isn't my agent calling this tool? Here's the agent YAML and tool code: [paste both]
```

```
Bob, this tool is returning an error. Can you help debug it? [paste error and code]
```

```
Bob, review this tool for potential issues: [paste tool code]
```

## Trabajar con bases de conocimiento

### Configuración de bases de conocimiento
```
Bob, create a knowledge base YAML file for FAQ documents
```

```
Bob, help me structure my knowledge base for best retrieval performance
```

```
Bob, explain how to connect a knowledge base to my agent
```

### Optimización de bases de conocimiento
```
Bob, how should I format my documents for optimal knowledge base performance?
```

```
Bob, what's the best way to organize multiple knowledge bases?
```

## Colaboración entre agentes

### Crear agentes colaboradores
```
Bob, create a specialized escalation agent that handles complex customer issues
```

```
Bob, build a technical support agent that can collaborate with a billing agent
```

```
Bob, design an agent hierarchy for a customer service system
```

### Enrutamiento y delegación
```
Bob, improve the routing logic in these agent instructions: [paste instructions]
```

```
Bob, help me decide when my agent should delegate to a collaborator
```

## Pruebas y depuración

### Generación de casos de prueba
```
Bob, generate test cases for this customer support agent
```

```
Bob, create a test script that validates my order status tool
```

```
Bob, write test scenarios that cover edge cases for my refund tool
```

### Depuración
```
Bob, my agent isn't responding correctly. Here's the conversation: [paste conversation]
```

```
Bob, analyze this error message and suggest a fix: [paste error]
```

```
Bob, why is my agent calling the wrong tool? [paste agent YAML and conversation]
```

### Optimización del rendimiento
```
Bob, how can I make my agent respond faster?
```

```
Bob, review my agent's instructions for efficiency: [paste instructions]
```

```
Bob, suggest ways to reduce token usage in my agent
```

## Integración y despliegue

### Integración de API
```
Bob, create a tool that calls this REST API: [paste API documentation]
```

```
Bob, add authentication to this API tool: [paste tool code]
```

```
Bob, help me handle rate limiting in this API tool: [paste tool code]
```

### Despliegue
```
Bob, create a deployment checklist for my agent
```

```
Bob, help me test my agent before deploying to production
```

```
Bob, generate webchat embed code for my agent
```

## Revisión de código y refactorización

### Revisión de código
```
Bob, review this agent YAML for best practices: [paste YAML]
```

```
Bob, check this tool for security issues: [paste tool code]
```

```
Bob, review my entire agent setup and suggest improvements: [paste all files]
```

### Refactorización
```
Bob, refactor this tool to be more modular: [paste tool code]
```

```
Bob, split this complex agent into multiple specialized agents: [paste agent YAML]
```

```
Bob, improve the code organization in my tool: [paste tool code]
```

## Documentación

### Generar documentación
```
Bob, create documentation for this tool: [paste tool code]
```

```
Bob, write a README for my agent project
```

```
Bob, generate API documentation for my custom tools
```

### Guías de usuario
```
Bob, create a user guide for interacting with my customer service agent
```

```
Bob, write instructions for deploying this agent
```

## Temas avanzados

### Flujos de trabajo personalizados
```
Bob, design a multi-step workflow using agent collaborators
```

```
Bob, create a planner-style agent with structured output
```

```
Bob, build an agent that uses chain-of-thought reasoning
```

### Servidores MCP
```
Bob, help me create an MCP server for my custom tools
```

```
Bob, explain how to connect an MCP server to watsonx Orchestrate
```

### Configuración de modelos
```
Bob, create a custom model configuration for Azure OpenAI
```

```
Bob, set up a model policy with fallback models
```

## Resolución de problemas habituales

### Problemas de conexión
```
Bob, I'm getting a connection refused error. How do I fix it?
```

```
Bob, my API key isn't working. What should I check?
```

### El agente no responde
```
Bob, my agent isn't responding to user messages. Help me debug this.
```

```
Bob, the agent is giving generic responses instead of using tools. Why?
```

### Problemas con las herramientas
```
Bob, my tool isn't being imported. What could be wrong?
```

```
Bob, the agent sees my tool but never calls it. How do I fix this?
```

### Problemas de rendimiento
```
Bob, my agent is slow. How can I improve response time?
```

```
Bob, I'm hitting rate limits. What's the best approach?
```

## Buenas prácticas

### Pide a Bob las buenas prácticas
```
Bob, what are the best practices for writing agent instructions?
```

```
Bob, how should I structure my tools for maintainability?
```

```
Bob, what's the recommended way to handle errors in agents?
```

```
Bob, how do I make my agents more reliable in production?
```

## Aprendizaje y exploración

### Explorar funcionalidades
```
Bob, what are some advanced features of watsonx Orchestrate I should know about?
```

```
Bob, show me examples of creative ways to use agent collaborators
```

```
Bob, what are some real-world use cases for watsonx Orchestrate agents?
```

### Mantenerse al día
```
Bob, what's new in the latest version of watsonx Orchestrate?
```

```
Bob, are there any deprecated features I should be aware of?
```

## Consejos para prompts eficaces con Bob

### ✅ HAZ:
- **Sé específico**: Incluye código relevante, mensajes de error o contexto
- **Indica tu objetivo**: Explica qué intentas conseguir
- **Proporciona ejemplos**: Muestra lo que has probado o lo que quieres
- **Haz preguntas de seguimiento**: Profundiza en las respuestas de Bob con preguntas aclaratorias
- **Pide explicaciones**: Pide a Bob que explique el razonamiento detrás de sus sugerencias

### ❌ NO HAGAS:
- **Ser vago**: "Bob, fix this" sin contexto
- **Omitir el contexto**: No proporcionar el código o la configuración relevantes
- **Esperar que Bob adivine**: Bob necesita información sobre tu situación concreta
- **Ignorar las sugerencias**: Las recomendaciones de Bob se basan en buenas prácticas
- **Hacer varias preguntas no relacionadas**: Céntrate en un solo tema cada vez

## Ejemplo de flujo de conversación

Este es un ejemplo de una conversación eficaz con Bob:

```
You: Bob, I need to create a customer support agent that can check order status and process refunds.

Bob: [Provides initial agent structure]

You: Thanks! Can you also add a tool that checks order status? It should take an order ID and return the status, items, and delivery date.

Bob: [Creates order status tool]

You: Great! Now I'm getting an error when I import the tool. Here's the error: [paste error]

Bob: [Analyzes error and provides fix]

You: Perfect! Can you now update the agent YAML to use this tool?

Bob: [Updates agent configuration]

You: Excellent! Can you generate some test cases for this agent?

Bob: [Provides test scenarios]
```

## Referencia rápida

### Prompts más habituales

1. **Crear**: "Bob, create a [type] that does [function]"
2. **Depurar**: "Bob, why is [thing] not working? Here's the [code/error]"
3. **Mejorar**: "Bob, improve [code/config] by [specific improvement]"
4. **Explicar**: "Bob, explain [concept] in the context of [use case]"
5. **Revisar**: "Bob, review [code/config] for [issues/best practices]"

---

**💡 Consejo profesional:** Cuanto más contexto proporciones a Bob, mejores serán las respuestas. Incluye el código relevante, los mensajes de error y explica qué intentas conseguir.

**🎯 Recuerda:** Bob es tu compañero de programación con IA. Usa a Bob para aprender, no solo para obtener respuestas. Pide a Bob que explique el razonamiento detrás de sus sugerencias.