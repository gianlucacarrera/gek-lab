import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const RESTRICTED_GROUPS_PROMPT = `I tre gruppi alimentari in rotazione per questo paziente sono:

1. FRUMENTO E GLUTINE (id: "wheat"): Frumento, pane, pasta di frumento, pizza, farro, kamut, orzo, segale, spelta, bulgur, cous cous, seitan, grissini, fette biscottate, biscotti di frumento, dolci con farina di frumento, brioche, crusca, semolino, impanature, caffè d'orzo, whisky, e qualsiasi prodotto che contenga farina di frumento o glutine.

2. LIEVITI E FERMENTATI (id: "yeasts"): Prodotti lievitati da forno, formaggi (tutti i tipi, inclusi parmigiano, mozzarella, ricotta), yogurt, tofu, tempeh, miso, salsa di soia, funghi, miele, aceto, vino, birra, frutta essiccata, conserve sott'olio e sott'aceto, maionese industriale, dadi da brodo, tè fermentati, e qualsiasi prodotto fermentato.

3. NICHEL SOLFATO (id: "nickel"): Spinaci, pomodoro, asparagi, cioccolato, cacao, lenticchie, avena, mais, kiwi, pera, uva passa, prugne, ostriche, aringhe, cibi in scatola, mandorle, nocciole, arachidi, pistacchi, noci, semi di girasole, semi di lino, margarine, funghi, sesamo.`;

export async function POST(request: NextRequest) {
  try {
    const { food } = await request.json();

    if (!food || typeof food !== 'string') {
      return NextResponse.json({ error: 'Missing food parameter' }, { status: 400 });
    }

    const client = new Anthropic();

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0,
      system: `Sei un esperto di nutrizione italiana. Il tuo compito è classificare piatti e alimenti rispetto ai gruppi alimentari in rotazione del paziente.

${RESTRICTED_GROUPS_PROMPT}

Analizza il piatto o alimento fornito. Identifica gli ingredienti tipici e verifica se QUALCUNO di essi appartiene a uno dei tre gruppi ristretti.

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido, senza markdown, senza commenti:
{
  "status": "excluded" | "limited" | "allowed",
  "groups": ["wheat", "yeasts", "nickel"],
  "reason": "Breve spiegazione in italiano di quali ingredienti problematici contiene"
}

Regole:
- "excluded" se contiene ingredienti di QUALSIASI gruppo ristretto
- "limited" se contiene tracce minime o ingredienti ambigui
- "allowed" se non contiene ingredienti dei gruppi ristretti
- "groups" elenca solo i gruppi effettivamente presenti (array vuoto se allowed)
- "reason" è una frase breve e chiara in italiano`,
      messages: [{
        role: 'user',
        content: food,
      }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response' }, { status: 500 });
    }

    // Parse the JSON response
    const parsed = JSON.parse(textBlock.text.trim());

    return NextResponse.json({
      food,
      status: parsed.status ?? 'allowed',
      groups: parsed.groups ?? [],
      reason: parsed.reason ?? '',
    });
  } catch (error) {
    console.error('Food classification error:', error);
    return NextResponse.json(
      { error: 'Classification failed' },
      { status: 500 }
    );
  }
}
