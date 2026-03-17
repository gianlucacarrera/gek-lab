import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dayType, selectedFoods, score } = body;

    const dayTypeLabel = dayType?.label ?? 'Giorno';
    const severityWeight = dayType?.severityWeight ?? 1;

    // Format foods with their status for the prompt
    const foodsDescription = Array.isArray(selectedFoods)
      ? selectedFoods
          .map((f: { food: string; status: string }) => `${f.food} (${f.status})`)
          .join(', ')
      : '';

    const client = new Anthropic();

    let instruction = '';
    if (score < 3) {
      instruction = 'Scrivi 2 righe che spiegano cosa ha influenzato il punteggio (cita l\'alimento specifico) e una frase che inizia con "Domani prova a…"';
    } else if (score >= 4) {
      instruction = 'Scrivi 2 righe di rinforzo positivo, nessun consiglio.';
    } else {
      instruction = 'Scrivi 2 righe neutre, un piccolo suggerimento per domani.';
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      temperature: 0.3,
      system: 'Sei un coach nutrizionale gentile. Rispondi sempre in italiano. Il tono è caldo, diretto, mai giudicante. Mai usare il termine \'punti\'. Rispondi SOLO con il testo del commento, senza prefissi, etichette o formattazione.',
      messages: [{
        role: 'user',
        content: `Giorno: ${dayTypeLabel} (peso severità: ${severityWeight})
Alimenti consumati: ${foodsDescription}
Punteggio: ${score}/5

${instruction}`,
      }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response' }, { status: 500 });
    }

    return NextResponse.json({ comment: textBlock.text.trim() });
  } catch (error) {
    console.error('Alimentazione API error:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione del commento' },
      { status: 500 }
    );
  }
}
