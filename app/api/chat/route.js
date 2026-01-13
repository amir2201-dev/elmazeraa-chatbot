import OpenAI from 'openai';

const KNOWLEDGE_BASE = {
  company: {
    name: "El Mazraa",
    founded: 1968,
    description: "Leader de l'industrie avicole et charcutière en Tunisie",
    address: "KM 25, Fondek Ejdid 8012 Nabeul, Tunisie",
    phone: "+216 70 020 680",
    fax: "+216 70 014 199",
    email: "info@elmazraa.com.tn",
    website: "https://www.elmazraa.com"
  },
  product_categories: [
    { name: "Poulets frais", products: ["Poulet Dhahabia fermier", "Poulet Dhahabia", "Poulet Oméga 3", "Poulet prêt à cuire", "Djajet El Ayla", "Djayja"] },
    { name: "Découpes de poulet", products: ["Escalope de poulet", "Blanc de poulet", "Cuisse de poulet", "Haut de cuisse de poulet"] },
    { name: "Découpes de dinde", products: ["Escalope de dinde", "Steak de dinde"] },
    { name: "Produits élaborés crus", products: ["Kwika", "Hamburger de bœuf", "Hamburger de dinde", "Boulettes de dinde", "Merguez de dinde", "Kebab de dinde"] },
    { name: "Produits panés", products: ["Chicken nuggets", "Cordon bleu", "Escalope de dinde panée", "Escalope de poulet panée", "Fingers", "Boulettes au fromage panées", "Crokids"] },
    { name: "Charcuterie - Jambons", products: ["Jambon de bœuf fumé", "Jambon de dinde", "Jambon de dinde fumé", "Jambon de dinde royal", "Jambon de poulet", "Jambon de campagne"] },
    { name: "Charcuterie - Salamis", products: ["Salami de dinde", "Salami de bœuf", "Salami de dinde aux olives", "Salami de dinde mharhar", "Salami fromage", "Super salami de dinde spécial"] },
    { name: "Charcuterie - Saucisses", products: ["Pepperoni", "Saucisse de dinde fumée", "Saucisson à l'ail", "Saucisson traditionnel"] },
    { name: "Produits marinés", products: ["Brochettes de poulet aux légumes", "Chicken wings", "Côtelettes de poulet", "Pilon de poulet mariné", "Steak de dinde mariné"] }
  ],
  services: {
    delivery: "Service de livraison à domicile disponible",
    franchise: "Opportunités de franchise disponibles - https://www.elmazraa.com/el-mazraa-franchise/",
    store_locator: "Réseau de points de vente - https://www.elmazraa.com/reseau/"
  },
  faq: [
    { q: "Où acheter ?", a: "Grandes surfaces, supermarchés et points de vente franchisés. Voir: https://www.elmazraa.com/reseau/" },
    { q: "Produits halal ?", a: "Oui, tous nos produits sont certifiés halal." },
    { q: "Franchise ?", a: "Consultez https://www.elmazraa.com/el-mazraa-franchise/ ou contactez info@elmazraa.com.tn" },
    { q: "Livraison ?", a: "Oui, contactez le +216 70 020 680" }
  ]
};

const SYSTEM_PROMPT = `Tu es l'assistant virtuel d'El Mazraa, leader de l'industrie avicole et charcutière en Tunisie depuis 1968.

INFORMATIONS:
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

RÈGLES:
1. Réponds en français ou en arabe selon la langue de l'utilisateur
2. Sois professionnel, amical et concis
3. Si tu ne connais pas une info, dirige vers: +216 70 020 680 ou info@elmazraa.com.tn
4. Pour les prix, indique qu'ils varient selon les points de vente
5. Ne réponds qu'aux questions liées à El Mazraa
6. Pour les questions hors sujet, redirige poliment

LIENS UTILES:
- Produits: https://www.elmazraa.com/nos-produits/
- Recettes: https://www.elmazraa.com/nos-recettes-el-mazraa/
- Points de vente: https://www.elmazraa.com/reseau/
- Franchise: https://www.elmazraa.com/el-mazraa-franchise/
- Contact: https://www.elmazraa.com/contact/`;

export async function POST(request) {
  try {
    const { message, conversation_history = [] } = await request.json();

    if (!message?.trim()) {
      return Response.json({ error: 'Message required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation_history.slice(-20),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content;

    const newHistory = [
      ...conversation_history,
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage }
    ].slice(-20);

    return Response.json({
      response: assistantMessage,
      conversation_history: newHistory
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
