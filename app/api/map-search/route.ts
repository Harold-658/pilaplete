import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const q = searchParams.get('q');

        const response = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q || '')}&limit=5`);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error querying from API:', error);
        return NextResponse.json({ error: 'Error occurred!' }, { status: 500 });
    }
}