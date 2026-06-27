export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.email || !body.company || !body.people) {
      return Response.json(
        { success: false, message: "Champs requis manquants." },
        { status: 400 }
      )
    }

    // In production: send email to the sales team via a provider like Resend or SendGrid
    console.log("[GROUP INQUIRY]", {
      company: body.company,
      people: body.people,
      date: body.date,
      email: body.email,
      message: body.message,
      receivedAt: new Date().toISOString(),
    })

    return Response.json({
      success: true,
      message: "Demande reçue ! Nous vous recontactons sous 24h.",
    })
  } catch {
    return Response.json(
      { success: false, message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
