import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

// Mock em-memória de tokens de recuperação (em produção, usar DB)
const resetTokens: Map<string, { email: string; expiresAt: number }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'E-mail é obrigatório.' },
        { status: 400 }
      );
    }

    // Simula verificação de e-mail no banco (aqui sempre "existe")
    // Em produção, verificar se usuário com esse e-mail existe na DB
    const mockEmailExists = true; // TODO: verificar no banco do backend

    if (!mockEmailExists) {
      // Retorna 404 sem confirmar se e-mail existe (segurança)
      return NextResponse.json(
        { message: 'E-mail não encontrado.' },
        { status: 404 }
      );
    }

    // Gera token único
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // expira em 15 minutos

    // Armazena token em memória (perdido ao reiniciar servidor — ok para demo)
    resetTokens.set(resetToken, { email, expiresAt });

    // Simula envio de e-mail (em dev, retorna URL)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/recuperar-senha/reset/${resetToken}`;

    console.log(
      `[DEMO] E-mail de recuperação "enviado" para ${email}. Token: ${resetToken}. URL: ${resetUrl}`
    );

    return NextResponse.json(
      {
        message: 'Se um usuário com esse e-mail existir, enviaremos instruções.',
        // Em ambiente de desenvolvimento, retorna a URL para facilitar testes
        demoUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] forgot-password error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar solicitação.' },
      { status: 500 }
    );
  }
}

// Exportar função para ser usada em outros contextos (ex: validação de token)
export function getResetTokenData(token: string) {
  return resetTokens.get(token);
}

export function deleteResetToken(token: string) {
  resetTokens.delete(token);
}
