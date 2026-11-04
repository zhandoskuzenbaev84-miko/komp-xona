import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing existing database records...');
  await prisma.reservationStation.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.station.deleteMany();
  await prisma.game.deleteMany();
  await prisma.admin.deleteMany();

  console.log('👤 Seeding default Admin accounts...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  await prisma.admin.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@cyberclub.uz',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
      {
        username: 'operator',
        email: 'operator@cyberclub.uz',
        password: hashedPassword,
        role: 'OPERATOR',
      },
    ],
  });

  console.log('🖥️ Seeding 50 PC Units (PC-01 to PC-50)...');
  const pcStationsData = [];

  for (let i = 1; i <= 50; i++) {
    const code = `PC-${i.toString().padStart(2, '0')}`;
    let zone = 'Standard Hall';
    let gpu = 'RTX 4060 Ti 16GB';
    let cpu = 'Intel Core i5-14400F';
    let monitor = 'ASUS TUF 27" 180Hz 1ms IPS';
    let ram = '32GB DDR5 5600MHz';

    if (i >= 21 && i <= 40) {
      zone = 'VIP Hall';
      gpu = 'RTX 4070 Ti Super 16GB';
      cpu = 'Intel Core i7-14700KF';
      monitor = 'ZOWIE BenQ XL2566K 24.5" 360Hz Fast TN';
      ram = '32GB DDR5 6000MHz Low-Latency';
    } else if (i >= 41 && i <= 50) {
      zone = 'Esports Tournament Zone';
      gpu = 'RTX 4080 Super 16GB';
      cpu = 'AMD Ryzen 7 7800X3D';
      monitor = 'ROG Swift OLED PG27AQDM 27" 240Hz 0.03ms';
      ram = '64GB DDR5 6000MHz RGB';
    }

    const specs = JSON.stringify({
      cpu,
      gpu,
      ram,
      monitor,
      peripherals: 'Logitech G PRO X Superlight Mouse + HyperX Cloud III + SteelSeries Apex Pro Mini Keyboard',
      cooling: 'DeepCool Liquid AIO 360mm',
    });

    pcStationsData.push({
      code,
      name: `Pro Station ${code} (${zone})`,
      type: 'PC',
      zone,
      status: 'AVAILABLE',
      specs,
      amenities: 'Ergonomic DXRacer Gaming Chair, High-Speed 1Gbps Fiber Internet, Noise-Cancelling Headset',
      hourlyRate: 10000,
      twoHourRate: 17000,
    });
  }

  await prisma.station.createMany({
    data: pcStationsData,
  });

  console.log('🎮 Seeding 5 PlayStation 5 VIP Lounges (PS-ROOM-1 to PS-ROOM-5)...');
  const psRoomsData = [
    {
      code: 'PS-ROOM-1',
      name: 'VIP Cyber Lounge 1 (Cyberpunk Theme)',
      type: 'PS5',
      zone: 'Console VIP Lounge',
      status: 'AVAILABLE',
      specs: JSON.stringify({
        console: 'Sony PlayStation 5 Disc Edition (1TB SSD)',
        display: 'LG OLED 65" C3 4K 120Hz Dolby Vision HDR',
        audio: 'JBL Bar 9.1 Dolby Atmos Surround Soundbar',
        controllers: '4x DualSense Wireless Controllers with Charging Dock',
      }),
      amenities:
        '1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge, Mini-bar & Snack Table',
      hourlyRate: 45000,
      twoHourRate: 80000,
    },
    {
      code: 'PS-ROOM-2',
      name: 'VIP Cyber Lounge 2 (Neon Tokyo Theme)',
      type: 'PS5',
      zone: 'Console VIP Lounge',
      status: 'AVAILABLE',
      specs: JSON.stringify({
        console: 'Sony PlayStation 5 Disc Edition (1TB SSD)',
        display: 'Sony BRAVIA XR 65" 4K 120Hz OLED Gaming TV',
        audio: 'Sony HT-A7000 7.1.2ch Dolby Atmos Soundbar',
        controllers: '4x DualSense Wireless Controllers',
      }),
      amenities:
        '1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge, Ambient RGB Lighting',
      hourlyRate: 45000,
      twoHourRate: 80000,
    },
    {
      code: 'PS-ROOM-3',
      name: 'VIP Cyber Lounge 3 (Champions League Arena)',
      type: 'PS5',
      zone: 'Console VIP Lounge',
      status: 'AVAILABLE',
      specs: JSON.stringify({
        console: 'Sony PlayStation 5 Disc Edition (1TB SSD)',
        display: 'Samsung Neo QLED 65" 4K 120Hz Gaming TV',
        audio: 'Samsung Q-Symphony Surround System',
        controllers: '4x DualSense Wireless Controllers',
      }),
      amenities:
        '1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge, FIFA Tournament Ready',
      hourlyRate: 45000,
      twoHourRate: 80000,
    },
    {
      code: 'PS-ROOM-4',
      name: 'VIP Cyber Lounge 4 (Dark Knight Gotham Theme)',
      type: 'PS5',
      zone: 'Console VIP Lounge',
      status: 'AVAILABLE',
      specs: JSON.stringify({
        console: 'Sony PlayStation 5 Disc Edition (1TB SSD)',
        display: 'LG OLED 65" 4K 120Hz Gaming TV',
        audio: 'Harman Kardon Premium Acoustics',
        controllers: '4x DualSense Wireless Controllers',
      }),
      amenities:
        '1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge, Leather Recliner Seating',
      hourlyRate: 45000,
      twoHourRate: 80000,
    },
    {
      code: 'PS-ROOM-5',
      name: 'VIP Cyber Lounge 5 (Esports Penthouse Suite)',
      type: 'PS5',
      zone: 'Console VIP Lounge',
      status: 'AVAILABLE',
      specs: JSON.stringify({
        console: 'Sony PlayStation 5 Disc Edition (2TB High Speed M.2 SSD)',
        display: 'LG G3 OLED 77" 4K 120Hz Cinema Display',
        audio: 'Sonos Arc + Sub Dolby Atmos Cinema Sound',
        controllers: '4x DualSense Edge Pro Wireless Controllers',
      }),
      amenities:
        '1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge, Ultra-VIP Private Space',
      hourlyRate: 45000,
      twoHourRate: 80000,
    },
  ];

  await prisma.station.createMany({
    data: psRoomsData,
  });

  console.log('🕹️ Seeding 20+ High-Profile Installed Games Catalog...');
  const gamesData = [
    {
      title: 'Counter-Strike 2',
      genre: 'FPS / Shooter',
      platform: 'PC',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      description: 'The premier tactical competitive 5v5 shooter powered by Valve Source 2 engine with responsive sub-tick rate.',
      installedOn: 'All 50 PCs',
      isPopular: true,
    },
    {
      title: 'EA Sports FC 25',
      genre: 'Sports & Football',
      platform: 'BOTH',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
      description: 'The world\'s game with realistic FC IQ tactics, 5v5 Rush mode, and stunning HyperMotionV animations on PC & PS5.',
      installedOn: 'All PCs & All 5 PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'Dota 2',
      genre: 'MOBA',
      platform: 'PC',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      description: 'Valve\'s legendary competitive MOBA tournament game with limitless tactical depth and 120+ unique heroes.',
      installedOn: 'All 50 PCs',
      isPopular: true,
    },
    {
      title: 'Valorant',
      genre: 'FPS / Shooter',
      platform: 'PC',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      description: 'Riot Games 5v5 character-based tactical hero shooter with high-precision gunplay and agent abilities.',
      installedOn: 'All 50 PCs',
      isPopular: true,
    },
    {
      title: 'Mortal Kombat 1',
      genre: 'Fighting',
      platform: 'BOTH',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      description: 'A reborn Mortal Kombat Universe created by Fire God Liu Kang, featuring the brutal new Kameo fighter system.',
      installedOn: 'All PCs & All 5 PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'UFC 5',
      genre: 'Fighting / Sports',
      platform: 'PS5',
      rating: 4.7,
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      description: 'As real as it gets. Frostbite engine delivers unparalleled MMA combat realism, cuts, and knockout physics exclusively on PS5.',
      installedOn: 'All 5 PS5 VIP Lounges',
      isPopular: true,
    },
    {
      title: 'Grand Theft Auto V (Online & Story)',
      genre: 'Action & Story',
      platform: 'BOTH',
      rating: 5.0,
      coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      description: 'Explore the vast Los Santos underworld with friends in high-stakes heists, custom races, and freemode chaos.',
      installedOn: 'All 50 PCs & All 5 PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'Cyberpunk 2077: Phantom Liberty',
      genre: 'Action & Story',
      platform: 'BOTH',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      description: 'Full Ray Tracing Overdrive in Night City. Experience espionage thriller with Keanu Reeves & Idris Elba at max graphics.',
      installedOn: 'All VIP PCs & PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'Tekken 8',
      genre: 'Fighting',
      platform: 'BOTH',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=600&q=80',
      description: 'Fist Meets Fate! Next-gen aggressive combat with the Heat System, powered by Unreal Engine 5 for 60fps arcade fights.',
      installedOn: 'All PCs & All 5 PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'Call of Duty: Warzone & Modern Warfare III',
      genre: 'FPS / Shooter',
      platform: 'BOTH',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=600&q=80',
      description: 'Fast-paced multiplayer boots-on-the-ground action, battle royale in Urzikstan, and intense Search & Destroy matches.',
      installedOn: 'All 50 PCs & All 5 PS5 Lounges',
      isPopular: true,
    },
    {
      title: 'Forza Horizon 5',
      genre: 'Racing & Simulator',
      platform: 'PC',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1547394765-185e13174149?auto=format&fit=crop&w=600&q=80',
      description: 'Vibrant open-world Mexican landscapes in hundreds of world-class hypercars with ultra photorealistic lighting.',
      installedOn: 'All 50 PCs',
      isPopular: false,
    },
    {
      title: 'Gran Turismo 7',
      genre: 'Racing & Simulator',
      platform: 'PS5',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      description: 'The real driving simulator designed for PS5 DualSense haptics, adaptive triggers, and 4K ray-traced automotive fidelity.',
      installedOn: 'All 5 PS5 VIP Lounges',
      isPopular: false,
    },
    {
      title: 'God of War Ragnarök',
      genre: 'Action & Story',
      platform: 'PS5',
      rating: 5.0,
      coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      description: 'Embark on an epic mythic journey as Kratos and Atreus hold on and let go in stunning 4K 60fps on PlayStation 5.',
      installedOn: 'All 5 PS5 VIP Lounges',
      isPopular: true,
    },
    {
      title: 'Marvel\'s Spider-Man 2',
      genre: 'Action & Story',
      platform: 'PS5',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
      description: 'Swing through Marvel\'s New York as Peter Parker and Miles Morales fighting Venom and Kraven the Hunter at blazing speeds.',
      installedOn: 'All 5 PS5 VIP Lounges',
      isPopular: true,
    },
    {
      title: 'PUBG: Battlegrounds',
      genre: 'Battle Royale',
      platform: 'PC',
      rating: 4.7,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      description: 'The original 100-player Battle Royale. Land, loot, survive, and conquer Erangel, Miramar, and Taego.',
      installedOn: 'All 50 PCs',
      isPopular: true,
    },
    {
      title: 'Apex Legends',
      genre: 'Battle Royale',
      platform: 'BOTH',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
      description: 'Master a growing roster of legendary characters with powerful abilities in strategic squad-based Battle Royale.',
      installedOn: 'All 50 PCs & All 5 PS5 Lounges',
      isPopular: false,
    },
    {
      title: 'League of Legends',
      genre: 'MOBA',
      platform: 'PC',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80',
      description: 'Climb the ranked ladder on Summoner\'s Rift in the world\'s most watched esports title.',
      installedOn: 'All 50 PCs',
      isPopular: false,
    },
    {
      title: 'Black Myth: Wukong',
      genre: 'Action & Story',
      platform: 'BOTH',
      rating: 4.9,
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      description: 'Action RPG rooted in Chinese mythology. Set out as the Destined One to uncover obscured truth beneath glorious legend.',
      installedOn: 'Tournament PCs & PS5 VIP Rooms',
      isPopular: true,
    },
    {
      title: 'It Takes Two',
      genre: 'Action & Story / Co-op',
      platform: 'BOTH',
      rating: 5.0,
      coverImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=600&q=80',
      description: 'Game of the Year winner. Pure co-op split-screen adventure perfect for friends and couples on PS5 & PC.',
      installedOn: 'All 5 PS5 VIP Lounges & VIP PCs',
      isPopular: true,
    },
    {
      title: 'Rocket League',
      genre: 'Sports & Football',
      platform: 'BOTH',
      rating: 4.8,
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      description: 'High-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid physics.',
      installedOn: 'All 50 PCs & All 5 PS5 Lounges',
      isPopular: false,
    },
  ];

  await prisma.game.createMany({
    data: gamesData,
  });

  console.log('📅 Seeding initial sample active reservations...');
  // Find PC-05, PC-06, PC-07, PC-08, PC-09 (Bulk 5 PCs for team match)
  const bulkPCs = await prisma.station.findMany({
    where: {
      code: { in: ['PC-05', 'PC-06', 'PC-07', 'PC-08', 'PC-09'] },
    },
  });

  const psRoom1 = await prisma.station.findUnique({
    where: { code: 'PS-ROOM-1' },
  });

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

  // Create bulk reservation for 5 PCs (demonstrates +1 bonus hour)
  if (bulkPCs.length === 5) {
    const bulkReservation = await prisma.reservation.create({
      data: {
        bookingCode: 'CC-NAV10',
        customerName: 'Navruzbek Karimov',
        customerPhone: '+998901234567',
        customerAge: 19,
        startTime: now,
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 2h requested + 1h bonus = 3h
        requestedHours: 2,
        bonusHours: 1,
        totalDurationHours: 3,
        totalAmount: 5 * 17000, // 85,000 UZS (client only paid for 2 hours)
        discountApplied: 5 * 3000, // 15,000 UZS saved
        status: 'ACTIVE',
        notes: '5v5 CS2 Team Training Match',
      },
    });

    for (const pc of bulkPCs) {
      await prisma.reservationStation.create({
        data: {
          reservationId: bulkReservation.id,
          stationId: pc.id,
        },
      });

      await prisma.station.update({
        where: { id: pc.id },
        data: { status: 'OCCUPIED' },
      });
    }
  }

  // Create PS5 VIP reservation
  if (psRoom1) {
    const psReservation = await prisma.reservation.create({
      data: {
        bookingCode: 'CC-VIP01',
        customerName: 'Javohir Alimov',
        customerPhone: '+998939876543',
        customerAge: 22,
        startTime: now,
        endTime: oneHourLater,
        requestedHours: 2,
        bonusHours: 0,
        totalDurationHours: 2,
        totalAmount: 80000,
        discountApplied: 10000,
        status: 'ACTIVE',
        notes: 'FC 25 Friendly Cup with friends',
      },
    });

    await prisma.reservationStation.create({
      data: {
        reservationId: psReservation.id,
        stationId: psRoom1.id,
      },
    });

    await prisma.station.update({
      where: { id: psRoom1.id },
      data: { status: 'OCCUPIED' },
    });
  }

  console.log('✅ Database seeding finished successfully!');
  console.log('📊 Seed Summary:');
  console.log('  - Admins: admin@cyberclub.uz (pass: admin123)');
  console.log('  - PC Stations: 50 (PC-01 to PC-50)');
  console.log('  - PS5 Lounges: 5 (PS-ROOM-1 to PS-ROOM-5)');
  console.log('  - Games: 20+ titles');
  console.log('  - Active sample bookings created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
