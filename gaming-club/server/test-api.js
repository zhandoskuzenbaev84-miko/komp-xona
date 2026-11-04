import { calculateBookingSummary, calculateSingleStationPrice } from './src/services/pricingService.js';
import prisma from './src/config/db.js';

async function runTests() {
  console.log('🧪 Starting CyberClub Engine Verification Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. PC Pricing tests
  console.log('--- 1. PC Pricing Formulas ---');
  const pc1h = calculateSingleStationPrice('PC', 1);
  assert(pc1h.finalPrice === 10000, 'PC 1 hour is exactly 10,000 UZS');
  assert(pc1h.tieredDiscount === 0, 'PC 1 hour discount is 0');

  const pc2h = calculateSingleStationPrice('PC', 2);
  assert(pc2h.finalPrice === 17000, 'PC 2 hours block is exactly 17,000 UZS');
  assert(pc2h.tieredDiscount === 3000, 'PC 2 hours saves exactly 3,000 UZS');

  const pc3h = calculateSingleStationPrice('PC', 3);
  assert(pc3h.finalPrice === 27000, 'PC 3 hours (1 block of 2h + 1h) is 27,000 UZS');

  const pc4h = calculateSingleStationPrice('PC', 4);
  assert(pc4h.finalPrice === 34000, 'PC 4 hours (2 blocks of 2h) is 34,000 UZS');

  // 2. PS5 Pricing tests
  console.log('\n--- 2. PS5 Pricing Formulas ---');
  const ps1h = calculateSingleStationPrice('PS5', 1);
  assert(ps1h.finalPrice === 45000, 'PS5 1 hour is exactly 45,000 UZS');
  assert(ps1h.tieredDiscount === 0, 'PS5 1 hour discount is 0');

  const ps2h = calculateSingleStationPrice('PS5', 2);
  assert(ps2h.finalPrice === 80000, 'PS5 2 hours block is exactly 80,000 UZS');
  assert(ps2h.tieredDiscount === 10000, 'PS5 2 hours saves exactly 10,000 UZS');

  const ps3h = calculateSingleStationPrice('PS5', 3);
  assert(ps3h.finalPrice === 125000, 'PS5 3 hours (1 block of 2h + 1h) is 125,000 UZS');

  // 3. Bulk 5+ Stations Bonus Hour Perk
  console.log('\n--- 3. Bulk / Team Booking Rule (5+ Stations) ---');
  const fivePCs = Array(5).fill({ type: 'PC' });
  const bulkSummary = calculateBookingSummary(fivePCs, 2);
  assert(bulkSummary.stationCount === 5, 'Station count is 5');
  assert(bulkSummary.isBulkDiscountApplied === true, 'Bulk discount perk is applied');
  assert(bulkSummary.bonusHours === 1, 'Granted exactly +1 free bonus hour');
  assert(bulkSummary.totalDurationHours === 3, 'Total duration is 2h requested + 1h bonus = 3h');
  assert(bulkSummary.finalPrice === 5 * 17000, 'Client only pays for requested 2 hours (85,000 UZS)');

  // 4. Database Station Capacity
  console.log('\n--- 4. Database Verification (PC & PS5 Stations) ---');
  const allPCs = await prisma.station.findMany({ where: { type: 'PC' } });
  assert(allPCs.length === 50, `Exactly 50 PC units exist in database (found ${allPCs.length})`);
  assert(allPCs[0].code === 'PC-01' && allPCs[49].code === 'PC-50', 'PC units labeled PC-01 to PC-50');

  const allPS = await prisma.station.findMany({ where: { type: 'PS5' } });
  assert(allPS.length === 5, `Exactly 5 VIP PS5 rooms exist in database (found ${allPS.length})`);
  assert(allPS[0].code === 'PS-ROOM-1' && allPS[4].code === 'PS-ROOM-5', 'PS rooms labeled PS-ROOM-1 to PS-ROOM-5');

  // PS5 Amenities check
  for (const r of allPS) {
    const amenities = r.amenities || '';
    assert(
      amenities.includes('PlayStation 5 Console') &&
      amenities.includes('DualSense') &&
      amenities.includes('4K Display') &&
      amenities.includes('Air Conditioner') &&
      amenities.includes('Sofa Lounge'),
      `${r.code} contains all required amenities`
    );
  }

  // 5. Admin Verification
  console.log('\n--- 5. Admin Account ---');
  const admin = await prisma.admin.findUnique({ where: { email: 'admin@cyberclub.uz' } });
  assert(!!admin, 'Default admin account exists (admin@cyberclub.uz)');

  // 6. Games Catalog
  console.log('\n--- 6. Games Catalog ---');
  const gamesCount = await prisma.game.count();
  assert(gamesCount >= 20, `Installed games catalog pre-populated with 20+ titles (found ${gamesCount})`);

  console.log(`\n===========================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`===========================================`);

  await prisma.$disconnect();
  if (failed > 0) process.exit(1);
}

runTests();
