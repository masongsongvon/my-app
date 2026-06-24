import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'

const ALLOWED_BASE = join(homedir(), 'Documents', 'Daily Devotion Co photos')

export async function GET(req: NextRequest) {
  const rawPath = req.nextUrl.searchParams.get('path')
  if (!rawPath) return new NextResponse('Missing path', { status: 400 })

  const decoded = decodeURIComponent(rawPath)

  // Security: only allow files inside the allowed base directory
  if (!decoded.startsWith(ALLOWED_BASE)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const buffer = await readFile(decoded)
    const ext = decoded.toLowerCase().match(/\.[^.]+$/)?.[0] ?? '.jpg'
    const contentType =
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      ext === '.gif' ? 'image/gif' :
      'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('File not found', { status: 404 })
  }
}
