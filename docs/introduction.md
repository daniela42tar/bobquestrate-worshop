---
hide:
  - navigation
---

# Bobchestrate Workshop - Creación de agentes de IA con watsonx Orchestrate e IBM Bob

![Logotipo del taller](Bobchestrate_Workshop_logo_new.png)

## Un taller práctico de desarrollo de IA agéntica

¡Te damos la bienvenida! Este taller te guiará en la creación de agentes de IA con IBM watsonx Orchestrate. Por el camino contarás con IBM Bob, un asistente de programación basado en IA, que te echará una mano.

> ℹ️ Este taller está basado en el taller más extenso [Bobchestrate Workshop](https://juseljuk.github.io/bobchestrate-workshop/). Si deseas realizar la versión extendida completa, ¡haz clic en el enlace!

> 📊 **Facilitadores del taller:** Usad la [presentación de introducción del Bobchestrate Workshop](Bobchestrate%20Workshop.pptx) para presentar el taller a los participantes antes de empezar.

## Resumen del taller

**Duración:** 105-120 minutos

Esta estimación incluye:

- Tiempo de instrucción principal: 85-95 minutos (todas las partes)
- Configuración y resolución de problemas: 10-15 minutos
- Preguntas y debate: 10-15 minutos

**Nivel:** Principiante (Partes 1-4) a Avanzado (Parte 5)

**Requisitos previos:**

- Ordenador con acceso a internet, sistema operativo Windows, macOS o Linux, al menos 8 GB de RAM y 500 MB de espacio libre en disco
- Conocimientos básicos de Python y Python 3.11-3.13 instalado ([https://www.python.org/downloads/](https://www.python.org/downloads/))
- uv instalado ([https://pypi.org/project/uv/](https://pypi.org/project/uv/))
- Acceso a watsonx Orchestrate SaaS (proporcionado por tu instructor o puedes usar el tuyo propio)
- IBM Bob IDE instalado (versión de prueba o la que te facilite tu instructor)

## Estructura del taller

Cada parte se apoya en la anterior y te lleva desde un entorno operativo hasta un sistema de orquestación multiagente.

| Parte | Tema | Tiempo |
|------|-------|------|
| [1 — Configuración y entorno](part1-setup/README.md) | Configurar watsonx Orchestrate y comprobar que Bob es tu compañero de programación con IA | 15 min |
| [2 — Tu primer agente](part2-first-agent/README.md) | Crear un agente «Hello World» y chatear con él | 20 min |
| [3 — Herramientas personalizadas](part3-custom-tools/README.md) | Crear herramientas personalizadas en Python (consultar pedidos y reembolsos) y conectarlas a tu agente | 30 min |
| [5 — Orquestación multiagente](part4-multi-agent-orchestration/README.md) ⭐ | Construir un conserje de viajes con cuatro agentes especialistas y un orquestador | 30 min |

## Cómo te ayuda Bob

A lo largo del taller usarás a Bob para:

- **Generar código**: «Bob, crea una herramienta en Python que consulte el estado de un pedido»
- **Depurar problemas**: «Bob, ¿por qué mi agente no llama a la herramienta de reembolsos?»
- **Explicar conceptos**: «Bob, explícame cómo funcionan las instrucciones de un agente»
- **Refactorizar código**: «Bob, mejora la gestión de errores de mi herramienta»
- **Crear pruebas**: «Bob, escribe pruebas para mi herramienta de estado de pedidos»

## Objetivos de aprendizaje

Al terminar este taller, habrás conseguido:

- ✅ Entender la arquitectura de agentes de watsonx Orchestrate
- ✅ Crear y configurar agentes mediante especificaciones YAML
- ✅ Enseñar a Bob las convenciones de tu proyecto para generar código coherente
- ✅ Diseñar y orquestar sistemas multiagente
- ✅ Aprovechar a Bob como compañero de programación con IA

## Consejos para sacarle el máximo partido

1. **Pide ayuda a Bob**: No dudes en hacerle preguntas durante todo el taller
2. **Experimenta**: Prueba a modificar los ejemplos para ver qué ocurre
3. **Lee los mensajes de error**: Muchas veces te dicen exactamente qué falla
4. **Prueba de forma incremental**: Construye y prueba una funcionalidad cada vez
5. **Consulta la documentación**: Bob puede buscar en la documentación de watsonx Orchestrate por ti

## Recursos adicionales

- [Prompts útiles de Bob](bob-prompts/helpful-prompts.md)
- [Documentación de watsonx Orchestrate](https://developer.watson-orchestrate.ibm.com/)
- [Guía de herramientas en Python](https://developer.watson-orchestrate.ibm.com/tools/create_tool)
- [Referencia de la API de Agent Builder](https://developer.watson-orchestrate.ibm.com/apis/agents/)
- [Foro de la comunidad](https://community.ibm.com/community/user/groups/community-home?CommunityKey=3ad46381-9535-462e-85c9-568b21f4b067)

## ¿Necesitas ayuda?

- Pregunta a Bob: «Bob, estoy atascado con [problema concreto]»
- Consulta la guía de bob-prompts para ver prompts útiles
- Consulta la documentación de watsonx Orchestrate

## Primeros pasos

¡Vamos a empezar! 🚀 Ve a la [Parte 1: Configuración](part1-setup/README.md) →
