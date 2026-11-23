---
hide:
  - navigation
---

# Bobchestrate Workshop - Building AI Agents with watsonx Orchestrate and IBM Bob

![Logotipo del taller](../Bobchestrate_Workshop_logo_new.png)

## A hands-on agentic AI development workshop

Welcome! This workshop will guide you through building AI agents with IBM watsonx Orchestrate. Along the way you'll have IBM Bob, an AI-powered coding assistant, to lend you a hand.

> ℹ️ This workshop is based on the more extensive [Bobchestrate Workshop](https://juseljuk.github.io/bobchestrate-workshop/). If you want to take the full extended version, click the link!

## Workshop overview

**Duration:** 105-120 minutes

This estimate includes:

- Core instruction time: 85-95 minutes (all parts)
- Setup and troubleshooting: 10-15 minutes
- Questions and discussion: 10-15 minutes

**Level:** Beginner (Parts 1-3) to Advanced (Part 4)

**Prerequisites:**

- A computer with internet access, running Windows, macOS or Linux, with at least 8 GB of RAM and 500 MB of free disk space
- Basic Python knowledge and Python 3.11-3.13 installed ([https://www.python.org/downloads/](https://www.python.org/downloads/))
- uv installed ([https://pypi.org/project/uv/](https://pypi.org/project/uv/))
- Access to watsonx Orchestrate SaaS (provided by your instructor, or you can use your own)
- IBM Bob IDE installed (trial version or the one provided by your instructor)

## Workshop structure

Each part builds on the previous one and takes you from a working environment to a multi-agent orchestration system.

| Part | Topic | Time |
|------|-------|------|
| [1 — Setup and environment](../part1-setup/README.md) | Set up watsonx Orchestrate and check that Bob is your AI coding companion | 50 min |
| [2 — Your first agent](../part2-first-agent/README.md) | Create a "Hello World" agent and chat with it | 30 min |
| [3 — Custom tools](../part3-custom-tools/README.md) | Create custom Python tools (order lookup and refunds) and connect them to your agent | 30 min |
| [5 — Multi-agent orchestration](../part4-multi-agent-orchestration/README.md) ⭐ | Build a travel concierge with four specialist agents and an orchestrator | 55 min |

## How Bob helps you

Throughout the workshop you'll use Bob to:

- **Generate code**: "Bob, create a Python tool that looks up the status of an order"
- **Debug problems**: "Bob, why isn't my agent calling the refunds tool?"
- **Explain concepts**: "Bob, explain how an agent's instructions work"
- **Refactor code**: "Bob, improve the error handling in my tool"
- **Create tests**: "Bob, write tests for my order status tool"

## Learning objectives

By the end of this workshop, you will have:

- ✅ Understood the watsonx Orchestrate agent architecture
- ✅ Created and configured agents using YAML specifications
- ✅ Taught Bob your project's conventions to generate consistent code
- ✅ Designed and orchestrated multi-agent systems
- ✅ Made the most of Bob as an AI coding companion

## Tips to get the most out of it

1. **Ask Bob for help**: Don't hesitate to ask questions throughout the workshop
2. **Experiment**: Try modifying the examples to see what happens
3. **Read the error messages**: They often tell you exactly what is wrong
4. **Test incrementally**: Build and test one feature at a time
5. **Check the documentation**: Bob can search the watsonx Orchestrate documentation for you

## Additional resources

- [Helpful Bob prompts](../bob-prompts/helpful-prompts.md)
- [watsonx Orchestrate documentation](https://developer.watson-orchestrate.ibm.com/)
- [Python tools guide](https://developer.watson-orchestrate.ibm.com/tools/create_tool)
- [Agent Builder API reference](https://developer.watson-orchestrate.ibm.com/apis/agents/)
- [Community forum](https://community.ibm.com/community/user/groups/community-home?CommunityKey=3ad46381-9535-462e-85c9-568b21f4b067)

## Need help?

- Ask Bob: "Bob, I'm stuck on [specific problem]"
- Check the bob-prompts guide for helpful prompts
- Consult the watsonx Orchestrate documentation

## Getting started

Let's get started! 🚀 Go to [Part 1: Setup](../part1-setup/README.md) →
