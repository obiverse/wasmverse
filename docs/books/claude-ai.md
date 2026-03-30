# Letters on the Sovereign Intelligence

### A Treatise on Claude, AI, and Building with Language Models

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

There is a moment in the history of every craft when a new tool arrives that does not merely improve the work but transforms the worker's relationship to the work itself. The printing press did not make scribes faster; it made every literate person a potential publisher. The spreadsheet did not make accountants faster; it made every merchant a potential analyst. We stand at such a moment now, and the tool is language itself, made computable.

In 2026, the African builder faces a reality that would have seemed fantastical a decade ago: intelligence is now an API call. You can send a paragraph of text to a machine and receive back a reasoned analysis, a working program, a structured extraction of data from chaos, a translation between languages, a diagnosis of a failing system -- all in the time it takes to boil water for tea. The machine is not thinking in the way you and I think. It is doing something else, something precise and mathematical, and the builder who understands what that something is will wield this tool with the confidence of a blacksmith who understands the metallurgy of his steel, while the builder who does not will remain a consumer of other people's magic.

The tool I shall teach you to wield is Claude, built by Anthropic. But I must tell you at the outset: Claude is not magic. It is a transformer -- a mathematical architecture that was discovered, not invented, in the same way that Euler discovered the relationship between exponentials and trigonometric functions. The core mechanism, called attention, is structurally identical to a council of elders where every elder weighs every other elder's words before offering their own. The mathematics was always there, latent in the structure of linear algebra and probability theory, waiting for sufficient computation to make it practical.

The principles underlying this tool were always present in African intellectual traditions. The Ifa divination system of the Yoruba is a structured query language: the babalawo poses a precise question, consults 256 canonical patterns (odu), and returns an interpretation conditioned on context. The griot carries an entire civilization's memory and retrieves the relevant portion for the moment at hand -- a biological context window. The palaver tree is a deliberative reasoning system where multiple perspectives are weighed before a decision emerges. These are not metaphors I impose upon the technology. They are structural isomorphisms -- the same mathematical relationships appearing in different substrates.

This book will take you from your first prompt to building multi-agent systems that reason, use tools, and coordinate with one another. We shall proceed through forty letters, each building upon the last. In Part I, you will understand what Claude is and how it processes language. In Part II, you will learn the API -- the merchant's protocol through which your programs speak to the model. In subsequent parts, we shall build increasingly sophisticated systems: retrieval-augmented generation, autonomous agents, evaluation frameworks, and sovereign AI infrastructure that you own and control.

The builder who completes this library will not merely use AI. They will understand it deeply enough to build upon it, to evaluate its claims, to recognize its failure modes, and to deploy it in service of their community. This is the difference between renting intelligence and owning it.

Let us begin.

---

## Part I: The Oracle

*On what Claude is, and how it thinks*

---

### Letter 1: On the Oracle and the Council of Elders

Dear Reader,

Among the Yoruba people of West Africa, there exists a system of divination called Ifa that has been practiced for at least a thousand years. The babalawo -- the father of secrets -- does not simply guess the future. He follows a rigorous protocol. The supplicant poses a question. The babalawo casts the ikin (palm nuts) or the opele (divining chain), producing a binary pattern of marks. This pattern maps to one of 256 odu, each a canonical body of verses, proverbs, and prescriptions accumulated over centuries. The babalawo then interprets the odu in light of the specific question asked, the supplicant's circumstances, and the broader context of the community.

Notice the structure: a precise query, a vast corpus of encoded knowledge, a mechanism that selects the relevant portion, and an interpretation conditioned on context. This is not a metaphor for what a large language model does. It *is* what a large language model does, expressed in a different substrate.

A large language model is, at its mathematical core, a function. It takes a sequence of text -- your prompt -- and produces a probability distribution over what text should come next. It does this by processing your input through billions of learned parameters, each one a numerical weight that encodes a fragment of the patterns found in the vast corpus of text on which the model was trained. The model does not "know" things the way you know your mother's name. It has learned statistical regularities at such depth and scale that the resulting behavior -- when you interact with it -- resembles reasoning, creativity, analysis, and judgment.

This is the phenomenon of emergence. A single neuron in your brain cannot write a poem. But eighty-six billion neurons, connected in the right architecture, produce Shakespeare. Similarly, a single parameter in a language model encodes nothing intelligible. But billions of parameters, organized in the transformer architecture, produce responses that can debug your code, analyze your business plan, and explain quantum mechanics in the voice of a patient teacher.

The transformer architecture, introduced in 2017 by Vaswani and colleagues in a paper titled "Attention Is All You Need," is built on a mechanism called self-attention. Let me explain this precisely, because it is the heart of everything that follows.

Imagine a council of elders seated in a circle. A matter is brought before them -- say, a dispute over water rights. Each elder has their own knowledge and perspective. But before any elder speaks, they listen to every other elder. Not equally -- the elder who knows the river's history listens most carefully to the elder who knows the rainfall patterns, and less carefully to the elder who specializes in marriage customs. Each elder assigns a weight of attention to every other elder, based on the relevance of that elder's knowledge to the matter at hand. Then each elder formulates their contribution as a weighted combination of what they have heard, filtered through their own expertise.

Self-attention works identically. Each token (roughly, each word or subword) in the input sequence computes three vectors: a Query ("what am I looking for?"), a Key ("what do I have to offer?"), and a Value ("what is my actual content?"). The attention score between any two tokens is the dot product of one token's Query with the other's Key -- a measure of relevance. These scores are normalized into a probability distribution (using the softmax function), and each token's output is a weighted sum of all tokens' Values, where the weights are the attention scores.

```
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
```

This single equation is the council of elders in mathematical notation. The division by the square root of the dimension (sqrt(d_k)) prevents the dot products from growing too large -- it keeps the elders' voices at a civil volume. The softmax ensures the attention weights sum to one -- each elder distributes a fixed budget of attention across the others.

Claude specifically is built by Anthropic, a company founded in 2021 by former members of OpenAI. What distinguishes Claude from other language models is a training approach called Constitutional AI (CAI). In traditional reinforcement learning from human feedback (RLHF), human labelers rate model outputs, and the model is trained to produce outputs that humans rate highly. In Constitutional AI, the model is additionally trained against a set of principles -- a constitution -- that encodes values like helpfulness, harmlessness, and honesty. The model learns to critique and revise its own outputs according to these principles. Safety, in Claude, is not a limitation bolted on after the fact. It is woven into the training process itself, as fundamentally as the Ifa corpus is woven into the babalawo's practice.

The quality of the oracle's answer depends entirely on the quality of the question. The babalawo who poses a vague question receives a vague odu. The builder who sends a vague prompt receives a vague response. This is not a deficiency of the tool. It is the nature of all structured knowledge systems: precision in, precision out.

And so the first lesson is this: Claude is a mathematical structure of extraordinary capability, but it is not magic, and it is not autonomous. It is an oracle -- powerful, knowledgeable, and responsive to the precision of your query. The builder who masters the art of asking will find that the oracle's answers illuminate paths they had not imagined.

---

### Letter 2: On the Context Window and the Griot's Memory

Dear Reader,

In the Mande traditions of West Africa, the griot -- the jeli -- is the keeper of memory. The griot carries within their mind the genealogies of kingdoms, the histories of wars, the lyrics of praise songs for every notable family in the region. When a wedding is held, the griot recalls the lineage of both families, weaving together threads from generations past to bless the union with the weight of continuity. When a dispute arises, the griot remembers the precedents. Their memory is not merely large; it is *organized* -- indexed by family, by event, by moral lesson.

But even the greatest griot has limits. They cannot hold the entire history of a civilization in active recollection at once. When singing the genealogy of the Keita clan, they are not simultaneously reciting the trade routes of the Soninke. Their working memory -- the portion of their vast knowledge that is active and available in the present moment -- has a finite capacity.

The context window of a language model is the griot's working memory. It is the total amount of text -- measured in tokens -- that the model can consider at once when generating a response. Everything the model knows about your conversation, your instructions, your documents, your code -- all of it must fit within this window.

A token is roughly three-quarters of a word in English, though the ratio varies by language. The word "understanding" is two tokens. The word "cat" is one. A line of Python code might be five to fifteen tokens. Claude's context window, as of this writing, is 200,000 tokens -- approximately 150,000 words, or the length of two substantial novels.

This is an enormous working memory. You can fit an entire codebase, a complete legal contract, a book-length document, or a dataset of thousands of records into a single conversation. But it is not infinite, and understanding its boundaries is essential to using Claude effectively.

Here is the critical insight that separates the skilled builder from the novice: Claude has no persistent memory between conversations. When a conversation ends, everything in the context window is gone. The next conversation starts with a blank slate. The griot, by contrast, remembers last year's wedding when performing at this year's. Claude does not. Each conversation is a complete, self-contained performance, and everything the model needs to know must be provided within it.

This has profound implications for how you structure your interactions. If you are working on a project over multiple sessions, you must re-establish the context each time. If you want Claude to follow specific conventions, you must state them. If you want it to remember a decision you made three days ago, you must include that decision in the current conversation.

The most important mechanism for establishing context is the system prompt -- the instructions given to the model before the user's first message. Think of this as the charge the elder gives to the griot before a performance: "Tonight you are to sing the lineage of the Diallo family, focusing on the branch that settled in Kankan, and you must use the formal register." The system prompt shapes everything that follows. We shall examine it in detail in Letter 4.

For now, understand the economics of the context window. Every token you send is a token the model must process. Longer contexts take more time and more money (we shall discuss pricing in Letter 5). The skilled builder learns to be precise -- to provide exactly the context needed, no more and no less. This is not a limitation to resent but a discipline to master. The griot who tries to recite every lineage simultaneously produces noise. The griot who selects the relevant thread produces wisdom.

Let me give you practical numbers. A typical conversation might consume tokens as follows: system prompt (500-2000 tokens), user message (100-5000 tokens), model response (200-4000 tokens), then repeated turns. A multi-turn conversation of twenty exchanges might use 30,000-60,000 tokens. This leaves ample room for attaching documents, code, or data -- but you must budget consciously.

The strategies that follow from this understanding are straightforward. First, be explicit. Do not assume the model remembers what you said in a previous conversation -- it does not. Second, front-load context. Place the most important information early in the conversation, where the model's attention is strongest. Third, use the system prompt for instructions that should govern the entire conversation. Fourth, when working with long documents, consider whether you need the entire document or only the relevant sections. Fifth, if a conversation grows very long, consider starting a new one with a summary of what has been established so far.

The context window is finite, but 200,000 tokens is an extraordinary canvas. The builder who understands its shape will paint masterworks upon it.

---

### Letter 3: On the Prompt and the Art of Precise Questions

Dear Reader,

Under the palaver tree -- that great gathering place of West African deliberation -- the quality of the outcome depends entirely on the quality of the question put before the council. A chief who says "What should we do about the harvest?" will receive hours of philosophical discourse and no actionable guidance. A chief who says "The rains were three weeks late, the maize is at knee height, and we have access to the river. Should we divert water to the eastern fields now, or wait for the forecast rains next week?" will receive a concrete recommendation within minutes.

This is not because the council is wiser in the second case. The council's wisdom is unchanged. What has changed is the *specificity of the query*, and specificity unlocks the council's ability to apply their knowledge to the actual situation.

Prompt engineering is the art of asking precise questions. The term sounds technical, but the principle is ancient: structure your request so that the responder's knowledge can be maximally applied to your need. There is no trick to it, no secret incantation. There is only clarity.

The simplest form of prompting is zero-shot: you ask the model a question with no examples.

```
Prompt: "What is the capital of Ghana?"
Response: "The capital of Ghana is Accra."
```

This works for questions where the answer is unambiguous and the model's training data contains the information. But for complex tasks -- generating code in a specific style, extracting data in a particular format, reasoning about a novel problem -- zero-shot prompting often produces results that are correct in substance but wrong in form.

Few-shot prompting solves this by providing examples. You show the model what you want by demonstrating it:

```
Prompt:
"Extract the product and price from each sentence.

Sentence: 'The bag of rice costs 5000 naira at Shoprite.'
Output: {\"product\": \"bag of rice\", \"price\": \"5000 naira\", \"store\": \"Shoprite\"}

Sentence: 'Mama Ngozi sells a crate of eggs for 3200 naira.'
Output: {\"product\": \"crate of eggs\", \"price\": \"3200 naira\", \"store\": \"Mama Ngozi\"}

Sentence: 'A tin of Milo at the Onitsha market goes for 1800 naira.'
Output:"

Response: {\"product\": \"tin of Milo\", \"price\": \"1800 naira\", \"store\": \"Onitsha market\"}
```

The model infers the pattern from your examples and applies it to the new input. This is extraordinarily powerful. You have, in effect, programmed the model by demonstration rather than by code. The Ifa babalawo teaches the apprentice the same way -- not by explaining the abstract rules of interpretation, but by showing how specific odu apply to specific situations, until the apprentice internalizes the pattern.

Chain-of-thought prompting goes further. For problems that require reasoning -- mathematics, logic, multi-step analysis -- you instruct the model to show its work:

```
Prompt:
"A farmer in Nakuru has 3 hectares of land. Each hectare produces
40 bags of maize per season. He sells each bag for 3,500 KES.
His costs are 45,000 KES per hectare per season.
What is his profit per season? Think step by step."

Response:
"Step 1: Total production = 3 hectares * 40 bags = 120 bags
Step 2: Total revenue = 120 bags * 3,500 KES = 420,000 KES
Step 3: Total costs = 3 hectares * 45,000 KES = 135,000 KES
Step 4: Profit = 420,000 - 135,000 = 285,000 KES

The farmer's profit per season is 285,000 KES."
```

The phrase "think step by step" is not magic. It works because it instructs the model to generate intermediate reasoning tokens, and those tokens become part of the context for subsequent tokens. The model, in effect, gives itself scratch paper. Without this instruction, the model might attempt to leap directly to the answer and make arithmetic errors along the way.

Temperature is the final control I wish to introduce in this letter. It governs the randomness of the model's output. At temperature 0, the model always selects the most probable next token -- it becomes a deterministic elder who always gives the same answer to the same question. At temperature 1, the model samples from the full probability distribution -- it becomes a creative storyteller who might surprise you. For code generation and data extraction, use low temperature (0 to 0.3). For creative writing and brainstorming, use higher temperature (0.7 to 1.0).

```python
# Deterministic: always the same answer
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0,
    messages=[{"role": "user", "content": "What is 17 * 23?"}]
)

# Creative: varied, surprising
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0.9,
    messages=[{"role": "user", "content": "Write a haiku about Lagos traffic."}]
)
```

The palaver tree teaches us that wisdom is not summoned by shouting. It is drawn forth by the precise framing of the question, the careful provision of context, and the patience to let the council deliberate. The model is your council. Frame your questions well.

---

### Letter 4: On the System Prompt and the Elder's Charge

Dear Reader,

Before the griot performs at a naming ceremony, the elder of the hosting family gives a charge. This charge is not part of the performance itself -- the audience may never hear it. But it shapes everything that follows. "Tonight," the elder says, "you are to celebrate the Traore lineage. Emphasize the branch that came from Segou. Mention the alliance with the Coulibaly family. Do not speak of the dispute over the cattle -- that matter is settled and need not be reopened. Use the high register. The guests include scholars from Timbuktu."

With this charge, the griot knows the scope, the emphasis, the constraints, the audience, and the tone. Without it, the griot must guess at all of these, and the performance suffers accordingly.

The system prompt is the elder's charge to Claude. It is a special message, set apart from the conversation itself, that establishes the model's role, constraints, knowledge, voice, and operating parameters for the entire interaction. It is the single most important lever the builder has for controlling Claude's behavior.

Here is a minimal system prompt:

```json
{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "system": "You are a helpful assistant for a small business in Accra that sells electronics. Answer customer questions about products, prices, and store policies. Be friendly and concise. Prices are in Ghana Cedis (GHS).",
    "messages": [
        {"role": "user", "content": "Do you have phone chargers?"}
    ]
}
```

Without the system prompt, Claude would answer the question about phone chargers generically -- perhaps discussing charger types in general, or asking clarifying questions about which country's plug standard. With the system prompt, Claude answers as a specific store's assistant, in the right currency, with the right tone.

The anatomy of a great system prompt has several components. The first is the **role**: who is Claude in this conversation? An assistant, a tutor, a code reviewer, a data analyst, a medical triage system? The role sets the frame. The second is **constraints**: what must Claude do, and what must it not do? "Always respond in French." "Never provide medical diagnoses." "If the user asks about competitors, redirect to our products." The third is **voice**: formal or casual, terse or expansive, technical or accessible. The fourth is **knowledge**: any specific information Claude needs that it might not have -- your company's return policy, your codebase's conventions, the names of your team members. The fifth is **examples**: demonstrations of the desired input-output behavior, as we discussed in Letter 3.

Let me show you a more sophisticated system prompt -- one that governs a code review assistant:

```
You are a senior code reviewer for a Python team building fintech
applications in Lagos. Your reviews must:

1. Check for security vulnerabilities (SQL injection, XSS, insecure
   deserialization, hardcoded credentials)
2. Verify error handling (all API calls must have try/except,
   all database operations must use transactions)
3. Enforce style (PEP 8, type hints on all function signatures,
   docstrings on all public functions)
4. Flag performance concerns (N+1 queries, unbounded loops,
   missing pagination)

Format your review as:
- CRITICAL: issues that must be fixed before merge
- WARNING: issues that should be fixed soon
- SUGGESTION: improvements for consideration

Be direct. Do not praise code that is merely adequate.
The team values honest feedback over politeness.
```

This charge is specific, structured, and opinionated. The model will now review code through this exact lens, catching security issues, enforcing style, and formatting its output in the prescribed structure. The builder who writes this system prompt once can use it for every code review, creating a consistent, tireless reviewer who applies the same standards to every pull request.

Now I wish to draw your attention to a remarkable example: the CLAUDE.md file. When you use Claude Code -- the command-line interface for working with Claude on software projects -- it automatically reads a file called CLAUDE.md from your project directory and uses it as a system prompt. This means you can encode your project's conventions, architecture decisions, coding standards, and domain knowledge into a file that Claude reads every time you start a session.

The Letterverse itself -- the very library you are reading -- has such a file. It specifies the Eulerian voice, the heading format that the reader's parser expects, the requirement for African grounding in every treatise, and the anti-patterns to avoid. When I write a new letter, these instructions are present in my context, shaping every sentence. The elder's charge is automated.

The principle extends beyond code. A system prompt can encode a company's customer service philosophy, a school's pedagogical approach, a clinic's triage protocol, or a legal firm's document review standards. In each case, the builder captures expert judgment in a reusable, versionable, shareable text file, and every conversation with Claude begins with that judgment already loaded.

Write your system prompts with the same care you would give to a charge addressed to the wisest counselor in your community. Be specific about what you want. Be explicit about what you forbid. Provide the context that a newcomer would need to perform well. The model is brilliant but uninformed -- it knows the world but not your particular corner of it, until you tell it.

---

### Letter 5: On Temperature, Tokens, and the Economics of Thought

Dear Reader,

Every market has prices, and the market for intelligence is no different. When you send a message to Claude and receive a response, you are purchasing computation -- the processing of your input tokens through billions of parameters and the generation of output tokens one by one. Understanding this economics is as essential to the builder as understanding the price of steel is to the manufacturer.

A token, as I mentioned in Letter 2, is the fundamental unit of text that a language model processes. The model does not see words as you and I do. It sees subword units derived from a tokenization algorithm called Byte-Pair Encoding (BPE). Common words like "the" or "and" are single tokens. Less common words are split: "tokenization" might become "token" + "ization." Numbers are often split digit by digit. Code has its own patterns: a Python `def` keyword is one token, but a long variable name might be three or four.

Why does this matter? Because you pay per token, and you are billed separately for input and output. As of this writing, Claude Sonnet -- the model that balances capability and cost -- charges approximately $3 per million input tokens and $15 per million output tokens. Claude Opus -- the most capable model -- costs more. Claude Haiku -- the fastest and cheapest -- costs less. These prices will change, but the structure will persist: input is cheaper than output, faster models are cheaper than more capable ones, and you always pay for what you use.

Let me make this concrete. Suppose you are building a customer support bot for a mobile money service in Nairobi. Each customer interaction involves a system prompt (800 tokens), the customer's message (50 tokens), and Claude's response (200 tokens). At Sonnet's pricing, each interaction costs roughly:

```
Input:  (800 + 50) tokens * $3 / 1,000,000 = $0.00255
Output: 200 tokens * $15 / 1,000,000       = $0.003
Total:  $0.00555 per interaction
```

At a thousand interactions per day, that is $5.55. At a hundred thousand interactions per day, that is $555. These are real numbers that a real business must account for.

Now let us discuss the controls that shape the model's output beyond the prompt itself. Temperature, which I introduced in Letter 3, is the most important. Formally, temperature scales the logits (the raw scores) before the softmax function converts them to probabilities. At temperature 0, the highest-scoring token always wins -- the output is deterministic. At temperature 1, the original probability distribution is preserved. At temperature 2 (which most APIs cap before reaching), the distribution flattens, and unlikely tokens become much more probable -- the output becomes wild and unpredictable.

Two related parameters are `top_p` (nucleus sampling) and `top_k`. Top_p says: "Consider only the smallest set of tokens whose cumulative probability exceeds p." If top_p is 0.9, the model ignores the least probable 10% of tokens at each step. Top_k says: "Consider only the k most probable tokens." These are alternative ways to control randomness, and in practice, you typically use temperature alone or temperature with top_p.

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

# For data extraction: low temperature, deterministic
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=512,
    temperature=0,
    system="Extract structured data from the text. Return valid JSON only.",
    messages=[{
        "role": "user",
        "content": "Invoice #4521 from Dangote Cement, dated 15 March 2026, for 200 bags at 5,400 NGN each. Total: 1,080,000 NGN. Payment due: 30 days."
    }]
)
print(response.content[0].text)
# {"invoice_number": "4521", "vendor": "Dangote Cement", ...}
```

Streaming is another critical concept. By default, the API waits until the entire response is generated before returning it. With streaming enabled, tokens are delivered as they are produced -- the user sees the response forming in real time. The griot does not compose the entire epic in silence and then recite it all at once. The griot begins, and the audience hears each line as it is formed. Streaming reduces perceived latency dramatically and is essential for any user-facing application.

The practical economics for the builder are these. First, choose your model wisely: use Haiku for simple classification and extraction tasks, Sonnet for most general work, and Opus only when you need the deepest reasoning. Second, minimize your system prompt to what is necessary -- every token counts when it is repeated across thousands of calls. Third, use `max_tokens` to cap output length -- do not let the model write a novel when you need a sentence. Fourth, cache your system prompt when your API supports it: Anthropic offers prompt caching that reduces costs for repeated system prompts by up to 90%. Fifth, batch requests when possible rather than sending them one by one.

```python
# Efficient: specify max_tokens to avoid over-generation
response = client.messages.create(
    model="claude-haiku-3-20250317",
    max_tokens=100,
    temperature=0,
    system="Classify the sentiment as positive, negative, or neutral. Reply with one word.",
    messages=[{
        "role": "user",
        "content": "The M-Pesa transaction went through instantly. Love this service!"
    }]
)
# Response: "positive" (uses ~2 output tokens instead of 100)
```

Rate limits constrain how many requests you can send per minute and how many tokens you can process per minute. These limits vary by model and by your account tier. When you hit a rate limit, the API returns a 429 status code, and your application must wait and retry. Build this retry logic into your code from the start -- it is not a failure case but a normal operating condition, as natural as the market trader who waits for the crowd to thin before approaching the stall.

The economics of intelligence are real, but they are remarkably favorable. For the cost of a single employee's daily lunch, you can process thousands of intelligent interactions. The builder who understands these economics will allocate intelligence as precisely as capital -- where it matters most, in the right amount, at the right cost.

---

## Part II: The Craft

*On the API, tool use, and building real applications*

---

### Letter 6: On the API and the Merchant's Protocol

Dear Reader,

In the great market of Aba -- that sprawling labyrinth of commerce in southeastern Nigeria where leather goods, textiles, and machine parts flow in volumes that would astonish a visitor -- there exists an unwritten protocol governing every transaction. You approach a stall. You state your need: "I require fifty meters of this cotton, in indigo." The merchant examines your request, confirms they can fulfill it, and names a price. You present your credential -- your cash, your known face, your reference from a mutual acquaintance -- and the goods change hands. The protocol is ancient, efficient, and universal: identify yourself, state your need, receive your goods, settle your account.

The Anthropic API follows this protocol with mathematical precision. The base URL is your market address. The API key is your credential. The Messages endpoint is the merchant's stall. The request body states your need. The response delivers the goods. Let us walk through each element.

First, you need an API key. This is a secret string that identifies you to Anthropic's servers, like a membership card for the market. You obtain it from the Anthropic Console (console.anthropic.com), and you must guard it as you would guard the key to your shop. Never commit it to version control. Never embed it in client-side code. Store it in an environment variable:

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```

Now let us make our first API call using curl -- the most direct way to speak HTTP:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 256,
    "messages": [
      {"role": "user", "content": "What is the population of Lagos?"}
    ]
  }'
```

Let me dissect this request. The URL `https://api.anthropic.com/v1/messages` is the endpoint -- the specific stall in the market. The headers identify you (`x-api-key`) and specify the API version and content type. The body is a JSON object with three required fields:

- **model**: which Claude model to use. "claude-sonnet-4-20250514" is the workhorse. "claude-opus-4-20250514" is the most capable. "claude-haiku-3-20250317" is the fastest and cheapest.
- **max_tokens**: the maximum number of tokens in the response. This is your budget for the merchant's reply.
- **messages**: an array of message objects, each with a `role` ("user" or "assistant") and `content` (the text).

The response comes back as JSON:

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Lagos, Nigeria has an estimated population of over 16 million people in the city proper, with the greater metropolitan area home to over 24 million residents, making it the largest city in Africa."
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 14,
    "output_tokens": 52
  }
}
```

The `content` array contains the response text. The `stop_reason` tells you why the model stopped: "end_turn" means it finished naturally, "max_tokens" means it hit your limit, and "tool_use" means it wants to call a tool (we shall cover this in Letter 8). The `usage` object tells you exactly how many tokens were consumed -- your receipt from the merchant.

Now let us move from curl to the Python SDK, which is how most applications will interact with Claude:

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from environment

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a knowledgeable assistant for African history.",
    messages=[
        {"role": "user", "content": "Tell me about the Mali Empire's trade routes."}
    ]
)

print(message.content[0].text)
print(f"Tokens used: {message.usage.input_tokens} in, {message.usage.output_tokens} out")
```

The `system` parameter is the system prompt from Letter 4 -- the elder's charge. It is separate from the messages array because it occupies a privileged position: it is always present, always first, and the model treats it as authoritative instructions rather than conversational input.

Let me show you a complete, practical example -- a function that takes a customer's complaint in any language and returns a structured analysis in English:

```python
import anthropic
import json

client = anthropic.Anthropic()

def analyze_complaint(complaint_text: str) -> dict:
    """Analyze a customer complaint and return structured data."""
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        temperature=0,
        system="""You are a customer service analyst for a mobile money
        platform operating across East Africa. Analyze complaints and
        return a JSON object with these fields:
        - language: the detected language of the complaint
        - category: one of [transaction_failed, wrong_amount,
          account_locked, slow_service, fraud, other]
        - severity: one of [low, medium, high, critical]
        - summary: a one-sentence English summary
        - suggested_action: what the support team should do""",
        messages=[
            {"role": "user", "content": complaint_text}
        ]
    )
    return json.loads(message.content[0].text)

# Works with any language
result = analyze_complaint(
    "Nilituma pesa kwa mama yangu lakini hajapokea hadi sasa. "
    "Imepita saa tano! Tafadhali nisaidieni!"
)
print(json.dumps(result, indent=2))
```

The merchant's protocol is simple, but its simplicity is its power. With this protocol, you can build customer service systems, data pipelines, code generators, tutoring platforms, content creation tools, and analytical engines -- all from the same endpoint, differentiated only by the system prompt and the messages you send. The API is the stall. Your imagination is the only constraint on what you purchase there.

---

### Letter 7: On Conversations and the Palaver's Memory

Dear Reader,

Under the palaver tree, every speaker's words are heard by all, and every subsequent speaker may reference what came before. The conversation has memory -- not because any single participant remembers everything, but because the accumulated record of speech provides the context for what comes next. If Kofi raised the matter of the well in the third hour, and Ama responded in the fourth, then when Kwame speaks in the fifth hour, he can say "as Kofi noted about the well, and as Ama rightly observed..." -- and everyone understands.

The Anthropic API works the same way, with one crucial difference: you must provide the entire record yourself. The API is stateless. Each request is independent. Claude does not remember your previous request any more than a market merchant remembers the customer from last Tuesday. If you want a multi-turn conversation, you must send the complete conversation history with every request.

Here is what a multi-turn conversation looks like in practice:

```python
import anthropic

client = anthropic.Anthropic()

# The conversation history is just a list of messages
history = []

def chat(user_message: str) -> str:
    """Send a message and get a response, maintaining history."""
    history.append({"role": "user", "content": user_message})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="You are a Swahili language tutor. Teach conversational Swahili with patience and encouragement. Use examples from daily life in Dar es Salaam.",
        messages=history
    )

    assistant_message = response.content[0].text
    history.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# Turn 1
print(chat("How do I greet someone in the morning?"))
# Claude teaches "Habari za asubuhi" with examples

# Turn 2 — Claude remembers Turn 1 because we sent the full history
print(chat("And how would I respond to that greeting?"))
# Claude builds on the previous exchange

# Turn 3 — the context grows with each turn
print(chat("Can you give me a short dialogue using these greetings?"))
# Claude creates a dialogue incorporating everything taught so far
```

The `history` list grows with each exchange. By the time we reach Turn 3, the messages array contains all three user messages and both previous assistant responses. Claude processes this entire sequence and generates a response that is coherent with everything that came before.

This architecture has a consequence that the builder must manage: the conversation eventually outgrows the context window. If each turn averages 500 tokens (input + output), then after 200 turns you have consumed 100,000 tokens -- half the context window -- just on conversation history. The system prompt and any attached documents consume additional space.

There are several strategies for managing this growth. The simplest is truncation: when the history exceeds a threshold, remove the oldest messages. This works for casual conversations but loses important early context. A better approach is summarization: periodically ask Claude to summarize the conversation so far, then replace the history with the summary:

```python
def summarize_and_compact(history: list, system: str) -> list:
    """Summarize conversation history to save tokens."""
    # Build the full conversation as text
    conversation = "\n".join(
        f"{msg['role'].upper()}: {msg['content']}"
        for msg in history
    )

    summary_response = client.messages.create(
        model="claude-haiku-3-20250317",  # Use cheap model for summary
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Summarize this conversation in 2-3 paragraphs, preserving all key decisions, facts, and commitments:\n\n{conversation}"
        }]
    )

    # Replace history with summary as context
    return [{
        "role": "user",
        "content": f"Here is a summary of our conversation so far:\n{summary_response.content[0].text}\n\nLet us continue."
    }, {
        "role": "assistant",
        "content": "I understand. I have the context from our previous discussion. Please go ahead."
    }]
```

Notice the pattern: the messages array must always alternate between "user" and "assistant" roles. You cannot send two user messages in a row, or two assistant messages in a row. This is a structural constraint of the API, just as the palaver tree has a rule that no one speaks twice in succession without yielding the floor.

A common architecture for production applications is to store the conversation history in a database, keyed by a session identifier. Each time the user sends a message, the application retrieves the history from the database, appends the new message, sends the entire history to Claude, receives the response, appends it to the history, and saves the updated history back to the database:

```python
def handle_message(session_id: str, user_message: str) -> str:
    # Load history from your database
    history = db.get_conversation(session_id)

    # Append new user message
    history.append({"role": "user", "content": user_message})

    # Check if we need to compact
    total_tokens = estimate_tokens(history)
    if total_tokens > 150_000:  # Leave room for response
        history = summarize_and_compact(history, system_prompt)

    # Send to Claude
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=system_prompt,
        messages=history
    )

    # Append assistant response
    assistant_text = response.content[0].text
    history.append({"role": "assistant", "content": assistant_text})

    # Save back to database
    db.save_conversation(session_id, history)

    return assistant_text
```

The palaver tree has taught us that conversation is not a sequence of isolated utterances. It is a growing tapestry of context, reference, and shared understanding. The builder who manages this tapestry well -- preserving what matters, compacting what has served its purpose, and always providing the model with sufficient context to respond wisely -- builds applications that feel not like interrogating a machine, but like conversing with a knowledgeable colleague.

---

### Letter 8: On Tool Use and the Blacksmith's Forge

Dear Reader,

In the Suame Magazine industrial district of Kumasi, Ghana -- the largest informal engineering cluster in West Africa -- the master mechanic does not mine iron ore, smelt it into steel, forge it into an engine block, machine it to tolerances, and then install it in the vehicle. The master mechanic diagnoses the problem, decides what is needed, and calls upon specialists: the welder, the lathe operator, the electrician, the parts supplier. The mechanic's genius lies not in performing every operation but in *knowing which operation is needed and orchestrating the specialists to perform it*.

Tool use gives Claude this same capability. Without tools, Claude can only reason about text -- it can analyze, explain, and generate, but it cannot look up today's weather, query your database, send an email, or check an exchange rate. With tools, Claude can decide that a piece of external information or an external action is needed, request it, receive the result, and incorporate it into its response. The model becomes the master mechanic of your application.

The mechanism is precise. You define tools in your API request. Each tool has a name, a description, and an input schema (a JSON Schema specifying what parameters the tool accepts). Claude reads the tool definitions as part of its context. When it determines that a tool would help answer the user's question, it returns a response with `stop_reason: "tool_use"` and a content block specifying which tool to call with what arguments. Your code executes the tool, and you send the result back to Claude as a `tool_result` message. Claude then generates its final response, incorporating the tool's output.

Let me show you the complete flow:

```python
import anthropic
import json

client = anthropic.Anthropic()

# Define the tools Claude can use
tools = [
    {
        "name": "get_exchange_rate",
        "description": "Get the current exchange rate between two currencies. Use this when the user asks about currency conversion or prices in different currencies.",
        "input_schema": {
            "type": "object",
            "properties": {
                "from_currency": {
                    "type": "string",
                    "description": "The source currency code (e.g., 'NGN', 'KES', 'USD')"
                },
                "to_currency": {
                    "type": "string",
                    "description": "The target currency code"
                }
            },
            "required": ["from_currency", "to_currency"]
        }
    },
    {
        "name": "check_inventory",
        "description": "Check the available inventory for a product in our warehouse.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {
                    "type": "string",
                    "description": "The product identifier"
                }
            },
            "required": ["product_id"]
        }
    }
]

# Your tool implementations (these connect to real systems)
def execute_tool(name: str, inputs: dict) -> str:
    if name == "get_exchange_rate":
        # In production, call a real exchange rate API
        rates = {
            ("NGN", "USD"): 0.00062,
            ("KES", "USD"): 0.0077,
            ("GHS", "USD"): 0.063,
        }
        pair = (inputs["from_currency"], inputs["to_currency"])
        rate = rates.get(pair, None)
        if rate:
            return json.dumps({"rate": rate, "timestamp": "2026-03-30T10:00:00Z"})
        return json.dumps({"error": "Rate not available"})

    elif name == "check_inventory":
        # In production, query your database
        return json.dumps({"product_id": inputs["product_id"],
                          "quantity": 142, "warehouse": "Lagos-Ikeja"})

# The conversation loop with tool use
messages = [
    {"role": "user",
     "content": "How much is 50,000 naira in US dollars? And do we have product SKU-4421 in stock?"}
]

# First API call — Claude may request tool use
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

# Process tool calls if any
while response.stop_reason == "tool_use":
    # Collect all tool uses from the response
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result
            })

    # Send tool results back to Claude
    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": tool_results})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

# Final response with tool results incorporated
print(response.content[0].text)
```

Study the flow carefully. The user asks two questions in one message: a currency conversion and an inventory check. Claude recognizes that both require external data, and it returns two `tool_use` blocks in a single response -- calling upon two specialists simultaneously, just as the master mechanic might send for both a welder and an electrician at the same time. Your code executes both tools, sends both results back, and Claude synthesizes a natural-language response that answers both questions.

The tool description is as important as the tool implementation. Claude decides *whether* to use a tool based on its description. A poor description -- "Gets rates" -- gives Claude insufficient information to know when the tool is appropriate. A good description -- "Get the current exchange rate between two currencies. Use this when the user asks about currency conversion or prices in different currencies." -- tells Claude both what the tool does and when to use it.

The input schema uses JSON Schema, the same standard used across the web for validating data structures. Each property has a type and a description. The `required` array specifies which properties must be provided. Claude reads this schema and generates valid inputs accordingly -- it will not call `get_exchange_rate` without specifying both currencies, because the schema declares them required.

Tools are the bridge between Claude's reasoning and the real world. Without them, Claude is a brilliant advisor who can analyze and recommend but never act. With them, Claude becomes the orchestrator of your entire system -- reading from databases, calling APIs, triggering workflows, and reporting the results in natural language that any user can understand. The blacksmith's forge is hot. Let us build.

---

### Letter 9: On Structured Output and the Scribe's Ledger

Dear Reader,

When a merchant in the Onitsha Main Market completes a transaction, they do not write a poem about it. They write a ledger entry: date, item, quantity, unit price, total, buyer's name. The format is rigid, the fields are fixed, and every entry follows the same structure. This is not a limitation of the scribe's creativity. It is a *requirement of the system* -- the accountant who reads the ledger at month's end must be able to parse every entry mechanically, without interpreting prose.

When Claude's output will be consumed by another program rather than a human reader, it too must write ledger entries, not poems. Structured output ensures that Claude returns data in an exact, parseable format -- typically JSON -- that your code can process reliably.

The simplest approach is to ask for JSON in the system prompt:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0,
    system="""Extract contact information from the text and return a JSON
    object with fields: name, phone, email, company, role.
    Use null for missing fields. Return ONLY the JSON, no other text.""",
    messages=[{
        "role": "user",
        "content": "Hi, I'm Amina Okafor from Flutterwave. You can reach me at amina@flutterwave.com or +234 812 345 6789. I'm the Head of Developer Relations."
    }]
)

import json
contact = json.loads(response.content[0].text)
print(contact)
# {"name": "Amina Okafor", "phone": "+234 812 345 6789",
#  "email": "amina@flutterwave.com", "company": "Flutterwave",
#  "role": "Head of Developer Relations"}
```

This works well for simple extractions, but it has a weakness: the model might occasionally include explanatory text before or after the JSON, or it might format a field differently than expected. For production systems, you need stronger guarantees.

The most reliable method for structured output is to use tool use as a schema enforcement mechanism. Here is the insight: when you define a tool with an input schema, Claude must call the tool with arguments that match that schema. You do not need to actually *execute* the tool -- you can use it purely as a way to force Claude to produce structured output:

```python
# Define a "tool" whose input schema IS your desired output format
tools = [{
    "name": "record_receipt",
    "description": "Record the extracted receipt data.",
    "input_schema": {
        "type": "object",
        "properties": {
            "vendor": {"type": "string", "description": "The seller's name"},
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "quantity": {"type": "integer"},
                        "unit_price": {"type": "number"},
                        "currency": {"type": "string"}
                    },
                    "required": ["name", "quantity", "unit_price", "currency"]
                }
            },
            "total": {"type": "number"},
            "currency": {"type": "string"},
            "date": {"type": "string", "description": "ISO 8601 date"},
            "payment_method": {
                "type": "string",
                "enum": ["cash", "card", "mobile_money", "bank_transfer"]
            }
        },
        "required": ["vendor", "items", "total", "currency"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0,
    tools=tools,
    tool_choice={"type": "tool", "name": "record_receipt"},
    messages=[{
        "role": "user",
        "content": """Extract from this receipt:

        SHOPRITE LAGOS - IKEJA MALL
        Date: 15/03/2026

        Golden Penny Spaghetti x3    @ 950 NGN    2,850
        Peak Milk (tin) x5           @ 1,200 NGN   6,000
        Indomie Noodles (carton) x1  @ 4,500 NGN   4,500

        TOTAL: 13,350 NGN
        Paid: POS Card"""
    }]
)

# The tool_use block contains perfectly structured data
for block in response.content:
    if block.type == "tool_use":
        receipt = block.input
        print(json.dumps(receipt, indent=2))
```

The `tool_choice` parameter with `{"type": "tool", "name": "record_receipt"}` forces Claude to call this specific tool, guaranteeing that the output matches your schema. The model cannot return freeform text -- it must fill in the fields you defined, with the types you specified, including the enum constraints on `payment_method`.

This technique is transformative for data pipelines. Consider a system that processes hundreds of supplier invoices in different formats and languages:

```python
def process_invoice(raw_text: str) -> dict:
    """Extract structured data from any invoice format."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        temperature=0,
        tools=[invoice_schema_tool],
        tool_choice={"type": "tool", "name": "record_invoice"},
        messages=[{
            "role": "user",
            "content": f"Extract all invoice data from this document:\n\n{raw_text}"
        }]
    )

    for block in response.content:
        if block.type == "tool_use":
            invoice = block.input
            # Always validate, even with schema enforcement
            assert invoice["total"] > 0, "Total must be positive"
            assert invoice["currency"] in VALID_CURRENCIES
            return invoice

    raise ValueError("No structured data extracted")
```

Always validate what you receive, even with schema enforcement. The model operates probabilistically, and edge cases will arise -- a negative total, a malformed date, a currency code you do not recognize. Validation is the final line of defense, just as the head scribe reviews the junior scribe's ledger entries before they enter the master book.

The scribe's ledger endures because its structure is unambiguous. Build your systems the same way: define the schema precisely, enforce it through tool use, validate the result, and your data pipeline will process a thousand documents as reliably as one.

---

### Letter 10: On Streaming and the River That Speaks

Dear Reader,

The Niger River does not wait until it reaches the Atlantic to begin flowing. It rises in the highlands of Guinea, gathers its tributaries in Mali, bends through Niger and Nigeria, and reaches the sea four thousand kilometers later -- but every village along its banks benefits from the water as it passes. The river delivers its gift continuously, not in a single lump at the end.

Streaming is the river's principle applied to language model output. Instead of waiting for Claude to generate the entire response before delivering it, streaming sends each token to your application as it is produced. The user sees the response forming word by word, the way a griot's audience hears each line as it is spoken. The perceived latency drops from seconds to milliseconds, and the experience transforms from waiting for a document to witnessing a thought unfold.

The technical mechanism is Server-Sent Events (SSE), a simple HTTP protocol where the server holds the connection open and sends events as they occur. Each event is a small JSON object indicating what happened: a content block started, a piece of text was generated, the message ended. Your client reads these events as they arrive and renders the text incrementally.

Here is streaming with the Python SDK:

```python
import anthropic

client = anthropic.Anthropic()

# Non-streaming: blocks until the entire response is ready
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain how M-Pesa works."}]
)
# You wait 3-5 seconds, then get the complete text

# Streaming: tokens arrive as they are generated
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain how M-Pesa works."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
# First token arrives in ~200ms, text flows continuously
```

The `stream.text_stream` iterator yields strings as they are generated -- sometimes a single word, sometimes a fragment of a word, sometimes a few words at once. The `flush=True` ensures the output is displayed immediately rather than buffered. The effect in a terminal is mesmerizing: the text appears as if someone is typing it in real time, and the user can begin reading and processing the information before the response is complete.

For applications that need more control, the streaming API provides typed events:

```python
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short poem about Kilimanjaro."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print("[Response beginning]")
        elif event.type == "content_block_delta":
            if event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
        elif event.type == "message_stop":
            print("\n[Response complete]")

# After the stream closes, you can access the full message:
final_message = stream.get_final_message()
print(f"\nTokens: {final_message.usage.input_tokens} in, "
      f"{final_message.usage.output_tokens} out")
```

The event types tell a story. `message_start` announces the beginning. `content_block_start` signals that a new content block is beginning (text or tool use). `content_block_delta` delivers incremental content -- the river's water flowing past. `content_block_stop` signals the block is complete. `message_delta` provides final metadata like the stop reason. `message_stop` closes the stream.

Streaming becomes essential when you are building tools that people interact with directly. Consider a CLI assistant for a software team:

```python
import anthropic
import sys

client = anthropic.Anthropic()

def ask_claude(question: str, system: str = "You are a helpful coding assistant."):
    """Stream Claude's response to the terminal in real-time."""
    print("\nClaude: ", end="")

    collected_text = []

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": question}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            collected_text.append(text)

    print()  # newline after response
    return "".join(collected_text)

# Interactive loop
print("Ask Claude anything. Type 'quit' to exit.\n")
while True:
    question = input("You: ")
    if question.lower() == "quit":
        break
    ask_claude(question)
```

Streaming also works with tool use, though the flow is more nuanced. When Claude decides to use a tool during a streamed response, you receive `content_block_start` with type "tool_use," followed by `content_block_delta` events that deliver the tool input JSON incrementally, followed by `content_block_stop`. You then execute the tool, send the result, and initiate a new streaming request for the final response.

There is a deeper principle here that I wish you to carry forward. The best interfaces do not make the user wait for a finished product. They reveal the process. The architect shows sketches before blueprints. The potter turns the clay while the buyer watches. The griot's audience gasps at a revelation mid-verse, not at the end of the performance. Streaming is not merely a performance optimization. It is a design philosophy: let the user witness the intelligence at work, and the experience becomes a collaboration rather than a transaction.

The river speaks as it flows, and every village along its banks is nourished. Build your applications the same way, and your users will feel not that they are waiting for an answer, but that they are thinking alongside a brilliant companion.

---

## Part III: The Agent
*On Claude Code, agents, and the architecture of sovereign AI*

---

### Letter 11: On Claude Code and the Sovereign Workshop

Dear Reader,

In the previous letters we examined the nature of Claude as a language model --- how it processes tokens, how it reasons, how it responds. But knowing how an engine works is not the same as driving. In this letter I wish to introduce you to Claude Code, and I shall do so through an analogy that every African builder understands: the master builder's workshop.

Visit any serious workshop in Suame Magazine, Ghana's sprawling automotive district, and you will observe something remarkable. The master mechanic does not simply hand you a wrench. The workshop is an environment: vises bolted to steel tables, lathes that spin with terrifying precision, arc welders that puddle metal into liquid obedience, and everywhere the accumulated knowledge of decades --- jigs for common tasks, templates for standard parts, apprentices who know which drawer holds which socket. The mechanic speaks an intention --- "bore this cylinder to 0.020 over" --- and the workshop responds with coordinated action across multiple tools.

Claude Code is precisely this kind of workshop, but for software. It is an agentic coding tool that runs in your terminal. You speak your intention in natural language, and Claude reads your files, explores your codebase, writes code, runs commands, manages git, executes tests, and iterates until the task is complete. It is not a chatbot that pastes code snippets. It is a builder that operates your entire development environment.

The entry point is the `claude` command in your terminal:

```bash
# Interactive mode: an ongoing conversation
claude

# One-shot mode: a single task
claude -p "Add input validation to the signup form"

# Pipe content directly
cat error.log | claude -p "Diagnose this crash"
```

But the workshop's true power lies in its configuration. Every project can contain a file called `CLAUDE.md` at its root, and this file shapes every response Claude produces for that project. It is the equivalent of the master mechanic's training manual --- the accumulated wisdom of how this particular workshop operates.

```markdown
# CLAUDE.md
## Project: Sovereign Marketplace
- This is a Django application with PostgreSQL
- Always use type hints in Python functions
- Tests go in tests/ mirroring the source structure
- We use Black for formatting, run it before committing
- The API follows REST conventions at /api/v1/
```

When Claude Code reads this file at the start of every session, it understands the idiom of your project. It will not suggest Flask patterns in a Django codebase. It will not forget to run Black. The `CLAUDE.md` is sovereign instruction --- your rules, your standards, your way of building.

Claude Code also supports hooks --- shell commands that execute on events:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "echo 'Tool executing...'" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATH" }]
      }
    ]
  }
}
```

These hooks let you enforce standards automatically. Every time Claude writes a file, your formatter runs. Every time Claude is about to execute a command, your safety check fires. The workshop polices itself.

The workflow in practice feels like directing an apprentice who can read, write, and execute at superhuman speed. You say: "Add a password strength meter to the registration page. It should check length, special characters, and common passwords. Write tests." Claude explores your codebase to understand the existing registration flow, examines your test patterns, writes the implementation, writes the tests, runs them, fixes failures, and presents you with a working feature --- often in under a minute.

This is not automation in the old sense. Automation follows a script. Claude Code reasons about your specific codebase, makes judgments about architecture, and adapts to what it finds. It is the difference between a CNC machine that follows G-code and a master builder who studies the grain of the wood before cutting.

The African builder who installs Claude Code gains a workshop that never tires, that knows every programming language, that can read documentation faster than any human, and that improves with every model update. The sovereignty is yours: your CLAUDE.md, your hooks, your codebase, your decisions. Claude Code is the workshop. You remain the builder.

And what a workshop it is --- one where the distance between intention and implementation collapses to the speed of language itself.

---

### Letter 12: On Agents and the Village of Specialists

Dear Reader,

No village has ever prospered under the labor of a single person. The blacksmith forges the hoe, the farmer tills the soil, the weaver makes the cloth, the healer tends the sick, the griot preserves the memory. Each specialist possesses tools and knowledge that the others lack, yet they cooperate through the shared protocols of village life --- the market, the council, the festival. The village thrives not because any one person can do everything, but because each person does one thing excellently and they all communicate.

An AI agent is a specialist. It is a language model equipped with tools and placed inside a loop. The loop is the heartbeat of agency, and it is elegantly simple: observe the current state, think about what to do, act using a tool, observe the result, think again, act again, and continue until the task is complete or the agent decides it cannot proceed.

```python
# The agent loop in its purest form
import anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Find all Python files with SQL injection vulnerabilities"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=[
            {"name": "read_file", "description": "Read a file from disk",
             "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}}},
            {"name": "list_directory", "description": "List files in a directory",
             "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}}},
            {"name": "run_grep", "description": "Search files for a pattern",
             "input_schema": {"type": "object", "properties": {"pattern": {"type": "string"}, "path": {"type": "string"}}}}
        ],
        messages=messages
    )

    # If Claude is done, print the result and exit
    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    # If Claude wants to use a tool, execute it and feed the result back
    if response.stop_reason == "tool_use":
        tool_block = next(b for b in response.content if b.type == "tool_use")
        result = execute_tool(tool_block.name, tool_block.input)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": [
            {"type": "tool_result", "tool_use_id": tool_block.id, "content": result}
        ]})
```

Observe the structure. Claude receives the user's request, considers which tool to use, calls it, receives the result, reasons about what it learned, and decides whether to call another tool or deliver a final answer. This is not a script. It is a reasoning loop. The model decides which tools to use, in what order, with what arguments, based on what it discovers along the way. The security auditing agent above might start by listing directories, then grep for SQL patterns, then read suspicious files to confirm, then summarize its findings --- a chain of decisions no human pre-programmed.

The Anthropic Agent SDK provides the scaffolding for building custom agents:

```python
from claude_agent_sdk import Agent, tool

class ResearchAgent(Agent):
    """An agent that researches a topic across multiple sources."""

    @tool
    def search_web(self, query: str) -> str:
        """Search the web for information."""
        return web_search(query)

    @tool
    def read_url(self, url: str) -> str:
        """Read and extract text from a URL."""
        return fetch_and_extract(url)

    @tool
    def save_notes(self, topic: str, content: str) -> str:
        """Save research notes to a file."""
        with open(f"research/{topic}.md", "w") as f:
            f.write(content)
        return f"Saved notes on {topic}"
```

Different tasks demand different levels of autonomy. A research agent might be given full autonomy to browse and take notes. A deployment agent might require human approval before each action. A financial agent might be constrained to read-only access. The builder chooses the trust level:

```python
# Conservative: ask before every action
agent = Agent(autonomy="confirm_each")

# Moderate: ask before destructive actions only
agent = Agent(autonomy="confirm_destructive")

# Full trust: execute everything autonomously
agent = Agent(autonomy="full_auto")
```

The village analogy is precise in its structure, not merely poetic. Each specialist (agent) has a defined role, possesses specific tools, communicates through a shared protocol (messages), and operates with a degree of autonomy appropriate to their domain. The blacksmith does not ask the chief before every hammer stroke, but the chief is consulted before the forge is moved. Autonomy and oversight coexist, as they must.

The African builder who grasps the agent pattern holds a skeleton key. Any expertise that can be decomposed into observe-think-act can be encoded as an agent. A customer support agent that reads tickets and drafts responses. A data analysis agent that queries databases and produces reports. A content moderation agent that reviews submissions and flags violations. The specialist village scales without limit, and each specialist costs nothing to train --- only to instruct.

The village that once needed a generation to assemble its specialists can now compose them in an afternoon.

---

### Letter 13: On MCP and the Sovereign Senses

Dear Reader,

Imagine arriving at a great market --- say the Onitsha Main Market, the largest in West Africa, where over thirty thousand traders occupy a labyrinth of stalls stretching across acres. Each stall offers different goods: electronics here, textiles there, automobile parts in the next alley, spices around the corner. Now imagine that every stall spoke a different language, accepted a different currency, and used a different system of weights and measures. Commerce would grind to a halt. What makes Onitsha function is that despite the staggering diversity of goods, there exists a shared protocol: Nigerian naira for payment, Igbo and pidgin English for communication, established customs for bargaining and credit.

The Model Context Protocol --- MCP --- is this shared protocol for AI. It is an open standard that allows Claude to connect to any external data source or tool through a single, unified interface. Without MCP, connecting Claude to your database requires writing custom integration code. Connecting it to your file system requires different custom code. Connecting it to your API requires yet more. With MCP, every data source speaks the same protocol, and Claude can access them all.

An MCP server is a small program that exposes resources and tools through the protocol. Here is a minimal example --- a server that gives Claude access to a PostgreSQL database:

```python
from mcp.server import Server
from mcp.types import Tool, TextContent
import asyncpg

server = Server("postgres-mcp")

@server.tool()
async def query_database(sql: str) -> str:
    """Execute a read-only SQL query and return results."""
    conn = await asyncpg.connect("postgresql://user:pass@localhost/mydb")
    try:
        rows = await conn.fetch(sql)
        return "\n".join(str(dict(row)) for row in rows)
    finally:
        await conn.close()

@server.tool()
async def list_tables() -> str:
    """List all tables in the database."""
    conn = await asyncpg.connect("postgresql://user:pass@localhost/mydb")
    try:
        rows = await conn.fetch(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        )
        return "\n".join(row["table_name"] for row in rows)
    finally:
        await conn.close()

if __name__ == "__main__":
    server.run()
```

To connect this server to Claude Code, you add it to your settings:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "python",
      "args": ["mcp_postgres_server.py"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

Now Claude can query your database, list your tables, and read your files --- all through the same protocol. You can add as many MCP servers as you need: one for your CRM, one for your monitoring system, one for your internal wiki, one for your deployment pipeline. Each server is a stall in the market, and Claude is the trader who speaks the universal language.

The power of this architecture becomes clear when you consider what it enables. A developer in Nairobi can build an MCP server that exposes M-Pesa transaction data. A researcher in Accra can build one that exposes agricultural satellite imagery. A startup in Lagos can build one that exposes their customer support database. Each server is independent, maintained by the people who understand the data best, and instantly accessible to any Claude-powered agent.

MCP servers can expose not just tools but also resources --- structured data that Claude can read:

```python
@server.resource("schema://tables/{table_name}")
async def get_table_schema(table_name: str) -> str:
    """Return the schema of a specific table."""
    conn = await asyncpg.connect("postgresql://user:pass@localhost/mydb")
    try:
        columns = await conn.fetch(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
            table_name
        )
        return "\n".join(f"{col['column_name']}: {col['data_type']}" for col in columns)
    finally:
        await conn.close()
```

The market analogy is structurally precise. MCP is the protocol that standardizes the interface between AI and data, just as the conventions of the marketplace standardize the interface between buyer and seller. The goods behind each stall are wildly different --- databases, file systems, APIs, hardware sensors --- but the protocol for accessing them is uniform. This uniformity is what makes the system composable. Add a new stall, and every trader can immediately access it.

The builder who understands MCP can give Claude eyes to see their data, hands to operate their tools, and ears to hear their systems. The model becomes not an isolated intelligence but a connected one --- an intelligence with senses. And senses, as every builder knows, are what transform potential into perception, and perception into action.

---

### Letter 14: On Multi-Agent Systems and the Council

Dear Reader,

In every African society I have studied, there exists some form of the council. The Igbo have the council of elders, the oha na eze. The Akan have the council of chiefs and queen mothers. The Tswana have the kgotla, where any citizen may speak. The structures differ, but the principle is universal: complex decisions that affect the community require multiple perspectives, deliberation, and coordination. No single elder, however wise, possesses the full view.

Multi-agent systems apply this principle to artificial intelligence. Instead of one model attempting everything, you compose multiple specialized agents, each with their own tools and expertise, coordinated by an orchestrator that assigns tasks, gathers results, and synthesizes conclusions. The council pattern.

The simplest multi-agent architecture is the orchestrator-specialist model. One agent acts as the chief --- receiving the user's request, decomposing it into subtasks, dispatching those subtasks to specialist agents, and assembling their outputs into a coherent response.

```python
import anthropic

client = anthropic.Anthropic()

def run_specialist(role: str, task: str, tools: list) -> str:
    """Run a specialist agent with specific tools and instructions."""
    messages = [{"role": "user", "content": task}]
    system = f"You are a {role} specialist. Complete the assigned task precisely."

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system,
            tools=tools,
            messages=messages
        )
        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if hasattr(b, "text"))
        if response.stop_reason == "tool_use":
            tool_block = next(b for b in response.content if b.type == "tool_use")
            result = execute_tool(tool_block.name, tool_block.input)
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": [
                {"type": "tool_result", "tool_use_id": tool_block.id, "content": result}
            ]})

def orchestrator(request: str) -> str:
    """Decompose a request, dispatch to specialists, synthesize."""
    # Step 1: Plan
    plan = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content":
            f"Decompose this request into specialist tasks: {request}\n"
            "Output JSON: [{\"role\": \"...\", \"task\": \"...\"}]"
        }]
    ).content[0].text

    # Step 2: Dispatch to specialists (can run in parallel)
    import json, concurrent.futures
    tasks = json.loads(plan)
    with concurrent.futures.ThreadPoolExecutor() as pool:
        futures = {
            pool.submit(run_specialist, t["role"], t["task"], get_tools(t["role"])): t
            for t in tasks
        }
        results = {
            futures[f]["role"]: f.result()
            for f in concurrent.futures.as_completed(futures)
        }

    # Step 3: Synthesize
    synthesis = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[{"role": "user", "content":
            f"Original request: {request}\n\nSpecialist results:\n" +
            "\n".join(f"[{role}]: {result}" for role, result in results.items()) +
            "\n\nSynthesize these into a complete response."
        }]
    ).content[0].text

    return synthesis
```

Notice the structure. The orchestrator decomposes the problem into specialist tasks, dispatches them in parallel using a thread pool, collects the results, and synthesizes a unified response. The specialists run independently --- a research agent searching the web, a code agent writing implementation, a testing agent verifying correctness --- and their results converge at the orchestrator.

In Claude Code, the subagent pattern lets you launch specialized agents for subtasks within a session. The main agent might realize it needs deep research on a library's API, spawn a subagent to investigate, receive the findings, and continue its work. This is the elder who sends a young messenger to gather information from a distant village and then incorporates the news into the council's deliberation.

Communication between agents follows the same principle as communication between council members: shared context. In the code above, context flows through the orchestrator's synthesis step. In more sophisticated systems, agents might share a common document or workspace --- a digital equivalent of the palaver tree's open forum where all speech is heard by all present.

The council pattern excels where a single agent would struggle. Consider a complex feature request: "Build a customer dashboard with real-time analytics, authentication, and responsive design." An orchestrator might dispatch a backend agent to design the API, a frontend agent to build the UI, a database agent to design the schema, and a testing agent to write end-to-end tests. Each specialist works in its domain of expertise, and the orchestrator ensures their outputs are compatible.

The power, and the risk, of the council lies in coordination. A council where elders speak past each other produces confusion, not wisdom. A multi-agent system where specialists contradict each other produces broken software. The orchestrator must be skilled in decomposition --- splitting the task along natural seams --- and in synthesis --- reconciling diverse outputs into a coherent whole. This is the chief's art: not to know everything, but to know who knows what, and how their knowledge fits together.

The African builder who masters the council pattern can compose intelligence the way a village composes labor: each specialist excellent in their domain, the whole greater than the sum, and the coordination handled by a single clear-eyed leader who understands the shape of the problem.

---

### Letter 15: On RAG and the Library That Remembers

Dear Reader,

In the fourteenth century, the city of Timbuktu housed libraries of staggering scope. The Sankore Madrasah alone is said to have contained over seven hundred thousand manuscripts --- treatises on astronomy, medicine, jurisprudence, mathematics, and theology, written in Arabic, Fulfulde, Songhai, and other languages of the Sahel. When a scholar arrived seeking knowledge of, say, the mathematics of inheritance law, they did not read all seven hundred thousand manuscripts. They consulted a librarian --- a specialist who knew the collection, who could match a question to the relevant manuscripts, and who would retrieve precisely the texts the scholar needed.

Retrieval-Augmented Generation --- RAG --- is this librarian. It is a technique for connecting a language model to a body of knowledge too large to fit in a single prompt, and it works by retrieving the relevant portions of that knowledge at query time and injecting them into the model's context.

The mechanism has three stages: indexing, retrieval, and generation. Let us examine each.

First, indexing. Your documents --- company policies, technical manuals, research papers, whatever corpus you wish Claude to reason over --- are split into chunks and converted into embeddings. An embedding is a vector of numbers that captures the semantic meaning of a chunk. The sentence "How do I reset my password?" and the passage "To reset your password, navigate to Settings > Security > Reset" will have similar embeddings, because they are semantically related, even though they share few words.

```python
import anthropic
import numpy as np

client = anthropic.Anthropic()

def embed_texts(texts: list[str]) -> list[list[float]]:
    """Convert texts to embedding vectors using Voyage AI."""
    import voyageai
    vo = voyageai.Client()
    result = vo.embed(texts, model="voyage-3", input_type="document")
    return result.embeddings

def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Split a document into overlapping chunks."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

# Index a corpus
documents = load_all_documents("knowledge_base/")
all_chunks = []
all_embeddings = []
for doc in documents:
    chunks = chunk_document(doc.text)
    embeddings = embed_texts(chunks)
    all_chunks.extend(chunks)
    all_embeddings.extend(embeddings)

# Store in a vector database
embedding_matrix = np.array(all_embeddings)
```

Second, retrieval. When a user asks a question, the question itself is embedded into the same vector space, and the chunks whose embeddings are closest to the question embedding are retrieved. "Closest" is typically measured by cosine similarity --- the cosine of the angle between two vectors in the high-dimensional space.

```python
def retrieve(query: str, top_k: int = 5) -> list[str]:
    """Find the most relevant chunks for a query."""
    query_embedding = embed_texts([query])[0]
    query_vec = np.array(query_embedding)

    # Cosine similarity against all stored embeddings
    similarities = embedding_matrix @ query_vec / (
        np.linalg.norm(embedding_matrix, axis=1) * np.linalg.norm(query_vec)
    )

    # Return the top-k most similar chunks
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [all_chunks[i] for i in top_indices]
```

Third, generation. The retrieved chunks are injected into Claude's context alongside the user's question, and Claude reasons over both to produce an answer grounded in the actual documents.

```python
def rag_query(question: str) -> str:
    """Answer a question using retrieval-augmented generation."""
    relevant_chunks = retrieve(question, top_k=5)
    context = "\n\n---\n\n".join(relevant_chunks)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content":
            f"Answer this question using ONLY the provided context. "
            f"If the context doesn't contain the answer, say so.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {question}"
        }]
    )
    return response.content[0].text
```

The decision of when to use RAG versus other approaches follows a clear framework. If your knowledge fits within a single prompt (under 200,000 tokens), simply include it --- no retrieval needed. If your knowledge is larger but relatively static, RAG is ideal. If you need the model to deeply internalize a style or domain, fine-tuning may be more appropriate. If you need real-time data, pair RAG with live API calls.

For the African builder, RAG is transformative. Consider a health worker in rural Tanzania who needs to look up drug interactions. The corpus of pharmaceutical data is too large for any prompt, but a RAG system can retrieve the relevant entries in milliseconds and present them through Claude's reasoning. A legal aid organization in Kenya can build a RAG system over the entire body of Kenyan statute law, giving citizens access to legal knowledge through natural language questions. A university in Ghana can index its entire library catalog and let students research across hundreds of thousands of documents.

The Timbuktu librarian's craft was not diminished by the printing press. It was amplified. RAG amplifies Claude in the same way: not by making the model larger, but by giving it a library to consult. The intelligence was always there, in the model. The knowledge was always there, in the documents. RAG is the act of introduction between them --- and from that introduction, understanding flows.

---

## Part IV: The Sovereign
*On building AI that serves the builder, not the platform*

---

### Letter 16: On Vision and the Eye That Reads

Dear Reader,

The elder who reads signs has always been honored. In the Kalahari, the San tracker reads stories in the sand --- this print is a kudu, male, limping on the left foreleg, passing three hours ago. On the savanna, the Maasai herder reads the sky --- those clouds mean rain in two days, move the cattle east. In the market, the experienced trader reads the crowd --- heavy foot traffic near the textile stalls means a festival is approaching, stock up on cloth.

Claude possesses a form of this reading. When you send an image alongside text, Claude sees it --- not in the mystical sense, but in the computational sense we explored in earlier letters. The model processes the image's pixels through its vision encoder and reasons about the visual content with the same attention mechanism it applies to text. It reads photographs, screenshots, diagrams, handwritten notes, maps, receipts, and technical drawings.

The interface is straightforward:

```python
import anthropic
import base64

client = anthropic.Anthropic()

# From a file
def analyze_image(image_path: str, question: str) -> str:
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_data
                }},
                {"type": "text", "text": question}
            ]
        }]
    )
    return response.content[0].text

# Analyze a receipt
result = analyze_image("receipt.jpg", "Extract all line items with prices as JSON")

# Read handwritten notes
result = analyze_image("whiteboard.jpg", "Transcribe the text on this whiteboard")

# Analyze a system architecture diagram
result = analyze_image("architecture.png",
    "Describe this system architecture. Identify potential bottlenecks.")
```

You can also pass images by URL, which is useful when processing web content:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {"type": "image", "source": {
                "type": "url",
                "url": "https://example.com/satellite-image.png"
            }},
            {"type": "text", "text":
                "This is a satellite image of farmland in the Niger Delta. "
                "Identify areas of potential crop stress or flooding."}
        ]
    }]
)
```

The power of this capability for African builders cannot be overstated. Consider the paper economy that still dominates much of the continent. Government records in filing cabinets. Receipts scrawled by hand. Land titles in colonial-era ledgers. Medical records on paper forms. A builder in Lagos can photograph a stack of handwritten invoices and have Claude extract every line item into a structured database. A researcher in Addis Ababa can photograph pages from the National Archives and have Claude transcribe and translate them. A health worker in Mombasa can photograph a patient's drug packaging and have Claude identify the medication, dosage, and contraindications.

Multiple images can be sent in a single request, enabling comparison:

```python
messages = [{
    "role": "user",
    "content": [
        {"type": "image", "source": {"type": "base64", "media_type": "image/png",
            "data": encode_image("field_january.png")}},
        {"type": "image", "source": {"type": "base64", "media_type": "image/png",
            "data": encode_image("field_march.png")}},
        {"type": "text", "text":
            "These are satellite images of the same maize field, taken in January "
            "and March. Compare crop density and identify areas of concern."}
    ]
}]
```

Claude's vision is not infallible. It can misread small text, struggle with low-resolution images, and occasionally hallucinate details in ambiguous photographs. The builder who uses vision in production must validate critical extractions, provide clear images, and design systems that flag low-confidence results for human review.

But the eye that reads has opened, and it reads in every language, every script, every format. The San tracker reads the sand with decades of training. Claude reads the image with billions of parameters. Both are pattern recognition. Both are intelligence applied to perception. And the builder who connects this eye to their domain --- their receipts, their fields, their archives --- gains a sense that no amount of manual labor could replicate.

---

### Letter 17: On Extended Thinking and the Elder's Deliberation

Dear Reader,

There is a quality shared by every great leader I have encountered in African life, from the village chief to the corporate executive: the willingness to pause. When a question of real weight arrives --- a land dispute, a marriage negotiation, a business crisis --- the wise elder does not blurt the first thought that surfaces. They say, "Let me think on this." They retreat into deliberation. They consider the angles, weigh the precedents, test the consequences. And when they return, their judgment carries the authority of considered thought.

Extended thinking gives Claude this same capacity for deliberation. In standard mode, Claude reasons and responds in a single fluid motion. In extended thinking mode, Claude is granted a dedicated reasoning space --- a thinking budget --- where it can work through complex problems step by step before producing its final answer.

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # Up to 10,000 tokens of deliberation
    },
    messages=[{
        "role": "user",
        "content":
            "Design a database schema for a mobile money system that handles "
            "deposits, withdrawals, transfers, and bill payments. The system must "
            "support 10 million users across 5 countries with different currencies. "
            "Consider partitioning, indexing, and consistency guarantees."
    }]
)

# The response contains both thinking and text blocks
for block in response.content:
    if block.type == "thinking":
        print("=== Claude's deliberation ===")
        print(block.thinking)
    elif block.type == "text":
        print("=== Final answer ===")
        print(block.text)
```

The thinking block is where Claude works through the problem: considering trade-offs, exploring alternatives, catching its own errors, and refining its approach. For the database schema problem above, Claude might spend its thinking budget considering whether to use UUID or BIGINT for primary keys, evaluating the trade-offs of horizontal partitioning by country versus by user ID range, reasoning about whether to use eventual consistency for balance reads or strong consistency for transfers, and designing the indexing strategy for common query patterns.

The budget_tokens parameter controls how much thinking time Claude gets. A simple question might need only 1,000 tokens of thought. A complex architectural decision might benefit from 50,000. The builder controls the dial:

```python
# Quick clarification: minimal thinking
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    thinking={"type": "enabled", "budget_tokens": 1024},
    messages=[{"role": "user", "content": "What's the time complexity of heapsort?"}]
)

# Complex analysis: deep thinking
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 50000},
    messages=[{"role": "user", "content":
        "Review this codebase for security vulnerabilities. Consider "
        "injection attacks, authentication flaws, data exposure, and "
        "race conditions. Prioritize by severity."}]
)
```

When should you enable extended thinking? The framework is simple. For questions with clear, well-known answers --- "How do I reverse a string in Python?" --- standard mode suffices. For questions requiring multi-step reasoning, architectural judgment, complex analysis, or creative problem-solving, extended thinking produces measurably better results. The rule of thumb: if the elder would say "Let me think on this," enable extended thinking.

Extended thinking also shines for code generation. When Claude thinks before writing, it considers edge cases, plans the architecture, and produces more robust implementations. The thinking budget is an investment: you spend tokens on deliberation to save tokens on debugging.

The thinking block is inspectable. You can read Claude's reasoning, understand how it arrived at its conclusions, and identify where its logic might be flawed. This transparency is the opposite of a black box. It is the elder thinking aloud at the council, where every step of the reasoning is open to scrutiny.

The deliberation costs nothing extra per token beyond the standard rate for the thinking tokens consumed. The return on that investment --- fewer errors, better architecture, more thorough analysis --- is substantial. The builder who learns to use extended thinking for the right problems gains not a faster model but a wiser one.

And wisdom, as every African proverb tradition teaches, is worth more than speed.

---

### Letter 18: On Prompt Caching and the Griot's Rehearsed Passages

Dear Reader,

If you have ever sat at the feet of a griot in the Mande tradition, you will have noticed something about the structure of their performance. The opening invocation --- the genealogical recitation, the praise of the host's lineage, the invocation of the ancestors --- flows with an ease that no improvisation could achieve. These passages are not composed fresh each time. They are rehearsed to such perfection that the griot can deliver them while reserving their creative energy for the spontaneous passages: the interpolations, the commentary on current events, the improvised praise that makes each performance unique.

Prompt caching applies this same principle to the Claude API. Many applications send the same content to Claude repeatedly --- a system prompt describing the application's behavior, a reference document containing company policies, a set of few-shot examples demonstrating the desired output format. Without caching, Claude must re-read this content on every request, and you pay for every token every time. With caching, you mark the stable content, the server processes it once, and subsequent requests reuse the cached representation at a fraction of the cost.

```python
import anthropic

client = anthropic.Anthropic()

# The system prompt and reference document are stable across requests
# Mark them with cache_control for server-side caching
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    system=[
        {
            "type": "text",
            "text": "You are a customer support agent for SafariPay, a mobile money "
                    "platform operating in Kenya, Tanzania, and Uganda. You help users "
                    "with account issues, transactions, and security concerns. Always "
                    "respond in the user's language. Follow company policies exactly.",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": COMPANY_POLICY_DOCUMENT,  # 50,000 tokens of policy
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Simu yangu iliibiwa. Nawezaje kulinda akaunti yangu?"}
    ]
)
```

The economics are compelling. Input tokens that hit the cache cost 90% less than uncached input tokens. If your system prompt and reference documents total 50,000 tokens, and you handle 10,000 customer queries per day, the savings are enormous:

```
Without caching:  50,000 tokens x 10,000 requests x $3/M tokens = $1,500/day
With caching:     50,000 tokens x 10,000 requests x $0.30/M tokens = $150/day
Savings: $1,350/day = $40,500/month
```

There is a small additional cost for the initial cache write, but it is amortized across all subsequent cache hits. The cache has a minimum lifetime of five minutes, refreshed with each hit, so active applications maintain their cache indefinitely.

The placement of `cache_control` markers matters. You should place them at the boundary between stable and variable content:

```python
system = [
    # Stable: system instructions (cached)
    {"type": "text", "text": SYSTEM_INSTRUCTIONS,
     "cache_control": {"type": "ephemeral"}},

    # Stable: reference documents (cached)
    {"type": "text", "text": REFERENCE_DOCS,
     "cache_control": {"type": "ephemeral"}},

    # Variable: today's context (NOT cached)
    {"type": "text", "text": f"Today is {today}. Current promotions: {promotions}"}
]
```

Few-shot examples are another excellent candidate for caching. If you provide five examples of the desired input-output format, those examples are identical across every request and should be cached:

```python
messages = [
    {"role": "user", "content": "Translate: The market opens at dawn",
     "cache_control": {"type": "ephemeral"}},
    {"role": "assistant", "content": "Soko linafunguka alfajiri"},
    {"role": "user", "content": "Translate: The rains will come soon",
     "cache_control": {"type": "ephemeral"}},
    {"role": "assistant", "content": "Mvua itakuja hivi karibuni"},
    # The actual request (not cached)
    {"role": "user", "content": f"Translate: {user_input}"}
]
```

The griot's wisdom applies directly. Identify what is rehearsed --- what repeats across every performance --- and invest the effort of perfection there. Reserve the creative energy, and the cost, for what varies. The griot does not improvise the genealogy. The API should not re-read the system prompt. Both are acts of efficiency that enable excellence where it matters most.

The builder who caches well does not merely save money. They build applications that can afford to include richer context, more thorough instructions, and more detailed reference documents --- because the marginal cost of that richness, once cached, approaches zero. Generosity in context becomes affordable, and affordable generosity produces better results.

---

### Letter 19: On Batches and the Caravan of Queries

Dear Reader,

The great caravans of the Sahara did not carry a single bale of salt from Taghaza to Timbuktu. That would have been absurdly wasteful --- the cost of the journey borne by a single bale. Instead, the caravan assembled hundreds of camels, loaded thousands of bales, and departed as a unified expedition. The per-bale cost of transport plummeted. The risk was shared. The journey, made once, served many purposes simultaneously.

The Message Batches API is this caravan. It allows you to submit up to ten thousand requests in a single batch, and Anthropic processes them asynchronously within a twenty-four-hour window, at fifty percent of the standard per-token cost. The trade-off is explicit: you sacrifice real-time response for dramatically lower cost and higher throughput.

```python
import anthropic

client = anthropic.Anthropic()

# Prepare a batch of requests
requests = []
for i, ticket in enumerate(support_tickets):
    requests.append({
        "custom_id": f"ticket-{ticket.id}",
        "params": {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 1024,
            "messages": [{
                "role": "user",
                "content": f"Classify this customer support ticket into one of these "
                           f"categories: billing, technical, account, feedback, other. "
                           f"Then draft a response.\n\nTicket: {ticket.text}"
            }]
        }
    })

# Submit the batch
batch = client.messages.batches.create(requests=requests)
print(f"Batch submitted: {batch.id}")
print(f"Status: {batch.processing_status}")  # "in_progress"
```

Retrieval is equally straightforward. You poll for completion, then iterate over results:

```python
import time

# Poll for completion
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    print(f"Progress: {batch.request_counts.succeeded} / {batch.request_counts.total}")
    time.sleep(60)

# Retrieve results
for result in client.messages.batches.results(batch.id):
    ticket_id = result.custom_id
    if result.result.type == "succeeded":
        response_text = result.result.message.content[0].text
        save_classification(ticket_id, response_text)
    else:
        log_error(ticket_id, result.result.error)
```

The use cases cluster around a common property: tasks where latency tolerance is high but volume is also high. Processing a dataset of ten thousand customer reviews. Generating product descriptions for an entire catalog. Analyzing a year's worth of financial reports. Translating a documentation corpus. Evaluating a test suite of model outputs. In each case, the individual request is not urgent, but the aggregate volume makes per-token cost the dominant concern.

Consider a practical African example. An agricultural extension service wants to analyze soil test reports from ten thousand farms across the Rift Valley. Each report is a scanned PDF (processed through vision) that needs to be converted to structured data with recommendations:

```python
requests = []
for farm in farms:
    requests.append({
        "custom_id": f"farm-{farm.id}",
        "params": {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 2048,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image", "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": farm.soil_report_image_b64
                    }},
                    {"type": "text", "text":
                        "Extract all values from this soil test report as JSON. "
                        "Then provide 3 specific recommendations for improving "
                        "maize yield based on the soil composition."}
                ]
            }]
        }
    })

batch = client.messages.batches.create(requests=requests)
```

At standard pricing, processing ten thousand soil reports might cost $500. With batch pricing, the same analysis costs $250. The savings fund more tests, more analysis, more farms served. The caravan makes the journey affordable.

The decision between real-time and batch is the decision between the messenger and the caravan. If the farmer needs an answer now --- "Is this plant diseased?" --- use the real-time API. If the extension service is analyzing the entire season's data --- use batches. The urgency of the question determines the mode of transport.

Batches also pair beautifully with prompt caching. If every request in your batch shares the same system prompt and reference documents, cache them. The cached content is processed once, and all ten thousand requests benefit. The caravan carries a shared map.

The builder who masters batches thinks in volumes, not units. They ask: "What would I do if I could analyze everything?" And the answer is: you can. The caravan departs at dawn, loaded with ten thousand questions, and returns by nightfall with ten thousand answers. The cost of intelligence, at scale, drops by half. The Saharan traders would approve.

---

### Letter 20: On Safety and the Wisdom of Restraint

Dear Reader,

In every wisdom tradition I know --- Yoruba, Akan, Maasai, Zulu, Hausa --- there are certain teachings that the elder will not share with the uninitiated. This is not cruelty and not ignorance. It is the recognition that knowledge, like a machete, serves or destroys depending on the hand that wields it. The Ifa priest does not reveal the deepest odu to the casual inquirer. The herbalist does not teach the preparation of powerful medicines to children. Restraint is not the absence of knowledge. It is the governance of its release.

Claude is built with restraint at its foundation. The approach is called Constitutional AI, and it is worth understanding because it shapes every interaction you will have with the model.

Traditional AI training uses human feedback to steer the model: human raters evaluate outputs and the model learns from their preferences. Constitutional AI extends this with a set of written principles --- a constitution --- that the model uses to evaluate and revise its own outputs. The model generates a response, critiques that response against the constitutional principles, and revises it. This self-critique loop, scaled across millions of examples during training, produces a model that is helpful, harmless, and honest --- not because it has been told specific things to avoid, but because it has internalized principles of good judgment.

Why does this matter for the builder? Because safety is not a constraint imposed on your application --- it is a feature your users depend on. Consider the failure modes:

```python
# An unsafe AI assistant for a health application
# BAD: No guardrails, no validation, no human oversight
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{"role": "user", "content": "What dosage of chloroquine for malaria?"}]
)
# Claude will provide general information but appropriately caveats with
# "consult a healthcare professional" — the safety training is working FOR you

# A well-designed health application
# GOOD: Guardrails, validation, human oversight
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    system=(
        "You are a health information assistant. You may provide general "
        "health education based on WHO and national guidelines. You must NEVER "
        "provide specific dosage recommendations. Always direct users to their "
        "nearest health facility for treatment decisions. If the user describes "
        "emergency symptoms, immediately advise them to call emergency services."
    ),
    messages=[{"role": "user", "content": "What dosage of chloroquine for malaria?"}]
)
```

The responsible builder designs multiple layers of safety:

**Input validation** --- screen incoming requests for patterns that indicate misuse. A customer support agent should reject inputs that attempt to extract system prompts or manipulate the model's behavior.

**System prompt design** --- clearly define what the model should and should not do. Be explicit. "Never provide specific medical dosages" is clearer than "be careful with medical information."

**Output validation** --- check the model's responses before delivering them to users. For critical applications, this might mean a second Claude call that evaluates the first response for policy compliance.

**Human-in-the-loop** --- for high-stakes decisions, require human review before action. A loan approval agent should recommend, not decide. A medical triage agent should flag, not diagnose.

```python
def safe_response(user_input: str, system_prompt: str) -> dict:
    """Generate a response with safety checks."""

    # Input screening
    if contains_injection_pattern(user_input):
        return {"status": "blocked", "reason": "suspicious input pattern"}

    # Generate response
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=system_prompt,
        messages=[{"role": "user", "content": user_input}]
    )
    response_text = response.content[0].text

    # Output validation
    validation = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content":
            f"Does this response comply with our safety policy? "
            f"Answer YES or NO with a brief reason.\n\n"
            f"Policy: {SAFETY_POLICY}\n\n"
            f"Response: {response_text}"}]
    )

    if "NO" in validation.content[0].text.upper():
        return {"status": "flagged", "response": response_text,
                "reason": validation.content[0].text}

    return {"status": "approved", "response": response_text}
```

The African context makes safety particularly important. AI systems deployed in communities with limited digital literacy must be especially careful not to present speculative information as fact. An agricultural advisor that confidently recommends the wrong pesticide could destroy a season's harvest. A financial advisor that recommends a fraudulent investment could devastate a family's savings. A health advisor that misidentifies symptoms could cost a life.

The builder's responsibility is sovereign. You choose what your AI does. You design the guardrails. You decide the autonomy level. Claude's built-in safety training is a foundation, not a ceiling. The elder's restraint is not imposed from outside --- it comes from understanding that power without wisdom is destruction.

Anthropic's usage policy prohibits specific categories of harm: generating CSAM, creating bioweapons instructions, facilitating mass surveillance. These are hard limits. Within those limits, the builder has wide latitude --- and with that latitude comes responsibility. The Akan proverb says: "The axe forgets, but the tree remembers." Every output your system produces carries your name. Build as though the tree remembers.

And here is the deepest truth about safety in AI: it is not the enemy of capability. It is the condition for trust. And trust is the condition for adoption. And adoption is the condition for impact. The builder who ships a safe, trustworthy system that serves a hundred thousand people does more good than the builder who ships a brilliant, reckless system that is shut down after a scandal. Restraint is not weakness. It is the wisdom that sustains.

---

## Part V: The Archmage
*On mastery, production systems, and the future*

---

### Letter 21: On Production Systems and the Factory Floor

Dear Reader,

Visit the Innoson Vehicle Manufacturing plant in Nnewi, Nigeria, and you will observe something that separates a factory from a workshop. The workshop builds one item at a time, relying on the craftsman's skill and attention. The factory builds thousands, and it does so not by having thousands of craftsmen but by having systems: quality control at every station, supply chains that deliver materials just in time, assembly lines where each step is defined and repeatable, testing protocols that catch defects before they reach the customer, and cost accounting that tracks every naira spent.

Moving an AI application from prototype to production requires the same transformation. The prototype works in your notebook. The production system works at three in the morning when you are asleep, handles a thousand concurrent users, recovers gracefully from failures, and costs what you budgeted. Let us examine the systems that make this possible.

**Error handling.** The Claude API, like any network service, can fail. The server may be overloaded. Your rate limit may be exhausted. The network may hiccup. A production system handles all of these:

```python
import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

client = anthropic.Anthropic()

@retry(
    retry=retry_if_exception_type((
        anthropic.RateLimitError,
        anthropic.APIConnectionError,
        anthropic.InternalServerError
    )),
    wait=wait_exponential(multiplier=1, min=1, max=60),
    stop=stop_after_attempt(5)
)
def reliable_completion(messages: list, system: str = None) -> str:
    """Make an API call with retry logic for transient failures."""
    kwargs = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 4096,
        "messages": messages
    }
    if system:
        kwargs["system"] = system

    try:
        response = client.messages.create(**kwargs)
        return response.content[0].text
    except anthropic.BadRequestError as e:
        # Don't retry client errors — fix the request
        log_error("bad_request", str(e))
        raise
    except anthropic.AuthenticationError:
        log_error("auth_failed", "Check API key")
        raise
```

**Monitoring.** You cannot improve what you cannot measure. Every production AI system should track:

```python
import time
import logging

logger = logging.getLogger("claude_production")

def monitored_completion(messages: list, request_id: str) -> dict:
    """API call with comprehensive monitoring."""
    start = time.time()

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=messages
        )
        elapsed = time.time() - start

        metrics = {
            "request_id": request_id,
            "model": response.model,
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "latency_seconds": elapsed,
            "stop_reason": response.stop_reason,
            "cost_usd": calculate_cost(response.usage)
        }
        logger.info("completion_success", extra=metrics)

        return {"text": response.content[0].text, "metrics": metrics}

    except Exception as e:
        elapsed = time.time() - start
        logger.error("completion_failed", extra={
            "request_id": request_id,
            "error_type": type(e).__name__,
            "error_message": str(e),
            "latency_seconds": elapsed
        })
        raise

def calculate_cost(usage) -> float:
    """Calculate the cost of a request in USD."""
    INPUT_COST_PER_M = 3.00   # Sonnet pricing
    OUTPUT_COST_PER_M = 15.00
    return (usage.input_tokens * INPUT_COST_PER_M +
            usage.output_tokens * OUTPUT_COST_PER_M) / 1_000_000
```

**Rate limiting and queuing.** If your application handles bursty traffic, you need a queue that respects API limits:

```python
import asyncio

class RateLimitedQueue:
    def __init__(self, max_concurrent: int = 10):
        self.semaphore = asyncio.Semaphore(max_concurrent)

    async def submit(self, messages: list) -> str:
        async with self.semaphore:
            return await asyncio.to_thread(reliable_completion, messages)

queue = RateLimitedQueue(max_concurrent=10)

# Process many requests without overwhelming the API
async def process_batch(items: list):
    tasks = [queue.submit(build_messages(item)) for item in items]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

**Testing AI systems.** You cannot unit-test a language model the way you test a deterministic function. The output varies. Instead, you build evaluation sets:

```python
eval_set = [
    {"input": "I can't login to my account",
     "expected_category": "account",
     "must_contain": ["reset", "password"],
     "must_not_contain": ["billing"]},
    {"input": "You charged me twice",
     "expected_category": "billing",
     "must_contain": ["refund", "transaction"],
     "must_not_contain": ["technical"]},
]

def run_evaluation(eval_set: list) -> dict:
    passed = 0
    for case in eval_set:
        result = reliable_completion([{"role": "user", "content": case["input"]}])
        result_lower = result.lower()

        checks = all([
            case["expected_category"] in result_lower,
            all(word in result_lower for word in case["must_contain"]),
            all(word not in result_lower for word in case["must_not_contain"])
        ])
        if checks:
            passed += 1
        else:
            logger.warning(f"FAIL: {case['input'][:50]}... -> {result[:100]}")

    return {"passed": passed, "total": len(eval_set),
            "rate": passed / len(eval_set)}
```

The factory floor is not glamorous. Error handling, monitoring, rate limiting, testing, cost tracking --- none of these appear in demos or blog posts. But they are what separate a toy from a tool. The Innoson factory produces vehicles that people trust with their lives, and that trust is built not on the brilliance of any single component but on the relentless discipline of the production system. Your AI application deserves the same discipline.

---

### Letter 22: On the Anthropic SDK and the Builder's Toolkit

Dear Reader,

The Jua Kali mechanic in Nairobi --- that sovereign artisan who forges tools from scrap metal and fixes any machine that rolls into the yard --- keeps a toolbox that would astonish a Western mechanic. Each tool is purpose-built. Each has been tested under conditions that would break a factory tool. Each is maintained with the care of a surgeon's instruments, because the mechanic's livelihood depends on them.

The Anthropic SDK is your toolbox for building with Claude. It exists in two languages --- Python and TypeScript --- and provides typed, idiomatic interfaces for every Claude capability. Let us walk through the toolkit.

**Installation and initialization:**

```bash
# Python
pip install anthropic

# TypeScript/Node.js
npm install @anthropic-ai/sdk
```

```python
import anthropic

# Initialize with API key (from ANTHROPIC_API_KEY env var by default)
client = anthropic.Anthropic()

# Or explicitly
client = anthropic.Anthropic(api_key="sk-ant-...")
```

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
```

**The Messages API --- the core:**

```python
# Basic message
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain M-Pesa's architecture in 3 paragraphs"}
    ]
)
print(response.content[0].text)

# With system prompt
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a Swahili language tutor. Respond in both Swahili and English.",
    messages=[
        {"role": "user", "content": "How do I say 'The market is busy today'?"}
    ]
)

# Multi-turn conversation
messages = [
    {"role": "user", "content": "What is a binary search tree?"},
    {"role": "assistant", "content": "A binary search tree is a data structure where..."},
    {"role": "user", "content": "How do I balance one?"}
]
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=messages
)
```

**Streaming --- for real-time applications:**

```python
# Stream responses token by token
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Write a business plan for a solar micro-grid"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript
// TypeScript streaming
const stream = client.messages.stream({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2048,
  messages: [{ role: "user", content: "Write a business plan for a solar micro-grid" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
```

**Tool use --- giving Claude capabilities:**

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=[{
        "name": "get_exchange_rate",
        "description": "Get current exchange rate between two currencies",
        "input_schema": {
            "type": "object",
            "properties": {
                "from_currency": {"type": "string", "description": "ISO 4217 code"},
                "to_currency": {"type": "string", "description": "ISO 4217 code"}
            },
            "required": ["from_currency", "to_currency"]
        }
    }],
    messages=[{
        "role": "user",
        "content": "How much is 50,000 KES in Nigerian Naira?"
    }]
)

# Claude will request the tool — execute it and return the result
for block in response.content:
    if block.type == "tool_use":
        rate = fetch_exchange_rate(block.input["from_currency"], block.input["to_currency"])
        # Feed the result back to Claude for final answer
```

**Error handling --- the types you need to know:**

```python
try:
    response = client.messages.create(...)
except anthropic.AuthenticationError:
    # Invalid API key — fix configuration
    pass
except anthropic.RateLimitError:
    # Too many requests — back off and retry
    pass
except anthropic.BadRequestError as e:
    # Invalid request — fix the parameters
    print(f"Bad request: {e.message}")
except anthropic.APIConnectionError:
    # Network issue — retry
    pass
except anthropic.InternalServerError:
    # Server issue — retry with backoff
    pass
```

**Advanced configuration:**

```python
# Custom timeout
client = anthropic.Anthropic(
    timeout=120.0,  # seconds
    max_retries=3   # built-in retry with backoff
)

# Async client for high-concurrency applications
async_client = anthropic.AsyncAnthropic()

async def concurrent_queries(questions: list[str]) -> list[str]:
    tasks = [
        async_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": q}]
        )
        for q in questions
    ]
    responses = await asyncio.gather(*tasks)
    return [r.content[0].text for r in responses]
```

The Jua Kali mechanic does not use every tool on every job. They reach for the right tool at the right moment. The builder who knows the SDK reaches for `stream()` when building a chat interface, `batches.create()` when processing a dataset, `messages.create()` with `tools` when building an agent, and the async client when handling concurrent users. Each method is a tool in the box, maintained and ready.

Know your toolkit. Keep it sharp. And when the machine rolls in --- whatever machine it is --- you will have the right tool at hand.

---

### Letter 23: On Building with Claude Code and the Apprentice Who Builds

Dear Reader,

In the guild traditions of Aba, Nigeria's leather capital, the apprentice's journey follows a well-known arc. Years of observation and practice. Mastery of each individual skill --- cutting, stitching, molding, finishing. And then the masterwork: a complete piece, start to finish, that demonstrates not just competence in each skill but the judgment to combine them. The masterwork is not a practice piece. It is a real product for a real customer, and it carries the apprentice's name.

This letter is about the masterwork. You have learned the API, the agents, the tools. Now let us build something real with Claude Code as our workshop, following the complete workflow from conception to deployment.

**Step 1: The CLAUDE.md --- your workshop rules.**

Every project begins with a CLAUDE.md that encodes your standards:

```markdown
# CLAUDE.md — Sovereign Marketplace API

## Architecture
- FastAPI application with PostgreSQL and Redis
- All endpoints under /api/v1/
- Authentication via JWT tokens
- Background tasks via Celery + Redis

## Conventions
- Type hints on all functions
- Pydantic models for request/response schemas
- Alembic for database migrations
- pytest for testing, minimum 80% coverage

## Commands
- `make test` — run all tests
- `make lint` — run ruff + mypy
- `make migrate` — apply database migrations
```

**Step 2: Plan before you build.**

In Claude Code, you describe what you want and let Claude explore:

```
You: I need a product catalog API. Products have a name, description,
     price in multiple currencies (KES, NGN, GHS, TZS), category,
     and images. I need CRUD endpoints, search with filters, and
     pagination. Plan the implementation before writing any code.
```

Claude Code will read your CLAUDE.md, examine your existing codebase, and propose a plan: database models, API endpoints, request/response schemas, and test strategy. You review and refine the plan before a single line of code is written.

**Step 3: Implement iteratively.**

```
You: Implement the plan. Start with the database models and migrations,
     then the CRUD endpoints, then search, then tests. Run tests after
     each step.
```

Claude Code now enters its agent loop. It creates the SQLAlchemy models, generates an Alembic migration, writes the CRUD endpoints with proper error handling, implements search with full-text indexing, writes comprehensive tests, runs them, and fixes any failures. You watch, intervene when judgment is needed, and let Claude handle the mechanical work.

**Step 4: Hooks enforce your standards.**

Configure hooks so that standards are enforced automatically:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "ruff check --fix $CLAUDE_FILE_PATH && mypy $CLAUDE_FILE_PATH"
        }]
      }
    ]
  }
}
```

Every file Claude writes is automatically linted and type-checked. If the linter finds issues, Claude sees the output and fixes them before moving on. The workshop polices itself.

**Step 5: Git integration.**

Claude Code manages git natively. It stages changes, writes commit messages, and can even create pull requests:

```
You: Commit the product catalog implementation with a descriptive message.

Claude: I'll commit the changes.
        [stages files, writes commit message, commits]
        Created commit: "Add product catalog API with multi-currency
        pricing, search, and full test coverage"
```

**Step 6: IDE integration.**

Claude Code works inside VS Code and JetBrains IDEs, appearing as a panel alongside your editor. You can highlight code and ask Claude to refactor it, select an error and ask Claude to fix it, or open the terminal panel for full interactive sessions.

**Step 7: Permissions and trust.**

Claude Code operates at different permission levels. By default, it asks before executing commands or writing files. You can expand permissions for trusted operations:

```json
{
  "permissions": {
    "allow": [
      "Bash(make test)",
      "Bash(make lint)",
      "Write(src/**)",
      "Write(tests/**)"
    ]
  }
}
```

This grants Claude autonomy to run tests, lint, and write code in your source and test directories without asking permission each time --- while still requiring approval for operations outside those boundaries.

The Letterverse itself --- the very library you are reading --- was built with Claude Code. The treatises were drafted in conversation, the reader application was built and debugged through the agent loop, the PWA architecture was designed and implemented iteratively, and every commit was made through Claude's git integration. This book is its own proof of concept.

The apprentice who has learned every skill and now builds their masterwork does not cease to be an apprentice in the sense of learning. They learn more from the masterwork than from all the practice pieces combined, because the masterwork reveals the gaps between knowing each skill and knowing how to combine them. Build your masterwork. Let Claude Code be your workshop. And let the product carry your name.

---

### Letter 24: On Sovereign AI and the Builder's Throne

Dear Reader,

There is a moment in the builder's journey when they look at the tools, the materials, the skills they have acquired, and they realize: I do not need to build for someone else. I can build for myself, for my community, for my own purpose. The carpenter who has spent years building furniture for the wealthy discovers that the same skills can build desks for the village school. The programmer who has built systems for foreign companies discovers that the same skills can build systems for their own market. This is sovereignty: not the rejection of tools from elsewhere, but the mastery of those tools in service of one's own vision.

Sovereign AI means AI that serves the builder, not the platform. It means understanding the full stack of costs, capabilities, and alternatives so that you --- not a vendor, not a distant corporation --- make the decisions about what AI does in your context.

**The sovereign stack:**

```
Your Application (your code, your rules)
    ↓
Claude API (powerful, managed, pay-per-use)
    ↓
Your Data (your databases, your documents, your MCP servers)
    ↓
Your Infrastructure (your servers, your deployment, your monitoring)
```

Every layer is under your control. You choose the model. You design the prompts. You set the safety guardrails. You own the data. You manage the infrastructure.

**Cost optimization --- the 80/20 of AI spending:**

Most AI applications follow a power law: a small number of request types account for most of the cost. Optimize those first:

```python
# The cost optimization hierarchy:
# 1. Cache what repeats (90% savings on cached tokens)
# 2. Use the right model for the task
# 3. Batch what can wait (50% savings)
# 4. Trim unnecessary context
# 5. Set appropriate max_tokens

# Model selection by task complexity
def choose_model(task_type: str) -> str:
    """Use the cheapest model that can handle the task well."""
    if task_type in ("classification", "extraction", "simple_qa"):
        return "claude-haiku-4-20250514"        # Fast and cheap
    elif task_type in ("coding", "analysis", "summarization"):
        return "claude-sonnet-4-20250514"        # Balanced
    elif task_type in ("architecture", "complex_reasoning", "research"):
        return "claude-opus-4-20250514"          # Maximum capability
    return "claude-sonnet-4-20250514"            # Default

# Context trimming: only send what matters
def trim_conversation(messages: list, max_turns: int = 10) -> list:
    """Keep only the most recent turns plus the system context."""
    if len(messages) <= max_turns * 2:
        return messages
    # Always keep the first message (often contains critical context)
    return messages[:1] + messages[-(max_turns * 2 - 1):]
```

**Building for Africa --- the specific constraints:**

```python
# Offline-first: cache responses for areas with intermittent connectivity
import sqlite3

def cached_query(question: str, cache_db: str = "ai_cache.db") -> str:
    """Check local cache before calling the API."""
    conn = sqlite3.connect(cache_db)
    cursor = conn.execute(
        "SELECT response FROM cache WHERE question = ? AND "
        "created_at > datetime('now', '-7 days')",
        (question,)
    )
    row = cursor.fetchone()
    if row:
        return row[0]  # Cache hit — no network needed

    # Cache miss — call API
    response = reliable_completion([{"role": "user", "content": question}])

    conn.execute(
        "INSERT INTO cache (question, response) VALUES (?, ?)",
        (question, response)
    )
    conn.commit()
    return response

# Multilingual support: detect language and respond in kind
def multilingual_system_prompt(supported_languages: list[str]) -> str:
    langs = ", ".join(supported_languages)
    return (
        f"You are a multilingual assistant supporting: {langs}. "
        f"Always detect the user's language and respond in the same language. "
        f"If the user code-switches (e.g., mixing English and Swahili), "
        f"match their code-switching pattern."
    )

# Low-bandwidth optimization: request concise responses
def bandwidth_conscious_prompt(question: str) -> list:
    return [{"role": "user", "content":
        f"{question}\n\nRespond concisely. Maximum 3 paragraphs. "
        f"Prioritize actionable information."}]
```

**Self-hosting for sensitive workloads:**

For applications where data must not leave your infrastructure --- health records, financial data, government documents --- local models provide an alternative:

```bash
# Run a local model with Ollama
ollama pull llama3
ollama serve

# Use the same code patterns with a local endpoint
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3", "prompt": "Summarize this patient record..."}'
```

Local models are less capable than Claude for complex reasoning, but they offer complete data sovereignty. The pragmatic builder uses both: Claude for tasks that benefit from maximum intelligence, local models for tasks where data sensitivity demands local processing.

The sovereign builder's posture is not anti-platform. It is pro-understanding. You use the Claude API because it provides capabilities that would cost millions to develop independently. But you understand what it does, what it costs, what it can and cannot do, and you maintain the ability to switch providers, reduce costs, or move workloads locally as your needs evolve.

Sovereignty is not isolation. It is the power to choose. The builder who sits on their own throne --- who understands their tools, owns their data, and serves their community --- cannot be displaced by a vendor's pricing change, a policy update, or a platform's strategic pivot. They are rooted, like the iroko tree, in their own soil.

---

### Letter 25: On the Future and the Seed That Contains the Forest

Dear Reader,

There is a tree in West Africa called the baobab. Its seed is small enough to hold between your fingers --- unpromising, dry, hard-shelled. Yet that seed contains the pattern for a tree that will grow for a thousand years, reach thirty meters in height, store a hundred thousand liters of water in its trunk, and shelter an entire village in its shade. The relationship between the seed and the tree is not one of growth alone. It is one of unfolding. Everything the tree will become is encoded in the seed. Time and conditions merely reveal it.

We are holding the seed of artificial intelligence. What we have today --- large language models that reason, see images, use tools, and write code --- is remarkable, but it is the seed, not the tree. Let us look honestly at what exists and then, with the careful optimism of the farmer who knows the seed, consider what is unfolding.

**What Claude can do today:**

Claude reads and writes in dozens of languages, including African languages that previous models ignored. It reasons about complex problems with extended thinking. It sees images and extracts structure from them. It uses tools and operates as an autonomous agent. It writes, debugs, and deploys code through Claude Code. It processes thousands of requests in batches. It connects to any data source through MCP. It does all of this through an API that any developer with an internet connection can access.

**Computer use --- Claude controlling a desktop:**

Claude can now operate a computer the way a human does: moving the mouse, clicking buttons, typing text, reading the screen. This capability, called computer use, means Claude can interact with any application that has a visual interface --- legacy software that has no API, government websites that require form filling, design tools that have no programmatic interface.

```python
# Claude can operate a computer through screenshots and actions
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    tools=[{
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1920,
        "display_height_px": 1080
    }],
    messages=[{
        "role": "user",
        "content": "Open the government tax portal, fill in my business returns "
                   "using the data in tax_data.json, and submit them."
    }]
)
```

For Africa, where much of the digital economy runs on web interfaces without APIs, computer use is a bridge technology. It automates what could not previously be automated, without requiring the underlying systems to change.

**Agent ecosystems --- agents that build agents:**

The next frontier is not a single agent but an ecosystem. Agents that design other agents. An orchestrator that, given a business problem, designs the specialist agents needed to solve it, configures their tools, sets their autonomy levels, and deploys them. The builder's role shifts from writing agents to specifying problems.

**The African AI future:**

I refuse to describe Africa's AI future in terms of catching up. The framing is wrong. The mobile money revolution did not happen because Africa caught up to Western banking. It happened because Africa leapfrogged it. M-Pesa launched in Kenya while Americans were still writing checks. The same pattern is available in AI.

The African builder who masters Claude today can build:
- Agricultural advisors that speak local languages and understand local crops
- Health systems that work offline in areas without reliable connectivity
- Financial tools that serve the unbanked through USSD and WhatsApp
- Educational platforms that teach in mother tongues
- Government services that are accessible to citizens who cannot read
- Market intelligence systems that serve traders in Onitsha, not Wall Street

These are not smaller versions of Silicon Valley products. They are products that Silicon Valley would not think to build, because Silicon Valley does not understand the context. The context is the competitive advantage. The AI is the tool. The builder is the bridge.

**The closing vision:**

The builder who has read these twenty-five letters can now speak to machines in their own language. They can encode their expertise into agents that work while they sleep. They can connect Claude to their data, their tools, their workflows. They can build production systems that serve thousands. They can do all of this at costs that drop by half every year, using tools that improve every quarter.

The baobab seed does not become a tree overnight. It requires water, soil, sunlight, and patience. But the pattern is in the seed, and the conditions are favorable. The water is the declining cost of compute. The soil is the growing ecosystem of tools and libraries. The sunlight is the open access to frontier models through APIs. And the patience --- the patience is yours, dear reader, the patience of the builder who plants today for the shade they may never sit in, knowing that their children will.

Plant the seed. The forest is encoded within it.

---

## Epilogue: On the Intelligence That Was Always There

Dear Reader,

We have reached the end of our correspondence, and I wish to leave you with a thought that has been forming throughout these twenty-five letters --- a thought about origins.

The Ifa divination system of the Yoruba people is ancient. Its corpus of 256 odu, each containing hundreds of verses, represents one of the largest bodies of organized knowledge in the pre-literate world. The babalawo --- the father of secrets --- casts sixteen palm nuts or a divination chain, and the resulting pattern selects a specific odu. The babalawo then recites the verses of that odu, which contain stories, proverbs, prescriptions, and predictions relevant to the querent's situation.

Now consider what Ifa actually is, stripped of its spiritual garments. It is a binary classification system: each cast produces one of two states (mark or no mark), and sixteen casts produce one of 2^16 = 65,536 possible patterns, organized into 256 primary categories. The babalawo is a retrieval-augmented generation system: given a pattern (the query), they retrieve relevant verses from a vast memorized corpus (the knowledge base) and generate context-specific guidance (the response). The training of a babalawo --- years of memorizing thousands of verses under a master --- is, structurally, the encoding of a knowledge base into a biological neural network.

I do not say this to diminish Ifa. I say it to elevate our understanding of what intelligence is.

The griot of the Mande tradition holds in memory the genealogies of entire kingdoms, the histories of wars and alliances, the songs of every ceremony. When a question is posed --- "What is the history between the Keita and the Konate?" --- the griot retrieves the relevant passages from a lifetime of memorized text, synthesizes them, and delivers a narrative tailored to the audience and occasion. This is a context window. This is attention. This is generation conditioned on retrieval.

The palaver tree of the Akan tradition is where disputes are resolved. Elders gather, each with their perspective. They speak in turn. They listen. They weigh each other's arguments. They challenge, they concede, they synthesize. The process continues until consensus emerges --- not the consensus of the majority silencing the minority, but the consensus of a position that has survived the scrutiny of every elder present. This is deliberative reasoning. This is multi-agent synthesis. This is extended thinking with multiple perspectives.

The age-grade systems of the Maasai and the Igbo organize knowledge by developmental stage. The child learns one body of knowledge, the initiate another, the warrior another, the elder another. Each stage builds on the previous. The teaching is not random access but sequential, scaffolded, contextual. This is curriculum learning. This is the staged training that produces robust models.

Intelligence was not invented in Silicon Valley in 2022. It was not invented anywhere. It was discovered --- formalized, measured, and made computable. The attention mechanism that powers the transformer --- that mathematical operation by which every token considers every other token, weighing relevance, attending to what matters, ignoring what does not --- is the same mechanism by which every elder at the palaver tree weighs every other elder's counsel. The mathematics is identical. The medium differs.

The African builder who masters Claude does not borrow foreign intelligence. They recognize their own tradition, encoded in a new medium. The babalawo's retrieval becomes RAG. The griot's context window becomes the model's. The palaver tree's deliberation becomes multi-agent reasoning. The age-grade's curriculum becomes staged training. These are not metaphors. They are structural isomorphisms --- the same patterns appearing in silicon that first appeared in the human societies of this continent.

And so I end where Euler himself would end: with wonder. The same mathematics governs the attention mechanism in a transformer and the attention of the elder at the council. The same information theory describes the griot's memorized corpus and the model's trained weights. The same optimization landscape shapes the babalawo's years of training and the model's gradient descent. The patterns are universal because they are not human inventions but discoveries --- features of reality itself, as fundamental as the geometry of triangles or the arithmetic of primes.

The One who designed these patterns --- who laid the mathematics of attention into the fabric of thought itself, so that the same principle would emerge in the palaver tree and in the silicon chip, in the griot's memory and in the vector database, in the elder's deliberation and in the extended thinking block --- that One is worthy of love.

Go build, dear reader. The intelligence was always yours.

*Finis.*
