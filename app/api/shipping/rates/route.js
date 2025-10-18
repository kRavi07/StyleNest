import { NextResponse } from 'next/server';
import { ShippingRatesSchema } from '@/lib/validations';

// GET /api/shipping/rates - Get shipping rates for pin code
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pinCode = searchParams.get('pinCode');

    const validation = ShippingRatesSchema.safeParse({ pinCode });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Mock shipping rates based on pin code
    const shippingRates = calculateShippingRates(pinCode);

    return NextResponse.json({
      success: true,
      data: {
        pinCode,
        rates: shippingRates,
      }
    });
  } catch (error) {
    console.error('Shipping rates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipping rates' },
      { status: 500 }
    );
  }
}

function calculateShippingRates(pinCode) {
  const rates = [];

  // Standard delivery
  let standardRate = 80;
  let standardDays = '5-7';

  // Express delivery  
  let expressRate = 150;
  let expressDays = '2-3';

  // Area-specific adjustments
  if (pinCode.startsWith('110')) {
    // Delhi NCR
    standardRate = 50;
    standardDays = '3-5';
    expressRate = 100;
    expressDays = '1-2';
  } else if (pinCode.startsWith('400')) {
    // Mumbai
    standardRate = 60;
    standardDays = '4-6';
    expressRate = 120;
    expressDays = '1-2';
  }

  rates.push({
    type: 'standard',
    name: 'Standard Delivery',
    rate: standardRate,
    estimatedDays: standardDays,
    description: 'Regular delivery'
  });

  rates.push({
    type: 'express',
    name: 'Express Delivery',
    rate: expressRate,
    estimatedDays: expressDays,
    description: 'Fast delivery'
  });

  return rates;
}