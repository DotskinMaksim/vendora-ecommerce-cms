// src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const products = await prisma.product.findMany()
        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}