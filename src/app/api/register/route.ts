import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 檢查電子郵件是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '此電子郵件已被註冊' },
        { status: 400 }
      );
    }

    // 創建新用戶
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    return NextResponse.json(
      { message: '註冊成功', user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { message: '註冊時發生錯誤' },
      { status: 500 }
    );
  }
} 