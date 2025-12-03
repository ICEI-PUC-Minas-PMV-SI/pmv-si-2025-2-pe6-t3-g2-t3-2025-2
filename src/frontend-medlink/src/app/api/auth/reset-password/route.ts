import { NextRequest, NextResponse } from "next/server";
import { getResetTokenData, deleteResetToken } from "../forgot-password/route";
import { randomUUID } from "node:crypto";

// Mock em-memória de redefinições de senha (em produção, atualizar no DB)
const passwordResets: Map<string, { email: string; newPassword: string; timestamp: number }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: 'Token é obrigatório.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { message: 'Senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    // Valida token
    const tokenData = getResetTokenData(token);

    if (!tokenData) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 400 }
      );
    }

    // Verifica expiração
    if (tokenData.expiresAt < Date.now()) {
      deleteResetToken(token);
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 400 }
      );
    }

    // Simula atualização de senha no banco (aqui apenas armazenamos em memória)
    const resetId = randomUUID();
    passwordResets.set(resetId, {
      email: tokenData.email,
      newPassword: password, // Em produção: hash com bcrypt
      timestamp: Date.now(),
    });

    // Remove token após uso
    deleteResetToken(token);

    console.log(
      `[DEMO] Senha redefinida para ${tokenData.email}. Nova senha armazenada em memória (para testes).`
    );

    return NextResponse.json(
      {
        message: 'Senha redefinida com sucesso!',
        // Em desenvolvimento, retorna confirmação
        demoResetId: process.env.NODE_ENV === 'development' ? resetId : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] reset-password error:', error);
    return NextResponse.json(
      { message: 'Erro ao redefinir senha.' },
      { status: 500 }
    );
  }
}

// Função para validar tokens (usada internamente)
export function getPasswordResetData(resetId: string) {
  return passwordResets.get(resetId);
}
